"use client";

import { useState, useEffect, useCallback } from "react";
import {
  HoroscopeApiResponse,
  HoroscopeDay,
  ZodiacSignId,
  ZODIAC_SIGNS,
} from "@/types/horoscope";
import { NatalChartData } from "@/types/natal";
import { getHoroscopesForSign } from "@/lib/horoscope-data";
import { calculateNatalChart, CalculateChartParams } from "@/lib/natal-engine";
import { Navbar, NavTab } from "@/components/Navbar";
import { ZodiacSelector } from "@/components/ZodiacSelector";
import { DaySelector } from "@/components/DaySelector";
import { HoroscopeCard } from "@/components/HoroscopeCard";
import { NatalChartForm } from "@/components/NatalChartForm";
import { NatalChartResult } from "@/components/NatalChartResult";
import { Info } from "lucide-react";

export default function HomePage() {
  const [activeNavTab, setActiveNavTab] = useState<NavTab>("daily");

  // Daily Horoscope State
  const [selectedSignId, setSelectedSignId] = useState<ZodiacSignId>("taurus");
  const [selectedDay, setSelectedDay] = useState<HoroscopeDay>("today");
  const [data, setData] = useState<HoroscopeApiResponse>(() =>
    getHoroscopesForSign("taurus", "today")
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Natal Chart State
  const [natalChartData, setNatalChartData] = useState<NatalChartData | null>(
    null
  );
  const [natalLoading, setNatalLoading] = useState<boolean>(false);

  const fetchHoroscope = useCallback(
    async (sign: ZodiacSignId, day: HoroscopeDay) => {
      const fallbackData = getHoroscopesForSign(sign, day);
      setData(fallbackData);
      setError(null);
      setLoading(true);

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

  const handleCalculateNatal = useCallback((params: CalculateChartParams) => {
    setNatalLoading(true);
    try {
      // Immediate client-side calculation using astronomy-engine
      const result = calculateNatalChart(params);
      setNatalChartData(result);
    } catch (err) {
      console.error("Natal calculation error:", err);
    } finally {
      setNatalLoading(false);
    }
  }, []);

  const currentSign = ZODIAC_SIGNS[selectedSignId];
  const items = data?.items || [];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 font-sans transition-colors pb-8">
      {/* Top Bar with Nav Tabs (Günlük Burçlar & Doğum Haritası) */}
      <Navbar
        activeTab={activeNavTab}
        onSelectTab={setActiveNavTab}
        onRefresh={() => fetchHoroscope(selectedSignId, selectedDay)}
        loading={loading}
      />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 sm:py-6 space-y-4">
        {/* VIEW 1: Günlük Burç Yorumları */}
        {activeNavTab === "daily" && (
          <>
            {/* 1. Zodiac Signs Selector */}
            <section aria-label="Burç Seçimi">
              <ZodiacSelector
                selectedSignId={selectedSignId}
                onSelectSign={setSelectedSignId}
              />
            </section>

            {/* 2. Day Selector: Dün | Bugün | Yarın */}
            <section aria-label="Gün Seçimi">
              <DaySelector
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
              />
            </section>

            {/* 3. Error State */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            {/* 4. Horoscope Cards */}
            <section aria-label="Burç Yorumları" className="space-y-3.5">
              {items.length > 0 ? (
                items.map((item) => (
                  <HoroscopeCard
                    key={`${item.sourceId}-${item.signId}-${item.day}`}
                    item={item}
                    sign={currentSign}
                  />
                ))
              ) : (
                <div className="p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 text-center space-y-2 bg-zinc-50 dark:bg-zinc-900/30">
                  <Info className="w-5 h-5 text-zinc-400 mx-auto" />
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Bu gün için henüz yorum bulunamadı.
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {/* VIEW 2: Doğum Haritası Hesaplama (Astroloji.org Entegrasyonu) */}
        {activeNavTab === "natal" && (
          <section aria-label="Doğum Haritası">
            {!natalChartData ? (
              <NatalChartForm
                onCalculate={handleCalculateNatal}
                loading={natalLoading}
              />
            ) : (
              <NatalChartResult
                data={natalChartData}
                onReset={() => setNatalChartData(null)}
              />
            )}
          </section>
        )}
      </main>
    </div>
  );
}
