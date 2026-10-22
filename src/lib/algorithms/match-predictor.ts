import { Player, SectorRatings, TacticalLineup } from "@/types/hattrick";
import {
  SupportedFormation,
  SupportedTactic,
  SupportedAttitude,
  generateAutoLineup,
} from "./lineup";

export interface SectorMatchupDetail {
  sector: string;
  category: "MIDFIELD" | "OUR_ATTACK" | "OUR_DEFENSE";
  homeValue: number;
  awayValue: number;
  conversionProb: number; // 0-100%
  advantage: "HOME" | "AWAY" | "EQUAL";
}

export interface ScorelineProbability {
  homeGoals: number;
  awayGoals: number;
  label: string;
  probability: number; // percentage e.g. 15.4
}

export interface MatchSimulationResult {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  expectedHomeGoals: number;
  expectedAwayGoals: number;
  homeExpectedPoints: number;
  awayExpectedPoints: number;
  homePossession: number;
  awayPossession: number;
  cleanSheetHomeProb: number;
  cleanSheetAwayProb: number;
  bttsProb: number; // Both teams to score %
  over25Prob: number; // Over 2.5 goals %
  topScorelines: ScorelineProbability[];
  sectorComparison: SectorMatchupDetail[];
}

export interface AIMatchTacticOption {
  formation: SupportedFormation;
  tactic: SupportedTactic;
  attitude: SupportedAttitude;
  lineup: TacticalLineup;
  winProb: number;
  drawProb: number;
  lossProb: number;
  expectedGoalsFor: number;
  expectedGoalsAgainst: number;
  expectedPoints: number;
  keyReason: string;
}

export interface AIMatchAnalysisReport {
  bestOption: AIMatchTacticOption;
  alternatives: AIMatchTacticOption[];
  opponentWeakestDefSector: string;
  opponentStrongestAttSector: string;
  midfieldVerdict: string;
  tacticalSummary: string[];
}

export interface LiveMatchEvent {
  minute: number;
  type:
    | "KICKOFF"
    | "GOAL"
    | "CHANCE_SAVED"
    | "CHANCE_MISSED"
    | "SPECIAL_EVENT_GOAL"
    | "COUNTER_ATTACK"
    | "YELLOW_CARD"
    | "SUBSTITUTION"
    | "HALFTIME"
    | "FULLTIME";
  team: "HOME" | "AWAY" | "NEUTRAL";
  sector: "CENTER" | "LEFT" | "RIGHT" | "SET_PIECE" | "SPECIAL";
  playerName?: string;
  title: string;
  commentary: string;
  homeScore: number;
  awayScore: number;
  homeXG: number;
  awayXG: number;
  ballX: number; // 0-100%
  ballY: number; // 0-100%
}

export interface AdvancedMatchTelemetry {
  homeShots: number;
  awayShots: number;
  homeShotsOnTarget: number;
  awayShotsOnTarget: number;
  homeBigChances: number;
  awayBigChances: number;
  homeCorners: number;
  awayCorners: number;
  homePassAccuracy: number;
  awayPassAccuracy: number;
  homeDuelsWon: number;
  awayDuelsWon: number;
  homeFieldTilt: number;
  awayFieldTilt: number;
  momentumBy15Min: { period: string; homeMomentum: number; awayMomentum: number }[];
}

/**
 * Simulates Hattrick match outcome based on sector ratings and tactics
 */
