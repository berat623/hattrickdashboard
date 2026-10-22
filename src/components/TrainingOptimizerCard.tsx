"use client";

import { useState } from "react";
import { TrainingData, TrainingRecommendation, Player } from "@/types/hattrick";
import { getHattrickSkillName } from "@/lib/algorithms/lineup";
import { PlayerAvatar } from "./PlayerAvatar";
import {
  Dumbbell,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  ArrowRight,
  Sliders,
  KeyRound,
} from "lucide-react";

interface TrainingOptimizerProps {
  currentTraining: TrainingData | null;
  recommendation: TrainingRecommendation | null;
  players?: Player[];
  onApplyTraining: (
    typeId: number,
    staminaShare: number
  ) => Promise<{
    savedToServer: boolean;
    requiresWriteScope?: boolean;
    message: string;
  } | void>;
  onSelectPlayer?: (player: Player) => void;
}

const TRAINING_OPTIONS = [
  { id: 4, name: "Defans (Defending)", skillKey: "defender" as const },
  { id: 5, name: "Golcülük (Scoring)", skillKey: "scorer" as const },
  { id: 6, name: "Kanat (Crossing / Winger)", skillKey: "winger" as const },
  { id: 8, name: "Kısa Pas (Short Passes)", skillKey: "passer" as const },
  { id: 9, name: "Oyun Kuruculuk (Playmaking)", skillKey: "playmaker" as const },
  { id: 10, name: "Kalecilik (Goalkeeping)", skillKey: "keeper" as const },
  { id: 3, name: "Duran Top (Set Pieces)", skillKey: "setPieces" as const },
];

