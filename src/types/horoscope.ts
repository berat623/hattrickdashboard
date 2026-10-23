export type ZodiacSignId = "taurus" | "cancer" | "leo" | "virgo";

export type HoroscopeSourceId = "askganesha" | "ganeshaspeaks" | "astrosage";

export interface ZodiacSignInfo {
  id: ZodiacSignId;
  nameTr: string;
  nameEn: string;
  symbol: string;
  dates: string;
  element: "Toprak" | "Su" | "Ateş";
  rulingPlanet: string;
  motto: string;
  colorScheme: {
    accent: string;
    bgGlow: string;
    badge: string;
    gradient: string;
  };
  traits: string[];
}

export interface HoroscopeSourceInfo {
  id: HoroscopeSourceId;
  name: string;
  origin: string;
  logoText: string;
  description: string;
  url: string;
  supportedSigns: ZodiacSignId[];
}

export interface DailyHoroscopeItem {
  signId: ZodiacSignId;
  sourceId: HoroscopeSourceId;
  sourceName: string;
  date: string;
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
    colorScheme: {
      accent: "text-emerald-500",
      bgGlow: "from-emerald-500/20 to-teal-500/10",
      badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      gradient: "from-emerald-600 to-teal-700",
    },
    traits: ["Sabırlı", "Güvenilir", "Sadık", "Kararlı", "Pratik"],
  },
  cancer: {
    id: "cancer",
    nameTr: "Yengeç",
    nameEn: "Cancer",
    symbol: "♋",
    dates: "21 Haziran - 22 Temmuz",
    element: "Su",
    rulingPlanet: "Ay",
    motto: "Derin Sezgi ve Şefkat",
    colorScheme: {
      accent: "text-cyan-500",
      bgGlow: "from-cyan-500/20 to-blue-500/10",
      badge: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
      gradient: "from-cyan-600 to-blue-700",
    },
    traits: ["Duygusal", "Sezgisel", "Koruyucu", "Şefkatli", "Hayal Gücü Yüksek"],
  },
  leo: {
    id: "leo",
    nameTr: "Aslan",
    nameEn: "Leo",
    symbol: "♌",
    dates: "23 Temmuz - 22 Ağustos",
    element: "Ateş",
    rulingPlanet: "Güneş",
    motto: "Liderlik, Işık ve Cesaret",
    colorScheme: {
      accent: "text-amber-500",
      bgGlow: "from-amber-500/20 to-orange-500/10",
      badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
      gradient: "from-amber-500 to-orange-600",
    },
    traits: ["Cömert", "Özgüvenli", "Yaratıcı", "Lider", "Neşeli"],
  },
  virgo: {
    id: "virgo",
    nameTr: "Başak",
    nameEn: "Virgo",
    symbol: "♍",
    dates: "23 Ağustos - 22 Eylül",
    element: "Toprak",
    rulingPlanet: "Merkür",
    motto: "Titizlik, Zeka ve Düzen",
    colorScheme: {
      accent: "text-violet-500",
      bgGlow: "from-violet-500/20 to-purple-500/10",
      badge: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
      gradient: "from-violet-600 to-purple-700",
    },
    traits: ["Analitik", "Çalışkan", "Pratik", "Detaycı", "Çözüm Odaklı"],
  },
};

export const HOROSCOPE_SOURCES: Record<HoroscopeSourceId, HoroscopeSourceInfo> = {
  askganesha: {
    id: "askganesha",
    name: "AskGanesha",
    origin: "Yeni Delhi, Hindistan",
    logoText: "🕉️ AskGanesha",
    description: "Vedik astroloji uzmanları ve geleneksel Hint burç yorumları.",
    url: "https://www.askganesha.com",
    supportedSigns: ["taurus", "cancer", "leo", "virgo"],
  },
  ganeshaspeaks: {
    id: "ganeshaspeaks",
    name: "GaneshaSpeaks",
    origin: "Ahmedabad, Hindistan",
    logoText: "✨ GaneshaSpeaks",
    description: "Dünyaca ünlü Bejan Daruwalla ekolü günlük astroloji öngörüleri.",
    url: "https://www.ganeshaspeaks.com",
    supportedSigns: ["taurus", "cancer", "leo", "virgo"],
  },
  astrosage: {
    id: "astrosage",
    name: "AstroSage",
    origin: "Noida, Hindistan",
    logoText: "🔮 AstroSage",
    description: "Gelişmiş Vedik Ay Burcu ve yıldız transit analizleri (Sadece Aslan ve Başak).",
    url: "https://www.astrosage.com",
    supportedSigns: ["leo", "virgo"],
  },
};
