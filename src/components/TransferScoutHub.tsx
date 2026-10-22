"use client";

import { Player, TeamDetails } from "@/types/hattrick";
import { estimatePlayerMarketValue, getHattrickSkillName } from "@/lib/algorithms/lineup";
import {
  Compass,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Shield,
  Users,
  Star,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

interface TransferScoutHubProps {
  players: Player[];
  team: TeamDetails | null;
  onSelectPlayer?: (player: Player) => void;
}

export function TransferScoutHub({
  players,
  team,
  onSelectPlayer,
}: TransferScoutHubProps) {
  const sectors = [
    {
      id: "GK",
      label: "Kaleci Hattı",
      roles: ["GK"],
      targetCount: 2,
      primarySkill: "Kalecilik",
      secondarySkill: "Savunma & Duran Top",
      recommendedSpecialty: "Yok / Lider",
    },
    {
      id: "DEF",
      label: "Savunma Hattı (Stoper & Bek)",
      roles: ["CD", "RB", "LB"],
      targetCount: 5,
      primarySkill: "Savunma",
      secondarySkill: "Oyun Kuruculuk & Kanat",
      recommendedSpecialty: "Kafa / Güçlü / Hızlı",
    },
    {
      id: "MID",
      label: "Merkez Orta Saha (İç Saha)",
      roles: ["IM"],
      targetCount: 5,
      primarySkill: "Oyun Kuruculuk",
      secondarySkill: "Kısa Pas & Savunma",
      recommendedSpecialty: "Kafa / Dayanıklı",
    },
    {
      id: "WING",
      label: "Kanat Oyuncuları",
      roles: ["RW", "LW"],
      targetCount: 3,
      primarySkill: "Kanat",
      secondarySkill: "Oyun Kuruculuk & Kısa Pas",
      recommendedSpecialty: "Hızlı / Öngörülemez",
    },
    {
      id: "FW",
      label: "Hücum & Forvet Hattı",
      roles: ["FW"],
      targetCount: 4,
      primarySkill: "Golcülük",
      secondarySkill: "Kısa Pas & Kanat",
      recommendedSpecialty: "Hızlı / Kafa / Teknik",
    },
  ];

  const sectorStats = sectors.map((sec) => {
    const group = players.filter((p) =>
      sec.roles.includes(p.bestPosition || "")
    );
    const sorted = [...group].sort(
      (a, b) => (b.positionRating || 0) - (a.positionRating || 0)
    );
    const topPlayers = sorted.slice(0, Math.min(3, sorted.length));
    const avgRating =
      topPlayers.length > 0
        ? Math.round(
            (topPlayers.reduce((s, p) => s + (p.positionRating || 0), 0) /
              topPlayers.length) *
              10
          ) / 10
        : 0;
    const avgAge =
      group.length > 0
        ? Math.round(
            (group.reduce((s, p) => s + p.age, 0) / group.length) * 10
          ) / 10
        : 0;

    return {
      ...sec,
      count: group.length,
      avgRating,
      avgAge,
      bestPlayer: sorted[0] || null,
    };
  });

  // Weakest sector needing reinforcement
  const weakestSector = [...sectorStats].sort(
    (a, b) => a.avgRating - b.avgRating
  )[0];

  // Veterans or replacement candidates (Age >= 29 or low form/high wage)
  const sellCandidates = [...players]
    .filter((p) => p.age >= 29 || (p.form <= 4 && p.wage > 15000))
    .sort((a, b) => b.age - a.age)
    .slice(0, 6);

  // Young academy/trainee prospects (Age <= 21)
  const youngStars = [...players]
    .filter((p) => p.age <= 21)
    .sort((a, b) => (b.positionRating || 0) - (a.positionRating || 0))
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* AI Scout Priority Banner */}
      <div className="p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Compass className="w-3.5 h-3.5" />
              <span>AI Transfer Gözlemci Raporu</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              En Acil Takviye Bölgesi:{" "}
              <span className="text-emerald-400">
                {weakestSector?.label || "Orta Saha"}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Kadronuzdaki mevkisel yıldız ortalamalarına göre{" "}
              <strong>{weakestSector?.label}</strong> hattınız ({weakestSector?.avgRating}★ ortalama){" "}
              diğer bölgelerin gerisinde kalıyor. Önerilen transfer kriterleri aşağıda hazırlandı.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm shrink-0 text-left sm:text-right">
            <div className="text-[11px] text-slate-300 font-medium">
              Transfer Bütçesi (Kasa)
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-400">
              {(team?.cash || 0).toLocaleString("tr-TR")} TL
            </div>
            <div className="text-[11px] text-amber-300 font-semibold mt-0.5">
              Önerilen Ana Yetenek: {weakestSector?.primarySkill} (10-13)
            </div>
          </div>
        </div>
      </div>

      {/* 5 Sector Depth Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {sectorStats.map((sec) => {
          const isWeakest = sec.id === weakestSector?.id;
          return (
            <div
              key={sec.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 shadow-sm ${
                isWeakest
                  ? "border-amber-500/60 bg-amber-500/5 dark:bg-amber-950/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {sec.label}
                  </span>
                  {isWeakest && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                      Takviye Şart
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl font-extrabold text-amber-500 flex items-center gap-1">
                    <Star className="w-5 h-5 fill-amber-500" />
                    {sec.avgRating}
                  </span>
                  <span className="text-xs text-slate-400">Ort. Reyting</span>
                </div>

                <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Oyuncu Sayısı:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {sec.count} / {sec.targetCount}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Yaş Ortalaması:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {sec.avgAge}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                <div className="text-slate-400">İdeal Uzmanlık:</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 truncate">
                  ⚡ {sec.recommendedSpecialty}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom 2 Columns: Young Prospects vs Aging/Sell Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Young Stars (Trainees) */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Geleceğin Yıldızları (21 Yaş Altı Potansiyeller)
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {youngStars.length} Genç
            </span>
          </div>

          {youngStars.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              Kadronuzda 21 yaş altı genç oyuncu bulunmuyor. Antrenman verimi için 17-19 yaş arası genç yetenek transfer etmeniz önerilir.
            </p>
          ) : (
            <div className="space-y-2.5">
              {youngStars.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectPlayer?.(p)}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 hover:border-emerald-500/50 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{p.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        {p.bestPosition}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {p.age}y {p.ageDays}g • TSI: {p.tsi.toLocaleString("tr-TR")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      {estimatePlayerMarketValue(p).toLocaleString("tr-TR")} TL
                    </div>
                    <div className="text-[10px] text-amber-500 font-bold">
                      ★ {p.positionRating?.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sell / Replace Candidates */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Yenilenme / Satış Adayları (Yaş & Maaş Analizi)
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-500">
              {sellCandidates.length} Oyuncu
            </span>
          </div>

          {sellCandidates.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              Kadronuzun yaş ve maaş dengesi oldukça sağlıklı görünüyor.
            </p>
          ) : (
            <div className="space-y-2.5">
              {sellCandidates.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectPlayer?.(p)}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 hover:border-amber-500/50 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{p.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        {p.age} Yaş
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Maaş: {p.wage.toLocaleString("tr-TR")} TL/hf • Form: {p.form}/8
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                      ~{estimatePlayerMarketValue(p).toLocaleString("tr-TR")} TL
                    </div>
                    <div className="text-[10px] text-rose-500 font-semibold">
                      Düşen Kondisyon Riski
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
