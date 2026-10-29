"use client";

import { useState, useEffect } from "react";
import {
  DailyHoroscopeItem,
  HOROSCOPE_SOURCES,
  ZodiacSignInfo,
} from "@/types/horoscope";
import {
  cleanEmojis,
  formatPredictionSections,
  isEnglishText,
  translateColorToTurkish,
  translateToTurkish,
} from "@/lib/translator";
import { Copy, Check, Loader2 } from "lucide-react";

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

  // Check if initial content is English
  const rawInitialText = item.predictionTr || item.predictionEn || "";
  const initialIsEnglish = isEnglishText(rawInitialText);

  const [isTranslating, setIsTranslating] = useState<boolean>(initialIsEnglish);
  const [predictionText, setPredictionText] = useState<string>(() => {
    if (!initialIsEnglish && rawInitialText) {
      return formatPredictionSections(cleanEmojis(rawInitialText));
    }
    return "";
  });

  const sourceMeta = HOROSCOPE_SOURCES[item.sourceId];

  // Built-in Lightning-Fast Client Translation Engine & Formatter
  useEffect(() => {
    const textToEvaluate = item.predictionTr || item.predictionEn || "";

    if (isEnglishText(textToEvaluate)) {
      setIsTranslating(true);
      translateToTurkish(textToEvaluate)
        .then((translated) => {
          if (translated && translated.trim().length > 0) {
            setPredictionText(formatPredictionSections(cleanEmojis(translated)));
          }
        })
        .catch(() => {
          // If translation completely fails, show formatted text as fallback
          setPredictionText(formatPredictionSections(cleanEmojis(textToEvaluate)));
        })
        .finally(() => {
          setIsTranslating(false);
        });
    } else if (textToEvaluate) {
      setPredictionText(formatPredictionSections(cleanEmojis(textToEvaluate)));
      setIsTranslating(false);
    }
  }, [item.predictionTr, item.predictionEn]);

  const handleCopy = async () => {
    const textToCopy = `[${sourceMeta?.name || item.sourceName} • ${sign.nameTr} Burcu • ${item.date}]\n\n${predictionText}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const dayLabel = DAY_LABELS[item.day] || "Bugün";
  const rawColor = item.luckyColorTr || item.luckyColor;
  const turkishColor = rawColor ? translateColorToTurkish(rawColor) : undefined;

  return (
    <article className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between gap-3.5 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
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
          disabled={isTranslating}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
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

      {/* Pure Turkish Prediction Body with Clean Headings & No Emojis */}
      <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed font-normal min-h-[60px]">
        {isTranslating ? (
          <div className="flex items-center justify-center gap-2 py-6 text-xs text-zinc-500 dark:text-zinc-400">
            <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
            <span>Türkçe&apos;ye çevriliyor...</span>
          </div>
        ) : (
          predictionText
            .split(/\n\n+/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((para, idx) => {
              const headingMatch = para.match(
                /^([A-Za-zÇçĞğİıÖöŞşÜü\s]{2,25}:)\s*([\s\S]*)/
              );
              if (headingMatch) {
                return (
                  <div key={idx} className="space-y-1">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 block text-xs">
                      {headingMatch[1]}
                    </span>
                    <p className="text-zinc-700 dark:text-zinc-300">
                      {headingMatch[2]}
                    </p>
                  </div>
                );
              }
              return (
                <p key={idx} className="text-zinc-700 dark:text-zinc-300">
                  {para}
                </p>
              );
            })
        )}
      </div>

      {/* Lucky Details (Only Number & Color in Turkish) */}
      {(item.luckyNumber || turkishColor) && (
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {item.luckyNumber && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/50">
                <span>Şanslı Sayı:</span>
                <strong className="text-zinc-900 dark:text-white font-semibold">
                  {item.luckyNumber}
                </strong>
              </span>
            )}

            {turkishColor && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/50">
                <span>Renk:</span>
                <strong className="text-zinc-900 dark:text-white font-semibold">
                  {turkishColor}
                </strong>
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
