"use client";

import { ZODIAC_SIGNS, ZodiacSignId, ZodiacSignInfo } from "@/types/horoscope";
import { Sparkles, Compass, Flame, Droplets, Mountain } from "lucide-react";

interface ZodiacSelectorProps {
  selectedSignId: ZodiacSignId;
  onSelectSign: (signId: ZodiacSignId) => void;
}

const ELEMENT_ICONS = {
  Toprak: Mountain,
  Su: Droplets,
  Ateş: Flame,
};

export function ZodiacSelector({
  selectedSignId,
  onSelectSign,
}: ZodiacSelectorProps) {
  const signs = Object.values(ZODIAC_SIGNS);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Burcunuzu Seçin
        </h2>
        <span className="text-[11px] font-semibold text-slate-400">
          4 Özel Burç Odaklı
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {signs.map((sign) => {
          const isSelected = sign.id === selectedSignId;
          const ElementIcon = ELEMENT_ICONS[sign.element] || Sparkles;

          return (
            <button
              key={sign.id}
              type="button"
              onClick={() => onSelectSign(sign.id)}
              className={`group relative p-4 sm:p-5 rounded-3xl border text-left transition-all cursor-pointer overflow-hidden ${
                isSelected
                  ? `bg-white dark:bg-slate-900 border-2 shadow-xl ${sign.colorScheme.accent.replace(
                      "text-",
                      "border-"
                    )}`
                  : "bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 shadow-sm"
              }`}
            >
              {/* Subtle background glow when active */}
              {isSelected && (
                <div
                  className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${sign.colorScheme.bgGlow} blur-2xl pointer-events-none`}
                />
              )}

              <div className="relative z-10 flex flex-col justify-between h-full gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl sm:text-3xl font-black drop-shadow-sm select-none">
                      {sign.symbol}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                        {sign.nameTr}
                      </h3>
                      <span className="text-[11px] font-bold text-slate-400">
                        {sign.nameEn}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border ${sign.colorScheme.badge}`}
                  >
                    <ElementIcon className="w-3 h-3" />
                    <span>{sign.element}</span>
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    {sign.dates}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Yönetici:{" "}
                    <strong className="text-slate-700 dark:text-slate-300">
                      {sign.rulingPlanet}
                    </strong>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
