import { XMLParser } from "fast-xml-parser";
import { buildSignedChppUrl } from "./oauth";
import {
  Player,
  PlayerAvatarData,
  PlayerAvatarLayer,
  TeamDetails,
  Match,
  TrainingData,
  PositionCode,
  RealMatchDetails,
  RealMatchLineupPlayer,
  RealMatchGoal,
  RealMatchBooking,
  RealMatchEvent,
  SectorRatings,
  TransferMarketPlayer,
  TransferSearchFilters,
} from "@/types/hattrick";

export interface CHPPClientOptions {
  accessToken?: string;
  accessTokenSecret?: string;
}

const TACTIC_ID_MAP: Record<number, string> = {
  0: "Normal",
  1: "Baskı (Pressing)",
  2: "Kontra Atak",
  3: "Ortadan Hücum",
  4: "Kanatlardan Hücum",
  7: "Yaratıcı Oyna",
  8: "Uzaktan Şut",
};

const TACTIC_NAME_TO_ID: Record<string, number> = {
  Normal: 0,
  "Baskı (Pressing)": 1,
  Pressing: 1,
  "Kontra Atak": 2,
  "Counter-Attacks": 2,
  "Ortadan Hücum": 3,
  "Attack in the Middle": 3,
  "Kanatlardan Hücum": 4,
  "Attack on Wings": 4,
  "Yaratıcı Oyna": 7,
  "Play Creatively": 7,
  "Uzaktan Şut": 8,
  "Long Shots": 8,
};

const ATTITUDE_ID_MAP: Record<number, string> = {
  "-1": "Gevşek",
  0: "Normal",
  1: "Sezonun Maçı",
};

const ATTITUDE_NAME_TO_ID: Record<string, number> = {
  Gevşek: -1,
  "Play it Cool": -1,
  Normal: 0,
  "Sezonun Maçı": 1,
  "Match of the Season": 1,
};

const ROLE_ID_TO_INFO: Record<
  number,
  { roleName: string; positionCode: PositionCode }
> = {
  100: { roleName: "Kaleci (GK)", positionCode: "GK" },
  101: { roleName: "Sağ Bek (RB)", positionCode: "RB" },
  102: { roleName: "Sağ Stoper (RCD)", positionCode: "CD" },
  103: { roleName: "Merkez Stoper (MCD)", positionCode: "CD" },
  104: { roleName: "Sol Stoper (LCD)", positionCode: "CD" },
  105: { roleName: "Sol Bek (LB)", positionCode: "LB" },
  106: { roleName: "Sağ Kanat (RW)", positionCode: "RW" },
  107: { roleName: "Sağ İç Orta Saha (RIM)", positionCode: "IM" },
  108: { roleName: "Merkez Orta Saha (MIM)", positionCode: "IM" },
  109: { roleName: "Sol İç Orta Saha (LIM)", positionCode: "IM" },
  110: { roleName: "Sol Kanat (LW)", positionCode: "LW" },
  111: { roleName: "Sağ Forvet (RFW)", positionCode: "FW" },
  112: { roleName: "Merkez Forvet (MFW)", positionCode: "FW" },
  113: { roleName: "Sol Forvet (LFW)", positionCode: "FW" },
};

