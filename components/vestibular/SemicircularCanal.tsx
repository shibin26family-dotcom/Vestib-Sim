"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  buildCanalTubeGeometry,
  CANAL_ORIENTATION,
  CANAL_RADIUS,
  quaternionToArray,
  getAmpullaLocalPosition,
} from "@/lib/canalGeometry";
import { CANAL_COLORS } from "@/lib/vestibularData";
import type { CanalId, Ear } from "@/lib/types";
import EndolymphParticles from "./EndolymphParticles";
import OtoconiaParticles from "./OtoconiaParticles";

interface SemicircularCanalProps {
  canalId: CanalId;
  ear: Ear;
  excitation: number; // -100..100
  selected: boolean;
  showEndolymph: boolean;
  onSelect: (canalId: CanalId) => void;
  onSelectAmpulla: (canalId: CanalId) => void;
  otoconia?: {
    active: boolean;
    condition: "canalithiasis" | "cupulolithiasis";
    stimulus: number; // -100..100 drives particle motion
  };
}

export default function SemicircularCanal({
  canalId,
  ear,
  excitation,
  selected,
  showEndolymph,
  onSelect,
  onSelectAmpulla,
  otoconia,
}: SemicircularCanalProps) {
  const tubeGeometry = useMemo(
    () => buildCanalTubeGeometry(canalId, { radius: CANAL_RADIUS[canalId] }),
    [canalId],
  );
  const ampullaPos = useMemo(() => getAmpullaLocalPosition(canalId), [canalId]);
  const quaternion = quaternionToArray(CANAL_ORIENTATION[canalId]);
  const color = CANAL_COLORS[canalId];

  const [hovered, setHovered] = useState(false);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const ampullaMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const intensityTarget = useMemo(() => {
    const excitationBoost = Math.min(1, Math.abs(excitation) / 100) * 1.4;
    if (selected) return 1.8 + excitationBoost;
    if (hovered) return 1.0 + excitationBoost;
    return 0.35 + excitationBoost;
  }, [selected, hovered, excitation]);

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = THREE.MathUtils.damp(
        materialRef.current.emissiveIntensity,
        intensityTarget,
        6,
        delta,
      );
      const opacityTarget = selected || hovered ? 0.58 : 0.32;
      materialRef.current.opacity = THREE.MathUtils.damp(
        materialRef.current.opacity,
        opacityTarget,
        6,
        delta,
      );
    }
    if (ampullaMatRef.current) {
      ampullaMatRef.current.emissiveIntensity = THREE.MathUtils.damp(
        ampullaMatRef.current.emissiveIntensity,
        intensityTarget * 0.9,
        6,
        delta,
      );
    }
  });

  return (
    <group quaternion={quaternion}>
      <mesh
        geometry={tubeGeometry}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(canalId);
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
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          transparent
          opacity={0.4}
          roughness={0.25}
          transmission={0.35}
          thickness={0.3}
          clearcoat={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh
        position={ampullaPos}
        onClick={(e) => {
          e.stopPropagation();
          onSelectAmpulla(canalId);
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
        <sphereGeometry args={[0.15, 18, 18]} />
        <meshStandardMaterial
          ref={ampullaMatRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
          roughness={0.35}
        />
      </mesh>

      {showEndolymph && (
        <EndolymphParticles canalId={canalId} ear={ear} flow={excitation} />
      )}

      {otoconia?.active && (
        <OtoconiaParticles
          canalId={canalId}
          condition={otoconia.condition}
          stimulus={otoconia.stimulus}
        />
      )}
    </group>
  );
}
