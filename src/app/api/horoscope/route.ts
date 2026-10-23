import { NextRequest, NextResponse } from "next/server";
import {
  DailyHoroscopeItem,
  HoroscopeApiResponse,
  HoroscopeSourceId,
  ZodiacSignId,
  ZODIAC_SIGNS,
} from "@/types/horoscope";
import {
  fetchAskGanesha,
  fetchAstroSage,
  fetchGaneshaSpeaks,
} from "@/lib/horoscope-fetcher";
import { INITIAL_HOROSCOPES } from "@/lib/horoscope-data";

// In-memory cache with 30-minute TTL
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

    const cacheKey = `${signParam}_${sourceParam || "all"}`;
    const cached = apiCache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data);
    }

    const signInfo = ZODIAC_SIGNS[signParam];
    const items: DailyHoroscopeItem[] = [];

    // Sources to fetch
    const fetchPromises: Promise<{ sourceId: HoroscopeSourceId; item: DailyHoroscopeItem | null }>[] = [];

    if (!sourceParam || sourceParam === "askganesha") {
      fetchPromises.push(
        fetchAskGanesha(signParam)
          .then((item) => ({ sourceId: "askganesha" as HoroscopeSourceId, item }))
          .catch(() => ({ sourceId: "askganesha" as HoroscopeSourceId, item: null }))
      );
    }

    if (!sourceParam || sourceParam === "ganeshaspeaks") {
      fetchPromises.push(
        fetchGaneshaSpeaks(signParam)
          .then((item) => ({ sourceId: "ganeshaspeaks" as HoroscopeSourceId, item }))
          .catch(() => ({ sourceId: "ganeshaspeaks" as HoroscopeSourceId, item: null }))
      );
    }

    // AstroSage is STRICTLY only for Leo (Aslan) and Virgo (Başak)
    if (
      (!sourceParam || sourceParam === "astrosage") &&
      (signParam === "leo" || signParam === "virgo")
    ) {
      fetchPromises.push(
        fetchAstroSage(signParam)
          .then((item) => ({ sourceId: "astrosage" as HoroscopeSourceId, item }))
          .catch(() => ({ sourceId: "astrosage" as HoroscopeSourceId, item: null }))
      );
    }

    const results = await Promise.allSettled(fetchPromises);
    const signFallbacks = INITIAL_HOROSCOPES[signParam];

    for (const res of results) {
      if (res.status === "fulfilled") {
        if (res.value.item) {
          items.push(res.value.item);
        } else {
          // Fallback to pre-bundled high-quality data if remote provider is unreachable or blocks serverless IP
          const fallback = signFallbacks[res.value.sourceId];
          if (fallback) {
            items.push(fallback);
          }
        }
      }
    }

    const availableSources: HoroscopeSourceId[] =
      signParam === "leo" || signParam === "virgo"
        ? ["askganesha", "ganeshaspeaks", "astrosage"]
        : ["askganesha", "ganeshaspeaks"];

    const responsePayload: HoroscopeApiResponse = {
      success: true,
      date: new Date().toLocaleDateString("tr-TR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
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
