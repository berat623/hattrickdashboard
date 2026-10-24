"use client";

import { useState } from "react";
import { NatalChartData } from "@/types/natal";
import {
  ASPECT_MEANINGS,
  HOUSE_MEANINGS,
  PLANET_SIGN_INTERPRETATIONS,
  RETRO_INTERPRETATIONS,
} from "@/lib/natal-interpretations";
import {
  RotateCcw,
  Sparkles,
  Compass,
  Layers,
  Activity,
  BookOpen,
} from "lucide-react";

interface NatalChartResultProps {
  data: NatalChartData;
  onReset: () => void;
}

export function NatalChartResult({ data, onReset }: NatalChartResultProps) {
  const [activeTab, setActiveTab] = useState<"chart" | "planets" | "aspects" | "interpretations">("chart");

  return (
    <div className="space-y-4">
      {/* Top Header & Reset */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-3 shadow-xs">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-500" />
            <span>{data.name} için Doğum Haritası</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {data.city} • {data.birthDateFormatted} {data.birthTime}
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Yeni Hesaplama</span>
        </button>
      </div>

      {/* Summary Info Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed space-y-1">
        <div className="font-semibold text-zinc-900 dark:text-white flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span>{data.city}</span>
          <span>•</span>
          <span>{data.birthDateFormatted} {data.birthTime} (Yerel)</span>
          <span>•</span>
          <span className="text-zinc-500 dark:text-zinc-400 font-normal">UTC: {data.utcTime}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-zinc-600 dark:text-zinc-300">
          <span>
            Yükselen (ASC):{" "}
            <strong className="text-amber-600 dark:text-amber-400 font-bold">
              {data.ascendant.sign} {data.ascendant.degree}°{data.ascendant.minute}&apos;
            </strong>
          </span>
          <span>•</span>
          <span>
            Tepe Noktası (MC):{" "}
            <strong className="text-amber-700 dark:text-amber-300 font-bold">
              {data.midheaven.sign} {data.midheaven.degree}°{data.midheaven.minute}&apos;
            </strong>
          </span>
          <span>•</span>
          <span>
            Konum: {data.latitude.toFixed(2)}°, {data.longitude.toFixed(2)}°
          </span>
        </div>
      </div>

      {/* Core Mottos (Güneş, Ay, Yükselen) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Sun */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 border-l-4 border-l-amber-500 space-y-1 shadow-xs">
          <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Güneş Burcu
          </div>
          <div className="text-sm font-bold text-zinc-900 dark:text-white">
            {data.summary.sunSign} ({data.summary.sunHouse}. Ev)
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-300">
            {data.summary.sunMotto}
          </div>
        </div>

        {/* Moon */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 border-l-4 border-l-indigo-500 space-y-1 shadow-xs">
          <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Ay Burcu
          </div>
          <div className="text-sm font-bold text-zinc-900 dark:text-white">
            {data.summary.moonSign} ({data.summary.moonHouse}. Ev)
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-300">
            {data.summary.moonMotto}
          </div>
        </div>

        {/* Ascendant */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 border-l-4 border-l-emerald-500 space-y-1 shadow-xs">
          <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Yükselen Burç
          </div>
          <div className="text-sm font-bold text-zinc-900 dark:text-white">
            {data.summary.ascendantSign}
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-300">
            {data.summary.ascendantMotto}
          </div>
        </div>
      </div>

      {/* Section Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab("chart")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "chart"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          Harita Çarkı
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("planets")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "planets"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          Gezegenler
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("aspects")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "aspects"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          Açılar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("interpretations")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "interpretations"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          Yorumlar
        </button>
      </div>

      {/* TAB 1: SVG Chart Wheel */}
      {activeTab === "chart" && (
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col items-center justify-center space-y-4">
          <div
            className="w-full max-w-[380px] aspect-square rounded-full shadow-inner overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white"
            dangerouslySetInnerHTML={{ __html: data.svgWheel }}
          />
          <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
            12 Ev, burç kuşakları ve gezegen konumlarının natal harita yerleşimi.
          </div>
        </div>
      )}

      {/* TAB 2: Planets Table */}
      {activeTab === "planets" && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold">
                <th className="py-2.5 px-3">Gezegen</th>
                <th className="py-2.5 px-3 text-center">Burç</th>
                <th className="py-2.5 px-3 text-center">Derece</th>
                <th className="py-2.5 px-3 text-center">Ev</th>
                <th className="py-2.5 px-3 text-right">Günlük Hız</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {data.planets.map((p) => (
                <tr
                  key={p.name}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    <span className="text-base text-amber-600 dark:text-amber-400 w-5 text-center">
                      {p.symbol}
                    </span>
                    <span>{p.name}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center text-zinc-700 dark:text-zinc-300">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <span>{p.signSymbol}</span>
                      <span>{p.sign}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    {p.degree}°{String(p.minute).padStart(2, "0")}&apos;
                    {p.isRetrograde && (
                      <span className="ml-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded">
                        R
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold text-zinc-800 dark:text-zinc-200">
                    {p.house}. Ev
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {p.speed > 0 ? `+${p.speed}` : p.speed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: Aspects */}
      {activeTab === "aspects" && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
              Önemli Gezegen Açıları ({data.aspects.length} Açı)
            </h3>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Uyumlu
              </span>
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Zorlu
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {data.aspects.map((a, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-700/60 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white">
                    {a.planet1} {a.type} {a.planet2}
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {ASPECT_MEANINGS[a.type] || ""}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      a.isHarmonious
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                    }`}
                  >
                    Orb: {a.orb}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Detailed Interpretations */}
      {activeTab === "interpretations" && (
        <div className="space-y-3.5">
          {data.planets.slice(0, 5).map((p) => {
            const planetComments = PLANET_SIGN_INTERPRETATIONS[p.name]?.[p.sign] || [];
            const retroComment = p.isRetrograde ? RETRO_INTERPRETATIONS[p.name] : null;

            return (
              <div
                key={p.name}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2">
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <span className="text-amber-500">{p.symbol}</span>
                    <span>
                      {p.name} {p.sign} Burcunda ({p.house}. Ev)
                    </span>
                  </h4>
                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                    {p.degree}°{p.minute}&apos;
                  </span>
                </div>

                {planetComments.length > 0 ? (
                  <ul className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 space-y-1.5 leading-relaxed">
                    {planetComments.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-zinc-500">
                    {p.name} enerjisi {p.sign} burcunda kendini güçlü bir şekilde ifade eder.
                  </p>
                )}

                {/* Retro interpretation if active */}
                {p.isRetrograde && retroComment && retroComment.length > 0 && (
                  <div className="pt-2 border-t border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 space-y-1">
                    <strong className="font-semibold block">
                      ⚡ Retro (R) Etkisi:
                    </strong>
                    <p>{retroComment[0]}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
