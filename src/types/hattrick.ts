export type PositionCode =
  | "GK" // Kaleci
  | "RB" // Sağ Bek
  | "CD" // Stoper / Defans Orta
  | "LB" // Sol Bek
  | "RW" // Sağ Kanat
  | "IM" // İç Saha / Orta Saha Merkez
  | "LW" // Sol Kanat
  | "FW" // Forvet
  | "SUB"; // Yedek

export interface PlayerSkills {
  keeper: number; // Kalecilik (1-20)
  defender: number; // Savunma (1-20)
  playmaker: number; // Oyun Kuruculuk (1-20)
  winger: number; // Kanat (1-20)
  passer: number; // Pas (1-20)
  scorer: number; // Golcülük (1-20)
  setPieces: number; // Duran Top (1-20)
}

export interface PlayerAvatarLayer {
  x: number;
  y: number;
  image: string;
}

export interface PlayerAvatarData {
  backgroundImage?: string;
  layers: PlayerAvatarLayer[];
}

export interface Player {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  nickName?: string;
  shirtNumber?: number;
  age: number;
  ageDays: number;
  tsi: number;
  wage: number;
  form: number; // 1-8 scale
  stamina: number; // 1-9 scale
  experience: number; // 1-20 scale
  leadership: number; // 1-20 scale
  loyalty: number; // 1-20 scale
  motherClubBonus?: boolean;
  specialty: string; // "Kafa", "Hızlı", "Teknik", "Güçlü", "Öngörülemez", "Yok"
  injuryDays: number; // 0 = sağlıklı, >0 = sakat gün
  cards: number; // Sarı/Kırmızı kart durumu
  isTransferListed?: boolean;
  countryId?: number;
  agreeability?: number;
  aggressiveness?: number;
  honesty?: number;
  careerGoals?: number;
  goalsCurrentTeam?: number;
  careerHattricks?: number;
  matchesCurrentTeam?: number;
  avatar?: PlayerAvatarData;
  skills: PlayerSkills;
  bestPosition?: PositionCode;
  positionRating?: number; // 1.0 - 20.0 rating in best position
  currentPosition?: PositionCode;
  selectedForLineup?: boolean;
  lastMatchRole?: PositionCode;
  lastMatchRoleId?: number;
  lastMatchRating?: number;
}

export interface TeamDetails {
  id: number;
  name: string;
  shortName: string;
  logoUrl?: string;
  dressUri?: string;
  dressAlternateUri?: string;
  leagueLevel: number;
  seriesName: string;
  rank: number;
  fanClubSize: number;
  cash: number;
  arenaName: string;
  arenaCapacity: number;
  regionName: string;
  countryName: string;
  homeColor: string;
  awayColor: string;
  powerRating?: number;
  trophyCount?: number;
  teamSpirit?: number;
  confidence?: number;
}

export interface TrainingData {
  trainingType: number;
  trainingTypeName: string;
  trainingLevel: number; // 0-100%
  staminaTrainingPart: number; // e.g. 15%
  lastTrainingDate: string;
  coachId?: number;
  coachSkill?: number;
  coachName?: string;
  morale?: number;
  selfConfidence?: number;
}

export interface SectorRatings {
  midfield: number; // Orta Saha (1-80 in Hattrick quarter-levels)
  rightDef: number; // Sağ Defans
  midDef: number; // Orta Defans
  leftDef: number; // Sol Defans
  rightAtt: number; // Sağ Forvet
  midAtt: number; // Orta Forvet
  leftAtt: number; // Sol Forvet
}

export interface Match {
  id: number;
  matchDate: string;
  homeTeamId: number;
  homeTeamName: string;
  homeLogoUrl?: string;
  awayTeamId: number;
  awayTeamName: string;
  awayLogoUrl?: string;
  homeGoals: number | null;
  awayGoals: number | null;
  status: "UPCOMING" | "FINISHED" | "LIVE";
  matchType: "LEAGUE" | "CUP" | "FRIENDLY";
  myTeamIsHome: boolean;
  result?: "WIN" | "DRAW" | "LOSS";
  ordersGiven?: boolean;
  homeFormation?: string;
  awayFormation?: string;
  homeTactic?: string;
  awayTactic?: string;
  homeRatings?: SectorRatings;
  awayRatings?: SectorRatings;
  winProbability?: number; // 0 - 100
  drawProbability?: number; // 0 - 100
  lossProbability?: number; // 0 - 100
}

export interface RealMatchLineupPlayer {
  playerId: number;
  firstName: string;
  lastName: string;
  name: string;
  shirtNumber?: number;
  roleId: number;
  roleName: string;
  positionCode: PositionCode;
  ratingStars: number;
  behaviour?: string;
  isCaptain?: boolean;
  isSetPieces?: boolean;
  avatar?: PlayerAvatarData;
}

export interface RealMatchEvent {
  index: number;
  minute: number;
  eventTypeId: number;
  subjectTeamId: number;
  subjectPlayerId?: number;
  objectPlayerId?: number;
  eventText: string;
}

export interface RealMatchGoal {
  playerId: number;
  playerName: string;
  teamId: number;
  homeGoals: number;
  awayGoals: number;
  minute: number;
}