export function simulateMatch(
  home: SectorRatings,
  away: SectorRatings,
  homeTactic: SupportedTactic = "Normal",
  awayTactic: SupportedTactic = "Normal",
  homeAdvantage: boolean = true
): MatchSimulationResult {
  // 1. Midfield determines ball possession (with optional home crowd boost ~6%)
  const effHomeMid = homeAdvantage ? home.midfield * 1.05 : home.midfield;
  const effAwayMid = away.midfield;

  const homeMidExp = Math.pow(Math.max(5, effHomeMid), 3);
  const awayMidExp = Math.pow(Math.max(5, effAwayMid), 3);
  const homePossession = Math.min(
    90,
    Math.max(10, Math.round((homeMidExp / (homeMidExp + awayMidExp)) * 100))
  );
  const awayPossession = 100 - homePossession;

  // Base Hattrick chances (~11 regular + special chances per match)
  let homeChances = (homePossession / 100) * 10.5;
  let awayChances = (awayPossession / 100) * 10.5;

  // Probability to convert a chance in a sector = Att^3 / (Att^3 + OppDef^3) * 0.82
  const calcGoalProb = (att: number, def: number) => {
    const a = Math.pow(Math.max(1, att), 2.85);
    const d = Math.pow(Math.max(1, def), 2.85);
    return (a / (a + d)) * 0.82;
  };

  const homeLeftGoalProb = calcGoalProb(home.leftAtt, away.rightDef);
  const homeMidGoalProb = calcGoalProb(home.midAtt, away.midDef);
  const homeRightGoalProb = calcGoalProb(home.rightAtt, away.leftDef);

  const awayLeftGoalProb = calcGoalProb(away.leftAtt, home.rightDef);
  const awayMidGoalProb = calcGoalProb(away.midAtt, home.midDef);
  const awayRightGoalProb = calcGoalProb(away.rightAtt, home.leftDef);

  // Sector weights based on tactic
  const getWeights = (tactic: SupportedTactic) => {
    if (tactic === "Kanatlardan Hücum") return { left: 0.36, mid: 0.28, right: 0.36 };
    if (tactic === "Ortadan Hücum") return { left: 0.17, mid: 0.66, right: 0.17 };
    return { left: 0.26, mid: 0.48, right: 0.26 };
  };

  const hW = getWeights(homeTactic);
  const aW = getWeights(awayTactic);

  const homeConversionRate =
    hW.left * homeLeftGoalProb +
    hW.mid * homeMidGoalProb +
    hW.right * homeRightGoalProb;
  const awayConversionRate =
    aW.left * awayLeftGoalProb +
    aW.mid * awayMidGoalProb +
    aW.right * awayRightGoalProb;

  // Counter-Attack bonus if team has < 48% possession and strong defense
  if (homeTactic === "Kontra Atak" && homePossession < 50) {
    const missedByAway = awayChances * (1 - awayConversionRate);
    homeChances += missedByAway * 0.28;
  }
  if (awayTactic === "Kontra Atak" && awayPossession < 50) {
    const missedByHome = homeChances * (1 - homeConversionRate);
    awayChances += missedByHome * 0.28;
  }

  const homeExpectedGoals = Math.max(0.15, homeChances * homeConversionRate);
  const awayExpectedGoals = Math.max(0.15, awayChances * awayConversionRate);

  // Exact bivariate Poisson distribution across 0..9 goals
  const poisson = (lambda: number, k: number) => {
    let p = Math.exp(-lambda);
    for (let i = 1; i <= k; i++) {
      p *= lambda / i;
    }
    return p;
  };

  let homeWins = 0;
  let draws = 0;
  let awayWins = 0;
  let btts = 0;
  let over25 = 0;
  const scorelines: ScorelineProbability[] = [];

  const maxGoals = 9;
  for (let h = 0; h <= maxGoals; h++) {
    const pH = poisson(homeExpectedGoals, h);
    for (let a = 0; a <= maxGoals; a++) {
      const pA = poisson(awayExpectedGoals, a);
      const prob = pH * pA;

      if (h > a) homeWins += prob;
      else if (h === a) draws += prob;
      else awayWins += prob;

      if (h > 0 && a > 0) btts += prob;
      if (h + a >= 3) over25 += prob;

      if (h <= 5 && a <= 5) {
        scorelines.push({
          homeGoals: h,
          awayGoals: a,
          label: `${h} - ${a}`,
          probability: Math.round(prob * 1000) / 10,
        });
      }
    }
  }

  const total = homeWins + draws + awayWins || 1;
  const homeWinProb = Math.round((homeWins / total) * 100);
  const drawProb = Math.round((draws / total) * 100);
  const awayWinProb = Math.max(0, 100 - homeWinProb - drawProb);

  const cleanSheetHomeProb = Math.round(poisson(awayExpectedGoals, 0) * 100);
  const cleanSheetAwayProb = Math.round(poisson(homeExpectedGoals, 0) * 100);

  const topScorelines = scorelines
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 6);

  const sectorComparison: SectorMatchupDetail[] = [
    {
      sector: "Orta Saha (Topa Sahip Olma)",
      category: "MIDFIELD",
      homeValue: home.midfield,
      awayValue: away.midfield,
      conversionProb: homePossession,
      advantage:
        home.midfield > away.midfield
          ? "HOME"
          : home.midfield < away.midfield
          ? "AWAY"
          : "EQUAL",
    },
    {
      sector: "Sol Hücum vs Rakip Sağ Defans",
      category: "OUR_ATTACK",
      homeValue: home.leftAtt,
      awayValue: away.rightDef,
      conversionProb: Math.round(homeLeftGoalProb * 100),
      advantage:
        home.leftAtt > away.rightDef
          ? "HOME"
          : home.leftAtt < away.rightDef
          ? "AWAY"
          : "EQUAL",
    },
    {
      sector: "Merkez Hücum vs Rakip Merkez Defans",
      category: "OUR_ATTACK",
      homeValue: home.midAtt,
      awayValue: away.midDef,
      conversionProb: Math.round(homeMidGoalProb * 100),
      advantage:
        home.midAtt > away.midDef
          ? "HOME"
          : home.midAtt < away.midDef
          ? "AWAY"
          : "EQUAL",
    },
    {
      sector: "Sağ Hücum vs Rakip Sol Defans",
      category: "OUR_ATTACK",
      homeValue: home.rightAtt,
      awayValue: away.leftDef,
      conversionProb: Math.round(homeRightGoalProb * 100),
      advantage:
        home.rightAtt > away.leftDef
          ? "HOME"
          : home.rightAtt < away.leftDef
          ? "AWAY"
          : "EQUAL",
    },
    {
      sector: "Sol Savunma vs Rakip Sağ Hücum",
      category: "OUR_DEFENSE",
      homeValue: home.leftDef,
      awayValue: away.rightAtt,
      conversionProb: Math.round((1 - awayRightGoalProb) * 100),
      advantage:
        home.leftDef > away.rightAtt
          ? "HOME"
          : home.leftDef < away.rightAtt
          ? "AWAY"
          : "EQUAL",
    },
    {
      sector: "Merkez Savunma vs Rakip Merkez Hücum",
      category: "OUR_DEFENSE",
      homeValue: home.midDef,
      awayValue: away.midAtt,
      conversionProb: Math.round((1 - awayMidGoalProb) * 100),
      advantage:
        home.midDef > away.midAtt
          ? "HOME"
          : home.midDef < away.midAtt
          ? "AWAY"
          : "EQUAL",
    },
    {
      sector: "Sağ Savunma vs Rakip Sol Hücum",
      category: "OUR_DEFENSE",
      homeValue: home.rightDef,
      awayValue: away.leftAtt,
      conversionProb: Math.round((1 - awayLeftGoalProb) * 100),
      advantage:
        home.rightDef > away.leftAtt
          ? "HOME"
          : home.rightDef < away.leftAtt
          ? "AWAY"
          : "EQUAL",
    },
  ];

  const homeExpectedPoints =
    Math.round(((homeWins * 3 + draws * 1) / total) * 100) / 100;
  const awayExpectedPoints =
    Math.round(((awayWins * 3 + draws * 1) / total) * 100) / 100;

  return {
    homeWinProb,
    drawProb,
    awayWinProb,
    expectedHomeGoals: Math.round(homeExpectedGoals * 100) / 100,
    expectedAwayGoals: Math.round(awayExpectedGoals * 100) / 100,
    homeExpectedPoints,
    awayExpectedPoints,
    homePossession,
    awayPossession,
    cleanSheetHomeProb,
    cleanSheetAwayProb,
    bttsProb: Math.round((btts / total) * 100),
    over25Prob: Math.round((over25 / total) * 100),
    topScorelines,
    sectorComparison,
  };
}

