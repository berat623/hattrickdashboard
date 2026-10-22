"use client";

import { useEffect, useState } from "react";
import { Navbar, NavTab } from "@/components/Navbar";
import { PitchBoard } from "@/components/PitchBoard";
import { FormationSelector } from "@/components/FormationSelector";
import { PlayersTable } from "@/components/PlayersTable";
import { TrainingOptimizerCard } from "@/components/TrainingOptimizerCard";
import { MatchCenter } from "@/components/MatchCenter";
import { DashboardOverview } from "@/components/DashboardOverview";
import { HattrickConnectModal } from "@/components/HattrickConnectModal";
import { SupportedFormation } from "@/lib/algorithms/lineup";
import { 
  Player, 
  TeamDetails, 
  TacticalLineup, 
  TrainingData, 
  Match, 
  UserSession, 
  TrainingRecommendation 
} from "@/types/hattrick";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [user, setUser] = useState<UserSession>({
    id: "user-1",
    email: "berat.torun@gmail.com",
    name: "Berat Torun",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    googleLoggedIn: true,
    hattrickConnected: false,
    hattrickUsername: "berat623",
    hattrickTeamId: 1042319,
    hattrickTeamName: "Anadolu Kartalları SK",
    demoMode: true,
  });

  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [lineup, setLineup] = useState<TacticalLineup | null>(null);
  const [training, setTraining] = useState<TrainingData | null>(null);
  const [trainingRec, setTrainingRec] = useState<TrainingRecommendation | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLineup, setLoadingLineup] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Initial Data Fetching
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // 1. User Session
        const userRes = await fetch("/api/auth/me").then((r) => r.json()).catch(() => null);
        if (userRes?.user) {
          setUser(userRes.user);
        }

        // 2. Team Details
        const teamRes = await fetch("/api/hattrick/team").then((r) => r.json()).catch(() => null);
        if (teamRes?.team) setTeam(teamRes.team);

        // 3. Players
        const playersRes = await fetch("/api/hattrick/players").then((r) => r.json()).catch(() => null);
        if (playersRes?.players) setPlayers(playersRes.players);

        // 4. Initial Auto Lineup
        const lineupRes = await fetch("/api/hattrick/lineup/auto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formation: "3-5-2" }),
        }).then((r) => r.json()).catch(() => null);
        if (lineupRes?.lineup) setLineup(lineupRes.lineup);

        // 5. Training & Recommendation
        const trainingRes = await fetch("/api/hattrick/training").then((r) => r.json()).catch(() => null);
        if (trainingRes?.training) setTraining(trainingRes.training);

        const recRes = await fetch("/api/hattrick/training/optimize").then((r) => r.json()).catch(() => null);
        if (recRes?.recommendation) setTrainingRec(recRes.recommendation);

        // 6. Matches
        const matchesRes = await fetch("/api/hattrick/matches").then((r) => r.json()).catch(() => null);
        if (matchesRes?.matches) setMatches(matchesRes.matches);
      } catch (err) {
        console.error("Dashboard init error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Check URL parameters for OAuth callbacks
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("ht_connected")) {
      showToast("Hattrick CHPP bağlantısı başarıyla tamamlandı!");
      window.history.replaceState({}, "", "/");
    } else if (params.get("google_connected")) {
      showToast("Google hesabı başarıyla bağlandı!");
      window.history.replaceState({}, "", "/");
    } else if (params.get("auth_error")) {
      showToast(decodeURIComponent(params.get("auth_error") || "Yetkilendirme hatası"), "error");
      window.history.replaceState({}, "", "/");
    }
  }, []);

  // Handle Formation Change or Auto Lineup
  const handleAutoLineup = async (preferredFormation?: SupportedFormation) => {
    setLoadingLineup(true);
    try {
      const res = await fetch("/api/hattrick/lineup/auto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formation: preferredFormation }),
      });
      const data = await res.json();
      if (data.ok && data.lineup) {
        setLineup(data.lineup);
        showToast(data.message || "Kadro başarıyla dizildi!");
      }
    } catch {
      showToast("Kadro dizilirken hata meydana geldi", "error");
    } finally {
      setLoadingLineup(false);
    }
  };

  // Toggle Demo Mode
  const handleToggleDemoMode = async () => {
    try {
      const res = await fetch("/api/auth/hattrick/demo-toggle", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setUser((prev) => ({ ...prev, demoMode: data.demoMode }));
        showToast(data.demoMode ? "Demo Modu aktif edildi" : "Canlı CHPP Modu aktif edildi");
        window.location.reload();
      }
    } catch {
      showToast("Mod değiştirilemedi", "error");
    }
  };

  // Apply Training Recommendation
  const handleApplyTraining = async (typeId: number, staminaShare: number) => {
    const res = await fetch("/api/hattrick/training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainingType: typeId, staminaTrainingPart: staminaShare }),
    });
    const data = await res.json();
    if (data.ok) {
      setTraining((prev) =>
        prev
          ? {
              ...prev,
              trainingType: typeId,
              trainingTypeName: trainingRec?.recommendedType || prev.trainingTypeName,
              staminaTrainingPart: staminaShare,
            }
          : null
      );
      showToast("Yeni antrenman programı kaydedildi!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold backdrop-blur-md animate-fade-in bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800">
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        team={team}
        onOpenSettings={() => setSettingsOpen(true)}
        onToggleDemoMode={handleToggleDemoMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Hattrick verileri yükleniyor ve yapay zeka analiz ediliyor...
            </p>
          </div>
        ) : (
          <>
            {/* Tab 1: Genel Bakış */}
            {activeTab === "dashboard" && (
              <DashboardOverview
                team={team}
                lineup={lineup}
                training={training}
                matches={matches}
                players={players}
                onNavigate={setActiveTab}
                onAutoLineup={() => handleAutoLineup()}
                loadingLineup={loadingLineup}
              />
            )}

            {/* Tab 2: Taktik & Otomatik Kadro Dizilişi */}
            {activeTab === "lineup" && lineup && (
              <div className="flex flex-col gap-6">
                <FormationSelector
                  currentFormation={lineup.formation}
                  onFormationChange={(f) => handleAutoLineup(f)}
                  onAutoLineup={() => handleAutoLineup()}
                  loading={loadingLineup}
                  totalRating={lineup.totalRating}
                />

                <PitchBoard
                  lineup={lineup}
                  onSelectSlot={(slot) => {
                    if (slot.assignedPlayer) {
                      showToast(`${slot.assignedPlayer.name} (${slot.role} - Reyting: ${slot.rating})`);
                    }
                  }}
                />
              </div>
            )}

            {/* Tab 3: Kadro & Oyuncular */}
            {activeTab === "players" && (
              <PlayersTable
                players={players}
                onSelectPlayer={(p) =>
                  showToast(`${p.name} - En İyi Mevki: ${p.bestPosition} (${p.positionRating}★)`)
                }
              />
            )}

            {/* Tab 4: Otomatik Antrenman */}
            {activeTab === "training" && (
              <TrainingOptimizerCard
                currentTraining={training}
                recommendation={trainingRec}
                onApplyTraining={handleApplyTraining}
              />
            )}

            {/* Tab 5: Maçlar & Oranlar (Ultimate Hattrick Modeli) */}
            {activeTab === "matches" && <MatchCenter matches={matches} />}

            {/* Tab 6: Ayarlar */}
            {activeTab === "settings" && (
              <div className="max-w-2xl mx-auto">
                <HattrickConnectModal
                  isOpen={true}
                  onClose={() => setActiveTab("dashboard")}
                  user={user}
                  onToggleDemoMode={handleToggleDemoMode}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Settings Modal (when triggered from Navbar) */}
      <HattrickConnectModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        onToggleDemoMode={handleToggleDemoMode}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 mt-12 bg-white dark:bg-slate-950 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Hattrick Dashboard © 2026 • Gelişmiş CHPP OAuth 1.0a & Otomatik Taktik Motoru
          </span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500 font-semibold">Ultimate Hattrick Modeli</span>
            <span>•</span>
            <button
              onClick={() => setSettingsOpen(true)}
              className="hover:underline text-slate-700 dark:text-slate-300"
            >
              CHPP Yapılandırması
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
