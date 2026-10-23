"use client";

import { useState } from "react";
import { Match, Player, SectorRatings } from "@/types/hattrick";
import {
  simulateMatch,
  MatchSimulationResult,
} from "@/lib/algorithms/match-predictor";
import { LiveMatchViewer } from "./LiveMatchViewer";
import { TeamCrest } from "./PlayerAvatar";
import {
  Calendar,
  Trophy,
  Percent,
  Swords,
  Flame,
  Sliders,
  RotateCcw,
  Radio,
  BarChart3,
} from "lucide-react";

interface MatchCenterProps {
  matches: Match[];
  players?: Player[];
  activeLineupRatings?: SectorRatings;
  onSelectPlayer?: (player: Player) => void;
}

export function MatchCenter({
  matches,
  players = [],
  activeLineupRatings,
  onSelectPlayer,
}: MatchCenterProps) {
  // ONLY LIVE and FINISHED matches can be watched in the 2D Live Match Viewer
  const liveAndFinishedMatches = matches
    .filter((m) => m.status === "LIVE" || m.status === "FINISHED")
    .sort((a, b) => {
      if (a.status === "LIVE" && b.status !== "LIVE") return -1;
      if (b.status === "LIVE" && a.status !== "LIVE") return 1;
      return new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime();
    });

  const finishedMatches = matches.filter((m) => m.status === "FINISHED");
  const liveMatches = matches.filter((m) => m.status === "LIVE");

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

  const [selectedLiveMatchId, setSelectedLiveMatchId] = useState<number | null>(
    liveAndFinishedMatches[0]?.id || null
  );
  const selectedLiveMatch =
    liveAndFinishedMatches.find((m) => m.id === selectedLiveMatchId) ||
    liveAndFinishedMatches[0] ||
    null;

  const [selectedSimMatch, setSelectedSimMatch] = useState<Match | null>(
    matches[0] || null
  );
  const [viewMode, setViewMode] = useState<"live2d" | "simulator">("live2d");

  // Interactive Custom Simulation State ("What-If" Sliders)
  const [customMode, setCustomMode] = useState(false);
  const [homeMid, setHomeMid] = useState(activeLineupRatings?.midfield || 40);
  const [homeDef, setHomeDef] = useState(activeLineupRatings?.midDef || 40);
  const [homeAtt, setHomeAtt] = useState(activeLineupRatings?.midAtt || 40);

  const [awayMid, setAwayMid] = useState(36);
  const [awayDef, setAwayDef] = useState(36);
  const [awayAtt, setAwayAtt] = useState(36);

  const effectiveHomeRatings: SectorRatings = customMode
    ? {
        midfield: homeMid,
        rightDef: Math.max(10, homeDef - 2),
        midDef: homeDef,
        leftDef: Math.max(10, homeDef - 2),
        rightAtt: Math.max(10, homeAtt - 2),
        midAtt: homeAtt,
        leftAtt: Math.max(10, homeAtt - 2),
      }
    : selectedSimMatch?.homeRatings ||
      activeLineupRatings || {
        midfield: 40,
        rightDef: 38,
        midDef: 42,
        leftDef: 38,
        rightAtt: 38,
        midAtt: 40,
        leftAtt: 38,
      };

  const effectiveAwayRatings: SectorRatings = customMode
    ? {
        midfield: awayMid,
        rightDef: Math.max(10, awayDef - 2),
        midDef: awayDef,
        leftDef: Math.max(10, awayDef - 2),
        rightAtt: Math.max(10, awayAtt - 2),
        midAtt: awayAtt,
        leftAtt: Math.max(10, awayAtt - 2),
      }
    : selectedSimMatch?.awayRatings || {
        midfield: 36,
        rightDef: 35,
        midDef: 38,
        leftDef: 35,
        rightAtt: 34,
        midAtt: 36,
        leftAtt: 34,
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
    setViewMode("simulator");
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Stats Overview: Win / Draw / Loss Record */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold">
            <span>OYNANAN RESMİ MAÇLAR</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {totalFinished}
            {liveMatches.length > 0 && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-black">
                {liveMatches.length} CANLI
              </span>
            )}
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

      {/* Real & Live Hattrick Match Results Strip (Modern Official Match Cards) */}
      {liveAndFinishedMatches.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Hattrick Canlı & Gerçek Maç Sonuçları (Detaylı Rapor İçin Maça Tıklayın)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400">
              {liveAndFinishedMatches.length} Resmi Maç
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {liveAndFinishedMatches.slice(0, 8).map((m) => {
              const isSelected = selectedLiveMatch?.id === m.id;
              const dStr = new Date(m.matchDate).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const homeHat = m.homeRatings
                ? m.homeRatings.midfield * 3 +
                  m.homeRatings.rightDef +
                  m.homeRatings.midDef +
                  m.homeRatings.leftDef +
                  m.homeRatings.rightAtt +
                  m.homeRatings.midAtt +
                  m.homeRatings.leftAtt
                : null;
              const awayHat = m.awayRatings
                ? m.awayRatings.midfield * 3 +
                  m.awayRatings.rightDef +
                  m.awayRatings.midDef +
                  m.awayRatings.leftDef +
                  m.awayRatings.rightAtt +
                  m.awayRatings.midAtt +
                  m.awayRatings.leftAtt
                : null;

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedLiveMatchId(m.id);
                    setViewMode("live2d");
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isSelected && viewMode === "live2d"
                      ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/30 shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 hover:border-emerald-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-400">{dStr}</span>
                    {m.status === "LIVE" ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black animate-pulse">
                        🔴 CANLI
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-0.5 rounded-md font-extrabold ${
                          m.result === "WIN"
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : m.result === "DRAW"
                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                            : "bg-rose-500/20 text-rose-500"
                        }`}
                      >
                        {m.result === "WIN"
                          ? "GALİBİYET"
                          : m.result === "DRAW"
                          ? "BERABERLİK"
                          : "MAĞLUBİYET"}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <TeamCrest
                          logoUrl={m.homeLogoUrl}
                          name={m.homeTeamName}
                          size="xs"
                        />
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {m.homeTeamName}
                        </span>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {m.homeGoals ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <TeamCrest
                          logoUrl={m.awayLogoUrl}
                          name={m.awayTeamName}
                          size="xs"
                        />
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {m.awayTeamName}
                        </span>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {m.awayGoals ?? 0}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                    <span>
                      {m.homeFormation || "4-4-2"} vs {m.awayFormation || "4-4-2"}
                    </span>
                    {homeHat && awayHat ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        HatStats: {homeHat}-{awayHat}
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        Raporu Aç →
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode Switcher: 2D Live/Past Official Match Viewer vs 7-Sector Tactical Analyzer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="grid grid-cols-2 sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("live2d")}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              viewMode === "live2d"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>📺 Canlı & Geçmiş Maçlar (2D Saha)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("simulator")}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              viewMode === "simulator"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>📊 Fikstür & 7 Bölge Taktik Analizi</span>
          </button>
        </div>

        {/* Match Selector in 2D Live/Past Mode: ONLY LIVE & FINISHED matches */}
        {viewMode === "live2d" && liveAndFinishedMatches.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 shrink-0">
              Canlı / Geçmiş Maç Seç:
            </span>
            <select
              value={selectedLiveMatch?.id || ""}
              onChange={(e) => {
                setSelectedLiveMatchId(Number(e.target.value));
              }}
              className="w-full sm:w-auto px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white cursor-pointer"
            >
              {liveAndFinishedMatches.map((m) => {
                const dStr = new Date(m.matchDate).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "short",
                });
                return (
                  <option key={m.id} value={m.id}>
                    {m.status === "LIVE" ? "🔴 CANLI: " : `${dStr} • `}
                    {m.homeTeamName} {m.homeGoals ?? 0} - {m.awayGoals ?? 0}{" "}
                    {m.awayTeamName}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {/* Mode 1: 2D Live & Past Match Viewer (Strictly LIVE & FINISHED matches only) */}
      {viewMode === "live2d" && (
        <LiveMatchViewer
          match={selectedLiveMatch}
          players={players}
          onSelectPlayer={onSelectPlayer}
        />
      )}

      {/* Mode 2: 7-Sector Tactical Analyzer & Full Fixture List */}
      {viewMode === "simulator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col gap-4 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-emerald-500" />
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  7 Bölge Hücum & Savunma Karşılaştırma Motoru
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={applyActiveLineupToSimulator}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>
                    {customMode
                      ? "Manuel Simülasyon Aktif"
                      : "Reytingleri Manuel Ayarla"}
                  </span>
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

            {/* Win / Draw / Loss Probability Bar */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span className="text-emerald-600 dark:text-emerald-400">
                  Galibiyet: %{simulation.homeWinProb} (
                  {simulation.homeExpectedPoints} xPts)
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-center">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">
                    Gol Beklentisi (xG)
                  </span>
                  <strong className="text-emerald-600 dark:text-emerald-400 text-xs">
                    {simulation.expectedHomeGoals} vs{" "}
                    {simulation.expectedAwayGoals}
                  </strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">
                    Topa Sahip Olma
                  </span>
                  <strong className="text-slate-900 dark:text-white text-xs">
                    %{simulation.homePossession} - %{simulation.awayPossession}
                  </strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">
                    Gol Yememe
                  </span>
                  <strong className="text-blue-500 text-xs">
                    %{simulation.cleanSheetHomeProb}
                  </strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">
                    KG Var / 2.5 Üst
                  </span>
                  <strong className="text-amber-500 text-xs">
                    %{simulation.bttsProb} / %{simulation.over25Prob}
                  </strong>
                </div>
              </div>
            </div>

            {/* 7-Sector Detailed Matchup Table */}
            <div className="mt-1 space-y-2">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                7 Bölge Hücum & Savunma Başarı Oranları
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
                {simulation.sectorComparison.map((sec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {sec.sector}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {sec.homeValue}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-lg font-extrabold ${
                          sec.advantage === "HOME"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                            : sec.advantage === "AWAY"
                            ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        %{sec.conversionProb} Başarı
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
                const isSelected = !customMode && selectedSimMatch?.id === m.id;
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
                      setSelectedSimMatch(m);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                        : "border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      <span className="font-semibold">
                        {dateStr} •{" "}
                        {m.matchType === "LEAGUE"
                          ? "Lig"
                          : m.matchType === "CUP"
                          ? "Kupa"
                          : "Dostluk"}
                      </span>
                      {(m.status === "FINISHED" || m.status === "LIVE") && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLiveMatchId(m.id);
                            setViewMode("live2d");
                          }}
                          className="px-2.5 py-0.5 rounded-md text-[10px] bg-emerald-500 text-slate-950 font-extrabold cursor-pointer"
                        >
                          {m.status === "LIVE"
                            ? "🔴 Canlı 2D İzle"
                            : "📺 2D Maç Özeti"}
                        </button>
                      )}
                      {m.status === "UPCOMING" && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                          Gelecek Maç
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <TeamCrest
                          logoUrl={m.homeLogoUrl}
                          name={m.homeTeamName}
                          size="xs"
                        />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {m.homeTeamName}
                        </span>
                      </div>

                      <div className="px-2.5 py-1 rounded-lg bg-slate-900 text-white dark:bg-slate-800 font-extrabold text-xs shrink-0">
                        {m.status === "FINISHED" || m.status === "LIVE"
                          ? `${m.homeGoals ?? 0} - ${m.awayGoals ?? 0}`
                          : "VS"}
                      </div>

                      <div className="flex items-center justify-end gap-1.5 min-w-0 flex-1 text-right">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {m.awayTeamName}
                        </span>
                        <TeamCrest
                          logoUrl={m.awayLogoUrl}
                          name={m.awayTeamName}
                          size="xs"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
