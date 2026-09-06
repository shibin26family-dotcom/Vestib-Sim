"use client";

import * as THREE from "three";
import { useMemo } from "react";

interface ProceduralHeadProps {
  scale?: number;
}

export default function ProceduralHead({ scale = 1 }: ProceduralHeadProps) {
  const geometry = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(0.6 * scale, 4);
    const positions = geom.attributes.position.array as Float32Array;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      positions[i] = x;
      positions[i + 1] = y + 0.15 * scale;
      positions[i + 2] = z * 0.95;
    }

    geom.attributes.position.needsUpdate = true;
    geom.computeVertexNormals();

    const positions2 = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < positions2.length; i += 3) {
      const x = positions2[i];
      const y = positions2[i + 1];
      const z = positions2[i + 2];

      const dist = Math.sqrt(x * x + z * z);
      if (dist < 0.3 && y > -0.1) {
        positions2[i] *= 1.15;
        positions2[i + 2] *= 1.15;
      }
    }
    geom.attributes.position.needsUpdate = true;
    geom.computeVertexNormals();

    return geom;
  }, [scale]);

  return (
    <mesh geometry={geometry} position={[0, -0.05, 0]}>
      <meshStandardMaterial
        color="#4a5568"
        roughness={0.7}
        metalness={0.1}
        emissive="#1a1f2e"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}