export interface RealMatchBooking {
  playerId: number;
  playerName: string;
  teamId: number;
  bookingType: "YELLOW" | "RED";
  minute: number;
}

export interface RealMatchDetails {
  matchId: number;
  matchDate: string;
  finishedDate?: string;
  status: "FINISHED" | "LIVE" | "UPCOMING";
  matchType: number;
  homeTeamId: number;
  homeTeamName: string;
  homeLogoUrl?: string;
  homeDressUri?: string;
  awayTeamId: number;
  awayTeamName: string;
  awayLogoUrl?: string;
  awayDressUri?: string;
  homeGoals: number;
  awayGoals: number;
  homeFormation: string;
  awayFormation: string;
  homeTacticType: string;
  homeTacticSkill: number;
  awayTacticType: string;
  awayTacticSkill: number;
  possessionFirstHalfHome?: number;
  possessionSecondHalfHome?: number;
  arenaName?: string;
  soldTotal?: number;
  weatherId?: number;
  homeRatings: SectorRatings;
  awayRatings: SectorRatings;
  goals: RealMatchGoal[];
  bookings: RealMatchBooking[];
  events: RealMatchEvent[];
  homeLineup: RealMatchLineupPlayer[];
  awayLineup: RealMatchLineupPlayer[];
  myTeamId?: number;
}

export interface FormationSlot {
  id: string;
  role: PositionCode;
  roleId?: number; // Hattrick official RoleID (100=GK, 101=RB, 102=RCD, 103=MCD, 104=LCD, 105=LB, 106=RW, 107=RIM, 108=MIM, 109=LIM, 110=LW, 111=RFW, 112=MFW, 113=LFW)
  x: number; // percentage on pitch (0-100 left to right)
  y: number; // percentage on pitch (0-100 top to bottom, bottom is defense)
  label: string;
  playerId?: number;
  assignedPlayer?: Player;
  rating?: number;
}

export interface TacticalLineup {
  formation: "4-4-2" | "3-5-2" | "4-3-3" | "4-5-1" | "3-4-3" | "5-3-2";
  tactic:
    | "Normal"
    | "Kanatlardan Hücum"
    | "Ortadan Hücum"
    | "Kontra Atak"
    | "Uzaktan Şut"
    | "Yaratıcı Oyna"
    | "Baskı (Pressing)";
  tacticId?: number;
  attitude: "Normal" | "Sezonun Maçı" | "Gevşek";
  captainId?: number;
  setPiecesTakerId?: number;
  slots: FormationSlot[];
  substitutes: {
    slot: "SUB_GK" | "SUB_DEF" | "SUB_MID" | "SUB_WING" | "SUB_FW";
    playerId?: number;
    player?: Player;
  }[];
  totalRating: number;
  sectorRatings: SectorRatings;
  syncedFromServer?: boolean;
  serverSource?: "matchorders" | "matchlineup" | "auto";
  sourceMatchId?: number;
  sourceOpponentName?: string;
  ordersGiven?: boolean;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  image?: string;
  googleLoggedIn: boolean;
  hattrickConnected: boolean;
  hattrickUsername?: string;
  hattrickTeamId?: number;
  hattrickTeamName?: string;
}

export interface TrainingRecommendation {
  recommendedType: string;
  recommendedTypeId: number;
  recommendedStaminaShare: number;
  reason: string;
  suitablePlayersCount: number;
  trainees: {
    id: number;
    name: string;
    age: number;
    currentSkill: number;
    targetSkill: number;
    estimatedWeeks: number;
  }[];
}

export interface TransferMarketPlayer extends Player {
  askingPrice: number;
  highestBid: number;
  currentPrice: number;
  deadline: string;
  sellerTeamId?: number;
  sellerTeamName?: string;
  bidderTeamName?: string;
  highestBidderTeamName?: string;
  hattrickUrl: string;
  sourceType:
    | "CHPP_TRANSFERSEARCH"
    | "CHPP_LEAGUE_TRANSFERLIST"
    | "CHPP_PLAYERDETAILS"
    | "transfersearch"
    | "league_transfer_scan"
    | "playerdetails";
  // AI Fit & Advantage Metrics for User's Squad
  targetRole?: PositionCode;
  roleScoreForTarget?: number;
  upgradeDelta?: number; // e.g. +1.8 stars over current weakest starter in that role
  estimatedFairValue?: number;
  estimatedMarketValue: number;
  valueAdvantagePct?: number; // % discount vs fair value
  advantageScore?: number; // 0-100 overall recommendation score
  fitsBudget?: boolean;
  aiVerdict?: string;
}

export interface TransferSearchFilters {
  position?: PositionCode | "ALL";
  targetRole?: PositionCode;
  skillType1?: number; // 1=Def, 2=PM, 3=Scorer, 4=Winger, 5=GK, 6=Passing, 7=SetPieces
  minSkillValue1?: number;
  maxSkillValue1?: number;
  skillType2?: number;
  minSkillValue2?: number;
  maxSkillValue2?: number;
  ageMin?: number;
  ageMax?: number;
  maxPrice?: number;
  minTsi?: number;
  tsiMin?: number;
  specialty?: number; // 0=Any, 1=Tech, 2=Quick, 3=Head, 4=Powerful, 5=Unpred
  queryPlayerId?: number;
  customPlayerId?: number;
  pageIndex?: number;
}

