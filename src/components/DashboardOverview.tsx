"use client";

import {
  TeamDetails,
  TacticalLineup,
  TrainingData,
  Match,
  Player,
} from "@/types/hattrick";
import { estimatePlayerMarketValue } from "@/lib/algorithms/lineup";
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
  Star,
  Compass,
  HeartPulse,
  Wallet,
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
  onSelectPlayer?: (player: Player) => void;
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
  onSelectPlayer,
  loadingLineup,
}: DashboardOverviewProps) {
  const nextMatch =
    matches.find((m) => m.status === "UPCOMING") || matches[0];
  const finishedMatches = matches.filter((m) => m.status === "FINISHED");
  const wins = finishedMatches.filter((m) => m.result === "WIN").length;
  const winRate =
    finishedMatches.length > 0
      ? Math.round((wins / finishedMatches.length) * 100)
      : 0;

  const topStars = [...players]
    .sort((a, b) => (b.positionRating || 0) - (a.positionRating || 0))
    .slice(0, 4);

  const totalSquadValue = players.reduce(
    (s, p) => s + estimatePlayerMarketValue(p),
    0
  );
  const totalWages = players.reduce((s, p) => s + (p.wage || 0), 0);
  const injuredCount = players.filter((p) => p.injuryDays > 0).length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Hero Banner: Responsive Desktop & Mobile Club Command Center */}
      <div className="relative overflow-hidden p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Trophy className="w-3.5 h-3.5" />
              <span>
                {team?.seriesName || "-"} Ligi{" "}
                {team?.rank ? `• ${team.rank}. Sırada` : ""}
              </span>
              {team?.regionName && <span>• {team.regionName}</span>}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {team?.name || "Hattrick Takımınız"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              CHPP canlı verileriniz senkronize edildi. Yapay zeka destekli kadro dizilimi, antrenman hızı simülatörü, stadyum hesaplayıcı ve transfer gözlemci üssünüz hazır.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2.5 shrink-0">
            <button
              onClick={onAutoLineup}
              disabled={loadingLineup}
              className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-95 text-slate-950 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {loadingLineup ? "Diziliyor..." : "⚡ Otomatik Kadro Diz"}
              </span>
            </button>
            <button
              onClick={() => onNavigate("economy")}
              className="flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all cursor-pointer"
            >
              <Coins className="w-4 h-4 text-amber-300" />
              <span>Stadyum & Finans</span>
            </button>
            <button
              onClick={() => onNavigate("transfers")}
              className="flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-emerald-300" />
              <span>Transfer Analizi</span>
            </button>
          </div>
        </div>

        {/* 4-Column Club Vital Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                Kulüp Kasası
              </div>
              <div className="font-extrabold text-sm text-white truncate">
                {(team?.cash ?? 0).toLocaleString("tr-TR")} TL
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                Kadro Piyasa Değeri
              </div>
              <div className="font-extrabold text-sm text-emerald-300 truncate">
                {totalSquadValue.toLocaleString("tr-TR")} TL
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-400/20 text-blue-300 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                Stadyum & Taraftar
              </div>
              <div className="font-extrabold text-sm text-white truncate">
                {(team?.arenaCapacity ?? 0).toLocaleString("tr-TR")} ({(team?.fanClubSize ?? 0).toLocaleString("tr-TR")} Üye)
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-400/20 text-rose-300 flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                Haftalık Maaş / Sakat
              </div>
              <div className="font-extrabold text-sm text-white truncate">
                {totalWages.toLocaleString("tr-TR")} TL • {injuredCount} Sakat
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Highlights: Tactics, Next Match & Training */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Active Lineup Quick Look */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Aktif Taktik & Diziliş
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                {lineup?.formation || "3-5-2"}
              </span>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">İlk 11 Toplam Gücü:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {lineup?.totalRating.toFixed(1) || "0.0"}★
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Orta Saha Hakimiyeti:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {lineup?.sectorRatings.midfield || 0} / 80
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Merkez Savunma:</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400">
                  {lineup?.sectorRatings.midDef || 0} / 80
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Merkez Hücum:</span>
                <span className="font-extrabold text-rose-600 dark:text-rose-400">
                  {lineup?.sectorRatings.midAtt || 0} / 80
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("lineup")}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-2xl text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors cursor-pointer"
          >
            <span>İnteraktif Sahaya Git</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Next Match Preview */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Sıradaki Maç & Tahmin
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                %{winRate} Sezon Galibiyeti
              </span>
            </div>

            <div className="py-4 space-y-3">
              <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="font-extrabold text-slate-900 dark:text-white truncate">
                  {nextMatch?.homeTeamName || "Ev Sahibi"}
                </div>
                <div className="text-[10px] font-bold text-emerald-500 my-0.5">
                  VS
                </div>
                <div className="font-extrabold text-slate-900 dark:text-white truncate">
                  {nextMatch?.awayTeamName || "Deplasman"}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">Kazanma İhtimaliniz:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                    %{nextMatch?.winProbability || 65}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${nextMatch?.winProbability || 65}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("matches")}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-2xl text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors cursor-pointer"
          >
            <span>Maç Simülatörünü Aç</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Training & Development */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-500" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Antrenman & Gelişim
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                %{training?.trainingLevel || 100} Yoğunluk
              </span>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <div className="text-[11px] text-slate-400 font-semibold">
                  Aktif Antrenman Tipi
                </div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {training?.trainingTypeName || "Oyun Kuruculuk"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    Kondisyon Payı
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    %{training?.staminaTrainingPart || 15}
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    21 Yaş Altı Genç
                  </span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {players.filter((p) => p.age <= 21).length} Oyuncu
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("training")}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-2xl text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors cursor-pointer"
          >
            <span>Antrenman Hızını Hesapla</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Star Players Spotlight */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              Takımın Yıldız Oyuncuları (Detay İçin Tıklayın)
            </h3>
          </div>
          <button
            onClick={() => onNavigate("players")}
            className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Tüm Kadroyu Gör ({players.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {topStars.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPlayer?.(p)}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-emerald-500/50 transition-all cursor-pointer flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                    {p.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                    {p.bestPosition}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {p.age}y • ~{estimatePlayerMarketValue(p).toLocaleString("tr-TR")} TL
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center justify-end gap-1 text-xs font-extrabold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{p.positionRating?.toFixed(1)}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">
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
