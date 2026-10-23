const translationCache = new Map<string, string>();

export const COLOR_MAP_TR: Record<string, string> = {
  black: "Siyah",
  white: "Beyaz",
  red: "Kırmızı",
  blue: "Mavi",
  green: "Yeşil",
  yellow: "Sarı",
  orange: "Turuncu",
  purple: "Mor",
  violet: "Menekşe Moru",
  pink: "Pembe",
  brown: "Kahverengi",
  gray: "Gri",
  grey: "Gri",
  gold: "Altın Sarısı",
  golden: "Altın Sarısı",
  silver: "Gümüş",
  cream: "Krem",
  beige: "Bej",
  maroon: "Bordo",
  navy: "Lacivert",
  "navy blue": "Lacivert",
  teal: "Camgöbeği",
  turquoise: "Turkuaz",
  saffron: "Safran Sarısı",
  coral: "Mercan",
  lavender: "Lavanta",
  amber: "Kehribar Sarısı",
  mustard: "Hardal Sarısı",
  metallic: "Metalik",
  copper: "Bakır",
  bronze: "Bronz",
  indigo: "Çivit Mavisi",
  magenta: "Macenta",
  cyan: "Camgöbeği",
  ruby: "Yakut Kırmızısı",
  emerald: "Zümrüt Yeşili",
  sapphire: "Safir Mavisi",
  "black and blue": "Siyah ve Mavi",
  "red and white": "Kırmızı ve Beyaz",
  "red and maroon": "Kırmızı ve Bordo",
  "yellow and orange": "Sarı ve Turuncu",
  "light brown": "Açık Kahverengi",
  "dark brown": "Koyu Kahverengi",
  "light blue": "Açık Mavi",
  "dark blue": "Koyu Mavi",
  "light green": "Açık Yeşil",
  "dark green": "Koyu Yeşil",
  "emerald green": "Zümrüt Yeşili",
  "forest green": "Orman Yeşili",
  "olive green": "Zeytin Yeşili",
  "sea green": "Deniz Yeşili",
  "ruby red": "Yakut Kırmızısı",
  "pearl white": "İnci Beyazı",
  "light bright yellow": "Açık Parlak Sarı",
  "transparent and pink": "Şeffaf ve Pembe",
};

function translateSingleColor(c: string): string {
  if (!c) return "";
  const trimmed = c.trim().toLowerCase().replace(/\.+$/, "");
  if (!trimmed) return "";

  if (COLOR_MAP_TR[trimmed]) return COLOR_MAP_TR[trimmed];

  const isLight = trimmed.includes("light");
  const isDark = trimmed.includes("dark");
  const cleanBase = trimmed.replace(/\b(light|dark)\b/g, "").trim();
  if (COLOR_MAP_TR[cleanBase]) {
    const base = COLOR_MAP_TR[cleanBase];
    if (isLight) return `Açık ${base}`;
    if (isDark) return `Koyu ${base}`;
    return base;
  }

  for (const [k, v] of Object.entries(COLOR_MAP_TR)) {
    if (trimmed.includes(k)) return v;
  }
  return c.trim();
}

/**
 * Robust Turkish color translator for all astrology color names.
 */
export function translateColorToTurkish(colorEn?: string): string {
  if (!colorEn) return "";
  const cleaned = colorEn.trim().replace(/\.+$/, "").trim();
  if (!cleaned) return "";

  // If already native Turkish or matching a known Turkish name
  const turkishColors = Object.values(COLOR_MAP_TR);
  if (turkishColors.some((tc) => tc.toLowerCase() === cleaned.toLowerCase())) {
    return cleaned;
  }

  // Check if composite: e.g. "Black and Blue" or "White, cream, red and yellow"
  if (/\b(?:and|ve|,|\/)\b/i.test(cleaned) || cleaned.includes(",")) {
    const parts = cleaned
      .split(/(?:,|\s+and\s+|\s+ve\s+|\/)+/i)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 1) {
      const translatedParts = parts.map((p) => translateSingleColor(p));
      if (translatedParts.length === 2) {
        return `${translatedParts[0]} ve ${translatedParts[1]}`;
      }
      return `${translatedParts.slice(0, -1).join(", ")} ve ${
        translatedParts[translatedParts.length - 1]
      }`;
    }
  }

  return translateSingleColor(cleaned);
}

export function cleanHtmlText(text: string): string {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Removes all emojis and symbols from text.
 */
export function cleanEmojis(text: string): string {
  if (!text) return "";
  return text
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu,
      ""
    )
    .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "")
    .replace(/[❤️💖💕💓💗💘💙💚💛💜🖤🤍🤎💼🌿🌱🍀⚡✨💫⭐🌟🔮]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Formats multi-section prediction text (e.g. Aşk, İş, Sağlık) cleanly onto separate lines without emojis.
 */
export function formatPredictionSections(text: string): string {
  if (!text) return "";
  const paragraphs = text.split(/\n+/);
  const cleanedParagraphs: string[] = [];

  for (const para of paragraphs) {
    let cleaned = cleanEmojis(para);
    cleaned = cleaned
      .replace(/\s*(Aşk:)/gi, "\n\n$1")
      .replace(/\s*(İş:)/gi, "\n\n$1")
      .replace(/\s*(Sağlık:)/gi, "\n\n$1")
      .trim();
    if (cleaned) {
      cleanedParagraphs.push(cleaned);
    }
  }

  return cleanedParagraphs.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Checks if a string contains common English indicator words.
 */
export function isEnglishText(text: string): boolean {
  if (!text) return false;
  return /\b(the|and|you|with|will|for|are|this|that|your|have|from|today|careful|growth|stability|health)\b/i.test(
    text
  );
}

/**
 * Translates English text into Turkish with in-memory caching and fail-safe fallback.
 */
export async function translateToTurkish(textEn: string): Promise<string> {
  const cleaned = cleanHtmlText(textEn);
  if (!cleaned) return "";

  if (translationCache.has(cleaned)) {
    return translationCache.get(cleaned)!;
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${encodeURIComponent(
      cleaned
    )}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0]
          .map((item: unknown) => (Array.isArray(item) ? item[0] : ""))
          .filter(Boolean)
          .join("");

        if (translated && translated.trim().length > 0) {
          const result = translated.trim();
          translationCache.set(cleaned, result);
          return result;
        }
      }
    }
  } catch (err) {
    console.warn("Translation API warning:", err);
  }

  return cleaned;
}

/**
 * Converts English or raw date strings from astrology sources into accurate Turkish date format.
 */
export function parseSourceDateToTurkish(raw?: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();

  // Format 1: DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = trimmed.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
      });
    }
  }

  // Format 2: "Saturday Oct 24th, 2026" or "Saturday, October 24, 2026"
  const noWeekday = trimmed.replace(
    /^(?:Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),?\s*/i,
    ""
  );
  const cleaned = noWeekday.replace(/(?:st|nd|rd|th),?/i, "");
  const months: Record<string, number> = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  const engMatch = cleaned.match(/([a-zA-Z]+)\s+(\d{1,2})\s*,?\s*(\d{4})/);
  if (engMatch) {
    const mStr = engMatch[1].slice(0, 3).toLowerCase();
    const day = parseInt(engMatch[2], 10);
    const year = parseInt(engMatch[3], 10);
    const mIdx = months[mStr];
    if (mIdx !== undefined) {
      const d = new Date(year, mIdx, day);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          weekday: "long",
        });
      }
    }
  }

  return cleanHtmlText(trimmed);
}
