import { SectorRatings } from "@/types/hattrick";

export interface MatchSimulationResult {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  expectedHomeGoals: number;
  expectedAwayGoals: number;
  homePossession: number;
  awayPossession: number;
  sectorComparison: {
    sector: string;
    homeValue: number;
    awayValue: number;
    advantage: "HOME" | "AWAY" | "EQUAL";
  }[];
}

/**
 * Simulates Hattrick match outcome based on sector ratings
 */
export function simulateMatch(
  home: SectorRatings,
  away: SectorRatings
): MatchSimulationResult {
  // 1. Midfield determines ball possession
  // Using cubic formula classic in Hattrick analysis
  const homeMidExp = Math.pow(Math.max(5, home.midfield), 3);
  const awayMidExp = Math.pow(Math.max(5, away.midfield), 3);
  const homePossession = Math.round((homeMidExp / (homeMidExp + awayMidExp)) * 100);
  const awayPossession = 100 - homePossession;

  // Total chances in a game = ~10
  const homeChances = (homePossession / 100) * 10;
  const awayChances = (awayPossession / 100) * 10;

  // Chance distribution: Left: 25%, Center: 50%, Right: 25%
  // Probability to score on each sector = Att^3 / (Att^3 + OppDef^3)
  const calcGoalProb = (att: number, def: number) => {
    const a = Math.pow(Math.max(1, att), 3);
    const d = Math.pow(Math.max(1, def), 3);
    return a / (a + d);
  };

  // Home attack vs Away defense (Home Left attacks Away Right Def, etc.)
  const homeLeftGoalProb = calcGoalProb(home.leftAtt, away.rightDef);
  const homeMidGoalProb = calcGoalProb(home.midAtt, away.midDef);
  const homeRightGoalProb = calcGoalProb(home.rightAtt, away.leftDef);

  const homeExpectedGoals =
    homeChances * (0.25 * homeLeftGoalProb + 0.5 * homeMidGoalProb + 0.25 * homeRightGoalProb);

  // Away attack vs Home defense
  const awayLeftGoalProb = calcGoalProb(away.leftAtt, home.rightDef);
  const awayMidGoalProb = calcGoalProb(away.midAtt, home.midDef);
  const awayRightGoalProb = calcGoalProb(away.rightAtt, home.leftDef);

  const awayExpectedGoals =
    awayChances * (0.25 * awayLeftGoalProb + 0.5 * awayMidGoalProb + 0.25 * awayRightGoalProb);

  // Poisson distribution simulation to calculate exact Win / Draw / Loss percentages
  let homeWins = 0;
  let draws = 0;
  let awayWins = 0;

  const poisson = (lambda: number, k: number) => {
    let p = Math.exp(-lambda);
    for (let i = 1; i <= k; i++) {
      p *= lambda / i;
    }
    return p;
  };

  const maxGoals = 10;
  for (let h = 0; h <= maxGoals; h++) {
    const pH = poisson(homeExpectedGoals, h);
    for (let a = 0; a <= maxGoals; a++) {
      const pA = poisson(awayExpectedGoals, a);
      const prob = pH * pA;

      if (h > a) homeWins += prob;
      else if (h === a) draws += prob;
      else awayWins += prob;
    }
  }

  const total = homeWins + draws + awayWins || 1;
  const homeWinProb = Math.round((homeWins / total) * 100);
  const drawProb = Math.round((draws / total) * 100);
  const awayWinProb = 100 - homeWinProb - drawProb;

  const sectorComparison = [
    {
      sector: "Orta Saha (Topa Sahip Olma)",
      homeValue: home.midfield,
      awayValue: away.midfield,
      advantage: home.midfield > away.midfield ? "HOME" : home.midfield < away.midfield ? "AWAY" : "EQUAL",
    },
    {
      sector: "Sol Hücum vs Sağ Savunma",
      homeValue: home.leftAtt,
      awayValue: away.rightDef,
      advantage: home.leftAtt > away.rightDef ? "HOME" : home.leftAtt < away.rightDef ? "AWAY" : "EQUAL",
    },
    {
      sector: "Merkez Hücum vs Merkez Savunma",
      homeValue: home.midAtt,
      awayValue: away.midDef,
      advantage: home.midAtt > away.midDef ? "HOME" : home.midAtt < away.midDef ? "AWAY" : "EQUAL",
    },
    {
      sector: "Sağ Hücum vs Sol Savunma",
      homeValue: home.rightAtt,
      awayValue: away.leftDef,
      advantage: home.rightAtt > away.leftDef ? "HOME" : home.rightAtt < away.leftDef ? "AWAY" : "EQUAL",
    },
  ] as const;

  return {
    homeWinProb,
    drawProb,
    awayWinProb,
    expectedHomeGoals: Math.round(homeExpectedGoals * 10) / 10,
    expectedAwayGoals: Math.round(awayExpectedGoals * 10) / 10,
    homePossession,
    awayPossession,
    sectorComparison: [...sectorComparison],
  };
}
