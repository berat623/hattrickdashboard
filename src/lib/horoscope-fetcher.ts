import {
  DailyHoroscopeItem,
  HoroscopeDay,
  HoroscopeSourceId,
  ZodiacSignId,
  ZODIAC_SIGNS,
} from "@/types/horoscope";
import {
  cleanHtmlText,
  parseSourceDateToTurkish,
  translateColorToTurkish,
  translateToTurkish,
} from "./translator";

const COMMON_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
};

/**
 * 1. AskGanesha Fetcher
 * Supports: Taurus, Cancer, Leo, Virgo
 * Days: yesterday, today, tomorrow
 */
export async function fetchAskGanesha(
  signId: ZodiacSignId,
  day: HoroscopeDay = "today"
): Promise<DailyHoroscopeItem | null> {
  const daySuffix =
    day === "yesterday" ? "/yesterday" : day === "tomorrow" ? "/tomorrow" : "";
  const url = `https://www.askganesha.com/sun-sign-horoscope/${signId}-daily-horoscope${daySuffix}`;

  try {
    const res = await fetch(url, {
      headers: COMMON_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`AskGanesha HTTP ${res.status}`);
    }

    const html = await res.text();

    // Extract raw date from <h4><strong>{Date}</strong></h4>
    let rawDate = "";
    const dateMatch = html.match(/<h4><strong>([^<]+)<\/strong><\/h4>/i);
    if (dateMatch) {
      rawDate = cleanHtmlText(dateMatch[1]);
    }
    const formattedDate = parseSourceDateToTurkish(rawDate) || getFallbackDayDate(day);

    let predictionEn = "";
    let luckyColorEn: string | undefined;
    let luckyNumber: string | undefined;

    const bodyMatch = html.match(
      /<div class="prediction-container">[\s\S]*?<\/h4>\s*<p>([\s\S]*?)<\/p>/i
    );

    if (bodyMatch) {
      const rawText = bodyMatch[1];

      const colorMatch = rawText.match(/Your Lucky color is\s+([^.<]+)/i);
      if (colorMatch) {
        luckyColorEn = cleanHtmlText(colorMatch[1]);
      }

      const numMatch = rawText.match(/Your Lucky number is\s+([^.<]+)/i);
      if (numMatch) {
        luckyNumber = cleanHtmlText(numMatch[1]);
      }

      const cleaned = rawText
        .replace(/Your Lucky color is[^.<]*\.?/gi, "")
        .replace(/Your Lucky number is[^.<]*\.?/gi, "")
        .replace(/Sunsign Horoscope[\s\S]*$/gi, "")
        .replace(/<span class="blue-link"[\s\S]*$/gi, "")
        .replace(/<p[\s\S]*$/gi, "");
      predictionEn = cleanHtmlText(cleaned);
    }

    if (!predictionEn || predictionEn.length < 25) {
      throw new Error("AskGanesha prediction text empty");
    }

    let predictionTr = await translateToTurkish(predictionEn);
    predictionTr = predictionTr
      .replace(/\s*Güneş Burcu Burcu\s*\([^)]*\)/gi, "")
      .replace(/\s*Güneş Burcu\s*\([^)]*\)/gi, "")
      .trim();
    const luckyColorTr = translateColorToTurkish(luckyColorEn);

    return {
      signId,
      sourceId: "askganesha",
      sourceName: "AskGanesha",
      day,
      date: formattedDate,
      rawDate,
      predictionEn,
      predictionTr,
      luckyColor: luckyColorEn,
      luckyColorTr,
      luckyNumber,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn(`[AskGanesha] Fetch failed for ${signId} (${day}):`, err);
    return null;
  }
}

/**
 * 2. GaneshaSpeaks Fetcher
 * Supports: Taurus, Cancer, Leo, Virgo
 * Days: yesterday, today, tomorrow
 */
