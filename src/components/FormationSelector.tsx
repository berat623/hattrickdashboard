"use client";

import {
  SupportedFormation,
  SupportedTactic,
  SupportedAttitude,
} from "@/lib/algorithms/lineup";
import { Sparkles, Shield, Swords, Flame } from "lucide-react";

interface FormationSelectorProps {
  currentFormation: SupportedFormation;
  currentTactic: SupportedTactic;
  currentAttitude: SupportedAttitude;
  onFormationChange: (formation: SupportedFormation) => void;
  onTacticChange: (tactic: SupportedTactic) => void;
  onAttitudeChange: (attitude: SupportedAttitude) => void;
  onAutoLineup: () => void;
  loading: boolean;
  totalRating: number;
}

export function FormationSelector({
  currentFormation,
  currentTactic,
  currentAttitude,
  onFormationChange,
  onTacticChange,
  onAttitudeChange,
  onAutoLineup,
  loading,
  totalRating,
}: FormationSelectorProps) {
  const formations: SupportedFormation[] = [
    "4-4-2",
    "3-5-2",
    "4-3-3",
    "4-5-1",
    "3-4-3",
    "5-3-2",
  ];
  const tactics: SupportedTactic[] = [
    "Normal",
    "Kanatlardan Hücum",
    "Ortadan Hücum",
    "Kontra Atak",
    "Uzaktan Şut",
    "Yaratıcı Oyna",
  ];
  const attitudes: { id: SupportedAttitude; label: string }[] = [
    { id: "Gevşek", label: "Gevşek (PIC - %85 OS)" },
    { id: "Normal", label: "Normal Motivasyon" },
    { id: "Sezonun Maçı", label: "Sezonun Maçı (MOTS - %115 OS)" },
  ];

  return (
    <div className="flex flex-col gap-3 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      {/* Row 1: Formations + Total Rating + Auto Lineup Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          <span className="text-xs font-extrabold text-slate-400 mr-1 shrink-0">
            DİZİLİŞ:
          </span>
          {formations.map((form) => {
            const isActive = currentFormation === form;
            return (
              <button
                key={form}
                onClick={() => onFormationChange(form)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                    : "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {form}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              İlk 11 Toplam Gücü:
            </span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
              {totalRating.toFixed(1)}★
            </span>
          </div>

          <button
            onClick={onAutoLineup}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {loading ? "Hesaplanıyor..." : "⚡ En İyi Formasyonu Otomatik Diz"}
            </span>
          </button>
        </div>
      </div>

      {/* Row 2: Tactic & Match Attitude Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
            Taktik:
          </span>
          <select
            value={currentTactic}
            onChange={(e) => onTacticChange(e.target.value as SupportedTactic)}
            className="flex-1 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white cursor-pointer"
          >
            {tactics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
            Motivasyon:
          </span>
          <select
            value={currentAttitude}
            onChange={(e) =>
              onAttitudeChange(e.target.value as SupportedAttitude)
            }
            className="flex-1 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white cursor-pointer"
          >
            {attitudes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
