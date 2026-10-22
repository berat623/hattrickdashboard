import { XMLParser } from "fast-xml-parser";
import { buildSignedChppUrl } from "./oauth";
import { Player, TeamDetails, Match, TrainingData, PositionCode } from "@/types/hattrick";

export interface CHPPClientOptions {
  accessToken?: string;
  accessTokenSecret?: string;
}

export class CHPPClient {
  private accessToken?: string;
  private accessTokenSecret?: string;
  private parser: XMLParser;

  constructor(options: CHPPClientOptions = {}) {
    this.accessToken = options.accessToken;
    this.accessTokenSecret = options.accessTokenSecret;
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      trimValues: true,
      parseTagValue: true,
    });
  }

  private ensureArray<T>(item: T | T[] | undefined | null): T[] {
    if (!item) return [];
    return Array.isArray(item) ? item : [item];
  }

  /**
   * Fetches signed XML from Hattrick CHPP API
   */
  async fetchXml(file: string, params: Record<string, string | number> = {}): Promise<Record<string, unknown>> {
    if (!this.accessToken || !this.accessTokenSecret) {
      throw new Error("Hattrick CHPP erişim anahtarları eksik. Lütfen Hattrick ile giriş yapın.");
    }

    const queryParams: Record<string, string> = {
      file,
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    };

    const signedUrl = buildSignedChppUrl(queryParams, this.accessToken, this.accessTokenSecret);

    const response = await fetch(signedUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`CHPP API hatası (${response.status}): ${errText}`);
    }

    const xml = await response.text();
    const parsed = this.parser.parse(xml);

    if (parsed.HattrickData?.ErrorCode) {
      throw new Error(
        `Hattrick Hata Kodu ${parsed.HattrickData.ErrorCode}: ${parsed.HattrickData.Error || "Bilinmeyen hata"}`
      );
    }

    return parsed.HattrickData as Record<string, unknown>;
  }

  /**
   * Oyuncu Listesini Çeker (file=players)
   */
  async getPlayers(teamId?: number): Promise<Player[]> {
    const data = await this.fetchXml("players", {
      version: "2.6",
      ...(teamId ? { teamID: teamId } : {}),
      includeMatchInfo: "true",
    });

    const team = (data.Team as Record<string, unknown>) || {};
    const playerListRaw = (team.PlayerList as Record<string, unknown>) || {};
    const rawPlayers = this.ensureArray(playerListRaw.Player as Record<string, unknown>[]);

    return rawPlayers.map((p) => {
      const id = Number(p.PlayerID);
      const name = `${p.FirstName || ""} ${p.LastName || ""}`.trim() || String(p.PlayerID);
      const age = Number(p.Age || 20);
      const ageDays = Number(p.AgeDays || 0);
      const tsi = Number(p.TSI || 0);
      const wage = Number(p.Salary || 0);
      const form = Number(p.PlayerForm || 5);
      const stamina = Number(p.StaminaSkill || 5);
      const experience = Number(p.Experience || 5);
      const leadership = Number(p.Leadership || 5);
      const loyalty = Number(p.Loyalty || 10);
      const specialtyNum = Number(p.Specialty || 0);

      const specialties = ["Yok", "Teknik", "Hızlı", "Kafa", "Güçlü", "Öngörülemez", "İnatçı"];
      const specialty = specialties[specialtyNum] || "Yok";

      const skills = {
        keeper: Number(p.KeeperSkill || 1),
        defender: Number(p.DefenderSkill || 1),
        playmaker: Number(p.PlaymakerSkill || 1),
        winger: Number(p.WingerSkill || 1),
        passer: Number(p.PassingSkill || 1),
        scorer: Number(p.ScorerSkill || 1),
        setPieces: Number(p.SetPiecesSkill || 1),
      };

      const { bestPosition, positionRating } = calculateBestPosition(skills, form, stamina, experience);

      const injuryRaw = p.InjuryLevel !== undefined ? Number(p.InjuryLevel) : -1;
      const injuryDays = injuryRaw > 0 ? injuryRaw : 0;

      return {
        id,
        name,
        shirtNumber: p.PlayerNumber && Number(p.PlayerNumber) < 100 ? Number(p.PlayerNumber) : undefined,
        age,
        ageDays,
        tsi,
        wage,
        form,
        stamina,
        experience,
        leadership,
        loyalty,
        specialty,
        injuryDays,
        cards: p.Cards ? Number(p.Cards) : 0,
        skills,
        bestPosition,
        positionRating,
      };
    });
  }

  /**
   * Takım Detaylarını Çeker (file=teamdetails)
   */
  async getTeamDetails(teamId?: number): Promise<TeamDetails & { loginname?: string }> {
    const data = await this.fetchXml("teamdetails", {
      version: "3.7",
      ...(teamId ? { teamID: teamId } : {}),
    });

    const user = (data.User as Record<string, unknown>) || {};
    const teams = (data.Teams as Record<string, unknown>) || {};
    const teamList = this.ensureArray(teams.Team as Record<string, unknown>[]);
    const team =
      teamList.find((t) => String(t.IsPrimaryClub).toLowerCase() === "true") || teamList[0] || {};

    const arena = (team.Arena as Record<string, unknown>) || {};
    const league = (team.League as Record<string, unknown>) || {};
    const leagueLevelUnit = (team.LeagueLevelUnit as Record<string, unknown>) || {};
    const fanclub = (team.Fanclub as Record<string, unknown>) || {};
    const region = (team.Region as Record<string, unknown>) || {};
    const country = (team.Country as Record<string, unknown>) || {};

    let cash = 0;
    try {
      const econData = await this.fetchXml("economy", {
        version: "1.3",
        ...(team.TeamID ? { teamId: Number(team.TeamID) } : {}),
      });
      const econTeam = (econData.Team as Record<string, unknown>) || {};
      cash = Number(econTeam.Cash || 0);
    } catch {
      cash = 0;
    }

    return {
      id: Number(team.TeamID || 0),
      name: String(team.TeamName || "Hattrick Takımı"),
      shortName: String(team.ShortTeamName || team.TeamName || "Takım"),
      leagueLevel: Number(leagueLevelUnit.LeagueLevel || team.LeagueLevel || 1),
      seriesName: String(leagueLevelUnit.LeagueLevelUnitName || team.LeagueLevelUnitName || league.LeagueName || "-"),
      rank: Number(team.TeamRank || leagueLevelUnit.Position || 1),
      fanClubSize: Number(fanclub.FanclubSize || team.FanclubSize || 0),
      cash,
      arenaName: String(arena.ArenaName || "Stadyum"),
      arenaCapacity: Number(arena.Capacity || 12000),
      regionName: String(region.RegionName || team.RegionName || ""),
      countryName: String(country.CountryName || league.LeagueName || "Türkiye"),
      homeColor: "#059669",
      awayColor: "#dc2626",
      loginname: user.Loginname ? String(user.Loginname) : undefined,
    };
  }

  /**
   * Maçları Çeker (file=matches)
   */
  async getMatches(teamId?: number): Promise<Match[]> {
    const data = await this.fetchXml("matches", {
      version: "2.9",
      ...(teamId ? { teamID: teamId } : {}),
    });

    const team = (data.Team as Record<string, unknown>) || {};
    const matchList = (team.MatchList as Record<string, unknown>) || {};
    const rawMatches = this.ensureArray(matchList.Match as Record<string, unknown>[]);

    return rawMatches.map((m) => {
      const homeTeamObj = (m.HomeTeam as Record<string, unknown>) || {};
      const awayTeamObj = (m.AwayTeam as Record<string, unknown>) || {};

      const homeId = Number(homeTeamObj.HomeTeamID || 0);
      const homeName = String(homeTeamObj.HomeTeamName || "Ev Sahibi");
      const awayId = Number(awayTeamObj.AwayTeamID || 0);
      const awayName = String(awayTeamObj.AwayTeamName || "Deplasman");

      const targetTeamId = teamId || Number(team.TeamID);
      const myTeamIsHome = homeId === targetTeamId;

      const homeGoals =
        m.HomeGoals !== undefined && m.HomeGoals !== null && m.HomeGoals !== ""
          ? Number(m.HomeGoals)
          : null;
      const awayGoals =
        m.AwayGoals !== undefined && m.AwayGoals !== null && m.AwayGoals !== ""
          ? Number(m.AwayGoals)
          : null;

      const statusRaw = String(m.Status || "").toUpperCase();
      const isFinished = statusRaw === "FINISHED" || (homeGoals !== null && awayGoals !== null);

      let result: "WIN" | "DRAW" | "LOSS" | undefined;
      if (isFinished && homeGoals !== null && awayGoals !== null) {
        if (homeGoals === awayGoals) {
          result = "DRAW";
        } else if (myTeamIsHome ? homeGoals > awayGoals : awayGoals > homeGoals) {
          result = "WIN";
        } else {
          result = "LOSS";
        }
      }

      return {
        id: Number(m.MatchID),
        matchDate: String(m.MatchDate),
        homeTeamId: homeId,
        homeTeamName: homeName,
        awayTeamId: awayId,
        awayTeamName: awayName,
        homeGoals,
        awayGoals,
        status: isFinished ? "FINISHED" : "UPCOMING",
        matchType:
          Number(m.MatchType) === 1
            ? "LEAGUE"
            : Number(m.MatchType) === 3
            ? "CUP"
            : "FRIENDLY",
        myTeamIsHome,
        result,
        winProbability: 55,
        drawProbability: 25,
        lossProbability: 20,
      };
    });
  }

  /**
   * Antrenman Bilgisini Çeker (file=training)
   */
  async getTraining(teamId?: number): Promise<TrainingData> {
    const data = await this.fetchXml("training", {
      version: "2.4",
      ...(teamId ? { teamID: teamId } : {}),
    });

    const team = (data.Team as Record<string, unknown>) || {};
    const trainingType = Number(team.TrainingType || 4);
    const trainingNames: Record<number, string> = {
      2: "Dayanıklılık / Genel",
      3: "Duran Top",
      4: "Defans (Defending)",
      5: "Golcülük (Scoring)",
      6: "Kanat (Crossing / Winger)",
      7: "Şut ve Duran Top",
      8: "Kısa Pas (Short Passes)",
      9: "Oyun Kuruculuk (Playmaking)",
      10: "Kalecilik (Goalkeeping)",
      11: "Ara Paslar (Through Passes)",
      12: "Defansif Pozisyon",
      13: "Kanat Atakları",
    };

    const trainer = (team.Trainer as Record<string, unknown>) || {};

    return {
      trainingType,
      trainingTypeName: trainingNames[trainingType] || `Antrenman (#${trainingType})`,
      trainingLevel: Number(team.TrainingLevel || 100),
      staminaTrainingPart: Number(team.StaminaTrainingPart || 15),
      lastTrainingDate: String(team.LastTrainingDate || new Date().toISOString()),
      coachId: trainer.TrainerID ? Number(trainer.TrainerID) : undefined,
    };
  }
}

