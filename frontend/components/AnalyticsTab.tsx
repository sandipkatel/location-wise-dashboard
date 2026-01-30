"use client";

import { LocationData } from "@/types/location";

export default function AnalyticsTab({
  locations,
}: {
  locations: LocationData[];
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
      <p className="text-gray-400 text-sm mb-2">Total Locations</p>
    </div>
  );
}
