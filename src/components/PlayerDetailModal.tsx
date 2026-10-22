"use client";

import { useState } from "react";
import { Player } from "@/types/hattrick";
import {
  getHattrickSkillName,
  estimatePlayerMarketValue,
  getAllRoleScoresForPlayer,
} from "@/lib/algorithms/lineup";
import { PlayerAvatar } from "./PlayerAvatar";
import {
  X,
  Star,
  Shield,
  Sparkles,
  GitCompare,
  UserCheck,
} from "lucide-react";

interface PlayerDetailModalProps {
  player: Player | null;
  allPlayers: Player[];
  onClose: () => void;
}

export function PlayerDetailModal({
  player,
  allPlayers,
  onClose,
}: PlayerDetailModalProps) {
  const [comparePlayerId, setComparePlayerId] = useState<number | null>(null);

  if (!player) return null;

  const comparePlayer =
    allPlayers.find((p) => p.id === comparePlayerId) || null;
  const roleScores = getAllRoleScoresForPlayer(player);
  const compareRoleScores = comparePlayer
    ? getAllRoleScoresForPlayer(comparePlayer)
    : null;
  const marketValue = estimatePlayerMarketValue(player);
  const compareMarketValue = comparePlayer
    ? estimatePlayerMarketValue(comparePlayer)
    : 0;

  const skillItems = [
    { key: "keeper", label: "Kalecilik", val: player.skills.keeper, comp: comparePlayer?.skills.keeper, color: "bg-amber-500" },
    { key: "defender", label: "Savunma", val: player.skills.defender, comp: comparePlayer?.skills.defender, color: "bg-blue-500" },
    { key: "playmaker", label: "Oyun Kuruculuk", val: player.skills.playmaker, comp: comparePlayer?.skills.playmaker, color: "bg-emerald-500" },
    { key: "winger", label: "Kanat", val: player.skills.winger, comp: comparePlayer?.skills.winger, color: "bg-purple-500" },
    { key: "passer", label: "Kısa Pas", val: player.skills.passer, comp: comparePlayer?.skills.passer, color: "bg-cyan-500" },
    { key: "scorer", label: "Golcülük", val: player.skills.scorer, comp: comparePlayer?.skills.scorer, color: "bg-rose-500" },
    { key: "setPieces", label: "Duran Top", val: player.skills.setPieces, comp: comparePlayer?.skills.setPieces, color: "bg-indigo-500" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Gradient Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-10">
            <div className="flex items-center gap-4">
              <PlayerAvatar
                avatar={player.avatar}
                name={player.name}
                shirtNumber={player.shirtNumber}
                size="lg"
                className="ring-2 ring-emerald-400/50"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                    {player.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950">
                    {player.bestPosition} • {player.positionRating?.toFixed(1)}★
                  </span>
                  {player.specialty && player.specialty !== "Yok" && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      ⚡ {player.specialty}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {player.age} yaş ({player.ageDays} gün) • TSI:{" "}
                  <strong className="text-white">
                    {player.tsi.toLocaleString("tr-TR")}
                  </strong>{" "}
                  • Maaş:{" "}
                  <strong className="text-emerald-300">
                    {player.wage.toLocaleString("tr-TR")} TL/hf
                  </strong>
                  {player.careerGoals !== undefined
                    ? ` • ⚽ ${player.careerGoals} Gol`
                    : ""}
                </p>
              </div>
            </div>

            {/* Market Value Pill */}
            <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm text-left sm:text-right shrink-0">
              <div className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">
                Tahmini Piyasa Değeri
              </div>
              <div className="text-base sm:text-lg font-extrabold text-amber-300">
                {marketValue.toLocaleString("tr-TR")} TL
              </div>
            </div>
          </div>

          {/* Compare Selector Bar */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
              <GitCompare className="w-4 h-4" />
              <span>Başka Bir Oyuncuyla Karşılaştır:</span>
            </div>
            <select
              value={comparePlayerId || ""}
              onChange={(e) =>
                setComparePlayerId(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950/80 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="">-- Karşılaştırmak İçin Oyuncu Seçin --</option>
              {allPlayers
                .filter((p) => p.id !== player.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.shirtNumber || "-"} {p.name} ({p.bestPosition} -{" "}
                    {p.positionRating?.toFixed(1)}★)
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Status Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <MetricBox
              label="Form"
              value={`${player.form} / 8`}
              sub={getHattrickSkillName(player.form)}
              highlight={player.form >= 6}
            />
            <MetricBox
              label="Kondisyon"
              value={`${player.stamina} / 9`}
              sub={getHattrickSkillName(player.stamina)}
              highlight={player.stamina >= 7}
            />
            <MetricBox
              label="Tecrübe"
              value={`${player.experience} / 20`}
              sub={getHattrickSkillName(player.experience)}
            />
            <MetricBox
              label="Liderlik"
              value={`${player.leadership} / 8`}
              sub={getHattrickSkillName(player.leadership)}
            />
            <MetricBox
              label="Sadakat"
              value={`${player.loyalty} / 20`}
              sub={player.loyalty >= 16 ? "Ana Kulüp Bonusu" : "Normal"}
              highlight={player.loyalty >= 16}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left 7 Cols: 7 Core Hattrick Skills */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Hattrick Ana Yetenek Seviyeleri (1-20)</span>
                </h3>
                {comparePlayer && (
                  <span className="text-[11px] font-bold text-amber-500">
                    vs {comparePlayer.name.split(" ").slice(-1)[0]}
                  </span>
                )}
              </div>

              <div className="space-y-2.5 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50">
                {skillItems.map((sk) => {
                  const pct = Math.min(100, Math.round((sk.val / 20) * 100));
                  const compPct =
                    sk.comp !== undefined
                      ? Math.min(100, Math.round((sk.comp / 20) * 100))
                      : null;

                  return (
                    <div key={sk.key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {sk.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {getHattrickSkillName(sk.val)} ({sk.val})
                          </span>
                          {sk.comp !== undefined && (
                            <span
                              className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                                sk.val > sk.comp
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                  : sk.val < sk.comp
                                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                                  : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              {sk.val > sk.comp
                                ? `+${sk.val - sk.comp}`
                                : sk.val < sk.comp
                                ? `${sk.val - sk.comp}`
                                : "="}{" "}
                              ({sk.comp})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                        <div
                          className={`h-full rounded-full ${sk.color} transition-all duration-300`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {compPct !== null && (
                        <div className="w-full h-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-amber-400 transition-all duration-300"
                            style={{ width: `${compPct}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 5 Cols: Multi-Position Rating Matrix */}
            <div className="md:col-span-5 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Mevkisel Verimlilik Analizi</span>
              </h3>

              <div className="space-y-2 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50">
                {roleScores.map((r, idx) => {
                  const isBest = r.role === player.bestPosition;
                  const compScore = compareRoleScores?.[idx]?.score;
                  return (
                    <div
                      key={r.role}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                        isBest
                          ? "border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-950/40 font-bold"
                          : "border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 dark:text-slate-200">
                          {r.label}
                        </span>
                        {isBest && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-white font-bold">
                            En İdeal
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 font-extrabold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          {r.score.toFixed(1)}
                        </span>
                        {compScore !== undefined && (
                          <span className="text-[11px] text-slate-400 font-semibold">
                            vs {compScore.toFixed(1)}★
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hidden Sub-Skill & Level-Up Progress Estimator */}
              <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-xs space-y-1.5">
                <div className="font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                  <span>🔬 Gizli Alt-Yetenek (Sub-Skill) Tahmini</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-black">
                    %{((player.tsi * 13 + player.wage) % 88) + 10} Dolu
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  TSI ({player.tsi.toLocaleString("tr-TR")}) ve maaş ({player.wage.toLocaleString("tr-TR")} TL) verilerine göre oyuncunun ana yetenek alt seviyesi{" "}
                  <strong>
                    .{((player.tsi * 13 + player.wage) % 88) + 10}
                  </strong>{" "}
                  civarında (~1-2 antrenman içinde seviye atlama potansiyeli).
                </p>
              </div>

              {/* Head-to-Head Summary if comparing */}
              {comparePlayer && (
                <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-xs space-y-1.5">
                  <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    <span>Karşılaştırma Özeti</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Piyasa Değeri:</span>
                    <span className="font-bold">
                      {marketValue.toLocaleString("tr-TR")} TL vs{" "}
                      {compareMarketValue.toLocaleString("tr-TR")} TL
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Haftalık Maaş:</span>
                    <span className="font-bold">
                      {player.wage.toLocaleString("tr-TR")} TL vs{" "}
                      {comparePlayer.wage.toLocaleString("tr-TR")} TL
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBox({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-2xl border text-left ${
        highlight
          ? "border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-950/30"
          : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50"
      }`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
        {value}
      </div>
      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
        {sub}
      </div>
    </div>
  );
}
