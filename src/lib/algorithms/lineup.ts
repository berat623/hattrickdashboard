import { Player, TacticalLineup, FormationSlot, PositionCode, SectorRatings } from "@/types/hattrick";

export type SupportedFormation = "4-4-2" | "3-5-2" | "4-3-3" | "4-5-1" | "3-4-3" | "5-3-2";
export type SupportedTactic =
  | "Normal"
  | "Kanatlardan Hücum"
  | "Ortadan Hücum"
  | "Kontra Atak"
  | "Uzaktan Şut"
  | "Yaratıcı Oyna";
export type SupportedAttitude = "Normal" | "Sezonun Maçı" | "Gevşek";

export const HATTRICK_SKILL_NAMES: Record<number, string> = {
  0: "Yok",
  1: "Felaket",
  2: "Sefil",
  3: "Kötü",
  4: "Zayıf",
  5: "Yetersiz",
  6: "Geçer",
  7: "İyi",
  8: "Mükemmel",
  9: "Harika",
  10: "Olağanüstü",
  11: "Muhteşem",
  12: "Dünya Çapında",
  13: "Doğaüstü",
  14: "Titanik",
  15: "Dünya Dışı",
  16: "Efsanevi",
  17: "Sihirli",
  18: "Ütopik",
  19: "İlahi",
  20: "İlahi+",
};

export function getHattrickSkillName(level: number): string {
  const clamped = Math.max(0, Math.min(20, Math.round(level)));
  return HATTRICK_SKILL_NAMES[clamped] || `Seviye ${clamped}`;
}

export function estimatePlayerMarketValue(player: Player): number {
  const maxSkill = Math.max(
    player.skills.keeper,
    player.skills.defender,
    player.skills.playmaker,
    player.skills.winger,
    player.skills.passer,
    player.skills.scorer
  );
  const ageFactor = player.age <= 19 ? 1.85 : player.age <= 22 ? 1.45 : player.age <= 27 ? 1.15 : player.age <= 30 ? 0.75 : 0.35;
  const specBonus = player.specialty && player.specialty !== "Yok" ? 1.18 : 1.0;
  const baseValue = player.tsi * 420 + Math.pow(maxSkill, 3.1) * 18000;
  return Math.round((baseValue * ageFactor * specBonus) / 10000) * 10000;
}

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
    { id: "fw1", role: "FW", x: 20, y: 20, label: "Sol Forvet" },
    { id: "fw2", role: "FW", x: 50, y: 16, label: "Merkez Forvet" },
    { id: "fw3", role: "FW", x: 80, y: 20, label: "Sağ Forvet" },
  ],
  "4-5-1": [
    { id: "gk", role: "GK", x: 50, y: 88, label: "Kaleci" },
    { id: "lb", role: "LB", x: 15, y: 70, label: "Sol Bek" },
    { id: "cd1", role: "CD", x: 38, y: 72, label: "Sol Stoper" },
    { id: "cd2", role: "CD", x: 62, y: 72, label: "Sağ Stoper" },
    { id: "rb", role: "RB", x: 85, y: 70, label: "Sağ Bek" },
    { id: "lw", role: "LW", x: 12, y: 44, label: "Sol Kanat" },
    { id: "im1", role: "IM", x: 31, y: 47, label: "İç Saha (Sol)" },
    { id: "im2", role: "IM", x: 50, y: 50, label: "Merkez Orta Saha" },
    { id: "im3", role: "IM", x: 69, y: 47, label: "İç Saha (Sağ)" },
    { id: "rw", role: "RW", x: 88, y: 44, label: "Sağ Kanat" },
    { id: "fw1", role: "FW", x: 50, y: 18, label: "Tek Forvet" },
  ],
  "3-4-3": [
    { id: "gk", role: "GK", x: 50, y: 88, label: "Kaleci" },
    { id: "cd1", role: "CD", x: 25, y: 72, label: "Sol Stoper" },
    { id: "cd2", role: "CD", x: 50, y: 74, label: "Merkez Stoper" },
    { id: "cd3", role: "CD", x: 75, y: 72, label: "Sağ Stoper" },
    { id: "lw", role: "LW", x: 15, y: 46, label: "Sol Kanat" },
    { id: "im1", role: "IM", x: 38, y: 48, label: "İç Saha (Sol)" },
    { id: "im2", role: "IM", x: 62, y: 48, label: "İç Saha (Sağ)" },
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
    { id: "im1", role: "IM", x: 28, y: 47, label: "İç Saha (Sol)" },
    { id: "im2", role: "IM", x: 50, y: 49, label: "Merkez Orta Saha" },
    { id: "im3", role: "IM", x: 72, y: 47, label: "İç Saha (Sağ)" },
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
  const loyaltyBonus = (player.loyalty || 10) * 0.03;

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

  return Math.round((baseScore * formMult * stamMult + expBonus + loyaltyBonus) * 10) / 10;
}

