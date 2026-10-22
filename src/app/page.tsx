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
import { LoginView } from "@/components/LoginView";
import { SupportedFormation, generateAutoLineup } from "@/lib/algorithms/lineup";
import { analyzeAndOptimizeTraining } from "@/lib/algorithms/training";
import { simulateMatch } from "@/lib/algorithms/match-predictor";
import { MOCK_PLAYERS, MOCK_TEAM, MOCK_MATCHES, MOCK_TRAINING } from "@/lib/chpp/mock-data";
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
    hattrickConnected: true,
    hattrickUsername: "berat623",
    hattrickTeamId: 1042319,
    hattrickTeamName: "Anadolu Kartalları SK",
  });

  const [team, setTeam] = useState<TeamDetails | null>(MOCK_TEAM);
  const [players, setPlayers] = useState<Player[]>(MOCK_PLAYERS);
  const [lineup, setLineup] = useState<TacticalLineup | null>(null);
  const [training, setTraining] = useState<TrainingData | null>(MOCK_TRAINING);
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
        try {
          const userRes = await fetch("/api/auth/me");
          if (userRes.ok) {
            const data = await userRes.json();
            if (data?.user) setUser(data.user);
          }
        } catch {
          // Keep current session
        }

        // 2. Team Details
        let loadedTeam = MOCK_TEAM;
        try {
          const teamRes = await fetch("/api/hattrick/team");
          if (teamRes.ok) {
            const data = await teamRes.json();
            if (data?.team) loadedTeam = data.team;
          }
        } catch {
          // Fallback
        }
        setTeam(loadedTeam);

        // 3. Players
        let loadedPlayers = MOCK_PLAYERS;
        try {
          const playersRes = await fetch("/api/hattrick/players");
          if (playersRes.ok) {
            const data = await playersRes.json();
            if (data?.players && data.players.length > 0) loadedPlayers = data.players;
          }
        } catch {
          // Fallback
        }
        setPlayers(loadedPlayers);

        // 4. Initial Lineup
        let loadedLineup = generateAutoLineup(loadedPlayers, "3-5-2");
        try {
          const lineupRes = await fetch("/api/hattrick/lineup/auto", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ formation: "3-5-2" }),
          });
          if (lineupRes.ok) {
            const data = await lineupRes.json();
            if (data?.lineup) loadedLineup = data.lineup;
          }
        } catch {
          // Fallback
        }
        setLineup(loadedLineup);

        // 5. Training & Recommendation
        let loadedTraining = MOCK_TRAINING;
        try {
          const trainingRes = await fetch("/api/hattrick/training");
          if (trainingRes.ok) {
            const data = await trainingRes.json();
            if (data?.training) loadedTraining = data.training;
          }
        } catch {
          // Fallback
        }
        setTraining(loadedTraining);

        const rec = analyzeAndOptimizeTraining(loadedPlayers);
        setTrainingRec(rec);

        // 6. Matches & Simulation
        let loadedMatches = MOCK_MATCHES.map((m) => {
          if (m.homeRatings && m.awayRatings) {
            const sim = simulateMatch(m.homeRatings, m.awayRatings);
            return {
              ...m,
              winProbability: m.myTeamIsHome ? sim.homeWinProb : sim.awayWinProb,
              drawProbability: sim.drawProb,
              lossProbability: m.myTeamIsHome ? sim.awayWinProb : sim.homeWinProb,
            };
          }
          return m;
        });

        try {
          const matchesRes = await fetch("/api/hattrick/matches");
          if (matchesRes.ok) {
            const data = await matchesRes.json();
            if (data?.matches) loadedMatches = data.matches;
          }
        } catch {
          // Fallback
        }
        setMatches(loadedMatches);
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
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("ht_connected")) {
        showToast("Hattrick hesabınız başarıyla bağlandı!");
        setUser((prev) => ({ ...prev, hattrickConnected: true }));
        window.history.replaceState({}, "", window.location.pathname);
      } else if (params.get("google_connected")) {
        showToast("Google hesabınızla başarıyla giriş yapıldı!");
        setUser((prev) => ({ ...prev, googleLoggedIn: true }));
        window.history.replaceState({}, "", window.location.pathname);
      } else if (params.get("auth_error")) {
        showToast(decodeURIComponent(params.get("auth_error") || "Yetkilendirme hatası"), "error");
        window.history.replaceState({}, "", window.location.pathname);
      }
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
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.lineup) {
          setLineup(data.lineup);
          showToast(data.message || "Kadro başarıyla dizildi!");
          return;
        }
      }
      throw new Error("Client fallback");
    } catch {
      const pool = players.length > 0 ? players : MOCK_PLAYERS;
      const clientLineup = generateAutoLineup(pool, preferredFormation);
      setLineup(clientLineup);
      showToast(`En yüksek reytingli ${clientLineup.formation} kadrosu otomatik oluşturuldu!`);
    } finally {
      setLoadingLineup(false);
    }
  };

  // Apply Training Recommendation
  const handleApplyTraining = async (typeId: number, staminaShare: number) => {
    try {
      await fetch("/api/hattrick/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainingType: typeId, staminaTrainingPart: staminaShare }),
      });
    } catch {
      // client update
    }
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
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // client reset
    }
    setUser({
      id: "guest",
      email: "",
      name: "Ziyaretçi",
      googleLoggedIn: false,
      hattrickConnected: false,
    });
    showToast("Oturum kapatıldı.");
  };

  // If user is not logged in, show Login Screen
  if (!user.googleLoggedIn && !user.hattrickConnected) {
    return (
      <LoginView
        onDirectLogin={() => {
          setUser({
            id: "user-1",
            email: "berat.torun@gmail.com",
            name: "Berat Torun",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
            googleLoggedIn: true,
            hattrickConnected: true,
            hattrickUsername: "berat623",
            hattrickTeamId: 1042319,
            hattrickTeamName: "Anadolu Kartalları SK",
          });
          showToast("Giriş yapıldı!");
        }}
      />
    );
  }

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
        onLogout={handleLogout}
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
