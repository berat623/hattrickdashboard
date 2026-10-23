"use client";

import { HoroscopeDay } from "@/types/horoscope";
import { Calendar } from "lucide-react";

interface DaySelectorProps {
  selectedDay: HoroscopeDay;
  onSelectDay: (day: HoroscopeDay) => void;
  formattedDate?: string;
}

const DAYS: { id: HoroscopeDay; label: string }[] = [
  { id: "yesterday", label: "Dün" },
  { id: "today", label: "Bugün" },
  { id: "tomorrow", label: "Yarın" },
];

export function DaySelector({
  selectedDay,
  onSelectDay,
  formattedDate,
}: DaySelectorProps) {
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
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Target Date Indicator */}
      {formattedDate && (
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          <span>{formattedDate}</span>
        </div>
      )}
    </div>
  );
}
