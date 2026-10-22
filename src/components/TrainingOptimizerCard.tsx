"use client";

import { useState } from "react";
import { TrainingData, TrainingRecommendation } from "@/types/hattrick";
import { Dumbbell, Sparkles, CheckCircle2, TrendingUp, Clock, Users, ArrowRight } from "lucide-react";

interface TrainingOptimizerProps {
  currentTraining: TrainingData | null;
  recommendation: TrainingRecommendation | null;
  onApplyTraining: (typeId: number, staminaShare: number) => Promise<void>;
}

export function TrainingOptimizerCard({
  currentTraining,
  recommendation,
  onApplyTraining,
}: TrainingOptimizerProps) {
  const [applying, setApplying] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleApply = async () => {
    if (!recommendation) return;
    setApplying(true);
    try {
      await onApplyTraining(recommendation.recommendedTypeId, recommendation.recommendedStaminaShare);
      setSuccessMsg("Antrenman başarıyla otomatik optimize edildi!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner: AI Optimization Summary */}
      <div className="p-5 rounded-2xl border border-emerald-300 dark:border-emerald-800/80 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 dark:to-slate-900/40 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Yapay Zeka Otomatik Antrenman Analizi
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">
                  Öneri Hazır
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {recommendation?.reason || "Kadro oyuncuları taranarak en yüksek verim sağlayan antrenman tipi hesaplandı."}
              </p>
            </div>
          </div>

          <button
            onClick={handleApply}
            disabled={applying || !recommendation}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all shadow-md shadow-emerald-600/30 whitespace-nowrap disabled:opacity-50"
          >
            <Dumbbell className="w-4 h-4" />
            <span>{applying ? "Uygulanıyor..." : "⚡ Önerilen Antrenmanı Uygula"}</span>
          </button>
        </div>

        {successMsg && (
          <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-400 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Comparison Grid: Current vs AI Recommended */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current State */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              MEVCUT ANTRENMAN
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Aktif
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Antrenman Tipi</div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {currentTraining?.trainingTypeName || "Oyun Kuruculuk"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                <div className="text-[10px] text-slate-400 font-medium">Yoğunluk</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  %{currentTraining?.trainingLevel || 100}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                <div className="text-[10px] text-slate-400 font-medium">Kondisyon Payı</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  %{currentTraining?.staminaTrainingPart || 15}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommended State */}
        <div className="p-4 rounded-xl border border-emerald-400/60 dark:border-emerald-600/60 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-200 dark:border-emerald-900/60">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              YAPAY ZEKA ÖNERİSİ
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
              En Yüksek ROI
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Önerilen Odak</div>
              <div className="text-base font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                {recommendation?.recommendedType || "Oyun Kuruculuk (Playmaking)"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80">
                <div className="text-[10px] text-slate-400 font-medium">Önerilen Yoğunluk</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  %100 (Maksimum Hız)
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80">
                <div className="text-[10px] text-slate-400 font-medium">İdeal Kondisyon Payı</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  %{recommendation?.recommendedStaminaShare || 15}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trainees List: Genç Yetenek Gelişim Tablosu */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Antrenmandan Yararlanan Genç Yetenekler ({recommendation?.trainees.length || 0} Oyuncu)
            </h4>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Haftalık atlama projeksiyonu
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recommendation?.trainees.map((trainee) => (
            <div
              key={trainee.id}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {trainee.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    {trainee.age} yaş
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Yetenek: {trainee.currentSkill}</span>
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-600 font-bold">{trainee.targetSkill}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>Tahmini Süre: <strong>{trainee.estimatedWeeks} hafta</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
