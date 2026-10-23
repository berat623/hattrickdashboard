"use client";

import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  currentDateStr: string;
}

export function Navbar({ currentDateStr }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          {currentDateStr}
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
