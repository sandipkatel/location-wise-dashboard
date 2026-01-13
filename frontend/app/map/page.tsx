"use client";

import React, { useState, useEffect, useRef, use } from "react";
import dynamic from "next/dynamic";
import Papa from "papaparse";
import Globe from "react-globe.gl";

export default function GlobeViewer() {
  const [locations, setLocations] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [error, setError] = useState("");
  const globeEl = useRef();

  // Sample data for demo
  const sampleData = [
    { name: "New York", lat: 40.7128, lng: -74.006, population: 8336817 },
    { name: "London", lat: 51.5074, lng: -0.1278, population: 8982000 },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503, population: 13960000 },
    { name: "Paris", lat: 48.8566, lng: 2.3522, population: 2161000 },
    { name: "Sydney", lat: -33.8688, lng: 151.2093, population: 5312000 },
  ];

  useEffect(() => {
    // Auto-rotate globe
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.15;
    }
  }, []);

  const handleGlobeHover = (isHovering) => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = !isHovering;
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }

    setError("");

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          setError("CSV file is empty");
          return;
        }

        setCsvHeaders(results.meta.fields);

        // Try to intelligently map CSV columns to lat/lng
        const data = results.data
          .map((row) => {
            const latKeys = ["lat", "latitude", "Lat", "Latitude"];
            const lngKeys = [
              "lng",
              "lon",
              "longitude",
              "Lng",
              "Lon",
              "Longitude",
            ];
            const nameKeys = [
              "name",
              "city",
              "country",
              "location",
              "Name",
              "City",
              "Country",
              "Location",
            ];

            const lat = latKeys.find((key) => row[key] !== undefined);
            const lng = lngKeys.find((key) => row[key] !== undefined);
            const name = nameKeys.find((key) => row[key] !== undefined);

            return {
              lat: row[lat],
              lng: row[lng],
              name: row[name] || "Unknown",
              ...row,
            };
          })
          .filter((item) => item.lat && item.lng);

        if (data.length === 0) {
          setError(
            "No valid location data found. CSV should have lat/latitude and lng/lon/longitude columns"
          );
          return;
        }

        setLocations(data);
      },
      error: (err) => {
        setError(`Error parsing CSV: ${err.message}`);
      },
    });
  };

  const loadSampleData = () => {
    setLocations(sampleData);
    setError("");
  };

  useEffect(() => {
    loadSampleData();
  }, []);

  return (
    <div className="w-full h-screen flex flex-row">
      {/* Globe */}
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        onGlobeClick={() => handleGlobeHover(true)}
        onGlobeRightClick={() => handleGlobeHover(false)}
        pointsData={locations}
        pointAltitude={0.01}
        pointColor={() => "#FF6B6B"}
        pointRadius={0.5}
        pointLabel={(d) => `
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
        // Atmosphere
        showAtmosphere={true}
        atmosphereColor="#aaaaaa"
        atmosphereAltitude={0.2}
      />

      {/* Info Panel */}
      {locations.length > 0 && (
        <div className="absolute bottom-5 right-60 backdrop-blur-md rounded-lg border border-white/10">
          <h3>Locations</h3>
          {locations.map((loc, i) => (
            <div
              key={i} className="mb-2 cursor-pointer py-2 px-8 hover:bg-white/10 rounded"
              onClick={() => {
                if (globeEl.current) {
                  globeEl.current.pointOfView(
                    {
                      lat: loc.lat,
                      lng: loc.lng,
                      altitude: 2,
                    },
                    1000
                  );
                }
              }}
            >
              <div className="text-base text-orange-500">
                {loc.name}
              </div>
              <div className="text-xs text-gray-300">
                {loc.lat.toFixed(2)}, {loc.lng.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* File Upload */}
      <div className="absolute h-full w-50 right-0 bg-gray-800 opacity-50 border border-white/20">
      <p>
        Upload Your CSV file here...
      </p>
      </div>
    </div>
  );
}
