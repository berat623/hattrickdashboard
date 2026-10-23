"use client";

import { HoroscopeDay, HoroscopeSourceId, ZodiacSignId } from "@/types/horoscope";

interface SourceFilterProps {
  selectedSourceId: HoroscopeSourceId | "all";
  onSelectSource: (sourceId: HoroscopeSourceId | "all") => void;
  currentSignId: ZodiacSignId;
  currentDay: HoroscopeDay;
}

export function SourceFilter({
  selectedSourceId,
  onSelectSource,
  currentSignId,
  currentDay,
}: SourceFilterProps) {
  const isAstroSageAvailable = currentDay !== "yesterday";
  const isAstrolojiOrgAvailable = currentDay === "today";

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
      <button
        type="button"
        onClick={() => onSelectSource("all")}
        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
          selectedSourceId === "all"
            ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold shadow-xs"
            : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
        }`}
      >
        Tüm Kaynaklar
      </button>

      {isAstrolojiOrgAvailable && (
        <button
          type="button"
          onClick={() => onSelectSource("astrolojiorg")}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            selectedSourceId === "astrolojiorg"
              ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          Astroloji.org
        </button>
      )}

      <button
        type="button"
        onClick={() => onSelectSource("askganesha")}
        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
          selectedSourceId === "askganesha"
            ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold shadow-xs"
            : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
        }`}
      >
        AskGanesha
      </button>

      <button
        type="button"
        onClick={() => onSelectSource("ganeshaspeaks")}
        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
          selectedSourceId === "ganeshaspeaks"
            ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold shadow-xs"
            : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
        }`}
      >
        GaneshaSpeaks
      </button>

      {isAstroSageAvailable && (
        <button
          type="button"
          onClick={() => onSelectSource("astrosage")}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            selectedSourceId === "astrosage"
              ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          AstroSage
        </button>
      )}
    </div>
  );
}
