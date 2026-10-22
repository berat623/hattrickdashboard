"use client";

import { useState } from "react";
import { TacticalLineup, FormationSlot, Player } from "@/types/hattrick";
import { getPlayerScoreForRole } from "@/lib/algorithms/lineup";
import {
  Star,
  Shield,
  ArrowLeftRight,
  UserCheck,
  Award,
  Target,
  Info,
} from "lucide-react";

interface PitchBoardProps {
  lineup: TacticalLineup;
  allPlayers: Player[];
  onSwapPlayer?: (slotId: string, newPlayer: Player) => void;
  onInspectPlayer?: (player: Player) => void;
  onUpdateCaptainOrSP?: (captainId?: number, setPiecesId?: number) => void;
}

export function PitchBoard({
  lineup,
  allPlayers,
  onSwapPlayer,
  onInspectPlayer,
  onUpdateCaptainOrSP,
}: PitchBoardProps) {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const activeSlot = lineup.slots.find((s) => s.id === selectedSlotId) || null;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "GK":
        return "bg-amber-400 text-slate-950 font-extrabold border-amber-200";
      case "CD":
      case "RB":
      case "LB":
        return "bg-blue-600 text-white font-extrabold border-blue-400";
      case "IM":
        return "bg-emerald-600 text-white font-extrabold border-emerald-400";
      case "RW":
      case "LW":
        return "bg-purple-600 text-white font-extrabold border-purple-400";
      case "FW":
        return "bg-rose-600 text-white font-extrabold border-rose-400";
      default:
        return "bg-slate-600 text-white font-extrabold border-slate-400";
    }
  };

  const handleSlotClick = (slot: FormationSlot) => {
    if (!selectedSlotId) {
      setSelectedSlotId(slot.id);
      return;
    }
    if (selectedSlotId === slot.id) {
      setSelectedSlotId(null);
      return;
    }
    // Swap between two pitch slots
    if (slot.assignedPlayer && onSwapPlayer) {
      onSwapPlayer(selectedSlotId, slot.assignedPlayer);
      setSelectedSlotId(null);
    }
  };

  // Bench and reserve players sorted by suitability for the selected slot
  const starterIds = new Set(
    lineup.slots.map((s) => s.assignedPlayer?.id).filter(Boolean)
  );
  const benchPlayers = allPlayers
    .filter((p) => !starterIds.has(p.id) && p.injuryDays === 0)
    .map((p) => ({
      player: p,
      roleScore: activeSlot
        ? getPlayerScoreForRole(p, activeSlot.role)
        : p.positionRating || 0,
    }))
    .sort((a, b) => b.roleScore - a.roleScore);

  const starters = lineup.slots
    .map((s) => s.assignedPlayer)
    .filter(Boolean) as Player[];

  // Top 5 Penalty Takers ranked by Hattrick Penalty Formula (SetPieces*0.5 + Scorer*0.3 + Exp*0.2 + Technical bonus)
  const topPenaltyTakers = [...starters]
    .map((p) => {
      const techBonus = p.specialty === "Teknik" ? 1.5 : 0;
      const penScore =
        Math.round(
          (p.skills.setPieces * 0.5 +
            p.skills.scorer * 0.3 +
            p.experience * 0.2 +
            techBonus) *
            10
        ) / 10;
      const convPct = Math.min(96, Math.max(58, Math.round(52 + penScore * 3.2)));
      return { player: p, penScore, convPct };
    })
    .sort((a, b) => b.penScore - a.penScore)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-5 w-full animate-fade-in">
      {/* 7 Sector Ratings Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 p-3.5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <SectorRatingItem
          label="Sol Defans"
          value={lineup.sectorRatings.leftDef}
        />
        <SectorRatingItem
          label="Merkez Defans"
          value={lineup.sectorRatings.midDef}
          highlight
        />
        <SectorRatingItem
          label="Sağ Defans"
          value={lineup.sectorRatings.rightDef}
        />
        <SectorRatingItem
          label="Orta Saha"
          value={lineup.sectorRatings.midfield}
          isMidfield
        />
        <SectorRatingItem
          label="Sol Forvet"
          value={lineup.sectorRatings.leftAtt}
        />
        <SectorRatingItem
          label="Merkez Forvet"
          value={lineup.sectorRatings.midAtt}
          highlight
        />
        <SectorRatingItem
          label="Sağ Forvet"
          value={lineup.sectorRatings.rightAtt}
        />
      </div>

      {/* Main Split: 2D Interactive Pitch (8 cols on lg) + Swap & Roles Sidebar (4 cols on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: 2D Football Pitch (Mobile vertical aspect vs Desktop wide stadium aspect) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          {/* Interactive Instruction Banner */}
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-xs">
            <div className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
              <ArrowLeftRight className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>
                {activeSlot
                  ? `Seçili Mevki: ${activeSlot.label} (${activeSlot.assignedPlayer?.name}) — Değiştirmek istediğiniz oyuncuya tıklayın`
                  : "Oyuncu değiştirmek veya mevkisini incelemek için sahadaki herhangi bir oyuncuya tıklayın."}
              </span>
            </div>
            {activeSlot && (
              <button
                onClick={() => setSelectedSlotId(null)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold shrink-0 cursor-pointer"
              >
                İptal
              </button>
            )}
          </div>

          {/* Pitch Canvas */}
          <div className="relative w-full aspect-[3/4.1] sm:aspect-[4/4.2] md:aspect-[16/10.5] rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-800 dark:border-emerald-950 bg-gradient-to-b from-emerald-700 via-emerald-600 to-emerald-800 select-none">
            {/* Pitch Turf Stripes */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(0deg,#ffffff,#ffffff_38px,transparent_38px,transparent_76px)]" />

            {/* Pitch Markings */}
            <div className="absolute inset-3 sm:inset-5 border-2 border-white/45 rounded-xl pointer-events-none">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/45 -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 w-24 h-24 sm:w-32 sm:h-32 border-2 border-white/45 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-white/70 rounded-full -translate-x-1/2 -translate-y-1/2" />

              {/* Top Penalty Area */}
              <div className="absolute top-0 left-1/2 w-40 sm:w-60 h-16 sm:h-22 border-b-2 border-x-2 border-white/45 -translate-x-1/2">
                <div className="absolute top-0 left-1/2 w-20 sm:w-28 h-7 border-b-2 border-x-2 border-white/45 -translate-x-1/2" />
              </div>

              {/* Bottom Penalty Area */}
              <div className="absolute bottom-0 left-1/2 w-40 sm:w-60 h-16 sm:h-22 border-t-2 border-x-2 border-white/45 -translate-x-1/2">
                <div className="absolute bottom-0 left-1/2 w-20 sm:w-28 h-7 border-t-2 border-x-2 border-white/45 -translate-x-1/2" />
              </div>
            </div>

            {/* Player Pins on Pitch */}
            {lineup.slots.map((slot) => {
              const player = slot.assignedPlayer;
              const isSelected = selectedSlotId === slot.id;
              const isCaptain = lineup.captainId === player?.id;
              const isSetPieces = lineup.setPiecesTakerId === player?.id;

              return (
                <div
                  key={slot.id}
                  onClick={() => handleSlotClick(slot)}
                  style={{
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="absolute z-10 cursor-pointer group transition-transform duration-200 hover:scale-110"
                >
                  <div
                    className={`flex flex-col items-center justify-center px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-2xl transition-all shadow-xl backdrop-blur-md ${
                      isSelected
                        ? "bg-amber-400 text-slate-950 ring-4 ring-white scale-110"
                        : "bg-slate-950/90 hover:bg-slate-900 text-white border border-white/25"
                    }`}
                  >
                    {/* Role Pill & Badges */}
                    <div className="flex items-center gap-1 mb-0.5">
                      <span
                        className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-md border ${getRoleBadgeColor(
                          slot.role
                        )}`}
                      >
                        {slot.role}
                      </span>
                      {isCaptain && (
                        <span
                          className="text-[9px] font-black px-1 rounded bg-amber-400 text-slate-950"
                          title="Takım Kaptanı"
                        >
                          K
                        </span>
                      )}
                      {isSetPieces && (
                        <span
                          className="text-[9px] font-black px-1 rounded bg-cyan-400 text-slate-950"
                          title="Duran Top Ustası"
                        >
                          DT
                        </span>
                      )}
                    </div>

                    {/* Player Shirt Number & Surname */}
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[10px] sm:text-xs font-extrabold ${
                          isSelected ? "text-slate-950" : "text-amber-300"
                        }`}
                      >
                        #{player?.shirtNumber || "?"}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold truncate max-w-[64px] sm:max-w-[90px]">
                        {player?.name
                          ? player.name.split(" ").slice(-1)[0]
                          : slot.label}
                      </span>
                    </div>

                    {/* Rating Star */}
                    <div
                      className={`flex items-center gap-0.5 mt-0.5 text-[10px] font-extrabold ${
                        isSelected ? "text-slate-950" : "text-amber-400"
                      }`}
                    >
                      <Star
                        className={`w-2.5 h-2.5 ${
                          isSelected ? "fill-slate-950" : "fill-amber-400"
                        }`}
                      />
                      <span>{slot.rating?.toFixed(1) || "0.0"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Bench, Player Swap & Captain/SetPieces Selector (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Active Slot Detail or Captain/Set-Piece Card */}
          {activeSlot?.assignedPlayer ? (
            <div className="p-4 rounded-3xl border border-amber-500/50 bg-amber-500/10 dark:bg-amber-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">
                    Seçili Mevki: {activeSlot.label} ({activeSlot.role})
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {activeSlot.assignedPlayer.name} ({activeSlot.rating?.toFixed(1)}★)
                  </div>
                </div>
                {onInspectPlayer && (
                  <button
                    onClick={() => onInspectPlayer(activeSlot.assignedPlayer!)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Profil</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Aşağıdaki yedek/rezerv oyunculardan birine tıklayarak{" "}
                <strong>{activeSlot.label}</strong> mevkisine तुरंत yerleştirebilirsiniz:
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Saha İçi Liderler (Kaptan & Duran Top)
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Takım Kaptanı (Tecrübe + Liderlik):</span>
                </label>
                <select
                  value={lineup.captainId || ""}
                  onChange={(e) =>
                    onUpdateCaptainOrSP?.(
                      Number(e.target.value),
                      lineup.setPiecesTakerId
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  {starters.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.shirtNumber || "-"} {p.name} (Tec:{p.experience} / Lid:{p.leadership})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  <Target className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Duran Top Ustası (Frikik & Penaltı):</span>
                </label>
                <select
                  value={lineup.setPiecesTakerId || ""}
                  onChange={(e) =>
                    onUpdateCaptainOrSP?.(
                      lineup.captainId,
                      Number(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  {starters.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.shirtNumber || "-"} {p.name} (Duran Top: {p.skills.setPieces}/20)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Bench & Reserves Swap List */}
          <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  {activeSlot
                    ? `${activeSlot.role} İçin Alternatifler`
                    : "Yedek Kulübesi & Rezervler"}
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">
                {benchPlayers.length} Oyuncu
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
              {benchPlayers.map(({ player, roleScore }) => (
                <div
                  key={player.id}
                  onClick={() => {
                    if (selectedSlotId && onSwapPlayer) {
                      onSwapPlayer(selectedSlotId, player);
                      setSelectedSlotId(null);
                    } else if (onInspectPlayer) {
                      onInspectPlayer(player);
                    }
                  }}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    selectedSlotId
                      ? "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/15"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 hover:border-emerald-500/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-extrabold shrink-0">
                      #{player.shirtNumber || "-"}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {player.name}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {player.bestPosition}
                        </span>
                        <span>•</span>
                        <span>Form: {player.form}/8</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-0.5 text-xs font-extrabold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{roleScore.toFixed(1)}</span>
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {selectedSlotId ? "Oyuna Al" : "Profil"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Automatic Top 5 Penalty Takers & Kupa Strateji Bar */}
      <div className="p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              Otomatik Penaltıcı Sıralaması (Duran Top + Golcülük + Tecrübe + Teknik)
            </h3>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            Kupa & Penaltı Serisi Hazır
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {topPenaltyTakers.map((item, index) => (
            <div
              key={item.player.id}
              onClick={() => onInspectPlayer?.(item.player)}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 hover:border-emerald-500/40 cursor-pointer flex items-center justify-between sm:flex-col sm:items-start gap-1.5"
            >
              <div className="flex items-center gap-2 w-full justify-between">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[10px]">
                  {index + 1}. Penaltıcı
                </span>
                <span className="text-xs font-extrabold text-amber-500">
                  %{item.convPct} Gol
                </span>
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-full">
                {item.player.name}
              </div>
              <div className="text-[10px] text-slate-500">
                DT:{item.player.skills.setPieces} • Gol:{item.player.skills.scorer} • Tec:{item.player.experience}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectorRatingItem({
  label,
  value,
  highlight,
  isMidfield,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  isMidfield?: boolean;
}) {
  const pct = Math.min(100, Math.round((value / 80) * 100));
  return (
    <div
      className={`p-2.5 rounded-2xl text-center border transition-all ${
        isMidfield
          ? "border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-950/40"
          : highlight
          ? "border-blue-500/40 bg-blue-500/10 dark:bg-blue-950/40"
          : "border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40"
      }`}
    >
      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold truncate">
        {label}
      </div>
      <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
        {value}{" "}
        <span className="text-[10px] font-normal text-slate-400">/ 80</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 mt-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full ${
            isMidfield
              ? "bg-emerald-500"
              : highlight
              ? "bg-blue-500"
              : "bg-teal-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