/**
 * Oyuncunun en uygun mevkiini ve o mevkideki tahmini yıldız puanını hesaplar
 */
export function calculateBestPosition(
  skills: Player["skills"],
  form: number,
  stamina: number,
  experience: number
): { bestPosition: PositionCode; positionRating: number } {
  const formMult = 0.65 + form * 0.05;
  const stamMult = 0.7 + stamina * 0.035;
  const expBonus = experience * 0.06;

  const gkRating = (skills.keeper * 0.8 + skills.defender * 0.2) * formMult * stamMult + expBonus;
  const cdRating =
    (skills.defender * 0.65 + skills.playmaker * 0.15 + skills.passer * 0.1 + skills.keeper * 0.1) *
      formMult *
      stamMult +
    expBonus;
  const wbRating =
    (skills.defender * 0.45 + skills.winger * 0.3 + skills.playmaker * 0.15 + skills.passer * 0.1) *
      formMult *
      stamMult +
    expBonus;
  const imRating =
    (skills.playmaker * 0.55 + skills.defender * 0.2 + skills.passer * 0.15 + skills.scorer * 0.1) *
      formMult *
      stamMult +
    expBonus;
  const wRating =
    (skills.winger * 0.55 + skills.playmaker * 0.2 + skills.passer * 0.15 + skills.defender * 0.1) *
      formMult *
      stamMult +
    expBonus;
  const fwRating =
    (skills.scorer * 0.6 + skills.passer * 0.2 + skills.winger * 0.1 + skills.playmaker * 0.1) *
      formMult *
      stamMult +
    expBonus;

  const positions: { pos: PositionCode; rating: number }[] = [
    { pos: "GK", rating: gkRating },
    { pos: "CD", rating: cdRating },
    { pos: "RB", rating: wbRating },
    { pos: "LB", rating: wbRating },
    { pos: "IM", rating: imRating },
    { pos: "RW", rating: wRating },
    { pos: "LW", rating: wRating },
    { pos: "FW", rating: fwRating },
  ];

  positions.sort((a, b) => b.rating - a.rating);

  return {
    bestPosition: positions[0].pos,
    positionRating: Math.round(positions[0].rating * 10) / 10,
  };
}
