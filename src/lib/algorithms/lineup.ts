import { Player, TacticalLineup, FormationSlot, PositionCode, SectorRatings } from "@/types/hattrick";

export type SupportedFormation = "4-4-2" | "3-5-2" | "4-3-3" | "4-5-1" | "3-4-3" | "5-3-2";

interface SlotTemplate {
  id: string;
  role: PositionCode;
  x: number; // 0 - 100%
  y: number; // 0 - 100% (top: 10% FW, bottom: 88% GK)
  label: string;
}

export const FORMATION_SLOTS: Record<SupportedFormation, SlotTemplate[]> = {
  "4-4-2": [
    { id: "gk", role: "GK", x: 50, y: 88, label: "Kaleci" },
    { id: "lb", role: "LB", x: 15, y: 70, label: "Sol Bek" },
    { id: "cd1", role: "CD", x: 38, y: 72, label: "Sol Stoper" },
    { id: "cd2", role: "CD", x: 62, y: 72, label: "Sağ Stoper" },
    { id: "rb", role: "RB", x: 85, y: 70, label: "Sağ Bek" },
    { id: "lw", role: "LW", x: 15, y: 44, label: "Sol Kanat" },
    { id: "im1", role: "IM", x: 38, y: 46, label: "İç Saha (Sol)" },
    { id: "im2", role: "IM", x: 62, y: 46, label: "İç Saha (Sağ)" },
    { id: "rw", role: "RW", x: 85, y: 44, label: "Sağ Kanat" },
    { id: "fw1", role: "FW", x: 36, y: 18, label: "Forvet (Sol)" },
    { id: "fw2", role: "FW", x: 64, y: 18, label: "Forvet (Sağ)" },
  ],
  "3-5-2": [
    { id: "gk", role: "GK", x: 50, y: 88, label: "Kaleci" },
    { id: "cd1", role: "CD", x: 25, y: 72, label: "Sol Stoper" },
    { id: "cd2", role: "CD", x: 50, y: 74, label: "Merkez Stoper" },
    { id: "cd3", role: "CD", x: 75, y: 72, label: "Sağ Stoper" },
    { id: "lw", role: "LW", x: 12, y: 45, label: "Sol Kanat" },
    { id: "im1", role: "IM", x: 31, y: 48, label: "İç Saha (Sol)" },
    { id: "im2", role: "IM", x: 50, y: 50, label: "İç Saha (Merkez)" },
    { id: "im3", role: "IM", x: 69, y: 48, label: "İç Saha (Sağ)" },
    { id: "rw", role: "RW", x: 88, y: 45, label: "Sağ Kanat" },
    { id: "fw1", role: "FW", x: 36, y: 18, label: "Forvet (Sol)" },
    { id: "fw2", role: "FW", x: 64, y: 18, label: "Forvet (Sağ)" },
  ],
  "4-3-3": [
    { id: "gk", role: "GK", x: 50, y: 88, label: "Kaleci" },
    { id: "lb", role: "LB", x: 15, y: 70, label: "Sol Bek" },
    { id: "cd1", role: "CD", x: 38, y: 72, label: "Sol Stoper" },
    { id: "cd2", role: "CD", x: 62, y: 72, label: "Sağ Stoper" },
    { id: "rb", role: "RB", x: 85, y: 70, label: "Sağ Bek" },
    { id: "im1", role: "IM", x: 28, y: 46, label: "İç Saha (Sol)" },
    { id: "im2", role: "IM", x: 50, y: 49, label: "İç Saha (Merkez)" },
    { id: "im3", role: "IM", x: 72, y: 46, label: "İç Saha (Sağ)" },
    { id: "fw1", role: "FW", x: 20, y: 20, label: "Sol Forvet / Kanat" },
    { id: "fw2", role: "FW", x: 50, y: 16, label: "Merkez Forvet" },
    { id: "fw3", role: "FW", x: 80, y: 20, label: "Sağ Forvet / Kanat" },
  ],
  "4-5-1": [
    { id: "gk", role: "GK", x: 50, y: 88, label: "Kaleci" },
    { id: "lb", role: "LB", x: 15, y: 70, label: "Sol Bek" },
    { id: "cd1", role: "CD", x: 38, y: 72, label: "Sol Stoper" },
    { id: "cd2", role: "CD", x: 62, y: 72, label: "Sağ Stoper" },
    { id: "rb", role: "RB", x: 85, y: 70, label: "Sağ Bek" },
    { id: "lw", role: "LW", x: 12, y: 44, label: "Sol Kanat" },
    { id: "im1", role: "IM", x: 31, y: 47, label: "İç Saha" },
    { id: "im2", role: "IM", x: 50, y: 50, label: "Merkez Orta Saha" },
    { id: "im3", role: "IM", x: 69, y: 47, label: "İç Saha" },
    { id: "rw", role: "RW", x: 88, y: 44, label: "Sağ Kanat" },
    { id: "fw1", role: "FW", x: 50, y: 18, label: "Tek Forvet" },
  ],
  "3-4-3": [
    { id: "gk", role: "GK", x: 50, y: 88, label: "Kaleci" },
    { id: "cd1", role: "CD", x: 25, y: 72, label: "Sol Stoper" },
    { id: "cd2", role: "CD", x: 50, y: 74, label: "Merkez Stoper" },
    { id: "cd3", role: "CD", x: 75, y: 72, label: "Sağ Stoper" },
    { id: "lw", role: "LW", x: 15, y: 46, label: "Sol Kanat" },
    { id: "im1", role: "IM", x: 38, y: 48, label: "İç Saha" },
    { id: "im2", role: "IM", x: 62, y: 48, label: "İç Saha" },
    { id: "rw", role: "RW", x: 85, y: 46, label: "Sağ Kanat" },
    { id: "fw1", role: "FW", x: 22, y: 19, label: "Sol Forvet" },
    { id: "fw2", role: "FW", x: 50, y: 16, label: "Merkez Forvet" },
    { id: "fw3", role: "FW", x: 78, y: 19, label: "Sağ Forvet" },
  ],
  "5-3-2": [
    { id: "gk", role: "GK", x: 50, y: 88, label: "Kaleci" },
    { id: "lb", role: "LB", x: 10, y: 68, label: "Sol Kanat Bek" },
    { id: "cd1", role: "CD", x: 30, y: 73, label: "Sol Stoper" },
    { id: "cd2", role: "CD", x: 50, y: 75, label: "Merkez Stoper" },
    { id: "cd3", role: "CD", x: 70, y: 73, label: "Sağ Stoper" },
    { id: "rb", role: "RB", x: 90, y: 68, label: "Sağ Kanat Bek" },
    { id: "im1", role: "IM", x: 28, y: 47, label: "İç Saha" },
    { id: "im2", role: "IM", x: 50, y: 49, label: "İç Saha" },
    { id: "im3", role: "IM", x: 72, y: 47, label: "İç Saha" },
    { id: "fw1", role: "FW", x: 36, y: 18, label: "Forvet (Sol)" },
    { id: "fw2", role: "FW", x: 64, y: 18, label: "Forvet (Sağ)" },
  ],
};

