"use client";

import { useState, useEffect, useCallback } from "react";
import {
  HoroscopeApiResponse,
  HoroscopeSourceId,
  ZodiacSignId,
  ZODIAC_SIGNS,
} from "@/types/horoscope";
import { getHoroscopesForSign } from "@/lib/horoscope-data";
import { Navbar } from "@/components/Navbar";
import { ZodiacSelector } from "@/components/ZodiacSelector";
import { ZodiacProfileCard } from "@/components/ZodiacProfileCard";
import { SourceFilter } from "@/components/SourceFilter";
import { HoroscopeCard } from "@/components/HoroscopeCard";
import {
  Sparkles,
  RefreshCw,
  Compass,
  AlertCircle,
  ShieldCheck,
  Star,
  Info,
} from "lucide-react";

export default function HomePage() {
  const [selectedSignId, setSelectedSignId] = useState<ZodiacSignId>("taurus");
  const [selectedSourceId, setSelectedSourceId] = useState<
    HoroscopeSourceId | "all"
  >("all");
  const [data, setData] = useState<HoroscopeApiResponse>(() =>
    getHoroscopesForSign("taurus")
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHoroscope = useCallback(async (sign: ZodiacSignId) => {
    // If we already have data for this sign from horoscope-data, update immediately
    const fallbackData = getHoroscopesForSign(sign);
    setData(fallbackData);
    setError(null);

    // Then try live API fetch if running in an environment with Node.js backend
    try {
      const res = await fetch(`/api/horoscope?sign=${sign}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json: HoroscopeApiResponse = await res.json();
        if (json.success && json.items.length > 0) {
          setData(json);
        }
      }
    } catch {
      // In static environments (e.g. GitHub Pages), fallbackData is already in place
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHoroscope(selectedSignId);
  }, [selectedSignId, fetchHoroscope]);

  // Handle source availability (AstroSage is only available for Leo and Virgo)
  const handleSelectSign = (sign: ZodiacSignId) => {
    setSelectedSignId(sign);
    if (selectedSourceId === "astrosage" && sign !== "leo" && sign !== "virgo") {
      setSelectedSourceId("all");
    }
  };

  const currentSign = ZODIAC_SIGNS[selectedSignId];

  // Filter items by source
  const filteredItems = (data?.items || []).filter((item) => {
    if (selectedSourceId === "all") return true;
    return item.sourceId === selectedSourceId;
  });

  const todayStr =
    data?.date ||
    new Date().toLocaleDateString("tr-TR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060b14] text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors">
      <Navbar currentDateStr={todayStr} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="relative p-6 sm:p-10 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GÜNLÜK HİNT & VEDİK ASTROLOJİSİ</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Kozmik Yıldız Rehberiniz & Günlük Burç Öngörüleri
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Dünyanın önde gelen astroloji platformları{" "}
              <strong className="text-amber-300 font-bold">AskGanesha</strong>,{" "}
              <strong className="text-emerald-300 font-bold">
                GaneshaSpeaks
              </strong>{" "}
              ve{" "}
              <strong className="text-purple-300 font-bold">AstroSage</strong>{" "}
              üzerinden anlık çekilen burç yorumları, yapay zeka destekli akıcı
              Türkçe tercümeyle sizlerle buluşuyor.
            </p>
          </div>
        </div>

        {/* 1. Zodiac Signs Picker (Boğa, Yengeç, Aslan, Başak) */}
        <ZodiacSelector
          selectedSignId={selectedSignId}
          onSelectSign={handleSelectSign}
        />

        {/* 2. Selected Sign Profile Card */}
        <ZodiacProfileCard sign={currentSign} />

        {/* 3. Source Filter Switcher */}
        <SourceFilter
          selectedSourceId={selectedSourceId}
          onSelectSource={setSelectedSourceId}
          currentSignId={selectedSignId}
        />

        {/* Error State */}
        {error && (
          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => fetchHoroscope(selectedSignId)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-extrabold cursor-pointer"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-24 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
                    <div className="w-16 h-3 rounded-md bg-slate-100 dark:bg-slate-800/60" />
                  </div>
                </div>
                <div className="space-y-2 py-4">
                  <div className="w-full h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="w-5/6 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="w-4/6 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-4">
                  <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
                  <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Horoscope Cards Grid */}
        {!loading && filteredItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  {currentSign.nameTr} Burcu İçin Günlük Öngörüler (
                  {filteredItems.length} Kaynak)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => fetchHoroscope(selectedSignId)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Yenile</span>
              </button>
            </div>

            <div
              className={`grid grid-cols-1 gap-6 ${
                filteredItems.length === 1
                  ? "max-w-2xl mx-auto"
                  : filteredItems.length === 2
                  ? "md:grid-cols-2"
                  : "md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {filteredItems.map((item) => (
                <HoroscopeCard
                  key={`${item.sourceId}-${item.signId}`}
                  item={item}
                  sign={currentSign}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && !error && (
          <div className="p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3">
            <Info className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Bu kaynak için yorum bulunamadı
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Seçili burç için diğer kaynakları görüntülemek üzere &ldquo;Tüm
              Kaynakları Karşılaştır&rdquo; butonuna tıklayabilirsiniz.
            </p>
            <button
              type="button"
              onClick={() => setSelectedSourceId("all")}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
            >
              Tüm Kaynakları Göster
            </button>
          </div>
        )}

        {/* Informational Astrological Guide Box */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Kullanılan Astroloji Kaynakları Hakkında Bilgilendirme</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Bu platform; <strong>AskGanesha</strong> ve{" "}
            <strong>GaneshaSpeaks</strong> üzerinden Boğa, Yengeç, Aslan ve Başak
            burçlarının günlük öngörülerini; <strong>AstroSage</strong> üzerinden
            ise kural gereği yalnızca Aslan ve Başak burçlarının Vedik ay burcu
            yorumlarını canlı olarak çeker ve Türkçeye çevirir. Tüm haklar
            orijinal içerik sağlayıcılarına aittir.
          </p>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
        <p className="font-semibold">
          © {new Date().getFullYear()} AstroVeda • AskGanesha, GaneshaSpeaks &
          AstroSage Günlük Burç Yorumları Servisi
        </p>
      </footer>
    </div>
  );
}
