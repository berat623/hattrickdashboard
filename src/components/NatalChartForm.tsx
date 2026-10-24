"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import rawCities from "@/data/cities.json";
import { CityInfo, HouseSystem, AyanamsaSystem } from "@/types/natal";
import { CalculateChartParams } from "@/lib/natal-engine";
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Sparkles,
  ChevronDown,
  Sliders,
  Globe,
  Settings2,
} from "lucide-react";
import {
  HOUSE_SYSTEM_DETAILS,
  AYANAMSA_DETAILS,
} from "@/lib/natal-interpretations";

interface NatalChartFormProps {
  onCalculate: (params: CalculateChartParams) => void;
  loading?: boolean;
}

const CITIES: CityInfo[] = (rawCities as CityInfo[]).sort((a, b) =>
  a.city.localeCompare(b.city, "tr")
);

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

  // Location mode
  const [useCustomLocation, setUseCustomLocation] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<CityInfo>(DEFAULT_CITY);
  const [searchQuery, setSearchQuery] = useState<string>(DEFAULT_CITY.city);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState<boolean>(false);

  // Custom location fields
  const [customCityName, setCustomCityName] = useState<string>("");
  const [customLat, setCustomLat] = useState<string>("41.01");
  const [customLon, setCustomLon] = useState<string>("28.96");
  const [customTz, setCustomTz] = useState<string>("Europe/Istanbul");

  // Advanced Astrology Settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [houseSystem, setHouseSystem] = useState<HouseSystem>("placidus");
  const [ayanamsaSystem, setAyanamsaSystem] = useState<AyanamsaSystem>("tropical");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter cities by search query
  const filteredCities = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase("tr");
    if (!q) return CITIES.slice(0, 40);
    return CITIES.filter((c) =>
      c.city.toLocaleLowerCase("tr").includes(q)
    ).slice(0, 40);
  }, [searchQuery]);

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

    let city = selectedCity.city;
    let lat = selectedCity.lat;
    let lon = selectedCity.lng;
    let timezone = selectedCity.tz;

    if (useCustomLocation) {
      city = customCityName.trim() || "Özel Konum";
      lat = parseFloat(customLat) || 0;
      lon = parseFloat(customLon) || 0;
      timezone = customTz.trim() || "Europe/Istanbul";
    }

    onCalculate({
      name: name.trim() || "Harita Sahibi",
      birthDate,
      birthTime,
      city,
      lat,
      lon,
      timezone,
      houseSystem,
      ayanamsaSystem,
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
          <span>Detaylı Doğum & D9 Navamsha Haritası</span>
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Gezegenlerin hassas boylamları, 7 ev sistemi, 6 ayanamsa seçeneği, 27 Nakshatra ve D9 Navamsha harmoni analizi.
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

        {/* Location Section */}
        <div className="space-y-2 sm:col-span-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>Doğum Yeri</span>
            </label>

            {/* Toggle between City List and Custom Coordinates */}
            <button
              type="button"
              onClick={() => setUseCustomLocation(!useCustomLocation)}
              className="text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3 h-3" />
              <span>
                {useCustomLocation ? "Listeden Şehir Seç" : "Özel Koordinat / Dünya"}
              </span>
            </button>
          </div>

          {!useCustomLocation ? (
            <div className="space-y-1.5 relative" ref={dropdownRef}>
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

              {selectedCity && (
                <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 pt-0.5">
                  <span>
                    Seçilen:{" "}
                    <strong className="text-zinc-700 dark:text-zinc-200">
                      {selectedCity.city}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    {selectedCity.lat.toFixed(2)}°, {selectedCity.lng.toFixed(2)}°
                  </span>
                  <span>•</span>
                  <span>{selectedCity.tz}</span>
                </div>
              )}

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
          ) : (
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Şehir / Yer Adı</span>
                  <input
                    type="text"
                    value={customCityName}
                    onChange={(e) => setCustomCityName(e.target.value)}
                    placeholder="Örn: Tokyo veya Köy / Kasaba"
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Zaman Dilimi (IANA)</span>
                  <input
                    type="text"
                    value={customTz}
                    onChange={(e) => setCustomTz(e.target.value)}
                    placeholder="Örn: Europe/Istanbul veya Asia/Tokyo"
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Enlem (-90..90)</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    placeholder="41.01"
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Boylam (-180..180)</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={customLon}
                    onChange={(e) => setCustomLon(e.target.value)}
                    placeholder="28.96"
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Settings Accordion */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/60 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-xs font-semibold text-zinc-800 dark:text-zinc-200"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span>Gelişmiş Astroloji Sistemleri (Ev & Ayanamsa)</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-zinc-400 transition-transform ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </button>

        {showAdvanced && (
          <div className="mt-2.5 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 space-y-3.5 text-xs animate-in fade-in duration-200">
            {/* House System Selector */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-700 dark:text-zinc-300 block">
                Ev Sistemi (House System)
              </label>
              <select
                value={houseSystem}
                onChange={(e) => setHouseSystem(e.target.value as HouseSystem)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="placidus">Placidus (En Popüler / Standart)</option>
                <option value="whole_sign">Whole Sign / Tüm Burç (Kadim Vedik & Helenistik)</option>
                <option value="equal">Equal House / Eşit Ev (30° Eşit Dilimler)</option>
                <option value="porphyry">Porphyry (Dört Kadran Üçlemesi)</option>
                <option value="koch">Koch (Doğum Yeri Hassas)</option>
                <option value="regiomontanus">Regiomontanus (Gök Ekvatoru Esaslı)</option>
                <option value="campanus">Campanus (Prime Vertical Esaslı)</option>
              </select>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {HOUSE_SYSTEM_DETAILS[houseSystem]?.desc}
              </p>
            </div>

            {/* Ayanamsa System Selector */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-700 dark:text-zinc-300 block">
                Zodyak & Ayanamsa Sistemi
              </label>
              <select
                value={ayanamsaSystem}
                onChange={(e) => setAyanamsaSystem(e.target.value as AyanamsaSystem)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="tropical">Tropikal (Batı Astrolojisi - 0° Koç Ekinoksu)</option>
                <option value="lahiri">Lahiri / Chitrapaksha (Resmi Vedik Standart)</option>
                <option value="kp">Krishnamurti Paddhati (KP Sistemi)</option>
                <option value="raman">B.V. Raman (Geleneksel Vedik)</option>
                <option value="fagan_bradley">Fagan / Bradley (Batı Sidereal)</option>
                <option value="yukteshwar">Sri Yukteshwar (Ezoterik / Yuga)</option>
              </select>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {AYANAMSA_DETAILS[ayanamsaSystem]?.desc}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-amber-600 dark:hover:bg-amber-500 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? "Hesaplanıyor..." : "Haritayı ve D9 Navamsha'yı Hesapla"}</span>
        </button>
      </div>
    </form>
  );
}
