"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Player,
  PositionCode,
  TeamDetails,
  TransferMarketPlayer,
  TransferSearchFilters,
} from "@/types/hattrick";
import {
  estimatePlayerMarketValue,
  getHattrickSkillName,
  getPlayerScoreForRole,
} from "@/lib/algorithms/lineup";
import { PlayerAvatar } from "./PlayerAvatar";
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Star,
  Brain,
  Calculator,
  Coins,
  Search,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Filter,
  ShieldAlert,
  Award,
  ArrowUpRight,
  Clock,
  SlidersHorizontal,
} from "lucide-react";

interface TransferScoutHubProps {
  players: Player[];
  team: TeamDetails | null;
  onSelectPlayer?: (player: Player) => void;
}

interface EnrichedTransferCandidate extends TransferMarketPlayer {
  roleScore: number;
  upgradeDelta: number;
  replacedPlayerName: string;
  replacedPlayerScore: number;
  valueAdvantagePct: number;
  withinBudget: boolean;
  advantageScore: number;
  verdictLabel: string;
}

const SKILL_TYPE_OPTIONS = [
  { id: 2, label: "Oyun Kuruculuk (Playmaking)", key: "playmaker" as const },
  { id: 1, label: "Savunma (Defending)", key: "defender" as const },
  { id: 3, label: "Golcülük (Scoring)", key: "scorer" as const },
  { id: 4, label: "Kanat (Winger)", key: "winger" as const },
  { id: 5, label: "Kalecilik (Goalkeeping)", key: "keeper" as const },
  { id: 6, label: "Kısa Pas (Passing)", key: "passer" as const },
  { id: 7, label: "Duran Top (Set Pieces)", key: "setPieces" as const },
];