export function TrainingOptimizerCard({
  currentTraining,
  recommendation,
  players = [],
  onApplyTraining,
  onSelectPlayer,
}: TrainingOptimizerProps) {
  const [applying, setApplying] = useState(false);
  const [serverVerifyStatus, setServerVerifyStatus] = useState<{
    savedToServer: boolean;
    requiresWriteScope?: boolean;
    message: string;
  } | null>(null);

  const [selectedTypeId, setSelectedTypeId] = useState<number>(
    currentTraining?.trainingType || recommendation?.recommendedTypeId || 9
  );
  const [staminaShare, setStaminaShare] = useState<number>(
    currentTraining?.staminaTrainingPart ||
      recommendation?.recommendedStaminaShare ||
      15
  );
  const [coachLevel, setCoachLevel] = useState<number>(
    currentTraining?.coachSkill || 7
  );
  const [assistants, setAssistants] = useState<number>(10);

  const handleApply = async (typeId: number, stam: number) => {
    setApplying(true);
    setServerVerifyStatus(null);
    try {
      const res = await onApplyTraining(typeId, stam);
      if (res && typeof res === "object" && "message" in res) {
        setServerVerifyStatus(res);
      } else {
        setServerVerifyStatus({
          savedToServer: true,
          message: "Antrenman programı güncellendi.",
        });
      }
    } finally {
      setApplying(false);
    }
  };

  const activeOption =
    TRAINING_OPTIONS.find((t) => t.id === selectedTypeId) || TRAINING_OPTIONS[4];

  // Calculate dynamic speed multiplier based on Coach (5-8), Assistants (0-10), Stamina (10-30)
  const coachFactor = 1 - (coachLevel - 7) * 0.08;
  const assistantFactor = 1 - (assistants - 5) * 0.025;
  const staminaFactor = 1 + (staminaShare - 15) * 0.012;

  const simulatedTrainees =
    players.length > 0
      ? [...players]
          .filter((p) => p.age <= 24)
          .sort((a, b) => a.age - b.age)
          .slice(0, 8)
          .map((p) => {
            const currentLvl = p.skills[activeOption.skillKey] || 6;
            const baseWeeks = Math.max(
              2,
              Math.round(
                (3.2 + (p.age - 17) * 0.65 + currentLvl * 0.35) *
                  coachFactor *
                  assistantFactor *
                  staminaFactor
              )
            );
            return {
              player: p,
              currentSkill: currentLvl,
              targetSkill: Math.min(20, currentLvl + 1),
              estimatedWeeks: baseWeeks,
            };
          })
      : [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Banner: AI Optimization Summary */}
      <div className="p-5 sm:p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white dark:to-slate-900 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  Yapay Zeka Otomatik Antrenman Analizi
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950">
                  Maksimum Gelişim
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {recommendation?.reason ||
                  "Kadrodaki genç oyuncularınızın yaş ve yetenek dağılımına göre en yüksek piyasa değeri artışı sağlayan antrenman hesaplandı."}
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              recommendation &&
              handleApply(
                recommendation.recommendedTypeId,
                recommendation.recommendedStaminaShare
              )
            }
            disabled={applying || !recommendation}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-emerald-500/25 whitespace-nowrap disabled:opacity-50 cursor-pointer"
          >
            <Dumbbell className="w-4 h-4" />
            <span>
              {applying
                ? "Hattrick Sunucusuna Gönderiliyor..."
                : "⚡ AI Önerisini Sunucuya Kaydet & Doğrula"}
            </span>
          </button>
        </div>

        {serverVerifyStatus && (
          <div
            className={`mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border text-xs font-bold ${
              serverVerifyStatus.savedToServer
                ? "bg-emerald-500/15 border-emerald-400 text-emerald-800 dark:text-emerald-200"
                : "bg-amber-500/15 border-amber-400 text-amber-900 dark:text-amber-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {serverVerifyStatus.savedToServer ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span>{serverVerifyStatus.message}</span>
            </div>
            {serverVerifyStatus.requiresWriteScope && (
              <a
                href="/api/auth/hattrick/connect"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-[11px] shrink-0"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Yazma İzniyle Yeniden Bağla</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Interactive Training Lab & Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Current vs AI Recommended */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-extrabold text-slate-400 uppercase">
                SUNUCUDAKİ MEVCUT ANTRENMAN DURUMU
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                CHPP Sunucu Kaydı
              </span>
            </div>
            <div>
              <div className="text-xs text-slate-500">Antrenman Odak Noktası</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                {currentTraining?.trainingTypeName || "Oyun Kuruculuk"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold">
                  YOĞUNLUK
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  %{currentTraining?.trainingLevel || 100}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold">
                  KONDİSYON PAYI
                </div>
                <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  %{currentTraining?.staminaTrainingPart || 15}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulator Box */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Sliders className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                İnteraktif Antrenman Hızı Simülatörü
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Simüle Edilecek Antrenman Tipi:
                </label>
                <select
                  value={selectedTypeId}
                  onChange={(e) => setSelectedTypeId(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  {TRAINING_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Antrenör Seviyesi:</span>
                    <span className="text-emerald-500">{coachLevel}/8</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={8}
                    value={coachLevel}
                    onChange={(e) => setCoachLevel(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Yardımcı Antrenör:</span>
                    <span className="text-emerald-500">{assistants} Kişi</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={assistants}
                    onChange={(e) => setAssistants(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Kondisyon Payı:</span>
                  <span className="text-amber-500">%{staminaShare}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={30}
                  value={staminaShare}
                  onChange={(e) => setStaminaShare(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={() => handleApply(selectedTypeId, staminaShare)}
                disabled={applying}
                className="w-full py-2.5 px-4 rounded-xl font-bold bg-slate-900 dark:bg-emerald-600 text-white hover:opacity-90 transition-all cursor-pointer"
              >
                {applying
                  ? "Hattrick Sunucusuna Gönderiliyor..."
                  : `Sunucuya Kaydet & Kontrol Et (%${staminaShare} Kondisyon)`}
              </button>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Trainee Progression Cards */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Genç Yetenek Seviye Atlama Projeksiyonu ({activeOption.name})
                </h4>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                24 Yaş Altı Kadro
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {simulatedTrainees.map((item) => (
                <div
                  key={item.player.id}
                  onClick={() => onSelectPlayer?.(item.player)}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 hover:border-emerald-500/50 cursor-pointer transition-all flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <PlayerAvatar
                      avatar={item.player.avatar}
                      name={item.player.name}
                      shirtNumber={item.player.shirtNumber}
                      size="xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {item.player.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                          {item.player.age}y {item.player.ageDays}g
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>
                          {getHattrickSkillName(item.currentSkill)} ({item.currentSkill})
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {getHattrickSkillName(item.targetSkill)} ({item.targetSkill})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-slate-800/80 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      Tahmini Süre:
                    </span>
                    <strong className="text-slate-900 dark:text-white">
                      {item.estimatedWeeks} Hafta
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
