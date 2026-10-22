"use client";

import { useEffect, useState } from "react";

interface GoogleSignInButtonProps {
  onSuccess: (userData: { name: string; email: string; picture?: string }) => void;
  clientId?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: { theme?: string; size?: string; text?: string; width?: number }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export function GoogleSignInButton({ onSuccess, clientId }: GoogleSignInButtonProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const activeClientId = clientId || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if script already loaded
    if (window.google?.accounts?.id) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      // cleanup
    };
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !window.google?.accounts?.id || !activeClientId) return;

    window.google.accounts.id.initialize({
      client_id: activeClientId,
      callback: (res) => {
        try {
          // Decode JWT payload
          const base64Url = res.credential.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const payload = JSON.parse(jsonPayload);
          onSuccess({
            name: payload.name || "Google Kullanıcısı",
            email: payload.email || "",
            picture: payload.picture,
          });
        } catch (e) {
          console.error("Google token decode hatası:", e);
        }
      },
    });

    const buttonDiv = document.getElementById("google-signin-btn-container");
    if (buttonDiv) {
      buttonDiv.innerHTML = "";
      window.google.accounts.id.renderButton(buttonDiv, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        width: 320,
      });
    }
  }, [scriptLoaded, activeClientId, onSuccess]);

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div id="google-signin-btn-container" className="flex justify-center w-full" />
    </div>
  );
}
