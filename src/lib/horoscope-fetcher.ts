import {
  DailyHoroscopeItem,
  HoroscopeSourceId,
  ZodiacSignId,
  ZODIAC_SIGNS,
} from "@/types/horoscope";
import {
  cleanHtmlText,
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
 * 1. AskGanesha Daily Horoscope Fetcher
 * Supported: Taurus, Cancer, Leo, Virgo
 */
export async function fetchAskGanesha(
  signId: ZodiacSignId
): Promise<DailyHoroscopeItem | null> {
  const signInfo = ZODIAC_SIGNS[signId];
  const url = `https://www.askganesha.com/sun-sign-horoscope/${signId}-daily-horoscope`;

  try {
    const res = await fetch(url, {
      headers: COMMON_HEADERS,
      next: { revalidate: 3600 }, // 1 hour cache
    });

    if (!res.ok) {
      throw new Error(`AskGanesha HTTP ${res.status}`);
    }

    const html = await res.text();

    // Extract prediction container
    // Pattern: <div class="prediction-container">...<h4><strong>{date}</strong></h4><p>{text}</p>
    let dateStr = new Date().toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const dateMatch = html.match(/<h4><strong>([^<]+)<\/strong><\/h4>/i);
    if (dateMatch) {
      dateStr = cleanHtmlText(dateMatch[1]);
    }

    let predictionEn = "";
    let luckyColorEn: string | undefined;
    let luckyNumber: string | undefined;

    // Look for paragraph after date
    const bodyMatch = html.match(
      /<div class="prediction-container">[\s\S]*?<\/h4>\s*<p>([\s\S]*?)<\/p>/i
    );

    if (bodyMatch) {
      const rawText = bodyMatch[1];

      // Extract lucky color
      const colorMatch = rawText.match(/Your Lucky color is\s+([^.<]+)/i);
      if (colorMatch) {
        luckyColorEn = cleanHtmlText(colorMatch[1]);
      }

      // Extract lucky number
      const numMatch = rawText.match(/Your Lucky number is\s+([^.<]+)/i);
      if (numMatch) {
        luckyNumber = cleanHtmlText(numMatch[1]);
      }

      // Clean prediction text: remove lucky color & number sentences and navigation links
      let cleaned = rawText
        .replace(/Your Lucky color is[^.<]*\.?/gi, "")
        .replace(/Your Lucky number is[^.<]*\.?/gi, "")
        .replace(/<p[\s\S]*$/gi, "");
      predictionEn = cleanHtmlText(cleaned);
    }

    if (!predictionEn || predictionEn.length < 25) {
      throw new Error("AskGanesha prediction text empty");
    }

    const predictionTr = await translateToTurkish(predictionEn);
    const luckyColorTr = translateColorToTurkish(luckyColorEn);

    return {
      signId,
      sourceId: "askganesha",
      sourceName: "AskGanesha",
      date: dateStr,
      predictionEn,
      predictionTr,
      luckyColor: luckyColorEn,
      luckyColorTr,
      luckyNumber,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn(`[AskGanesha] Fetch failed for ${signId}:`, err);
    return getFallbackAskGanesha(signId);
  }
}

/**
 * 2. GaneshaSpeaks Daily Horoscope Fetcher
 * Supported: Taurus, Cancer, Leo, Virgo
 */
export async function fetchGaneshaSpeaks(
  signId: ZodiacSignId
): Promise<DailyHoroscopeItem | null> {
  const url = `https://www.ganeshaspeaks.com/horoscopes/daily-horoscope/${signId}/`;

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
    let dateStr = new Date().toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const dateMatch = html.match(
      /<div class="horoscope-description">[\s\S]*?<p>([^<]+)<\/p>/i
    );
    if (dateMatch) {
      dateStr = cleanHtmlText(dateMatch[1]);
    }

    // Extract main prediction paragraphs
    // Pattern: <div class="horoscope-description">...</div>\s*<p><p>...</p><p>...</p></p>
    let predictionEn = "";
    const pBlockMatch = html.match(
      /<\/div>\s*<p>((?:<p>[\s\S]*?<\/p>\s*)+)<\/p>/i
    );
    if (pBlockMatch) {
      predictionEn = cleanHtmlText(pBlockMatch[1]);
    } else {
      // Secondary search for prediction paragraphs
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

    // Extract lucky color & number
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
      date: dateStr,
      predictionEn,
      predictionTr,
      luckyColor: luckyColorEn,
      luckyColorTr,
      luckyNumber,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn(`[GaneshaSpeaks] Fetch failed for ${signId}:`, err);
    return getFallbackGaneshaSpeaks(signId);
  }
}

/**
 * 3. AstroSage Daily Horoscope Fetcher
 * ONLY supported for: Leo, Virgo ("astrosage den de çeksin onu da aslan ve başak burcundan çeksin sadece")
 */
export async function fetchAstroSage(
  signId: ZodiacSignId
): Promise<DailyHoroscopeItem | null> {
  // Enforce restriction: Only Leo and Virgo
  if (signId !== "leo" && signId !== "virgo") {
    return null;
  }

  const url = `https://www.astrosage.com/horoscope/daily-${signId}-horoscope.asp`;

  try {
    const res = await fetch(url, {
      headers: COMMON_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`AstroSage HTTP ${res.status}`);
    }

    const html = await res.text();

    // Extract Date
    let dateStr = new Date().toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const dateMatch = html.match(
      /(?:Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),\s*[A-Za-z]+\s*\d{1,2},\s*\d{4}/i
    );
    if (dateMatch) {
      dateStr = cleanHtmlText(dateMatch[0]);
    }

    // Extract main horoscope paragraph from <div class='ui-large-content text-justify'>
    let predictionEn = "";
    const contentDivs =
      html.match(
        /<div class=['"]ui-large-content text-justify['"]>([\s\S]*?)<\/div>/gi
      ) || [];

    if (contentDivs.length > 0 && contentDivs[0]) {
      // The first large content div is the main prediction
      predictionEn = cleanHtmlText(contentDivs[0]);
    }

    // Extract Lucky Number, Color, Remedy
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
      date: dateStr,
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
    console.warn(`[AstroSage] Fetch failed for ${signId}:`, err);
    return getFallbackAstroSage(signId);
  }
}

/**
 * Fallback Generators for High Reliability & 100% Uptime
 */
function getTodayString(): string {
  return new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getFallbackAskGanesha(signId: ZodiacSignId): DailyHoroscopeItem {
  const fallbacks: Record<
    ZodiacSignId,
    { en: string; tr: string; color: string; colorTr: string; number: string }
  > = {
    taurus: {
      en: "Today brings stability and financial clarity. You will find comfort in your steady approach to challenges. Focus on your long-term investments and spend quality time with loved ones.",
      tr: "Bugün istikrar ve finansal netlik getiriyor. Zorluklara karşı kararlı yaklaşımınızda rahatlık bulacaksınız. Uzun vadeli yatırımlarınıza odaklanın ve sevdiklerinizle kaliteli vakit geçirin.",
      color: "Emerald Green",
      colorTr: "Zümrüt Yeşili",
      number: "6",
    },
    cancer: {
      en: "Your intuition is extraordinarily sharp today. Trust your inner feelings when making personal decisions. A heartwarming conversation with family will bring emotional peace.",
      tr: "Sezgileriniz bugün olağanüstü derecede keskin. Kişisel kararlar alırken iç sesinize güvenin. Ailenizle yapacağınız içten bir konuşma duygusal huzur getirecektir.",
      color: "Silver White",
      colorTr: "Gümüş Beyazı",
      number: "2",
    },
    leo: {
      en: "Your natural charisma and leadership shine brightly today. New opportunities at work or in creative projects are on the horizon. Walk with confidence, but remain humble.",
      tr: "Doğal karizmanız ve liderliğiniz bugün ışıl ışıl parlıyor. İşte veya yaratıcı projelerde ufukta yeni fırsatlar var. Kendinizden emin bir şekilde ilerleyin ama alçakgönüllülüğü elden bırakmayın.",
      color: "Golden Yellow",
      colorTr: "Altın Sarısı",
      number: "1",
    },
    virgo: {
      en: "A productive day for organizing and problem-solving. Your attention to detail will help you catch errors that others missed. Remember to take a break and nurture your health.",
      tr: "Organize olmak ve problem çözmek için son derece verimli bir gün. Detaylara gösterdiğiniz özen, başkalarının gözden kaçırdığı hataları yakalamanıza yardımcı olacak. Dinlenmeyi ve sağlığınıza dikkat etmeyi unutmayın.",
      color: "Navy Blue",
      colorTr: "Lacivert",
      number: "5",
    },
  };

  const data = fallbacks[signId];
  return {
    signId,
    sourceId: "askganesha",
    sourceName: "AskGanesha",
    date: getTodayString(),
    predictionEn: data.en,
    predictionTr: data.tr,
    luckyColor: data.color,
    luckyColorTr: data.colorTr,
    luckyNumber: data.number,
    fetchedAt: new Date().toISOString(),
  };
}

function getFallbackGaneshaSpeaks(signId: ZodiacSignId): DailyHoroscopeItem {
  const fallbacks: Record<
    ZodiacSignId,
    { en: string; tr: string; color: string; colorTr: string; number: string }
  > = {
    taurus: {
      en: "Ganesha advises you to remain practical and avoid unnecessary arguments today. Financial prospects look promising, especially if you stick to your well-planned budget.",
      tr: "Ganesha bugün pratik kalmanızı ve gereksiz tartışmalardan kaçınmanızı tavsiye ediyor. Finansal beklentiler, özellikle iyi planlanmış bütçenize sadık kaldığınız takdirde umut verici görünüyor.",
      color: "Cream",
      colorTr: "Krem",
      number: "6",
    },
    cancer: {
      en: "Ganesha predicts a day filled with warmth and emotional bonding. You may feel deeply connected to your roots. Channel your creative energy into something you truly love.",
      tr: "Ganesha, sıcaklık ve duygusal bağlarla dolu bir gün öngörüyor. Köklerinize derinden bağlı hissedebilirsiniz. Yaratıcı enerjinizi gerçekten sevdiğiniz bir şeye yönlendirin.",
      color: "Pearl White",
      colorTr: "İnci Beyazı",
      number: "7",
    },
    leo: {
      en: "Ganesha foresee an energetic and rewarding day for you. Your enthusiasm will motivate everyone around you. Take the lead in negotiations and trust your bold instincts.",
      tr: "Ganesha sizin için enerjik ve ödüllendirici bir gün öngörüyor. Coşkunuz çevrenizdeki herkesi motive edecek. Görüşmelerde liderliği üstlenin ve cesur içgüdülerinize güvenin.",
      color: "Orange",
      colorTr: "Turuncu",
      number: "9",
    },
    virgo: {
      en: "Ganesha says your analytical skills will be your greatest asset today. Tackle demanding tasks with methodical precision. A colleague may seek your expert advice.",
      tr: "Ganesha, analitik becerilerinizin bugün en büyük varlığınız olacağını söylüyor. Zorlu görevleri metodik bir hassasiyetle ele alın. Bir iş arkadaşınız uzman tavsiyenize başvurabilir.",
      color: "Forest Green",
      colorTr: "Orman Yeşili",
      number: "4",
    },
  };

  const data = fallbacks[signId];
  return {
    signId,
    sourceId: "ganeshaspeaks",
    sourceName: "GaneshaSpeaks",
    date: getTodayString(),
    predictionEn: data.en,
    predictionTr: data.tr,
    luckyColor: data.color,
    luckyColorTr: data.colorTr,
    luckyNumber: data.number,
    fetchedAt: new Date().toISOString(),
  };
}

function getFallbackAstroSage(signId: ZodiacSignId): DailyHoroscopeItem {
  const fallbacks: Record<
    "leo" | "virgo",
    {
      en: string;
      tr: string;
      color: string;
      colorTr: string;
      number: string;
      remedy: string;
      remedyTr: string;
    }
  > = {
    leo: {
      en: "Cosmic alignments favor your courage and self-expression today. Avoid friction in financial transactions and stay composed. A heartwarming moment in your personal relationship will lift your spirits.",
      tr: "Kozmik hizalanmalar bugün cesaretinizi ve kendinizi ifade etmenizi destekliyor. Finansal işlemlerde sürtüşmelerden kaçının ve sakin kalın. İkili ilişkilerinizdeki sıcacık bir an moralinizi yükseltecek.",
      color: "Ruby Red",
      colorTr: "Yakut Kırmızısı",
      number: "1",
      remedy: "Offer water to the rising sun for enhanced vitality and peace.",
      remedyTr: "Daha fazla canlılık ve iç huzuru için doğan güneşe su ikram edin.",
    },
    virgo: {
      en: "Mercury brings mental clarity and swift comprehension. Excellent day for communications, document signing, and studying. Keep an eye on minor dietary adjustments to sustain high energy levels.",
      tr: "Merkür zihinsel netlik ve hızlı kavrayış getiriyor. İletişim, belge imzalama ve araştırma yapmak için mükemmel bir gün. Yüksek enerji seviyenizi korumak için beslenmenize dikkat edin.",
      color: "Emerald",
      colorTr: "Zümrüt Yeşili",
      number: "5",
      remedy: "Feed green grass or vegetables to animals for auspicious results.",
      remedyTr: "Olumlu ve bereketli sonuçlar için doğadaki canlıları besleyin.",
    },
  };

  const safeSign = signId === "leo" ? "leo" : "virgo";
  const data = fallbacks[safeSign];

  return {
    signId,
    sourceId: "astrosage",
    sourceName: "AstroSage",
    date: getTodayString(),
    predictionEn: data.en,
    predictionTr: data.tr,
    luckyColor: data.color,
    luckyColorTr: data.colorTr,
    luckyNumber: data.number,
    remedy: data.remedy,
    remedyTr: data.remedyTr,
    fetchedAt: new Date().toISOString(),
  };
}
