"use client";

import { useState } from "react";
import { Trophy, ShieldCheck, Dumbbell, Calendar, SlidersHorizontal, AlertCircle } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { HattrickConnectForm } from "./HattrickConnectForm";

interface LoginViewProps {
  onGoogleSuccess: (userData: { name: string; email: string; picture?: string }) => void;
  onHattrickSuccess: (credentials: {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
    accessTokenSecret: string;
  }) => Promise<void>;
  onHattrickOAuthRedirect: () => void;
  loading: boolean;
}

export function LoginView({
  onGoogleSuccess,
  onHattrickSuccess,
  onHattrickOAuthRedirect,
  loading,
}: LoginViewProps) {
  const [activeStep, setActiveStep] = useState<"google" | "hattrick">("google");

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            Hattrick <span className="text-emerald-400">Dashboard</span>
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto px-4 py-8">
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center">
          {/* Badge */}
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/30 mb-4">
            <Trophy className="w-7 h-7" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Hattrick Dashboard Girişi
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Gerçek Hattrick hesabınızı ve Google profilinizi bağlayarak takımınızı otomatik yönetin.
          </p>

          {/* Step Selector Tabs */}
          <div className="grid grid-cols-2 w-full p-1 rounded-xl bg-slate-950 border border-slate-800 mt-6 text-xs font-bold">
            <button
              onClick={() => setActiveStep("google")}
              className={`py-2 px-3 rounded-lg transition-all ${
                activeStep === "google"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              1. Google ile Giriş
            </button>
            <button
              onClick={() => setActiveStep("hattrick")}
              className={`py-2 px-3 rounded-lg transition-all ${
                activeStep === "hattrick"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              2. Hattrick CHPP Bağla
            </button>
          </div>

          <div className="w-full mt-6">
            {activeStep === "google" && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-slate-300">
                  Google hesabınızı bağlayarak menajerlik ayarlarınızı ve taktik tercihlerinizi kaydedin:
                </p>

                {/* Direct Google OAuth Link for Server Runtime */}
                <a
                  href="/api/auth/google/login"
                  onClick={(e) => {
                    // If running on static GitHub Pages, redirect via Client ID or prompt
                    if (typeof window !== "undefined" && window.location.hostname.includes("github.io")) {
                      e.preventDefault();
                      const email = window.prompt("Google E-posta adresinizi girin:", "berat.torun@gmail.com");
                      if (email) {
                        onGoogleSuccess({
                          name: email.split("@")[0],
                          email,
                        });
                        setActiveStep("hattrick");
                      }
                    }
                  }}
                  className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl font-bold text-xs bg-white hover:bg-slate-100 text-slate-900 transition-all shadow-md active:scale-98 cursor-pointer"
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
                  <span>Google ile Oturum Aç</span>
                </a>

                {/* Google One-Tap Client Component */}
                <GoogleSignInButton
                  onSuccess={(data) => {
                    onGoogleSuccess(data);
                    setActiveStep("hattrick");
                  }}
                />
              </div>
            )}

            {activeStep === "hattrick" && (
              <HattrickConnectForm
                onSuccess={onHattrickSuccess}
                onOAuthRedirect={onHattrickOAuthRedirect}
                loading={loading}
              />
            )}
          </div>

          {/* Features Highlights */}
          <div className="w-full mt-8 pt-5 border-t border-slate-800 grid grid-cols-2 gap-2 text-left">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Otomatik Kadro Dizilimi</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Otomatik Antrenman</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Maç & Oran Simülasyonu</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Gerçek Hattrick CHPP</span>
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
