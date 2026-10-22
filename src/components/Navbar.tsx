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
  ShieldAlert, 
  LogOut,
  SlidersHorizontal,
  LayoutDashboard
} from "lucide-react";
import Image from "next/image";

export type NavTab = "dashboard" | "lineup" | "players" | "training" | "matches" | "settings";

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  user: UserSession;
  team: TeamDetails | null;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export function Navbar({
  activeTab,
  onTabChange,
  user,
  team,
  onOpenSettings,
  onLogout,
}: NavbarProps) {
  const tabs = [
    { id: "dashboard", label: "Genel Bakış", icon: LayoutDashboard },
    { id: "lineup", label: "Taktik & Otomatik Kadro", icon: SlidersHorizontal, badge: "AI" },
    { id: "players", label: "Kadro & Oyuncular", icon: Users },
    { id: "training", label: "Otomatik Antrenman", icon: Dumbbell },
    { id: "matches", label: "Maçlar & Oranlar", icon: Calendar },
    { id: "settings", label: "CHPP / Google", icon: Settings },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Team */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md shadow-emerald-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  Hattrick <span className="text-emerald-500">Dashboard</span>
                </span>
                {user.hattrickConnected ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    CHPP Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                    CHPP Bekleniyor
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px] sm:max-w-none">
                {team?.name || user.hattrickTeamName || "Takım"} {team?.seriesName ? `• Lig ${team.seriesName}` : ""}
              </p>
            </div>
          </div>

          {/* Center Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id as NavTab)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-sm font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {"badge" in tab && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: CHPP Status, Theme Toggle, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* CHPP Status Button */}
            <button
              onClick={onOpenSettings}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                user.hattrickConnected
                  ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              }`}
              title="Hattrick CHPP Durumu"
            >
              {user.hattrickConnected ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span className="hidden md:inline">
                {user.hattrickConnected ? "CHPP Bağlı" : "CHPP Bağla"}
              </span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />

            {/* Google User Avatar & Logout */}
            {user.googleLoggedIn ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <a
                href="/api/auth/google/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
              >
                Google ile Giriş
              </a>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Tabs */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as NavTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
