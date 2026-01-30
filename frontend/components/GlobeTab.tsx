"use client";
import { useState } from "react";

import GlobeVisualization from "@/components/GlobeVisualization";
import { LocationData } from "@/types/location";

export default function Globetab({ locations }: { locations: LocationData[] }) {
  const [clickedLabel, setClickedLabel] = useState<LocationData | null>(
    locations[0] || null,
  );
  return (
    <div className="flex flex-col">
      <div className="flex gap-6">
        <div className="rounded-lg border border-slate-700 h-150 w-full flex items-center justify-center">
          <GlobeVisualization
            locations={locations}
            clickedLabel={clickedLabel}
            setClickedLabel={setClickedLabel}
          />
        </div>
        {/* Location List */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-4">
            Loaded Locations
          </h3>
          {locations.map((loc, i) => (
            <button
              key={i}
              className="w-50 p-1 text-center border border-slate-700/50 hover:border-cyan-400/40 transition cursor-pointer"
              onClick={() => setClickedLabel(loc)}
            >
              <p className="text-white">{loc.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
