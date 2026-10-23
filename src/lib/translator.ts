const translationCache = new Map<string, string>();

const COLOR_MAP_TR: Record<string, string> = {
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
  teal: "Camgöbeği",
  turquoise: "Turkuaz",
  saffron: "Safran Sarısı",
  coral: "Mercan",
  lavender: "Lavanta",
  "black and blue": "Siyah ve Mavi",
  "red and white": "Kırmızı ve Beyaz",
  "yellow and orange": "Sarı ve Turuncu",
};

export function translateColorToTurkish(colorEn?: string): string | undefined {
  if (!colorEn) return undefined;
  const normalized = colorEn.trim().toLowerCase();
  if (COLOR_MAP_TR[normalized]) {
    return COLOR_MAP_TR[normalized];
  }
  for (const [k, v] of Object.entries(COLOR_MAP_TR)) {
    if (normalized.includes(k)) {
      return v;
    }
  }
  return colorEn;
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
 * Translates English horoscope text into Turkish using Google Translate API
 * with automatic fallback and in-memory caching.
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

  // Fallback: If translation API is unavailable, return cleaned English text
  return cleaned;
}
