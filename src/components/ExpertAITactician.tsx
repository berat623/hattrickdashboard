"use client";

import { useState, useMemo } from "react";
import {
  Player,
  Match,
  SectorRatings,
  TacticalLineup,
} from "@/types/hattrick";
import {
  SupportedAttitude,
  SupportedFormation,
  SupportedTactic,
} from "@/lib/algorithms/lineup";
import {
  analyzeBestMatchLineupAI,
  AIMatchTacticOption,
} from "@/lib/algorithms/match-predictor";
import {
  Sparkles,
  Brain,
  ShieldAlert,
  Target,
  Trophy,
  CheckCircle2,
  Sliders,
  Swords,
  ArrowRight,
  Flame,
} from "lucide-react";

interface ExpertAITacticianProps {
  players: Player[];
  matches: Match[];
  currentLineup: TacticalLineup | null;
  onApplyAILineup: (
    lineup: TacticalLineup,
    formation: SupportedFormation,
    tactic: SupportedTactic,
    attitude: SupportedAttitude
  ) => void;
}

export function ExpertAITactician({
  players,
  matches,
  onApplyAILineup,
}: ExpertAITacticianProps) {
  const upcomingMatches = matches.filter((m) => m.status === "UPCOMING");
  const defaultMatch = upcomingMatches[0] || matches[0] || null;

  const [selectedMatchId, setSelectedMatchId] = useState<number>(
    defaultMatch?.id || 0
  );
  const [attitude, setAttitude] = useState<SupportedAttitude>("Normal");
  const [isHome, setIsHome] = useState<boolean>(
    defaultMatch ? defaultMatch.myTeamIsHome : true
  );
  const [showCustomOpponent, setShowCustomOpponent] = useState(false);

  // Opponent sector ratings (from match or custom sliders)
  const [oppMid, setOppMid] = useState(45);
  const [oppLeftDef, setOppLeftDef] = useState(42);
  const [oppMidDef, setOppMidDef] = useState(47);
  const [oppRightDef, setOppRightDef] = useState(40);
  const [oppLeftAtt, setOppLeftAtt] = useState(41);
  const [oppMidAtt, setOppMidAtt] = useState(44);
  const [oppRightAtt, setOppRightAtt] = useState(39);

  const activeMatch =
    matches.find((m) => m.id === selectedMatchId) || defaultMatch;

  const opponentRatings: SectorRatings = useMemo(() => {
    if (!showCustomOpponent && activeMatch?.awayRatings && activeMatch?.homeRatings) {
      return activeMatch.myTeamIsHome
        ? activeMatch.awayRatings
        : activeMatch.homeRatings;
    }
    return {
      midfield: oppMid,
      leftDef: oppLeftDef,
      midDef: oppMidDef,
      rightDef: oppRightDef,
      leftAtt: oppLeftAtt,
      midAtt: oppMidAtt,
      rightAtt: oppRightAtt,
    };
  }, [
    showCustomOpponent,
    activeMatch,
    oppMid,
    oppLeftDef,
    oppMidDef,
    oppRightDef,
    oppLeftAtt,
    oppMidAtt,
    oppRightAtt,
  ]);

  const aiReport = useMemo(() => {
    if (players.length === 0) return null;
    return analyzeBestMatchLineupAI(players, opponentRatings, isHome, attitude);
  }, [players, opponentRatings, isHome, attitude]);

  if (!aiReport) return null;

  const { bestOption, alternatives } = aiReport;

  const handleSelectOption = (opt: AIMatchTacticOption) => {
    onApplyAILineup(opt.lineup, opt.formation, opt.tactic, opt.attitude);
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-slate-900 via-emerald-950/90 to-slate-900 text-white shadow-2xl space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
            <Brain className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-400 text-slate-950">
                Uzman Yapay Zeka Taktik Motoru
              </span>
              <span className="text-xs text-emerald-300 font-semibold">
                36 Diziliş & Taktik Kombinasyonu Tarandı
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold mt-1">
              Maça Özel En İyi Diziliş & Rakip Zaaf Analizi
            </h3>
          </div>
        </div>

        {/* Match Selector & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {matches.length > 0 && (
            <select
              value={selectedMatchId}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedMatchId(id);
                const m = matches.find((item) => item.id === id);
                if (m) setIsHome(m.myTeamIsHome);
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-950/90 border border-white/20 text-white cursor-pointer"
            >
              {matches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.homeTeamName} vs {m.awayTeamName} (
                  {m.status === "UPCOMING" ? "Gelecek" : "Oynandı"})
                </option>
              ))}
            </select>
          )}

          <select
            value={attitude}
            onChange={(e) => setAttitude(e.target.value as SupportedAttitude)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-950/90 border border-white/20 text-emerald-300 cursor-pointer"
          >
            <option value="Gevşek">Gevşek (PIC)</option>
            <option value="Normal">Normal Motivasyon</option>
            <option value="Sezonun Maçı">Sezonun Maçı (MOTS)</option>
          </select>

          <button
            type="button"
            onClick={() => setShowCustomOpponent(!showCustomOpponent)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/15 text-white cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-300" />
            <span>{showCustomOpponent ? "Rakip Ayarını Kapat" : "Rakip Gücünü Ayarla"}</span>
          </button>
        </div>
      </div>

      {/* Optional Custom Opponent Rating Sliders */}
      {showCustomOpponent && (
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/15 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          {[
            { label: "Rakip Orta Saha", val: oppMid, set: setOppMid },
            { label: "Rakip Sol Def", val: oppLeftDef, set: setOppLeftDef },
            { label: "Rakip Mrk Def", val: oppMidDef, set: setOppMidDef },
            { label: "Rakip Sağ Def", val: oppRightDef, set: setOppRightDef },
            { label: "Rakip Sol Hüc", val: oppLeftAtt, set: setOppLeftAtt },
            { label: "Rakip Mrk Hüc", val: oppMidAtt, set: setOppMidAtt },
            { label: "Rakip Sağ Hüc", val: oppRightAtt, set: setOppRightAtt },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-300 font-semibold">
                <span>{item.label}</span>
                <strong className="text-emerald-400">{item.val}</strong>
              </div>
              <input
                type="range"
                min={10}
                max={80}
                value={item.val}
                onChange={(e) => item.set(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>
          ))}
        </div>
      )}

      {/* Main Grid: #1 Recommended Setup (7 cols) + Top 6 Tactical Alternatives (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: #1 AI Verdict & Tactical Breakdown */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white/5 border border-white/15 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-xl text-sm font-black bg-emerald-400 text-slate-950">
                  önerilen: {bestOption.formation}
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Taktik: {bestOption.tactic}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-extrabold">
                <span className="text-emerald-400">
                  Galibiyet: %{bestOption.winProb}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-amber-300">
                  {bestOption.expectedPoints} xPts
                </span>
              </div>
            </div>

            {/* Win / Draw / Loss Visual Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-emerald-400">
                  Kazanma: %{bestOption.winProb}
                </span>
                <span className="text-amber-300">
                  Beraberlik: %{bestOption.drawProb}
                </span>
                <span className="text-rose-400">
                  Kaybetme: %{bestOption.lossProb}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  className="bg-emerald-400 h-full"
                  style={{ width: `${bestOption.winProb}%` }}
                />
                <div
                  className="bg-amber-400 h-full"
                  style={{ width: `${bestOption.drawProb}%` }}
                />
                <div
                  className="bg-rose-500 h-full"
                  style={{ width: `${bestOption.lossProb}%` }}
                />
              </div>
            </div>

            {/* Key Findings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <div className="text-[10px] text-emerald-300 font-bold uppercase flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>Hedeflenen Rakip Zaafı</span>
                </div>
                <div className="font-extrabold text-white mt-0.5">
                  {aiReport.opponentWeakestDefSector}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25">
                <div className="text-[10px] text-rose-300 font-bold uppercase flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Rakibin En Tehlikeli Hattı</span>
                </div>
                <div className="font-extrabold text-white mt-0.5">
                  {aiReport.opponentStrongestAttSector}
                </div>
              </div>
            </div>

            {/* Bullet Insights */}
            <div className="space-y-1.5 text-xs text-slate-200">
              <p className="font-semibold text-emerald-300">
                💡 {aiReport.midfieldVerdict}
              </p>
              {aiReport.tacticalSummary.map((line, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSelectOption(bestOption)}
            className="w-full py-3.5 px-5 rounded-2xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 text-slate-950 hover:opacity-95 shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              ⚡ Önerilen {bestOption.formation} ({bestOption.tactic}) Kadrosunu Sahaya Uygula
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right 5 Cols: Top 6 Ranked Formation & Tactic Matrix */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                Kazanma Oranına Göre En İyi 6 Taktik
              </span>
              <span className="text-[10px] text-slate-400">
                Uygulamak için tıklayın
              </span>
            </div>

            <div className="space-y-2">
              {alternatives.map((opt, idx) => (
                <div
                  key={`${opt.formation}-${opt.tactic}`}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    idx === 0
                      ? "border-emerald-400 bg-emerald-500/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-white/15 text-[10px] font-black flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-extrabold text-white">
                        {opt.formation}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-bold truncate">
                        {opt.tactic}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-300 mt-1 truncate">
                      xG: {opt.expectedGoalsFor} - {opt.expectedGoalsAgainst} • Kadro:{" "}
                      {opt.lineup.totalRating.toFixed(1)}★
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-emerald-400">
                      %{opt.winProb} Galibiyet
                    </div>
                    <div className="text-[10px] text-amber-300 font-bold">
                      {opt.expectedPoints} xPts
                    </div>
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
