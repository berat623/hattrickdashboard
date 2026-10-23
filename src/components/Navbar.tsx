"use client";

import { Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  currentDateStr: string;
}

export function Navbar({ currentDateStr }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-bold tracking-tight text-zinc-900 dark:text-white">
              AstroVeda
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-zinc-400 font-normal">
              • Günlük Vedik & Hint Yorumları
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            {currentDateStr}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
