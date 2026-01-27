"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { LocationData } from "@/types/location";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function GlobeVisualization({
  locations,
}: {
  locations: LocationData[];
}) {
  console.log("Locations in GlobeVisualization:", locations);
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
    console.log("Clicked location:", label);

    // Example: Focus on the clicked location
    if (globeEl.current) {
      globeEl.current.pointOfView(
        {
          lat: label.latitude,
          lng: label.longitude,
          altitude: 1.5,
        },
        1000,
      );
    }

    // You can also:
    // - Open a modal with location details
    // - Navigate to a detail page
    // - Show a tooltip
    // - Trigger any custom action
  }, []);

  // Handle label hover
  const handleLabelHover = useCallback((label: LocationData | null) => {
    setHoveredLabel(label);
    console.log("Hovered location:", label);

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
  }, []);

  // Auto-focus on data if available
  useEffect(() => {
    if (globeEl.current && validLocations.length > 0) {
      // Center on first valid location
      const firstLoc = validLocations[0];
      globeEl.current.pointOfView(
        { lat: firstLoc.latitude, lng: firstLoc.longitude, altitude: 2 },
        1500,
      );
    }
  }, [validLocations]);

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
          labelSize={1.5} // TODO: Adjust size as needed
          labelDotRadius={0.5} // TODO: Adjust size as needed
          labelColor={() => "rgba(255, 165, 0, 0.75)"}
          labelResolution={2}
          // Add click and hover handlers
          onLabelClick={(label: object) => handleLabelClick(label as LocationData)}
          onLabelHover={(label: object | null) => handleLabelHover(label as LocationData | null)}
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