export function getAllRoleScoresForPlayer(player: Player): { role: PositionCode; label: string; score: number }[] {
  const roles: { role: PositionCode; label: string }[] = [
    { role: "GK", label: "Kaleci (GK)" },
    { role: "CD", label: "Stoper (CD)" },
    { role: "RB", label: "Kanat Bek (RB/LB)" },
    { role: "IM", label: "Orta Saha (IM)" },
    { role: "RW", label: "Kanat (RW/LW)" },
    { role: "FW", label: "Forvet (FW)" },
  ];
  return roles.map((r) => ({
    ...r,
    score: getPlayerScoreForRole({ ...player, injuryDays: 0 }, r.role),
  }));
}

/**
 * Otomatik Kadro Dizilimi Algoritması
 * Verilen oyuncu havuzundan seçilen formasyona (veya en yüksek verimli formasyona) en uygun 11'i ve yedekleri dizer.
 */
export function generateAutoLineup(
  players: Player[],
  preferredFormation?: SupportedFormation,
  tactic: SupportedTactic = "Normal",
  attitude: SupportedAttitude = "Normal"
): TacticalLineup {
  const healthyPlayers = players.filter((p) => p.injuryDays === 0);

  const formationsToTest: SupportedFormation[] = preferredFormation
    ? [preferredFormation]
    : ["4-4-2", "3-5-2", "4-3-3", "4-5-1", "3-4-3", "5-3-2"];

  let bestLineup: TacticalLineup | null = null;
  let maxTotalRating = -1;

  for (const form of formationsToTest) {
    const lineup = buildLineupForFormation(healthyPlayers, form, tactic, attitude);
    if (lineup.totalRating > maxTotalRating) {
      maxTotalRating = lineup.totalRating;
      bestLineup = lineup;
    }
  }

  return bestLineup!;
}

export function updateLineupTactics(
  lineup: TacticalLineup,
  tactic: SupportedTactic,
  attitude: SupportedAttitude,
  captainId?: number,
  setPiecesTakerId?: number
): TacticalLineup {
  const sectorRatings = calculateLineupSectorRatings(lineup.slots, tactic, attitude);
  return {
    ...lineup,
    tactic,
    attitude,
    captainId: captainId ?? lineup.captainId,
    setPiecesTakerId: setPiecesTakerId ?? lineup.setPiecesTakerId,
    sectorRatings,
  };
}

export function swapPlayerInSlot(
  lineup: TacticalLineup,
  targetSlotId: string,
  newPlayer: Player
): TacticalLineup {
  const targetSlot = lineup.slots.find((s) => s.id === targetSlotId);
  if (!targetSlot) return lineup;

  const previousPlayer = targetSlot.assignedPlayer;
  const existingStarterSlot = lineup.slots.find((s) => s.assignedPlayer?.id === newPlayer.id);
  const existingSubIdx = lineup.substitutes.findIndex((sub) => sub.player?.id === newPlayer.id);

  const updatedSlots = lineup.slots.map((slot) => {
    if (slot.id === targetSlotId) {
      return {
        ...slot,
        playerId: newPlayer.id,
        assignedPlayer: newPlayer,
        rating: getPlayerScoreForRole(newPlayer, slot.role),
      };
    }
    if (existingStarterSlot && slot.id === existingStarterSlot.id) {
      return {
        ...slot,
        playerId: previousPlayer?.id,
        assignedPlayer: previousPlayer,
        rating: previousPlayer ? getPlayerScoreForRole(previousPlayer, slot.role) : 0,
      };
    }
    return slot;
  });

  const updatedSubs = [...lineup.substitutes];
  if (existingSubIdx !== -1) {
    updatedSubs[existingSubIdx] = {
      ...updatedSubs[existingSubIdx],
      playerId: previousPlayer?.id,
      player: previousPlayer,
    };
  }

  const sectorRatings = calculateLineupSectorRatings(updatedSlots, lineup.tactic, lineup.attitude);
  const totalRating =
    Math.round(updatedSlots.reduce((acc, s) => acc + (s.rating || 0), 0) * 10) / 10;

  return {
    ...lineup,
    slots: updatedSlots,
    substitutes: updatedSubs,
    totalRating,
    sectorRatings,
  };
}

function buildLineupForFormation(
  players: Player[],
  formation: SupportedFormation,
  tactic: SupportedTactic = "Normal",
  attitude: SupportedAttitude = "Normal"
): TacticalLineup {
  const templates = FORMATION_SLOTS[formation];
  const assignedPlayerIds = new Set<number>();
  const slots: FormationSlot[] = [];

  const unassignedSlots = [...templates];

  // 1. Assign GK first
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

  // 2. Assign other positions by matching optimal roles
  const nonGkSlots = unassignedSlots.filter((s) => s.role !== "GK");
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

  // 5. Select Set Pieces Taker
  const setPiecesTaker = [...starters].sort((a, b) => b.skills.setPieces - a.skills.setPieces)[0];

  // 6. Calculate Sector Ratings
  const sectorRatings = calculateLineupSectorRatings(slots, tactic, attitude);
  const totalRating =
    Math.round(slots.reduce((acc, s) => acc + (s.rating || 0), 0) * 10) / 10;

  return {
    formation,
    tactic,
    attitude,
    captainId: captain?.id,
    setPiecesTakerId: setPiecesTaker?.id,
    slots,
    substitutes,
    totalRating,
    sectorRatings,
  };
}