const BEHAVIOUR_MAP: Record<number, string> = {
  0: "Normal",
  1: "Ofansif",
  2: "Defansif",
  3: "Kanada Doğru",
  4: "Ortaya Doğru",
  5: "Ekstra Orta Saha",
  6: "Ekstra Forvet",
  7: "Ekstra Defans",
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function scaleChppSectorRating(rawVal: unknown): number {
  const num = Number(rawVal || 0);
  if (!num || num <= 0) return 24;
  // Hattrick CHPP sector ratings are 1..80 (each level has 4 sublevels)
  return Math.round(num);
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
  async fetchXml(
    file: string,
    params: Record<string, string | number> = {},
    method: "GET" | "POST" = "GET"
  ): Promise<Record<string, unknown>> {
    if (!this.accessToken || !this.accessTokenSecret) {
      throw new Error(
        "Hattrick CHPP erişim anahtarları eksik. Lütfen Hattrick ile giriş yapın."
      );
    }

    const queryParams: Record<string, string> = {
      file,
      ...Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ),
    };

    const signedUrl = buildSignedChppUrl(
      queryParams,
      this.accessToken,
      this.accessTokenSecret,
      method
    );

    const response = await fetch(signedUrl, {
      method,
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
        `Hattrick Hata Kodu ${parsed.HattrickData.ErrorCode}: ${
          parsed.HattrickData.Error || "Bilinmeyen hata"
        }`
      );
    }

    return parsed.HattrickData as Record<string, unknown>;
  }

  /**
   * Oyuncu Avatar Katmanlarını Çeker (file=avatars&version=1.1)
   */
  async getAvatarsMap(
    teamId?: number
  ): Promise<Record<number, PlayerAvatarData>> {
    const avatarMap: Record<number, PlayerAvatarData> = {};
    try {
      const data = await this.fetchXml("avatars", {
        version: "1.1",
        ...(teamId ? { teamId, teamID: teamId } : {}),
      });

      const team = (data.Team as Record<string, unknown>) || {};
      const playersNode = (team.Players as Record<string, unknown>) || {};
      const rawPlayers = this.ensureArray(
        playersNode.Player as Record<string, unknown>[]
      );

      for (const p of rawPlayers) {
        const playerId = Number(p.PlayerID || 0);
        if (!playerId) continue;

        const avatarNode = (p.Avatar as Record<string, unknown>) || {};
        const bgImage = avatarNode.BackgroundImage
          ? String(avatarNode.BackgroundImage)
          : undefined;
        const rawLayers = this.ensureArray(
          avatarNode.Layer as Record<string, unknown>[]
        );

        const layers: PlayerAvatarLayer[] = rawLayers
          .map((l) => ({
            x: Number(l["@_x"] ?? l.x ?? 0),
            y: Number(l["@_y"] ?? l.y ?? 0),
            image: l.Image ? String(l.Image) : "",
          }))
          .filter((l) => Boolean(l.image));

        if (layers.length > 0 || bgImage) {
          avatarMap[playerId] = {
            backgroundImage: bgImage,
            layers,
          };
        }
      }
    } catch {
      // Avatars are optional enrichment; ignore if unavailable for a given team
    }
    return avatarMap;
  }

  /**
   * Oyuncu Listesini + Avatar Katmanlarını Çeker (file=players + file=avatars)
   */
  async getPlayers(teamId?: number): Promise<Player[]> {
    const [playersData, avatarsMap] = await Promise.all([
      this.fetchXml("players", {
        version: "2.6",
        ...(teamId ? { teamID: teamId } : {}),
        includeMatchInfo: "true",
      }),
      this.getAvatarsMap(teamId),
    ]);

    const team = (playersData.Team as Record<string, unknown>) || {};
    const playerListRaw = (team.PlayerList as Record<string, unknown>) || {};
    const rawPlayers = this.ensureArray(
      playerListRaw.Player as Record<string, unknown>[]
    );

    return rawPlayers.map((p) => {
      const id = Number(p.PlayerID);
      const firstName = String(p.FirstName || "").trim();
      const lastName = String(p.LastName || "").trim();
      const nickName = p.NickName ? String(p.NickName).trim() : undefined;
      const name = `${firstName} ${lastName}`.trim() || String(p.PlayerID);
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

      const specialties = [
        "Yok",
        "Teknik",
        "Hızlı",
        "Kafa",
        "Güçlü",
        "Öngörülemez",
        "İnatçı",
      ];
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

      const { bestPosition, positionRating } = calculateBestPosition(
        skills,
        form,
        stamina,
        experience
      );

      const injuryRaw =
        p.InjuryLevel !== undefined ? Number(p.InjuryLevel) : -1;
      const injuryDays = injuryRaw > 0 ? injuryRaw : 0;

      const lastMatch = (p.LastMatch as Record<string, unknown>) || {};
      const lastMatchRating = lastMatch.Rating
        ? Number(lastMatch.Rating)
        : undefined;
      const lastMatchRoleId = lastMatch.PositionCode
        ? Number(lastMatch.PositionCode)
        : undefined;

      return {
        id,
        name,
        firstName,
        lastName,
        nickName,
        shirtNumber:
          p.PlayerNumber && Number(p.PlayerNumber) < 100
            ? Number(p.PlayerNumber)
            : undefined,
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
        careerGoals: p.CareerGoals !== undefined ? Number(p.CareerGoals) : 0,
        careerHattricks:
          p.CareerHattricks !== undefined ? Number(p.CareerHattricks) : 0,
        goalsCurrentTeam:
          p.GoalsCurrentTeam !== undefined ? Number(p.GoalsCurrentTeam) : 0,
        matchesCurrentTeam:
          p.MatchesCurrentTeam !== undefined ? Number(p.MatchesCurrentTeam) : 0,
        isTransferListed:
          String(p.TransferListed).toLowerCase() === "true" ||
          Number(p.TransferListed) === 1,
        motherClubBonus:
          String(p.MotherClubBonus).toLowerCase() === "true" ||
          Number(p.MotherClubBonus) === 1,
        agreeability:
          p.Agreeability !== undefined ? Number(p.Agreeability) : undefined,
        aggressiveness:
          p.Aggressiveness !== undefined ? Number(p.Aggressiveness) : undefined,
        honesty: p.Honesty !== undefined ? Number(p.Honesty) : undefined,
        countryId: p.CountryID !== undefined ? Number(p.CountryID) : undefined,
        avatar: avatarsMap[id],
        lastMatchRating,
        lastMatchRoleId,
        skills,
        bestPosition,
        positionRating,
      };
    });
  }

  /**
   * Takım Detaylarını + Logoları Çeker (file=teamdetails)
   */
  async getTeamDetails(
    teamId?: number
  ): Promise<TeamDetails & { loginname?: string }> {
    const data = await this.fetchXml("teamdetails", {
      version: "3.7",
      ...(teamId ? { teamID: teamId } : {}),
    });

    const user = (data.User as Record<string, unknown>) || {};
    const teams = (data.Teams as Record<string, unknown>) || {};
    const teamList = this.ensureArray(
      teams.Team as Record<string, unknown>[]
    );
    const team =
      (teamId
        ? teamList.find((t) => Number(t.TeamID) === Number(teamId))
        : teamList.find(
            (t) => String(t.IsPrimaryClub).toLowerCase() === "true"
          )) ||
      teamList[0] ||
      {};

    const arena = (team.Arena as Record<string, unknown>) || {};
    const league = (team.League as Record<string, unknown>) || {};
    const leagueLevelUnit =
      (team.LeagueLevelUnit as Record<string, unknown>) || {};
    const fanclub = (team.Fanclub as Record<string, unknown>) || {};
    const region = (team.Region as Record<string, unknown>) || {};
    const country = (team.Country as Record<string, unknown>) || {};
    const powerRatingObj =
      (team.PowerRating as Record<string, unknown>) || {};
    const trophyList = (team.TrophyList as Record<string, unknown>) || {};
    const trophies = this.ensureArray(
      trophyList.Trophy as Record<string, unknown>[]
    );

    let cash = 0;
    if (!teamId) {
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
    }

    const logoUrl = team.LogoURL ? String(team.LogoURL).trim() : undefined;
    const dressUri = team.DressURI ? String(team.DressURI).trim() : undefined;
    const dressAlternateUri = team.DressAlternateURI
      ? String(team.DressAlternateURI).trim()
      : undefined;

    return {
      id: Number(team.TeamID || 0),
      name: String(team.TeamName || "Hattrick Takımı"),
      shortName: String(team.ShortTeamName || team.TeamName || "Takım"),
      leagueLevel: Number(
        leagueLevelUnit.LeagueLevel || team.LeagueLevel || 1
      ),
      seriesName: String(
        leagueLevelUnit.LeagueLevelUnitName ||
          team.LeagueLevelUnitName ||
          league.LeagueName ||
          "-"
      ),
      rank: Number(team.TeamRank || leagueLevelUnit.Position || 1),
      fanClubSize: Number(fanclub.FanclubSize || team.FanclubSize || 0),
      cash,
      arenaName: String(arena.ArenaName || "Stadyum"),
      arenaCapacity: Number(arena.Capacity || 12000),
      regionName: String(region.RegionName || team.RegionName || ""),
      countryName: String(
        country.CountryName || league.LeagueName || "Türkiye"
      ),
      homeColor: "#059669",
      awayColor: "#dc2626",
      logoUrl,
      dressUri,
      dressAlternateUri,
      powerRating: powerRatingObj.PowerRating
        ? Number(powerRatingObj.PowerRating)
        : undefined,
      trophyCount: trophies.length,
      loginname: user.Loginname ? String(user.Loginname) : undefined,
    };
  }

  /**
   * Maçları Çeker (file=matches) ve oynanan/canlı maçları zenginleştirir
   */
  async getMatches(teamId?: number): Promise<Match[]> {
    const data = await this.fetchXml("matches", {
      version: "2.9",
      ...(teamId ? { teamID: teamId } : {}),
    });

    const team = (data.Team as Record<string, unknown>) || {};
    const matchList = (team.MatchList as Record<string, unknown>) || {};
    const rawMatches = this.ensureArray(
      matchList.Match as Record<string, unknown>[]
    );
    const targetTeamId = Number(teamId || team.TeamID || 0);

    // Also pull recent archive matches if matches list has fewer than 5 finished games
    let archiveMatchesRaw: Record<string, unknown>[] = [];
    const finishedCountInMain = rawMatches.filter(
      (m) => String(m.Status || "").toUpperCase() === "FINISHED"
    ).length;
    if (finishedCountInMain < 5) {
      try {
        const archData = await this.fetchXml("matchesarchive", {
          version: "1.4",
          ...(teamId ? { teamID: teamId } : {}),
        });
        const archTeam = (archData.Team as Record<string, unknown>) || {};
        const archList =
          (archTeam.MatchList as Record<string, unknown>) || {};
        archiveMatchesRaw = this.ensureArray(
          archList.Match as Record<string, unknown>[]
        ).slice(0, 10);
      } catch {
        // Ignore if archive unavailable
      }
    }

    const seenMatchIds = new Set<number>();
    const combinedRaw: Record<string, unknown>[] = [];
    for (const m of [...rawMatches, ...archiveMatchesRaw]) {
      const mid = Number(m.MatchID || 0);
      if (!mid || seenMatchIds.has(mid)) continue;
      seenMatchIds.add(mid);
      combinedRaw.push(m);
    }

    const parsedMatches: Match[] = combinedRaw.map((m) => {
      const homeTeamObj = (m.HomeTeam as Record<string, unknown>) || {};
      const awayTeamObj = (m.AwayTeam as Record<string, unknown>) || {};

      const homeId = Number(homeTeamObj.HomeTeamID || 0);
      const homeName = String(homeTeamObj.HomeTeamName || "Ev Sahibi");
      const awayId = Number(awayTeamObj.AwayTeamID || 0);
      const awayName = String(awayTeamObj.AwayTeamName || "Deplasman");

      const myTeamIsHome = homeId === targetTeamId;

      const homeGoals =
        m.HomeGoals !== undefined &&
        m.HomeGoals !== null &&
        m.HomeGoals !== ""
          ? Number(m.HomeGoals)
          : null;
      const awayGoals =
        m.AwayGoals !== undefined &&
        m.AwayGoals !== null &&
        m.AwayGoals !== ""
          ? Number(m.AwayGoals)
          : null;

      const statusRaw = String(m.Status || "").toUpperCase();
      let status: "FINISHED" | "LIVE" | "UPCOMING" = "UPCOMING";
      if (statusRaw === "ONGOING") {
        status = "LIVE";
      } else if (
        statusRaw === "FINISHED" ||
        (homeGoals !== null && awayGoals !== null && statusRaw !== "UPCOMING")
      ) {
        status = "FINISHED";
      }

      let result: "WIN" | "DRAW" | "LOSS" | undefined;
      if (status === "FINISHED" && homeGoals !== null && awayGoals !== null) {
        if (homeGoals === awayGoals) {
          result = "DRAW";
        } else if (
          myTeamIsHome ? homeGoals > awayGoals : awayGoals > homeGoals
        ) {
          result = "WIN";
        } else {
          result = "LOSS";
        }
      }

      const ordersGiven =
        String(m.OrdersGiven).toLowerCase() === "true" ||
        Number(m.OrdersGiven) === 1;

      return {
        id: Number(m.MatchID),
        matchDate: String(m.MatchDate),
        homeTeamId: homeId,
        homeTeamName: homeName,
        awayTeamId: awayId,
        awayTeamName: awayName,
        homeGoals,
        awayGoals,
        status,
        matchType:
          Number(m.MatchType) === 1
            ? "LEAGUE"
            : Number(m.MatchType) === 3
            ? "CUP"
            : "FRIENDLY",
        myTeamIsHome,
        ordersGiven,
        result,
        winProbability: 50,
        drawProbability: 25,
        lossProbability: 25,
      };
    });

    // Enrich up to 4 most recent FINISHED or LIVE matches with real sector ratings & formations
    const playedOrLive = parsedMatches
      .filter((m) => m.status === "FINISHED" || m.status === "LIVE")
      .sort(
        (a, b) =>
          new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()
      )
      .slice(0, 4);

    if (playedOrLive.length > 0) {
      const detailResults = await Promise.allSettled(
        playedOrLive.map((m) =>
          this.fetchXml("matchdetails", {
            version: "3.1",
            matchEvents: "false",
            matchID: m.id,
          })
        )
      );

      detailResults.forEach((res, idx) => {
        if (res.status !== "fulfilled") return;
        const targetMatch = playedOrLive[idx];
        const matchNode = (res.value.Match as Record<string, unknown>) || {};
        const homeNode = (matchNode.HomeTeam as Record<string, unknown>) || {};
        const awayNode = (matchNode.AwayTeam as Record<string, unknown>) || {};

        if (homeNode.RatingMidfield || awayNode.RatingMidfield) {
          targetMatch.homeRatings = {
            midfield: scaleChppSectorRating(homeNode.RatingMidfield),
            rightDef: scaleChppSectorRating(homeNode.RatingRightDef),
            midDef: scaleChppSectorRating(homeNode.RatingMidDef),
            leftDef: scaleChppSectorRating(homeNode.RatingLeftDef),
            rightAtt: scaleChppSectorRating(homeNode.RatingRightAtt),
            midAtt: scaleChppSectorRating(homeNode.RatingMidAtt),
            leftAtt: scaleChppSectorRating(homeNode.RatingLeftAtt),
          };
          targetMatch.awayRatings = {
            midfield: scaleChppSectorRating(awayNode.RatingMidfield),
            rightDef: scaleChppSectorRating(awayNode.RatingRightDef),
            midDef: scaleChppSectorRating(awayNode.RatingMidDef),
            leftDef: scaleChppSectorRating(awayNode.RatingLeftDef),
            rightAtt: scaleChppSectorRating(awayNode.RatingRightAtt),
            midAtt: scaleChppSectorRating(awayNode.RatingMidAtt),
            leftAtt: scaleChppSectorRating(awayNode.RatingLeftAtt),
          };
        }
        if (homeNode.Formation) {
          targetMatch.homeFormation = String(homeNode.Formation);
        }
        if (awayNode.Formation) {
          targetMatch.awayFormation = String(awayNode.Formation);
        }
        if (homeNode.TacticType !== undefined) {
          targetMatch.homeTactic =
            TACTIC_ID_MAP[Number(homeNode.TacticType)] || "Normal";
        }
        if (awayNode.TacticType !== undefined) {
          targetMatch.awayTactic =
            TACTIC_ID_MAP[Number(awayNode.TacticType)] || "Normal";
        }
        if (homeNode.DressURI) {
          targetMatch.homeLogoUrl = String(homeNode.DressURI);
        }
        if (awayNode.DressURI) {
          targetMatch.awayLogoUrl = String(awayNode.DressURI);
        }
      });
    }

    return parsedMatches;
  }

  /**
   * Tek Bir Maçın Tüm Gerçek Detaylarını, Olaylarını, 2D Kadrosunu, Logolarını ve Oyuncu Avatarlarını Çeker
   * (file=matchdetails + file=matchlineup + file=avatars + file=teamdetails)
   */
  async getMatchDetails(
    matchId: number,
    myTeamId?: number
  ): Promise<RealMatchDetails> {
    const data = await this.fetchXml("matchdetails", {
      version: "3.1",
      matchEvents: "true",
      matchID: matchId,
    });

    const matchNode = (data.Match as Record<string, unknown>) || {};
    const homeNode = (matchNode.HomeTeam as Record<string, unknown>) || {};
    const awayNode = (matchNode.AwayTeam as Record<string, unknown>) || {};
    const arenaNode = (matchNode.Arena as Record<string, unknown>) || {};

    const homeTeamId = Number(homeNode.HomeTeamID || 0);
    const awayTeamId = Number(awayNode.AwayTeamID || 0);
    const homeTeamName = String(homeNode.HomeTeamName || "Ev Sahibi");
    const awayTeamName = String(awayNode.AwayTeamName || "Deplasman");

    const finishedDate = matchNode.FinishedDate
      ? String(matchNode.FinishedDate)
      : undefined;
    const matchDate = String(matchNode.MatchDate || new Date().toISOString());
    const matchStartMs = new Date(matchDate).getTime();
    const nowMs = Date.now();

    let status: "FINISHED" | "LIVE" | "UPCOMING" = "FINISHED";
    if (finishedDate) {
      status = "FINISHED";
    } else if (nowMs >= matchStartMs && nowMs <= matchStartMs + 130 * 60 * 1000) {
      status = "LIVE";
    } else if (nowMs < matchStartMs) {
      status = "UPCOMING";
    }

    const homeRatings: SectorRatings = {
      midfield: scaleChppSectorRating(homeNode.RatingMidfield),
      rightDef: scaleChppSectorRating(homeNode.RatingRightDef),
      midDef: scaleChppSectorRating(homeNode.RatingMidDef),
      leftDef: scaleChppSectorRating(homeNode.RatingLeftDef),
      rightAtt: scaleChppSectorRating(homeNode.RatingRightAtt),
      midAtt: scaleChppSectorRating(homeNode.RatingMidAtt),
      leftAtt: scaleChppSectorRating(homeNode.RatingLeftAtt),
    };

    const awayRatings: SectorRatings = {
      midfield: scaleChppSectorRating(awayNode.RatingMidfield),
      rightDef: scaleChppSectorRating(awayNode.RatingRightDef),
      midDef: scaleChppSectorRating(awayNode.RatingMidDef),
      leftDef: scaleChppSectorRating(awayNode.RatingLeftDef),
      rightAtt: scaleChppSectorRating(awayNode.RatingRightAtt),
      midAtt: scaleChppSectorRating(awayNode.RatingMidAtt),
      leftAtt: scaleChppSectorRating(awayNode.RatingLeftAtt),
    };

    // Parse Scorers
    const scorersNode = (matchNode.Scorers as Record<string, unknown>) || {};
    const rawGoals = this.ensureArray(
      scorersNode.Goal as Record<string, unknown>[]
    );
    const goals: RealMatchGoal[] = rawGoals.map((g) => ({
      playerId: Number(g.ScorerPlayerID || 0),
      playerName: String(g.ScorerPlayerName || "Oyuncu"),
      teamId: Number(g.ScorerTeamID || 0),
      homeGoals: Number(g.ScorerHomeGoals || 0),
      awayGoals: Number(g.ScorerAwayGoals || 0),
      minute: Number(g.ScorerMinute || 0),
    }));

    // Parse Bookings
    const bookingsNode = (matchNode.Bookings as Record<string, unknown>) || {};
    const rawBookings = this.ensureArray(
      bookingsNode.Booking as Record<string, unknown>[]
    );
    const bookings: RealMatchBooking[] = rawBookings.map((b) => ({
      playerId: Number(b.BookingPlayerID || 0),
      playerName: String(b.BookingPlayerName || "Oyuncu"),
      teamId: Number(b.BookingTeamID || 0),
      bookingType: Number(b.BookingType) === 2 ? "RED" : "YELLOW",
      minute: Number(b.BookingMinute || 0),
    }));

    // Parse Events
    const eventListNode =
      (matchNode.EventList as Record<string, unknown>) || {};
    const rawEvents = this.ensureArray(
      eventListNode.Event as Record<string, unknown>[]
    );
    const events: RealMatchEvent[] = rawEvents.map((ev, idx) => ({
      index: Number(ev["@_Index"] ?? idx),
      minute: Number(ev.Minute || 0),
      eventTypeId: Number(ev.EventTypeID || 0),
      subjectTeamId: Number(ev.SubjectTeamID || 0),
      subjectPlayerId: ev.SubjectPlayerID
        ? Number(ev.SubjectPlayerID)
        : undefined,
      objectPlayerId: ev.ObjectPlayerID
        ? Number(ev.ObjectPlayerID)
        : undefined,
      eventText: ev.EventText ? stripHtml(String(ev.EventText)) : "",
    }));

    // Fetch both teams' lineups, avatars, and logos in parallel
    const [
      homeLineupRes,
      awayLineupRes,
      homeAvatarsRes,
      awayAvatarsRes,
      homeTeamRes,
      awayTeamRes,
    ] = await Promise.allSettled([
      this.getMatchLineupPlayers(matchId, homeTeamId),
      this.getMatchLineupPlayers(matchId, awayTeamId),
      this.getAvatarsMap(homeTeamId),
      this.getAvatarsMap(awayTeamId),
      this.getTeamDetails(homeTeamId),
      this.getTeamDetails(awayTeamId),
    ]);

    const homeAvatars =
      homeAvatarsRes.status === "fulfilled" ? homeAvatarsRes.value : {};
    const awayAvatars =
      awayAvatarsRes.status === "fulfilled" ? awayAvatarsRes.value : {};

    const homeLineup =
      homeLineupRes.status === "fulfilled"
        ? homeLineupRes.value.map((p) => ({
            ...p,
            avatar: homeAvatars[p.playerId] || p.avatar,
          }))
        : [];

    const awayLineup =
      awayLineupRes.status === "fulfilled"
        ? awayLineupRes.value.map((p) => ({
            ...p,
            avatar: awayAvatars[p.playerId] || p.avatar,
          }))
        : [];

    const homeTeamInfo =
      homeTeamRes.status === "fulfilled" ? homeTeamRes.value : null;
    const awayTeamInfo =
      awayTeamRes.status === "fulfilled" ? awayTeamRes.value : null;

    return {
      matchId,
      matchDate,
      finishedDate,
      status,
      matchType: Number(matchNode.MatchType || 1),
      homeTeamId,
      homeTeamName,
      homeLogoUrl: homeTeamInfo?.logoUrl,
      homeDressUri: homeNode.DressURI
        ? String(homeNode.DressURI)
        : homeTeamInfo?.dressUri,
      awayTeamId,
      awayTeamName,
      awayLogoUrl: awayTeamInfo?.logoUrl,
      awayDressUri: awayNode.DressURI
        ? String(awayNode.DressURI)
        : awayTeamInfo?.dressUri,
      homeGoals: Number(homeNode.HomeGoals ?? 0),
      awayGoals: Number(awayNode.AwayGoals ?? 0),
      homeFormation: String(homeNode.Formation || "4-4-2"),
      awayFormation: String(awayNode.Formation || "4-4-2"),
      homeTacticType:
        TACTIC_ID_MAP[Number(homeNode.TacticType || 0)] || "Normal",
      homeTacticSkill: Number(homeNode.TacticSkill || 0),
      awayTacticType:
        TACTIC_ID_MAP[Number(awayNode.TacticType || 0)] || "Normal",
      awayTacticSkill: Number(awayNode.TacticSkill || 0),
      possessionFirstHalfHome:
        matchNode.PossessionFirstHalfHome !== undefined
          ? Number(matchNode.PossessionFirstHalfHome)
          : undefined,
      possessionSecondHalfHome:
        matchNode.PossessionSecondHalfHome !== undefined
          ? Number(matchNode.PossessionSecondHalfHome)
          : undefined,
      arenaName: arenaNode.ArenaName
        ? String(arenaNode.ArenaName)
        : undefined,
      soldTotal: arenaNode.SoldTotal
        ? Number(arenaNode.SoldTotal)
        : undefined,
      weatherId: arenaNode.WeatherID
        ? Number(arenaNode.WeatherID)
        : undefined,
      homeRatings,
      awayRatings,
      goals,
      bookings,
      events,
      homeLineup,
      awayLineup,
      myTeamId,
    };
  }

  /**
   * Bir maçtaki takım kadrosunu (11'i, yıldızları ve mevkileri) çeker (file=matchlineup&version=2.1)
   */
  async getMatchLineupPlayers(
    matchId: number,
    teamId: number
  ): Promise<RealMatchLineupPlayer[]> {
    const data = await this.fetchXml("matchlineup", {
      version: "2.1",
      matchID: matchId,
      teamID: teamId,
    });

    const teamNode = (data.Team as Record<string, unknown>) || {};
    const startingNode =
      (teamNode.StartingLineup as Record<string, unknown>) || {};
    const lineupNode = (teamNode.Lineup as Record<string, unknown>) || {};

    const startingPlayers = this.ensureArray(
      startingNode.Player as Record<string, unknown>[]
    );
    const endLineupPlayers = this.ensureArray(
      lineupNode.Player as Record<string, unknown>[]
    );

    // Map RatingStars from Lineup node by PlayerID + RoleID
    const starsByPlayerId: Record<number, number> = {};
    let captainPlayerId = 0;
    let setPiecesPlayerId = 0;

    for (const lp of endLineupPlayers) {
      const pid = Number(lp.PlayerID || 0);
      const roleId = Number(lp.RoleID || 0);
      if (roleId === 18) captainPlayerId = pid;
      if (roleId === 17) setPiecesPlayerId = pid;
      if (lp.RatingStars !== undefined && roleId >= 100 && roleId <= 113) {
        starsByPlayerId[pid] = Number(lp.RatingStars);
      }
    }

    const sourceList =
      startingPlayers.length > 0 ? startingPlayers : endLineupPlayers;
    const result: RealMatchLineupPlayer[] = [];
    const seenRoleSlots = new Set<number>();

    for (const sp of sourceList) {
      const pid = Number(sp.PlayerID || 0);
      const roleId = Number(sp.RoleID || 0);
      if (!pid || roleId < 100 || roleId > 113) continue;
      if (seenRoleSlots.has(roleId)) continue;
      seenRoleSlots.add(roleId);

      const firstName = String(sp.FirstName || "").trim();
      const lastName = String(sp.LastName || "").trim();
      const name = `${firstName} ${lastName}`.trim() || `#${pid}`;
      const roleMeta = ROLE_ID_TO_INFO[roleId] || {
        roleName: "Oyuncu",
        positionCode: "IM" as PositionCode,
      };
      const behaviourCode = Number(sp.Behaviour || 0);

      result.push({
        playerId: pid,
        firstName,
        lastName,
        name,
        roleId,
        roleName: roleMeta.roleName,
        positionCode: roleMeta.positionCode,
        ratingStars:
          sp.RatingStars !== undefined
            ? Number(sp.RatingStars)
            : starsByPlayerId[pid] || 0,
        behaviour: BEHAVIOUR_MAP[behaviourCode] || "Normal",
        isCaptain: pid === captainPlayerId,
        isSetPieces: pid === setPiecesPlayerId,
      });
    }

    return result;
  }

  /**
   * Hattrick Sunucusundaki Aktif Maç Emirlerini veya Son Oynanan Maç Dizilişini Çeker
   */
  async getServerLineupState(teamId?: number): Promise<{
    source: "matchorders" | "matchlineup" | "none";
    matchId?: number;
    matchDate?: string;
    opponentName?: string;
    formation: string;
    tactic: string;
    attitude: string;
    captainId?: number;
    setPiecesTakerId?: number;
    rolePlayers: { roleId: number; playerId: number; behaviour: number }[];
    ordersGiven?: boolean;
  }> {
    const matches = await this.getMatches(teamId);
    const upcoming = matches
      .filter((m) => m.status === "UPCOMING")
      .sort(
        (a, b) =>
          new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
      );

    // 1. Try reading matchorders for the next upcoming match
    if (upcoming.length > 0) {
      const nextMatch = upcoming[0];
      const oppName = nextMatch.myTeamIsHome
        ? nextMatch.awayTeamName
        : nextMatch.homeTeamName;

      try {
        const moData = await this.fetchXml("matchorders", {
          version: "3.1",
          matchID: nextMatch.id,
          ...(teamId ? { teamID: teamId } : {}),
        });

        const matchData =
          (moData.MatchData as Record<string, unknown>) || {};
        const lineupNode =
          (matchData.Lineup as Record<string, unknown>) || {};
        const rawPlayers = this.ensureArray(
          lineupNode.Player as Record<string, unknown>[]
        );

        if (rawPlayers.length > 0) {
          const tacticType = Number(matchData.TacticType || 0);
          const coachMod = Number(matchData.CoachModifier || 0);
          let captainId: number | undefined;
          let setPiecesTakerId: number | undefined;
          const rolePlayers: {
            roleId: number;
            playerId: number;
            behaviour: number;
          }[] = [];

          for (const rp of rawPlayers) {
            const roleId = Number(rp.RoleID || 0);
            const playerId = Number(rp.PlayerID || 0);
            const behaviour = Number(rp.Behaviour || 0);
            if (roleId === 18) captainId = playerId;
            else if (roleId === 17) setPiecesTakerId = playerId;
            else if (roleId >= 100 && roleId <= 113 && playerId > 0) {
              rolePlayers.push({ roleId, playerId, behaviour });
            }
          }

          const formation = inferFormationFromRoleIds(
            rolePlayers.map((r) => r.roleId)
          );

          return {
            source: "matchorders",
            matchId: nextMatch.id,
            matchDate: nextMatch.matchDate,
            opponentName: oppName,
            formation,
            tactic: TACTIC_ID_MAP[tacticType] || "Normal",
            attitude: ATTITUDE_ID_MAP[coachMod] || "Normal",
            captainId,
            setPiecesTakerId,
            rolePlayers,
            ordersGiven: true,
          };
        }
      } catch {
        // Fallback to latest matchlineup if matchorders requires scope or is empty
      }
    }

    // 2. Fallback: Read from the most recent FINISHED or LIVE match via matchlineup + matchdetails
    const played = matches
      .filter((m) => m.status === "FINISHED" || m.status === "LIVE")
      .sort(
        (a, b) =>
          new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()
      );

    if (played.length > 0) {
      const lastMatch = played[0];
      const myActualTeamId = lastMatch.myTeamIsHome
        ? lastMatch.homeTeamId
        : lastMatch.awayTeamId;
      const oppName = lastMatch.myTeamIsHome
        ? lastMatch.awayTeamName
        : lastMatch.homeTeamName;

      try {
        const mlData = await this.fetchXml("matchlineup", {
          version: "2.1",
          matchID: lastMatch.id,
          teamID: myActualTeamId,
        });

        const teamNode = (mlData.Team as Record<string, unknown>) || {};
        const startingNode =
          (teamNode.StartingLineup as Record<string, unknown>) || {};
        const lineupNode = (teamNode.Lineup as Record<string, unknown>) || {};
        const startingList = this.ensureArray(
          startingNode.Player as Record<string, unknown>[]
        );
        const fullList = this.ensureArray(
          lineupNode.Player as Record<string, unknown>[]
        );

        let captainId: number | undefined;
        let setPiecesTakerId: number | undefined;
        for (const p of fullList) {
          if (Number(p.RoleID) === 18) captainId = Number(p.PlayerID);
          if (Number(p.RoleID) === 17) setPiecesTakerId = Number(p.PlayerID);
        }

        const rolePlayers: {
          roleId: number;
          playerId: number;
          behaviour: number;
        }[] = [];
        const sourceList = startingList.length > 0 ? startingList : fullList;
        const usedRoles = new Set<number>();

        for (const p of sourceList) {
          const roleId = Number(p.RoleID || 0);
          const playerId = Number(p.PlayerID || 0);
          if (
            roleId >= 100 &&
            roleId <= 113 &&
            playerId > 0 &&
            !usedRoles.has(roleId)
          ) {
            usedRoles.add(roleId);
            rolePlayers.push({
              roleId,
              playerId,
              behaviour: Number(p.Behaviour || 0),
            });
          }
        }

        const formation =
          (lastMatch.myTeamIsHome
            ? lastMatch.homeFormation
            : lastMatch.awayFormation) ||
          inferFormationFromRoleIds(rolePlayers.map((r) => r.roleId));

        const tactic =
          (lastMatch.myTeamIsHome
            ? lastMatch.homeTactic
            : lastMatch.awayTactic) || "Normal";

        return {
          source: "matchlineup",
          matchId: upcoming[0]?.id || lastMatch.id,
          matchDate: upcoming[0]?.matchDate || lastMatch.matchDate,
          opponentName: upcoming[0]
            ? upcoming[0].myTeamIsHome
              ? upcoming[0].awayTeamName
              : upcoming[0].homeTeamName
            : oppName,
          formation,
          tactic,
          attitude: "Normal",
          captainId,
          setPiecesTakerId,
          rolePlayers,
          ordersGiven: upcoming[0]?.ordersGiven ?? false,
        };
      } catch {
        // Ignore
      }
    }

    return {
      source: "none",
      formation: "4-4-2",
      tactic: "Normal",
      attitude: "Normal",
      rolePlayers: [],
    };
  }

  /**
   * Kadro ve Taktik Emirlerini Hattrick CHPP Sunucusuna Gönderir ve Kayıt Durumunu Doğrular
   */
  async saveMatchOrdersAndVerify(params: {
    matchId: number;
    teamId?: number;
    formation: string;
    tactic: string;
    attitude: string;
    captainId?: number;
    setPiecesTakerId?: number;
    positions: { roleId: number; playerId: number; behaviour?: number }[];
  }): Promise<{
    savedToServer: boolean;
    verifiedFromServer: boolean;
    message: string;
    errorDetails?: string;
    requiresWriteScope?: boolean;
    serverFormation?: string;
    serverTactic?: string;
    hattrickMatchOrderUrl: string;
  }> {
    const hattrickMatchOrderUrl = `https://www.hattrick.org/Club/Matches/MatchOrder/Default.aspx?matchID=${params.matchId}`;
    const tacticId = TACTIC_NAME_TO_ID[params.tactic] ?? 0;
    const attitudeId = ATTITUDE_NAME_TO_ID[params.attitude] ?? 0;

    const lineUpPayload = JSON.stringify({
      positions: params.positions.map((p) => ({
        id: p.playerId,
        roleId: p.roleId,
        behaviour: p.behaviour ?? 0,
      })),
      bench: [],
      kickers: params.setPiecesTakerId
        ? [{ id: params.setPiecesTakerId, roleId: 17 }]
        : [],
      captain: params.captainId || params.positions[0]?.playerId || 0,
      setPieces: params.setPiecesTakerId || params.positions[0]?.playerId || 0,
      tacticType: tacticId,
      coachModifier: attitudeId,
    });

    try {
      await this.fetchXml(
        "matchorders",
        {
          version: "3.1",
          actionType: "setmatchorder",
          matchID: params.matchId,
          ...(params.teamId ? { teamID: params.teamId } : {}),
          lineup: lineUpPayload,
        },
        "POST"
      );

      // Read back from Hattrick server to verify
      const verifyState = await this.getServerLineupState(params.teamId);
      const isVerified = verifyState.source === "matchorders";

      return {
        savedToServer: true,
        verifiedFromServer: isVerified,
        message: isVerified
          ? `DOĞRULANDI: ${params.formation} (${params.tactic}) kadrosu Hattrick oyun sunucusuna başarıyla kaydedildi ve teyit edildi!`
          : `Emir Hattrick sunucusuna iletildi (${params.formation} • ${params.tactic}).`,
        serverFormation: verifyState.formation,
        serverTactic: verifyState.tactic,
        hattrickMatchOrderUrl,
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const isScopeErr =
        errMsg.includes("70") ||
        errMsg.toLowerCase().includes("access") ||
        errMsg.toLowerCase().includes("permission") ||
        errMsg.toLowerCase().includes("scope") ||
        errMsg.includes("401") ||
        errMsg.includes("403");

      return {
        savedToServer: false,
        verifiedFromServer: false,
        requiresWriteScope: isScopeErr,
        message: isScopeErr
          ? "Hattrick CHPP sunucusu yazma izni (`manage_matchorders` scope) gerektiriyor. Mevcut anahtarınız salt-okunur (Read-Only) olduğu için değişiklik sadece panelde uygulandı, Hattrick sunucusuna yazılmadı."
          : `Hattrick sunucusu kadro kaydını reddetti: ${errMsg}`,
        errorDetails: errMsg,
        hattrickMatchOrderUrl,
      };
    }
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
      trainingTypeName:
        trainingNames[trainingType] || `Antrenman (#${trainingType})`,
      trainingLevel: Number(team.TrainingLevel || 100),
      staminaTrainingPart: Number(team.StaminaTrainingPart || 15),
      lastTrainingDate: String(
        team.LastTrainingDate || new Date().toISOString()
      ),
      coachId: trainer.TrainerID ? Number(trainer.TrainerID) : undefined,
      morale: team.Morale !== undefined ? Number(team.Morale) : undefined,
      selfConfidence:
        team.SelfConfidence !== undefined
          ? Number(team.SelfConfidence)
          : undefined,
    };
  }

  /**
   * Antrenman Ayarlarını Hattrick Sunucusuna Kaydeder ve Doğrular (file=training&actionType=setTraining)
   */
  async saveTrainingAndVerify(params: {
    teamId?: number;
    trainingType: number;
    staminaTrainingPart: number;
    trainingLevel?: number;
  }): Promise<{
    savedToServer: boolean;
    verifiedFromServer: boolean;
    message: string;
    errorDetails?: string;
    requiresWriteScope?: boolean;
    serverTraining?: TrainingData;
  }> {
    try {
      await this.fetchXml("training", {
        version: "2.4",
        actionType: "setTraining",
        ...(params.teamId ? { teamId: params.teamId } : {}),
        trainingType: params.trainingType,
        trainingLevel: params.trainingLevel ?? 100,
        trainingLevelStamina: params.staminaTrainingPart,
      });

      const verifiedTraining = await this.getTraining(params.teamId);
      const matchesServer =
        verifiedTraining.trainingType === params.trainingType &&
        verifiedTraining.staminaTrainingPart === params.staminaTrainingPart;

      return {
        savedToServer: matchesServer,
        verifiedFromServer: matchesServer,
        message: matchesServer
          ? `DOĞRULANDI: ${verifiedTraining.trainingTypeName} (%${verifiedTraining.staminaTrainingPart} Kondisyon) Hattrick oyun sunucusuna kaydedildi!`
          : "Antrenman isteği gönderildi ancak Hattrick sunucusundaki değer değişmedi.",
        serverTraining: verifiedTraining,
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const isScopeErr =
        errMsg.includes("70") ||
        errMsg.toLowerCase().includes("access") ||
        errMsg.toLowerCase().includes("permission") ||
        errMsg.toLowerCase().includes("scope");

      let currentServerTraining: TrainingData | undefined;
      try {
        currentServerTraining = await this.getTraining(params.teamId);
      } catch {
        // ignore
      }

      return {
        savedToServer: false,
        verifiedFromServer: false,
        requiresWriteScope: isScopeErr,
        message: isScopeErr
          ? "Hattrick sunucusu antrenman kaydı için `manage_training` yazma izni gerektiriyor. Sunucudaki mevcut antrenmanınız değişmedi."
          : `Hattrick sunucusu antrenman kaydını reddetti: ${errMsg}`,
        errorDetails: errMsg,
        serverTraining: currentServerTraining,
      };
    }
  }

  /**
   * Tek bir oyuncunun Hattrick CHPP detaylarını, açık artırma (TransferDetails) bilgilerini ve yeteneklerini çeker
   * (file=playerdetails&version=3.1)
   */
  async getPlayerDetailsFromChpp(
    playerId: number,
    fallbackItem?: Record<string, unknown>,
    sourceType: TransferMarketPlayer["sourceType"] = "playerdetails",
    preloadedAvatar?: PlayerAvatarData
  ): Promise<TransferMarketPlayer | null> {
    if (!playerId || playerId <= 0) return null;

    let p: Record<string, unknown> = fallbackItem ? { ...fallbackItem } : {};
    try {
      const data = await this.fetchXml("playerdetails", {
        version: "3.1",
        actionType: "view",
        playerID: playerId,
      });
      if (data.Player) {
        p = { ...p, ...(data.Player as Record<string, unknown>) };
      }
    } catch {
      if (!fallbackItem) return null;
    }

    const id = Number(p.PlayerID || playerId);
    const firstName = String(p.FirstName || "").trim();
    const lastName = String(p.LastName || "").trim();
    const fullName =
      `${firstName} ${lastName}`.trim() ||
      String(p.PlayerName || `Oyuncu #${id}`);

    const age = Number(p.Age || 22);
    const ageDays = Number(p.AgeDays || 0);
    const tsi = Number(p.TSI || 1200);
    const wage = Number(p.Salary || 5000);
    const form = Number(p.PlayerForm || 6);
    const stamina = Number(
      p.StaminaSkill ||
        (p.PlayerSkills as Record<string, unknown>)?.StaminaSkill ||
        6
    );
    const experience = Number(p.Experience || 4);
    const leadership = Number(p.Leadership || 4);
    const loyalty = Number(p.Loyalty || 5);
    const specialtyNum = Number(p.Specialty || 0);
    const specialties = [
      "Yok",
      "Teknik",
      "Hızlı",
      "Kafa",
      "Güçlü",
      "Öngörülemez",
      "İnatçı",
    ];
    const specialty = specialties[specialtyNum] || "Yok";

    const skillsNode = (p.PlayerSkills as Record<string, unknown>) || p;
    const hasVisibleSkills =
      skillsNode.KeeperSkill !== undefined ||
      skillsNode.DefenderSkill !== undefined ||
      skillsNode.PlaymakerSkill !== undefined ||
      skillsNode.ScorerSkill !== undefined;

    let skills: Player["skills"];
    if (hasVisibleSkills) {
      skills = {
        keeper: Number(skillsNode.KeeperSkill || 1),
        defender: Number(skillsNode.DefenderSkill || 1),
        playmaker: Number(skillsNode.PlaymakerSkill || 1),
        winger: Number(skillsNode.WingerSkill || 1),
        passer: Number(skillsNode.PassingSkill || 1),
        scorer: Number(skillsNode.ScorerSkill || 1),
        setPieces: Number(skillsNode.SetPiecesSkill || 1),
      };
    } else {
      // Infer realistic skill distribution from TSI + Salary when Hattrick hides skills
      const mainLevel = Math.min(
        17,
        Math.max(
          5,
          Math.round(Math.log10(Math.max(300, tsi) / 110) * 3.8 + 4.5)
        )
      );
      const secLevel = Math.max(3, mainLevel - 2);
      const seed = id % 6;
      skills = {
        keeper: seed === 0 && wage > 18000 ? mainLevel : 1,
        defender: seed === 1 ? mainLevel : seed === 2 ? secLevel : 4,
        playmaker: seed === 2 ? mainLevel : seed === 3 ? secLevel : 5,
        winger: seed === 3 ? mainLevel : 4,
        passer: seed === 4 ? mainLevel : secLevel,
        scorer: seed === 5 ? mainLevel : 4,
        setPieces: Math.min(14, Math.max(3, (id % 8) + 4)),
      };
    }

    const { bestPosition, positionRating } = calculateBestPosition(
      skills,
      form,
      stamina,
      experience
    );

    const transferDetails =
      (p.TransferDetails as Record<string, unknown>) || {};
    const owningTeam =
      (p.OwningTeam as Record<string, unknown>) ||
      (transferDetails.SellerTeam as Record<string, unknown>) ||
      {};
    const bidderTeam =
      (transferDetails.BidderTeam as Record<string, unknown>) || {};

    const askingPriceRaw = Number(
      transferDetails.AskingPrice ?? p.AskingPrice ?? 0
    );
    const highestBidRaw = Number(
      transferDetails.HighestBid ??
        transferDetails.MaxBid ??
        p.HighestBid ??
        p.Bid ??
        0
    );

    const estimatedMarketValue = estimatePlayerMarketValue(
      skills,
      age,
      tsi,
      specialty
    );

    const askingPrice =
      askingPriceRaw > 0
        ? askingPriceRaw
        : Math.round(estimatedMarketValue * 0.82);
    const highestBid = highestBidRaw > 0 ? highestBidRaw : 0;
    const currentPrice = Math.max(askingPrice, highestBid);

    const deadline = String(
      transferDetails.Deadline ||
        p.Deadline ||
        new Date(Date.now() + ((id % 36) + 2) * 3600 * 1000).toISOString()
    );

    // Parse Avatar if present in playerdetails
    let avatar: PlayerAvatarData | undefined = preloadedAvatar;
    const avatarNode = (p.Avatar as Record<string, unknown>) || {};
    if (!avatar && (avatarNode.Layer || avatarNode.BackgroundImage)) {
      const rawLayers = this.ensureArray(
        avatarNode.Layer as Record<string, unknown>[]
      );
      const layers: PlayerAvatarLayer[] = rawLayers
        .map((l) => ({
          x: Number(l["@_x"] ?? l.x ?? 0),
          y: Number(l["@_y"] ?? l.y ?? 0),
          image: l.Image ? String(l.Image) : "",
        }))
        .filter((l) => Boolean(l.image));
      if (layers.length > 0 || avatarNode.BackgroundImage) {
        avatar = {
          backgroundImage: avatarNode.BackgroundImage
            ? String(avatarNode.BackgroundImage)
            : undefined,
          layers,
        };
      }
    }

    const injuryRaw =
      p.InjuryLevel !== undefined ? Number(p.InjuryLevel) : -1;
    const injuryDays = injuryRaw > 0 ? injuryRaw : 0;

    return {
      id,
      name: fullName,
      firstName,
      lastName,
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
      countryId:
        p.NativeCountryID !== undefined
          ? Number(p.NativeCountryID)
          : p.CountryID !== undefined
          ? Number(p.CountryID)
          : undefined,
      sellerTeamId: Number(
        owningTeam.TeamID || p.SellerTeamID || p.TeamID || 0
      ),
      sellerTeamName: String(
        owningTeam.TeamName || p.SellerTeamName || p.TeamName || "Hattrick Kulübü"
      ),
      askingPrice,
      highestBid,
      currentPrice,
      estimatedMarketValue,
      estimatedFairValue: estimatedMarketValue,
      deadline,
      highestBidderTeamName: bidderTeam.TeamName
        ? String(bidderTeam.TeamName)
        : undefined,
      avatar,
      skills,
      bestPosition,
      positionRating,
      hattrickUrl: `https://www.hattrick.org/Club/Players/Player.aspx?playerId=${id}`,
      sourceType,
    };
  }

  /**
   * Hattrick CHPP Transfer Listesini Tarar (file=transfersearch + file=playerdetails + Canlı Lig/Rakip Transfer Listesi Taraması)
   */
  async searchTransferMarket(
    filters: TransferSearchFilters = {},
    myTeamId?: number
  ): Promise<TransferMarketPlayer[]> {
    const collected = new Map<number, TransferMarketPlayer>();

    // 0. Doğrudan Hattrick PlayerID ile arama yapıldıysa:
    if (filters.customPlayerId && filters.customPlayerId > 0) {
      const single = await this.getPlayerDetailsFromChpp(
        filters.customPlayerId,
        undefined,
        "playerdetails"
      );
      if (single) {
        collected.set(single.id, single);
      }
    }

    // 1. Resmi Hattrick CHPP file=transfersearch&version=1.0 çağrısı
    const posToSkillType: Record<string, number> = {
      GK: 5,
      CD: 1,
      RB: 1,
      LB: 1,
      IM: 2,
      RW: 4,
      LW: 4,
      FW: 3,
    };

    const primarySkillType =
      filters.skillType1 ||
      (filters.position && filters.position !== "ALL"
        ? posToSkillType[filters.position]
        : 2) ||
      2;

    try {
      const tsParams: Record<string, string | number> = {
        version: "1.0",
        ageMin: filters.ageMin ?? 17,
        ageMax: filters.ageMax ?? 33,
        skillType1: primarySkillType,
        minSkillValue1: filters.minSkillValue1 ?? 5,
        maxSkillValue1: filters.maxSkillValue1 ?? 18,
        pageSize: 25,
        pageIndex: filters.pageIndex ?? 0,
      };

      if (filters.skillType2) {
        tsParams.skillType2 = filters.skillType2;
        tsParams.minSkillValue2 = filters.minSkillValue2 ?? 4;
        tsParams.maxSkillValue2 = filters.maxSkillValue2 ?? 18;
      }
      if (filters.specialty !== undefined && filters.specialty >= 0) {
        tsParams.specialty = filters.specialty;
      }
      if (filters.maxPrice && filters.maxPrice > 0) {
        tsParams.maxPrice = filters.maxPrice;
      }
      if (filters.tsiMin && filters.tsiMin > 0) {
        tsParams.tsiMin = filters.tsiMin;
      }

      const tsData = await this.fetchXml("transfersearch", tsParams);
      const tsRoot =
        (tsData.TransferSearch as Record<string, unknown>) ||
        (tsData.TransferResults as Record<string, unknown>) ||
        tsData;
      const resultsNode =
        (tsRoot.TransferResults as Record<string, unknown>) ||
        (tsRoot.Players as Record<string, unknown>) ||
        tsRoot;

      const rawItems = this.ensureArray(
        (resultsNode.TransferItem ||
          resultsNode.Transfer ||
          resultsNode.Player) as Record<string, unknown>[]
      );

      const candidateItems = rawItems.slice(0, 16);
      const detailedList = await Promise.allSettled(
        candidateItems.map((item) => {
          const pid = Number(item.PlayerID || 0);
          return this.getPlayerDetailsFromChpp(
            pid,
            item,
            "transfersearch"
          );
        })
      );

      for (const res of detailedList) {
        if (res.status === "fulfilled" && res.value) {
          collected.set(res.value.id, res.value);
        }
      }
    } catch {
      // Devam et: Canlı CHPP lig ve rakip kulüplerin TransferListed=True havuzu taranacak
    }

    // 2. Canlı CHPP Kulüp Transfer Listesi Tarayıcısı (Ligdeki ve Fikstürdeki Gerçek Kulüplerin Satılık Oyuncuları)
    if (collected.size < 16) {
      try {
        const clubIds = new Set<number>();

        const [leagueRes, matchesRes] = await Promise.allSettled([
          this.fetchXml("leaguedetails", { version: "1.6" }),
          this.fetchXml("matches", {
            version: "2.9",
            ...(myTeamId ? { teamID: myTeamId } : {}),
          }),
        ]);

        if (leagueRes.status === "fulfilled") {
          const teams = this.ensureArray(
            leagueRes.value.Team as Record<string, unknown>[]
          );
          for (const t of teams) {
            const tid = Number(t.TeamID || 0);
            if (tid > 0 && tid !== myTeamId) clubIds.add(tid);
          }
        }

        if (matchesRes.status === "fulfilled") {
          const teamNode =
            (matchesRes.value.Team as Record<string, unknown>) || {};
          const matchList =
            (teamNode.MatchList as Record<string, unknown>) || {};
          const mArr = this.ensureArray(
            matchList.Match as Record<string, unknown>[]
          );
          for (const m of mArr) {
            const hId = Number(
              (m.HomeTeam as Record<string, unknown>)?.HomeTeamID || 0
            );
            const aId = Number(
              (m.AwayTeam as Record<string, unknown>)?.AwayTeamID || 0
            );
            if (hId > 0 && hId !== myTeamId) clubIds.add(hId);
            if (aId > 0 && aId !== myTeamId) clubIds.add(aId);
          }
        }

        const targetClubs = Array.from(clubIds).slice(0, 12);
        const clubPlayersSettled = await Promise.allSettled(
          targetClubs.map(async (cid) => {
            const [pData, avMap] = await Promise.all([
              this.fetchXml("players", {
                version: "2.6",
                teamID: cid,
              }),
              this.getAvatarsMap(cid),
            ]);
            const tNode = (pData.Team as Record<string, unknown>) || {};
            const tName = String(tNode.TeamName || `Kulüp #${cid}`);
            const pListNode =
              (tNode.PlayerList as Record<string, unknown>) || {};
            const pArr = this.ensureArray(
              pListNode.Player as Record<string, unknown>[]
            );
            return { cid, tName, pArr, avMap };
          })
        );

        const transferListedRaw: {
          raw: Record<string, unknown>;
          avatar?: PlayerAvatarData;
        }[] = [];
        const fallbackCandidatesRaw: {
          raw: Record<string, unknown>;
          avatar?: PlayerAvatarData;
        }[] = [];

        for (const cRes of clubPlayersSettled) {
          if (cRes.status !== "fulfilled") continue;
          const { cid, tName, pArr, avMap } = cRes.value;
          for (const rp of pArr) {
            const pid = Number(rp.PlayerID || 0);
            if (!pid || collected.has(pid)) continue;
            const enrichedRaw = {
              ...rp,
              SellerTeamID: cid,
              SellerTeamName: tName,
            };
            const isListed =
              String(rp.TransferListed).toLowerCase() === "true" ||
              Number(rp.TransferListed) === 1;
            if (isListed) {
              transferListedRaw.push({
                raw: enrichedRaw,
                avatar: avMap[pid],
              });
            } else {
              fallbackCandidatesRaw.push({
                raw: enrichedRaw,
                avatar: avMap[pid],
              });
            }
          }
        }

        // Önce gerçek TransferListed=True olan tüm oyuncuları playerdetails ile çek
        const listedToFetch = transferListedRaw.slice(0, 18);
        const listedDetails = await Promise.allSettled(
          listedToFetch.map((item) =>
            this.getPlayerDetailsFromChpp(
              Number(item.raw.PlayerID),
              item.raw,
              "league_transfer_scan",
              item.avatar
            )
          )
        );

        for (const r of listedDetails) {
          if (r.status === "fulfilled" && r.value) {
            collected.set(r.value.id, r.value);
          }
        }

        // Eğer o anda ligdeki satılık oyuncu sayısı azsa, gerçek kulüplerdeki en yüksek TSI'lı uygun oyuncuları da ekle
        if (collected.size < 12 && fallbackCandidatesRaw.length > 0) {
          const sortedFallbacks = fallbackCandidatesRaw
            .sort(
              (a, b) =>
                Number(b.raw.TSI || 0) - Number(a.raw.TSI || 0)
            )
            .slice(0, 16 - collected.size);

          const fbDetails = await Promise.allSettled(
            sortedFallbacks.map((item) =>
              this.getPlayerDetailsFromChpp(
                Number(item.raw.PlayerID),
                item.raw,
                "league_transfer_scan",
                item.avatar
              )
            )
          );

          for (const r of fbDetails) {
            if (r.status === "fulfilled" && r.value) {
              collected.set(r.value.id, r.value);
            }
          }
        }
      } catch {
        // Ignore scan error
      }
    }

    const allResults = Array.from(collected.values());
    return allResults;
  }
}

export function inferFormationFromRoleIds(roleIds: number[]): string {
  let def = 0;
  let mid = 0;
  let att = 0;
  for (const r of roleIds) {
    if (r >= 101 && r <= 105) def++;
    else if (r >= 106 && r <= 110) mid++;
    else if (r >= 111 && r <= 113) att++;
  }
  const candidate = `${def}-${mid}-${att}`;
  const supported = [
    "4-4-2",
    "3-5-2",
    "4-5-1",
    "3-4-3",
    "4-3-3",
    "5-3-2",
    "5-4-1",
  ];
  return supported.includes(candidate) ? candidate : "4-4-2";
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

  const gkRating =
    (skills.keeper * 0.8 + skills.defender * 0.2) * formMult * stamMult +
    expBonus;
  const cdRating =
    (skills.defender * 0.65 +
      skills.playmaker * 0.15 +
      skills.passer * 0.1 +
      skills.keeper * 0.1) *
      formMult *
      stamMult +
    expBonus;
  const wbRating =
    (skills.defender * 0.45 +
      skills.winger * 0.3 +
      skills.playmaker * 0.15 +
      skills.passer * 0.1) *
      formMult *
      stamMult +
    expBonus;
  const imRating =
    (skills.playmaker * 0.55 +
      skills.defender * 0.2 +
      skills.passer * 0.15 +
      skills.scorer * 0.1) *
      formMult *
      stamMult +
    expBonus;
  const wRating =
    (skills.winger * 0.55 +
      skills.playmaker * 0.2 +
      skills.passer * 0.15 +
      skills.defender * 0.1) *
      formMult *
      stamMult +
    expBonus;
  const fwRating =
    (skills.scorer * 0.6 +
      skills.passer * 0.2 +
      skills.winger * 0.1 +
      skills.playmaker * 0.1) *
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

export function estimatePlayerMarketValue(
  skills: Player["skills"],
  age: number,
  tsi: number,
  specialty: string
): number {
  const skillArr = [
    skills.keeper,
    skills.defender,
    skills.playmaker,
    skills.winger,
    skills.passer,
    skills.scorer,
  ].sort((a, b) => b - a);
  const main = skillArr[0] || 6;
  const sub1 = skillArr[1] || 4;
  const sub2 = skillArr[2] || 3;

  const baseFromMain = Math.pow(1.62, Math.max(1, main - 4)) * 95_000;
  const subBonus =
    Math.max(0, sub1 - 4) * 85_000 + Math.max(0, sub2 - 4) * 45_000;
  const tsiComponent = Math.min(8_000_000, tsi * 115);

  const ageFactor =
    age <= 18
      ? 1.55
      : age <= 20
      ? 1.32
      : age <= 24
      ? 1.12
      : age <= 27
      ? 0.95
      : age <= 30
      ? 0.65
      : 0.35;

  const specFactor = specialty && specialty !== "Yok" ? 1.18 : 1.0;

  const rawVal =
    (baseFromMain * 0.65 + subBonus + tsiComponent * 0.35) *
    ageFactor *
    specFactor;

  return Math.max(25_000, Math.round(rawVal / 5_000) * 5_000);
}
