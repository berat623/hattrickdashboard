"use client";

import { useState } from "react";
import {
  DailyHoroscopeItem,
  HOROSCOPE_SOURCES,
  ZodiacSignInfo,
} from "@/types/horoscope";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Compass,
  Palette,
  Hash,
  Award,
  Globe2,
} from "lucide-react";

interface HoroscopeCardProps {
  item: DailyHoroscopeItem;
  sign: ZodiacSignInfo;
}

export function HoroscopeCard({ item, sign }: HoroscopeCardProps) {
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const sourceMeta = HOROSCOPE_SOURCES[item.sourceId];

  // Speech synthesis for listening to the Turkish horoscope
  const handleToggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Tarayıcınız sesli okuma özelliğini desteklemiyor.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = showOriginal ? item.predictionEn : item.predictionTr;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = showOriginal ? "en-US" : "tr-TR";
    utterance.rate = 0.95; // Natural calm reading speed
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleCopy = () => {
    const textToCopy = `${sign.nameTr} Burcu Yorumu (${sourceMeta.name} - ${item.date}):\n\n${
      showOriginal ? item.predictionEn : item.predictionTr
    }\n\nŞanslı Sayı: ${item.luckyNumber || "-"}\nŞanslı Renk: ${
      item.luckyColorTr || item.luckyColor || "-"
    }`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transition-all space-y-5 flex flex-col justify-between">
      {/* Header: Source, Date & Quick Action Tools */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-amber-500/15 border border-indigo-500/20 flex items-center justify-center text-xl shrink-0">
              {item.sourceId === "askganesha" && "🕉️"}
              {item.sourceId === "ganeshaspeaks" && "✨"}
              {item.sourceId === "astrosage" && "🔮"}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  {item.sourceName}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {sourceMeta.origin}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.date}</span>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5">
            {/* Language Switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShowOriginal(false)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  !showOriginal
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                🇹🇷 Türkçe
              </button>
              <button
                type="button"
                onClick={() => setShowOriginal(true)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  showOriginal
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                🇬🇧 English
              </button>
            </div>

            {/* TTS Audio Player */}
            <button
              type="button"
              onClick={handleToggleSpeech}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isPlaying
                  ? "bg-amber-500 text-slate-950 border-amber-600 animate-pulse shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              title={isPlaying ? "Durdur" : "Sesli Dinle"}
            >
              {isPlaying ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Yorumu Kopyala"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Source Website External Link */}
            <a
              href={sourceMeta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Orijinal Web Sitesini Ziyaret Et"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Prediction Body */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${sign.colorScheme.badge}`}
            >
              {sign.symbol} {sign.nameTr} Burcu Günlük Yorumu
            </span>
            <span className="text-[11px] text-slate-400">
              {showOriginal ? "(Orijinal Metin)" : "(Türkçe Çeviri)"}
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-line selection:bg-indigo-500 selection:text-white">
            {showOriginal ? item.predictionEn : item.predictionTr}
          </p>
        </div>
      </div>

      {/* Footer Indicators: Lucky Number, Lucky Color, Remedy */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Lucky Number */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Hash className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                Şanslı Sayı
              </div>
              <div className="text-sm font-black text-slate-900 dark:text-white truncate">
                {item.luckyNumber || "7"}
              </div>
            </div>
          </div>

          {/* Lucky Color */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Palette className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                Şanslı Renk
              </div>
              <div className="text-sm font-black text-slate-900 dark:text-white truncate">
                {item.luckyColorTr || item.luckyColor || "Zümrüt"}
              </div>
            </div>
          </div>

          {/* Source Tag */}
          <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                Astro Ekolü
              </div>
              <div className="text-sm font-black text-slate-900 dark:text-white truncate">
                {item.sourceId === "astrosage" ? "Vedik Ay Burcu" : "Hint Astrolojisi"}
              </div>
            </div>
          </div>
        </div>

        {/* AstroSage Remedy if available */}
        {(item.remedy || item.remedyTr) && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-extrabold text-amber-700 dark:text-amber-400">
              <Award className="w-3.5 h-3.5" />
              <span>Günün Vedik İyileştirici Tavsiyesi (Remedy):</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {showOriginal ? item.remedy : item.remedyTr || item.remedy}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
