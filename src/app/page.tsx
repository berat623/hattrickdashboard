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
import {
  Player,
  TeamDetails,
  TacticalLineup,
  TrainingData,
  Match,
  UserSession,
  TrainingRecommendation,
} from "@/types/hattrick";
import { CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [user, setUser] = useState<UserSession>({
    id: "guest",
    email: "",
    name: "Ziyaretçi",
    googleLoggedIn: false,
    hattrickConnected: false,
  });

  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [lineup, setLineup] = useState<TacticalLineup | null>(null);
  const [training, setTraining] = useState<TrainingData | null>(null);
  const [trainingRec, setTrainingRec] = useState<TrainingRecommendation | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [loadingLineup, setLoadingLineup] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Restore session and check URL parameters on mount
  useEffect(() => {
    async function initSession() {
      try {
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          if (params.get("auth_error")) {
            const errStr = decodeURIComponent(params.get("auth_error") || "Yetkilendirme hatası");
            setAuthError(errStr);
            showToast(errStr, "error");
            window.history.replaceState({}, "", window.location.pathname);
          } else if (params.get("ht_connected")) {
            showToast("Hattrick hesabınız başarıyla bağlandı!");
            window.history.replaceState({}, "", window.location.pathname);
          } else if (params.get("google_connected")) {
            showToast("Google hesabınız başarıyla bağlandı!");
            window.history.replaceState({}, "", window.location.pathname);
          }
        }

        const meRes = await fetch("/api/auth/me", { cache: "no-store" });
        if (meRes.ok) {
          const data = await meRes.json();
          if (data?.user) {
            setUser(data.user);
          }
        }
      } catch {
        // Ignore on static
      } finally {
        setLoading(false);
      }
    }

    initSession();
  }, []);

  // Fetch real team data when Hattrick is connected
  useEffect(() => {
    if (!user.hattrickConnected) return;

    async function fetchTeamData() {
      try {
        setLoading(true);

        const [teamRes, playersRes, matchesRes, trainingRes] = await Promise.all([
          fetch("/api/hattrick/team", { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
          fetch("/api/hattrick/players", { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
          fetch("/api/hattrick/matches", { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
          fetch("/api/hattrick/training", { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
        ]);

        if (teamRes?.team) setTeam(teamRes.team);
        if (playersRes?.players && playersRes.players.length > 0) {
          setPlayers(playersRes.players);
          const autoLine = generateAutoLineup(playersRes.players, "3-5-2");
          setLineup(autoLine);
          const optRec = analyzeAndOptimizeTraining(playersRes.players);
          setTrainingRec(optRec);
        }
        if (matchesRes?.matches) setMatches(matchesRes.matches);
        if (trainingRes?.training) setTraining(trainingRes.training);
      } catch (err) {
        console.error("Takım verisi yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamData();
  }, [user.hattrickConnected]);

  // Handle Formation Change or Auto Lineup
  const handleAutoLineup = async (preferredFormation?: SupportedFormation) => {
    if (players.length === 0) {
      showToast("Önce Hattrick takımınızı bağlamanız gerekmektedir.", "error");
      return;
    }

    setLoadingLineup(true);
    try {
      const clientLineup = generateAutoLineup(players, preferredFormation);
      setLineup(clientLineup);
      showToast(`En yüksek reytingli ${clientLineup.formation} kadrosu dizildi!`);
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
    setTeam(null);
    setPlayers([]);
    setLineup(null);
    setMatches([]);
    showToast("Oturum kapatıldı.");
  };

  // If not logged in with Hattrick or Google, display Login View
  if (!user.hattrickConnected && !user.googleLoggedIn) {
    return (
      <LoginView
        loading={redirecting}
        errorMsg={authError}
        onHattrickOAuthRedirect={() => {
          setRedirecting(true);
          setAuthError(null);
          if (typeof window !== "undefined" && window.location.hostname.includes("github.io")) {
            window.location.href = "https://hattrickdashboard.vercel.app/api/auth/hattrick/connect";
          } else {
            window.location.href = "/api/auth/hattrick/connect";
          }
        }}
        onManualTokenSubmit={async ({ accessToken, accessTokenSecret }) => {
          setRedirecting(true);
          setAuthError(null);
          try {
            const res = await fetch("/api/auth/hattrick/token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accessToken, accessTokenSecret }),
            });
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.error || "Token doğrulanamadı");
            }
            window.location.href = "/?ht_connected=true";
          } finally {
            setRedirecting(false);
          }
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
        {!user.hattrickConnected ? (
          <div className="p-6 rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-500/10 dark:bg-amber-950/30 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 text-left">
              <ShieldAlert className="w-8 h-8 text-amber-500 shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Hattrick Hesabınız Henüz Bağlanmadı
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Gerçek kadronuzu, oyuncularınızı ve maç fikstürünüzü çekmek için lütfen Hattrick CHPP hesabınızı bağlayın.
                </p>
              </div>
            </div>
            <a
              href="/api/auth/hattrick/connect"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shrink-0 shadow-md transition-all active:scale-95"
            >
              Hattrick CHPP Bağla
            </a>
          </div>
        ) : null}

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Hattrick sunucularından takım ve oyuncu verileriniz çekiliyor...
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
            {activeTab === "lineup" && (
              <div className="flex flex-col gap-6">
                {lineup ? (
                  <>
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
                  </>
                ) : (
                  <div className="p-12 text-center border rounded-2xl border-dashed border-slate-300 dark:border-slate-800">
                    <p className="text-sm text-slate-500">
                      Kadro dizilimini görmek için lütfen önce Hattrick hesabınızı bağlayın.
                    </p>
                  </div>
                )}
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
            Hattrick Dashboard © 2026 • Resmi CHPP OAuth 1.0a & Google Giriş
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