export async function fetchGaneshaSpeaks(
  signId: ZodiacSignId,
  day: HoroscopeDay = "today"
): Promise<DailyHoroscopeItem | null> {
  const url =
    day === "today"
      ? `https://www.ganeshaspeaks.com/horoscopes/daily-horoscope/${signId}/`
      : `https://www.ganeshaspeaks.com/horoscopes/${day}-horoscope/${signId}/`;

  try {
    const res = await fetch(url, {
      headers: COMMON_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`GaneshaSpeaks HTTP ${res.status}`);
    }

    const html = await res.text();

    // Extract date
    let rawDate = "";
    const dateMatch =
      html.match(/<div class="horoscope-description">[\s\S]*?<p>([^<]+)<\/p>/i) ||
      html.match(/(\d{1,2}-\d{1,2}-\d{4})/);
    if (dateMatch) {
      rawDate = cleanHtmlText(dateMatch[1]);
    }
    const formattedDate = parseSourceDateToTurkish(rawDate) || getFallbackDayDate(day);

    let predictionEn = "";
    const pBlockMatch = html.match(
      /<\/div>\s*<p>((?:<p>[\s\S]*?<\/p>\s*)+)<\/p>/i
    );
    if (pBlockMatch) {
      predictionEn = cleanHtmlText(pBlockMatch[1]);
    } else {
      const altMatches =
        html.match(/<p class="card-text[^"]*">([\s\S]*?)<\/p>/gi) ||
        html.match(/<p>([\s\S]*?)<\/p>/gi) ||
        [];
      const candidates = altMatches
        .map((p) => cleanHtmlText(p))
        .filter(
          (t) =>
            t.length > 70 &&
            !t.includes("Log In") &&
            !t.includes("Terms") &&
            !t.includes("Privacy") &&
            !t.includes("Cookie")
        );
      if (candidates.length > 0) {
        predictionEn = candidates.slice(0, 2).join(" ");
      }
    }

    let luckyColorEn: string | undefined;
    let luckyNumber: string | undefined;

    const luckyNumMatch = html.match(
      /Lucky Number\s*<span>\s*([^<]+)\s*<\/span>/i
    );
    if (luckyNumMatch) {
      luckyNumber = cleanHtmlText(luckyNumMatch[1]);
    }

    const luckyColMatch = html.match(
      /Lucky Colou?r\s*<span>\s*([^<]+)\s*<\/span>/i
    );
    if (luckyColMatch) {
      luckyColorEn = cleanHtmlText(luckyColMatch[1]);
    }

    if (!predictionEn || predictionEn.length < 25) {
      throw new Error("GaneshaSpeaks prediction text empty");
    }

    const predictionTr = await translateToTurkish(predictionEn);
    const luckyColorTr = translateColorToTurkish(luckyColorEn);

    return {
      signId,
      sourceId: "ganeshaspeaks",
      sourceName: "GaneshaSpeaks",
      day,
      date: formattedDate,
      rawDate,
      predictionEn,
      predictionTr,
      luckyColor: luckyColorEn,
      luckyColorTr,
      luckyNumber,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn(`[GaneshaSpeaks] Fetch failed for ${signId} (${day}):`, err);
    return null;
  }
}

/**
 * 3. Astroloji.org Fetcher (Yerli / Türkçe Kaynak)
 * Desteklenen Burçlar: Boğa, Yengeç, Aslan, Başak
 * Desteklenen Günler: SADECE BUGÜN (today)
 */
export async function fetchAstrolojiOrg(
  signId: ZodiacSignId,
  day: HoroscopeDay = "today"
): Promise<DailyHoroscopeItem | null> {
  // Astroloji.org sadece o günün yorumunu yayınlar
  if (day !== "today") {
    return null;
  }

  const slugMap: Record<ZodiacSignId, string> = {
    taurus: "boga",
    cancer: "yengec",
    leo: "aslan",
    virgo: "basak",
  };

  const slug = slugMap[signId] || "boga";
  const url = `https://www.astroloji.org/${slug}-burcu-gunluk-yorumu.aspx`;

  try {
    const res = await fetch(url, {
      headers: COMMON_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Astroloji.org HTTP ${res.status}`);
    }

    const html = await res.text();

    // Extract date (e.g. 24 Ekim 2026 Cumartesi)
    let rawDate = "";
    const dateMatch =
      html.match(/<p[^>]*style="[^"]*#7a5a2a[^"]*"[^>]*>([^<]+)<\/p>/i) ||
      html.match(/(\d{1,2}\s+[A-Za-zÇçĞğİıÖöŞşÜü]+\s+\d{4}\s+[A-Za-zÇçĞğİıÖöŞşÜü]+)/);
    if (dateMatch) {
      rawDate = cleanHtmlText(dateMatch[1]);
    }
    const formattedDate = parseSourceDateToTurkish(rawDate) || getFallbackDayDate("today");

    // Extract kutu segments (Aşk, İş, Sağlık)
    const kutuMatches = [...html.matchAll(/<div class="kutu">([\s\S]*?)<\/div>/gi)];
    let predictionTr = "";

    if (kutuMatches.length > 0) {
      predictionTr = kutuMatches
        .map((m) => cleanHtmlText(m[1]))
        .filter((t) => t.length > 10)
        .join(" ");
    } else {
      // Fallback description match
      const descMatch = html.match(/<div class="yorum[^"]*">([\s\S]*?)<\/div>/i);
      if (descMatch) {
        predictionTr = cleanHtmlText(descMatch[1]);
      }
    }

    if (!predictionTr || predictionTr.length < 25) {
      throw new Error("Astroloji.org prediction text empty");
    }

    // Lucky number & color
    let luckyNumber: string | undefined;
    let luckyColorTr: string | undefined;

    const luckyMatch = html.match(
      /U[ğg]urlu Say[ıi]n[ıi]z:\s*<\/b>\s*(\d+)[\s\S]*?U[ğg]urlu Renginiz:\s*<\/b>\s*([^<]+)/i
    );
    if (luckyMatch) {
      luckyNumber = cleanHtmlText(luckyMatch[1]);
      const rawColor = cleanHtmlText(luckyMatch[2]);
      luckyColorTr = translateColorToTurkish(rawColor);
    }

    return {
      signId,
      sourceId: "astrolojiorg",
      sourceName: "Astroloji.org",
      day: "today",
      date: formattedDate,
      rawDate,
      predictionEn: predictionTr,
      predictionTr,
      luckyColor: luckyColorTr,
      luckyColorTr,
      luckyNumber,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn(`[Astroloji.org] Fetch failed for ${signId}:`, err);
    return null;
  }
}

/**
 * 4. AstroSage Fetcher
 * Desteklenen Burçlar: Boğa, Yengeç, Aslan, Başak
 * Günler: today, tomorrow (yesterday not provided by AstroSage)
 */
export async function fetchAstroSage(
  signId: ZodiacSignId,
  day: HoroscopeDay = "today"
): Promise<DailyHoroscopeItem | null> {
  // AstroSage only offers today and tomorrow
  if (day === "yesterday") {
    return null;
  }

  const url =
    day === "tomorrow"
      ? `https://www.astrosage.com/horoscope/${signId}-tomorrow-horoscope.asp?ref=tomorrow`
      : `https://www.astrosage.com/horoscope/daily-${signId}-horoscope.asp`;

  try {
    const res = await fetch(url, {
      headers: COMMON_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`AstroSage HTTP ${res.status}`);
    }

    const html = await res.text();

    let rawDate = "";
    const dateMatch = html.match(
      /(?:Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),\s*[A-Za-z]+\s*\d{1,2},\s*\d{4}/i
    );
    if (dateMatch) {
      rawDate = cleanHtmlText(dateMatch[0]);
    }
    const formattedDate = parseSourceDateToTurkish(rawDate) || getFallbackDayDate(day);

    let predictionEn = "";
    const contentDivs =
      html.match(
        /<div class=['"]ui-large-content text-justify['"]>([\s\S]*?)<\/div>/gi
      ) || [];

    if (contentDivs.length > 0 && contentDivs[0]) {
      predictionEn = cleanHtmlText(contentDivs[0]);
    }

    let luckyNumber: string | undefined;
    let luckyColorEn: string | undefined;
    let remedyEn: string | undefined;

    const numMatch = html.match(/Lucky Number\s*:-?\s*<\/b>\s*([^<]+)/i);
    if (numMatch) {
      luckyNumber = cleanHtmlText(numMatch[1]);
    }

    const colMatch = html.match(/Lucky Colou?r\s*:-?\s*<\/b>\s*([^<]+)/i);
    if (colMatch) {
      luckyColorEn = cleanHtmlText(colMatch[1]);
    }

    const remMatch = html.match(/Remedy\s*:-?\s*<\/b>\s*([^<]+)/i);
    if (remMatch) {
      remedyEn = cleanHtmlText(remMatch[1]);
    }

    if (!predictionEn || predictionEn.length < 25) {
      throw new Error("AstroSage prediction text empty");
    }

    const predictionTr = await translateToTurkish(predictionEn);
    const luckyColorTr = translateColorToTurkish(luckyColorEn);
    const remedyTr = remedyEn ? await translateToTurkish(remedyEn) : undefined;

    return {
      signId,
      sourceId: "astrosage",
      sourceName: "AstroSage",
      day,
      date: formattedDate,
      rawDate,
      predictionEn,
      predictionTr,
      luckyColor: luckyColorEn,
      luckyColorTr,
      luckyNumber,
      remedy: remedyEn,
      remedyTr,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn(`[AstroSage] Fetch failed for ${signId} (${day}):`, err);
    return null;
  }
}

/**
 * Calculates a clean Turkish date relative to today (UTC+3)
 */
function getFallbackDayDate(day: HoroscopeDay): string {
  const d = new Date();
  if (day === "yesterday") {
    d.setDate(d.getDate() - 1);
  } else if (day === "tomorrow") {
    d.setDate(d.getDate() + 1);
  }
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });
}
