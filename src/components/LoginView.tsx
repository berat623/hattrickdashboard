"use client";

import { useState } from "react";
import {
  Trophy,
  ShieldCheck,
  Dumbbell,
  Calendar,
  SlidersHorizontal,
  ArrowRight,
  Key,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Coins,
  Compass,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface LoginViewProps {
  onHattrickOAuthRedirect: () => void;
  onManualTokenSubmit: (tokens: {
    accessToken: string;
    accessTokenSecret: string;
  }) => Promise<void>;
  loading: boolean;
  errorMsg?: string | null;
}

export function LoginView({
  onHattrickOAuthRedirect,
  onManualTokenSubmit,
  loading,
  errorMsg,
}: LoginViewProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [accessTokenSecret, setAccessTokenSecret] = useState("");
  const [formError, setFormError] = useState("");

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!accessToken.trim() || !accessTokenSecret.trim()) {
      setFormError(
        "Lütfen Access Token ve Access Token Secret alanlarını doldurun."
      );
      return;
    }
    try {
      await onManualTokenSubmit({
        accessToken: accessToken.trim(),
        accessTokenSecret: accessTokenSecret.trim(),
      });
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "Bağlantı başarısız oldu."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060b14] text-slate-900 dark:text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[120px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25">
            <Trophy className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight block leading-none">
              Hattrick <span className="text-emerald-500">Pro</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              CHPP Menajerlik & Taktik Üssü
            </span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Split Container (Desktop 2-Column Showcase + Mobile Compact Card) */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column (Desktop Showcase, hidden on small mobile or shown below) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col gap-6 pr-6">
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Resmi Hattrick CHPP OAuth 1.0a Entegrasyonu</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15]">
            Hattrick Takımınızı{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
              Yapay Zeka
            </span>{" "}
            ile Yönetin.
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
            Tek tıkla en yüksek reytingli ilk 11&apos;inizi kurun, canlı maç simülatörüyle rakibinizin zayıf kanatlarını analiz edin, antrenman hızınızı ve stadyum tribün gelirlerinizi optimize edin.
          </p>

          <div className="grid grid-cols-2 gap-3.5 pt-2">
            {[
              {
                icon: SlidersHorizontal,
                title: "İnteraktif Saha & Kadro",
                desc: "6 diziliş, PIC/MOTS motivasyon ve tıkla-değiştir oyuncu yönetimi",
              },
              {
                icon: Calendar,
                title: "Canlı Maç Simülatörü",
                desc: "7 bölge güç kıyaslaması, gol beklentisi (xG) ve kazanma oranları",
              },
              {
                icon: Coins,
                title: "Stadyum & Ekonomi Üssü",
                desc: "Hava durumu ve taraftar sayısına göre ideal tribün ve bilet geliri",
              },
              {
                icon: Compass,
                title: "Transfer & Kıyaslama",
                desc: "İkili oyuncu karşılaştırma, piyasa değeri ve kadro eksik analizi",
              },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md space-y-1.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {feat.title}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Login Card (Full width on Mobile, 5 Cols on Desktop) */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/30 mb-4">
              <Trophy className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Menajer Girişi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Hattrick CHPP hesabınızla bağlanarak gerçek kadronuzu, antrenmanınızı ve fikstürünüzü yönetin.
            </p>

            {(errorMsg || formError) && (
              <div className="w-full mt-4 flex items-center gap-2 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-semibold text-left">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg || formError}</span>
              </div>
            )}

            <div className="w-full flex flex-col gap-3 mt-6">
              <button
                type="button"
                onClick={onHattrickOAuthRedirect}
                disabled={loading}
                className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>
                  {loading
                    ? "Hattrick'e Yönlendiriliyor..."
                    : "Hattrick ile Giriş Yap (CHPP OAuth)"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onHattrickOAuthRedirect}
                disabled={loading}
                className="flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-2xl font-bold text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-all shadow-sm active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google Bağlantılı Hattrick Hesabıyla Giriş</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 leading-normal">
              Resmi <strong>chpp.hattrick.org</strong> sayfasına yönlendirilirsiniz. Orada Hattrick şifrenizle veya Google ile onay verebilirsiniz.
            </p>

            {/* Optional Manual Token Entry */}
            <div className="w-full mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-center gap-1.5 w-full text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-semibold cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Manuel Access Token ile Bağlan</span>
                {showAdvanced ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {showAdvanced && (
                <form
                  onSubmit={handleManualSubmit}
                  className="flex flex-col gap-2.5 mt-3 text-left"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Access Token:
                    </label>
                    <input
                      type="text"
                      required
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="CHPP Access Token"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Access Token Secret:
                    </label>
                    <input
                      type="password"
                      required
                      value={accessTokenSecret}
                      onChange={(e) => setAccessTokenSecret(e.target.value)}
                      placeholder="CHPP Access Token Secret"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 dark:bg-emerald-600 text-white hover:opacity-90 transition-all cursor-pointer"
                  >
                    Token ile Doğrula ve Giriş Yap
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-500">
        Hattrick Pro Dashboard © 2026 • Resmi Hattrick CHPP OAuth 1.0a Entegrasyonu
      </footer>
    </div>
  );
}
