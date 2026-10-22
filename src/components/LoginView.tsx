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
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface LoginViewProps {
  onHattrickOAuthRedirect: () => void;
  onManualTokenSubmit: (tokens: { accessToken: string; accessTokenSecret: string }) => Promise<void>;
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
      setFormError("Lütfen Access Token ve Access Token Secret alanlarını doldurun.");
      return;
    }
    try {
      await onManualTokenSubmit({
        accessToken: accessToken.trim(),
        accessTokenSecret: accessTokenSecret.trim(),
      });
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Bağlantı başarısız oldu.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
            Hattrick <span className="text-emerald-500">Dashboard</span>
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto px-4 py-8">
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center">
          {/* Badge */}
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/30 mb-4">
            <Trophy className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Hattrick Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Hattrick CHPP hesabınızla giriş yaparak kadronuzu, antrenmanınızı ve maç kazanma oranlarınızı otomatik yönetin.
          </p>

          {(errorMsg || formError) && (
            <div className="w-full mt-4 flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-medium text-left">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg || formError}</span>
            </div>
          )}

          {/* Direct Action Buttons */}
          <div className="w-full flex flex-col gap-3 mt-6">
            {/* Primary Button: Redirect directly to Hattrick CHPP Authorize */}
            <button
              type="button"
              onClick={onHattrickOAuthRedirect}
              disabled={loading}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{loading ? "Hattrick'e Yönlendiriliyor..." : "Hattrick ile Giriş Yap (CHPP OAuth)"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary Button: Google via Hattrick CHPP Authorize */}
            <button
              type="button"
              onClick={onHattrickOAuthRedirect}
              disabled={loading}
              className="flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-all shadow-sm active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Google Bağlantılı Hattrick Hesabıyla Giriş Yap</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 leading-normal">
            Tıkladığınızda resmi <strong>chpp.hattrick.org</strong> sayfasına yönlendirilirsiniz. Orada Hattrick şifrenizle veya Google butonuna basarak izin verebilirsiniz.
          </p>

          {/* Optional Manual Token Entry */}
          <div className="w-full mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-center gap-1.5 w-full text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Manuel Erişim Anahtarı (Access Token) ile Bağlan</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <form onSubmit={handleManualSubmit} className="flex flex-col gap-2.5 mt-3 text-left">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Access Token:
                  </label>
                  <input
                    type="text"
                    required
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="CHPP Access Token"
                    className="w-full px-3 py-2 rounded-lg text-xs bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Access Token Secret:
                  </label>
                  <input
                    type="password"
                    required
                    value={accessTokenSecret}
                    onChange={(e) => setAccessTokenSecret(e.target.value)}
                    placeholder="CHPP Access Token Secret"
                    className="w-full px-3 py-2 rounded-lg text-xs bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
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

          {/* Features Highlights */}
          <div className="w-full mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-left">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Otomatik Kadro Dizilimi</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Otomatik Antrenman</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Maç & Oran Simülasyonu</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Resmi CHPP OAuth 1.0a</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500">
        Hattrick Dashboard © 2026 • Resmi Hattrick CHPP OAuth 1.0a Entegrasyonu
      </footer>
    </div>
  );
}
