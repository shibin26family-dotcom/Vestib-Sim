"use client";

import { Html } from "@react-three/drei";
import SemicircularCanal from "./SemicircularCanal";
import Vestibule from "./Vestibule";
import Cochlea from "./Cochlea";
import CommonCrus from "./CommonCrus";
import AnatomyLabels from "./AnatomyLabels";
import type { BppvCondition, CanalExcitation, CanalId, Ear, StructureId } from "@/lib/types";
import { STRUCTURE_INFO } from "@/lib/vestibularData";

interface InnerEarModelProps {
  ear: Ear;
  position: [number, number, number];
  mirror: boolean;
  canalExcitation: CanalExcitation;
  selectedStructure: StructureId | null;
  selectedEar: Ear | null;
  onSelect: (structureId: StructureId, ear: Ear) => void;
  showLabels: boolean;
  showEndolymph: boolean;
  showEarTag: boolean;
  otoconia?: {
    canal: CanalId;
    condition: BppvCondition;
    stimulus: number;
  } | null;
}

const CANAL_IDS: CanalId[] = ["anterior", "posterior", "horizontal"];

function excitationFor(canalId: CanalId, ear: Ear, exc: CanalExcitation): number {
  const key = `${canalId}${ear === "left" ? "L" : "R"}` as keyof CanalExcitation;
  return exc[key];
}

export default function InnerEarModel({
  ear,
  position,
  mirror,
  canalExcitation,
  selectedStructure,
  selectedEar,
  onSelect,
  showLabels,
  showEndolymph,
  showEarTag,
  otoconia,
}: InnerEarModelProps) {
  const isSelectedEar = selectedEar === ear;

  return (
    <group position={position} scale={[mirror ? -1 : 1, 1, 1]}>
      <Vestibule
        selected={isSelectedEar && selectedStructure === "vestibule"}
        onSelect={() => onSelect("vestibule", ear)}
      />
      <Cochlea
        selected={isSelectedEar && selectedStructure === "cochlea"}
        onSelect={() => onSelect("cochlea", ear)}
      />

      {/* Vestibular nerve stub, exiting medially from the vestibule. */}
      <mesh
        position={[-0.7, -0.04, -0.03]}
        rotation={[0, 0, Math.PI / 2]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect("vestibular-nerve", ear);
        }}
      >
        <cylinderGeometry args={[0.032, 0.065, 0.55, 10]} />
        <meshStandardMaterial
          color={STRUCTURE_INFO["vestibular-nerve"].color}
          emissive={STRUCTURE_INFO["vestibular-nerve"].color}
          emissiveIntensity={isSelectedEar && selectedStructure === "vestibular-nerve" ? 1.2 : 0.12}
          transparent
          opacity={0.85}
        />
      </mesh>

      <CommonCrus />

      {CANAL_IDS.map((canalId) => (
        <SemicircularCanal
          key={canalId}
          canalId={canalId}
          ear={ear}
          excitation={excitationFor(canalId, ear, canalExcitation)}
          selected={
            isSelectedEar &&
            (selectedStructure === `${canalId}-canal` ||
              selectedStructure === (`ampulla-${canalId}` as StructureId))
          }
          showEndolymph={showEndolymph}
          onSelect={() => onSelect(`${canalId}-canal` as StructureId, ear)}
          onSelectAmpulla={() => onSelect(`ampulla-${canalId}` as StructureId, ear)}
          otoconia={
            otoconia && otoconia.canal === canalId
              ? { active: true, condition: otoconia.condition, stimulus: otoconia.stimulus }
              : undefined
          }
        />
      ))}

      {showLabels && <AnatomyLabels />}

      {showEarTag && (
        <Html position={[0, 1.65, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div
            className={`rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase shadow-lg ${
              mirror
                ? "bg-rose-500/90 text-white"
                : "bg-sky-500/90 text-white"
            }`}
          >
            {ear}
          </div>
        </Html>
      )}
    </group>
  );
}
