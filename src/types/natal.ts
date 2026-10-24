export type HouseSystem =
  | "placidus"
  | "whole_sign"
  | "equal"
  | "porphyry"
  | "koch"
  | "regiomontanus"
  | "campanus";

export type AyanamsaSystem =
  | "tropical"
  | "lahiri"
  | "raman"
  | "kp"
  | "fagan_bradley"
  | "yukteshwar";

export interface CityInfo {
  city: string;
  lat: number;
  lng: number;
  tz: string;
}

export interface PlanetPosition {
  name: string; // "Güneş", "Ay", ...
  symbol: string; // "☉", "☽", ...
  longitude: number; // 0..360
  sign: string; // "Koç", "Boğa", ...
  signIndex: number; // 0..11
  signSymbol: string; // "♈", "♉", ...
  degree: number; // 0..29
  minute: number; // 0..59
  house: number; // 1..12
  speed: number;
  isRetrograde: boolean;
  dignity?: "Yönetici" | "Yücelim" | "Zararda" | "Düşük" | "Nötr";
  // D9 Navamsha Info
  d9Sign: string;
  d9SignIndex: number;
  d9Degree: number;
  nakshatra: string;
  nakshatraLord: string;
  pada: number;
  isVargottama: boolean;
  isPushkara: boolean;
}

export interface SensitivePoint {
  name: string;
  symbol: string;
  longitude: number;
  sign: string;
  degree: number;
  minute: number;
  house: number;
  desc: string;
}

export interface HouseCusp {
  house: number; // 1..12
  longitude: number;
  sign: string;
  signIndex: number;
  degree: number;
  minute: number;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: "Kavuşum" | "Altmışlık" | "Kare" | "Üçgen" | "Karşıt";
  angle: number; // 0, 60, 90, 120, 180
  orb: number;
  isHarmonious: boolean;
}

export interface ElementBalance {
  fire: number; // Percentage
  earth: number;
  air: number;
  water: number;
  dominantElement: "Ateş" | "Toprak" | "Hava" | "Su";
  cardinal: number; // Öncü
  fixed: number; // Sabit
  mutable: number; // Değişken
  dominantModality: "Öncü" | "Sabit" | "Değişken";
}

export interface NatalChartData {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthDateFormatted: string; // DD.MM.YYYY
  birthTime: string; // HH:mm
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utcTime: string;
  houseSystem: HouseSystem;
  ayanamsaSystem: AyanamsaSystem;
  ayanamsaValue: number;
  ascendant: {
    sign: string;
    degree: number;
    minute: number;
    totalDegrees: number;
    d9Sign: string;
    nakshatra: string;
    pada: number;
  };
  midheaven: {
    sign: string;
    degree: number;
    minute: number;
    totalDegrees: number;
    d9Sign: string;
    nakshatra: string;
    pada: number;
  };
  planets: PlanetPosition[];
  sensitivePoints: SensitivePoint[];
  houses: HouseCusp[];
  aspects: Aspect[];
  elementBalance: ElementBalance;
  summary: {
    sunSign: string;
    sunHouse: number;
    sunMotto: string;
    moonSign: string;
    moonHouse: number;
    moonMotto: string;
    ascendantSign: string;
    ascendantMotto: string;
  };
  vargottamaPlanets: string[];
  darakaraka?: {
    planet: string;
    symbol: string;
    degree: number;
    minute: number;
    sign: string;
    desc: string;
  };
  seventhHouse?: {
    sign: string;
    degree: number;
    minute: number;
    ruler: string;
    rulerHouse: number;
  };
  svgWheel: string;
  svgD9Wheel: string;
}

// Synastry Types
export interface SynastryAspect {
  planet1: string; // Kişi 1 Gezegeni
  planet2: string; // Kişi 2 Gezegeni
  type: "Kavuşum" | "Altmışlık" | "Kare" | "Üçgen" | "Karşıt";
  angle: number;
  orb: number;
  isHarmonious: boolean;
  category: "ask" | "iletisim" | "tutku" | "istikrar" | "karmik";
  interpretation: string;
}

export interface SynastryCategoryScore {
  title: string;
  score: number; // 0..100
  desc: string;
}

export interface SynastryHouseOverlay {
  planet: string;
  sourcePerson: string;
  targetPerson: string;
  targetHouse: number;
  interpretation: string;
}

export interface SynastryZodiacMatch {
  title: string;
  pair: string;
  score: number;
  desc: string;
}

export interface SynastryChartData {
  person1: NatalChartData;
  person2: NatalChartData;
  overallScore: number; // 0..100
  categories: {
    love: SynastryCategoryScore;
    communication: SynastryCategoryScore;
    passion: SynastryCategoryScore;
    stability: SynastryCategoryScore;
    spiritual: SynastryCategoryScore;
  };
  aspects: SynastryAspect[];
  houseOverlays?: SynastryHouseOverlay[];
  zodiacMatches?: SynastryZodiacMatch[];
  summaryText: string;
}
