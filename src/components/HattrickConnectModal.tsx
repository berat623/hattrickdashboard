"use client";

import { useState } from "react";
import { UserSession } from "@/types/hattrick";
import { X, CheckCircle2, ShieldAlert, Key, Globe, LogIn, LogOut, ExternalLink } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession;
}

export function HattrickConnectModal({
  isOpen,
  onClose,
  user,
}: SettingsModalProps) {
  const [disconnecting, setDisconnecting] = useState(false);

  if (!isOpen) return null;

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await fetch("/api/auth/hattrick/disconnect", { method: "POST" });
      window.location.reload();
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              Hattrick CHPP & Google Hesap Yönetimi
            </h2>
            <p className="text-xs text-slate-500">
              Gerçek Hattrick takımınız ve Google hesabınız ile tam senkronizasyon
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Hattrick CHPP OAuth Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Hattrick CHPP Bağlantısı
                </span>
              </div>
              {user.hattrickConnected ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Bağlı ({user.hattrickUsername || user.hattrickTeamName || "Kullanıcı"})
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-300">
                  <ShieldAlert className="w-3.5 h-3.5" /> Bağlantı Bekleniyor
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Hattrick CHPP OAuth 1.0a protokolü ile kadronuz, antrenmanınız ve lig maçlarınız doğrudan Hattrick sunucularından çekilir ve otomatik taktikler doğrudan takımınıza uygulanır.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <a
                href="/api/auth/hattrick/connect"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Hattrick Hesabıyla Giriş Yap (OAuth 1.0a)</span>
              </a>

              {user.hattrickConnected && (
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-300 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Bağlantıyı Kes</span>
                </button>
              )}

              <a
                href="https://www.hattrick.org/goto.aspx?path=/Community/CHPP/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline ml-auto"
              >
                <span>CHPP Portalı</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Google Login Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Google Hesabı
              </span>
              {user.googleLoggedIn ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {user.email || user.name}
                </span>
              ) : (
                <span className="text-xs text-slate-400">Giriş Yapılmadı</span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Google hesabınızı bağlayarak taktiklerinizi ve menajerlik tercihlerinizi bulutta güvenle saklayabilirsiniz.
            </p>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <a
                href="/api/auth/google/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                <span>Google ile Giriş Yap</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
