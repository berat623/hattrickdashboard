"use client";

import { RefreshCw } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  onRefresh: () => void;
  loading: boolean;
}

export function Navbar({ onRefresh, loading }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onRefresh}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 transition-all cursor-pointer shadow-xs"
          title="Yorumları Yenile"
          aria-label="Yenile"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600 dark:text-indigo-400" : ""}`}
          />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
