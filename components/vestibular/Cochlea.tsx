"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { buildCochleaGeometry } from "@/lib/canalGeometry";
import { COCHLEA_COLOR } from "@/lib/vestibularData";

interface CochleaProps {
  selected: boolean;
  onSelect: () => void;
}

export default function Cochlea({ selected, onSelect }: CochleaProps) {
  const [hovered, setHovered] = useState(false);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const geometry = useMemo(() => buildCochleaGeometry(), []);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const target = selected ? 1.3 : hovered ? 0.75 : 0.18;
    matRef.current.emissiveIntensity = THREE.MathUtils.damp(
      matRef.current.emissiveIntensity,
      target,
      6,
      delta,
    );
  });

  return (
    <group position={[0.38, -0.55, 0.85]} rotation={[1.35, 0.35, -0.25]}>
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
          color={COCHLEA_COLOR}
          emissive={COCHLEA_COLOR}
          emissiveIntensity={0.18}
          transparent
          opacity={0.68}
          roughness={0.3}
          transmission={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
