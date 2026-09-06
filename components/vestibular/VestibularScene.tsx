"use client";

import { Suspense, useCallback, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { RefreshCcw } from "lucide-react";
import InnerEarModel from "./InnerEarModel";
import { useVestibular } from "@/lib/store";
import type { Ear } from "@/lib/types";

export default function VestibularScene() {
  const {
    showBothEars,
    canalExcitation,
    selected,
    select,
    showLabels,
    showEndolymph,
    head,
    cameraResetSignal,
    resetCamera,
    bppv,
    activeTab,
    ampullaModalOpen,
  } = useVestibular();

  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);

  /**
   * Fit the camera to whatever labyrinth geometry is currently rendered,
   * using its actual world-space bounding box - so the whole model (all
   * three canals, vestibule, and cochlea) is always framed with comfortable
   * padding, whether showing one ear or both.
   */
  const fitCameraToModel = useCallback(() => {
    const group = modelGroupRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!group || !camera || !controls) return;

    group.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(group);
    if (box.isEmpty()) return;

    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z);

    const fovRad = THREE.MathUtils.degToRad(camera.fov);
    const fillFactor = 0.92; // model occupies most of the viewport's limiting dimension
    let distance = maxDim / 2 / Math.tan(fovRad / 2) / fillFactor;
    distance = THREE.MathUtils.clamp(distance, 2.4, 14);

    const direction = new THREE.Vector3(0.42, 0.22, 1).normalize();
    camera.position.copy(center.clone().addScaledVector(direction, distance));
    camera.near = Math.max(0.05, distance / 50);
    camera.far = distance * 12;
    camera.updateProjectionMatrix();

    controls.target.copy(center);
    controls.minDistance = Math.max(1.2, distance * 0.3);
    controls.maxDistance = distance * 2.4;
    controls.update();
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => fitCameraToModel());
    return () => cancelAnimationFrame(id);
  }, [showBothEars, fitCameraToModel]);

  useEffect(() => {
    if (cameraResetSignal === 0) return;
    fitCameraToModel();
  }, [cameraResetSignal, fitCameraToModel]);

  const onSelect = (structureId: NonNullable<typeof selected>["structureId"], ear: Ear) => {
    select({ structureId, ear });
  };

  const otoconiaActive = activeTab === "bppv";
  const rightOtoconia = otoconiaActive
    ? { canal: bppv.canal, condition: bppv.condition, stimulus: bppv.headTilt }
    : null;

  const earSpacing = showBothEars ? 1.55 : 0;
  const labelsVisible = showLabels && !ampullaModalOpen;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_center,_#0b1220_0%,_#04060b_75%)]">
      <Canvas
        camera={{ position: [1.6, 1.2, 3.8], fov: 42 }}
        onCreated={({ camera }) => {
          cameraRef.current = camera as THREE.PerspectiveCamera;
          fitCameraToModel();
        }}
        onPointerMissed={() => select(null)}
        dpr={[1, 1.8]}
      >
        <color attach="background" args={["#04060b"]} />
        <fog attach="fog" args={["#04060b", 6, 13]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1.35} castShadow={false} />
        <directionalLight position={[-4, 1.5, -3]} intensity={0.4} color="#7fb8c9" />
        <directionalLight position={[1, -3, 2]} intensity={0.22} color="#e7ddc6" />
        <hemisphereLight intensity={0.35} color="#c7d2fe" groundColor="#020617" />

        <Suspense fallback={null}>
          <group
            rotation={[
              THREE.MathUtils.degToRad(head.pitch),
              THREE.MathUtils.degToRad(head.yaw),
              THREE.MathUtils.degToRad(head.roll),
            ]}
          >
            <group ref={modelGroupRef}>
              <InnerEarModel
                ear="right"
                position={[showBothEars ? earSpacing : 0, 0, 0]}
                mirror={false}
                canalExcitation={canalExcitation}
                selectedStructure={selected?.structureId ?? null}
                selectedEar={selected?.ear ?? null}
                onSelect={onSelect}
                showLabels={labelsVisible}
                showEndolymph={showEndolymph}
                showEarTag={showBothEars}
                otoconia={rightOtoconia}
              />
              {showBothEars && (
                <InnerEarModel
                  ear="left"
                  position={[-earSpacing, 0, 0]}
                  mirror
                  canalExcitation={canalExcitation}
                  selectedStructure={selected?.structureId ?? null}
                  selectedEar={selected?.ear ?? null}
                  onSelect={onSelect}
                  showLabels={labelsVisible}
                  showEndolymph={showEndolymph}
                  showEarTag={showBothEars}
                  otoconia={null}
                />
              )}
            </group>
          </group>
        </Suspense>

        <OrbitControls ref={controlsRef} makeDefault enablePan={false} rotateSpeed={0.6} zoomSpeed={0.8} />
      </Canvas>

      <button
        onClick={resetCamera}
        aria-label="Reset camera view"
        className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg border border-white/15 bg-slate-950/70 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 backdrop-blur-sm transition-colors hover:bg-slate-900 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
      >
        <RefreshCcw size={13} aria-hidden />
        Reset View
      </button>

      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-slate-950/60 px-2.5 py-1 text-[10px] text-slate-400 backdrop-blur-sm">
        Drag to rotate · Scroll to zoom · Click a structure
      </div>
    </div>
  );
}
