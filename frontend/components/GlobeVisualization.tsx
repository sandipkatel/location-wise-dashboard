"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { LocationData } from "@/types/location";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function GlobeVisualization({
  locations,
  clickedLabel,

  setClickedLabel,
}: {
  locations: LocationData[];
  clickedLabel: LocationData | null;
  setClickedLabel: (label: LocationData | null) => void;
}) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredLabel, setHoveredLabel] = useState<LocationData | null>(null);
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  // Filter out invalid locations (missing coordinates)
  const validLocations = useMemo(
    () =>
      locations.filter(
        (loc) => loc.latitude !== null && loc.longitude !== null && loc.name,
      ),
    [locations],
  );

  const normalizeSize = useMemo(() => {
    if (validLocations.length === 0) return () => 0.5;

    const values = validLocations.map((loc) => loc.significantCol);
    console.log("Significant column values:", values);
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Handle edge case where all values are the same
    if (min === max) return () => 1.5; // Return middle value

    // Normalize to 0.1-2 range (min visible, max at 2)
    const MIN_SIZE = 0.5;
    const MAX_SIZE = 2;
    return (value: number) =>
      MIN_SIZE + ((value - min) / (max - min)) * (MAX_SIZE - MIN_SIZE);
  }, [validLocations]);

  // Debounced resize handler
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({
        width: clientWidth,
        height: clientHeight,
      });
    }
  }, []);

  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = setTimeout(updateDimensions, 150);
  }, [updateDimensions]);

  // Handle label click
  const handleLabelClick = useCallback((label: LocationData) => {
    setClickedLabel(label);
  }, []);

  // Handle label hover
  const handleLabelHover = useCallback((label: LocationData | null) => {
    setHoveredLabel(label);

    // Change cursor style
    if (containerRef.current) {
      containerRef.current.style.cursor = label ? "pointer" : "default";
    }
  }, []);

  // Measure container dimensions on mount
  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [updateDimensions, handleResize]);

  // Auto-rotate globe
  useEffect(() => {
    if (globeEl.current?.controls) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.15;
    }
    if (globeEl.current) {
      globeEl.current.pointOfView(
        {
          lat: clickedLabel.latitude,
          lng: clickedLabel.longitude,
          altitude: 1.5,
        },
        1000,
      );
    }
  }, []);

  // Auto-focus on data if available
  useEffect(() => {
    // Focus on the clicked location
    if (globeEl.current) {
      globeEl.current.pointOfView(
        {
          lat: clickedLabel.latitude,
          lng: clickedLabel.longitude,
          altitude: 1.5,
        },
        1000,
      );
    }
  }, [clickedLabel]);

  if (validLocations.length === 0) {
    return (
      <div className="w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
        <p className="text-gray-400">No valid locations to display</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-black rounded-lg overflow-hidden"
    >
      {/* Optional: Show tooltip on hover */}
      {hoveredLabel && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-3 rounded-lg border border-orange-500">
          <h3 className="font-bold">{hoveredLabel.name}</h3>
          <p className="text-sm text-gray-300">
            {hoveredLabel.latitude.toFixed(2)},{" "}
            {hoveredLabel.longitude.toFixed(2)}
          </p>
        </div>
      )}

      {dimensions.width > 0 && dimensions.height > 0 && (
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          labelsData={validLocations}
          labelLat={(d: object) => (d as LocationData).latitude}
          labelLng={(d: object) => (d as LocationData).longitude}
          labelText={(d: object) => (d as LocationData).name}
          labelSize={(d: object) =>
            normalizeSize((d as LocationData).significantCol)
          }
          labelDotRadius={(d: object) =>
            normalizeSize((d as LocationData).significantCol)
          }
          labelColor={() => "rgba(255, 165, 0, 0.75)"}
          labelResolution={2}
          onLabelClick={(label: object) =>
            handleLabelClick(label as LocationData)
          }
          onLabelHover={(label: object | null) =>
            handleLabelHover(label as LocationData | null)
          }
          showAtmosphere={true}
          atmosphereColor="#aaaaaa"
          atmosphereAltitude={0.15}
          rendererConfig={{
            antialias: true,
            alpha: true,
            logarithmicDepthBuffer: true,
          }}
        />
      )}
    </div>
  );
}
