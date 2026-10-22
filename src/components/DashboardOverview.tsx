"use client";

import { TeamDetails, TacticalLineup, TrainingData, Match, Player } from "@/types/hattrick";
import { 
  Trophy, 
  Coins, 
  Users, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Dumbbell, 
  Calendar,
  Shield,
  Star
} from "lucide-react";
import { NavTab } from "./Navbar";

interface DashboardOverviewProps {
  team: TeamDetails | null;
  lineup: TacticalLineup | null;
  training: TrainingData | null;
  matches: Match[];
  players: Player[];
  onNavigate: (tab: NavTab) => void;
  onAutoLineup: () => void;
  loadingLineup: boolean;
}

export function DashboardOverview({
  team,
  lineup,
  training,
  matches,
  players,
  onNavigate,
  onAutoLineup,
  loadingLineup,
}: DashboardOverviewProps) {
  const nextMatch = matches.find((m) => m.status === "UPCOMING") || matches[0];
  const finishedMatches = matches.filter((m) => m.status === "FINISHED");
  const wins = finishedMatches.filter((m) => m.result === "WIN").length;
  const winRate = finishedMatches.length > 0 ? Math.round((wins / finishedMatches.length) * 100) : 0;

  // Star players
  const topStars = [...players].sort((a, b) => (b.positionRating || 0) - (a.positionRating || 0)).slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      {/* Hero: Team Welcome & Quick Stats Banner */}
      <div className="relative overflow-hidden p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-950 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Trophy className="w-3.5 h-3.5" />
              <span>{team?.seriesName || "III.12"} Ligi • {team?.rank || 2}. Sırada</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {team?.name || "Anadolu Kartalları SK"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Hattrick akıllı menajerlik asistanınız hazır. Kadronuzu, antrenmanınızı ve maç simülasyonlarınızı tek tıkla otomatik yönetin.
            </p>
          </div>

          {/* Quick AI Action button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onAutoLineup}
              disabled={loadingLineup}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-900" />
              <span>{loadingLineup ? "Diziliyor..." : "⚡ Tek Tıkla Kadro Diz"}</span>
            </button>
            <button
              onClick={() => onNavigate("training")}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Antrenman Durumu</span>
            </button>
          </div>
        </div>

        {/* Financial & Club Quick Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2.5">
            <Coins className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[11px] text-slate-400">Kulüp Kasası</div>
              <div className="font-bold text-white">
                {team?.cash.toLocaleString("tr-TR") || "18.450.000"} TL
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-[11px] text-slate-400">Taraftar Kulübü</div>
              <div className="font-bold text-white">
                {team?.fanClubSize.toLocaleString("tr-TR") || "2.140"} Üye
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-[11px] text-slate-400">Stadyum</div>
              <div className="font-bold text-white truncate max-w-[120px]">
                {team?.arenaName || "Kartal Yuvası"} ({team?.arenaCapacity.toLocaleString("tr-TR") || "48.500"})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[11px] text-slate-400">Kazanma Oranı</div>
              <div className="font-bold text-emerald-400">
                %{winRate} Galibiyet
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Highlights: Tactics, Next Match & Training */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Active Lineup Quick Look */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Aktif Taktik & Diziliş
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-300">
                {lineup?.formation || "3-5-2"}
              </span>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Takım Reytingi:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {lineup?.totalRating.toFixed(1) || "162.4"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Orta Saha Gücü:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {lineup?.sectorRatings.midfield || 52} / 80
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Merkez Defans:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {lineup?.sectorRatings.midDef || 54} / 80
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Merkez Forvet:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {lineup?.sectorRatings.midAtt || 50} / 80
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("lineup")}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors"
          >
            <span>Sahaya Git & Dizilişi İncele</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Next Match Preview */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Sıradaki Maç
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                {nextMatch?.matchType === "LEAGUE" ? "Lig Maçı" : "Kupa"}
              </span>
            </div>

            <div className="py-4 space-y-3">
              <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {nextMatch?.homeTeamName}
                </div>
                <div className="text-[10px] text-slate-400 my-0.5">vs</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {nextMatch?.awayTeamName}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Tahmini Galibiyet İhtimali:</span>
                  <span className="text-emerald-600 font-bold">
                    %{nextMatch?.winProbability || 68}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${nextMatch?.winProbability || 68}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("matches")}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors"
          >
            <span>Tüm Maç Analizlerini Gör</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Training & Development */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Antrenman Durumu
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-300">
                %{training?.trainingLevel || 100} Hız
              </span>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <div className="text-[11px] text-slate-400">Mevcut Odak</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {training?.trainingTypeName || "Oyun Kuruculuk (Playmaking)"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Kondisyon</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    %{training?.staminaTrainingPart || 15}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Genç Yetenekler</span>
                  <span className="font-bold text-emerald-600">6 Oyuncu</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("training")}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors"
          >
            <span>Otomatik Antrenmanı İncele</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Star Players Spotlight */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Takımın Yıldız Oyuncuları (En Yüksek Reytingler)
            </h3>
          </div>
          <button
            onClick={() => onNavigate("players")}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Tüm Kadroyu Gör ({players.length} Oyuncu) →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topStars.map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {p.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-300">
                    {p.bestPosition}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {p.age} yaş • TSI: {p.tsi.toLocaleString("tr-TR")}
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-xs font-extrabold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{p.positionRating?.toFixed(1)}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Form: {p.form}/8
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
