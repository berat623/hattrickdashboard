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
  ascendant: {
    sign: string;
    degree: number;
    minute: number;
    totalDegrees: number;
  };
  midheaven: {
    sign: string;
    degree: number;
    minute: number;
    totalDegrees: number;
  };
  planets: PlanetPosition[];
  houses: HouseCusp[];
  aspects: Aspect[];
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
  svgWheel: string;
}
