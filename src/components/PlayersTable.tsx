"use client";

import { useState } from "react";
import { Player, PositionCode } from "@/types/hattrick";
import { Search, Filter, Star, HeartPulse, AlertTriangle, ArrowUpDown } from "lucide-react";

interface PlayersTableProps {
  players: Player[];
  onSelectPlayer?: (player: Player) => void;
}

export function PlayersTable({ players, onSelectPlayer }: PlayersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"rating" | "tsi" | "age" | "form">("rating");

  const filteredPlayers = players
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      if (filterRole === "ALL") return true;
      if (filterRole === "GK") return p.bestPosition === "GK";
      if (filterRole === "DEF") return ["CD", "RB", "LB"].includes(p.bestPosition || "");
      if (filterRole === "MID") return p.bestPosition === "IM";
      if (filterRole === "WING") return ["RW", "LW"].includes(p.bestPosition || "");
      if (filterRole === "FW") return p.bestPosition === "FW";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.positionRating || 0) - (a.positionRating || 0);
      if (sortBy === "tsi") return b.tsi - a.tsi;
      if (sortBy === "age") return a.age - b.age;
      if (sortBy === "form") return b.form - a.form;
      return 0;
    });

  const getPositionBadge = (pos?: PositionCode) => {
    switch (pos) {
      case "GK":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300";
      case "CD":
      case "RB":
      case "LB":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300";
      case "IM":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300";
      case "RW":
      case "LW":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300";
      case "FW":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Oyuncu adı ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Position Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
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
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterRole === item.id
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
          >
            <option value="rating">Mevki Reytingi</option>
            <option value="tsi">TSI Değeri</option>
            <option value="age">Yaş</option>
            <option value="form">Form</option>
          </select>
        </div>
      </div>

      {/* Players Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 font-semibold">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Oyuncu</th>
              <th className="py-3 px-4">Mevki</th>
              <th className="py-3 px-4">Reyting</th>
              <th className="py-3 px-4">Yaş</th>
              <th className="py-3 px-4">TSI</th>
              <th className="py-3 px-4">Form</th>
              <th className="py-3 px-4">Kondisyon</th>
              <th className="py-3 px-4">Özel</th>
              <th className="py-3 px-4">Ana Yetenekler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredPlayers.map((player) => (
              <tr
                key={player.id}
                onClick={() => onSelectPlayer?.(player)}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                {/* Number */}
                <td className="py-3 px-4 font-bold text-slate-400">
                  #{player.shirtNumber || "-"}
                </td>

                {/* Name & Injury */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {player.name}
                    </span>
                    {player.injuryDays > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-300">
                        <HeartPulse className="w-3 h-3" />
                        {player.injuryDays}g
                      </span>
                    )}
                    {player.cards > 0 && (
                      <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-300">
                        {player.cards}🟨
                      </span>
                    )}
                  </div>
                </td>

                {/* Best Position */}
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPositionBadge(
                      player.bestPosition
                    )}`}
                  >
                    {player.bestPosition}
                  </span>
                </td>

                {/* Star Rating */}
                <td className="py-3 px-4 font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{player.positionRating?.toFixed(1) || "-"}</span>
                </td>

                {/* Age */}
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                  {player.age}y {player.ageDays}g
                </td>

                {/* TSI */}
                <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                  {player.tsi.toLocaleString("tr-TR")}
                </td>

                {/* Form */}
                <td className="py-3 px-4">
                  <span
                    className={`font-semibold ${
                      player.form >= 7
                        ? "text-emerald-500 font-bold"
                        : player.form <= 4
                        ? "text-rose-500"
                        : "text-amber-500"
                    }`}
                  >
                    {player.form} / 8
                  </span>
                </td>

                {/* Stamina */}
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                  {player.stamina} / 9
                </td>

                {/* Specialty */}
                <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                  {player.specialty !== "Yok" ? (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                      {player.specialty}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                {/* Skills mini breakdown */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span title="Savunma" className="text-blue-500">
                      Sav:{player.skills.defender}
                    </span>
                    <span title="Oyun Kuruculuk" className="text-emerald-500">
                      OK:{player.skills.playmaker}
                    </span>
                    <span title="Kanat" className="text-purple-500">
                      Kan:{player.skills.winger}
                    </span>
                    <span title="Golcülük" className="text-rose-500">
                      Gol:{player.skills.scorer}
                    </span>
                    <span title="Pas" className="text-amber-500">
                      Pas:{player.skills.passer}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
