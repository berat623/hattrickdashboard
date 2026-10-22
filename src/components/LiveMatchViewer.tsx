"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Match,
  Player,
  RealMatchDetails,
  RealMatchLineupPlayer,
  RealMatchEvent,
} from "@/types/hattrick";
import { PlayerAvatar, TeamCrest } from "./PlayerAvatar";
import {
  Radio,
  Activity,
  Shield,
  Users,
  Clock,
  RefreshCw,
  Award,
  MapPin,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface LiveMatchViewerProps {
  match: Match | null;
  players: Player[];
  onSelectPlayer?: (player: Player) => void;
}

/**
 * Maps Hattrick RoleID (100..113) to 2D Pitch coordinates (x: 0..100 horizontal, y: 0..100 vertical)
 * Home team plays left-to-right (x: 6% to 46%), Away team plays right-to-left (x: 94% down to 54%)
 */
function getRole2DCoordinates(
  roleId: number,
  side: "HOME" | "AWAY"
): { x: number; y: number; shortRole: string } {
  const baseMap: Record<number, { depth: number; lane: number; shortRole: string }> = {
    100: { depth: 7, lane: 50, shortRole: "GK" }, // Kaleci
    101: { depth: 20, lane: 84, shortRole: "RB" }, // Sağ Bek
    102: { depth: 19, lane: 64, shortRole: "RCD" }, // Sağ Stoper
    103: { depth: 18, lane: 50, shortRole: "MCD" }, // Merkez Stoper
    104: { depth: 19, lane: 36, shortRole: "LCD" }, // Sol Stoper
    105: { depth: 20, lane: 16, shortRole: "LB" }, // Sol Bek
    106: { depth: 33, lane: 86, shortRole: "RW" }, // Sağ Kanat
    107: { depth: 32, lane: 66, shortRole: "RIM" }, // Sağ İç
    108: { depth: 31, lane: 50, shortRole: "MIM" }, // Merkez Orta Saha
    109: { depth: 32, lane: 34, shortRole: "LIM" }, // Sol İç
    110: { depth: 33, lane: 14, shortRole: "LW" }, // Sol Kanat
    111: { depth: 44, lane: 70, shortRole: "RFW" }, // Sağ Forvet
    112: { depth: 45, lane: 50, shortRole: "MFW" }, // Merkez Forvet
    113: { depth: 44, lane: 30, shortRole: "LFW" }, // Sol Forvet
  };

  const entry = baseMap[roleId] || { depth: 30, lane: 50, shortRole: "OYN" };
  if (side === "HOME") {
    return {
      x: entry.depth,
      y: entry.lane,
      shortRole: entry.shortRole,
    };
  } else {
    return {
      x: 100 - entry.depth,
      y: 100 - entry.lane,
      shortRole: entry.shortRole,
    };
  }
}

function computeRealServerMinute(matchDateStr: string, status: string): number {
  if (status === "FINISHED") return 90;
  const startMs = new Date(matchDateStr).getTime();
  const nowMs = Date.now();
  const diffMin = Math.floor((nowMs - startMs) / 60000);
  if (diffMin <= 0) return 1;
  if (diffMin <= 45) return diffMin;
  if (diffMin <= 60) return 45; // 15-min halftime break on Hattrick server
  return Math.min(90, diffMin - 15);
}

export function LiveMatchViewer({
  match,
  players,
  onSelectPlayer,
}: LiveMatchViewerProps) {
  const [details, setDetails] = useState<RealMatchDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<number>(90);
  const [realTimeMode, setRealTimeMode] = useState<boolean>(false);
  const [focusedPitchPlayer, setFocusedPitchPlayer] =
    useState<RealMatchLineupPlayer | null>(null);

  const fetchRealMatchDetails = useCallback(
    async (matchId: number, isLivePoll = false) => {
      try {
        if (!isLivePoll) {
          setLoading(true);
          setError(null);
        }
        const res = await fetch(
          `/api/hattrick/matchdetails?matchId=${matchId}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (!res.ok || !data?.details) {
          throw new Error(data?.error || "Maç detayları yüklenemedi");
        }
        const d: RealMatchDetails = data.details;
        setDetails(d);
        if (!isLivePoll) {
          if (d.status === "LIVE") {
            setSelectedMinute(computeRealServerMinute(d.matchDate, "LIVE"));
            setRealTimeMode(true);
          } else {
            setSelectedMinute(90);
            setRealTimeMode(false);
          }
        }
      } catch (err: unknown) {
        if (!isLivePoll) {
          setError(
            err instanceof Error ? err.message : "Maç verisi alınamadı"
          );
        }
      } finally {
        if (!isLivePoll) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!match || match.status === "UPCOMING") {
      setDetails(null);
      return;
    }
    setFocusedPitchPlayer(null);
    fetchRealMatchDetails(match.id, false);
  }, [match, fetchRealMatchDetails]);

  // 1:1 Normal Hattrick Server Clock (60 seconds = 1 match minute; NO 2x/4x/6x fast-forward)
  useEffect(() => {
    if (!realTimeMode || !details) return;

    const timer = setInterval(() => {
      if (details.status === "LIVE") {
        setSelectedMinute(computeRealServerMinute(details.matchDate, "LIVE"));
        fetchRealMatchDetails(details.matchId, true);
      } else {
        setSelectedMinute((prev) => {
          if (prev >= 90) {
            setRealTimeMode(false);
            return 90;
          }
          return prev + 1;
        });
      }
    }, 60000); // True 1:1 Hattrick server speed (1 minute per 60,000 ms)

    return () => clearInterval(timer);
  }, [realTimeMode, details, fetchRealMatchDetails]);

  if (!match || match.status === "UPCOMING") {
    return (
      <div className="p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-2">
        <Radio className="w-8 h-8 text-emerald-500 mx-auto" />
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          Canlı & Geçmiş 2D Maç Merkezi
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Bu ekran tahmini maç üretmez; yalnızca şu anda Hattrick sunucusunda canlı oynanan veya geçmişte tamamlanmış gerçek maçların verilerini ve 2D oyuncu dizilişlerini gösterir.
        </p>
      </div>
    );
  }

  if (loading && !details) {
    return (
      <div className="p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Hattrick CHPP sunucusundan gerçek maç olayları, 2D kadrolar, oyuncu resimleri ve takım logoları çekiliyor...
        </p>
      </div>
    );
  }

  if (error && !details) {
    return (
      <div className="p-8 rounded-3xl border border-rose-300 dark:border-rose-900 bg-rose-500/10 text-center space-y-3">
        <p className="text-xs font-bold text-rose-600 dark:text-rose-300">
          {error}
        </p>
        <button
          onClick={() => fetchRealMatchDetails(match.id, false)}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold cursor-pointer"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  const homeTeamName = details?.homeTeamName || match.homeTeamName;
  const awayTeamName = details?.awayTeamName || match.awayTeamName;

  // Goals up to selectedMinute
  const goalsUpToMinute = (details?.goals || []).filter(
    (g) => g.minute <= selectedMinute
  );
  const currentHomeGoals =
    selectedMinute >= 90
      ? details?.homeGoals ?? match.homeGoals ?? 0
      : goalsUpToMinute.filter((g) => g.teamId === details?.homeTeamId).length;
  const currentAwayGoals =
    selectedMinute >= 90
      ? details?.awayGoals ?? match.awayGoals ?? 0
      : goalsUpToMinute.filter((g) => g.teamId === details?.awayTeamId).length;

  const visibleEvents: RealMatchEvent[] = (details?.events || []).filter(
    (ev) => ev.minute <= selectedMinute
  );
  const latestEvent = visibleEvents[visibleEvents.length - 1];

  // Determine ball position on the 2D pitch from the latest real event
  let ballX = 50;
  let ballY = 50;
  if (latestEvent && details) {
    if (latestEvent.subjectTeamId === details.homeTeamId) {
      ballX = latestEvent.eventTypeId >= 100 && latestEvent.eventTypeId < 200 ? 86 : 72;
      ballY = (latestEvent.index * 23) % 60 + 20;
    } else if (latestEvent.subjectTeamId === details.awayTeamId) {
      ballX = latestEvent.eventTypeId >= 100 && latestEvent.eventTypeId < 200 ? 14 : 28;
      ballY = (latestEvent.index * 29) % 60 + 20;
    }
  }

  const homePoss1 = details?.possessionFirstHalfHome ?? 50;
  const homePoss2 = details?.possessionSecondHalfHome ?? homePoss1;
  const avgHomePoss = Math.round((homePoss1 + homePoss2) / 2);
  const avgAwayPoss = 100 - avgHomePoss;

  // Map local squad avatars if any player is from user's own squad
  const mySquadMap = new Map<number, Player>();
  for (const p of players) {
    mySquadMap.set(p.id, p);
  }

  const homeLineup = (details?.homeLineup || []).map((lp) => {
    const localP = mySquadMap.get(lp.playerId);
    return {
      ...lp,
      avatar: lp.avatar || localP?.avatar,
      shirtNumber: lp.shirtNumber || localP?.shirtNumber,
    };
  });

  const awayLineup = (details?.awayLineup || []).map((lp) => {
    const localP = mySquadMap.get(lp.playerId);
    return {
      ...lp,
      avatar: lp.avatar || localP?.avatar,
      shirtNumber: lp.shirtNumber || localP?.shirtNumber,
    };
  });

  const goalsByPlayer = new Map<number, number>();
  for (const g of goalsUpToMinute) {
    goalsByPlayer.set(g.playerId, (goalsByPlayer.get(g.playerId) || 0) + 1);
  }

  const bookingsByPlayer = new Map<number, "YELLOW" | "RED">();
  for (const b of details?.bookings || []) {
    if (b.minute <= selectedMinute) {
      bookingsByPlayer.set(b.playerId, b.bookingType);
    }
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Official Hattrick Scoreboard with Real Club Logos */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-white shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold text-[11px] border ${
                details?.status === "LIVE"
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              }`}
            >
              <Radio
                className={`w-3.5 h-3.5 ${
                  details?.status === "LIVE"
                    ? "text-rose-400 animate-pulse"
                    : "text-emerald-400"
                }`}
              />
              {details?.status === "LIVE"
                ? "CANLI MAÇ (1:1 SUNUCU HIZI)"
                : "TAMAMLANAN RESMİ MAÇ KAYDI"}
            </span>
            {details?.arenaName && (
              <span className="hidden sm:flex items-center gap-1 text-slate-300 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {details.arenaName}
                {details.soldTotal
                  ? ` (${details.soldTotal.toLocaleString("tr-TR")} Seyirci)`
                  : ""}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!realTimeMode && selectedMinute >= 90) {
                  setSelectedMinute(1);
                }
                setRealTimeMode(!realTimeMode);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                realTimeMode
                  ? "bg-amber-400 text-slate-950"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>
                {realTimeMode
                  ? "1:1 Gerçek Sunucu Hızında Akıyor (1 dk = 60 sn)"
                  : "1:1 Sunucu Hızında Başlat"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => fetchRealMatchDetails(match.id, false)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold cursor-pointer"
              title="Hattrick Sunucusundan Yenile"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sunucudan Yenile</span>
            </button>
          </div>
        </div>

        {/* Scoreboard Row with Real Team Logos & Formations */}
        <div className="grid grid-cols-3 items-center gap-3 py-3.5 px-4 rounded-2xl bg-white/5 border border-white/10">
          {/* Home Team */}
          <div className="flex items-center gap-3 min-w-0">
            <TeamCrest
              logoUrl={details?.homeLogoUrl}
              dressUri={details?.homeDressUri}
              name={homeTeamName}
              size="lg"
              className="border-emerald-500/40"
            />
            <div className="min-w-0">
              <div className="text-[10px] uppercase text-emerald-400 font-bold">
                Ev Sahibi • {details?.homeFormation || "4-4-2"}
              </div>
              <div className="text-sm sm:text-xl font-black truncate">
                {homeTeamName}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                Taktik:{" "}
                <strong className="text-slate-200">
                  {details?.homeTacticType || "Normal"}
                </strong>
              </div>
            </div>
          </div>

          {/* Score & Minute */}
          <div className="flex flex-col items-center justify-center">
            <div className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs mb-1">
              {selectedMinute}&apos; DK
            </div>
            <div className="text-2xl sm:text-4xl font-black tracking-wider">
              {currentHomeGoals} : {currentAwayGoals}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Topa Sahip Olma: %{avgHomePoss} - %{avgAwayPoss}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-end gap-3 min-w-0 text-right">
            <div className="min-w-0">
              <div className="text-[10px] uppercase text-rose-400 font-bold">
                {details?.awayFormation || "4-4-2"} • Deplasman
              </div>
              <div className="text-sm sm:text-xl font-black truncate">
                {awayTeamName}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                Taktik:{" "}
                <strong className="text-slate-200">
                  {details?.awayTacticType || "Normal"}
                </strong>
              </div>
            </div>
            <TeamCrest
              logoUrl={details?.awayLogoUrl}
              dressUri={details?.awayDressUri}
              name={awayTeamName}
              size="lg"
              className="border-rose-500/40"
            />
          </div>
        </div>

        {/* Scorers List Banner */}
        {goalsUpToMinute.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-black/30 border border-white/10 text-[11px]">
            <div className="flex flex-wrap items-center gap-2">
              {goalsUpToMinute
                .filter((g) => g.teamId === details?.homeTeamId)
                .map((g, idx) => (
                  <span
                    key={`h-${idx}`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold"
                  >
                    ⚽ {g.playerName} ({g.minute}&apos;)
                  </span>
                ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {goalsUpToMinute
                .filter((g) => g.teamId === details?.awayTeamId)
                .map((g, idx) => (
                  <span
                    key={`a-${idx}`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold"
                  >
                    ⚽ {g.playerName} ({g.minute}&apos;)
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Minute Timeline Bar */}
        <div className="mt-4 space-y-1">
          <input
            type="range"
            min={1}
            max={90}
            value={selectedMinute}
            onChange={(e) => {
              setRealTimeMode(false);
              setSelectedMinute(Number(e.target.value));
            }}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>1&apos; Başlama</span>
            <span>45&apos; İlk Yarı Sonu</span>
            <span>90&apos; Maç Sonu</span>
          </div>
        </div>
      </div>

      {/* Main Split: Detailed 2D Pitch with Player Avatars & Names + Real Events & Sector Ratings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: Detailed 2D Pitch Engine + Official Match Events */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* 2D Pitch Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Detaylı 2D Saha Motoru (Gerçek Oyuncu Avatarları & Mevkiler)
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                {homeTeamName} ({details?.homeFormation || "4-4-2"})
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                {awayTeamName} ({details?.awayFormation || "4-4-2"})
              </span>
            </div>
          </div>

          {/* Detailed 2D Pitch Canvas */}
          <div className="relative w-full h-[460px] sm:h-[520px] rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-900 dark:border-emerald-950 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 select-none">
            {/* Grass Stripes */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(90deg,#ffffff,#ffffff_48px,transparent_48px,transparent_96px)]" />

            {/* Pitch Lines */}
            <div className="absolute inset-3 sm:inset-5 border-2 border-white/50 rounded-2xl pointer-events-none">
              {/* Halfway Line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/50 -translate-x-1/2" />
              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 w-24 h-24 sm:w-28 sm:h-28 border-2 border-white/50 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/80 rounded-full -translate-x-1/2 -translate-y-1/2" />
              {/* Left Penalty Box */}
              <div className="absolute top-1/2 left-0 w-16 sm:w-24 h-44 sm:h-56 border-y-2 border-r-2 border-white/50 -translate-y-1/2" />
              <div className="absolute top-1/2 left-0 w-6 sm:w-10 h-20 sm:h-28 border-y-2 border-r-2 border-white/50 -translate-y-1/2" />
              {/* Right Penalty Box */}
              <div className="absolute top-1/2 right-0 w-16 sm:w-24 h-44 sm:h-56 border-y-2 border-l-2 border-white/50 -translate-y-1/2" />
              <div className="absolute top-1/2 right-0 w-6 sm:w-10 h-20 sm:h-28 border-y-2 border-l-2 border-white/50 -translate-y-1/2" />
            </div>

            {/* Team Half Watermarks */}
            <div className="absolute top-3 left-5 z-10 flex items-center gap-2 bg-slate-950/65 backdrop-blur-sm px-2.5 py-1 rounded-xl border border-emerald-400/30">
              <TeamCrest
                logoUrl={details?.homeLogoUrl}
                dressUri={details?.homeDressUri}
                name={homeTeamName}
                size="xs"
              />
              <span className="text-[10px] font-black text-emerald-300 truncate max-w-[120px]">
                {homeTeamName}
              </span>
            </div>

            <div className="absolute top-3 right-5 z-10 flex items-center gap-2 bg-slate-950/65 backdrop-blur-sm px-2.5 py-1 rounded-xl border border-rose-400/30">
              <span className="text-[10px] font-black text-rose-300 truncate max-w-[120px]">
                {awayTeamName}
              </span>
              <TeamCrest
                logoUrl={details?.awayLogoUrl}
                dressUri={details?.awayDressUri}
                name={awayTeamName}
                size="xs"
              />
            </div>

            {/* HOME TEAM PLAYERS (Left Side of 2D Pitch) */}
            {homeLineup.map((p) => {
              const coords = getRole2DCoordinates(p.roleId, "HOME");
              const goalsScored = goalsByPlayer.get(p.playerId) || 0;
              const card = bookingsByPlayer.get(p.playerId);
              const shortName = p.lastName || p.name.split(" ").pop() || p.name;

              return (
                <div
                  key={`home-${p.roleId}-${p.playerId}`}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => {
                    setFocusedPitchPlayer(p);
                    const myPl = mySquadMap.get(p.playerId);
                    if (myPl && onSelectPlayer) onSelectPlayer(myPl);
                  }}
                  className="absolute z-20 flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 hover:z-30"
                >
                  <div className="relative">
                    <PlayerAvatar
                      avatar={p.avatar}
                      name={p.name}
                      shirtNumber={p.shirtNumber}
                      size="xs"
                      badgeColor="bg-emerald-600"
                      className="ring-2 ring-emerald-400 shadow-lg"
                    />
                    {p.isCaptain && (
                      <span className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 font-black text-[8px] flex items-center justify-center shadow">
                        C
                      </span>
                    )}
                    {goalsScored > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 px-1 rounded-full bg-white text-slate-950 font-black text-[8px] shadow">
                        ⚽{goalsScored > 1 ? goalsScored : ""}
                      </span>
                    )}
                    {card && (
                      <span
                        className={`absolute bottom-0 -left-1 w-2.5 h-3.5 rounded-xs border border-black/30 ${
                          card === "RED" ? "bg-rose-600" : "bg-amber-400"
                        }`}
                      />
                    )}
                  </div>

                  {/* Player Name + Stars Underneath */}
                  <div className="mt-0.5 px-1.5 py-0.5 rounded-md bg-slate-950/90 border border-emerald-400/50 text-white text-center shadow-md min-w-[54px] max-w-[82px]">
                    <div className="text-[9px] font-extrabold leading-tight truncate">
                      {shortName}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[8px] text-amber-300 font-bold leading-none mt-0.5">
                      <span>{coords.shortRole}</span>
                      {p.ratingStars > 0 && <span>★{p.ratingStars}</span>}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* AWAY TEAM PLAYERS (Right Side of 2D Pitch) */}
            {awayLineup.map((p) => {
              const coords = getRole2DCoordinates(p.roleId, "AWAY");
              const goalsScored = goalsByPlayer.get(p.playerId) || 0;
              const card = bookingsByPlayer.get(p.playerId);
              const shortName = p.lastName || p.name.split(" ").pop() || p.name;

              return (
                <div
                  key={`away-${p.roleId}-${p.playerId}`}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => {
                    setFocusedPitchPlayer(p);
                    const myPl = mySquadMap.get(p.playerId);
                    if (myPl && onSelectPlayer) onSelectPlayer(myPl);
                  }}
                  className="absolute z-20 flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 hover:z-30"
                >
                  <div className="relative">
                    <PlayerAvatar
                      avatar={p.avatar}
                      name={p.name}
                      shirtNumber={p.shirtNumber}
                      size="xs"
                      badgeColor="bg-rose-600"
                      className="ring-2 ring-rose-400 shadow-lg"
                    />
                    {p.isCaptain && (
                      <span className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 font-black text-[8px] flex items-center justify-center shadow">
                        C
                      </span>
                    )}
                    {goalsScored > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 px-1 rounded-full bg-white text-slate-950 font-black text-[8px] shadow">
                        ⚽{goalsScored > 1 ? goalsScored : ""}
                      </span>
                    )}
                    {card && (
                      <span
                        className={`absolute bottom-0 -left-1 w-2.5 h-3.5 rounded-xs border border-black/30 ${
                          card === "RED" ? "bg-rose-600" : "bg-amber-400"
                        }`}
                      />
                    )}
                  </div>

                  {/* Player Name + Stars Underneath */}
                  <div className="mt-0.5 px-1.5 py-0.5 rounded-md bg-slate-950/90 border border-rose-400/50 text-white text-center shadow-md min-w-[54px] max-w-[82px]">
                    <div className="text-[9px] font-extrabold leading-tight truncate">
                      {shortName}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[8px] text-amber-300 font-bold leading-none mt-0.5">
                      <span>{coords.shortRole}</span>
                      {p.ratingStars > 0 && <span>★{p.ratingStars}</span>}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Ball Position Marker */}
            <div
              style={{
                left: `${ballX}%`,
                top: `${ballY}%`,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute z-25 transition-all duration-700 ease-out pointer-events-none"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-amber-400/35 animate-ping absolute" />
                <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-950 shadow-xl flex items-center justify-center text-[10px]">
                  ⚽
                </div>
              </div>
            </div>

            {/* Bottom Event Ticker Bar */}
            {latestEvent && (
              <div className="absolute bottom-2.5 inset-x-3 z-30 p-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-white/20 text-white flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shrink-0">
                  {latestEvent.minute}&apos;
                </span>
                <p className="text-[11px] text-slate-100 font-medium line-clamp-1">
                  {latestEvent.eventText}
                </p>
              </div>
            )}
          </div>

          {/* Focused Player Card on Pitch Click */}
          {focusedPitchPlayer && (
            <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-950/25 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <PlayerAvatar
                  avatar={focusedPitchPlayer.avatar}
                  name={focusedPitchPlayer.name}
                  shirtNumber={focusedPitchPlayer.shirtNumber}
                  size="md"
                />
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{focusedPitchPlayer.name}</span>
                    {focusedPitchPlayer.isCaptain && (
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black">
                        Kaptan
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    Mevki: <strong>{focusedPitchPlayer.roleName}</strong> • Emir:{" "}
                    <strong>{focusedPitchPlayer.behaviour || "Normal"}</strong> •
                    Maç Performansı:{" "}
                    <strong className="text-amber-500">
                      ★ {focusedPitchPlayer.ratingStars} Yıldız
                    </strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFocusedPitchPlayer(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Kapat
              </button>
            </div>
          )}

          {/* Official Hattrick Match Events Feed */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Resmi Hattrick Maç Raporu & Dakika Dakika Olaylar
              </h4>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {visibleEvents.length} Resmi Olay
              </span>
            </div>

            {visibleEvents.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Bu dakikaya kadar kayıtlı resmi maç olayı bulunmuyor.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {[...visibleEvents].reverse().map((ev, i) => {
                  const isGoal = goalsUpToMinute.some(
                    (g) => g.minute === ev.minute
                  );
                  return (
                    <div
                      key={`${ev.index}-${i}`}
                      className={`p-3 rounded-2xl border text-xs flex items-start gap-3 ${
                        isGoal
                          ? "border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-950/30"
                          : "border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50"
                      }`}
                    >
                      <span className="px-2 py-1 rounded-lg bg-slate-900 dark:bg-slate-800 text-white font-extrabold text-[11px] shrink-0">
                        {ev.minute}&apos;
                      </span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                        {ev.eventText || `Dakika ${ev.minute}' maç olayı (#${ev.eventTypeId})`}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Official Sector Ratings & Starting Lineups */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Official 7-Sector Ratings from Hattrick Server */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Resmi Hattrick 7 Bölge Reytingleri
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                CHPP Resmi Veri
              </span>
            </div>

            {details && (
              <div className="space-y-3">
                {[
                  {
                    label: "Orta Saha",
                    home: details.homeRatings.midfield,
                    away: details.awayRatings.midfield,
                  },
                  {
                    label: "Sağ Defans",
                    home: details.homeRatings.rightDef,
                    away: details.awayRatings.rightDef,
                  },
                  {
                    label: "Merkez Defans",
                    home: details.homeRatings.midDef,
                    away: details.awayRatings.midDef,
                  },
                  {
                    label: "Sol Defans",
                    home: details.homeRatings.leftDef,
                    away: details.awayRatings.leftDef,
                  },
                  {
                    label: "Sağ Hücum",
                    home: details.homeRatings.rightAtt,
                    away: details.awayRatings.rightAtt,
                  },
                  {
                    label: "Merkez Hücum",
                    home: details.homeRatings.midAtt,
                    away: details.awayRatings.midAtt,
                  },
                  {
                    label: "Sol Hücum",
                    home: details.homeRatings.leftAtt,
                    away: details.awayRatings.leftAtt,
                  },
                ].map((sec) => {
                  const total = sec.home + sec.away || 1;
                  const homePct = Math.round((sec.home / total) * 100);
                  const homeLevel = (sec.home / 4).toFixed(1);
                  const awayLevel = (sec.away / 4).toFixed(1);
                  return (
                    <div key={sec.label} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {homeLevel} ({sec.home})
                        </span>
                        <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                          {sec.label}
                        </span>
                        <span className="text-rose-500">
                          {awayLevel} ({sec.away})
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
            )}
          </div>

          {/* Starting 11 Star Ratings List for Both Teams */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  İlk 11 Oyuncu Yıldız Performansları
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 max-h-[330px] overflow-y-auto pr-1">
              <div>
                <div className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 mb-1.5">
                  {homeTeamName} İlk 11
                </div>
                <div className="space-y-1.5">
                  {homeLineup.map((p) => (
                    <div
                      key={`hl-${p.roleId}-${p.playerId}`}
                      className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <PlayerAvatar
                          avatar={p.avatar}
                          name={p.name}
                          size="xs"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white truncate">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {p.roleName}
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black text-[11px] shrink-0">
                        ★ {p.ratingStars}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-black text-rose-500 mb-1.5">
                  {awayTeamName} İlk 11
                </div>
                <div className="space-y-1.5">
                  {awayLineup.map((p) => (
                    <div
                      key={`al-${p.roleId}-${p.playerId}`}
                      className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <PlayerAvatar
                          avatar={p.avatar}
                          name={p.name}
                          size="xs"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white truncate">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {p.roleName}
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black text-[11px] shrink-0">
                        ★ {p.ratingStars}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
