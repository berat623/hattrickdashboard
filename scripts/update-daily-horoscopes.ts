import fs from "fs";
import path from "path";
import {
  fetchAskGanesha,
  fetchGaneshaSpeaks,
  fetchAstrolojiOrg,
  fetchAstroSage,
} from "../src/lib/horoscope-fetcher";
import {
  DailyHoroscopeItem,
  HoroscopeDay,
  HoroscopeSourceId,
  ZodiacSignId,
} from "../src/types/horoscope";

const SIGNS: ZodiacSignId[] = ["taurus", "cancer", "leo", "virgo"];
const DAYS: HoroscopeDay[] = ["yesterday", "today", "tomorrow"];

type StoreStructure = Record<
  HoroscopeDay,
  Record<ZodiacSignId, Record<HoroscopeSourceId, DailyHoroscopeItem | null>>
>;

async function updateHoroscopes() {
  console.log("🌟 Günlük burç verilerini çekme ve güncelleme başlatılıyor...");
  const startTime = Date.now();

  const store: StoreStructure = {
    yesterday: {
      taurus: { astrolojiorg: null, askganesha: null, ganeshaspeaks: null, astrosage: null },
      cancer: { astrolojiorg: null, askganesha: null, ganeshaspeaks: null, astrosage: null },
      leo: { astrolojiorg: null, askganesha: null, ganeshaspeaks: null, astrosage: null },
      virgo: { astrolojiorg: null, askganesha: null, ganeshaspeaks: null, astrosage: null },
    },
    today: {
      taurus: { astrolojiorg: null, askganesha: null, ganeshaspeaks: null, astrosage: null },
      cancer: { astrolojiorg: null, askganesha: null, ganeshaspeaks: null, astrosage: null },
      leo: { astrolojiorg: null, askganesha: null, ganeshaspeaks: null, astrosage: null },
      virgo: { astrolojiorg: null, askganesha: null, ganeshaspeaks: null, astrosage: null },
    },
    tomorrow: {
      taurus: { astrolojiorg: null, askganesha: null, ganeshaspeaks: null, astrosage: null },
      cancer: { astrolojiorg: null, askganesha: null, ganeshaspeaks: null, astrosage: null },
      leo: { astrolojiorg: null, askganesha: null, ganeshaspeaks: null, astrosage: null },
      virgo: { astrolojiorg: null, askganesha: null, ganeshaspeaks: null, astrosage: null },
    },
  };

  for (const sign of SIGNS) {
    console.log(`\n♈ [${sign.toUpperCase()}] Burcu taranıyor...`);

    for (const day of DAYS) {
      console.log(`  📅 Gün: ${day}`);

      // 1. Astroloji.org (Sadece Bugün)
      if (day === "today") {
        try {
          process.stdout.write("    -> Astroloji.org çekiliyor... ");
          const item = await fetchAstrolojiOrg(sign, "today");
          if (item) {
            store[day][sign].astrolojiorg = item;
            console.log("✅ Başarılı");
          } else {
            console.log("⚠️ Veri boş");
          }
        } catch (e: any) {
          console.log(`❌ Hata: ${e.message}`);
        }
      }

      // 2. AskGanesha (Dün, Bugün, Yarın)
      try {
        process.stdout.write("    -> AskGanesha çekiliyor... ");
        const item = await fetchAskGanesha(sign, day);
        if (item) {
          store[day][sign].askganesha = item;
          console.log("✅ Başarılı");
        } else {
          console.log("⚠️ Veri boş");
        }
      } catch (e: any) {
        console.log(`❌ Hata: ${e.message}`);
      }

      // 3. GaneshaSpeaks (Dün, Bugün, Yarın)
      try {
        process.stdout.write("    -> GaneshaSpeaks çekiliyor... ");
        const item = await fetchGaneshaSpeaks(sign, day);
        if (item) {
          store[day][sign].ganeshaspeaks = item;
          console.log("✅ Başarılı");
        } else {
          console.log("⚠️ Veri boş");
        }
      } catch (e: any) {
        console.log(`❌ Hata: ${e.message}`);
      }

      // 4. AstroSage (Bugün, Yarın)
      if (day !== "yesterday") {
        try {
          process.stdout.write("    -> AstroSage çekiliyor... ");
          const item = await fetchAstroSage(sign, day);
          if (item) {
            store[day][sign].astrosage = item;
            console.log("✅ Başarılı");
          } else {
            console.log("⚠️ Veri boş");
          }
        } catch (e: any) {
          console.log(`❌ Hata: ${e.message}`);
        }
      }
    }
  }

  // Ensure public/data folder exists
  const publicDataDir = path.join(__dirname, "../public/data");
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }

  const jsonFilePath = path.join(publicDataDir, "daily-horoscopes.json");
  fs.writeFileSync(jsonFilePath, JSON.stringify(store, null, 2), "utf-8");
  console.log(`\n💾 Canlı veriler kaydedildi: ${jsonFilePath}`);

  // Also update src/lib/horoscope-data.ts with fresh static fallback data
  const horoscopeDataTsPath = path.join(__dirname, "../src/lib/horoscope-data.ts");
  const tsContent = `import {
  DailyHoroscopeItem,
  HoroscopeApiResponse,
  HoroscopeDay,
  HoroscopeSourceId,
  ZodiacSignId,
  ZODIAC_SIGNS,
} from "@/types/horoscope";

export function getFormattedDayDate(day: HoroscopeDay = "today"): string {
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

export function getShortFormattedDayDate(day: HoroscopeDay = "today"): string {
  const d = new Date();
  if (day === "yesterday") {
    d.setDate(d.getDate() - 1);
  } else if (day === "tomorrow") {
    d.setDate(d.getDate() + 1);
  }
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
  });
}

export const DAY_DATES: Record<HoroscopeDay, string> = {
  get yesterday() {
    return getFormattedDayDate("yesterday");
  },
  get today() {
    return getFormattedDayDate("today");
  },
  get tomorrow() {
    return getFormattedDayDate("tomorrow");
  },
};

export const STATIC_HOROSCOPES: Record<
  HoroscopeDay,
  Record<ZodiacSignId, Record<HoroscopeSourceId, DailyHoroscopeItem | null>>
> = ${JSON.stringify(store, null, 2)};

export function getHoroscopesForSign(
  signId: ZodiacSignId,
  day: HoroscopeDay = "today"
): HoroscopeApiResponse {
  const signInfo = ZODIAC_SIGNS[signId];
  const dayGroup = STATIC_HOROSCOPES[day] || STATIC_HOROSCOPES.today;
  const itemsMap = dayGroup[signId];
  const items: DailyHoroscopeItem[] = [];

  const formattedDate = getFormattedDayDate(day);

  // 1. Astroloji.org: SADECE BUGÜN (today) gösterilir
  if (itemsMap?.astrolojiorg && day === "today") {
    items.push({
      ...itemsMap.astrolojiorg,
      date: formattedDate,
    });
  }

  // 2. AskGanesha: Dün, Bugün, Yarın
  if (itemsMap?.askganesha) {
    items.push({
      ...itemsMap.askganesha,
      date: formattedDate,
    });
  }

  // 3. GaneshaSpeaks: Dün, Bugün, Yarın
  if (itemsMap?.ganeshaspeaks) {
    items.push({
      ...itemsMap.ganeshaspeaks,
      date: formattedDate,
    });
  }

  // 4. AstroSage: Boğa, Yengeç, Aslan ve Başak için Bugün ve Yarın
  if (itemsMap?.astrosage && day !== "yesterday") {
    items.push({
      ...itemsMap.astrosage,
      date: formattedDate,
    });
  }

  const availableSources: HoroscopeSourceId[] =
    day === "today"
      ? ["astrolojiorg", "askganesha", "ganeshaspeaks", "astrosage"]
      : day === "tomorrow"
      ? ["askganesha", "ganeshaspeaks", "astrosage"]
      : ["askganesha", "ganeshaspeaks"];

  return {
    success: true,
    day,
    date: formattedDate,
    sign: signInfo,
    items,
    availableSources,
  };
}
`;

  fs.writeFileSync(horoscopeDataTsPath, tsContent, "utf-8");
  console.log(`💾 src/lib/horoscope-data.ts güncellendi!`);

  console.log(`\n🎉 Bütün burç verileri ${(Date.now() - startTime) / 1000} saniyede başarıyla güncellendi!`);
}

updateHoroscopes().catch((err) => {
  console.error("Güncelleme sırasında hata:", err);
  process.exit(1);
});
