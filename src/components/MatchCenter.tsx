"use client";

import { useState } from "react";
import { Match, SectorRatings } from "@/types/hattrick";
import {
  simulateMatch,
  MatchSimulationResult,
} from "@/lib/algorithms/match-predictor";
import {
  Calendar,
  Trophy,
  Percent,
  Swords,
  Flame,
  Sliders,
  Sparkles,
  RotateCcw,
} from "lucide-react";

interface MatchCenterProps {
  matches: Match[];
  activeLineupRatings?: SectorRatings;
}

export function MatchCenter({
  matches,
  activeLineupRatings,
}: MatchCenterProps) {
  const finishedMatches = matches.filter((m) => m.status === "FINISHED");
  const upcomingMatches = matches.filter((m) => m.status === "UPCOMING");

  const totalFinished = finishedMatches.length;
  const wins = finishedMatches.filter((m) => m.result === "WIN").length;
  const draws = finishedMatches.filter((m) => m.result === "DRAW").length;
  const losses = finishedMatches.filter((m) => m.result === "LOSS").length;

  const winRate =
    totalFinished > 0 ? Math.round((wins / totalFinished) * 100) : 0;
  const drawRate =
    totalFinished > 0 ? Math.round((draws / totalFinished) * 100) : 0;
  const lossRate =
    totalFinished > 0 ? Math.round((losses / totalFinished) * 100) : 0;

  const nextMatch = upcomingMatches[0] || matches[0];
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(
    nextMatch || null
  );

  // Interactive Custom Simulation State ("What-If" Sliders)
  const [customMode, setCustomMode] = useState(false);
  const [homeMid, setHomeMid] = useState(
    activeLineupRatings?.midfield || 52
  );
  const [homeDef, setHomeDef] = useState(
    activeLineupRatings?.midDef || 50
  );
  const [homeAtt, setHomeAtt] = useState(
    activeLineupRatings?.midAtt || 48
  );

  const [awayMid, setAwayMid] = useState(44);
  const [awayDef, setAwayDef] = useState(45);
  const [awayAtt, setAwayAtt] = useState(42);

  const effectiveHomeRatings: SectorRatings = customMode
    ? {
        midfield: homeMid,
        rightDef: Math.max(10, homeDef - 3),
        midDef: homeDef,
        leftDef: Math.max(10, homeDef - 3),
        rightAtt: Math.max(10, homeAtt - 2),
        midAtt: homeAtt,
        leftAtt: Math.max(10, homeAtt - 2),
      }
    : selectedMatch?.homeRatings ||
      activeLineupRatings || {
        midfield: 52,
        rightDef: 48,
        midDef: 54,
        leftDef: 46,
        rightAtt: 44,
        midAtt: 50,
        leftAtt: 48,
      };

  const effectiveAwayRatings: SectorRatings = customMode
    ? {
        midfield: awayMid,
        rightDef: Math.max(10, awayDef - 3),
        midDef: awayDef,
        leftDef: Math.max(10, awayDef - 3),
        rightAtt: Math.max(10, awayAtt - 2),
        midAtt: awayAtt,
        leftAtt: Math.max(10, awayAtt - 2),
      }
    : selectedMatch?.awayRatings || {
        midfield: 44,
        rightDef: 41,
        midDef: 46,
        leftDef: 42,
        rightAtt: 38,
        midAtt: 42,
        leftAtt: 39,
      };

  const simulation: MatchSimulationResult = simulateMatch(
    effectiveHomeRatings,
    effectiveAwayRatings
  );

  const applyActiveLineupToSimulator = () => {
    if (activeLineupRatings) {
      setHomeMid(activeLineupRatings.midfield);
      setHomeDef(activeLineupRatings.midDef);
      setHomeAtt(activeLineupRatings.midAtt);
    }
    setCustomMode(true);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Stats Overview: Win / Draw / Loss Record */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold">
            <span>OYNANAN MAÇLAR</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {totalFinished}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
            <span className="text-emerald-500 font-bold">{wins}G</span> •{" "}
            <span className="text-amber-500 font-bold">{draws}B</span> •{" "}
            <span className="text-rose-500 font-bold">{losses}M</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
            <span>KAZANMA ORANI</span>
            <Trophy className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
            %{winRate}
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${winRate}%` }}
            />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-[11px] font-bold">
            <span>BERABERLİK</span>
            <Percent className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-700 dark:text-amber-400 mt-1">
            %{drawRate}
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full"
              style={{ width: `${drawRate}%` }}
            />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-rose-200 dark:border-rose-800/80 bg-rose-50/50 dark:bg-rose-950/20 shadow-sm">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400 text-[11px] font-bold">
            <span>MAĞLUBİYET</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-700 dark:text-rose-400 mt-1">
            %{lossRate}
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full"
              style={{ width: `${lossRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Analysis Section: Match Simulator (7 cols) & Fixture List (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Match & Interactive Simulator Card (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-emerald-500" />
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Canlı Maç Tahmin & Taktik Simülatörü
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={applyActiveLineupToSimulator}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{customMode ? "Manuel Simülasyon Aktif" : "Reytingleri Manuel Ayarla"}</span>
              </button>
              {customMode && (
                <button
                  type="button"
                  onClick={() => setCustomMode(false)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  title="Sıfırla"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Interactive Sliders when Custom Mode is active */}
          {customMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 text-xs">
              <div className="space-y-2.5">
                <div className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  Ev Sahibi (Takımınız) Reytingleri
                </div>
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span>Orta Saha:</span>
                    <strong>{homeMid} / 80</strong>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={homeMid}
                    onChange={(e) => setHomeMid(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span>Savunma Gücü:</span>
                    <strong>{homeDef} / 80</strong>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={homeDef}
                    onChange={(e) => setHomeDef(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span>Hücum Gücü:</span>
                    <strong>{homeAtt} / 80</strong>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={homeAtt}
                    onChange={(e) => setHomeAtt(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="font-extrabold text-rose-500">
                  Rakip Takım Reytingleri
                </div>
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span>Rakip Orta Saha:</span>
                    <strong>{awayMid} / 80</strong>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={awayMid}
                    onChange={(e) => setAwayMid(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span>Rakip Savunma:</span>
                    <strong>{awayDef} / 80</strong>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={awayDef}
                    onChange={(e) => setAwayDef(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span>Rakip Hücum:</span>
                    <strong>{awayAtt} / 80</strong>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={awayAtt}
                    onChange={(e) => setAwayAtt(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Teams Header */}
          <div className="flex items-center justify-between gap-3 py-3.5 px-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
            <div className="text-left flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase text-slate-400">
                Ev Sahibi
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                {customMode
                  ? "Aktif Taktik Kadronuz"
                  : selectedMatch?.homeTeamName || "Ev Sahibi"}
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs shrink-0 shadow-md shadow-emerald-600/20">
              VS
            </div>

            <div className="text-right flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase text-slate-400">
                Deplasman
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                {customMode
                  ? "Simüle Edilen Rakip"
                  : selectedMatch?.awayTeamName || "Rakip Takım"}
              </div>
            </div>
          </div>

          {/* Win / Draw / Loss Probability Bar */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between text-xs font-extrabold">
              <span className="text-emerald-600 dark:text-emerald-400">
                Galibiyet: %{simulation.homeWinProb}
              </span>
              <span className="text-amber-500">
                Beraberlik: %{simulation.drawProb}
              </span>
              <span className="text-rose-600 dark:text-rose-400">
                Rakip: %{simulation.awayWinProb}
              </span>
            </div>

            <div className="w-full h-3.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${simulation.homeWinProb}%` }}
              />
              <div
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${simulation.drawProb}%` }}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${simulation.awayWinProb}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-center">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Ev Gol Beklentisi</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-sm">
                  {simulation.expectedHomeGoals} xG
                </strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Topa Sahip Olma</span>
                <strong className="text-slate-900 dark:text-white text-sm">
                  %{simulation.homePossession} - %{simulation.awayPossession}
                </strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Dep Gol Beklentisi</span>
                <strong className="text-rose-500 text-sm">
                  {simulation.expectedAwayGoals} xG
                </strong>
              </div>
            </div>
          </div>

          {/* Sector Comparison Table */}
          <div className="mt-1 space-y-2">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Bölgesel Güç Karşılaştırması
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
              {simulation.sectorComparison.map((sec, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {sec.sector}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {sec.homeValue}
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-lg font-extrabold ${
                        sec.advantage === "HOME"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : sec.advantage === "AWAY"
                          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {sec.advantage === "HOME"
                        ? "Ev Üstün"
                        : sec.advantage === "AWAY"
                        ? "Dep Üstün"
                        : "Dengeli"}
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {sec.awayValue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Match History List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Fikstür & Maç Sonuçları
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {matches.length} Maç
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[520px] pr-1">
            {matches.map((m) => {
              const isSelected = !customMode && selectedMatch?.id === m.id;
              const dateStr = new Date(m.matchDate).toLocaleDateString(
                "tr-TR",
                {
                  day: "numeric",
                  month: "short",
                }
              );

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setCustomMode(false);
                    setSelectedMatch(m);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                      : "border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span className="font-semibold">
                      {dateStr} • {m.matchType === "LEAGUE" ? "Lig" : "Kupa"}
                    </span>
                    {m.status === "FINISHED" ? (
                      <span
                        className={`font-extrabold px-2 py-0.5 rounded-md text-[10px] ${
                          m.result === "WIN"
                            ? "bg-emerald-500 text-white"
                            : m.result === "DRAW"
                            ? "bg-amber-400 text-slate-950"
                            : "bg-rose-500 text-white"
                        }`}
                      >
                        {m.result === "WIN"
                          ? "Galibiyet"
                          : m.result === "DRAW"
                          ? "Beraberlik"
                          : "Mağlubiyet"}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                        Gelecek Maç
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex-1">
                      {m.homeTeamName}
                    </div>

                    <div className="px-2.5 py-1 rounded-lg bg-slate-900 text-white dark:bg-slate-800 font-extrabold text-xs shrink-0">
                      {m.status === "FINISHED"
                        ? `${m.homeGoals} - ${m.awayGoals}`
                        : "VS"}
                    </div>

                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex-1 text-right">
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
