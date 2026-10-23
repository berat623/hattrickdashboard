"use client";

import { HoroscopeDay } from "@/types/horoscope";
import { DAY_DATES } from "@/lib/horoscope-data";
import { Calendar } from "lucide-react";

interface DaySelectorProps {
  selectedDay: HoroscopeDay;
  onSelectDay: (day: HoroscopeDay) => void;
}

const DAYS: { id: HoroscopeDay; label: string; shortDate: string }[] = [
  { id: "yesterday", label: "Dün", shortDate: "23 Ekim" },
  { id: "today", label: "Bugün", shortDate: "24 Ekim" },
  { id: "tomorrow", label: "Yarın", shortDate: "25 Ekim" },
];

export function DaySelector({
  selectedDay,
  onSelectDay,
}: DaySelectorProps) {
  const fullDate = DAY_DATES[selectedDay];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
      {/* Segmented Control */}
      <div className="inline-flex w-full sm:w-auto p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80">
        {DAYS.map((d) => {
          const isActive = selectedDay === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelectDay(d.id)}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <span>{d.label}</span>
              <span className="ml-1 text-[11px] font-normal opacity-70">
                ({d.shortDate})
              </span>
            </button>
          );
        })}
      </div>

      {/* Target Date Indicator */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
        <span>{fullDate}</span>
      </div>
    </div>
  );
}
