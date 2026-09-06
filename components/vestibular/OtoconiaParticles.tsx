"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { buildCanalCurve, CANAL_RADIUS } from "@/lib/canalGeometry";
import type { BppvCondition, CanalId } from "@/lib/types";

interface OtoconiaParticlesProps {
  canalId: CanalId;
  condition: BppvCondition;
  stimulus: number; // -100..100, simulated rotational stimulus
}

const COUNT = 16;

/** Deterministic pseudo-random value in [-0.5, 0.5], stable across renders for a given seed. */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) - 0.5;
}

export default function OtoconiaParticles({
  canalId,
  condition,
  stimulus,
}: OtoconiaParticlesProps) {
  const curve = useMemo(
    () => buildCanalCurve(canalId, { radius: CANAL_RADIUS[canalId] }),
    [canalId],
  );
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const jitter = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        x: pseudoRandom(i * 3 + 1) * 0.035,
        y: pseudoRandom(i * 3 + 2) * 0.035,
        z: pseudoRandom(i * 3 + 3) * 0.035,
      })),
    [],
  );
  const clusterT = useRef(0.14);
  const stimulusRef = useRef(stimulus);
  useEffect(() => {
    stimulusRef.current = stimulus;
  }, [stimulus]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (condition === "canalithiasis") {
      clusterT.current += (stimulusRef.current / 100) * 0.12 * delta;
      clusterT.current = THREE.MathUtils.clamp(clusterT.current, 0.02, 0.92);
      for (let i = 0; i < COUNT; i++) {
        const t = THREE.MathUtils.clamp(
          clusterT.current + (i - COUNT / 2) * 0.006,
          0.01,
          0.97,
        );
        const p = curve.getPoint(t);
        dummy.position.set(p.x + jitter[i].x, p.y + jitter[i].y, p.z + jitter[i].z);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
    } else {
      const base = curve.getPoint(0.045);
      const deflect = (stimulusRef.current / 100) * 0.16;
      for (let i = 0; i < COUNT; i++) {
        const col = i % 4;
        const row = Math.floor(i / 4);
        dummy.position.set(
          base.x + col * 0.02 - 0.03 + jitter[i].x * 0.4,
          base.y + deflect + jitter[i].y * 0.4,
          base.z + row * 0.02 - 0.02 + jitter[i].z * 0.4,
        );
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[0.024, 7, 7]} />
      <meshStandardMaterial
        color="#fef08a"
        emissive="#fde047"
        emissiveIntensity={2.2}
        transparent
        opacity={0.9}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
