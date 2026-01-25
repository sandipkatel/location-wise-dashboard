"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface LocationData {
  name: string;
  lat: number;
  lng: number;
  population?: number;
  [key: string]: any;
}

export default function GlobeVisualization() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [error, setError] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sample data for demo
  const sampleData = [
    { name: "New York", lat: 40.7128, lng: -74.006, population: 8336817 },
    { name: "London", lat: 51.5074, lng: -0.1278, population: 8982000 },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503, population: 13960000 },
    { name: "Paris", lat: 48.8566, lng: 2.3522, population: 2161000 },
    { name: "Sydney", lat: -33.8688, lng: 151.2093, population: 5312000 },
  ];

  // Measure container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Auto-rotate globe
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.15;
    }
  }, []);

  useEffect(() => {
    setLocations(sampleData);
    setError("");
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-black rounded-lg overflow-hidden"
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          pointsData={locations}
          pointAltitude={0.01}
          pointColor={() => "#FF6B6B"}
          pointRadius={0.5}
          pointLabel={(d: any) => `
            <div style="background: rgba(0,0,0,0.8); padding: 10px; border-radius: 6px; color: white;">
              <strong>${d.name}</strong><br/>
              Lat: ${d.lat.toFixed(4)}<br/>
              Lng: ${d.lng.toFixed(4)}
              ${d.population ? `<br/>Pop: ${d.population.toLocaleString()}` : ""}
            </div>
          `}
          arcsData={
            locations.length > 1
              ? locations.slice(0, -1).map((d, i) => ({
                  startLat: d.lat,
                  startLng: d.lng,
                  endLat: locations[i + 1].lat,
                  endLng: locations[i + 1].lng,
                }))
              : []
          }
          arcColor={() => "rgba(139, 92, 246, 0.3)"}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={3000}
          arcStroke={0.5}
          showAtmosphere={true}
          atmosphereColor="#aaaaaa"
          atmosphereAltitude={0.2}
        />
      )}
    </div>
  );
}