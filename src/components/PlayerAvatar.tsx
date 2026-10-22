"use client";

import React, { useState } from "react";
import { PlayerAvatarData } from "@/types/hattrick";
import { Shield } from "lucide-react";

export function normalizeHattrickImgUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }
  if (trimmed.startsWith("/")) {
    return `https://www.hattrick.org${trimmed}`;
  }
  if (trimmed.startsWith("http://")) {
    return trimmed.replace("http://", "https://");
  }
  return trimmed;
}

interface PlayerAvatarProps {
  avatar?: PlayerAvatarData;
  name?: string;
  shirtNumber?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showBackground?: boolean;
  badgeColor?: string;
}

const SIZE_MAP: Record<
  NonNullable<PlayerAvatarProps["size"]>,
  { width: number; height: number; textClass: string }
> = {
  xs: { width: 30, height: 40, textClass: "text-[9px]" },
  sm: { width: 38, height: 50, textClass: "text-[10px]" },
  md: { width: 48, height: 64, textClass: "text-xs" },
  lg: { width: 68, height: 91, textClass: "text-sm" },
  xl: { width: 92, height: 123, textClass: "text-base" },
};

export function PlayerAvatar({
  avatar,
  name = "Oyuncu",
  shirtNumber,
  size = "md",
  className = "",
  showBackground = true,
  badgeColor = "bg-emerald-600",
}: PlayerAvatarProps) {
  const [failedLayers, setFailedLayers] = useState<Record<number, boolean>>({});
  const dims = SIZE_MAP[size];
  const scale = dims.width / 92;

  const layers = avatar?.layers?.filter((l) => Boolean(l.image)) || [];
  const bgUrl = showBackground
    ? normalizeHattrickImgUrl(avatar?.backgroundImage)
    : "";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  const hasValidLayers =
    layers.length > 0 && Object.keys(failedLayers).length < layers.length;

  return (
    <div
      style={{ width: dims.width, height: dims.height }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 border border-white/15 shadow-md shrink-0 select-none ${className}`}
      title={name}
    >
      {hasValidLayers ? (
        <div
          style={{
            width: 92,
            height: 123,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          className="relative pointer-events-none"
        >
          {bgUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bgUrl}
              alt=""
              style={{ position: "absolute", left: 0, top: 0 }}
              className="max-w-none"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          {layers.map((layer, index) => {
            const src = normalizeHattrickImgUrl(layer.image);
            if (!src || failedLayers[index]) return null;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${index}-${layer.x}-${layer.y}`}
                src={src}
                alt=""
                style={{
                  position: "absolute",
                  left: `${layer.x}px`,
                  top: `${layer.y}px`,
                }}
                className="max-w-none"
                onError={(e) => {
                  const imgEl = e.currentTarget as HTMLImageElement;
                  if (
                    imgEl.src.includes("www.hattrick.org") &&
                    !imgEl.dataset.retried
                  ) {
                    imgEl.dataset.retried = "1";
                    imgEl.src = imgEl.src.replace(
                      "www.hattrick.org",
                      "res.hattrick.org"
                    );
                  } else {
                    setFailedLayers((prev) => ({ ...prev, [index]: true }));
                  }
                }}
              />
            );
          })}
        </div>
      ) : (
        /* Stylized Footballer Silhouette Fallback */
        <div className="w-full h-full flex flex-col items-center justify-end bg-gradient-to-b from-slate-800 to-slate-950 relative">
          <svg
            viewBox="0 0 64 80"
            className="w-full h-full opacity-90"
            fill="none"
          >
            {/* Head */}
            <circle cx="32" cy="24" r="12" fill="#cbd5e1" />
            {/* Hair */}
            <path
              d="M20 22C20 14 25 10 32 10C39 10 44 14 44 22C41 18 23 18 20 22Z"
              fill="#334155"
            />
            {/* Jersey Shoulders */}
            <path
              d="M10 78C10 54 20 42 32 42C44 42 54 54 54 78H10Z"
              fill="#10b981"
            />
            {/* Jersey Collar */}
            <path d="M25 42L32 51L39 42H25Z" fill="#064e3b" />
          </svg>
          <span
            className={`absolute bottom-1 font-black text-white drop-shadow ${dims.textClass}`}
          >
            {initials || "HT"}
          </span>
        </div>
      )}

      {shirtNumber !== undefined && shirtNumber > 0 && shirtNumber < 100 && (
        <span
          className={`absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded text-[9px] font-black text-white shadow ${badgeColor} leading-tight`}
        >
          #{shirtNumber}
        </span>
      )}
    </div>
  );
}

interface TeamCrestProps {
  logoUrl?: string;
  dressUri?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const CREST_SIZE_MAP: Record<
  NonNullable<TeamCrestProps["size"]>,
  { box: string; icon: string; text: string }
> = {
  xs: { box: "w-6 h-6 rounded-lg", icon: "w-3.5 h-3.5", text: "text-[9px]" },
  sm: { box: "w-8 h-8 rounded-xl", icon: "w-4 h-4", text: "text-[10px]" },
  md: { box: "w-11 h-11 rounded-xl", icon: "w-5 h-5", text: "text-xs" },
  lg: { box: "w-14 h-14 rounded-2xl", icon: "w-7 h-7", text: "text-sm" },
  xl: { box: "w-20 h-20 rounded-3xl", icon: "w-10 h-10", text: "text-base" },
};

export function TeamCrest({
  logoUrl,
  dressUri,
  name,
  size = "md",
  className = "",
}: TeamCrestProps) {
  const [imgError, setImgError] = useState(false);
  const dims = CREST_SIZE_MAP[size];
  const normalizedLogo = normalizeHattrickImgUrl(logoUrl || dressUri);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={`${dims.box} relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-center shrink-0 ${className}`}
      title={name}
    >
      {normalizedLogo && !imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={normalizedLogo}
          alt={name}
          className="w-full h-full object-contain p-0.5"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black">
          {initials ? (
            <span className={dims.text}>{initials}</span>
          ) : (
            <Shield className={dims.icon} />
          )}
        </div>
      )}
    </div>
  );
}
