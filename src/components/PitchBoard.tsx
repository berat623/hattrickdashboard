"use client";

import { TacticalLineup, FormationSlot, Player } from "@/types/hattrick";
import { Star, Shield, Zap, Sparkles } from "lucide-react";

interface PitchBoardProps {
  lineup: TacticalLineup;
  onSelectSlot?: (slot: FormationSlot) => void;
  selectedPlayerId?: number;
}

export function PitchBoard({ lineup, onSelectSlot, selectedPlayerId }: PitchBoardProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "GK":
        return "bg-amber-500 text-slate-950 font-bold border-amber-300";
      case "CD":
      case "RB":
      case "LB":
        return "bg-blue-600 text-white font-bold border-blue-400";
      case "IM":
        return "bg-emerald-600 text-white font-bold border-emerald-400";
      case "RW":
      case "LW":
        return "bg-purple-600 text-white font-bold border-purple-400";
      case "FW":
        return "bg-rose-600 text-white font-bold border-rose-400";
      default:
        return "bg-slate-600 text-white font-bold border-slate-400";
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Sector Ratings Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <SectorRatingItem label="Sol Defans" value={lineup.sectorRatings.leftDef} />
        <SectorRatingItem label="Merkez Defans" value={lineup.sectorRatings.midDef} highlight />
        <SectorRatingItem label="Sağ Defans" value={lineup.sectorRatings.rightDef} />
        <SectorRatingItem label="Orta Saha" value={lineup.sectorRatings.midfield} isMidfield />
        <SectorRatingItem label="Sol Forvet" value={lineup.sectorRatings.leftAtt} />
        <SectorRatingItem label="Merkez Forvet" value={lineup.sectorRatings.midAtt} highlight />
        <SectorRatingItem label="Sağ Forvet" value={lineup.sectorRatings.rightAtt} />
      </div>

      {/* 2D Football Pitch */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[4/4.5] md:aspect-[16/11] rounded-2xl overflow-hidden shadow-xl border-4 border-emerald-800 dark:border-emerald-950 bg-gradient-to-b from-emerald-700 via-emerald-600 to-emerald-800 select-none">
        {/* Pitch Turf Stripes */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(0deg,#ffffff,#ffffff_40px,transparent_40px,transparent_80px)]" />

        {/* Pitch Markings (White lines) */}
        <div className="absolute inset-4 sm:inset-6 border-2 border-white/40 rounded pointer-events-none">
          {/* Halfway Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/40 -translate-y-1/2" />
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 w-28 h-28 sm:w-36 sm:h-36 border-2 border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/60 rounded-full -translate-x-1/2 -translate-y-1/2" />

          {/* Top Penalty Area (Opponent Box) */}
          <div className="absolute top-0 left-1/2 w-48 sm:w-64 h-20 sm:h-24 border-b-2 border-x-2 border-white/40 -translate-x-1/2">
            <div className="absolute top-0 left-1/2 w-24 sm:w-32 h-8 border-b-2 border-x-2 border-white/40 -translate-x-1/2" />
          </div>

          {/* Bottom Penalty Area (Our Box) */}
          <div className="absolute bottom-0 left-1/2 w-48 sm:w-64 h-20 sm:h-24 border-t-2 border-x-2 border-white/40 -translate-x-1/2">
            <div className="absolute bottom-0 left-1/2 w-24 sm:w-32 h-8 border-t-2 border-x-2 border-white/40 -translate-x-1/2" />
          </div>
        </div>

        {/* Player Pins on Pitch */}
        {lineup.slots.map((slot) => {
          const player = slot.assignedPlayer;
          const isSelected = selectedPlayerId === player?.id;
          const isCaptain = lineup.captainId === player?.id;
          const isSetPieces = lineup.setPiecesTakerId === player?.id;

          return (
            <div
              key={slot.id}
              onClick={() => onSelectSlot?.(slot)}
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute z-10 cursor-pointer group transition-transform duration-200 hover:scale-110"
            >
              <div
                className={`flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-xl transition-all shadow-lg backdrop-blur-sm ${
                  isSelected
                    ? "bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-105"
                    : "bg-slate-900/85 hover:bg-slate-900 text-white border border-white/20"
                }`}
              >
                {/* Role Pill & Badges */}
                <div className="flex items-center gap-1 mb-0.5">
                  <span
                    className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-md border shadow-sm ${getRoleBadgeColor(
                      slot.role
                    )}`}
                  >
                    {slot.role}
                  </span>
                  {isCaptain && (
                    <span className="text-[9px] font-black px-1 rounded bg-amber-400 text-black" title="Kaptan">
                      K
                    </span>
                  )}
                  {isSetPieces && (
                    <span className="text-[9px] font-black px-1 rounded bg-indigo-400 text-black" title="Duran Top">
                      DT
                    </span>
                  )}
                </div>

                {/* Player Shirt Number & Name */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] sm:text-xs font-bold text-amber-300">
                    #{player?.shirtNumber || "?"}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold truncate max-w-[70px] sm:max-w-[85px]">
                    {player?.name ? player.name.split(" ").slice(-1)[0] : slot.label}
                  </span>
                </div>

                {/* Rating Bar */}
                <div className="flex items-center gap-0.5 mt-0.5 text-[10px] text-amber-400 font-bold">
                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                  <span>{slot.rating?.toFixed(1) || "0.0"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Substitutes Bench */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Yedek Kulübesi (5 Oyuncu)
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Otomatik rol eşleştirmeli
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {lineup.substitutes.map((sub, index) => {
            const roleLabels: Record<string, string> = {
              SUB_GK: "Yedek Kaleci",
              SUB_DEF: "Yedek Defans",
              SUB_MID: "Yedek Orta Saha",
              SUB_WING: "Yedek Kanat",
              SUB_FW: "Yedek Forvet",
            };
            return (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                  #{sub.player?.shirtNumber || index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {sub.player?.name || "Boş"}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {roleLabels[sub.slot] || "Yedek"} • {sub.player?.bestPosition || "-"}
                  </div>
                </div>
              </div>
            );
          })}
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
  return (
    <div
      className={`p-2 rounded-lg text-center border transition-all ${
        isMidfield
          ? "border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-950/40"
          : highlight
          ? "border-blue-500/40 bg-blue-500/10 dark:bg-blue-950/40"
          : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
      }`}
    >
      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
        {label}
      </div>
      <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
        {value} <span className="text-[10px] font-normal text-slate-400">/ 80</span>
      </div>
    </div>
  );
}
