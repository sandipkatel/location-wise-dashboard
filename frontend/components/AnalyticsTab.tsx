"use client";

import { LocationData } from "@/types/location";

export default function AnalyticsTab({
  locations,
}: {
  locations: LocationData[];
}) {
  const stats = {
    total: locations.length,
    avgLat:
      locations.length > 0
        ? (
            locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length
          ).toFixed(2)
        : 0,
    avgLng:
      locations.length > 0
        ? (
            locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length
          ).toFixed(2)
        : 0,
  };
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
        <p className="text-gray-400 text-sm mb-2">Total Locations</p>
        <p className="text-3xl font-bold text-cyan-400">{stats.total}</p>
      </div>
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
        <p className="text-gray-400 text-sm mb-2">Average Latitude</p>
        <p className="text-3xl font-bold text-cyan-400">{stats.avgLat}</p>
      </div>
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
        <p className="text-gray-400 text-sm mb-2">Average Longitude</p>
        <p className="text-3xl font-bold text-cyan-400">{stats.avgLng}</p>
      </div>
    </div>
  );
}
