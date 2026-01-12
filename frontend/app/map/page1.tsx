"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import LocationStats from "@/components/LocationStats";
import type { LocationData } from "@/types";

const InteractiveEarth = dynamic(
  () => import("@/components/InteractiveEarth"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Earth...</p>
        </div>
      </div>
    ),
  }
);

export default function MapPage() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [hoveredLocation, setHoveredLocation] = useState<LocationData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/upload");
        const result = await response.json();

        if (result.success && result.data) {
          setLocations(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch location data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="h-screen w-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 text-white py-4 px-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Interactive Earth Map</h1>
            <p className="text-sm text-gray-300">
              {locations.length} locations visualized
            </p>
          </div>
          <Link
            href="/upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Upload New CSV
          </Link>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 bg-gray-900 relative">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading data...</p>
              </div>
            </div>
          ) : (
            <InteractiveEarth
              locations={locations}
              onLocationHover={setHoveredLocation}
            />
          )}

          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
            <p>🖱️ Drag to rotate | Scroll to zoom</p>
          </div>
        </div>

        <div className="w-96 bg-gray-100 overflow-hidden">
          <LocationStats
            locations={locations}
            hoveredLocation={hoveredLocation}
          />
        </div>
      </div>
    </main>
  );
}