export function TransferScoutHub({
  players,
  team,
  onSelectPlayer,
}: TransferScoutHubProps) {
  const sectors = useMemo(
    () => [
      {
        id: "GK",
        role: "GK" as PositionCode,
        label: "Kaleci (GK)",
        roles: ["GK"],
        targetCount: 2,
        skillTypeId: 5,
        primarySkill: "Kalecilik",
        secondarySkill: "Savunma & Duran Top",
        recommendedSpecialty: "Yok / Güçlü",
      },
      {
        id: "DEF",
        role: "CD" as PositionCode,
        label: "Stoper & Savunma (CD)",
        roles: ["CD"],
        targetCount: 3,
        skillTypeId: 1,
        primarySkill: "Savunma",
        secondarySkill: "Oyun Kuruculuk & Pas",
        recommendedSpecialty: "Kafa / Güçlü",
      },
      {
        id: "WB",
        role: "RB" as PositionCode,
        label: "Kanat Bek (RB/LB)",
        roles: ["RB", "LB"],
        targetCount: 2,
        skillTypeId: 1,
        primarySkill: "Savunma",
        secondarySkill: "Kanat & Oyun Kuruculuk",
        recommendedSpecialty: "Hızlı / Kafa",
      },
      {
        id: "MID",
        role: "IM" as PositionCode,
        label: "Merkez Orta Saha (IM)",
        roles: ["IM"],
        targetCount: 4,
        skillTypeId: 2,
        primarySkill: "Oyun Kuruculuk",
        secondarySkill: "Kısa Pas & Savunma",
        recommendedSpecialty: "Kafa / Güçlü",
      },
      {
        id: "WING",
        role: "RW" as PositionCode,
        label: "Kanat Hattı (RW/LW)",
        roles: ["RW", "LW"],
        targetCount: 2,
        skillTypeId: 4,
        primarySkill: "Kanat",
        secondarySkill: "Oyun Kuruculuk & Pas",
        recommendedSpecialty: "Hızlı / Öngörülemez",
      },
      {
        id: "FW",
        role: "FW" as PositionCode,
        label: "Forvet Hattı (FW)",
        roles: ["FW"],
        targetCount: 3,
        skillTypeId: 3,
        primarySkill: "Golcülük",
        secondarySkill: "Kısa Pas & Kanat",
        recommendedSpecialty: "Hızlı / Kafa / Teknik",
      },
    ],
    []
  );

  // Detailed Squad Weakness Analysis across all 6 sectors
  const sectorStats = useMemo(() => {
    const teamOverallAvg =
      players.length > 0
        ? players.reduce((s, p) => s + (p.positionRating || 0), 0) /
          players.length
        : 5.0;

    return sectors.map((sec) => {
      // Evaluate all healthy players for this specific role
      const roleEvaluated = players
        .filter((p) => p.injuryDays === 0)
        .map((p) => ({
          player: p,
          roleScore: getPlayerScoreForRole(p, sec.role),
          isNatural: sec.roles.includes(p.bestPosition || ""),
        }))
        .sort((a, b) => b.roleScore - a.roleScore);

      const naturalGroup = players.filter((p) =>
        sec.roles.includes(p.bestPosition || "")
      );
      const injuredInGroup = naturalGroup.filter((p) => p.injuryDays > 0).length;

      const starterSlotCount = Math.max(1, Math.min(3, sec.targetCount - 1));
      const topStarters = roleEvaluated.slice(0, starterSlotCount);
      const avgRating =
        topStarters.length > 0
          ? Math.round(
              (topStarters.reduce((s, x) => s + x.roleScore, 0) /
                topStarters.length) *
                10
            ) / 10
          : 0;

      const weakestStarter =
        topStarters[topStarters.length - 1]?.player || roleEvaluated[0]?.player || null;
      const weakestStarterScore =
        topStarters[topStarters.length - 1]?.roleScore || 0;

      const avgAge =
        naturalGroup.length > 0
          ? Math.round(
              (naturalGroup.reduce((s, p) => s + p.age, 0) /
                naturalGroup.length) *
                10
            ) / 10
          : 25;

      // Calculate Urgency / Deficit Score (higher = more urgent need)
      const countShortfall = Math.max(0, sec.targetCount - naturalGroup.length);
      const ratingGap = Math.max(0, teamOverallAvg + 0.8 - avgRating);
      const agePenalty = avgAge >= 29 ? 15 : avgAge >= 27 ? 7 : 0;
      const injuryPenalty = injuredInGroup * 8;
      const urgencyScore = Math.min(
        99,
        Math.round(
          ratingGap * 22 + countShortfall * 18 + agePenalty + injuryPenalty
        )
      );

      let diagnosisText = "İlk 11 kalitesi yeterli, alternatif derinliği artırılabilir.";
      if (naturalGroup.length < sec.targetCount) {
        diagnosisText = `Kadroda sadece ${naturalGroup.length}/${sec.targetCount} orijinal ${sec.label} oyuncusu var (Acil derinlik eksiği).`;
      } else if (avgRating <= teamOverallAvg - 0.3) {
        diagnosisText = `İlk 11 yıldız ortalaması (${avgRating}★) takım standardının altında kalıyor.`;
      } else if (avgAge >= 29) {
        diagnosisText = `Hat yaş ortalaması yüksek (${avgAge} yaş); gençleştirme takviyesi şart.`;
      }

      return {
        ...sec,
        count: naturalGroup.length,
        avgRating,
        avgAge,
        bestPlayer: topStarters[0]?.player || null,
        weakestStarter,
        weakestStarterScore: Math.round(weakestStarterScore * 10) / 10,
        urgencyScore,
        diagnosisText,
      };
    });
  }, [players, sectors]);

  const rankedWeaknesses = useMemo(
    () => [...sectorStats].sort((a, b) => b.urgencyScore - a.urgencyScore),
    [sectorStats]
  );

  const weakestSector = rankedWeaknesses[0] || sectorStats[3];

  // =========================================================================
  // LIVE HATTRICK CHPP TRANSFER SEARCH ENGINE STATE
  // =========================================================================
  const clubCash = team?.cash && team.cash > 0 ? team.cash : 15_000_000;
  const [searchPosition, setSearchPosition] = useState<PositionCode | "ALL">(
    weakestSector?.role || "IM"
  );
  const [skillType1, setSkillType1] = useState<number>(
    weakestSector?.skillTypeId || 2
  );
  const [minSkillValue1, setMinSkillValue1] = useState<number>(6);
  const [maxSkillValue1, setMaxSkillValue1] = useState<number>(15);
  const [ageMin, setAgeMin] = useState<number>(17);
  const [ageMax, setAgeMax] = useState<number>(30);
  const [maxBudget, setMaxBudget] = useState<number>(clubCash);
  const [specialtyFilter, setSpecialtyFilter] = useState<number>(-1);
  const [customPlayerIdInput, setCustomPlayerIdInput] = useState<string>("");
  const [onlyWithinBudget, setOnlyWithinBudget] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<
    "ADVANTAGE" | "STARS" | "BARGAIN" | "PRICE_ASC" | "TSI"
  >("ADVANTAGE");

  const [marketPlayers, setMarketPlayers] = useState<TransferMarketPlayer[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lastSearchedAt, setLastSearchedAt] = useState<string | null>(null);

  // Sync budget when team.cash loads
  useEffect(() => {
    if (team?.cash && team.cash > 0) {
      setMaxBudget(team.cash);
    }
  }, [team?.cash]);

  const executeTransferSearch = useCallback(
    async (overrideFilters?: Partial<TransferSearchFilters>) => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const parsedCustomId = customPlayerIdInput.trim()
          ? Number(customPlayerIdInput.trim().replace(/\D/g, ""))
          : undefined;

        const payload: TransferSearchFilters = {
          position: overrideFilters?.position ?? searchPosition,
          skillType1: overrideFilters?.skillType1 ?? skillType1,
          minSkillValue1: overrideFilters?.minSkillValue1 ?? minSkillValue1,
          maxSkillValue1: overrideFilters?.maxSkillValue1 ?? maxSkillValue1,
          ageMin: overrideFilters?.ageMin ?? ageMin,
          ageMax: overrideFilters?.ageMax ?? ageMax,
          maxPrice: overrideFilters?.maxPrice ?? maxBudget,
          specialty:
            overrideFilters?.specialty !== undefined
              ? overrideFilters.specialty
              : specialtyFilter >= 0
              ? specialtyFilter
              : undefined,
          customPlayerId: overrideFilters?.customPlayerId ?? parsedCustomId,
        };

        const res = await fetch("/api/hattrick/transfers/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Transfer araması başarısız oldu.");
        }

        setMarketPlayers(Array.isArray(data.players) ? data.players : []);
        setLastSearchedAt(
          new Date().toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      } catch (err: unknown) {
        setSearchError(
          err instanceof Error
            ? err.message
            : "Hattrick CHPP transfer listesi çekilirken hata oluştu."
        );
      } finally {
        setIsSearching(false);
      }
    },
    [
      searchPosition,
      skillType1,
      minSkillValue1,
      maxSkillValue1,
      ageMin,
      ageMax,
      maxBudget,
      specialtyFilter,
      customPlayerIdInput,
    ]
  );

  // Trigger initial automatic search for the team's weakest position on mount
  useEffect(() => {
    if (weakestSector) {
      setSearchPosition(weakestSector.role);
      setSkillType1(weakestSector.skillTypeId);
      executeTransferSearch({
        position: weakestSector.role,
        skillType1: weakestSector.skillTypeId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-optimize search button handler ("Eksik Mevkime Göre Bütçeme En Avantajlı Oyuncuyu Bul")
  const handleAutoFindBestForWeakness = (sector = weakestSector) => {
    if (!sector) return;
    const activeCash = team?.cash && team.cash > 0 ? team.cash : maxBudget;
    setSearchPosition(sector.role);
    setSkillType1(sector.skillTypeId);
    setMinSkillValue1(6);
    setMaxSkillValue1(16);
    setAgeMin(17);
    setAgeMax(29);
    setMaxBudget(activeCash);
    setSortBy("ADVANTAGE");
    executeTransferSearch({
      position: sector.role,
      skillType1: sector.skillTypeId,
      minSkillValue1: 6,
      maxSkillValue1: 16,
      ageMin: 17,
      ageMax: 29,
      maxPrice: activeCash,
    });
  };

  // Evaluate & Rank all fetched transfer-listed players against the user's squad & budget
  const evaluatedMarketPlayers: EnrichedTransferCandidate[] = useMemo(() => {
    const evalRole: PositionCode =
      searchPosition !== "ALL"
        ? searchPosition
        : weakestSector?.role || "IM";

    // Find current squad's weakest starter in `evalRole` to compare against
    const squadInRole = players
      .filter((p) => p.injuryDays === 0)
      .map((p) => ({
        player: p,
        score: getPlayerScoreForRole(p, evalRole),
      }))
      .sort((a, b) => b.score - a.score);

    const baselineStarter =
      squadInRole[Math.min(1, Math.max(0, squadInRole.length - 1))] ||
      squadInRole[0];
    const baselineScore = baselineStarter?.score || 3.5;
    const baselineName = baselineStarter?.player.name || "Mevcut İlk 11";

    const list = marketPlayers.map((mp) => {
      const candidateAsPlayer: Player = {
        id: mp.id,
        name: mp.name,
        firstName: mp.firstName,
        lastName: mp.lastName,
        age: mp.age,
        ageDays: mp.ageDays,
        tsi: mp.tsi,
        wage: mp.wage,
        form: mp.form,
        stamina: mp.stamina,
        experience: mp.experience,
        leadership: mp.leadership,
        loyalty: mp.loyalty,
        specialty: mp.specialty,
        injuryDays: mp.injuryDays,
        cards: mp.cards,
        avatar: mp.avatar,
        skills: mp.skills,
        bestPosition: mp.bestPosition,
        positionRating: mp.positionRating,
      };

      const rawScore =
        searchPosition === "ALL"
          ? mp.positionRating
          : getPlayerScoreForRole(candidateAsPlayer, evalRole);
      const roleScore = rawScore ?? 3.5;

      const upgradeDelta = Math.round((roleScore - baselineScore) * 10) / 10;

      const fairVal = Math.max(25_000, mp.estimatedMarketValue || mp.estimatedFairValue || 500_000);
      const price = Math.max(10_000, mp.currentPrice);
      // Positive valueAdvantagePct means the player is cheaper than fair market value!
      const valueAdvantagePct = Math.round(((fairVal - price) / fairVal) * 100);
      const withinBudget = price <= maxBudget;

      // Compute composite AI Advantage Score (0..99)
      const upgradePoints = Math.max(-15, Math.min(42, upgradeDelta * 16));
      const bargainPoints = Math.max(-15, Math.min(28, valueAdvantagePct * 0.55));
      const budgetPoints = withinBudget
        ? 18 + Math.min(7, Math.round(((maxBudget - price) / Math.max(1, maxBudget)) * 10))
        : -22;
      const agePoints =
        mp.age <= 21 ? 10 : mp.age <= 25 ? 8 : mp.age <= 28 ? 4 : -6;
      const specPoints = mp.specialty && mp.specialty !== "Yok" ? 5 : 0;

      const advantageScore = Math.max(
        12,
        Math.min(
          99,
          Math.round(
            40 +
              upgradePoints +
              bargainPoints +
              budgetPoints +
              agePoints +
              specPoints
          )
        )
      );

      let verdictLabel = "Standart Aday";
      if (withinBudget && upgradeDelta >= 0.5 && valueAdvantagePct >= 10) {
        verdictLabel = "🏆 BÜTÇEYE EN AVANTAJLI KELEPİR";
      } else if (withinBudget && upgradeDelta >= 0.3) {
        verdictLabel = "✅ BÜTÇEYE UYGUN GÜÇ TAKVİYESİ";
      } else if (!withinBudget && upgradeDelta >= 0.8) {
        verdictLabel = "💎 ELİT YILDIZ (Bütçe Üstü)";
      } else if (valueAdvantagePct >= 15) {
        verdictLabel = "🔥 PİYASA ALTINDA FIRSAT";
      }

      return {
        ...mp,
        roleScore,
        upgradeDelta,
        replacedPlayerName: baselineName,
        replacedPlayerScore: Math.round(baselineScore * 10) / 10,
        valueAdvantagePct,
        withinBudget,
        advantageScore,
        verdictLabel,
      };
    });

    const filtered = list.filter((item) => {
      if (onlyWithinBudget && !item.withinBudget) return false;
      if (ageMin && item.age < ageMin) return false;
      if (ageMax && item.age > ageMax) return false;
      return true;
    });

    filtered.sort((a, b) => {
      if (sortBy === "ADVANTAGE") return b.advantageScore - a.advantageScore;
      if (sortBy === "STARS") return (b.roleScore || 0) - (a.roleScore || 0);
      if (sortBy === "BARGAIN") return b.valueAdvantagePct - a.valueAdvantagePct;
      if (sortBy === "PRICE_ASC") return a.currentPrice - b.currentPrice;
      return b.tsi - a.tsi;
    });

    return filtered;
  }, [
    marketPlayers,
    searchPosition,
    weakestSector,
    players,
    maxBudget,
    onlyWithinBudget,
    ageMin,
    ageMax,
    sortBy,
  ]);

  // Top #1 Best Value Recommendation
  const bestRecommendation = useMemo(() => {
    const withinBudgetUpgrade = evaluatedMarketPlayers.find(
      (p) => p.withinBudget && p.upgradeDelta >= 0
    );
    return (
      withinBudgetUpgrade ||
      evaluatedMarketPlayers.find((p) => p.withinBudget) ||
      evaluatedMarketPlayers[0] ||
      null
    );
  }, [evaluatedMarketPlayers]);

  // =========================================================================
  // PRO AI TRANSFER & BARGAIN SIMULATOR STATE
  // =========================================================================
  const [targetRole, setTargetRole] = useState<PositionCode>(
    weakestSector?.role || "IM"
  );
  const [targetAge, setTargetAge] = useState<number>(21);
  const [targetPrimary, setTargetPrimary] = useState<number>(11);
  const [targetSecondary, setTargetSecondary] = useState<number>(8);
  const [targetSpecialty, setTargetSpecialty] = useState<string>("Hızlı");
  const [askingPrice, setAskingPrice] = useState<number>(12500000);

  const loadCandidateIntoSimulator = (cand: EnrichedTransferCandidate) => {
    setTargetRole(cand.bestPosition || "IM");
    setTargetAge(cand.age);
    const sortedSkills = [
      cand.skills.keeper,
      cand.skills.defender,
      cand.skills.playmaker,
      cand.skills.winger,
      cand.skills.passer,
      cand.skills.scorer,
    ].sort((a, b) => b - a);
    setTargetPrimary(Math.max(5, sortedSkills[0] || 9));
    setTargetSecondary(Math.max(3, sortedSkills[1] || 6));
    setTargetSpecialty(cand.specialty || "Yok");
    setAskingPrice(cand.currentPrice);
  };

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

  const currentRolePlayers = players
    .filter((p) => p.injuryDays === 0)
    .map((p) => ({
      player: p,
      score: getPlayerScoreForRole(p, targetRole),
    }))
    .sort((a, b) => b.score - a.score);

  const playerToReplace =
    currentRolePlayers[
      Math.min(1, Math.max(0, currentRolePlayers.length - 1))
    ] || currentRolePlayers[0];

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
      {/* =====================================================================
          1. AI KADRO EKSİKLİĞİ & BÜTÇE TEŞHİS PANELİ
         ===================================================================== */}
      <div className="p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-400 text-slate-950">
              <Brain className="w-3.5 h-3.5" />
              <span>
                HATTRICK CHPP CANLI TRANSFER ARAMA MOTORU & EKSİK MEVKİ OPTİMİZATÖRÜ
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              1 Numaralı Kadro Eksikliğiniz:{" "}
              <span className="text-emerald-400">
                {weakestSector?.label || "Merkez Orta Saha"}
              </span>{" "}
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-500/25 border border-rose-400/40 text-rose-200 align-middle ml-1">
                Kritiklik: %{weakestSector?.urgencyScore || 82}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              {weakestSector?.diagnosisText} Mevcut en zayıf ilk 11 oyuncunuz{" "}
              <strong className="text-amber-300">
                {weakestSector?.weakestStarter?.name || "-"} (
                {weakestSector?.weakestStarterScore}★)
              </strong>
              . Kulüp kasasındaki{" "}
              <strong className="text-emerald-400">
                {(team?.cash || 0).toLocaleString("tr-TR")} TL
              </strong>{" "}
              bütçeye göre Hattrick transfer listesi canlı taranarak en avantajlı
              adaylar aşağıda sıralandı.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm text-left sm:text-right">
              <div className="text-[11px] text-slate-300 font-semibold">
                Kulüp Kasası (Gerçek Hattrick Bütçesi)
              </div>
              <div className="text-xl font-black text-emerald-400">
                {(team?.cash || 0).toLocaleString("tr-TR")} TL
              </div>
              <div className="text-[10px] text-amber-300 font-bold mt-0.5">
                Aranan Yetenek: {weakestSector?.primarySkill}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleAutoFindBestForWeakness(weakestSector)}
              disabled={isSearching}
              className="px-4 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                Eksik Mevkime Göre En Avantajlı Oyuncuları Bul (
                {weakestSector?.role})
              </span>
            </button>
          </div>
        </div>

        {/* 6 Position Weakness Cards — Click any sector to scan transfer list for that position */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-white/10">
          {sectorStats.map((sec) => {
            const isWeakest = sec.id === weakestSector?.id;
            const isSelected = searchPosition === sec.role;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleAutoFindBestForWeakness(sec)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? "bg-emerald-500/25 border-emerald-400 shadow-lg"
                    : isWeakest
                    ? "bg-rose-500/15 border-rose-400/50 hover:bg-rose-500/25"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-extrabold text-white truncate">
                    {sec.label}
                  </span>
                  {isWeakest && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-500 text-white shrink-0">
                      EKSİK
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-black text-amber-400">
                    {sec.avgRating}★
                  </span>
                  <span className="text-[10px] text-slate-300 font-semibold">
                    {sec.count}/{sec.targetCount} Oyuncu
                  </span>
                </div>
                <div className="text-[10px] text-emerald-300 font-bold truncate">
                  🔍 Bu Mevki İçin Ara
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          2. #1 EN AVANTAJLI TRANSFER ÖNERİSİ (SPOTLIGHT CARD)
         ===================================================================== */}
      {bestRecommendation && (
        <div className="p-5 sm:p-6 rounded-3xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/10 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/30 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-500/20">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-slate-950 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>
                  BÜTÇENİZE & EKSİK MEVKİNİZE EN AVANTAJLI #1 TRANSFER HEDEFİ
                </span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                AI Avantaj Skoru: {bestRecommendation.advantageScore}/99
              </span>
            </div>

            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                Son Teklif: {bestRecommendation.deadline.slice(0, 16).replace("T", " ")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Avatar + Basic Identity */}
            <div className="lg:col-span-4 flex items-center gap-4">
              <PlayerAvatar
                avatar={bestRecommendation.avatar}
                size="lg"
                badgeText={`${bestRecommendation.roleScore.toFixed(1)}★`}
              />
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                    {bestRecommendation.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500 text-slate-950">
                    {bestRecommendation.bestPosition}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  ID: #{bestRecommendation.id} • {bestRecommendation.age}y{" "}
                  {bestRecommendation.ageDays}g • TSI:{" "}
                  {bestRecommendation.tsi.toLocaleString("tr-TR")}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  Satıcı Kulüp:{" "}
                  <strong>{bestRecommendation.sellerTeamName}</strong>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Form: {bestRecommendation.form}/8
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Kondisyon: {bestRecommendation.stamina}/9
                  </span>
                  {bestRecommendation.specialty !== "Yok" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300">
                      ⚡ {bestRecommendation.specialty}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 7 Hattrick Skills Grid */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-1.5 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px]">
              {[
                { label: "Kalecilik", val: bestRecommendation.skills.keeper },
                { label: "Savunma", val: bestRecommendation.skills.defender },
                {
                  label: "Oyun Kurucu",
                  val: bestRecommendation.skills.playmaker,
                },
                { label: "Kanat", val: bestRecommendation.skills.winger },
                { label: "Kısa Pas", val: bestRecommendation.skills.passer },
                { label: "Golcülük", val: bestRecommendation.skills.scorer },
              ].map((sk) => (
                <div
                  key={sk.label}
                  className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-900"
                >
                  <span className="text-slate-500 dark:text-slate-400">
                    {sk.label}:
                  </span>
                  <strong
                    className={
                      sk.val >= 10
                        ? "text-emerald-600 dark:text-emerald-400 font-black"
                        : sk.val >= 7
                        ? "text-blue-600 dark:text-blue-400 font-bold"
                        : "text-slate-700 dark:text-slate-300"
                    }
                  >
                    {getHattrickSkillName(sk.val)} ({sk.val})
                  </strong>
                </div>
              ))}
            </div>

            {/* Financial & Squad Upgrade Comparison + Direct Hattrick Link */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-3 p-4 rounded-2xl bg-slate-900 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    İstenen Fiyat / Son Teklif
                  </div>
                  <div className="text-lg font-black text-emerald-400">
                    {bestRecommendation.currentPrice.toLocaleString("tr-TR")} TL
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Adil Piyasa Değeri:{" "}
                    {bestRecommendation.estimatedMarketValue.toLocaleString(
                      "tr-TR"
                    )}{" "}
                    TL
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    İlk 11 Güç Artışı
                  </div>
                  <div
                    className={`text-base font-black ${
                      bestRecommendation.upgradeDelta >= 0
                        ? "text-amber-400"
                        : "text-slate-300"
                    }`}
                  >
                    {bestRecommendation.upgradeDelta >= 0
                      ? `+${bestRecommendation.upgradeDelta}★`
                      : `${bestRecommendation.upgradeDelta}★`}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                    Yerine: {bestRecommendation.replacedPlayerName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={bestRecommendation.hattrickUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Hattrick&apos;te Aç & Teklif Ver</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => loadCandidateIntoSimulator(bestRecommendation)}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Simüle Et
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. HATTRICK CHPP TRANSFER ARAMA MOTORU & FİLTRELERİ + SONUÇ LİSTESİ
         ===================================================================== */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>Hattrick CHPP Transfer Listesi Arama Motoru</span>
                {lastSearchedAt && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    Canlı Veri ({lastSearchedAt})
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">
                Hattrick CHPP API üzerinden transfer listesindeki gerçek
                oyuncuları filtreleyin veya doğrudan Hattrick PlayerID ile
                sorgulayın
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => executeTransferSearch()}
              disabled={isSearching}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isSearching ? "animate-spin" : ""}`}
              />
              <span>
                {isSearching ? "CHPP Taranıyor..." : "Transfer Listesini Tara"}
              </span>
            </button>
          </div>
        </div>

        {/* Search Engine Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
              Mevki Filtresi:
            </label>
            <select
              value={searchPosition}
              onChange={(e) => {
                const val = e.target.value as PositionCode | "ALL";
                setSearchPosition(val);
                const sec = sectors.find((s) => s.role === val);
                if (sec) setSkillType1(sec.skillTypeId);
              }}
              className="w-full px-3 py-2 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <option value="ALL">Tüm Mevkiler</option>
              <option value="GK">Kaleci (GK)</option>
              <option value="CD">Stoper / Savunma (CD)</option>
              <option value="RB">Kanat Bek (RB/LB)</option>
              <option value="IM">Merkez Orta Saha (IM)</option>
              <option value="RW">Kanat (RW/LW)</option>
              <option value="FW">Forvet (FW)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
              Aranan Ana Yetenek:
            </label>
            <select
              value={skillType1}
              onChange={(e) => setSkillType1(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              {SKILL_TYPE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
              Min. Yetenek Seviyesi:
            </label>
            <select
              value={minSkillValue1}
              onChange={(e) => setMinSkillValue1(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((lvl) => (
                <option key={lvl} value={lvl}>
                  {getHattrickSkillName(lvl)} ({lvl}+)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
              Yaş Aralığı ({ageMin} - {ageMax}):
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={17}
                max={38}
                value={ageMin}
                onChange={(e) => setAgeMin(Number(e.target.value))}
                className="w-1/2 px-2.5 py-2 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
              <span>-</span>
              <input
                type="number"
                min={17}
                max={38}
                value={ageMax}
                onChange={(e) => setAgeMax(Number(e.target.value))}
                className="w-1/2 px-2.5 py-2 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
              Maksimum Bütçe (TL):
            </label>
            <input
              type="number"
              step={250000}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
              Hattrick PlayerID (Opsiyonel):
            </label>
            <input
              type="text"
              placeholder="Örn: 482910421"
              value={customPlayerIdInput}
              onChange={(e) => setCustomPlayerIdInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>
        </div>

        {/* Sort & Quick Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={onlyWithinBudget}
                onChange={(e) => setOnlyWithinBudget(e.target.checked)}
                className="accent-emerald-500"
              />
              <span>
                Sadece Bütçeme Yetenleri Göster (≤{" "}
                {maxBudget.toLocaleString("tr-TR")} TL)
              </span>
            </label>

            {team?.cash && team.cash > 0 && maxBudget !== team.cash && (
              <button
                type="button"
                onClick={() => setMaxBudget(team.cash)}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold cursor-pointer"
              >
                Kasamdaki Nakite Eşitle ({team.cash.toLocaleString("tr-TR")} TL)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-500">Sıralama:</span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | "ADVANTAGE"
                    | "STARS"
                    | "BARGAIN"
                    | "PRICE_ASC"
                    | "TSI"
                )
              }
              className="px-3 py-1.5 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
            >
              <option value="ADVANTAGE">
                🎯 AI En Avantajlı (Bütçe + Kadro Katkısı)
              </option>
              <option value="STARS">⭐ En Yüksek Yıldız Gücü (★)</option>
              <option value="BARGAIN">
                🔥 En Kelepir (Adil Değer İndirimi %)
              </option>
              <option value="PRICE_ASC">💰 En Düşük Fiyat (TL)</option>
              <option value="TSI">📈 En Yüksek TSI</option>
            </select>
          </div>
        </div>

        {searchError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-semibold">
            {searchError}
          </div>
        )}

        {/* Transfer Market Results Grid */}
        {isSearching ? (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Hattrick CHPP Transfer Piyasası ve Kulüp Satış Listeleri Canlı
              Taranıyor...
            </div>
            <div className="text-xs text-slate-400">
              Eksik mevkiniz ({weakestSector?.label}) ve bütçeniz için en
              avantajlı oyuncular hesaplanıyor.
            </div>
          </div>
        ) : evaluatedMarketPlayers.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
              Seçili filtrelere uygun oyuncu bulunamadı.
            </div>
            <button
              type="button"
              onClick={() => {
                setOnlyWithinBudget(false);
                setAgeMin(17);
                setAgeMax(35);
                executeTransferSearch();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Filtreleri Genişlet ve Tekrar Ara
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluatedMarketPlayers.map((cand, index) => (
              <div
                key={cand.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  index === 0
                    ? "border-emerald-500/70 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-md"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 hover:border-emerald-500/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <PlayerAvatar
                      avatar={cand.avatar}
                      size="md"
                      badgeText={`${cand.roleScore.toFixed(1)}★`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                          {cand.name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          {cand.bestPosition}
                        </span>
                        {cand.specialty !== "Yok" && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                            ⚡ {cand.specialty}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {cand.age}y {cand.ageDays}g • TSI:{" "}
                        {cand.tsi.toLocaleString("tr-TR")} • Maaş:{" "}
                        {cand.wage.toLocaleString("tr-TR")} TL
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        Kulüp: {cand.sellerTeamName} • #{cand.id}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-emerald-500 text-slate-950">
                      Avantaj: {cand.advantageScore}
                    </span>
                    <div className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {cand.currentPrice.toLocaleString("tr-TR")} TL
                    </div>
                    <div
                      className={`text-[10px] font-bold ${
                        cand.withinBudget ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {cand.withinBudget ? "✓ Bütçeye Uygun" : "Bütçe Üzeri"}
                    </div>
                  </div>
                </div>

                {/* Mini Skill Pills */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-[10px] text-center">
                  {[
                    { k: "KL", v: cand.skills.keeper },
                    { k: "SV", v: cand.skills.defender },
                    { k: "OK", v: cand.skills.playmaker },
                    { k: "KN", v: cand.skills.winger },
                    { k: "PS", v: cand.skills.passer },
                    { k: "GL", v: cand.skills.scorer },
                  ].map((s) => (
                    <div
                      key={s.k}
                      className={`py-1 px-1.5 rounded-lg border ${
                        s.v >= 9
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-black"
                          : s.v >= 6
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300 font-bold"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500"
                      }`}
                    >
                      {s.k}: {s.v}
                    </div>
                  ))}
                </div>

                {/* Comparison Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-800 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-extrabold ${
                        cand.upgradeDelta >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-500"
                      }`}
                    >
                      {cand.upgradeDelta >= 0
                        ? `+${cand.upgradeDelta}★ Güç Artışı`
                        : `${cand.upgradeDelta}★ (Rotasyon)`}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">
                      Adil Değer:{" "}
                      {cand.estimatedMarketValue.toLocaleString("tr-TR")} TL
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => loadCandidateIntoSimulator(cand)}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 font-bold text-[10px] transition-colors cursor-pointer"
                    >
                      Simüle Et
                    </button>
                    <a
                      href={cand.hattrickUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[10px] inline-flex items-center gap-1"
                    >
                      <span>Hattrick&apos;te Teklif Ver</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================================
          4. PRO AI TRANSFER & BARGAIN SIMULATOR ("ALIRSAM NE OLUR?")
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
                Yukarıdaki transfer listesinden &ldquo;Simüle Et&rdquo;e tıklayın veya
                istediğiniz özellikleri girerek 1 sezonluk yatırım getirisini (ROI)
                hesaplayın
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              {
                label: "18y Genç Yetenek",
                role: "IM" as PositionCode,
                age: 18,
                pri: 8,
                sec: 6,
                price: 3200000,
              },
              {
                label: "22y Yıldız OS",
                role: "IM" as PositionCode,
                age: 22,
                pri: 12,
                sec: 9,
                price: 18500000,
              },
              {
                label: "24y Elit Golcü",
                role: "FW" as PositionCode,
                age: 24,
                pri: 13,
                sec: 9,
                price: 24000000,
              },
              {
                label: "25y Duvar Stoper",
                role: "CD" as PositionCode,
                age: 25,
                pri: 12,
                sec: 8,
                price: 14500000,
              },
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
          <div className="lg:col-span-6 space-y-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Hedef Mevki:
                </label>
                <select
                  value={targetRole}
                  onChange={(e) =>
                    setTargetRole(e.target.value as PositionCode)
                  }
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
                min={250000}
                max={60000000}
                step={250000}
                value={askingPrice}
                onChange={(e) => setAskingPrice(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between gap-4 p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20">
            <div className="space-y-4">
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

              {playerToReplace && (
                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>Kesilecek / Yedeğe Çekilecek Oyuncu:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {playerToReplace.player.name} (
                      {playerToReplace.score.toFixed(1)}★)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    1 Sezon (16 Hafta) Antrenman Sonrası Tahmini Net Yatırım
                    Kârı (ROI):{" "}
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
                <div className="flex items-center gap-3">
                  <PlayerAvatar avatar={p.avatar} size="sm" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{p.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        {p.bestPosition}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {p.age}y {p.ageDays}g • TSI:{" "}
                      {p.tsi.toLocaleString("tr-TR")}
                    </div>
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
                Satış & Yenilenme Adayları (Ekstra Transfer Bütçesi Kaynağı)
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
                <div className="flex items-center gap-3">
                  <PlayerAvatar avatar={p.avatar} size="sm" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{p.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        {p.age} Yaş
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Maaş: {p.wage.toLocaleString("tr-TR")} TL/hf • Form:{" "}
                      {p.form}/8
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                    +{estimatePlayerMarketValue(p).toLocaleString("tr-TR")} TL
                  </div>
                  <div className="text-[10px] text-rose-500 font-semibold">
                    Satıştan Gelecek Bütçe
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
