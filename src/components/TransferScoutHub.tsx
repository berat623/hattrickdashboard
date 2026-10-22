"use client";

import { useState, useMemo } from "react";
import { Player, PositionCode, TeamDetails } from "@/types/hattrick";
import {
  estimatePlayerMarketValue,
  getHattrickSkillName,
  getPlayerScoreForRole,
} from "@/lib/algorithms/lineup";
import {
  Compass,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Star,
  Brain,
  Calculator,
  CheckCircle2,
  Coins,
  UserPlus,
  Flame,
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
      role: "GK" as PositionCode,
      label: "Kaleci Hattı",
      roles: ["GK"],
      targetCount: 2,
      primarySkill: "Kalecilik",
      secondarySkill: "Savunma & Duran Top",
      recommendedSpecialty: "Lider / Yok",
    },
    {
      id: "DEF",
      role: "CD" as PositionCode,
      label: "Savunma Hattı",
      roles: ["CD", "RB", "LB"],
      targetCount: 5,
      primarySkill: "Savunma",
      secondarySkill: "Oyun Kuruculuk & Kanat",
      recommendedSpecialty: "Kafa / Güçlü / Hızlı",
    },
    {
      id: "MID",
      role: "IM" as PositionCode,
      label: "Merkez Orta Saha",
      roles: ["IM"],
      targetCount: 5,
      primarySkill: "Oyun Kuruculuk",
      secondarySkill: "Kısa Pas & Savunma",
      recommendedSpecialty: "Kafa / Güçlü",
    },
    {
      id: "WING",
      role: "RW" as PositionCode,
      label: "Kanat Hattı",
      roles: ["RW", "LW"],
      targetCount: 3,
      primarySkill: "Kanat",
      secondarySkill: "Oyun Kuruculuk & Pas",
      recommendedSpecialty: "Hızlı / Öngörülemez",
    },
    {
      id: "FW",
      role: "FW" as PositionCode,
      label: "Forvet Hattı",
      roles: ["FW"],
      targetCount: 4,
      primarySkill: "Golcülük",
      secondarySkill: "Kısa Pas & Kanat",
      recommendedSpecialty: "Hızlı / Kafa / Teknik",
    },
  ];

  const sectorStats = useMemo(
    () =>
      sectors.map((sec) => {
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
          weakestStarter: sorted[Math.min(1, sorted.length - 1)] || null,
        };
      }),
    [players]
  );

  const weakestSector = useMemo(
    () => [...sectorStats].sort((a, b) => a.avgRating - b.avgRating)[0],
    [sectorStats]
  );

  // =========================================================================
  // PRO AI TRANSFER & BARGAIN SIMULATOR STATE
  // =========================================================================
  const [targetRole, setTargetRole] = useState<PositionCode>(
    weakestSector?.role || "IM"
  );
  const [targetAge, setTargetAge] = useState<number>(21);
  const [targetPrimary, setTargetPrimary] = useState<number>(11); // Muhteşem (11)
  const [targetSecondary, setTargetSecondary] = useState<number>(8); // Mükemmel (8)
  const [targetSpecialty, setTargetSpecialty] = useState<string>("Hızlı");
  const [askingPrice, setAskingPrice] = useState<number>(12500000);

  // Build synthetic Player for the simulated transfer target
  const simulatedTargetPlayer: Player = useMemo(() => {
    const skills = {
      keeper: targetRole === "GK" ? targetPrimary : 2,
      defender:
        targetRole === "CD" || targetRole === "RB"
          ? targetPrimary
          : targetRole === "IM" || targetRole === "GK"
          ? targetSecondary
          : 4,
      playmaker:
        targetRole === "IM"
          ? targetPrimary
          : targetRole === "CD" || targetRole === "RW"
          ? targetSecondary
          : 5,
      winger:
        targetRole === "RW"
          ? targetPrimary
          : targetRole === "RB" || targetRole === "FW"
          ? targetSecondary
          : 4,
      passer:
        targetRole === "IM" || targetRole === "FW" || targetRole === "RW"
          ? targetSecondary
          : 5,
      scorer: targetRole === "FW" ? targetPrimary : 4,
      setPieces: Math.max(6, targetSecondary),
    };
    const estTsi = Math.round(
      Math.pow(targetPrimary, 3.2) * 4.5 + Math.pow(targetSecondary, 2.6) * 2
    );
    const estWage = Math.round(Math.pow(targetPrimary, 3.4) * 5.2 + 4500);

    const p: Player = {
      id: 999999,
      name: "Simüle Edilen Transfer Adayı",
      age: targetAge,
      ageDays: 25,
      tsi: estTsi,
      wage: estWage,
      form: 7,
      stamina: 8,
      experience: Math.max(3, Math.round((targetAge - 17) * 1.1)),
      leadership: 5,
      loyalty: 8,
      specialty: targetSpecialty,
      injuryDays: 0,
      cards: 0,
      skills,
      bestPosition: targetRole,
    };
    p.positionRating = getPlayerScoreForRole(p, targetRole);
    return p;
  }, [targetRole, targetAge, targetPrimary, targetSecondary, targetSpecialty]);

  const fairMarketValue = estimatePlayerMarketValue(simulatedTargetPlayer);
  const priceDiffPct =
    fairMarketValue > 0
      ? Math.round(((askingPrice - fairMarketValue) / fairMarketValue) * 100)
      : 0;

  // Compare against current squad player in that role
  const currentRolePlayers = players
    .filter((p) => p.injuryDays === 0)
    .map((p) => ({
      player: p,
      score: getPlayerScoreForRole(p, targetRole),
    }))
    .sort((a, b) => b.score - a.score);

  const playerToReplace =
    currentRolePlayers[Math.min(1, Math.max(0, currentRolePlayers.length - 1))] ||
    currentRolePlayers[0];

  const ratingGain =
    Math.round(
      ((simulatedTargetPlayer.positionRating || 0) -
        (playerToReplace?.score || 0)) *
        10
    ) / 10;
  const winProbBoost = Math.max(
    0,
    Math.min(24, Math.round(ratingGain * 3.4 * 10) / 10)
  );

  // 1 Season (16 Weeks) ROI projection
  const nextSeasonPlayer: Player = {
    ...simulatedTargetPlayer,
    age: targetAge + 1,
    skills: {
      ...simulatedTargetPlayer.skills,
      playmaker:
        targetRole === "IM"
          ? Math.min(20, targetPrimary + 2)
          : simulatedTargetPlayer.skills.playmaker,
      scorer:
        targetRole === "FW"
          ? Math.min(20, targetPrimary + 2)
          : simulatedTargetPlayer.skills.scorer,
      defender:
        targetRole === "CD"
          ? Math.min(20, targetPrimary + 2)
          : simulatedTargetPlayer.skills.defender,
      winger:
        targetRole === "RW"
          ? Math.min(20, targetPrimary + 2)
          : simulatedTargetPlayer.skills.winger,
      keeper:
        targetRole === "GK"
          ? Math.min(20, targetPrimary + 2)
          : simulatedTargetPlayer.skills.keeper,
    },
    tsi: Math.round(simulatedTargetPlayer.tsi * 1.45),
  };
  const nextSeasonValue = estimatePlayerMarketValue(nextSeasonPlayer);
  const seasonWages = simulatedTargetPlayer.wage * 16;
  const netSeasonROI = nextSeasonValue - askingPrice - seasonWages;

  // Veterans / Sell Candidates
  const sellCandidates = [...players]
    .filter((p) => p.age >= 29 || (p.form <= 4 && p.wage > 15000))
    .sort((a, b) => b.age - a.age)
    .slice(0, 5);

  const youngStars = [...players]
    .filter((p) => p.age <= 21)
    .sort((a, b) => (b.positionRating || 0) - (a.positionRating || 0))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top AI Scout Executive Banner */}
      <div className="p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-400 text-slate-950">
              <Brain className="w-3.5 h-3.5" />
              <span>PRO YAPAY ZEKA TRANSFER & PAZARLIK MOTORU</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Öncelikli Takviye Bölgesi:{" "}
              <span className="text-emerald-400">
                {weakestSector?.label || "Merkez Orta Saha"}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Yapay zeka kadronuzdaki tüm mevkileri taradı.{" "}
              <strong>{weakestSector?.label}</strong> hattınız ({weakestSector?.avgRating}★)
              takviye edildiğinde maç kazanma oranınız en yüksek sıçramayı yapacak.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm shrink-0 text-left sm:text-right">
            <div className="text-[11px] text-slate-300 font-semibold">
              Kullanılabilir Transfer Bütçesi
            </div>
            <div className="text-xl font-black text-emerald-400">
              {(team?.cash || 0).toLocaleString("tr-TR")} TL
            </div>
            <div className="text-[11px] text-amber-300 font-bold mt-0.5">
              Önerilen Hedef: {weakestSector?.primarySkill} ({getHattrickSkillName(11)})
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          PRO AI TRANSFER & BARGAIN SIMULATOR ("ALIRSAM NE OLUR?")
         ===================================================================== */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                AI Transfer Pazarlık & Kadro Etki Simülatörü (&ldquo;Alırsam Ne Olur?&rdquo;)
              </h3>
              <p className="text-xs text-slate-500">
                Pazardaki bir oyuncunun özelliklerini ve fiyatını girin; gerçek değerini, kelepir olup olmadığını ve takımınıza etkisini görün
              </p>
            </div>
          </div>

          {/* Quick Preset Target Blueprints */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { label: "18y Genç Yetenek", role: "IM" as PositionCode, age: 18, pri: 8, sec: 6, price: 3200000 },
              { label: "22y Yıldız OS", role: "IM" as PositionCode, age: 22, pri: 12, sec: 9, price: 18500000 },
              { label: "24y Elit Golcü", role: "FW" as PositionCode, age: 24, pri: 13, sec: 9, price: 24000000 },
              { label: "25y Duvar Stoper", role: "CD" as PositionCode, age: 25, pri: 12, sec: 8, price: 14500000 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setTargetRole(preset.role);
                  setTargetAge(preset.age);
                  setTargetPrimary(preset.pri);
                  setTargetSecondary(preset.sec);
                  setAskingPrice(preset.price);
                }}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 6 Cols: Target Player Input Controls */}
          <div className="lg:col-span-6 space-y-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Hedef Mevki:
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as PositionCode)}
                  className="w-full px-3 py-2 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <option value="GK">Kaleci (GK)</option>
                  <option value="CD">Stoper / Defans (CD)</option>
                  <option value="RB">Kanat Bek (RB/LB)</option>
                  <option value="IM">İç Saha / Orta Saha (IM)</option>
                  <option value="RW">Kanat (RW/LW)</option>
                  <option value="FW">Forvet (FW)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Uzmanlık (Specialty):
                </label>
                <select
                  value={targetSpecialty}
                  onChange={(e) => setTargetSpecialty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <option value="Hızlı">⚡ Hızlı (Quick)</option>
                  <option value="Kafa">🎯 Kafa (Head)</option>
                  <option value="Teknik">🪄 Teknik (Technical)</option>
                  <option value="Güçlü">💪 Güçlü (Powerful)</option>
                  <option value="Öngörülemez">🎲 Öngörülemez</option>
                  <option value="Yok">Standart (Uzmanlık Yok)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Oyuncu Yaşı:</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {targetAge} Yaş
                </span>
              </div>
              <input
                type="range"
                min={17}
                max={33}
                value={targetAge}
                onChange={(e) => setTargetAge(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Ana Yetenek Seviyesi (1-20):</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {getHattrickSkillName(targetPrimary)} ({targetPrimary})
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={18}
                value={targetPrimary}
                onChange={(e) => setTargetPrimary(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Yan Yetenek (Pas / Savunma / OK):</span>
                <span className="text-blue-500">
                  {getHattrickSkillName(targetSecondary)} ({targetSecondary})
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={15}
                value={targetSecondary}
                onChange={(e) => setTargetSecondary(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Pazarda İstenen Bonservis Fiyatı (TL):</span>
                <span className="text-amber-500 font-extrabold">
                  {askingPrice.toLocaleString("tr-TR")} TL
                </span>
              </div>
              <input
                type="range"
                min={500000}
                max={60000000}
                step={500000}
                value={askingPrice}
                onChange={(e) => setAskingPrice(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Right 6 Cols: AI Deal Verdict, Squad Impact & 1-Season ROI */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4 p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20">
            <div className="space-y-4">
              {/* Bargain Verdict Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-500/20">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    AI Piyasa Değerlemesi
                  </div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    Adil Değer: {fairMarketValue.toLocaleString("tr-TR")} TL
                  </div>
                </div>

                <span
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold ${
                    priceDiffPct <= -10
                      ? "bg-emerald-500 text-slate-950"
                      : priceDiffPct <= 12
                      ? "bg-amber-400 text-slate-950"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {priceDiffPct <= -10
                    ? `🔥 KELEPİR FIRSAT (%${Math.abs(priceDiffPct)} Ucuz)`
                    : priceDiffPct <= 12
                    ? "✅ ADİL PİYASA FİYATI"
                    : `⚠️ PAHALI (+%${priceDiffPct} Aşırı Fiyat)`}
                </span>
              </div>

              {/* Impact Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">
                    YILDIZ GÜCÜ
                  </div>
                  <div className="text-base font-black text-amber-500 mt-0.5">
                    {simulatedTargetPlayer.positionRating?.toFixed(1)}★
                  </div>
                  <div
                    className={`text-[10px] font-bold ${
                      ratingGain >= 0 ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {ratingGain >= 0 ? `+${ratingGain}★` : `${ratingGain}★`} Fark
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">
                    GALİBİYET ETKİSİ
                  </div>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    +%{winProbBoost}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">
                    Kazanma İhtimali
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">
                    TAHMİNİ MAAŞ
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                    {simulatedTargetPlayer.wage.toLocaleString("tr-TR")} TL
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">
                    Haftalık Gider
                  </div>
                </div>
              </div>

              {/* Replacement Comparison */}
              {playerToReplace && (
                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>Kesilecek / Yedeğe Çekilecek Oyuncu:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {playerToReplace.player.name} ({playerToReplace.score.toFixed(1)}★)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    1 Sezon (16 Hafta) Antrenman Sonrası Tahmini Net Yatırım Kârı (ROI):{" "}
                    <strong
                      className={
                        netSeasonROI >= 0 ? "text-emerald-500" : "text-rose-500"
                      }
                    >
                      {netSeasonROI >= 0 ? "+" : ""}
                      {netSeasonROI.toLocaleString("tr-TR")} TL
                    </strong>
                  </p>
                </div>
              )}
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
                      Öncelikli
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
                    <span>Kadro Derinliği:</span>
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
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Geleceğin Yıldızları (Elit Antrenman Adayları)
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {youngStars.length} Genç
            </span>
          </div>

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
        </div>

        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Satış & Yenilenme Adayları (Yaş & Maaş Yükü)
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-500">
              {sellCandidates.length} Oyuncu
            </span>
          </div>

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
                    Değer Kaybı Öncesi Satış
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