/**
 * Expert AI Match Tactician: Evaluates all Formations & Tactics against a specific opponent
 */
export function analyzeBestMatchLineupAI(
  players: Player[],
  opponentRatings: SectorRatings,
  isHome: boolean = true,
  attitude: SupportedAttitude = "Normal"
): AIMatchAnalysisReport {
  const formations: SupportedFormation[] = [
    "3-5-2",
    "4-4-2",
    "4-5-1",
    "3-4-3",
    "4-3-3",
    "5-3-2",
  ];
  const tactics: SupportedTactic[] = [
    "Normal",
    "Kanatlardan Hücum",
    "Ortadan Hücum",
    "Kontra Atak",
    "Yaratıcı Oyna",
    "Uzaktan Şut",
  ];

  // Identify opponent weaknesses
  const oppDefs = [
    { name: "Sol Savunma", val: opponentRatings.leftDef },
    { name: "Merkez Savunma", val: opponentRatings.midDef },
    { name: "Sağ Savunma", val: opponentRatings.rightDef },
  ].sort((a, b) => a.val - b.val);

  const oppAtts = [
    { name: "Sol Kanat Hücumu", val: opponentRatings.leftAtt },
    { name: "Merkez Hücumu", val: opponentRatings.midAtt },
    { name: "Sağ Kanat Hücumu", val: opponentRatings.rightAtt },
  ].sort((a, b) => b.val - a.val);

  const options: AIMatchTacticOption[] = [];

  for (const formation of formations) {
    for (const tactic of tactics) {
      const lineup = generateAutoLineup(players, formation, tactic, attitude);
      const sim = isHome
        ? simulateMatch(lineup.sectorRatings, opponentRatings, tactic, "Normal", true)
        : simulateMatch(opponentRatings, lineup.sectorRatings, "Normal", tactic, true);

      const winProb = isHome ? sim.homeWinProb : sim.awayWinProb;
      const drawProb = sim.drawProb;
      const lossProb = isHome ? sim.awayWinProb : sim.homeWinProb;
      const expectedGoalsFor = isHome
        ? sim.expectedHomeGoals
        : sim.expectedAwayGoals;
      const expectedGoalsAgainst = isHome
        ? sim.expectedAwayGoals
        : sim.expectedHomeGoals;
      const expectedPoints = isHome
        ? sim.homeExpectedPoints
        : sim.awayExpectedPoints;

      let keyReason = "Dengeli saha dağılımı ve maksimum oyuncu yıldız verimi.";
      if (tactic === "Kanatlardan Hücum") {
        keyReason = `Rakibin kanat savunmalarındaki (${opponentRatings.leftDef}/${opponentRatings.rightDef}) zaafı hedef alır.`;
      } else if (tactic === "Ortadan Hücum") {
        keyReason = `Rakibin merkez savunmasını (${opponentRatings.midDef}) delmek için pozisyonları merkeze yıkar.`;
      } else if (tactic === "Kontra Atak") {
        keyReason = `Orta saha dezavantajını güçlü savunma (${lineup.sectorRatings.midDef}) ve hızlı kontra ataklarla avantaja çevirir.`;
      } else if (formation === "3-5-2" || formation === "4-5-1") {
        keyReason = `3 iç saha oyuncusuyla orta saha üstünlüğünü (${lineup.sectorRatings.midfield} vs ${opponentRatings.midfield}) ele geçirir.`;
      } else if (formation === "3-4-3") {
        keyReason = `3 forvetle rakip savunma hattına maksimum gol baskısı (${expectedGoalsFor} xG) kurar.`;
      }

      options.push({
        formation,
        tactic,
        attitude,
        lineup,
        winProb,
        drawProb,
        lossProb,
        expectedGoalsFor,
        expectedGoalsAgainst,
        expectedPoints,
        keyReason,
      });
    }
  }

  // Sort by expectedPoints then winProb then goal difference
  options.sort((a, b) => {
    if (b.winProb !== a.winProb) return b.winProb - a.winProb;
    if (b.expectedPoints !== a.expectedPoints)
      return b.expectedPoints - a.expectedPoints;
    return (
      b.expectedGoalsFor -
      b.expectedGoalsAgainst -
      (a.expectedGoalsFor - a.expectedGoalsAgainst)
    );
  });

  // Deduplicate top alternatives by formation so user sees diverse tactical setups
  const uniqueAlternatives: AIMatchTacticOption[] = [];
  const seenFormations = new Set<string>();
  for (const opt of options) {
    const key = `${opt.formation}-${opt.tactic}`;
    if (!seenFormations.has(key) && uniqueAlternatives.length < 6) {
      seenFormations.add(key);
      uniqueAlternatives.push(opt);
    }
  }

  const best = uniqueAlternatives[0] || options[0];

  const midfieldDiff =
    best.lineup.sectorRatings.midfield - opponentRatings.midfield;
  const midfieldVerdict =
    midfieldDiff >= 4
      ? `Orta sahada belirgin üstünlüğünüz var (${best.lineup.sectorRatings.midfield} vs ${opponentRatings.midfield}). Topa sahip olma ve pozisyon üstünlüğü sizde olacak.`
      : midfieldDiff <= -4
      ? `Rakibin orta sahası güçlü (${opponentRatings.midfield} vs ${best.lineup.sectorRatings.midfield}). Savunmayı sağlam tutup kanat/kontra fırsatlarını değerlendirmek kritik.`
      : `Orta saha güçleri birbirine çok yakın (${best.lineup.sectorRatings.midfield} vs ${opponentRatings.midfield}). Doğru taktik ve kanat eşleşmeleri maçı çözecek.`;

  const tacticalSummary = [
    `En Yüksek Kazanma Oranı: ${best.formation} dizilişi ve '${best.tactic}' taktiği ile galibiyet olasılığınız %${best.winProb} (Beklenen Puan: ${best.expectedPoints} xPts).`,
    `Rakibin En Zayıf Bölgesi: ${oppDefs[0].name} (${oppDefs[0].val}/80). Hücum ağırlığını bu bölgeye yıkmak maç başına ${best.expectedGoalsFor} beklenen gol (xG) üretiyor.`,
    `Dikkat Edilmesi Gereken Tehdit: Rakibin en güçlü hücum hattı ${oppAtts[0].name} (${oppAtts[0].val}/80).`,
  ];

  return {
    bestOption: best,
    alternatives: uniqueAlternatives,
    opponentWeakestDefSector: `${oppDefs[0].name} (${oppDefs[0].val}/80)`,
    opponentStrongestAttSector: `${oppAtts[0].name} (${oppAtts[0].val}/80)`,
    midfieldVerdict,
    tacticalSummary,
  };
}

