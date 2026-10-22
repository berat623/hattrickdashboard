"use client";

import { useState } from "react";
import { Match, SectorRatings } from "@/types/hattrick";
import { simulateMatch, MatchSimulationResult } from "@/lib/algorithms/match-predictor";
import { Calendar, Trophy, Percent, Swords, ShieldCheck, Flame, ArrowRight } from "lucide-react";

interface MatchCenterProps {
  matches: Match[];
}

export function MatchCenter({ matches }: MatchCenterProps) {
  const finishedMatches = matches.filter((m) => m.status === "FINISHED");
  const upcomingMatches = matches.filter((m) => m.status === "UPCOMING");

  // Calculate Win / Draw / Loss overall stats
  const totalFinished = finishedMatches.length;
  const wins = finishedMatches.filter((m) => m.result === "WIN").length;
  const draws = finishedMatches.filter((m) => m.result === "DRAW").length;
  const losses = finishedMatches.filter((m) => m.result === "LOSS").length;

  const winRate = totalFinished > 0 ? Math.round((wins / totalFinished) * 100) : 0;
  const drawRate = totalFinished > 0 ? Math.round((draws / totalFinished) * 100) : 0;
  const lossRate = totalFinished > 0 ? Math.round((losses / totalFinished) * 100) : 0;

  // Selected upcoming match for simulation
  const nextMatch = upcomingMatches[0] || matches[0];
  const [selectedMatch, setSelectedMatch] = useState<Match>(nextMatch);

  // Simulation calculation
  const defaultHomeRatings: SectorRatings = selectedMatch?.homeRatings || {
    midfield: 52,
    rightDef: 48,
    midDef: 54,
    leftDef: 46,
    rightAtt: 44,
    midAtt: 50,
    leftAtt: 48,
  };

  const defaultAwayRatings: SectorRatings = selectedMatch?.awayRatings || {
    midfield: 44,
    rightDef: 41,
    midDef: 46,
    leftDef: 42,
    rightAtt: 38,
    midAtt: 42,
    leftAtt: 39,
  };

  const simulation: MatchSimulationResult = simulateMatch(defaultHomeRatings, defaultAwayRatings);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Stats Overview: Win / Draw / Loss Record */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Matches */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>OYNANAN MAÇLAR</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {totalFinished}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
            <span className="text-emerald-500 font-bold">{wins}G</span> •{" "}
            <span className="text-amber-500 font-bold">{draws}B</span> •{" "}
            <span className="text-rose-500 font-bold">{losses}M</span>
          </div>
        </div>

        {/* Win Rate */}
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <span>KAZANMA ORANI</span>
            <Trophy className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
            %{winRate}
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${winRate}%` }} />
          </div>
        </div>

        {/* Draw Rate */}
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <span>BERABERLİK ORANI</span>
            <Percent className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 mt-1">
            %{drawRate}
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${drawRate}%` }} />
          </div>
        </div>

        {/* Loss Rate */}
        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-800/80 bg-rose-50/50 dark:bg-rose-950/20 shadow-sm">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400 text-xs font-semibold">
            <span>KAYBETME ORANI</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-700 dark:text-rose-400 mt-1">
            %{lossRate}
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${lossRate}%` }} />
          </div>
        </div>
      </div>

      {/* Main Analysis Section: Next Match & Simulation Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Match Simulator Card (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Maç Tahmin Motoru & Oranlar (Ultimate Hattrick Modeli)
              </h3>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-300">
              {selectedMatch?.matchType === "LEAGUE" ? "Lig Maçı" : "Kupa Maçı"}
            </span>
          </div>

          {/* Teams Header */}
          <div className="flex items-center justify-between gap-4 py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
            <div className="text-left flex-1 min-w-0">
              <div className="text-xs text-slate-400">Ev Sahibi</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                {selectedMatch?.homeTeamName}
              </div>
            </div>

            <div className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs shrink-0 shadow-sm">
              VS
            </div>

            <div className="text-right flex-1 min-w-0">
              <div className="text-xs text-slate-400">Deplasman</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                {selectedMatch?.awayTeamName}
              </div>
            </div>
          </div>

          {/* Win / Draw / Loss Probability Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-600 dark:text-emerald-400">
                Ev Sahibi: %{simulation.homeWinProb}
              </span>
              <span className="text-amber-500">Beraberlik: %{simulation.drawProb}</span>
              <span className="text-rose-600 dark:text-rose-400">
                Deplasman: %{simulation.awayWinProb}
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${simulation.homeWinProb}%` }}
                title={`Ev Sahibi: %${simulation.homeWinProb}`}
              />
              <div
                className="bg-amber-400 h-full transition-all duration-500"
                style={{ width: `${simulation.drawProb}%` }}
                title={`Beraberlik: %${simulation.drawProb}`}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-500"
                style={{ width: `${simulation.awayWinProb}%` }}
                title={`Deplasman: %${simulation.awayWinProb}`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Beklenen Gol (xG): <strong>{simulation.expectedHomeGoals}</strong></span>
              <span>Topa Sahip Olma: <strong>%{simulation.homePossession} - %{simulation.awayPossession}</strong></span>
              <span>Beklenen Gol (xG): <strong>{simulation.expectedAwayGoals}</strong></span>
            </div>
          </div>

          {/* Sector Comparison Table */}
          <div className="mt-2 space-y-2">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Bölgesel Güç Dengesi & Avantaj
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
              {simulation.sectorComparison.map((sec, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {sec.sector}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {sec.homeValue}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        sec.advantage === "HOME"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : sec.advantage === "AWAY"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {sec.advantage === "HOME"
                        ? "Ev Üstün"
                        : sec.advantage === "AWAY"
                        ? "Dep Üstün"
                        : "Dengeli"}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {sec.awayValue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Match History List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Tüm Maç Takvimi & Skorlar
            </h3>
            <span className="text-xs text-slate-500">
              {matches.length} Maç
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[460px] pr-1">
            {matches.map((m) => {
              const isSelected = selectedMatch?.id === m.id;
              const dateStr = new Date(m.matchDate).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
              });

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMatch(m)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                      : "border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>{dateStr} • {m.matchType === "LEAGUE" ? "Lig" : "Kupa"}</span>
                    {m.status === "FINISHED" ? (
                      <span
                        className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                          m.result === "WIN"
                            ? "bg-emerald-500 text-white"
                            : m.result === "DRAW"
                            ? "bg-amber-400 text-black"
                            : "bg-rose-500 text-white"
                        }`}
                      >
                        {m.result === "WIN" ? "Galibiyet" : m.result === "DRAW" ? "Beraberlik" : "Mağlubiyet"}
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                        Gelecek Maç
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                      {m.homeTeamName}
                    </div>

                    <div className="px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-800 font-bold text-xs shrink-0">
                      {m.status === "FINISHED"
                        ? `${m.homeGoals} - ${m.awayGoals}`
                        : "vs"}
                    </div>

                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px] text-right">
                      {m.awayTeamName}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
