"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { getCommonCrusCurve } from "@/lib/canalGeometry";

/**
 * The anterior and posterior canals' non-ampullated limbs merge into one
 * shared duct (the common crus) before entering the vestibule. Rendered as a
 * short connecting tube so the labyrinth reads as one interconnected system
 * rather than three independent rings.
 */
export default function CommonCrus() {
  const geometry = useMemo(() => {
    const curve = getCommonCrusCurve();
    return new THREE.TubeGeometry(curve, 16, 0.07, 8, false);
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial
        color="#b4b9c6"
        emissive="#b4b9c6"
        emissiveIntensity={0.15}
        transparent
        opacity={0.4}
        roughness={0.3}
        transmission={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
