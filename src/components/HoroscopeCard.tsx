"use client";

import { useState } from "react";
import {
  DailyHoroscopeItem,
  HOROSCOPE_SOURCES,
  ZodiacSignInfo,
} from "@/types/horoscope";
import { Copy, Check, Sparkles } from "lucide-react";

interface HoroscopeCardProps {
  item: DailyHoroscopeItem;
  sign: ZodiacSignInfo;
}

const DAY_LABELS: Record<string, string> = {
  yesterday: "Dün",
  today: "Bugün",
  tomorrow: "Yarın",
};

export function HoroscopeCard({ item, sign }: HoroscopeCardProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const sourceMeta = HOROSCOPE_SOURCES[item.sourceId];

  const handleCopy = async () => {
    const textToCopy = `[${sourceMeta?.name || item.sourceName} • ${sign.nameTr} Burcu • ${item.date}]\n\n${item.predictionTr}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const dayLabel = DAY_LABELS[item.day] || "Bugün";

  return (
    <article className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between gap-4 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
              {sourceMeta?.name || item.sourceName}
            </h3>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {dayLabel}
            </span>
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
            {item.date}
          </div>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Yorumu Kopyala"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Kopyalandı
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Kopyala</span>
            </>
          )}
        </button>
      </div>

      {/* Pure Turkish Prediction Body */}
      <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
        <p>{item.predictionTr}</p>
      </div>

      {/* Lucky Details & Remedy */}
      {(item.luckyNumber || item.luckyColor || item.remedy) && (
        <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {item.luckyNumber && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/50">
                <span>Şanslı Sayı:</span>
                <strong className="text-zinc-900 dark:text-white font-semibold">
                  {item.luckyNumber}
                </strong>
              </span>
            )}

            {item.luckyColor && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/50">
                <span>Renk:</span>
                <strong className="text-zinc-900 dark:text-white font-semibold">
                  {item.luckyColorTr || item.luckyColor}
                </strong>
              </span>
            )}
          </div>

          {/* AstroSage Remedy */}
          {item.remedy && (
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-start gap-1.5 bg-zinc-50 dark:bg-zinc-800/40 p-2 rounded-lg border border-zinc-200/50 dark:border-zinc-700/40">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-zinc-700 dark:text-zinc-300">Öneri:</strong>{" "}
                {item.remedyTr || item.remedy}
              </span>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
