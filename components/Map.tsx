"use client";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function LocationPicker({ onSelectLocation }: { onSelectLocation: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelectLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function Map({ 
  streamData, 
  userTemp, 
  onSelectCoords,
  showCoolingRoute
}: { 
  streamData: any, 
  userTemp: number,
  onSelectCoords?: (lat: number, lng: number) => void,
  showCoolingRoute?: boolean
}) {
  const position: [number, number] = [37.9838, 23.7275];

  // Route paths across the urban core (Simulated safe riparian path vs asphalt street path)
  const safeRiparianPath: [number, number][] = [
    [37.9838, 23.7275],
    [37.9810, 23.7310],
    [37.9780, 23.7340],
    [37.9750, 23.7360]
  ];

  const standardHotPath: [number, number][] = [
    [37.9838, 23.7275],
    [37.9850, 23.7330],
    [37.9820, 23.7380],
    [37.9750, 23.7360]
  ];

  return (
    <div className="relative">
      <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur border border-slate-700 text-xs px-3 py-1.5 rounded-lg text-slate-300">
        💡 Tip: Click anywhere to log a point. Green = Safe Path, Red = High Heat Street.
      </div>

      <MapContainer center={position} zoom={13} className="h-[620px] w-full rounded-xl shadow-2xl z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {onSelectCoords && <LocationPicker onSelectLocation={onSelectCoords} />}

        {/* Display routing paths when requested */}
        {showCoolingRoute && (
          <>
            <Polyline 
              positions={safeRiparianPath} 
              pathOptions={{ color: '#10b981', weight: 5, dashArray: '6, 8', opacity: 0.9 }} 
            />
            <Polyline 
              positions={standardHotPath} 
              pathOptions={{ color: '#f43f5e', weight: 3, opacity: 0.5 }} 
            />
          </>
        )}

        {streamData?.features?.map((stream: any) => {
          const isHealthy = stream.properties.healthStatus === "Healthy";
          const coords: [number, number] = [stream.geometry.coordinates[1], stream.geometry.coordinates[0]];

          return (
            <div key={stream.properties.id}>
              <Marker position={coords} icon={defaultIcon}>
                <Popup>
                  <div className="p-1 space-y-1 font-sans text-slate-900">
                    <p className="font-bold text-sm border-b pb-1">{stream.properties.name}</p>
                    <p className="text-xs">
                      <strong>Microclimate Status:</strong>{" "}
                      <span className={isHealthy ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                        {isHealthy ? "Active Cooling Oasis (-2.8°C)" : "Stagnant (Vector Risk)"}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {isHealthy 
                        ? "Safe shaded thermal relief. Evaporative cooling functioning."
                        : "Biosecurity warning: cyanobacteria & Culex mosquito breeding risk."}
                    </p>
                  </div>
                </Popup>
              </Marker>
              
              {/* Healthy stream cooling buffer */}
              {isHealthy ? (
                <Circle 
                  center={coords} 
                  pathOptions={{ fillColor: '#06b6d4', color: '#0284c7', fillOpacity: 0.25 }} 
                  radius={800} 
                />
              ) : (
                /* Degraded stagnant risk zone */
                <Circle 
                  center={coords} 
                  pathOptions={{ fillColor: '#f43f5e', color: '#be123c', fillOpacity: 0.2 }} 
                  radius={450} 
                />
              )}
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}