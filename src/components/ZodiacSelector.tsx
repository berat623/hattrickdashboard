"use client";

import { ZODIAC_SIGNS, ZodiacSignId } from "@/types/horoscope";

interface ZodiacSelectorProps {
  selectedSignId: ZodiacSignId;
  onSelectSign: (signId: ZodiacSignId) => void;
}

export function ZodiacSelector({
  selectedSignId,
  onSelectSign,
}: ZodiacSelectorProps) {
  const signs = Object.values(ZODIAC_SIGNS);

  return (
    <div className="w-full">
      {/* Mobile Design: Clean 4-Column Compact Grid */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
        {signs.map((sign) => {
          const isSelected = sign.id === selectedSignId;
          return (
            <button
              key={sign.id}
              type="button"
              onClick={() => onSelectSign(sign.id)}
              className={`flex flex-col items-center justify-center py-2.5 sm:py-3.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-xs font-semibold"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <span className="text-lg sm:text-xl leading-none mb-1">
                {sign.symbol}
              </span>
              <span className="text-xs sm:text-sm font-medium tracking-tight">
                {sign.nameTr}
              </span>
              <span
                className={`hidden sm:inline-block text-[10px] mt-0.5 ${
                  isSelected
                    ? "text-zinc-300 dark:text-zinc-600"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {sign.dates}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
