export type PositionCode = 
  | "GK"   // Kaleci
  | "RB"   // Sağ Bek
  | "CD"   // Stoper / Defans Orta
  | "LB"   // Sol Bek
  | "RW"   // Sağ Kanat
  | "IM"   // İç Saha / Orta Saha Merkez
  | "LW"   // Sol Kanat
  | "FW"   // Forvet
  | "SUB"; // Yedek

export interface PlayerSkills {
  keeper: number;       // Kalecilik (1-20)
  defender: number;     // Savunma (1-20)
  playmaker: number;    // Oyun Kuruculuk (1-20)
  winger: number;       // Kanat (1-20)
  passer: number;       // Pas (1-20)
  scorer: number;       // Golcülük (1-20)
  setPieces: number;    // Duran Top (1-20)
}

export interface Player {
  id: number;
  name: string;
  shirtNumber?: number;
  age: number;
  ageDays: number;
  tsi: number;
  wage: number;
  form: number;            // 1-8 scale
  stamina: number;         // 1-9 scale
  experience: number;      // 1-20 scale
  leadership: number;      // 1-20 scale
  loyalty: number;         // 1-20 scale
  specialty: string;       // "Kafa", "Hızlı", "Teknik", "Güçlü", "Öngörülemez", "Yok"
  injuryDays: number;      // 0 = sağlıklı, >0 = sakat gün
  cards: number;           // Sarı/Kırmızı kart durumu
  skills: PlayerSkills;
  bestPosition?: PositionCode;
  positionRating?: number; // 1.0 - 20.0 rating in best position
  currentPosition?: PositionCode;
  selectedForLineup?: boolean;
}

export interface TeamDetails {
  id: number;
  name: string;
  shortName: string;
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
}

export interface TrainingData {
  trainingType: number;
  trainingTypeName: string;
  trainingLevel: number;       // 0-100%
  staminaTrainingPart: number; // e.g. 15%
  lastTrainingDate: string;
  coachId?: number;
  coachSkill?: number;
}

export interface SectorRatings {
  midfield: number;        // Orta Saha (1-80 in Hattrick quarter-levels)
  rightDef: number;        // Sağ Defans
  midDef: number;          // Orta Defans
  leftDef: number;         // Sol Defans
  rightAtt: number;        // Sağ Forvet
  midAtt: number;          // Orta Forvet
  leftAtt: number;         // Sol Forvet
}

export interface Match {
  id: number;
  matchDate: string;
  homeTeamId: number;
  homeTeamName: string;
  awayTeamId: number;
  awayTeamName: string;
  homeGoals: number | null;
  awayGoals: number | null;
  status: "UPCOMING" | "FINISHED" | "LIVE";
  matchType: "LEAGUE" | "CUP" | "FRIENDLY";
  myTeamIsHome: boolean;
  result?: "WIN" | "DRAW" | "LOSS";
  homeRatings?: SectorRatings;
  awayRatings?: SectorRatings;
  winProbability?: number;  // 0 - 100
  drawProbability?: number; // 0 - 100
  lossProbability?: number; // 0 - 100
}

export interface FormationSlot {
  id: string;
  role: PositionCode;
  x: number; // percentage on pitch (0-100 left to right)
  y: number; // percentage on pitch (0-100 top to bottom, bottom is defense)
  label: string;
  playerId?: number;
  assignedPlayer?: Player;
  rating?: number;
}

export interface TacticalLineup {
  formation: "4-4-2" | "3-5-2" | "4-3-3" | "4-5-1" | "3-4-3" | "5-3-2";
  tactic: "Normal" | "Kanatlardan Hücum" | "Ortadan Hücum" | "Kontra Atak" | "Uzaktan Şut" | "Yaratıcı Oyna";
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
