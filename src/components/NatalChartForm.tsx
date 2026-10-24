"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import rawCities from "@/data/cities.json";
import { CityInfo } from "@/types/natal";
import { CalculateChartParams } from "@/lib/natal-engine";
import { MapPin, Calendar, Clock, User, Sparkles, ChevronDown } from "lucide-react";

interface NatalChartFormProps {
  onCalculate: (params: CalculateChartParams) => void;
  loading?: boolean;
}

const CITIES: CityInfo[] = (rawCities as CityInfo[]).sort((a, b) =>
  a.city.localeCompare(b.city, "tr")
);

// Default to Istanbul
const DEFAULT_CITY: CityInfo = CITIES.find((c) => c.city === "İstanbul") || {
  city: "İstanbul",
  lat: 41.0138,
  lng: 28.9603,
  tz: "Europe/Istanbul",
};

export function NatalChartForm({ onCalculate, loading }: NatalChartFormProps) {
  const [name, setName] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("1995-05-15");
  const [birthTime, setBirthTime] = useState<string>("14:30");
  const [selectedCity, setSelectedCity] = useState<CityInfo>(DEFAULT_CITY);
  const [searchQuery, setSearchQuery] = useState<string>(DEFAULT_CITY.city);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter cities by search query
  const filteredCities = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase("tr");
    if (!q) return CITIES.slice(0, 40);
    return CITIES.filter((c) =>
      c.city.toLocaleLowerCase("tr").includes(q)
    ).slice(0, 40);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (c: CityInfo) => {
    setSelectedCity(c);
    setSearchQuery(c.city);
    setIsCityDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity) return;
    onCalculate({
      name: name.trim() || "Harita Sahibi",
      birthDate,
      birthTime,
      city: selectedCity.city,
      lat: selectedCity.lat,
      lon: selectedCity.lng,
      timezone: selectedCity.tz,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4 transition-all"
    >
      <div className="border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Doğum Haritası Hesaplama</span>
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Gezegenlerin burç ve ev konumlarını, yükselen burcunuzu ve önemli açılarınızı öğrenin.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Name input */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span>İsminiz (Opsiyonel)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: Burak"
            className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
        </div>

        {/* City Autocomplete */}
        <div className="space-y-1.5 sm:col-span-2 relative" ref={dropdownRef}>
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>Doğum Yeri (Şehir)</span>
            </span>
            <span className="text-[11px] text-zinc-400 font-normal">
              {CITIES.length} Şehir
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsCityDropdownOpen(true);
              }}
              onFocus={() => setIsCityDropdownOpen(true)}
              placeholder="Şehir yazın veya listeden seçin..."
              className="w-full px-3.5 py-2.5 pr-8 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              required
            />
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Selected city info badge */}
          {selectedCity && (
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 pt-0.5">
              <span>Seçilen: <strong className="text-zinc-700 dark:text-zinc-200">{selectedCity.city}</strong></span>
              <span>•</span>
              <span>{selectedCity.lat.toFixed(2)}°, {selectedCity.lng.toFixed(2)}°</span>
              <span>•</span>
              <span>{selectedCity.tz}</span>
            </div>
          )}

          {/* Dropdown list */}
          {isCityDropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg scrollbar-thin">
              {filteredCities.length > 0 ? (
                filteredCities.map((c) => (
                  <button
                    key={`${c.city}-${c.lat}-${c.lng}`}
                    type="button"
                    onClick={() => handleSelectCity(c)}
                    className="w-full text-left px-3.5 py-2 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between border-b border-zinc-50 dark:border-zinc-800/40 last:border-0 cursor-pointer"
                  >
                    <span className="font-medium">{c.city}</span>
                    <span className="text-[10px] text-zinc-400">
                      {c.tz}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3.5 py-3 text-xs text-zinc-400 text-center">
                  Şehir bulunamadı.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Birth Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Doğum Tarihi</span>
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
            required
          />
        </div>

        {/* Birth Time */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Doğum Saati</span>
          </label>
          <input
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
            required
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-amber-600 dark:hover:bg-amber-500 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? "Hesaplanıyor..." : "Haritayı Hesapla"}</span>
        </button>
      </div>
    </form>
  );
}
