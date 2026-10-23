"use client";

import { useState, useEffect, useCallback } from "react";
import {
  HoroscopeApiResponse,
  HoroscopeDay,
  HoroscopeSourceId,
  ZodiacSignId,
  ZODIAC_SIGNS,
} from "@/types/horoscope";
import { DAY_DATES, getHoroscopesForSign } from "@/lib/horoscope-data";
import { Navbar } from "@/components/Navbar";
import { ZodiacSelector } from "@/components/ZodiacSelector";
import { ZodiacProfileCard } from "@/components/ZodiacProfileCard";
import { DaySelector } from "@/components/DaySelector";
import { SourceFilter } from "@/components/SourceFilter";
import { HoroscopeCard } from "@/components/HoroscopeCard";
import { RefreshCw, Info } from "lucide-react";

export default function HomePage() {
  const [selectedSignId, setSelectedSignId] = useState<ZodiacSignId>("taurus");
  const [selectedDay, setSelectedDay] = useState<HoroscopeDay>("today");
  const [selectedSourceId, setSelectedSourceId] = useState<
    HoroscopeSourceId | "all"
  >("all");

  // Initial state comes immediately from pre-bundled data for zero layout shift and 100% offline/static uptime
  const [data, setData] = useState<HoroscopeApiResponse>(() =>
    getHoroscopesForSign("taurus", "today")
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHoroscope = useCallback(
    async (sign: ZodiacSignId, day: HoroscopeDay) => {
      // Immediate local state update for zero latency
      const fallbackData = getHoroscopesForSign(sign, day);
      setData(fallbackData);
      setError(null);

      // Attempt live API fetch if running with backend
      try {
        const res = await fetch(`/api/horoscope?sign=${sign}&day=${day}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json: HoroscopeApiResponse = await res.json();
          if (json.success && json.items.length > 0) {
            setData(json);
          }
        }
      } catch {
        // Fallback remains active
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchHoroscope(selectedSignId, selectedDay);
  }, [selectedSignId, selectedDay, fetchHoroscope]);

  const handleSelectSign = (sign: ZodiacSignId) => {
    setSelectedSignId(sign);
    // If AstroSage was selected but not available on this sign or day, reset to "all"
    if (
      selectedSourceId === "astrosage" &&
      (sign !== "leo" && sign !== "virgo")
    ) {
      setSelectedSourceId("all");
    }
  };

  const handleSelectDay = (day: HoroscopeDay) => {
    setSelectedDay(day);
    if (selectedSourceId === "astrosage" && day === "yesterday") {
      setSelectedSourceId("all");
    }
  };

  const currentSign = ZODIAC_SIGNS[selectedSignId];

  // Filter items by source
  const filteredItems = (data?.items || []).filter((item) => {
    if (selectedSourceId === "all") return true;
    return item.sourceId === selectedSourceId;
  });

  const currentDateDisplay = DAY_DATES[selectedDay];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 font-sans transition-colors pb-20 sm:pb-12">
      <Navbar currentDateStr={currentDateDisplay} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* 1. Minimal Burç Selector (4 Signs: Boğa, Yengeç, Aslan, Başak) */}
        <section aria-label="Burç Seçimi">
          <ZodiacSelector
            selectedSignId={selectedSignId}
            onSelectSign={handleSelectSign}
          />
        </section>

        {/* 2. Compact Sign Info Strip */}
        <section aria-label="Burç Bilgisi">
          <ZodiacProfileCard sign={currentSign} />
        </section>

        {/* 3. Day Selector: Dün | Bugün | Yarın */}
        <section
          aria-label="Gün Seçimi"
          className="pt-1 border-t border-zinc-100 dark:border-zinc-900"
        >
          <DaySelector
            selectedDay={selectedDay}
            onSelectDay={handleSelectDay}
          />
        </section>

        {/* 4. Minimal Source Filter */}
        <section
          aria-label="Kaynak Filtresi"
          className="flex items-center justify-between gap-2"
        >
          <SourceFilter
            selectedSourceId={selectedSourceId}
            onSelectSource={setSelectedSourceId}
            currentSignId={selectedSignId}
            currentDay={selectedDay}
          />

          <button
            type="button"
            onClick={() => fetchHoroscope(selectedSignId, selectedDay)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer shrink-0"
            title="Yorumları Yenile"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin text-zinc-900 dark:text-white" : ""}`}
            />
          </button>
        </section>

        {/* 5. Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* 6. Horoscope Cards List */}
        <section aria-label="Burç Yorumları" className="space-y-4">
          {filteredItems.length > 0 ? (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <HoroscopeCard
                  key={`${item.sourceId}-${item.signId}-${item.day}`}
                  item={item}
                  sign={currentSign}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 text-center space-y-2 bg-zinc-50 dark:bg-zinc-900/30">
              <Info className="w-6 h-6 text-zinc-400 mx-auto" />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Bu kaynak için seçili günde yorum bulunamadı.
              </p>
              <button
                type="button"
                onClick={() => setSelectedSourceId("all")}
                className="text-xs font-semibold text-zinc-900 dark:text-white underline cursor-pointer"
              >
                Tüm kaynakları göster
              </button>
            </div>
          )}
        </section>

        {/* 7. Minimal Disclaimer */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 text-[11px] text-zinc-400 dark:text-zinc-500 text-center leading-relaxed">
          <p>
            Yorumlar <strong>AskGanesha</strong>, <strong>GaneshaSpeaks</strong> ve{" "}
            <strong>AstroSage</strong> (yalnızca Aslan ve Başak) üzerinden
            alınarak Türkçeye çevrilmektedir.
          </p>
        </div>
      </main>

      {/* Dedicated Mobile Quick-Switch Sticky Bar */}
      <nav
        aria-label="Mobil Burç Seçici"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200/80 dark:border-zinc-800/80 px-4 py-2"
      >
        <div className="flex items-center justify-around gap-1">
          {Object.values(ZODIAC_SIGNS).map((s) => {
            const active = s.id === selectedSignId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectSign(s.id)}
                className={`flex-1 py-1 px-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  active
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <div className="text-sm leading-tight">{s.symbol}</div>
                <div className="text-[10px] leading-tight mt-0.5 font-medium">
                  {s.nameTr}
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
