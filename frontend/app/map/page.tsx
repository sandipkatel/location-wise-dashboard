"use client";

/// Code here: https://www.npmjs.com/package/react-globe.gl?activeTab=code
import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

export default function InteractiveGlobe() {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [showAtmosphere, setShowAtmosphere] = useState(true);

  useEffect(() => {
    // Load country data
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => setCountries(data));

    // Auto-rotate
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-black relative">
      <div className="absolute top-6 left-6 z-10 bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-4">Interactive Earth</h1>
        
        <div className="space-y-3">
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="atmosphere"
              checked={showAtmosphere}
              onChange={(e) => setShowAtmosphere(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="atmosphere" className="text-white text-sm">
              Show Atmosphere
            </label>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          <p>🖱️ Drag to rotate</p>
          <p>🔍 Scroll to zoom</p>
          <p>🌍 Click countries for info</p>
        </div>
      </div>

      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        atmosphereColor={showAtmosphere ? "lightskyblue" : "rgba(0,0,0,0)"}
        atmosphereAltitude={showAtmosphere ? 0.25 : 0}
        
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonAltitude={0.001}
        hexPolygonColor={() => `rgba(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, 0.7)`}
        
        onHexPolygonClick={(d) => {
          if (d && d.properties) {
            alert(`${d.properties.ADMIN || 'Unknown'}\nPopulation: ${d.properties.POP_EST?.toLocaleString() || 'N/A'}`);
          }
        }}
        
        onHexPolygonHover={(d) => {
          if (globeEl.current) {
            globeEl.current.controls().autoRotate = !d;
          }
        }}
      />
    </div>
  );
}