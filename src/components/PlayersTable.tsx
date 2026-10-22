"use client";

import { useState } from "react";
import { Player, PositionCode } from "@/types/hattrick";
import {
  estimatePlayerMarketValue,
} from "@/lib/algorithms/lineup";
import { PlayerAvatar } from "./PlayerAvatar";
import {
  Search,
  Star,
  HeartPulse,
  ArrowUpDown,
  GitCompare,
  Sparkles,
  Users,
} from "lucide-react";

interface PlayersTableProps {
  players: Player[];
  onSelectPlayer?: (player: Player) => void;
}

export function PlayersTable({ players, onSelectPlayer }: PlayersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<
    "rating" | "tsi" | "value" | "wage" | "age" | "form"
  >("rating");

  const filteredPlayers = players
    .filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      if (filterRole === "ALL") return true;
      if (filterRole === "GK") return p.bestPosition === "GK";
      if (filterRole === "DEF")
        return ["CD", "RB", "LB"].includes(p.bestPosition || "");
      if (filterRole === "MID") return p.bestPosition === "IM";
      if (filterRole === "WING")
        return ["RW", "LW"].includes(p.bestPosition || "");
      if (filterRole === "FW") return p.bestPosition === "FW";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating")
        return (b.positionRating || 0) - (a.positionRating || 0);
      if (sortBy === "tsi") return b.tsi - a.tsi;
      if (sortBy === "value")
        return estimatePlayerMarketValue(b) - estimatePlayerMarketValue(a);
      if (sortBy === "wage") return b.wage - a.wage;
      if (sortBy === "age") return a.age - b.age || a.ageDays - b.ageDays;
      if (sortBy === "form") return b.form - a.form;
      return 0;
    });

  const getPositionBadge = (pos?: PositionCode) => {
    switch (pos) {
      case "GK":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/40";
      case "CD":
      case "RB":
      case "LB":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-400/40";
      case "IM":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/40";
      case "RW":
      case "LW":
        return "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-400/40";
      case "FW":
        return "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400/40";
      default:
        return "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-400/40";
    }
  };

  const totalTSI = filteredPlayers.reduce((s, p) => s + p.tsi, 0);
  const avgAge =
    filteredPlayers.length > 0
      ? (
          filteredPlayers.reduce((s, p) => s + p.age, 0) /
          filteredPlayers.length
        ).toFixed(1)
      : "0";

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Quick Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400">
              Listelenen Kadro
            </div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {filteredPlayers.length} Oyuncu
            </div>
          </div>
          <Users className="w-5 h-5 text-emerald-500" />
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400">
              Toplam TSI Gücü
            </div>
            <div className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              {totalTSI.toLocaleString("tr-TR")}
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400">
              Yaş Ortalaması
            </div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {avgAge} Yaş
            </div>
          </div>
          <Star className="w-5 h-5 text-blue-500" />
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400">
              Detay & Kıyaslama
            </div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              Oyuncuya Tıklayın
            </div>
          </div>
          <GitCompare className="w-5 h-5 text-purple-500" />
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Oyuncu adı ile filtrele..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Position Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: "ALL", label: "Tümü" },
            { id: "GK", label: "Kaleci" },
            { id: "DEF", label: "Defans" },
            { id: "MID", label: "Orta Saha" },
            { id: "WING", label: "Kanat" },
            { id: "FW", label: "Forvet" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterRole(item.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterRole === item.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white cursor-pointer"
          >
            <option value="rating">Sırala: Mevki Reytingi (★)</option>
            <option value="value">Sırala: Piyasa Değeri (TL)</option>
            <option value="tsi">Sırala: TSI Gücü</option>
            <option value="wage">Sırala: Haftalık Maaş</option>
            <option value="age">Sırala: En Gençten Yaşlıya</option>
            <option value="form">Sırala: Form Durumu</option>
          </select>
        </div>
      </div>

      {/* =================================================================
          1. DESKTOP FULL TABLE VIEW (hidden on phones, visible md and up)
         ================================================================= */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">#</th>
              <th className="py-3.5 px-4">Oyuncu</th>
              <th className="py-3.5 px-4">Mevki</th>
              <th className="py-3.5 px-4">Reyting</th>
              <th className="py-3.5 px-4">Yaş</th>
              <th className="py-3.5 px-4">TSI / Değer</th>
              <th className="py-3.5 px-4">Form / Kond.</th>
              <th className="py-3.5 px-4">Ana Yetenekler</th>
              <th className="py-3.5 px-4 text-right">Analiz</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredPlayers.map((player) => {
              const estVal = estimatePlayerMarketValue(player);
              return (
                <tr
                  key={player.id}
                  onClick={() => onSelectPlayer?.(player)}
                  className="hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-extrabold text-slate-400">
                    #{player.shirtNumber || "-"}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <PlayerAvatar
                        avatar={player.avatar}
                        name={player.name}
                        shirtNumber={player.shirtNumber}
                        size="xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {player.name}
                          </span>
                          {player.specialty && player.specialty !== "Yok" && (
                            <span className="px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                              ⚡ {player.specialty}
                            </span>
                          )}
                          {player.injuryDays > 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-300">
                              <HeartPulse className="w-3 h-3" />
                              {player.injuryDays}h
                            </span>
                          )}
                          {player.cards > 0 && (
                            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-300">
                              {player.cards}🟨
                            </span>
                          )}
                        </div>
                        {(player.careerGoals || 0) > 0 && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            ⚽ {player.careerGoals} Kariyer Golü
                            {player.careerHattricks
                              ? ` • 🎩 ${player.careerHattricks} Hattrick`
                              : ""}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold border ${getPositionBadge(
                        player.bestPosition
                      )}`}
                    >
                      {player.bestPosition}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="inline-flex items-center gap-1 font-extrabold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{player.positionRating?.toFixed(1) || "-"}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">
                    {player.age}y{" "}
                    <span className="text-slate-400 text-[11px]">
                      {player.ageDays}g
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {player.tsi.toLocaleString("tr-TR")} TSI
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      ~{estVal.toLocaleString("tr-TR")} TL
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          player.form >= 6
                            ? "text-emerald-500"
                            : player.form <= 4
                            ? "text-rose-500"
                            : "text-amber-500"
                        }`}
                      >
                        F:{player.form}/8
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        K:{player.stamina}/9
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        Sav:{player.skills.defender}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        OK:{player.skills.playmaker}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        Kan:{player.skills.winger}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
                        Gol:{player.skills.scorer}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        Pas:{player.skills.passer}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlayer?.(player);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      İncele & Kıyasla
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* =================================================================
          2. MOBILE TOUCH PLAYER CARDS VIEW (visible on phones < md)
         ================================================================= */}
      <div className="md:hidden grid grid-cols-1 gap-3">
        {filteredPlayers.map((player) => {
          const estVal = estimatePlayerMarketValue(player);
          return (
            <div
              key={player.id}
              onClick={() => onSelectPlayer?.(player)}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm active:scale-[0.99] transition-all flex flex-col gap-3"
            >
              {/* Top Row: Avatar, Name, Position, Star Rating */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <PlayerAvatar
                    avatar={player.avatar}
                    name={player.name}
                    shirtNumber={player.shirtNumber}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {player.name}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      <span>
                        {player.age}y {player.ageDays}g
                      </span>
                      <span>•</span>
                      <span>{player.tsi.toLocaleString("tr-TR")} TSI</span>
                      {player.specialty && player.specialty !== "Yok" && (
                        <span className="text-amber-500 font-bold">
                          • ⚡ {player.specialty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-500 font-extrabold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{player.positionRating?.toFixed(1)}</span>
                  </div>
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-bold border ${getPositionBadge(
                      player.bestPosition
                    )}`}
                  >
                    {player.bestPosition}
                  </span>
                </div>
              </div>

              {/* Middle Row: Key Skills Grid */}
              <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center text-[10px]">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                  <div className="text-[9px] opacity-75">SAV</div>
                  <div>{player.skills.defender}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                  <div className="text-[9px] opacity-75">OK</div>
                  <div>{player.skills.playmaker}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
                  <div className="text-[9px] opacity-75">KAN</div>
                  <div>{player.skills.winger}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                  <div className="text-[9px] opacity-75">PAS</div>
                  <div>{player.skills.passer}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
                  <div className="text-[9px] opacity-75">GOL</div>
                  <div>{player.skills.scorer}</div>
                </div>
              </div>

              {/* Bottom Row: Form, Stamina, Value & Action */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <div className="flex items-center gap-2 text-slate-500">
                  <span>
                    Form: <strong className="text-slate-800 dark:text-slate-200">{player.form}/8</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Kond: <strong className="text-slate-800 dark:text-slate-200">{player.stamina}/9</strong>
                  </span>
                </div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  ~{estVal.toLocaleString("tr-TR")} TL →
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
