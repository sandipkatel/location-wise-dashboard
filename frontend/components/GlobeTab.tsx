// "use client";
// import { useState } from "react";

// import GlobeVisualization from "@/components/GlobeVisualization";
// import { LocationData } from "@/types/location";

// export default function Globetab({ locations }: { locations: LocationData[] }) {
//   const [clickedLabel, setClickedLabel] = useState<LocationData | null>(
//     locations[0] || null,
//   );
//   return (
//     <div className="flex flex-col">
//       <div className="flex gap-6">
//         <div className="rounded-lg border border-slate-700 h-150 w-full flex items-center justify-center">
//           <GlobeVisualization
//             locations={locations}
//             clickedLabel={clickedLabel}
//             setClickedLabel={setClickedLabel}
//           />
//         </div>
//         {/* Location List */}
//         <div className="flex-1">
//           <h3 className="text-lg font-semibold text-white mb-4">
//             Loaded Locations
//           </h3>
//           {locations.map((loc, i) => (
//             <button
//               key={i}
//               className="w-50 p-1 text-center border border-slate-700/50 hover:border-cyan-400/40 transition cursor-pointer"
//               onClick={() => setClickedLabel(loc)}
//             >
//               <p className="text-white">{loc.name}</p>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import GlobeVisualization from "./GlobeVisualization";
import { LocationData } from "@/types/location";
import { AnalyticalData } from "@/types/analytics";
import { MapPin, TrendingUp } from "lucide-react";

interface Props {
  locations: LocationData[];
  significantCol: string;
  analyticalData: AnalyticalData | null;
}

export default function GlobeTab({ locations, significantCol, analyticalData }: Props) {
  const [clickedLabel, setClickedLabel] = useState<LocationData | null>(
    locations.length > 0 ? locations[0] : null
  );

  // Get top locations by significant column value
  const topLocations = [...locations]
    .sort((a, b) => b.significantCol - a.significantCol)
    .slice(0, 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Sidebar - Location Details */}
      <div className="lg:col-span-1 space-y-6">
        {/* Selected Location Card */}
        <div className="rounded-xl shadow-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            {clickedLabel ? "Selected Location" : "Overview"}
          </h3>

          {clickedLabel ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Location</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {clickedLabel.name}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Latitude</p>
                  <p className="text-lg font-semibold text-white">
                    {clickedLabel.latitude.toFixed(4)}°
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Longitude</p>
                  <p className="text-lg font-semibold text-white">
                    {clickedLabel.longitude.toFixed(4)}°
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 rounded-lg p-4 border border-cyan-500/30">
                <p className="text-sm text-gray-400 mb-1">{significantCol}</p>
                <p className="text-3xl font-bold text-cyan-400">
                  {clickedLabel.significantCol.toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Total Locations</p>
                <p className="text-3xl font-bold text-white">{locations.length}</p>
              </div>
              {analyticalData && (
                <div className="rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Total Data Points</p>
                  <p className="text-3xl font-bold text-white">
                    {analyticalData.overview.total_rows.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Top Locations List */}
        <div className="rounded-xl shadow-2xl p-6 border border-slate-700 max-h-[500px] overflow-y-auto">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Top Locations
          </h3>
          <div className="space-y-2">
            {topLocations.map((loc, idx) => (
              <button
                key={idx}
                onClick={() => setClickedLabel(loc)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  clickedLabel?.name === loc.name
                    ? "bg-cyan-500 text-white shadow-lg"
                    : "bg-slate-900 hover:bg-slate-800 text-gray-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium block">{loc.name}</span>
                    <span className="text-xs opacity-75">
                      {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                    </span>
                  </div>
                  <span className={`text-sm font-bold ${
                    clickedLabel?.name === loc.name ? "text-white" : "text-cyan-400"
                  }`}>
                    {loc.significantCol.toLocaleString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats from Analytics */}
        {analyticalData?.location_analysis && (
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-xl p-6 border border-cyan-500/30">
            <h3 className="text-sm font-bold text-cyan-400 mb-3">Location Analysis</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Detected Column:</span>
                <span className="text-white font-medium">
                  {analyticalData.location_analysis.detected_location_column}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Unique Locations:</span>
                <span className="text-white font-medium">
                  {analyticalData.location_analysis.unique_locations}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Side - Globe */}
      <div className="lg:col-span-3">
        <div className="rounded-xl shadow-2xl border border-slate-700 h-[700px]">
          <GlobeVisualization
            locations={locations}
            clickedLabel={clickedLabel}
            setClickedLabel={setClickedLabel}
          />
        </div>
      </div>
    </div>
  );
}