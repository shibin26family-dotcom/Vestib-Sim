"use client";

import { Html } from "@react-three/drei";
import { getCanalPointOriented, getCommonCrusCurve } from "@/lib/canalGeometry";
import { STRUCTURE_INFO } from "@/lib/vestibularData";
import type { StructureId } from "@/lib/types";

interface LabelDef {
  id: StructureId;
  position: [number, number, number];
}

const v = (x: number, y: number, z: number): [number, number, number] => [x, y, z];

/** Canal label anchor: the loop's outermost point, nudged further out so the
 * label floats beside the anatomy rather than sitting directly on top of it. */
const p = (id: "anterior" | "posterior" | "horizontal", t: number, outset = 1.3) => {
  const pt = getCanalPointOriented(id, t).multiplyScalar(outset);
  return v(pt.x, pt.y, pt.z);
};

const LABELS: LabelDef[] = [
  { id: "anterior-canal", position: p("anterior", 0.52) },
  { id: "posterior-canal", position: p("posterior", 0.5, 1.35) },
  { id: "horizontal-canal", position: p("horizontal", 0.75, 1.4) },
  { id: "vestibule", position: v(-0.15, -0.95, 0.15) },
  { id: "cochlea", position: v(1.5, -0.75, 1.1) },
  { id: "vestibular-nerve", position: v(-1.15, 0.35, -0.15) },
];

const commonCrusMid = getCommonCrusCurve().getPoint(0.5);

export default function AnatomyLabels() {
  return (
    <>
      {LABELS.map((label) => {
        const info = STRUCTURE_INFO[label.id];
        return (
          <Html
            key={label.id}
            position={label.position}
            center
            occlude={false}
            distanceFactor={6}
            style={{ pointerEvents: "none" }}
          >
            <div
              className="rounded-md border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap shadow-sm backdrop-blur-sm"
              style={{
                borderColor: `${info.color}66`,
                color: info.color,
                background: "rgba(9, 12, 20, 0.72)",
              }}
            >
              {info.shortName}
            </div>
          </Html>
        );
      })}

      <Html
        position={[commonCrusMid.x - 0.25, commonCrusMid.y + 0.65, commonCrusMid.z - 0.2]}
        center
        occlude={false}
        distanceFactor={6}
        style={{ pointerEvents: "none" }}
      >
        <div className="rounded-md border border-slate-400/30 bg-[rgba(9,12,20,0.72)] px-1.5 py-0.5 text-[9px] font-medium whitespace-nowrap text-slate-300 shadow-sm backdrop-blur-sm">
          Common Crus
        </div>
      </Html>
    </>
  );
}
