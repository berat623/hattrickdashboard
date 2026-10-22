import { XMLParser } from "fast-xml-parser";
import { CHPP_XML_URL, getSignedHeaders } from "./oauth";
import { Player, TeamDetails, Match, TrainingData, PositionCode } from "@/types/hattrick";
import { MOCK_PLAYERS, MOCK_TEAM, MOCK_MATCHES, MOCK_TRAINING } from "./mock-data";

export interface CHPPClientOptions {
  accessToken?: string;
  accessTokenSecret?: string;
  demoMode?: boolean;
}

export class CHPPClient {
  private accessToken?: string;
  private accessTokenSecret?: string;
  private demoMode: boolean;
  private parser: XMLParser;

  constructor(options: CHPPClientOptions = {}) {
    this.accessToken = options.accessToken;
    this.accessTokenSecret = options.accessTokenSecret;
    this.demoMode = options.demoMode ?? (!options.accessToken || !options.accessTokenSecret);
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
    if (this.demoMode || !this.accessToken || !this.accessTokenSecret) {
      throw new Error("Demo mode aktif veya CHPP erişim anahtarları eksik.");
    }

    const queryParams: Record<string, string> = {
      file,
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    };

    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${CHPP_XML_URL}?${queryString}`;

    const headers = getSignedHeaders(
      fullUrl,
      "GET",
      this.accessToken,
      this.accessTokenSecret,
      queryParams
    );

    const response = await fetch(fullUrl, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`CHPP API hatası (${response.status}): ${errText}`);
    }

    const xml = await response.text();
    const parsed = this.parser.parse(xml);

    if (parsed.HattrickData?.ErrorCode) {
      throw new Error(`Hattrick Hata Kodu ${parsed.HattrickData.ErrorCode}: ${parsed.HattrickData.Error || "Bilinmeyen hata"}`);
    }

    return parsed.HattrickData as Record<string, unknown>;
  }

  /**
   * Oyuncu Listesini Çeker (file=players)
   */
  async getPlayers(teamId?: number): Promise<Player[]> {
    if (this.demoMode || !this.accessToken) {
      return MOCK_PLAYERS;
    }

    try {
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

        return {
          id,
          name,
          shirtNumber: p.PlayerNumber ? Number(p.PlayerNumber) : undefined,
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
          injuryDays: p.InjuryLevel ? Number(p.InjuryLevel) : 0,
          cards: p.Cards ? Number(p.Cards) : 0,
          skills,
          bestPosition,
          positionRating,
        };
      });
    } catch (err) {
      console.error("CHPP getPlayers error, falling back to mock:", err);
      return MOCK_PLAYERS;
    }
  }

  /**
   * Takım Detaylarını Çeker (file=teamdetails)
   */
  async getTeamDetails(teamId?: number): Promise<TeamDetails> {
    if (this.demoMode || !this.accessToken) {
      return MOCK_TEAM;
    }

    try {
      const data = await this.fetchXml("teamdetails", {
        version: "3.7",
        ...(teamId ? { teamID: teamId } : {}),
      });

      const user = (data.User as Record<string, unknown>) || {};
      const teams = (data.Teams as Record<string, unknown>) || {};
      const teamList = this.ensureArray(teams.Team as Record<string, unknown>[]);
      const team = teamList[0] || {};
      const arena = (team.Arena as Record<string, unknown>) || {};
      const league = (team.League as Record<string, unknown>) || {};

      return {
        id: Number(team.TeamID || MOCK_TEAM.id),
        name: String(team.TeamName || MOCK_TEAM.name),
        shortName: String(team.ShortTeamName || "Takım"),
        leagueLevel: Number(league.LeagueLevel || 3),
        seriesName: String(team.LeagueLevelUnitName || "Süper Lig"),
        rank: Number(team.Rank || 1),
        fanClubSize: Number(team.FanclubSize || 1500),
        cash: Number(user.Cash || 15000000),
        arenaName: String(arena.ArenaName || "Stadyum"),
        arenaCapacity: Number(arena.Capacity || 30000),
        regionName: String(team.RegionName || "İstanbul"),
        countryName: String(team.CountryName || "Türkiye"),
        homeColor: "#059669",
        awayColor: "#dc2626",
      };
    } catch (err) {
      console.error("CHPP getTeamDetails error, falling back to mock:", err);
      return MOCK_TEAM;
    }
  }

  /**
   * Maçları Çeker (file=matches)
   */
  async getMatches(teamId?: number): Promise<Match[]> {
    if (this.demoMode || !this.accessToken) {
      return MOCK_MATCHES;
    }

    try {
      const data = await this.fetchXml("matches", {
        version: "2.9",
        ...(teamId ? { teamID: teamId } : {}),
      });

      const team = (data.Team as Record<string, unknown>) || {};
      const matchList = (team.MatchList as Record<string, unknown>) || {};
      const rawMatches = this.ensureArray(matchList.Match as Record<string, unknown>[]);

      return rawMatches.map((m) => {
        const homeId = Number((m.HomeTeam as Record<string, unknown>)?.HomeTeamID);
        const homeName = String((m.HomeTeam as Record<string, unknown>)?.HomeTeamName || "Ev Sahibi");
        const awayId = Number((m.AwayTeam as Record<string, unknown>)?.AwayTeamID);
        const awayName = String((m.AwayTeam as Record<string, unknown>)?.AwayTeamName || "Deplasman");

        const targetTeamId = teamId || Number(team.TeamID);
        const myTeamIsHome = homeId === targetTeamId;

        const homeGoals = m.HomeGoals !== undefined && m.HomeGoals !== null ? Number(m.HomeGoals) : null;
        const awayGoals = m.AwayGoals !== undefined && m.AwayGoals !== null ? Number(m.AwayGoals) : null;

        const isFinished = homeGoals !== null && awayGoals !== null;
        let result: "WIN" | "DRAW" | "LOSS" | undefined;
        if (isFinished) {
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
          matchType: Number(m.MatchType) === 1 ? "LEAGUE" : Number(m.MatchType) === 3 ? "CUP" : "FRIENDLY",
          myTeamIsHome,
          result,
          winProbability: 60,
          drawProbability: 25,
          lossProbability: 15,
        };
      });
    } catch (err) {
      console.error("CHPP getMatches error, falling back to mock:", err);
      return MOCK_MATCHES;
    }
  }

  /**
   * Antrenman Bilgisini Çeker (file=training)
   */
  async getTraining(teamId?: number): Promise<TrainingData> {
    if (this.demoMode || !this.accessToken) {
      return MOCK_TRAINING;
    }

    try {
      const data = await this.fetchXml("training", {
        version: "2.4",
        ...(teamId ? { teamID: teamId } : {}),
      });

      const team = (data.Team as Record<string, unknown>) || {};
      const trainingType = Number(team.TrainingType || 7);
      const trainingNames: Record<number, string> = {
        2: "Genel / Kalecilik",
        3: "Defans",
        4: "Oyun Kuruculuk",
        5: "Kanat",
        6: "Şut / Golcülük",
        7: "Pas Verme",
        8: "Duran Top",
        9: "Defans Pozisyonu",
        10: "Hücum Pozisyonu",
        11: "Kanat Atakları",
      };

      return {
        trainingType,
        trainingTypeName: trainingNames[trainingType] || "Özel Antrenman",
        trainingLevel: Number(team.TrainingLevel || 100),
        staminaTrainingPart: Number(team.StaminaTrainingPart || 15),
        lastTrainingDate: String(team.LastTrainingDate || new Date().toISOString()),
        coachId: team.CoachID ? Number(team.CoachID) : undefined,
      };
    } catch (err) {
      console.error("CHPP getTraining error, falling back to mock:", err);
      return MOCK_TRAINING;
    }
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
  const formMult = 0.65 + form * 0.05; // Form 7 -> 1.0
  const stamMult = 0.7 + stamina * 0.035;
  const expBonus = experience * 0.06;

  // Rating calculations per position (1-20 scale)
  const gkRating = (skills.keeper * 0.8 + skills.defender * 0.2) * formMult * stamMult + expBonus;
  const cdRating = (skills.defender * 0.65 + skills.playmaker * 0.15 + skills.passer * 0.1 + skills.keeper * 0.1) * formMult * stamMult + expBonus;
  const wbRating = (skills.defender * 0.45 + skills.winger * 0.3 + skills.playmaker * 0.15 + skills.passer * 0.1) * formMult * stamMult + expBonus;
  const imRating = (skills.playmaker * 0.55 + skills.defender * 0.2 + skills.passer * 0.15 + skills.scorer * 0.1) * formMult * stamMult + expBonus;
  const wRating = (skills.winger * 0.55 + skills.playmaker * 0.2 + skills.passer * 0.15 + skills.defender * 0.1) * formMult * stamMult + expBonus;
  const fwRating = (skills.scorer * 0.6 + skills.passer * 0.2 + skills.winger * 0.1 + skills.playmaker * 0.1) * formMult * stamMult + expBonus;

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
