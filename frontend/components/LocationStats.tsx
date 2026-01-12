"use client";

import type { LocationData, CountryStats } from "@/types";

interface LocationStatsProps {
  locations: LocationData[];
  hoveredLocation: LocationData | null;
}

export default function LocationStats({
  locations,
  hoveredLocation,
}: LocationStatsProps) {
  const countryStats: CountryStats[] = Object.values(
    locations.reduce((acc, loc) => {
      if (!acc[loc.country]) {
        acc[loc.country] = {
          country: loc.country,
          count: 0,
          cities: [],
        };
      }
      acc[loc.country].count += loc.count || 1;
      if (loc.city && !acc[loc.country].cities.includes(loc.city)) {
        acc[loc.country].cities.push(loc.city);
      }
      return acc;
    }, {} as Record<string, CountryStats>)
  ).sort((a, b) => b.count - a.count);

  const totalLocations = locations.reduce(
    (sum, loc) => sum + (loc.count || 1),
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Location Statistics
      </h2>

      {hoveredLocation && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <h3 className="font-semibold text-blue-900">Selected Location</h3>
          <p className="text-sm text-blue-800">
            {hoveredLocation.city && <span>{hoveredLocation.city}, </span>}
            <span className="font-medium">{hoveredLocation.country}</span>
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Count: {hoveredLocation.count || 1} | Value:{" "}
            {hoveredLocation.value?.toFixed(2) || "N/A"}
          </p>
        </div>
      )}

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
            <p className="text-sm opacity-90">Total Locations</p>
            <p className="text-3xl font-bold">{locations.length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
            <p className="text-sm opacity-90">Total Entries</p>
            <p className="text-3xl font-bold">{totalLocations}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">By Country</h3>
        <div className="space-y-3">
          {countryStats.map((stat, index) => (
            <div
              key={index}
              className="border-l-4 border-blue-400 pl-3 py-2 bg-gray-50 rounded"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">
                  {stat.country}
                </span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {stat.count}
                </span>
              </div>
              {stat.cities.length > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  Cities: {stat.cities.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {locations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No location data available.</p>
          <p className="text-sm mt-2">
            Upload a CSV file to visualize locations.
          </p>
        </div>
      )}
    </div>
  );
}
