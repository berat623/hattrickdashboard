"use client";

import { UserSession, TeamDetails } from "@/types/hattrick";
import { ThemeToggle } from "./ThemeToggle";
import {
  Trophy,
  Users,
  Dumbbell,
  Calendar,
  Settings,
  CheckCircle2,
  LogOut,
  SlidersHorizontal,
  LayoutDashboard,
  Coins,
  Compass,
  RefreshCw,
  GraduationCap,
  Stethoscope,
} from "lucide-react";

export type NavTab =
  | "dashboard"
  | "lineup"
  | "players"
  | "training"
  | "matches"
  | "economy"
  | "transfers"
  | "youth"
  | "medical"
  | "settings";

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  user: UserSession;
  team: TeamDetails | null;
  onOpenSettings: () => void;
  onLogout: () => void;
  onRefreshData?: () => void;
  refreshing?: boolean;
}

export const NAV_ITEMS = [
  { id: "dashboard", label: "Genel Bakış", shortLabel: "Genel", icon: LayoutDashboard },
  { id: "lineup", label: "Taktik & AI Kadro", shortLabel: "Taktik", icon: SlidersHorizontal, badge: "AI" },
  { id: "matches", label: "Canlı Maç & 2D", shortLabel: "Canlı 2D", icon: Calendar, badge: "CANLI" },
  { id: "players", label: "Oyuncu Havuzu", shortLabel: "Kadro", icon: Users },
  { id: "transfers", label: "Transfer & Pazarlık", shortLabel: "Transfer", icon: Compass, badge: "PRO" },
  { id: "training", label: "Antrenman Üssü", shortLabel: "İdman", icon: Dumbbell },
  { id: "economy", label: "Ekonomi & Stadyum", shortLabel: "Finans", icon: Coins },
  { id: "youth", label: "Altyapı & Scout", shortLabel: "Altyapı", icon: GraduationCap },
  { id: "medical", label: "Sağlık & Teknik Ekip", shortLabel: "Revir", icon: Stethoscope },
] as const;

export function Navbar({
  activeTab,
  onTabChange,
  user,
  team,
  onOpenSettings,
  onLogout,
  onRefreshData,
  refreshing,
}: NavbarProps) {
  return (
    <>
      {/* =====================================================================
          1. DESKTOP SIDEBAR (lg and up: Fixed Left Navigation Panel)
         ===================================================================== */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 w-68 border-r border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#09101f]/95 backdrop-blur-xl justify-between p-4 select-none overflow-y-auto">
        <div className="space-y-4">
          {/* Brand Logo */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25">
                <Trophy className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight leading-none">
                  Hattrick <span className="text-emerald-500">Pro</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">
                  AI Menajerlik Stüdyosu
                </span>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Active Club Card */}
          <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {user.hattrickConnected ? "CHPP Canlı Bağlantı" : "Bağlantı Bekleniyor"}
              </span>
              {team?.seriesName && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-slate-200 font-semibold">
                  {team.seriesName}
                </span>
              )}
            </div>
            <div className="font-extrabold text-sm truncate">
              {team?.name || user.hattrickTeamName || "Hattrick Takımınız"}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300 mt-2 pt-2 border-t border-white/10">
              <span>Kulüp Kasası:</span>
              <span className="font-bold text-amber-300">
                {(team?.cash ?? 0).toLocaleString("tr-TR")} TL
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              9 Profesyonel Modül
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as NavTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {"badge" in item && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                        isActive
                          ? "bg-white text-emerald-700"
                          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions in Desktop Sidebar */}
        <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          {onRefreshData && (
            <button
              onClick={onRefreshData}
              disabled={refreshing}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "CHPP Yenileniyor..." : "Hattrick Verilerini Yenile"}</span>
            </button>
          )}

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={onOpenSettings}
              className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span className="truncate">{user.hattrickUsername || user.name}</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Oturumu Kapat"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================================
          2. MOBILE TOP HEADER & BOTTOM APP BAR (< lg: Phones & Tablets)
         ===================================================================== */}
      <header className="lg:hidden sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#09101f]/95 backdrop-blur-xl">
        <div className="px-3.5 h-14 flex items-center justify-between gap-2">
          {/* Left: Logo + Team Name */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 shrink-0">
              <Trophy className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                  {team?.name || user.hattrickTeamName || "Hattrick Pro"}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                {team?.seriesName ? `${team.seriesName} Ligi` : "CHPP Aktif"} •{" "}
                {(team?.cash ?? 0).toLocaleString("tr-TR")} TL
              </p>
            </div>
          </div>

          {/* Right: Sync, Theme, Settings */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onRefreshData && (
              <button
                onClick={onRefreshData}
                disabled={refreshing}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-emerald-600 dark:text-emerald-400"
                title="Yenile"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            )}
            <ThemeToggle />
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              title="CHPP Ayarları"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Native Bottom Navigation Bar (Swipeable 9-item Dock) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 dark:border-slate-800/90 bg-white/95 dark:bg-[#09101f]/95 backdrop-blur-xl px-2 py-1.5">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as NavTab)}
                className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl shrink-0 min-w-[60px] transition-all ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "stroke-[2.5]" : ""}`} />
                <span className="text-[10px] mt-0.5 whitespace-nowrap leading-tight">
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