/**
 * Calculates estimated sector ratings based on players placed in the slots, tactic, and attitude
 */
export function calculateLineupSectorRatings(
  slots: FormationSlot[],
  tactic: SupportedTactic = "Normal",
  attitude: SupportedAttitude = "Normal"
): SectorRatings {
  const gk = slots.find((s) => s.role === "GK")?.assignedPlayer;
  const defs = slots
    .filter((s) => ["CD", "RB", "LB"].includes(s.role))
    .map((s) => s.assignedPlayer)
    .filter(Boolean) as Player[];
  const mids = slots
    .filter((s) => ["IM", "RW", "LW"].includes(s.role))
    .map((s) => s.assignedPlayer)
    .filter(Boolean) as Player[];
  const fws = slots
    .filter((s) => s.role === "FW")
    .map((s) => s.assignedPlayer)
    .filter(Boolean) as Player[];

  const ims = slots
    .filter((s) => s.role === "IM")
    .map((s) => s.assignedPlayer)
    .filter(Boolean) as Player[];
  const wings = slots
    .filter((s) => ["RW", "LW"].includes(s.role))
    .map((s) => s.assignedPlayer)
    .filter(Boolean) as Player[];

  const attitudeMult =
    attitude === "Sezonun Maçı" ? 1.15 : attitude === "Gevşek" ? 0.85 : 1.0;

  const imPower = ims.reduce((sum, p) => sum + p.skills.playmaker * (0.6 + p.form * 0.05), 0);
  const wingPower = wings.reduce(
    (sum, p) => sum + p.skills.playmaker * 0.5 * (0.6 + p.form * 0.05),
    0
  );
  let midfield = Math.round(
    Math.min(80, Math.max(10, (imPower + wingPower) * 2.2 * attitudeMult))
  );

  // Defense calculations
  const gkDef = (gk?.skills.keeper || 5) * 1.6 + (gk?.skills.defender || 3) * 0.5;
  const cdDef = defs.reduce((sum, p) => sum + p.skills.defender * (0.6 + p.form * 0.05), 0);

  let midDef = Math.round(Math.min(80, Math.max(10, (gkDef + cdDef * 0.9) * 1.5)));
  let rightDef = Math.round(Math.min(80, Math.max(10, (gkDef * 0.8 + cdDef * 0.6) * 1.4)));
  let leftDef = Math.round(Math.min(80, Math.max(10, (gkDef * 0.8 + cdDef * 0.6) * 1.4)));

  // Attack calculations
  const fwScoring = fws.reduce((sum, p) => sum + p.skills.scorer * (0.6 + p.form * 0.05), 0);
  const midPassing = mids.reduce(
    (sum, p) => sum + p.skills.passer * 0.4 * (0.6 + p.form * 0.05),
    0
  );
  const wingAtt = wings.reduce((sum, p) => sum + p.skills.winger * (0.6 + p.form * 0.05), 0);

  let midAtt = Math.round(Math.min(80, Math.max(10, (fwScoring + midPassing) * 1.6)));
  let rightAtt = Math.round(Math.min(80, Math.max(10, (wingAtt + fwScoring * 0.4) * 1.5)));
  let leftAtt = Math.round(Math.min(80, Math.max(10, (wingAtt + fwScoring * 0.4) * 1.5)));

  // Tactic modifiers
  if (tactic === "Kanatlardan Hücum") {
    rightAtt = Math.min(80, Math.round(rightAtt * 1.12));
    leftAtt = Math.min(80, Math.round(leftAtt * 1.12));
    midDef = Math.max(10, Math.round(midDef * 0.9));
  } else if (tactic === "Ortadan Hücum") {
    midAtt = Math.min(80, Math.round(midAtt * 1.15));
    rightDef = Math.max(10, Math.round(rightDef * 0.9));
    leftDef = Math.max(10, Math.round(leftDef * 0.9));
  } else if (tactic === "Kontra Atak") {
    midDef = Math.min(80, Math.round(midDef * 1.08));
    midfield = Math.max(10, Math.round(midfield * 0.93));
  } else if (tactic === "Uzaktan Şut") {
    midAtt = Math.max(10, Math.round(midAtt * 0.92));
    midfield = Math.min(80, Math.round(midfield * 1.05));
  } else if (tactic === "Yaratıcı Oyna") {
    midAtt = Math.min(80, Math.round(midAtt * 1.06));
    rightAtt = Math.min(80, Math.round(rightAtt * 1.06));
    leftAtt = Math.min(80, Math.round(leftAtt * 1.06));
    midDef = Math.max(10, Math.round(midDef * 0.92));
  }

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
