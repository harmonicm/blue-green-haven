"use client";
import { useState, useEffect } from "react";

export default function ReportForm({ 
  onAddReport,
  selectedCoords 
}: { 
  onAddReport: (feature: any) => void;
  selectedCoords?: { lat: number; lng: number } | null;
}) {
  const [name, setName] = useState("");
  const [lat, setLat] = useState("37.9700");
  const [lng, setLng] = useState("23.7200");
  const [waterCondition, setWaterCondition] = useState<"Healthy" | "Degraded">("Healthy");
  const [submitted, setSubmitted] = useState(false);

  // Sync coords if the user clicked the map
  useEffect(() => {
    if (selectedCoords) {
      setLat(selectedCoords.lat.toFixed(4));
      setLng(selectedCoords.lng.toFixed(4));
      if (!name) setName("Stream Site @" + selectedCoords.lat.toFixed(3));
    }
  }, [selectedCoords]);

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toFixed(4));
          setLng(pos.coords.longitude.toFixed(4));
          if (!name) setName("My Local Stream Area");
        },
        () => alert("Location permission denied. Click on the map instead!")
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFeature = {
      type: "Feature",
      geometry: { 
        type: "Point", 
        coordinates: [parseFloat(lng), parseFloat(lat)] 
      },
      properties: {
        id: Date.now(),
        name: name || "Observed Urban Creek",
        healthStatus: waterCondition,
        flowRate: waterCondition === "Healthy" ? "Flowing" : "Stagnant",
        citizenReports: 1
      }
    };

    onAddReport(newFeature);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setName("");
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Citizen Observation Portal
          </h2>
          <p className="text-[11px] text-slate-400">Empower municipal resilience in 30 seconds</p>
        </div>
        <button
          type="button"
          onClick={handleUseMyLocation}
          className="text-xs bg-slate-700 hover:bg-slate-600 text-cyan-300 px-2.5 py-1 rounded-md transition border border-slate-600"
        >
          📍 Auto GPS
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Simple Name */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Where are you? (Landmark or Creek Name)
          </label>
          <input 
            type="text" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            placeholder="e.g. Park Bridge or Athens Botanical Run"
          />
        </div>

        {/* Visual condition buttons instead of academic jargon */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">
            What does the water look like?
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setWaterCondition("Healthy")}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                waterCondition === "Healthy"
                  ? "bg-emerald-950/60 border-emerald-500 text-white"
                  : "bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              <span className="text-xl">🌊🌿</span>
              <span className="text-xs font-bold mt-2">Flowing & Clear</span>
              <span className="text-[10px] opacity-75">Cools air, clean banks</span>
            </button>

            <button
              type="button"
              onClick={() => setWaterCondition("Degraded")}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                waterCondition === "Degraded"
                  ? "bg-rose-950/60 border-rose-500 text-white"
                  : "bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              <span className="text-xl">⚠️🦟</span>
              <span className="text-xs font-bold mt-2">Stagnant / Dirty</span>
              <span className="text-[10px] opacity-75">Smell, algae, or dry</span>
            </button>
          </div>
        </div>

        {/* Selected Coords confirmation */}
        <div className="text-[11px] text-slate-500 bg-slate-900/70 p-2 rounded border border-slate-800">
          Target Coordinates: <span className="text-slate-300 font-mono">{lat}, {lng}</span>
        </div>

        <button 
          type="submit" 
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-lg text-xs tracking-wider uppercase transition shadow-lg shadow-cyan-900/40"
        >
          Publish Observation
        </button>

        {submitted && (
          <div className="text-center text-xs text-emerald-400 bg-emerald-950/50 p-2 rounded border border-emerald-800 animate-fadeIn">
            ✓ Observation recorded! Municipal cooling model updated.
          </div>
        )}
      </form>
    </div>
  );
}