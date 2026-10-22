"use client";

import { useState } from "react";
import { Key, Shield, ExternalLink, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

interface HattrickConnectFormProps {
  onSuccess: (credentials: {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
    accessTokenSecret: string;
  }) => Promise<void>;
  onOAuthRedirect: () => void;
  loading: boolean;
}

export function HattrickConnectForm({
  onSuccess,
  onOAuthRedirect,
  loading,
}: HattrickConnectFormProps) {
  const [tab, setTab] = useState<"oauth" | "keys">("oauth");
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [accessTokenSecret, setAccessTokenSecret] = useState("");
  const [error, setError] = useState("");

  const handleSubmitKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!consumerKey.trim() || !consumerSecret.trim()) {
      setError("Lütfen en azından Consumer Key ve Consumer Secret değerlerini girin.");
      return;
    }

    try {
      await onSuccess({
        consumerKey: consumerKey.trim(),
        consumerSecret: consumerSecret.trim(),
        accessToken: accessToken.trim(),
        accessTokenSecret: accessTokenSecret.trim(),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bağlantı hatası oluştu.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Mode Switcher */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setTab("oauth")}
          className={`py-2 px-3 rounded-lg transition-all ${
            tab === "oauth"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Hattrick OAuth ile Giriş
        </button>
        <button
          type="button"
          onClick={() => setTab("keys")}
          className={`py-2 px-3 rounded-lg transition-all ${
            tab === "keys"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          CHPP Anahtarları ile Giriş
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab 1: Direct OAuth */}
      {tab === "oauth" && (
        <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-left">
          <p className="text-xs text-slate-300 leading-relaxed">
            Butona tıkladığınızda <strong>chpp.hattrick.org</strong> yetkilendirme sayfasına yönlendirileceksiniz. Hattrick kullanıcı adı ve şifrenizle giriş yaparak takımınıza erişim izni vermeniz gerekir.
          </p>

          <button
            type="button"
            onClick={onOAuthRedirect}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all active:scale-98 disabled:opacity-50 mt-1 cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>{loading ? "Hattrick'e Yönlendiriliyor..." : "Hattrick'e Git ve İzin Ver (OAuth 1.0a)"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Resmi Hattrick CHPP Yetkilendirmesi</span>
            <a
              href="https://www.hattrick.org/goto.aspx?path=/Community/CHPP/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:underline"
            >
              <span>CHPP Bilgisi</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Tab 2: Manual CHPP Developer Keys */}
      {tab === "keys" && (
        <form onSubmit={handleSubmitKeys} className="flex flex-col gap-3 text-left">
          <p className="text-xs text-slate-400">
            Hattrick Geliştirici sayfanızdan (My CHPP applications) aldığınız anahtarları girerek doğrudan kendi takımınıza bağlanabilirsiniz:
          </p>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Consumer Key:
            </label>
            <input
              type="text"
              required
              placeholder="Örn: aBcDeFgHiJkLmNoP..."
              value={consumerKey}
              onChange={(e) => setConsumerKey(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Consumer Secret:
            </label>
            <input
              type="password"
              required
              placeholder="Örn: 1234567890abcdef..."
              value={consumerSecret}
              onChange={(e) => setConsumerSecret(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Access Token (Opsiyonel):
              </label>
              <input
                type="text"
                placeholder="Token varsa girin"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Token Secret (Opsiyonel):
              </label>
              <input
                type="password"
                placeholder="Token Secret varsa"
                value={accessTokenSecret}
                onChange={(e) => setAccessTokenSecret(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all active:scale-98 disabled:opacity-50 mt-1 cursor-pointer"
          >
            <Key className="w-4 h-4" />
            <span>{loading ? "Doğrulanıyor..." : "Hattrick Takımımı Bağla"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
