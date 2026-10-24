"use client";

import { useState } from "react";
import { NatalChartData } from "@/types/natal";
import {
  ASPECT_MEANINGS,
  HOUSE_MEANINGS,
  PLANET_SIGN_INTERPRETATIONS,
  RETRO_INTERPRETATIONS,
  HOUSE_SYSTEM_DETAILS,
  AYANAMSA_DETAILS,
  D9_INTERPRETATIONS,
} from "@/lib/natal-interpretations";
import {
  RotateCcw,
  Sparkles,
  Compass,
  Layers,
  Activity,
  BookOpen,
  Star,
  Shield,
  HeartHandshake,
  Flame,
  Globe2,
} from "lucide-react";

interface NatalChartResultProps {
  data: NatalChartData;
  onReset: () => void;
}

export function NatalChartResult({ data, onReset }: NatalChartResultProps) {
  const [activeTab, setActiveTab] = useState<
    "chart" | "planets" | "d9" | "elements" | "aspects" | "interpretations"
  >("chart");

  const [activeWheelView, setActiveWheelView] = useState<"d1" | "d9">("d1");

  const houseSysTitle =
    HOUSE_SYSTEM_DETAILS[data.houseSystem]?.name || data.houseSystem;
  const ayanamsaTitle =
    AYANAMSA_DETAILS[data.ayanamsaSystem]?.name || data.ayanamsaSystem;

  return (
    <div className="space-y-4">
      {/* Top Header & Reset */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-500" />
            <span>{data.name} — Doğum & D9 Haritası</span>
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
      <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed space-y-1.5">
        <div className="font-semibold text-zinc-900 dark:text-white flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span>{data.city}</span>
          <span>•</span>
          <span>{data.birthDateFormatted} {data.birthTime} (Yerel)</span>
          <span>•</span>
          <span className="text-zinc-500 dark:text-zinc-400 font-normal">UTC: {data.utcTime}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-zinc-600 dark:text-zinc-300">
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

        {/* System Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-500/20 text-[11px]">
          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 font-medium">
            Ev: {houseSysTitle}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 font-medium">
            Zodyak: {ayanamsaTitle}
          </span>
          {data.ayanamsaValue > 0 && (
            <span className="text-zinc-500 dark:text-zinc-400">
              (Ayanamsa: {data.ayanamsaValue.toFixed(2)}°)
            </span>
          )}
          {data.vargottamaPlanets.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 font-medium flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span>{data.vargottamaPlanets.length} Vargottama Gezegen</span>
            </span>
          )}
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

      {/* Main Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("chart")}
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "planets"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          Gezegenler & Noktalar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("d9")}
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "d9"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          D9 Navamsha (Vedik)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("elements")}
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "elements"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          Element & Nitelik
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("aspects")}
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "interpretations"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          Yorumlar
        </button>
      </div>

      {/* TAB 1: SVG Chart Wheels (D1 vs D9 toggle) */}
      {activeTab === "chart" && (
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col items-center justify-center space-y-4">
          {/* Wheel Selector toggle */}
          <div className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveWheelView("d1")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeWheelView === "d1"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              D1 Rashi (Ana Doğum Çarkı)
            </button>
            <button
              type="button"
              onClick={() => setActiveWheelView("d9")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeWheelView === "d9"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span>D9 Navamsha Çarkı</span>
            </button>
          </div>

          <div
            className="w-full max-w-[380px] aspect-square rounded-full shadow-inner overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white"
            dangerouslySetInnerHTML={{
              __html: activeWheelView === "d1" ? data.svgWheel : data.svgD9Wheel,
            }}
          />

          <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
            {activeWheelView === "d1"
              ? "12 Ev, burç kuşakları ve gezegen boylamlarının hassas natal yerleşimi."
              : "D9 Navamsha haritası: Ruhun kaderi, evlilik dinamikleri ve Vargottama gezegenler (★ ile işaretli)."}
          </div>
        </div>
      )}

      {/* TAB 2: Planets & Sensitive Points Table */}
      {activeTab === "planets" && (
        <div className="space-y-4">
          {/* Main Planets Table */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs overflow-x-auto">
            <div className="text-xs font-bold text-zinc-900 dark:text-white mb-3">
              Temel Gezegen Konumları & Asalet Durumu
            </div>
            <table className="w-full text-xs sm:text-sm text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold">
                  <th className="py-2.5 px-3">Gezegen</th>
                  <th className="py-2.5 px-3 text-center">D1 Burç</th>
                  <th className="py-2.5 px-3 text-center">Derece</th>
                  <th className="py-2.5 px-3 text-center">Ev</th>
                  <th className="py-2.5 px-3 text-center">Asalet</th>
                  <th className="py-2.5 px-3 text-center">D9 Burç</th>
                  <th className="py-2.5 px-3 text-right">Nakshatra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {data.planets.map((p) => {
                  let dignityColor = "text-zinc-500";
                  if (p.dignity === "Yönetici") dignityColor = "text-emerald-600 dark:text-emerald-400 font-bold";
                  else if (p.dignity === "Yücelim") dignityColor = "text-blue-600 dark:text-blue-400 font-bold";
                  else if (p.dignity === "Zararda") dignityColor = "text-rose-600 dark:text-rose-400 font-medium";
                  else if (p.dignity === "Düşük") dignityColor = "text-amber-600 dark:text-amber-400 font-medium";

                  return (
                    <tr
                      key={p.name}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span className="text-base text-amber-600 dark:text-amber-400 w-5 text-center">
                          {p.symbol}
                        </span>
                        <span>{p.name}</span>
                        {p.isVargottama && (
                          <span
                            title="Vargottama: D1 ve D9'da aynı burçta!"
                            className="text-[10px] bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 font-bold px-1.5 py-0.5 rounded"
                          >
                            Vargottama
                          </span>
                        )}
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
                      <td className={`py-2.5 px-3 text-center text-xs ${dignityColor}`}>
                        {p.dignity || "Nötr"}
                      </td>
                      <td className="py-2.5 px-3 text-center text-zinc-700 dark:text-zinc-300 font-medium">
                        {p.d9Sign}
                      </td>
                      <td className="py-2.5 px-3 text-right text-xs text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{p.nakshatra}</span> (P{p.pada})
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Sensitive Points Table */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3">
            <div className="text-xs font-bold text-zinc-900 dark:text-white">
              Hassas Noktalar & Karmik Eksenler
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {data.sensitivePoints.map((sp) => (
                <div
                  key={sp.name}
                  className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-700/60 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-white">
                    <span className="flex items-center gap-1.5">
                      <span className="text-amber-500 font-bold">{sp.symbol}</span>
                      <span>{sp.name}</span>
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-300 font-normal">
                      {sp.sign} {sp.degree}°{sp.minute}&apos; ({sp.house}. Ev)
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                    {sp.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: D9 Navamsha Detailed Analysis */}
      {activeTab === "d9" && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{D9_INTERPRETATIONS.title}</span>
            </h3>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {D9_INTERPRETATIONS.overview}
            </p>
          </div>

          {/* Vargottama Showcase */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-yellow-500" />
              <span>Vargottama Gezegenleriniz ({data.vargottamaPlanets.length})</span>
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {D9_INTERPRETATIONS.vargottamaDesc}
            </p>

            {data.vargottamaPlanets.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {data.vargottamaPlanets.map((pName) => {
                  const pObj = data.planets.find((p) => p.name === pName);
                  return (
                    <div
                      key={pName}
                      className="px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs font-semibold text-yellow-900 dark:text-yellow-200 flex items-center gap-2"
                    >
                      <span className="text-amber-600 dark:text-amber-400 text-sm">{pObj?.symbol}</span>
                      <span>{pName}</span>
                      <span className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">
                        ({pObj?.sign} burcunda)
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-zinc-400">
                Haritanızda doğrudan Vargottama konumunda gezegen bulunmamaktadır. Gezegenleriniz Navamsha&apos;da farklı burç nitelikleriyle harmanlanmaktadır.
              </p>
            )}
          </div>

          {/* 27 Nakshatras & Pada Breakdown */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
              27 Ay Konağı (Nakshatra) & Pada Dağılımı
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {data.planets.map((p) => (
                <div
                  key={p.name}
                  className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-700/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <span className="text-amber-500">{p.symbol}</span>
                      <span>{p.name}</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Lord: {p.nakshatraLord} • {p.d9Sign} (D9)
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-semibold text-[11px] text-zinc-800 dark:text-zinc-200">
                      {p.nakshatra} (Pada {p.pada})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Element & Modality Balance */}
      {activeTab === "elements" && (
        <div className="space-y-4">
          {/* Element Progress */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Element Dağılımı</span>
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                Baskın: {data.elementBalance.dominantElement}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Fire */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-red-600 dark:text-red-400">Ateş (Koç, Aslan, Yay)</span>
                  <span>%{data.elementBalance.fire}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${data.elementBalance.fire}%` }}
                  />
                </div>
              </div>

              {/* Earth */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-emerald-600 dark:text-emerald-400">Toprak (Boğa, Başak, Oğlak)</span>
                  <span>%{data.elementBalance.earth}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${data.elementBalance.earth}%` }}
                  />
                </div>
              </div>

              {/* Air */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-sky-600 dark:text-sky-400">Hava (İkizler, Terazi, Kova)</span>
                  <span>%{data.elementBalance.air}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${data.elementBalance.air}%` }}
                  />
                </div>
              </div>

              {/* Water */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-blue-600 dark:text-blue-400">Su (Yengeç, Akrep, Balık)</span>
                  <span>%{data.elementBalance.water}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${data.elementBalance.water}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modality Progress */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" />
                <span>Nitelik Dengesi</span>
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                Baskın: {data.elementBalance.dominantModality}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Cardinal */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-amber-600 dark:text-amber-400">Öncü (Liderlik, Başlatma)</span>
                  <span>%{data.elementBalance.cardinal}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${data.elementBalance.cardinal}%` }}
                  />
                </div>
              </div>

              {/* Fixed */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-indigo-600 dark:text-indigo-400">Sabit (Kalıcılık, Direnç)</span>
                  <span>%{data.elementBalance.fixed}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${data.elementBalance.fixed}%` }}
                  />
                </div>
              </div>

              {/* Mutable */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-purple-600 dark:text-purple-400">Değişken (Uyum, Esneklik)</span>
                  <span>%{data.elementBalance.mutable}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${data.elementBalance.mutable}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Aspects */}
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

      {/* TAB 6: Detailed Interpretations */}
      {activeTab === "interpretations" && (
        <div className="space-y-3.5">
          {data.planets.map((p) => {
            const planetComments =
              PLANET_SIGN_INTERPRETATIONS[p.name]?.[p.sign] || [];
            const retroComment = p.isRetrograde
              ? RETRO_INTERPRETATIONS[p.name]
              : null;

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
                    {p.name} enerjisi {p.sign} burcunda kendini güçlü ve belirgin bir şekilde hissettirir.
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