/**
 * Calculates a specific player's score for a given position role
 */
export function getPlayerScoreForRole(player: Player, role: PositionCode): number {
  if (player.injuryDays > 0) return 0; // Sakat oyuncu kadroya giremez

  const skills = player.skills;
  const formMult = 0.65 + player.form * 0.05;
  const stamMult = 0.7 + player.stamina * 0.035;
  const expBonus = player.experience * 0.06;

  let baseScore = 0;

  switch (role) {
    case "GK":
      baseScore = skills.keeper * 0.85 + skills.defender * 0.15;
      break;
    case "CD":
      baseScore = skills.defender * 0.7 + skills.playmaker * 0.15 + skills.passer * 0.1 + skills.keeper * 0.05;
      break;
    case "RB":
    case "LB":
      baseScore = skills.defender * 0.5 + skills.winger * 0.25 + skills.playmaker * 0.15 + skills.passer * 0.1;
      break;
    case "IM":
      baseScore = skills.playmaker * 0.55 + skills.defender * 0.2 + skills.passer * 0.15 + skills.scorer * 0.1;
      break;
    case "RW":
    case "LW":
      baseScore = skills.winger * 0.55 + skills.playmaker * 0.2 + skills.passer * 0.15 + skills.defender * 0.1;
      break;
    case "FW":
      baseScore = skills.scorer * 0.6 + skills.passer * 0.2 + skills.winger * 0.1 + skills.playmaker * 0.1;
      break;
    default:
      baseScore = 5;
  }

  return Math.round((baseScore * formMult * stamMult + expBonus) * 10) / 10;
}

/**
 * Otomatik Kadro Dizilimi Algoritması
 * Verilen oyuncu havuzundan seçilen formasyona (veya en yüksek verimli formasyona) en uygun 11'i ve yedekleri dizer.
 */
