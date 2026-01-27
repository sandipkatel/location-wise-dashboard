"use client";

import GlobeVisualization from "@/components/GlobeVisualization";
import { LocationData } from "@/types/location";

export default function Globetab({ locations }: { locations: LocationData[] }) {
  console.log("Locations in GlobeTab:", locations);
  return (
    <div className="flex flex-col">
      <div className="flex gap-6">
        <div className="rounded-lg border border-slate-700 h-150 w-full flex items-center justify-center">
          <GlobeVisualization locations={locations} />
        </div>
        {/* Location List */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-4">
            Loaded Locations
          </h3>
          {locations.map((loc, i) => (
            <div
              key={i}
              className="w-50 mb-2 p-1 text-center bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-400/50 transition cursor-pointer"
            >
              <p className="text-white">{loc.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