/**
 * Generates a full 90-minute interactive live match timeline and advanced telemetry
 */
export function generateLiveMatchBroadcast(
  homeTeamName: string,
  awayTeamName: string,
  homeRatings: SectorRatings,
  awayRatings: SectorRatings,
  players: Player[]
): {
  events: LiveMatchEvent[];
  telemetry: AdvancedMatchTelemetry;
  simulation: MatchSimulationResult;
} {
  const sim = simulateMatch(homeRatings, awayRatings);
  const events: LiveMatchEvent[] = [];

  const getStarName = (roles: string[], fallback: string) => {
    const found = players.find((p) => roles.includes(p.bestPosition || ""));
    return found ? found.name : fallback;
  };

  const fwName = getStarName(["FW"], "Santrafor");
  const wingName = getStarName(["RW", "LW"], "Kanat Oyuncusu");
  const midName = getStarName(["IM"], "Oyun Kurucu");
  const defName = getStarName(["CD", "RB", "LB"], "Stoper");
  const gkName = getStarName(["GK"], "Kaleci");

  let hScore = 0;
  let aScore = 0;
  let hXG = 0;
  let aXG = 0;

  // Kickoff (1')
  events.push({
    minute: 1,
    type: "KICKOFF",
    team: "NEUTRAL",
    sector: "CENTER",
    title: "Maç Başladı!",
    commentary: `Hakemin ilk düdüğüyle ${homeTeamName} - ${awayTeamName} mücadelesi başladı! Orta saha mücadelesi (%${sim.homePossession} - %${sim.awayPossession}) temposuyla dikkat çekiyor.`,
    homeScore: 0,
    awayScore: 0,
    homeXG: 0,
    awayXG: 0,
    ballX: 50,
    ballY: 50,
  });

  // Deterministic realistic chance schedule across 90 minutes
  const timelineMinutes = [7, 14, 22, 29, 37, 43, 45, 52, 59, 66, 73, 79, 84, 89, 90];

  timelineMinutes.forEach((min, idx) => {
    if (min === 45) {
      events.push({
        minute: 45,
        type: "HALFTIME",
        team: "NEUTRAL",
        sector: "CENTER",
        title: "İlk Yarı Sona Erdi",
        commentary: `Takımlar soyunma odasına ${hScore} - ${aScore} skoruyla gidiyor. İlk yarı xG: ${hXG.toFixed(2)} - ${aXG.toFixed(2)}.`,
        homeScore: hScore,
        awayScore: aScore,
        homeXG: Number(hXG.toFixed(2)),
        awayXG: Number(aXG.toFixed(2)),
        ballX: 50,
        ballY: 50,
      });
      return;
    }

    if (min === 90) {
      events.push({
        minute: 90,
        type: "FULLTIME",
        team: "NEUTRAL",
        sector: "CENTER",
        title: "Maç Sona Erdi!",
        commentary: `90 dakika tamamlandı! ${homeTeamName} ${hScore} - ${aScore} ${awayTeamName}. Toplam Gol Beklentisi (xG): ${hXG.toFixed(2)} - ${aXG.toFixed(2)}.`,
        homeScore: hScore,
        awayScore: aScore,
        homeXG: Number(hXG.toFixed(2)),
        awayXG: Number(aXG.toFixed(2)),
        ballX: 50,
        ballY: 50,
      });
      return;
    }

    // Decide attacking team based on possession & minute index
    const homeAttackThreshold = sim.homePossession / 100;
    const pseudoRand = ((min * 17 + idx * 31) % 100) / 100;
    const isHomeAttack = pseudoRand < homeAttackThreshold;

    const sectorList: ("CENTER" | "LEFT" | "RIGHT" | "SPECIAL")[] = [
      "CENTER",
      "LEFT",
      "RIGHT",
      "SPECIAL",
    ];
    const sector = sectorList[idx % sectorList.length];

    if (isHomeAttack) {
      const chanceXG = sector === "CENTER" ? 0.34 : sector === "SPECIAL" ? 0.42 : 0.26;
      hXG += chanceXG;

      const targetGoals = Math.max(1, Math.round(sim.expectedHomeGoals));
      const shouldScore =
        hScore < targetGoals && (idx % 3 === 1 || sector === "SPECIAL");

      if (shouldScore) {
        hScore += 1;
        events.push({
          minute: min,
          type: sector === "SPECIAL" ? "SPECIAL_EVENT_GOAL" : "GOAL",
          team: "HOME",
          sector,
          playerName: sector === "CENTER" ? fwName : wingName,
          title: `GOOOOL! ${homeTeamName} (${hScore}-${aScore})`,
          commentary:
            sector === "SPECIAL"
              ? `⚡ ÖZEL OLAY GOLÜ! ${wingName} hızıyla rakip beki geçip sıfırdan ortaladı, ${fwName} harika bir kafa vuruşuyla ağları sarstı!`
              : `${midName} merkezden savunma arkasına nefis bir ara pası bıraktı, ${fwName} kalecinin solundan topu filelere gönderdi!`,
          homeScore: hScore,
          awayScore: aScore,
          homeXG: Number(hXG.toFixed(2)),
          awayXG: Number(aXG.toFixed(2)),
          ballX: sector === "LEFT" ? 22 : sector === "RIGHT" ? 78 : 50,
          ballY: 14,
        });
      } else {
        events.push({
          minute: min,
          type: idx % 2 === 0 ? "CHANCE_SAVED" : "CHANCE_MISSED",
          team: "HOME",
          sector,
          playerName: midName,
          title: `${homeTeamName} Tehlikeli Atak`,
          commentary: `${homeTeamName} ${
            sector === "LEFT" ? "sol kanattan" : sector === "RIGHT" ? "sağ kanattan" : "merkezden"
          } etkili geldi. ${fwName}'in sert şutunu rakip kaleci son anda kornere çeldi!`,
          homeScore: hScore,
          awayScore: aScore,
          homeXG: Number(hXG.toFixed(2)),
          awayXG: Number(aXG.toFixed(2)),
          ballX: sector === "LEFT" ? 25 : sector === "RIGHT" ? 75 : 50,
          ballY: 22,
        });
      }
    } else {
      const chanceXG = sector === "CENTER" ? 0.31 : 0.22;
      aXG += chanceXG;

      const targetAwayGoals = Math.round(sim.expectedAwayGoals);
      const shouldScore = aScore < targetAwayGoals && idx % 4 === 2;

      if (shouldScore) {
        aScore += 1;
        events.push({
          minute: min,
          type: "GOAL",
          team: "AWAY",
          sector,
          title: `Gol! ${awayTeamName} (${hScore}-${aScore})`,
          commentary: `${awayTeamName} hızlı gelişen atakta savunma boşluğunu değerlendirdi ve skoru ${hScore}-${aScore}'a getirdi.`,
          homeScore: hScore,
          awayScore: aScore,
          homeXG: Number(hXG.toFixed(2)),
          awayXG: Number(aXG.toFixed(2)),
          ballX: 50,
          ballY: 86,
        });
      } else {
        events.push({
          minute: min,
          type: "CHANCE_SAVED",
          team: "AWAY",
          sector,
          playerName: gkName,
          title: `${gkName} Geçit Vermedi!`,
          commentary: `${awayTeamName} ceza sahasına sızdı ancak stoper ${defName} açıyı kapattı, kaleci ${gkName} kritik bir kurtarışa imza attı!`,
          homeScore: hScore,
          awayScore: aScore,
          homeXG: Number(hXG.toFixed(2)),
          awayXG: Number(aXG.toFixed(2)),
          ballX: sector === "LEFT" ? 30 : sector === "RIGHT" ? 70 : 50,
          ballY: 78,
        });
      }
    }
  });

  const homeShots = Math.max(5, Math.round(sim.homePossession * 0.24));
  const awayShots = Math.max(3, Math.round(sim.awayPossession * 0.2));

  const telemetry: AdvancedMatchTelemetry = {
    homeShots,
    awayShots,
    homeShotsOnTarget: Math.max(hScore + 2, Math.round(homeShots * 0.52)),
    awayShotsOnTarget: Math.max(aScore + 1, Math.round(awayShots * 0.45)),
    homeBigChances: Math.max(hScore + 1, Math.round(hXG * 1.8)),
    awayBigChances: Math.max(aScore, Math.round(aXG * 1.6)),
    homeCorners: Math.max(2, Math.round(homeShots * 0.45)),
    awayCorners: Math.max(1, Math.round(awayShots * 0.4)),
    homePassAccuracy: Math.min(93, Math.max(72, Math.round(68 + sim.homePossession * 0.35))),
    awayPassAccuracy: Math.min(91, Math.max(68, Math.round(66 + sim.awayPossession * 0.35))),
    homeDuelsWon: Math.min(68, Math.max(38, Math.round(45 + (homeRatings.midDef - awayRatings.midAtt) * 0.4))),
    awayDuelsWon: 100 - Math.min(68, Math.max(38, Math.round(45 + (homeRatings.midDef - awayRatings.midAtt) * 0.4))),
    homeFieldTilt: Math.min(78, Math.max(25, Math.round(sim.homePossession * 1.08))),
    awayFieldTilt: 100 - Math.min(78, Math.max(25, Math.round(sim.homePossession * 1.08))),
    momentumBy15Min: [
      { period: "01-15'", homeMomentum: sim.homePossession, awayMomentum: sim.awayPossession },
      { period: "16-30'", homeMomentum: Math.min(85, sim.homePossession + 6), awayMomentum: Math.max(15, sim.awayPossession - 6) },
      { period: "31-45'", homeMomentum: Math.max(20, sim.homePossession - 4), awayMomentum: Math.min(80, sim.awayPossession + 4) },
      { period: "46-60'", homeMomentum: Math.min(88, sim.homePossession + 8), awayMomentum: Math.max(12, sim.awayPossession - 8) },
      { period: "61-75'", homeMomentum: sim.homePossession, awayMomentum: sim.awayPossession },
      { period: "76-90'", homeMomentum: Math.min(90, sim.homePossession + 5), awayMomentum: Math.max(10, sim.awayPossession - 5) },
    ],
  };

  return {
    events,
    telemetry,
    simulation: sim,
  };
}
