"use client";

import { SupportedFormation } from "@/lib/algorithms/lineup";
import { Sparkles, Zap, Shield, Swords } from "lucide-react";

interface FormationSelectorProps {
  currentFormation: SupportedFormation;
  onFormationChange: (formation: SupportedFormation) => void;
  onAutoLineup: () => void;
  loading: boolean;
  totalRating: number;
}

export function FormationSelector({
  currentFormation,
  onFormationChange,
  onAutoLineup,
  loading,
  totalRating,
}: FormationSelectorProps) {
  const formations: SupportedFormation[] = ["4-4-2", "3-5-2", "4-3-3", "4-5-1", "3-4-3", "5-3-2"];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      {/* Formations pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
          Diziliş:
        </span>
        {formations.map((form) => {
          const isActive = currentFormation === form;
          return (
            <button
              key={form}
              onClick={() => onFormationChange(form)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50"
                  : "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {form}
            </button>
          );
        })}
      </div>

      {/* Right: Total Rating & Auto Lineup Button */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-slate-500 dark:text-slate-400">Takım Gücü:</span>
          <span className="font-bold text-slate-900 dark:text-white">{totalRating.toFixed(1)}</span>
        </div>

        <button
          onClick={onAutoLineup}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>{loading ? "Hesaplanıyor..." : "⚡ Otomatik Kadro Diz"}</span>
        </button>
      </div>
    </div>
  );
}
