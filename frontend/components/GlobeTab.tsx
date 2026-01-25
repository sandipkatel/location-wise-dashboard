"use client";

import GlobeVisualization from "@/components/GlobeVisualization";
import { LocationData } from "@/types/location";

export default function Globetab({ locations }: { locations: LocationData[] }) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-6">
        <div className="rounded-lg border border-slate-700 h-150 w-full flex items-center justify-center">
          <GlobeVisualization />
        </div>
        {/* Location List */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-4">
            Loaded Locations
          </h3>
          <div className="grid grid-rows-4 gap-4">
            {locations.map((loc, i) => (
              <div
                key={i}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-cyan-400/50 transition cursor-pointer"
              >
                <p className="font-semibold text-white">{loc.name}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {loc.lat.toFixed(2)}°N
                </p>
                <p className="text-xs text-gray-400">{loc.lng.toFixed(2)}°W</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
