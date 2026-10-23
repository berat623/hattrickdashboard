export type ZodiacSignId = "taurus" | "cancer" | "leo" | "virgo";

export type HoroscopeSourceId = "askganesha" | "ganeshaspeaks" | "astrosage";

export type HoroscopeDay = "yesterday" | "today" | "tomorrow";

export interface ZodiacSignInfo {
  id: ZodiacSignId;
  nameTr: string;
  nameEn: string;
  symbol: string;
  dates: string;
  element: "Toprak" | "Su" | "Ateş";
  rulingPlanet: string;
  motto: string;
}

export interface HoroscopeSourceInfo {
  id: HoroscopeSourceId;
  name: string;
  origin: string;
  supportedSigns: ZodiacSignId[];
  supportedDays: HoroscopeDay[];
}

export interface DailyHoroscopeItem {
  signId: ZodiacSignId;
  sourceId: HoroscopeSourceId;
  sourceName: string;
  day: HoroscopeDay;
  date: string; // Turkish formatted date: e.g. "24 Ekim 2026, Cumartesi"
  rawDate?: string;
  predictionTr: string;
  predictionEn: string;
  luckyNumber?: string;
  luckyColor?: string;
  luckyColorTr?: string;
  remedy?: string;
  remedyTr?: string;
  fetchedAt: string;
}

export interface HoroscopeApiResponse {
  success: boolean;
  day: HoroscopeDay;
  date: string;
  sign: ZodiacSignInfo;
  items: DailyHoroscopeItem[];
  availableSources: HoroscopeSourceId[];
  error?: string;
}

export const ZODIAC_SIGNS: Record<ZodiacSignId, ZodiacSignInfo> = {
  taurus: {
    id: "taurus",
    nameTr: "Boğa",
    nameEn: "Taurus",
    symbol: "♉",
    dates: "20 Nisan - 20 Mayıs",
    element: "Toprak",
    rulingPlanet: "Venüs",
    motto: "Huzur, Kararlılık ve Güven",
  },
  cancer: {
    id: "cancer",
    nameTr: "Yengeç",
    nameEn: "Cancer",
    symbol: "♋",
    dates: "21 Haziran - 22 Temmuz",
    element: "Su",
    rulingPlanet: "Ay",
    motto: "Şefkat, Duyarlılık ve İçsel Güç",
  },
  leo: {
    id: "leo",
    nameTr: "Aslan",
    nameEn: "Leo",
    symbol: "♌",
    dates: "23 Temmuz - 22 Ağustos",
    element: "Ateş",
    rulingPlanet: "Güneş",
    motto: "Özgüven, Liderlik ve Cesaret",
  },
  virgo: {
    id: "virgo",
    nameTr: "Başak",
    nameEn: "Virgo",
    symbol: "♍",
    dates: "23 Ağustos - 22 Eylül",
    element: "Toprak",
    rulingPlanet: "Merkür",
    motto: "Titizlik, Akıl ve Ustalık",
  },
};

export const HOROSCOPE_SOURCES: Record<HoroscopeSourceId, HoroscopeSourceInfo> = {
  askganesha: {
    id: "askganesha",
    name: "AskGanesha",
    origin: "Vedik Astroloji Portalı",
    supportedSigns: ["taurus", "cancer", "leo", "virgo"],
    supportedDays: ["yesterday", "today", "tomorrow"],
  },
  ganeshaspeaks: {
    id: "ganeshaspeaks",
    name: "GaneshaSpeaks",
    origin: "Hint Astroloji Merkezi",
    supportedSigns: ["taurus", "cancer", "leo", "virgo"],
    supportedDays: ["yesterday", "today", "tomorrow"],
  },
  astrosage: {
    id: "astrosage",
    name: "AstroSage",
    origin: "Ay Burcu & Vedik Rehberi",
    supportedSigns: ["leo", "virgo"], // Strictly Leo & Virgo
    supportedDays: ["today", "tomorrow"], // AstroSage only has today & tomorrow
  },
};
