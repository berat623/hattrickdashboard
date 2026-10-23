"use client";

import { ZodiacSignInfo } from "@/types/horoscope";

interface ZodiacProfileCardProps {
  sign: ZodiacSignInfo;
}

export function ZodiacProfileCard({ sign }: ZodiacProfileCardProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 text-xs text-zinc-600 dark:text-zinc-400">
      <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
        <span className="text-base">{sign.symbol}</span>
        <span>{sign.nameTr}</span>
        <span className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500">
          ({sign.dates})
        </span>
      </div>

      <div className="flex items-center gap-3 text-[11px] sm:text-xs">
        <span>
          Element:{" "}
          <strong className="text-zinc-800 dark:text-zinc-200 font-medium">
            {sign.element}
          </strong>
        </span>
        <span className="text-zinc-300 dark:text-zinc-700">•</span>
        <span>
          Yönetici:{" "}
          <strong className="text-zinc-800 dark:text-zinc-200 font-medium">
            {sign.rulingPlanet}
          </strong>
        </span>
      </div>
    </div>
  );
}
