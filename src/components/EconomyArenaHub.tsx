"use client";

import { useState } from "react";
import { TeamDetails, Player } from "@/types/hattrick";
import { estimatePlayerMarketValue } from "@/lib/algorithms/lineup";
import {
  Coins,
  Building2,
  Users,
  TrendingUp,
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Calculator,
  Wallet,
  ArrowUpRight,
  Star,
} from "lucide-react";

interface EconomyArenaHubProps {
  team: TeamDetails | null;
  players: Player[];
  onSelectPlayer?: (player: Player) => void;
}

export function EconomyArenaHub({
  team,
  players,
  onSelectPlayer,
}: EconomyArenaHubProps) {
  const fanClub = team?.fanClubSize || 1500;
  const currentCapacity = team?.arenaCapacity || 12000;
  const clubCash = team?.cash || 0;

  const [targetMultiplier, setTargetMultiplier] = useState<number>(18); // Standard Hattrick ~15-22x fanclub
  const [weather, setWeather] = useState<"rain" | "cloudy" | "partly" | "sunny">("partly");

  // Financial calculations from real squad
  const totalWeeklyWages = players.reduce((sum, p) => sum + (p.wage || 0), 0);
  const totalSquadValue = players.reduce(
    (sum, p) => sum + estimatePlayerMarketValue(p),
    0
  );
  const topWagePlayers = [...players]
    .sort((a, b) => b.wage - a.wage)
    .slice(0, 5);

  // Ideal Arena capacity calculation
  const weatherMod =
    weather === "sunny"
      ? 1.15
      : weather === "partly"
      ? 1.0
      : weather === "cloudy"
      ? 0.88
      : 0.72;

  const recommendedCapacity = Math.round((fanClub * targetMultiplier * weatherMod) / 100) * 100;

  // Official Hattrick Optimal Proportions: 62.5% Terraces, 25% Basic, 10% Roof, 2.5% VIP
  const breakdown = [
    {
      name: "Maraton / Ayakta (Terraces)",
      pct: 62.5,
      seats: Math.round(recommendedCapacity * 0.625),
      ticketPrice: 140,
      buildCost: 900,
      color: "bg-emerald-500",
    },
    {
      name: "Numaralı Tribün (Basic Seating)",
      pct: 25.0,
      seats: Math.round(recommendedCapacity * 0.25),
      ticketPrice: 200,
      buildCost: 1500,
      color: "bg-blue-500",
    },
    {
      name: "Kapalı Tribün (Under Roof)",
      pct: 10.0,
      seats: Math.round(recommendedCapacity * 0.1),
      ticketPrice: 380,
      buildCost: 1800,
      color: "bg-purple-500",
    },
    {
      name: "VIP Localar (VIP Boxes)",
      pct: 2.5,
      seats: Math.round(recommendedCapacity * 0.025),
      ticketPrice: 700,
      buildCost: 6000,
      color: "bg-amber-500",
    },
  ];

  const estimatedMatchRevenue = breakdown.reduce(
    (sum, b) => sum + b.seats * b.ticketPrice,
    0
  );
  const extraSeatsNeeded = Math.max(0, recommendedCapacity - currentCapacity);
  const expansionCost =
    extraSeatsNeeded > 0
      ? Math.round(extraSeatsNeeded * 1350 + 200000)
      : 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>KULÜP NAKİT KASASI</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            {clubCash.toLocaleString("tr-TR")} TL
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            CHPP Canlı Bakiye
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>HAFTALIK MAAŞ GİDERİ</span>
            <Wallet className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1.5">
            {totalWeeklyWages.toLocaleString("tr-TR")} TL
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {players.length} Oyuncu • Ort:{" "}
            {players.length > 0
              ? Math.round(totalWeeklyWages / players.length).toLocaleString("tr-TR")
              : 0}{" "}
            TL
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>TOPLAM KADRO DEĞERİ</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1.5">
            {totalSquadValue.toLocaleString("tr-TR")} TL
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            TSI & Yaş Bazlı Piyasa Tahmini
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>STADYUM & TARAFTAR</span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5 truncate">
            {currentCapacity.toLocaleString("tr-TR")} Kişi
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">
            {team?.arenaName || "Stadyum"} • {fanClub.toLocaleString("tr-TR")} Üye
          </div>
        </div>
      </div>

      {/* Main Grid: Arena Calculator (7 cols) & Wage Breakdown (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Arena Optimizer (7 Cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Akıllı Stadyum & Bilet Geliri Simülatörü
                </h3>
                <p className="text-xs text-slate-500">
                  Taraftar kulübünüz ({fanClub.toLocaleString("tr-TR")} üye) için ideal tribün oranları
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              İdeal: {recommendedCapacity.toLocaleString("tr-TR")} Koltuk
            </span>
          </div>

          {/* Controls: Weather & Fan Mood Multiplier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Maç Günü Hava Durumu:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: "rain", label: "Yağmur", icon: CloudRain },
                  { id: "cloudy", label: "Bulutlu", icon: Cloud },
                  { id: "partly", label: "Parçalı", icon: CloudSun },
                  { id: "sunny", label: "Güneşli", icon: Sun },
                ].map((w) => {
                  const Icon = w.icon;
                  const active = weather === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWeather(w.id as any)}
                      className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                        active
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{w.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>Taraftar Çarpanı (Form/Beklenti):</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {targetMultiplier}x Üye
                </span>
              </div>
              <input
                type="range"
                min={12}
                max={26}
                step={1}
                value={targetMultiplier}
                onChange={(e) => setTargetMultiplier(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Düşük Moral (12x)</span>
                <span>Normal (18x)</span>
                <span>Şampiyonluk (26x)</span>
              </div>
            </div>
          </div>

          {/* Seat Proportions Table */}
          <div className="space-y-3">
            {breakdown.map((item) => (
              <div
                key={item.name}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {item.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      %{item.pct}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {item.seats.toLocaleString("tr-TR")} Koltuk
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 ml-2 font-semibold">
                      +{(item.seats * item.ticketPrice).toLocaleString("tr-TR")} TL
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                Tahmini Tam Kapasite Maç Geliri
              </div>
              <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                {estimatedMatchRevenue.toLocaleString("tr-TR")} TL / Maç
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                {extraSeatsNeeded > 0
                  ? `+${extraSeatsNeeded.toLocaleString("tr-TR")} Koltuk Büyütme Maliyeti`
                  : "Stadyum Kapasiteniz Yeterli"}
              </div>
              <div className="text-lg font-extrabold text-amber-700 dark:text-amber-400 mt-0.5">
                {extraSeatsNeeded > 0
                  ? `${expansionCost.toLocaleString("tr-TR")} TL`
                  : "Ek İnşaat Gerekmiyor"}
              </div>
            </div>
          </div>
        </div>

        {/* Wage Efficiency & Top Earners (5 Cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                En Yüksek Maaşlı Oyuncular & Maliyet Analizi
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Haftalık maaş bütçenizin yıldız/performans verimliliği
              </p>
            </div>

            <div className="space-y-2.5">
              {topWagePlayers.map((p, i) => {
                const wageShare =
                  totalWeeklyWages > 0
                    ? Math.round((p.wage / totalWeeklyWages) * 100)
                    : 0;
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectPlayer?.(p)}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 hover:border-emerald-500/50 transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                          <span>{p.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            {p.bestPosition}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{p.age} yaş</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-amber-500" />
                            {p.positionRating?.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
                        {p.wage.toLocaleString("tr-TR")} TL
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Bütçenin %{wageShare}&apos;i
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2-Week Hattrick Financial Projection */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">2 Haftalık Tahmini Bilet Geliri:</span>
              <span className="font-bold text-emerald-400">
                +{estimatedMatchRevenue.toLocaleString("tr-TR")} TL
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">2 Haftalık Toplam Maaş Gideri:</span>
              <span className="font-bold text-rose-400">
                -{(totalWeeklyWages * 2).toLocaleString("tr-TR")} TL
              </span>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-extrabold">
              <span>2 Haftalık Net Maç/Maaş Dengesi:</span>
              <span
                className={
                  estimatedMatchRevenue - totalWeeklyWages * 2 >= 0
                    ? "text-emerald-400"
                    : "text-rose-400"
                }
              >
                {(estimatedMatchRevenue - totalWeeklyWages * 2).toLocaleString("tr-TR")} TL
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
