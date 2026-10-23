"use client";

import { ZodiacSignInfo } from "@/types/horoscope";
import {
  Sparkles,
  Compass,
  Flame,
  Droplets,
  Mountain,
  Sun,
  Shield,
  Star,
  Activity,
} from "lucide-react";

interface ZodiacProfileCardProps {
  sign: ZodiacSignInfo;
}

const ELEMENT_INFO = {
  Toprak: {
    icon: Mountain,
    label: "Toprak Elementi",
    desc: "Madde dünyası, pratik akıl, sabır ve kalıcı başarılar.",
  },
  Su: {
    icon: Droplets,
    label: "Su Elementi",
    desc: "Duygusal derinlik, yüksek sezgi, şefkat ve empati gücü.",
  },
  Ateş: {
    icon: Flame,
    label: "Ateş Elementi",
    desc: "Yaratıcı enerji, liderlik, cesaret ve yaşam sevinci.",
  },
};

export function ZodiacProfileCard({ sign }: ZodiacProfileCardProps) {
  const elem = ELEMENT_INFO[sign.element] || ELEMENT_INFO.Toprak;
  const ElementIcon = elem.icon;

  return (
    <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/20 shadow-xl space-y-6">
      {/* Background ambient cosmic glow */}
      <div
        className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${sign.colorScheme.bgGlow} blur-3xl pointer-events-none`}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Symbol & Big Title */}
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-center text-3xl sm:text-4xl shadow-xl border border-white/20 select-none">
            {sign.symbol}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {sign.nameTr} Burcu
              </h2>
              <span className="text-xs sm:text-sm font-bold text-slate-400">
                ({sign.nameEn})
              </span>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-black border ${sign.colorScheme.badge}`}
              >
                {sign.dates}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-xl">
              &ldquo;{sign.motto}&rdquo; — {elem.desc}
            </p>
          </div>
        </div>

        {/* Right: Astrological Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-white/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
              <ElementIcon className="w-3 h-3 text-emerald-500" />
              <span>Element</span>
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
              {sign.element}
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-white/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
              <Sun className="w-3 h-3 text-amber-500" />
              <span>Yönetici</span>
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
              {sign.rulingPlanet}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 sm:p-3.5 rounded-2xl bg-white/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
              <Activity className="w-3 h-3 text-purple-500" />
              <span>Kozmik Uyum</span>
            </div>
            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              %94 Uyumlu
            </div>
          </div>
        </div>
      </div>

      {/* Traits Badges Row */}
      <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 mr-1">
          Karakteristik Güçler:
        </span>
        {sign.traits.map((t) => (
          <span
            key={t}
            className="px-3 py-1 rounded-xl text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          >
            ★ {t}
          </span>
        ))}
      </div>
    </div>
  );
}
