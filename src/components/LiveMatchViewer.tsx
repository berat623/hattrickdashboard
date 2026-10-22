"use client";

import { useState, useEffect, useMemo } from "react";
import { Match, Player, SectorRatings } from "@/types/hattrick";
import {
  generateLiveMatchBroadcast,
  LiveMatchEvent,
} from "@/lib/algorithms/match-predictor";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Radio,
  Sparkles,
  Activity,
  Target,
  Shield,
  Zap,
  Trophy,
} from "lucide-react";

interface LiveMatchViewerProps {
  match: Match | null;
  players: Player[];
  activeLineupRatings?: SectorRatings;
}

export function LiveMatchViewer({
  match,
  players,
  activeLineupRatings,
}: LiveMatchViewerProps) {
  const homeTeamName = match?.homeTeamName || "Takımınız";
  const awayTeamName = match?.awayTeamName || "Rakip SK";

  const homeRatings: SectorRatings = useMemo(
    () =>
      match?.homeRatings ||
      activeLineupRatings || {
        midfield: 52,
        rightDef: 48,
        midDef: 54,
        leftDef: 46,
        rightAtt: 45,
        midAtt: 51,
        leftAtt: 48,
      },
    [match, activeLineupRatings]
  );

  const awayRatings: SectorRatings = useMemo(
    () =>
      match?.awayRatings || {
        midfield: 44,
        rightDef: 41,
        midDef: 46,
        leftDef: 42,
        rightAtt: 39,
        midAtt: 43,
        leftAtt: 40,
      },
    [match]
  );

  const broadcast = useMemo(
    () =>
      generateLiveMatchBroadcast(
        homeTeamName,
        awayTeamName,
        homeRatings,
        awayRatings,
        players
      ),
    [homeTeamName, awayTeamName, homeRatings, awayRatings, players]
  );

  const [currentMinute, setCurrentMinute] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(2);

  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = speed === 4 ? 180 : speed === 2 ? 350 : 700;
    const timer = setInterval(() => {
      setCurrentMinute((prev) => {
        if (prev >= 90) {
          setIsPlaying(false);
          return 90;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const visibleEvents = broadcast.events.filter(
    (e) => e.minute <= currentMinute
  );
  const latestEvent: LiveMatchEvent =
    visibleEvents[visibleEvents.length - 1] || broadcast.events[0];

  const progressRatio = Math.min(1, currentMinute / 90);
  const { telemetry, simulation } = broadcast;

  // Dynamic ball coordinates interpolated with slight motion
  const ballX = latestEvent.ballX;
  const ballY = latestEvent.ballY;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Stadium Digital Scoreboard Header */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-white shadow-2xl">
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-extrabold text-[11px]">
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              {currentMinute >= 90
                ? "MAÇ SONUCU"
                : isPlaying
                ? "CANLI YAYIN"
                : "MAÇ STÜDYOSU"}
            </span>
            <span className="text-slate-400 font-semibold hidden sm:inline">
              • Hattrick 2D Canlı Maç Motoru
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Duraklat</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{currentMinute >= 90 ? "Tekrar Oynat" : "Canlı İzle"}</span>
                </>
              )}
            </button>

            {([1, 2, 4] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => setSpeed(spd)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  speed === spd
                    ? "bg-white text-slate-950"
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
              >
                {spd}x
              </button>
            ))}

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentMinute(1);
              }}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
              title="Başa Sar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentMinute(90);
              }}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
              title="Maç Sonuna Atla (90')"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Scoreboard Row */}
        <div className="grid grid-cols-3 items-center gap-2 py-3 px-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-left">
            <div className="text-[10px] uppercase text-emerald-400 font-bold">
              Ev Sahibi
            </div>
            <div className="text-sm sm:text-xl font-black truncate">
              {homeTeamName}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              xG: <strong className="text-emerald-300">{latestEvent.homeXG.toFixed(2)}</strong>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs mb-1">
              {currentMinute}&apos; DK
            </div>
            <div className="text-2xl sm:text-4xl font-black tracking-wider">
              {latestEvent.homeScore} : {latestEvent.awayScore}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase text-rose-400 font-bold">
              Deplasman
            </div>
            <div className="text-sm sm:text-xl font-black truncate">
              {awayTeamName}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              xG: <strong className="text-rose-300">{latestEvent.awayXG.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="mt-4 space-y-1">
          <input
            type="range"
            min={1}
            max={90}
            value={currentMinute}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentMinute(Number(e.target.value));
            }}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>1&apos; Başlama</span>
            <span>45&apos; Devre Arası</span>
            <span>90&apos; Maç Sonu</span>
          </div>
        </div>
      </div>

      {/* Main Split: 2D Animated Pitch & Live Commentary (7 cols) + Pro Telemetry (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: 2D Pitch + Live Commentary Feed */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* 2D Live Pitch */}
          <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border-4 border-emerald-800 dark:border-emerald-950 bg-gradient-to-b from-emerald-700 via-emerald-600 to-emerald-800 select-none">
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(90deg,#ffffff,#ffffff_40px,transparent_40px,transparent_80px)]" />

            {/* Pitch Markings */}
            <div className="absolute inset-4 border-2 border-white/45 rounded-xl pointer-events-none">
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/45 -translate-x-1/2" />
              <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/45 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-1/2 left-0 w-16 h-36 border-y-2 border-r-2 border-white/45 -translate-y-1/2" />
              <div className="absolute top-1/2 right-0 w-16 h-36 border-y-2 border-l-2 border-white/45 -translate-y-1/2" />
            </div>

            {/* Animated Ball & Event Indicator */}
            <div
              style={{
                left: `${ballY}%`,
                top: `${ballX}%`,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute z-20 transition-all duration-500 ease-out"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-amber-400/30 animate-ping absolute" />
                <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-950 shadow-lg flex items-center justify-center text-[10px]">
                  ⚽
                </div>
              </div>
            </div>

            {/* Live Overlay Ticker Banner at Bottom of Pitch */}
            <div className="absolute bottom-3 inset-x-3 z-20 p-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-white/20 text-white flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shrink-0">
                {latestEvent.minute}&apos;
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold text-amber-300 truncate">
                  {latestEvent.title}
                </div>
                <div className="text-[11px] text-slate-200 line-clamp-1">
                  {latestEvent.commentary}
                </div>
              </div>
            </div>
          </div>

          {/* Minute-by-Minute Commentary Feed */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Dakika Dakika Canlı Maç Anlatımı
              </h4>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {visibleEvents.length} Olay
              </span>
            </div>

            <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
              {[...visibleEvents].reverse().map((ev, i) => (
                <div
                  key={`${ev.minute}-${i}`}
                  className={`p-3 rounded-2xl border text-xs flex items-start gap-3 ${
                    ev.type === "GOAL" || ev.type === "SPECIAL_EVENT_GOAL"
                      ? "border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-950/30"
                      : "border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50"
                  }`}
                >
                  <span className="px-2 py-1 rounded-lg bg-slate-900 dark:bg-slate-800 text-white font-extrabold text-[11px] shrink-0">
                    {ev.minute}&apos;
                  </span>
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-slate-900 dark:text-white">
                      {ev.title}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ev.commentary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Advanced Pro Telemetry (Beyond Standard Hattrick) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Gelişmiş Pro Maç İstatistikleri
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                xG & Telemetri
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  label: "Topa Sahip Olma (%)",
                  home: simulation.homePossession,
                  away: simulation.awayPossession,
                  suffix: "%",
                },
                {
                  label: "Gol Beklentisi (xG)",
                  home: Number((simulation.expectedHomeGoals * progressRatio).toFixed(2)),
                  away: Number((simulation.expectedAwayGoals * progressRatio).toFixed(2)),
                  suffix: "",
                },
                {
                  label: "Toplam Şut",
                  home: Math.max(1, Math.round(telemetry.homeShots * progressRatio)),
                  away: Math.max(1, Math.round(telemetry.awayShots * progressRatio)),
                  suffix: "",
                },
                {
                  label: "İsabetli Şut",
                  home: Math.max(1, Math.round(telemetry.homeShotsOnTarget * progressRatio)),
                  away: Math.max(0, Math.round(telemetry.awayShotsOnTarget * progressRatio)),
                  suffix: "",
                },
                {
                  label: "Net Gol Pozisyonu (Big Chances)",
                  home: Math.max(1, Math.round(telemetry.homeBigChances * progressRatio)),
                  away: Math.max(0, Math.round(telemetry.awayBigChances * progressRatio)),
                  suffix: "",
                },
                {
                  label: "3. Bölge Hücum Baskısı (Field Tilt)",
                  home: telemetry.homeFieldTilt,
                  away: telemetry.awayFieldTilt,
                  suffix: "%",
                },
                {
                  label: "Pas İsabet Oranı",
                  home: telemetry.homePassAccuracy,
                  away: telemetry.awayPassAccuracy,
                  suffix: "%",
                },
                {
                  label: "İkili Mücadele Kazanma",
                  home: telemetry.homeDuelsWon,
                  away: telemetry.awayDuelsWon,
                  suffix: "%",
                },
              ].map((stat) => {
                const total = stat.home + stat.away || 1;
                const homePct = Math.round((stat.home / total) * 100);
                return (
                  <div key={stat.label} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {stat.home}
                        {stat.suffix}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                        {stat.label}
                      </span>
                      <span className="text-rose-500">
                        {stat.away}
                        {stat.suffix}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-rose-500/30 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${homePct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Most Likely Exact Scorelines & Special Probabilities */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              Olasılık Motoru: En Yüksek Skor İhtimalleri
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {simulation.topScorelines.map((sc) => (
                <div
                  key={sc.label}
                  className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-center"
                >
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {sc.label}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    %{sc.probability}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Gol Yememe:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">
                  %{simulation.cleanSheetHomeProb}
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">2.5 Gol Üstü:</span>
                <strong className="text-amber-600 dark:text-amber-400">
                  %{simulation.over25Prob}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
