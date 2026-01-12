"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";
import type { LocationData } from "@/types";

interface MarkerProps {
  position: [number, number, number];
  location: LocationData;
  onHover: (location: LocationData | null) => void;
}

function Marker({ position, location, onHover }: MarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.003) * 0.2);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => onHover(location)}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="#ff6b6b" />
      </mesh>
      <pointLight color="#ff6b6b" intensity={0.5} distance={0.3} />
    </group>
  );
}

interface EarthProps {
  locations: LocationData[];
  onLocationHover: (location: LocationData | null) => void;
}

function Earth({ locations, onLocationHover }: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  const markers = useMemo(() => {
    return locations.map((location, index) => {
      const lat = (location.lat * Math.PI) / 180;
      const lng = (location.lng * Math.PI) / 180;
      const radius = 1;

      const x = radius * Math.cos(lat) * Math.cos(lng);
      const y = radius * Math.sin(lat);
      const z = radius * Math.cos(lat) * Math.sin(lng);

      return (
        <Marker
          key={index}
          position={[x, y, z]}
          location={location}
          onHover={onLocationHover}
        />
      );
    });
  }, [locations, onLocationHover]);

  return (
    <group>
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} metalness={0.2} />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[1.01, 64, 64]}>
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {markers}
    </group>
  );
}

interface InteractiveEarthProps {
  locations: LocationData[];
  onLocationHover: (location: LocationData | null) => void;
}

export default function InteractiveEarth({
  locations,
  onLocationHover,
}: InteractiveEarthProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Earth locations={locations} onLocationHover={onLocationHover} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={1.5}
          maxDistance={5}
        />
      </Canvas>
    </div>
  );
}
