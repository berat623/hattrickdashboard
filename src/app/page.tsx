"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar, NavTab, NAV_ITEMS } from "@/components/Navbar";
import { PitchBoard } from "@/components/PitchBoard";
import {
  FormationSelector,
  ServerSyncReport,
} from "@/components/FormationSelector";
import { PlayersTable } from "@/components/PlayersTable";
import { TrainingOptimizerCard } from "@/components/TrainingOptimizerCard";
import { MatchCenter } from "@/components/MatchCenter";
import { DashboardOverview } from "@/components/DashboardOverview";
import { EconomyArenaHub } from "@/components/EconomyArenaHub";
import { TransferScoutHub } from "@/components/TransferScoutHub";
import { YouthAcademyHub } from "@/components/YouthAcademyHub";
import { MedicalStaffHub } from "@/components/MedicalStaffHub";
import { PlayerDetailModal } from "@/components/PlayerDetailModal";
import { ExpertAITactician } from "@/components/ExpertAITactician";
import { HattrickConnectModal } from "@/components/HattrickConnectModal";
import { LoginView } from "@/components/LoginView";
import {
  SupportedFormation,
  SupportedTactic,
  SupportedAttitude,
  generateAutoLineup,
  swapPlayerInSlot,
  updateLineupTactics,
  buildLineupFromServerState,
  extractRolePositionsFromLineup,
} from "@/lib/algorithms/lineup";
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
import {
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Sparkles,
  RefreshCw,
} from "lucide-react";

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
  const [trainingRec, setTrainingRec] =
    useState<TrainingRecommendation | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [loadingLineup, setLoadingLineup] = useState(false);
  const [savingToServer, setSavingToServer] = useState(false);
  const [serverSyncReport, setServerSyncReport] =
    useState<ServerSyncReport | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inspectedPlayer, setInspectedPlayer] = useState<Player | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Restore session and check URL parameters on mount
  useEffect(() => {
    async function initSession() {
      try {
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          if (params.get("auth_error")) {
            const errStr = decodeURIComponent(
              params.get("auth_error") || "Yetkilendirme hatası"
            );
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

  const fetchTeamData = useCallback(async (isSilentRefresh = false) => {
    try {
      if (isSilentRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [teamRes, playersRes, matchesRes, trainingRes, serverLineupRes] =
        await Promise.all([
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
          fetch("/api/hattrick/lineup/save", { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
        ]);

      if (teamRes?.team) setTeam(teamRes.team);
      if (playersRes?.players && playersRes.players.length > 0) {
        setPlayers(playersRes.players);
        if (serverLineupRes?.serverState) {
          const syncedLineup = buildLineupFromServerState(
            playersRes.players,
            serverLineupRes.serverState
          );
          setLineup(syncedLineup);
        } else {
          const autoLine = generateAutoLineup(playersRes.players);
          setLineup(autoLine);
        }
        const optRec = analyzeAndOptimizeTraining(playersRes.players);
        setTrainingRec(optRec);
      }
      if (matchesRes?.matches) setMatches(matchesRes.matches);
      if (trainingRes?.training) setTraining(trainingRes.training);

      if (isSilentRefresh) {
        showToast(
          "Hattrick CHPP sunucusundan oyuncu resimleri, takım logoları ve taktikler güncellendi!"
        );
      }
    } catch (err) {
      console.error("Takım verisi yüklenemedi:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch real team data when Hattrick is connected
  useEffect(() => {
    if (!user.hattrickConnected) return;
    fetchTeamData(false);
  }, [user.hattrickConnected, fetchTeamData]);

  // Handle Formation Change or Auto Lineup
  const handleAutoLineup = async (preferredFormation?: SupportedFormation) => {
    if (players.length === 0) {
      showToast("Önce Hattrick takımınızı bağlamanız gerekmektedir.", "error");
      return;
    }

    setLoadingLineup(true);
    try {
      const clientLineup = generateAutoLineup(
        players,
        preferredFormation,
        lineup?.tactic || "Normal",
        lineup?.attitude || "Normal"
      );
      setLineup({
        ...clientLineup,
        serverSource: "auto",
        sourceMatchId: lineup?.sourceMatchId,
        sourceOpponentName: lineup?.sourceOpponentName,
      });
      showToast(
        `En yüksek reytingli ${clientLineup.formation} kadrosu (${clientLineup.totalRating.toFixed(1)}★) dizildi!`
      );
    } finally {
      setLoadingLineup(false);
    }
  };

  // Handle Tactic or Attitude Change
  const handleTacticOrAttitudeChange = (
    newTactic: SupportedTactic,
    newAttitude: SupportedAttitude
  ) => {
    if (!lineup) return;
    const updated = updateLineupTactics(lineup, newTactic, newAttitude);
    setLineup({
      ...updated,
      serverSource: "auto",
    });
    showToast(`Taktik: ${newTactic} • Motivasyon: ${newAttitude}`);
  };

  // Handle Player Swap on Pitch
  const handleSwapPlayer = (slotId: string, newPlayer: Player) => {
    if (!lineup) return;
    const updated = swapPlayerInSlot(lineup, slotId, newPlayer);
    setLineup({
      ...updated,
      serverSource: "auto",
    });
    showToast(`${newPlayer.name} kadroya yerleştirildi!`);
  };

  // Save Lineup & Tactics to Hattrick Game Server and Verify
  const handleSaveLineupToServer = async () => {
    if (!lineup) return;
    setSavingToServer(true);
    try {
      const positions = extractRolePositionsFromLineup(lineup);
      const res = await fetch("/api/hattrick/lineup/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: lineup.sourceMatchId,
          formation: lineup.formation,
          tactic: lineup.tactic,
          attitude: lineup.attitude,
          captainId: lineup.captainId,
          setPiecesTakerId: lineup.setPiecesTakerId,
          positions,
        }),
      });
      const data = await res.json();
      const report: ServerSyncReport = {
        savedToServer: Boolean(data.savedToServer),
        verifiedFromServer: Boolean(data.verifiedFromServer),
        requiresWriteScope: Boolean(data.requiresWriteScope),
        message:
          data.message ||
          "Hattrick oyun sunucusu kontrolü tamamlandı.",
        serverFormation: data.serverFormation,
        serverTactic: data.serverTactic,
        hattrickMatchOrderUrl: data.hattrickMatchOrderUrl,
        checkedAt: new Date().toLocaleTimeString("tr-TR"),
      };
      setServerSyncReport(report);
      if (report.savedToServer) {
        setLineup((prev) =>
          prev ? { ...prev, serverSource: "matchorders", ordersGiven: true } : null
        );
        showToast(report.message, "success");
      } else {
        showToast(report.message, "error");
      }
    } catch {
      showToast("Sunucu kontrolü sırasında bağlantı hatası oluştu.", "error");
    } finally {
      setSavingToServer(false);
    }
  };

  // Reload Lineup & Tactics Directly From Hattrick Game Server
  const handleReloadLineupFromServer = async () => {
    if (players.length === 0) return;
    setSavingToServer(true);
    try {
      const res = await fetch("/api/hattrick/lineup/save", {
        cache: "no-store",
      });
      const data = await res.json();
      if (data?.serverState) {
        const synced = buildLineupFromServerState(players, data.serverState);
        setLineup(synced);
        setServerSyncReport({
          savedToServer: data.serverState.source === "matchorders",
          verifiedFromServer: true,
          message:
            data.serverState.source === "matchorders"
              ? `Hattrick sunucusunda kayıtlı gelecek maç emriniz (${synced.formation} • ${synced.tactic}) doğrulandı ve sahaya yüklendi.`
              : `Gelecek maç için henüz Hattrick'te kayıtlı emir bulunamadı; son resmi maç kadronuz (${synced.formation} • ${synced.tactic}) yüklendi.`,
          serverFormation: synced.formation,
          serverTactic: synced.tactic,
          hattrickMatchOrderUrl: synced.sourceMatchId
            ? `https://www.hattrick.org/Club/Matches/MatchOrder/Default.aspx?matchID=${synced.sourceMatchId}`
            : undefined,
          checkedAt: new Date().toLocaleTimeString("tr-TR"),
        });
        showToast(
          `Sunucudaki gerçek diziliş (${synced.formation} • ${synced.tactic}) yüklendi!`
        );
      }
    } catch {
      showToast("Sunucudaki taktik durumu okunamadı.", "error");
    } finally {
      setSavingToServer(false);
    }
  };

  // Apply Training Recommendation and Verify on Hattrick Server
  const handleApplyTraining = async (typeId: number, staminaShare: number) => {
    try {
      const res = await fetch("/api/hattrick/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainingType: typeId,
          staminaTrainingPart: staminaShare,
        }),
      });
      const data = await res.json();
      if (data?.updatedTraining) {
        setTraining((prev) =>
          prev
            ? {
                ...prev,
                ...data.updatedTraining,
              }
            : null
        );
      }
      showToast(
        data?.message || "Antrenman isteği kontrol edildi.",
        data?.savedToServer ? "success" : "error"
      );
      return {
        savedToServer: Boolean(data?.savedToServer),
        requiresWriteScope: Boolean(data?.requiresWriteScope),
        message: data?.message || "Kontrol tamamlandı",
      };
    } catch {
      showToast("Antrenman sunucuya gönderilirken hata oluştu.", "error");
      return {
        savedToServer: false,
        message: "Sunucu bağlantı hatası.",
      };
    }
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
          if (
            typeof window !== "undefined" &&
            window.location.hostname.includes("github.io")
          ) {
            window.location.href =
              "https://hattrickdashboard.vercel.app/api/auth/hattrick/connect";
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

  const activeNavMeta =
    NAV_ITEMS.find((i) => i.id === activeTab) || NAV_ITEMS[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060b14] text-slate-900 dark:text-slate-100 flex flex-col lg:pl-68">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold backdrop-blur-xl animate-fade-in bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 max-w-md">
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation System (Desktop Sidebar + Mobile Header & Bottom Tab Bar) */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        team={team}
        onOpenSettings={() => setSettingsOpen(true)}
        onLogout={handleLogout}
        onRefreshData={() => fetchTeamData(true)}
        refreshing={refreshing}
      />

      {/* Desktop Top Command Bar (visible only on lg+) */}
      <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-[#09101f]/70 backdrop-blur-md sticky top-0 z-30">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            {activeNavMeta.label}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {team?.name || "Hattrick Kulübünüz"} • {players.length} Lisanslı Oyuncu
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab("lineup");
              handleAutoLineup();
            }}
            disabled={loadingLineup}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ Hızlı Kadro Kur</span>
          </button>

          <button
            onClick={() => fetchTeamData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-emerald-500 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            <span>Senkronize Et</span>
          </button>
        </div>
      </div>

      {/* Main Content Area (extra bottom padding on mobile for native bottom tab bar) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 pb-24 lg:pb-10">
        {!user.hattrickConnected ? (
          <div className="p-6 rounded-3xl border border-amber-300 dark:border-amber-800/80 bg-amber-500/10 dark:bg-amber-950/30 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 text-left">
              <ShieldAlert className="w-8 h-8 text-amber-500 shrink-0" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Hattrick Hesabınız Henüz Bağlanmadı
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Gerçek kadronuzu, oyuncularınızı ve maç fikstürünüzü çekmek için lütfen Hattrick CHPP hesabınızı bağlayın.
                </p>
              </div>
            </div>
            <a
              href="/api/auth/hattrick/connect"
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 shrink-0 shadow-md transition-all active:scale-95"
            >
              Hattrick CHPP Bağla
            </a>
          </div>
        ) : null}

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[55vh] gap-3">
            <div className="w-11 h-11 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Hattrick CHPP sunucularından canlı takım verileriniz, oyuncu avatarlarınız ve logolarınız çekiliyor...
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
                onSelectPlayer={(p) => setInspectedPlayer(p)}
                loadingLineup={loadingLineup}
              />
            )}

            {/* Tab 2: Taktik & Otomatik Kadro Dizilişi */}
            {activeTab === "lineup" && (
              <div className="flex flex-col gap-5">
                {lineup ? (
                  <>
                    <ExpertAITactician
                      players={players}
                      matches={matches}
                      currentLineup={lineup}
                      onApplyAILineup={(newLineup, form, tac, att) => {
                        setLineup({
                          ...newLineup,
                          serverSource: "auto",
                          sourceMatchId: lineup.sourceMatchId,
                          sourceOpponentName: lineup.sourceOpponentName,
                        });
                        showToast(
                          `Uzman AI: ${form} (${tac} • ${att}) kadrosu sahaya dizildi!`
                        );
                      }}
                    />

                    <FormationSelector
                      currentFormation={lineup.formation}
                      currentTactic={lineup.tactic}
                      currentAttitude={lineup.attitude}
                      onFormationChange={(f) => handleAutoLineup(f)}
                      onTacticChange={(t) =>
                        handleTacticOrAttitudeChange(t, lineup.attitude)
                      }
                      onAttitudeChange={(a) =>
                        handleTacticOrAttitudeChange(lineup.tactic, a)
                      }
                      onAutoLineup={() => handleAutoLineup()}
                      onSaveToHattrickServer={handleSaveLineupToServer}
                      onReloadFromHattrickServer={handleReloadLineupFromServer}
                      savingToServer={savingToServer}
                      serverSyncReport={serverSyncReport}
                      serverSource={lineup.serverSource}
                      sourceOpponentName={lineup.sourceOpponentName}
                      ordersGiven={lineup.ordersGiven}
                      loading={loadingLineup}
                      totalRating={lineup.totalRating}
                    />

                    <PitchBoard
                      lineup={lineup}
                      allPlayers={players}
                      onSwapPlayer={handleSwapPlayer}
                      onInspectPlayer={(p) => setInspectedPlayer(p)}
                      onUpdateCaptainOrSP={(capId, spId) => {
                        setLineup({
                          ...lineup,
                          captainId: capId,
                          setPiecesTakerId: spId,
                          serverSource: "auto",
                        });
                        showToast("Kaptan ve Duran Top ustası güncellendi!");
                      }}
                    />
                  </>
                ) : (
                  <div className="p-12 text-center border rounded-3xl border-dashed border-slate-300 dark:border-slate-800">
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
                onSelectPlayer={(p) => setInspectedPlayer(p)}
              />
            )}

            {/* Tab 4: Otomatik Antrenman */}
            {activeTab === "training" && (
              <TrainingOptimizerCard
                currentTraining={training}
                recommendation={trainingRec}
                players={players}
                onApplyTraining={handleApplyTraining}
                onSelectPlayer={(p) => setInspectedPlayer(p)}
              />
            )}

            {/* Tab 5: Maçlar & Simülatör */}
            {activeTab === "matches" && (
              <MatchCenter
                matches={matches}
                players={players}
                activeLineupRatings={lineup?.sectorRatings}
                onSelectPlayer={(p) => setInspectedPlayer(p)}
              />
            )}

            {/* Tab 6: Ekonomi & Stadyum */}
            {activeTab === "economy" && (
              <EconomyArenaHub
                team={team}
                players={players}
                onSelectPlayer={(p) => setInspectedPlayer(p)}
              />
            )}

            {/* Tab 7: Transfer & Gözlemci */}
            {activeTab === "transfers" && (
              <TransferScoutHub
                players={players}
                team={team}
                onSelectPlayer={(p) => setInspectedPlayer(p)}
              />
            )}

            {/* Tab 8: Altyapı & Scout Akademisi */}
            {activeTab === "youth" && (
              <YouthAcademyHub
                players={players}
                onSelectPlayer={(p) => setInspectedPlayer(p)}
              />
            )}

            {/* Tab 9: Sağlık Merkezi & Teknik Ekip */}
            {activeTab === "medical" && (
              <MedicalStaffHub
                players={players}
                onSelectPlayer={(p) => setInspectedPlayer(p)}
              />
            )}

            {/* Tab 10: Ayarlar */}
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

      {/* Player Detail & Comparison Modal */}
      <PlayerDetailModal
        player={inspectedPlayer}
        allPlayers={players}
        onClose={() => setInspectedPlayer(null)}
      />

      {/* Settings Modal */}
      <HattrickConnectModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
      />
    </div>
  );
}
