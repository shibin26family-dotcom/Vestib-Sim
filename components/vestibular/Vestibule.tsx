"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { VESTIBULE_RADII } from "@/lib/canalGeometry";
import { VESTIBULE_COLOR } from "@/lib/vestibularData";

interface VestibuleProps {
  selected: boolean;
  onSelect: () => void;
}

export default function Vestibule({ selected, onSelect }: VestibuleProps) {
  const [hovered, setHovered] = useState(false);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.5, 28, 20);
    const pos = geo.attributes.position;
    const [rx, ry, rz] = VESTIBULE_RADII;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      // Gentle irregular bulge so the vestibule reads as an organic chamber
      // rather than a perfect ellipsoid.
      const wobble = 1 + 0.05 * Math.sin(x * 6 + y * 3) + 0.04 * Math.cos(z * 5 - y * 2);
      pos.setXYZ(i, (x / 0.5) * rx * wobble, (y / 0.5) * ry * wobble, (z / 0.5) * rz * wobble);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const target = selected ? 1.4 : hovered ? 0.8 : 0.22;
    matRef.current.emissiveIntensity = THREE.MathUtils.damp(
      matRef.current.emissiveIntensity,
      target,
      6,
      delta,
    );
  });

  return (
    <mesh
      geometry={geometry}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <meshPhysicalMaterial
        ref={matRef}
        color={VESTIBULE_COLOR}
        emissive={VESTIBULE_COLOR}
        emissiveIntensity={0.22}
        transparent
        opacity={0.42}
        roughness={0.25}
        transmission={0.35}
        thickness={0.35}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
