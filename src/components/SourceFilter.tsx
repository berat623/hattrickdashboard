"use client";

import {
  HoroscopeSourceId,
  HOROSCOPE_SOURCES,
  ZodiacSignId,
} from "@/types/horoscope";
import { Layers, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";

interface SourceFilterProps {
  selectedSourceId: HoroscopeSourceId | "all";
  onSelectSource: (sourceId: HoroscopeSourceId | "all") => void;
  currentSignId: ZodiacSignId;
}

export function SourceFilter({
  selectedSourceId,
  onSelectSource,
  currentSignId,
}: SourceFilterProps) {
  const isAstroSageAvailable =
    currentSignId === "leo" || currentSignId === "virgo";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onSelectSource("all")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            selectedSourceId === "all"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Tüm Kaynakları Karşılaştır</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSource("askganesha")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            selectedSourceId === "askganesha"
              ? "bg-amber-600 text-white shadow-md shadow-amber-600/25"
              : "bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
          }`}
        >
          <span>🕉️ AskGanesha</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSource("ganeshaspeaks")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            selectedSourceId === "ganeshaspeaks"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
              : "bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
          }`}
        >
          <span>✨ GaneshaSpeaks</span>
        </button>

        <button
          type="button"
          disabled={!isAstroSageAvailable}
          onClick={() => onSelectSource("astrosage")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
            !isAstroSageAvailable
              ? "opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800/40 text-slate-400"
              : selectedSourceId === "astrosage"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25 cursor-pointer"
              : "bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          }`}
          title={
            !isAstroSageAvailable
              ? "AstroSage yalnızca Aslan ve Başak burçları için aktiftir"
              : "AstroSage yorumunu görüntüle"
          }
        >
          <span>🔮 AstroSage</span>
          {!isAstroSageAvailable && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              Aslan & Başak Özel
            </span>
          )}
        </button>
      </div>

      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold px-2">
        {isAstroSageAvailable ? (
          <span className="text-emerald-600 dark:text-emerald-400">
            ✓ 3 Kaynak da Aktif
          </span>
        ) : (
          <span>AstroSage kuralı: Yalnızca Aslan ve Başak için taranır</span>
        )}
      </div>
    </div>
  );
}
