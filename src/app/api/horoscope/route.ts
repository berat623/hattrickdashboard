import { NextRequest, NextResponse } from "next/server";
import {
  DailyHoroscopeItem,
  HoroscopeApiResponse,
  HoroscopeDay,
  HoroscopeSourceId,
  ZodiacSignId,
  ZODIAC_SIGNS,
} from "@/types/horoscope";
import {
  fetchAskGanesha,
  fetchAstroSage,
  fetchGaneshaSpeaks,
} from "@/lib/horoscope-fetcher";
import {
  getFormattedDayDate,
  STATIC_HOROSCOPES,
} from "@/lib/horoscope-data";

// In-memory cache with 30-minute TTL per (sign_source_day) key
interface CacheEntry {
  data: HoroscopeApiResponse;
  timestamp: number;
}
const apiCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000;

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const signParam = (sp.get("sign") || "taurus").toLowerCase() as ZodiacSignId;
    const dayParam = (sp.get("day") || "today").toLowerCase() as HoroscopeDay;
    const sourceParam = sp.get("source")?.toLowerCase() as
      | HoroscopeSourceId
      | undefined;

    // Validate sign
    if (!["taurus", "cancer", "leo", "virgo"].includes(signParam)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Geçersiz burç seçimi. Desteklenen burçlar: taurus (Boğa), cancer (Yengeç), leo (Aslan), virgo (Başak).",
        },
        { status: 400 }
      );
    }

    // Validate day
    const validDay: HoroscopeDay = ["yesterday", "today", "tomorrow"].includes(
      dayParam
    )
      ? dayParam
      : "today";

    const cacheKey = `${signParam}_${validDay}_${sourceParam || "all"}`;
    const cached = apiCache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data);
    }

    const signInfo = ZODIAC_SIGNS[signParam];
    const items: DailyHoroscopeItem[] = [];

    const fetchPromises: Promise<{
      sourceId: HoroscopeSourceId;
      item: DailyHoroscopeItem | null;
    }>[] = [];

    if (!sourceParam || sourceParam === "askganesha") {
      fetchPromises.push(
        fetchAskGanesha(signParam, validDay)
          .then((item) => ({ sourceId: "askganesha" as HoroscopeSourceId, item }))
          .catch(() => ({ sourceId: "askganesha" as HoroscopeSourceId, item: null }))
      );
    }

    if (!sourceParam || sourceParam === "ganeshaspeaks") {
      fetchPromises.push(
        fetchGaneshaSpeaks(signParam, validDay)
          .then((item) => ({ sourceId: "ganeshaspeaks" as HoroscopeSourceId, item }))
          .catch(() => ({ sourceId: "ganeshaspeaks" as HoroscopeSourceId, item: null }))
      );
    }

    // AstroSage: Strictly only for Leo and Virgo AND only today & tomorrow
    if (
      (!sourceParam || sourceParam === "astrosage") &&
      (signParam === "leo" || signParam === "virgo") &&
      validDay !== "yesterday"
    ) {
      fetchPromises.push(
        fetchAstroSage(signParam, validDay)
          .then((item) => ({ sourceId: "astrosage" as HoroscopeSourceId, item }))
          .catch(() => ({ sourceId: "astrosage" as HoroscopeSourceId, item: null }))
      );
    }

    const results = await Promise.allSettled(fetchPromises);
    const dayFallbacks =
      STATIC_HOROSCOPES[validDay]?.[signParam] ||
      STATIC_HOROSCOPES.today[signParam];

    for (const res of results) {
      if (res.status === "fulfilled") {
        if (res.value.item) {
          items.push(res.value.item);
        } else {
          const fallback = dayFallbacks[res.value.sourceId];
          if (fallback) {
            items.push(fallback);
          }
        }
      }
    }

    const availableSources: HoroscopeSourceId[] =
      (signParam === "leo" || signParam === "virgo") && validDay !== "yesterday"
        ? ["askganesha", "ganeshaspeaks", "astrosage"]
        : ["askganesha", "ganeshaspeaks"];

    const responsePayload: HoroscopeApiResponse = {
      success: true,
      day: validDay,
      date: items[0]?.date || getFormattedDayDate(validDay),
      sign: signInfo,
      items,
      availableSources,
    };

    apiCache.set(cacheKey, { data: responsePayload, timestamp: now });

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Horoscope API Route Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Burç yorumları getirilirken beklenmeyen bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}
