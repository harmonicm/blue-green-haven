"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ReportForm from "../components/ReportForm";

const InteractiveMap = dynamic(() => import("../components/Map"), { ssr: false });

const EUROPEAN_CITIES = [
  { name: "Athens, Greece", lat: 37.9838, lng: 23.7275 },
  { name: "Madrid, Spain", lat: 40.4168, lng: -3.7038 },
  { name: "Rome, Italy", lat: 41.9028, lng: 12.4964 },
];

export default function Dashboard() {
  const [selectedCity, setSelectedCity] = useState(EUROPEAN_CITIES[0]);
  const [streams, setStreams] = useState<any>(null);
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [isSimulatedHeatwave, setIsSimulatedHeatwave] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const [selectedMapCoords, setSelectedMapCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeTab, setActiveTab] = useState<"citizen" | "municipal">("citizen");
  const [showRoute, setShowRoute] = useState<boolean>(true);
  const [stewardshipPoints, setStewardshipPoints] = useState<number>(140);

  useEffect(() => {
    setMounted(true);

    fetch('/api/streams')
      .then(res => res.json())
      .then(data => setStreams(data))
      .catch(err => console.error("Real stream fetch failed:", err));

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lng}&current=temperature_2m`)
      .then(res => res.json())
      .then(data => {
        if (data.current && data.current.temperature_2m !== undefined) {
          setCurrentTemp(data.current.temperature_2m);
        }
      })
      .catch(err => console.error("Real weather fetch failed:", err));
  }, [selectedCity]);

  const handleAddReport = (newFeature: any) => {
    setStreams((prevData: any) => ({
      ...prevData,
      features: [...prevData.features, newFeature]
    }));
    setStewardshipPoints(prev => prev + 50);
  };

  const exportDataForResearchers = () => {
    if (!streams) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(streams, null, 2))}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `oneaquahealth_resilience_data_${selectedCity.name.replace(/[^a-zA-Z]/g, "_")}.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const activeTemp = isSimulatedHeatwave ? 37.4 : currentTemp;
  const isExtremeHeat = activeTemp !== null && activeTemp >= 30;

  const totalStreams = streams?.features?.length || 0;
  const healthyStreams = streams?.features?.filter((f: any) => f.properties.healthStatus === "Healthy").length || 0;
  const degradedStreams = totalStreams - healthyStreams;
  const microclimateTemp = activeTemp !== null ? (activeTemp - 2.8).toFixed(1) : "--";

  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white">Blue-Green Haven 🌊🍃</h1>
          </header>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation & Master Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌿💧</span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Blue-Green Haven</h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 font-mono">
                One Health v2.5
              </span>
            </div>
            <p className="text-slate-400 mt-1 text-sm">
              Operational Urban Freshwater Resilience Platform & Thermal Refuge Navigation.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* European Pilot City Selector */}
            <select
              value={selectedCity.name}
              onChange={(e) => {
                const city = EUROPEAN_CITIES.find(c => c.name === e.target.value);
                if (city) setSelectedCity(city);
              }}
              className="bg-slate-900 text-cyan-300 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
            >
              {EUROPEAN_CITIES.map(c => (
                <option key={c.name} value={c.name}>📍 {c.name}</option>
              ))}
            </select>

            {/* View Mode Switcher */}
            <div className="bg-slate-900 border border-slate-800 p-1 rounded-lg flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("citizen")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === "citizen" ? "bg-cyan-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                🚶 Citizen Safe Router
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("municipal")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === "municipal" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                🏛 City & Research Hub
              </button>
            </div>

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setIsSimulatedHeatwave(!isSimulatedHeatwave)}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs tracking-wide transition border ${
                isSimulatedHeatwave 
                  ? "bg-rose-950 text-rose-300 border-rose-800" 
                  : "bg-slate-900 text-slate-300 border-slate-700"
              }`}
            >
              {isSimulatedHeatwave ? "🔴 Heatwave Active (37.4°C)" : "⚡ Set 37.4°C Heatwave"}
            </button>
          </div>
        </header>

        {/* Quantified Analytics Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Urban Concrete Heat</p>
            <div className={`text-3xl font-black mt-1 ${isExtremeHeat ? 'text-rose-500' : 'text-amber-400'}`}>
              {activeTemp !== null ? `${activeTemp}°C` : "..."}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Open-Meteo Ground Air Temp ({selectedCity.name.split(',')[0]})</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Riparian Cooling Oasis</p>
            <div className="text-3xl font-black mt-1 text-emerald-400">
              {microclimateTemp}°C
            </div>
            <p className="text-[11px] text-emerald-500/80 mt-1">ΔT = -2.8°C thermal refuge factor</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Water Biosecurity</p>
            <div className="text-3xl font-black mt-1 text-cyan-400">
              {healthyStreams} <span className="text-xs font-normal text-slate-500">active</span> / <span className="text-rose-400">{degradedStreams} flagged</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Real-time citizen ground-truth</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Citizen Stewardship</p>
            <div className="text-3xl font-black mt-1 text-amber-400 flex items-center gap-2">
              🏆 {stewardshipPoints} <span className="text-xs font-mono text-slate-400 font-normal">pts</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Rank: Watershed Guardian (Tier 2)</p>
          </div>
        </div>

        {/* Dynamic Mode Content */}
        {activeTab === "citizen" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-6">
              
              {/* Route Suggestion Card */}
              <div className="bg-slate-900/90 border border-cyan-900/50 p-5 rounded-2xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <span>🧭</span> Thermal Comfort Routing
                  </h2>
                  <button 
                    type="button"
                    onClick={() => setShowRoute(!showRoute)}
                    className="text-[11px] text-slate-400 hover:text-white underline"
                  >
                    {showRoute ? "Hide Paths" : "Show Paths"}
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-emerald-300 font-bold">
                      <span>🟢 Blue-Green Corridor Path</span>
                      <span>34.6°C</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">Rerouted via riparian canopy. 72% tree shade coverage.</p>
                    <div className="text-[10px] text-emerald-400 font-semibold pt-1">Recommended for elderly & vulnerable</div>
                  </div>

                  <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-1 opacity-70">
                    <div className="flex justify-between items-center text-rose-300 font-semibold">
                      <span>🔴 Direct Concrete Avenue</span>
                      <span>37.4°C</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">Asphalt radiation spike. Zero thermal mitigation.</p>
                  </div>
                </div>
              </div>

              {/* Simplified Observation Form with GPS auto-fill */}
              <ReportForm onAddReport={handleAddReport} selectedCoords={selectedMapCoords} />
            </div>

            {/* Spatial Map Canvas */}
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl shadow-2xl">
              <InteractiveMap 
                streamData={streams} 
                userTemp={activeTemp || 30} 
                onSelectCoords={(lat, lng) => setSelectedMapCoords({ lat, lng })}
                showCoolingRoute={showRoute}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-6">
              
              <div className="bg-slate-900 border border-indigo-900/50 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    🏛 Municipal Workorder Generator
                  </h2>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                    Auto-Dispatched
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Degraded stream reports automatically compile into remediation tickets for municipal sanitation and environmental response teams.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex justify-between font-mono text-[11px] text-amber-400">
                      <span>WO-2026-EU-089</span>
                      <span className="text-rose-400 font-bold">Priority High</span>
                    </div>
                    <p className="font-semibold text-slate-200">Culvert Eutrophication & Flow Stagnation</p>
                    <p className="text-[11px] text-slate-400">Algal scum reported. Microclimatic evaporative cooling offline.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={exportDataForResearchers}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition"
                >
                  📥 Export OGC / GeoJSON Layer
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  EU Standards Compliance
                </h3>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                  <li>Directly integrates OpenStreetMap spatial waterways schema.</li>
                  <li>Open-Meteo hourly reanalysis integration.</li>
                  <li>OneAquaHealth Horizon Europe bio-indicator compatible.</li>
                </ul>
              </div>

            </div>

            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl shadow-2xl">
              <InteractiveMap 
                streamData={streams} 
                userTemp={activeTemp || 30} 
                onSelectCoords={(lat, lng) => setSelectedMapCoords({ lat, lng })}
                showCoolingRoute={false}
              />
            </div>
          </div>
        )}

      </div>
    </main>
  );
}