export function generateAutoLineup(
  players: Player[],
  preferredFormation?: SupportedFormation
): TacticalLineup {
  const healthyPlayers = players.filter((p) => p.injuryDays === 0);

  // If no preferred formation is provided, test all and find the best one
  const formationsToTest: SupportedFormation[] = preferredFormation
    ? [preferredFormation]
    : ["4-4-2", "3-5-2", "4-3-3", "4-5-1", "3-4-3", "5-3-2"];

  let bestLineup: TacticalLineup | null = null;
  let maxTotalRating = -1;

  for (const form of formationsToTest) {
    const lineup = buildLineupForFormation(healthyPlayers, form);
    if (lineup.totalRating > maxTotalRating) {
      maxTotalRating = lineup.totalRating;
      bestLineup = lineup;
    }
  }

  return bestLineup!;
}

function buildLineupForFormation(players: Player[], formation: SupportedFormation): TacticalLineup {
  const templates = FORMATION_SLOTS[formation];
  const assignedPlayerIds = new Set<number>();
  const slots: FormationSlot[] = [];

  // Group roles needed
  const unassignedSlots = [...templates];

  // 1. Assign GK first (vital)
  const gkSlot = unassignedSlots.find((s) => s.role === "GK");
  if (gkSlot) {
    const availableGKs = players
      .filter((p) => !assignedPlayerIds.has(p.id))
      .map((p) => ({ player: p, score: getPlayerScoreForRole(p, "GK") }))
      .sort((a, b) => b.score - a.score);

    if (availableGKs.length > 0) {
      const bestGK = availableGKs[0];
      assignedPlayerIds.add(bestGK.player.id);
      slots.push({
        ...gkSlot,
        playerId: bestGK.player.id,
        assignedPlayer: bestGK.player,
        rating: bestGK.score,
      });
    }
  }

  // 2. Assign other positions by matching optimal roles with greedy maximum score
  const nonGkSlots = unassignedSlots.filter((s) => s.role !== "GK");

  // Priority order for assigning positions: IM, FW, CD, W, WB
  const rolePriority: PositionCode[] = ["IM", "FW", "CD", "LW", "RW", "LB", "RB"];

  for (const role of rolePriority) {
    const currentRoleSlots = nonGkSlots.filter(
      (s) => s.role === role && !slots.some((sl) => sl.id === s.id)
    );

    for (const slot of currentRoleSlots) {
      const candidates = players
        .filter((p) => !assignedPlayerIds.has(p.id))
        .map((p) => ({ player: p, score: getPlayerScoreForRole(p, slot.role) }))
        .sort((a, b) => b.score - a.score);

      if (candidates.length > 0) {
        const best = candidates[0];
        assignedPlayerIds.add(best.player.id);
        slots.push({
          ...slot,
          playerId: best.player.id,
          assignedPlayer: best.player,
          rating: best.score,
        });
      }
    }
  }

  // If any slot remained unfilled, fill with best available remaining player
  for (const slot of nonGkSlots) {
    if (!slots.some((s) => s.id === slot.id)) {
      const remaining = players
        .filter((p) => !assignedPlayerIds.has(p.id))
        .map((p) => ({ player: p, score: getPlayerScoreForRole(p, slot.role) }))
        .sort((a, b) => b.score - a.score);

      if (remaining.length > 0) {
        const best = remaining[0];
        assignedPlayerIds.add(best.player.id);
        slots.push({
          ...slot,
          playerId: best.player.id,
          assignedPlayer: best.player,
          rating: best.score,
        });
      }
    }
  }

  // 3. Assign 5 Substitutes
  const subRoles: ("SUB_GK" | "SUB_DEF" | "SUB_MID" | "SUB_WING" | "SUB_FW")[] = [
    "SUB_GK",
    "SUB_DEF",
    "SUB_MID",
    "SUB_WING",
    "SUB_FW",
  ];

  const subTargetRole: Record<string, PositionCode> = {
    SUB_GK: "GK",
    SUB_DEF: "CD",
    SUB_MID: "IM",
    SUB_WING: "RW",
    SUB_FW: "FW",
  };

  const substitutes = subRoles.map((subSlot) => {
    const targetRole = subTargetRole[subSlot];
    const available = players
      .filter((p) => !assignedPlayerIds.has(p.id))
      .map((p) => ({ player: p, score: getPlayerScoreForRole(p, targetRole) }))
      .sort((a, b) => b.score - a.score);

    if (available.length > 0) {
      assignedPlayerIds.add(available[0].player.id);
      return {
        slot: subSlot,
        playerId: available[0].player.id,
        player: available[0].player,
      };
    }
    return { slot: subSlot };
  });

  // 4. Select Captain (highest Experience + Leadership)
  const starters = slots.map((s) => s.assignedPlayer).filter(Boolean) as Player[];
  const captain = [...starters].sort(
    (a, b) => b.experience * 1.5 + b.leadership * 2 - (a.experience * 1.5 + a.leadership * 2)
  )[0];

  // 5. Select Set Pieces Taker (highest setPieces skill)
  const setPiecesTaker = [...starters].sort((a, b) => b.skills.setPieces - a.skills.setPieces)[0];

  // 6. Calculate Sector Ratings
  const sectorRatings = calculateLineupSectorRatings(slots);
  const totalRating = Math.round(
    slots.reduce((acc, s) => acc + (s.rating || 0), 0) * 10
  ) / 10;

  return {
    formation,
    tactic: "Normal",
    attitude: "Normal",
    captainId: captain?.id,
    setPiecesTakerId: setPiecesTaker?.id,
    slots,
    substitutes,
    totalRating,
    sectorRatings,
  };
}

