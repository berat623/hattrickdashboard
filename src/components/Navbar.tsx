"use client";

import { RefreshCw, Sparkles, Compass, HeartHandshake } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export type NavTab = "daily" | "natal" | "synastry";

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onRefresh: () => void;
  loading: boolean;
}

export function Navbar({
  activeTab,
  onSelectTab,
  onRefresh,
  loading,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-2xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
        {/* Navigation Tabs (Günlük Burçlar, Doğum Haritası, Sinastri) */}
        <nav
          aria-label="Ana Menü"
          className="flex items-center gap-0.5 sm:gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl overflow-x-auto scrollbar-none"
        >
          <button
            type="button"
            onClick={() => onSelectTab("daily")}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "daily"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Burçlar</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("natal")}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "natal"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Doğum (D1 & D9)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("synastry")}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "synastry"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Sinastri</span>
          </button>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {activeTab === "daily" && (
            <button
              type="button"
              onClick={onRefresh}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/40 transition-all cursor-pointer shadow-xs"
              title="Yorumları Yenile"
              aria-label="Yenile"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  loading ? "animate-spin text-amber-600 dark:text-amber-400" : ""
                }`}
              />
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
