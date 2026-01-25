"use client";

import { LocationData } from "@/types/location";

export default function TableTab({ locations }: { locations: LocationData[] }) {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-700/50 border-b border-slate-600">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
              Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
              Latitude
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
              Longitude
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-600">
          {locations.map((loc, i) => (
            <tr key={i} className="hover:bg-slate-700/30 transition">
              <td className="px-6 py-4 text-white font-medium">{loc.name}</td>
              <td className="px-6 py-4 text-gray-300">{loc.lat.toFixed(4)}</td>
              <td className="px-6 py-4 text-gray-300">{loc.lng.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