/**
 * Calculates estimated sector ratings based on players placed in the slots
 */
export function calculateLineupSectorRatings(slots: FormationSlot[]): SectorRatings {
  const getSlot = (id: string) => slots.find((s) => s.id === id)?.assignedPlayer;

  const gk = slots.find((s) => s.role === "GK")?.assignedPlayer;
  const defs = slots.filter((s) => ["CD", "RB", "LB"].includes(s.role)).map((s) => s.assignedPlayer).filter(Boolean) as Player[];
  const mids = slots.filter((s) => ["IM", "RW", "LW"].includes(s.role)).map((s) => s.assignedPlayer).filter(Boolean) as Player[];
  const fws = slots.filter((s) => s.role === "FW").map((s) => s.assignedPlayer).filter(Boolean) as Player[];

  // Midfield calculation (scaled 1-80)
  const ims = slots.filter((s) => s.role === "IM").map((s) => s.assignedPlayer).filter(Boolean) as Player[];
  const wings = slots.filter((s) => ["RW", "LW"].includes(s.role)).map((s) => s.assignedPlayer).filter(Boolean) as Player[];

  const imPower = ims.reduce((sum, p) => sum + p.skills.playmaker * (0.6 + p.form * 0.05), 0);
  const wingPower = wings.reduce((sum, p) => sum + p.skills.playmaker * 0.5 * (0.6 + p.form * 0.05), 0);
  const midfield = Math.round(Math.min(80, Math.max(10, (imPower + wingPower) * 2.2)));

  // Defense calculations
  const gkDef = (gk?.skills.keeper || 5) * 1.6 + (gk?.skills.defender || 3) * 0.5;
  const cdDef = defs.reduce((sum, p) => sum + p.skills.defender * (0.6 + p.form * 0.05), 0);

  const midDef = Math.round(Math.min(80, Math.max(10, (gkDef + cdDef * 0.9) * 1.5)));
  const rightDef = Math.round(Math.min(80, Math.max(10, (gkDef * 0.8 + cdDef * 0.6) * 1.4)));
  const leftDef = Math.round(Math.min(80, Math.max(10, (gkDef * 0.8 + cdDef * 0.6) * 1.4)));

  // Attack calculations
  const fwScoring = fws.reduce((sum, p) => sum + p.skills.scorer * (0.6 + p.form * 0.05), 0);
  const midPassing = mids.reduce((sum, p) => sum + p.skills.passer * 0.4 * (0.6 + p.form * 0.05), 0);
  const wingAtt = wings.reduce((sum, p) => sum + p.skills.winger * (0.6 + p.form * 0.05), 0);

  const midAtt = Math.round(Math.min(80, Math.max(10, (fwScoring + midPassing) * 1.6)));
  const rightAtt = Math.round(Math.min(80, Math.max(10, (wingAtt + fwScoring * 0.4) * 1.5)));
  const leftAtt = Math.round(Math.min(80, Math.max(10, (wingAtt + fwScoring * 0.4) * 1.5)));

  return {
    midfield,
    rightDef,
    midDef,
    leftDef,
    rightAtt,
    midAtt,
    leftAtt,
  };
}
