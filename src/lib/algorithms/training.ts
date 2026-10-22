import { Player, TrainingRecommendation } from "@/types/hattrick";

export function analyzeAndOptimizeTraining(players: Player[]): TrainingRecommendation {
  // Young players under 22 are the primary trainees in Hattrick
  const youngsters = players.filter((p) => p.age <= 21);

  // Group youngster talent pools
  const playmakers = youngsters.filter((p) => p.skills.playmaker >= 10);
  const defenders = youngsters.filter((p) => p.skills.defender >= 10);
  const wingers = youngsters.filter((p) => p.skills.winger >= 10);
  const scorers = youngsters.filter((p) => p.skills.scorer >= 10);

  // Average team age to determine optimal stamina share
  const avgAge = players.reduce((sum, p) => sum + p.age, 0) / players.length;
  // If squad has veterans > 28, increase stamina share up to 18-20%, if young keep around 12-15%
  let recommendedStaminaShare = 15;
  if (avgAge > 27) recommendedStaminaShare = 20;
  else if (avgAge > 25) recommendedStaminaShare = 18;
  else if (avgAge < 22) recommendedStaminaShare = 12;

  // Score training categories (using official Hattrick CHPP TrainingType IDs)
  const categories = [
    {
      name: "Oyun Kuruculuk (Playmaking)",
      id: 9,
      candidates: playmakers,
      targetSkillKey: "playmaker" as const,
      maxSlots: 6, // 6 full training slots for IMs in 2 matches a week
    },
    {
      name: "Defans (Defending)",
      id: 4,
      candidates: defenders,
      targetSkillKey: "defender" as const,
      maxSlots: 10, // 10 slots for defenders in 2 matches
    },
    {
      name: "Golcülük (Scoring)",
      id: 5,
      candidates: scorers,
      targetSkillKey: "scorer" as const,
      maxSlots: 6, // 6 slots for forwards
    },
    {
      name: "Kanat (Crossing / Winger)",
      id: 6,
      candidates: wingers,
      targetSkillKey: "winger" as const,
      maxSlots: 4, // 4 slots for wingers
    },
  ];

  // Pick category with highest potential (count of young high-potential trainees)
  categories.sort((a, b) => {
    const scoreA = a.candidates.reduce((sum, p) => sum + (22 - p.age) * p.skills[a.targetSkillKey], 0);
    const scoreB = b.candidates.reduce((sum, p) => sum + (22 - p.age) * p.skills[b.targetSkillKey], 0);
    return scoreB - scoreA;
  });

  const best = categories[0];

  const trainees = best.candidates.slice(0, best.maxSlots).map((p) => {
    const curSkill = p.skills[best.targetSkillKey];
    // In Hattrick, training weeks roughly = (age - 10) * 0.4 + curSkill * 0.25 (scaled by 100% training)
    const weeksNeeded = Math.max(4, Math.round((p.age - 14) * 0.8 + (curSkill - 8) * 0.3));

    return {
      id: p.id,
      name: p.name,
      age: p.age,
      currentSkill: curSkill,
      targetSkill: curSkill + 1,
      estimatedWeeks: weeksNeeded,
    };
  });

  return {
    recommendedType: best.name,
    recommendedTypeId: best.id,
    recommendedStaminaShare,
    reason: `Kadronuzda ${best.candidates.length} adet 18-21 yaş arası genç ${best.name} potansiyeli tespit edildi. Bu antrenman haftalık değer ve TSI artışını maksimize eder.`,
    suitablePlayersCount: best.candidates.length,
    trainees,
  };
}
