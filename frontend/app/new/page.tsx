"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Papa from "papaparse";
import Globe from 'react-globe.gl';

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
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

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

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "20px",
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <h1 style={{ color: "white", margin: "0 0 15px 0", fontSize: "24px" }}>
          Interactive Globe CSV Viewer
        </h1>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <label
            style={{
              padding: "10px 20px",
              background: "#4F46E5",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Upload CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </label>

          <button
            onClick={loadSampleData}
            style={{
              padding: "10px 20px",
              background: "#059669",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Load Sample Data
          </button>

          <span style={{ color: "#9CA3AF", fontSize: "14px" }}>
            {locations.length > 0 && `${locations.length} locations loaded`}
          </span>
        </div>

        {error && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "6px",
              color: "#FCA5A5",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "6px",
            color: "#93C5FD",
            fontSize: "12px",
          }}
        >
          CSV should include columns: <strong>lat/latitude</strong>,{" "}
          <strong>lng/lon/longitude</strong>, and optionally{" "}
          <strong>name/city/country</strong>
        </div>
      </div>

      {/* Globe */}
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
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
      />

      {/* Info Panel */}
      {locations.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(10px)",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "white",
            maxWidth: "300px",
            maxHeight: "300px",
            overflow: "auto",
            fontSize: "13px",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Locations</h3>
          {locations.map((loc, i) => (
            <div
              key={i}
              style={{
                padding: "8px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                cursor: "pointer",
              }}
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
              <div style={{ fontWeight: "bold", color: "#FF6B6B" }}>
                {loc.name}
              </div>
              <div style={{ color: "#9CA3AF", fontSize: "11px" }}>
                {loc.lat.toFixed(2)}, {loc.lng.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
