"use client";

import {
  SupportedFormation,
  SupportedTactic,
  SupportedAttitude,
} from "@/lib/algorithms/lineup";
import {
  Sparkles,
  Shield,
  Swords,
  Flame,
  CloudUpload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  KeyRound,
} from "lucide-react";

export interface ServerSyncReport {
  savedToServer: boolean;
  verifiedFromServer: boolean;
  requiresWriteScope?: boolean;
  message: string;
  serverFormation?: string;
  serverTactic?: string;
  hattrickMatchOrderUrl?: string;
  checkedAt?: string;
}

interface FormationSelectorProps {
  currentFormation: SupportedFormation;
  currentTactic: SupportedTactic;
  currentAttitude: SupportedAttitude;
  onFormationChange: (formation: SupportedFormation) => void;
  onTacticChange: (tactic: SupportedTactic) => void;
  onAttitudeChange: (attitude: SupportedAttitude) => void;
  onAutoLineup: () => void;
  onSaveToHattrickServer?: () => void;
  onReloadFromHattrickServer?: () => void;
  savingToServer?: boolean;
  serverSyncReport?: ServerSyncReport | null;
  serverSource?: "matchorders" | "matchlineup" | "auto";
  sourceOpponentName?: string;
  ordersGiven?: boolean;
  loading: boolean;
  totalRating: number;
}

export function FormationSelector({
  currentFormation,
  currentTactic,
  currentAttitude,
  onFormationChange,
  onTacticChange,
  onAttitudeChange,
  onAutoLineup,
  onSaveToHattrickServer,
  onReloadFromHattrickServer,
  savingToServer = false,
  serverSyncReport,
  serverSource,
  sourceOpponentName,
  ordersGiven,
  loading,
  totalRating,
}: FormationSelectorProps) {
  const formations: SupportedFormation[] = [
    "4-4-2",
    "3-5-2",
    "4-3-3",
    "4-5-1",
    "3-4-3",
    "5-3-2",
  ];
  const tactics: SupportedTactic[] = [
    "Normal",
    "Kanatlardan Hücum",
    "Ortadan Hücum",
    "Kontra Atak",
    "Baskı (Pressing)",
    "Uzaktan Şut",
    "Yaratıcı Oyna",
  ];
  const attitudes: { id: SupportedAttitude; label: string }[] = [
    { id: "Gevşek", label: "Gevşek (PIC - %85 OS)" },
    { id: "Normal", label: "Normal Motivasyon" },
    { id: "Sezonun Maçı", label: "Sezonun Maçı (MOTS - %115 OS)" },
  ];

  return (
    <div className="flex flex-col gap-3.5 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      {/* Row 0: Hattrick Game Server Sync & Verification Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              serverSource === "matchorders"
                ? "bg-emerald-500"
                : serverSource === "matchlineup"
                ? "bg-blue-500"
                : "bg-amber-500"
            }`}
          />
          <div className="text-xs min-w-0">
            <span className="font-extrabold text-slate-900 dark:text-white">
              Oyun Sunucusu Taktik Kaynağı:{" "}
            </span>
            <span className="text-slate-600 dark:text-slate-300 font-semibold">
              {serverSource === "matchorders"
                ? `Hattrick Gelecek Maç Emirleri (${currentFormation} • ${currentTactic})`
                : serverSource === "matchlineup"
                ? `Son Resmi Maç Kadrosu (${currentFormation} • ${currentTactic})${
                    ordersGiven === false
                      ? " — Gelecek maç emri henüz girilmemiş"
                      : ""
                  }`
                : `Panelde Düzenlenen Diziliş (${currentFormation} • ${currentTactic})`}
            </span>
            {sourceOpponentName && (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-1">
                • Rakip: {sourceOpponentName}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onReloadFromHattrickServer && (
            <button
              type="button"
              onClick={onReloadFromHattrickServer}
              disabled={savingToServer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-blue-500 ${
                  savingToServer ? "animate-spin" : ""
                }`}
              />
              <span>Sunucudaki Taktiği Kontrol Et</span>
            </button>
          )}

          {onSaveToHattrickServer && (
            <button
              type="button"
              onClick={onSaveToHattrickServer}
              disabled={savingToServer}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <CloudUpload className="w-3.5 h-3.5" />
              <span>
                {savingToServer
                  ? "Hattrick Sunucusuna Gönderiliyor..."
                  : "Hattrick Oyun Sistemine Kaydet & Doğrula"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Verification Report Alert if checked or saved */}
      {serverSyncReport && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            serverSyncReport.savedToServer
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
              : "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {serverSyncReport.savedToServer ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-extrabold">{serverSyncReport.message}</div>
              {serverSyncReport.checkedAt && (
                <div className="text-[11px] opacity-80">
                  Son Sunucu Kontrolü: {serverSyncReport.checkedAt}
                  {serverSyncReport.serverFormation
                    ? ` • Sunucudaki Kayıtlı Diziliş: ${serverSyncReport.serverFormation} (${
                        serverSyncReport.serverTactic || "Normal"
                      })`
                    : ""}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {serverSyncReport.requiresWriteScope && (
              <a
                href="/api/auth/hattrick/connect"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px]"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Yazma İzniyle Yeniden Bağla</span>
              </a>
            )}
            {serverSyncReport.hattrickMatchOrderUrl && (
              <a
                href={serverSyncReport.hattrickMatchOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 font-bold text-[11px]"
              >
                <span>Hattrick Maç Emirlerinde Aç</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Row 1: Formations + Total Rating + Auto Lineup Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          <span className="text-xs font-extrabold text-slate-400 mr-1 shrink-0">
            DİZİLİŞ:
          </span>
          {formations.map((form) => {
            const isActive = currentFormation === form;
            return (
              <button
                key={form}
                onClick={() => onFormationChange(form)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                    : "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {form}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              İlk 11 Toplam Gücü:
            </span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
              {totalRating.toFixed(1)}★
            </span>
          </div>

          <button
            onClick={onAutoLineup}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {loading
                ? "Hesaplanıyor..."
                : "⚡ En İyi Formasyonu Otomatik Diz"}
            </span>
          </button>
        </div>
      </div>

      {/* Row 2: Tactic & Match Attitude Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
            Taktik:
          </span>
          <select
            value={currentTactic}
            onChange={(e) => onTacticChange(e.target.value as SupportedTactic)}
            className="flex-1 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white cursor-pointer"
          >
            {tactics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
            Motivasyon:
          </span>
          <select
            value={currentAttitude}
            onChange={(e) =>
              onAttitudeChange(e.target.value as SupportedAttitude)
            }
            className="flex-1 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white cursor-pointer"
          >
            {attitudes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
