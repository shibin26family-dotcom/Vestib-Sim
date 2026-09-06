"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { buildCanalCurve, CANAL_RADIUS } from "@/lib/canalGeometry";
import type { CanalId, Ear } from "@/lib/types";

interface EndolymphParticlesProps {
  canalId: CanalId;
  ear: Ear;
  flow: number; // -100..100, relative endolymph deflection driving particle motion
}

const COUNT = 20;

export default function EndolymphParticles({ canalId, ear, flow }: EndolymphParticlesProps) {
  const curve = useMemo(
    () => buildCanalCurve(canalId, { radius: CANAL_RADIUS[canalId] }),
    [canalId],
  );
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const phaseOffset = ear === "left" ? 0 : 0.5 / COUNT;
  const tAccum = useRef(0);
  const flowRef = useRef(flow);
  useEffect(() => {
    flowRef.current = flow;
  }, [flow]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    // Idle baseline drift keeps the fluid feeling alive even at rest,
    // while excitation/inhibition speeds up or reverses the flow.
    const speed = 0.02 + (flowRef.current / 100) * 0.22;
    tAccum.current += speed * delta;
    for (let i = 0; i < COUNT; i++) {
      let t = (i / COUNT + phaseOffset + tAccum.current) % 1;
      if (t < 0) t += 1;
      const point = curve.getPoint(t);
      dummy.position.copy(point);
      const scale = 1 + Math.min(0.6, Math.abs(flowRef.current) / 140);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[0.02, 7, 7]} />
      <meshStandardMaterial
        color="#7dd3fc"
        emissive="#7dd3fc"
        emissiveIntensity={1.8}
        transparent
        opacity={0.75}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
