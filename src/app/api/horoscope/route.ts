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

    // Determine sources to fetch
    const fetchPromises: Promise<DailyHoroscopeItem | null>[] = [];

    if (!sourceParam || sourceParam === "askganesha") {
      fetchPromises.push(fetchAskGanesha(signParam));
    }

    if (!sourceParam || sourceParam === "ganeshaspeaks") {
      fetchPromises.push(fetchGaneshaSpeaks(signParam));
    }

    // AstroSage is STRICTLY only for Leo (Aslan) and Virgo (Başak)
    if (
      (!sourceParam || sourceParam === "astrosage") &&
      (signParam === "leo" || signParam === "virgo")
    ) {
      fetchPromises.push(fetchAstroSage(signParam));
    }

    const results = await Promise.allSettled(fetchPromises);
    for (const res of results) {
      if (res.status === "fulfilled" && res.value) {
        items.push(res.value);
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
