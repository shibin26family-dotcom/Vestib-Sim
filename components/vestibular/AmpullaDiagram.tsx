"use client";

import { useEffect, useState } from "react";
import { CANAL_COLORS } from "@/lib/vestibularData";
import type { CanalId } from "@/lib/types";

interface AmpullaDiagramProps {
  canalId: CanalId;
  deflection: number; // -100..100
  firingRate: number; // spikes/sec, drives nerve pulse speed
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

const HAIR_CELL_X = [130, 165, 200, 235, 270, 305, 340];
const NERVE_PATH = "M240,222 L240,300";
const NERVE_PATHS = HAIR_CELL_X.map(
  (x) => `M${x},214 C ${x},240 240,245 240,260 C 240,278 240,290 240,300`,
);

export default function AmpullaDiagram({ canalId, deflection, firingRate }: AmpullaDiagramProps) {
  const reducedMotion = usePrefersReducedMotion();
  const color = CANAL_COLORS[canalId];
  const clamped = Math.max(-100, Math.min(100, deflection));
  const bendDeg = clamped * 0.22; // rotation applied to cupula + hair bundles
  const flowActive = Math.abs(clamped) > 4;
  const flowRight = clamped > 0;
  const pulseDuration = Math.max(0.22, Math.min(2, 60 / Math.max(20, firingRate)));

  return (
    <svg
      viewBox="0 0 440 320"
      className="h-full w-full"
      role="img"
      aria-label="Cross-section diagram of the ampulla showing the cupula, crista ampullaris, hair cells, and vestibular nerve fibers"
    >
      <defs>
        <linearGradient id="lumenGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      {/* Duct + ampulla outer wall */}
      <path
        d="M0,150 C 40,108 130,88 220,88 C 300,88 365,112 392,150 C 365,196 300,222 220,222 C 130,222 40,200 0,168 Z"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="3"
      />
      {/* Endolymph-filled lumen */}
      <path
        d="M8,150 C 46,114 132,96 220,96 C 296,96 356,118 382,150 C 356,192 296,214 220,214 C 132,214 46,196 8,168 Z"
        fill="url(#lumenGradient)"
      />

      {/* Endolymph flow indicator */}
      {flowActive && (
        <g style={{ opacity: 0.9 }}>
          {[0, 1, 2].map((i) => (
            <circle key={i} r="3.2" fill="#7dd3fc">
              <animateMotion
                dur={`${reducedMotion ? 3.2 : 1.6}s`}
                begin={`${i * 0.5}s`}
                repeatCount="indefinite"
                keyPoints={flowRight ? "0;1" : "1;0"}
                keyTimes="0;1"
                path="M40,150 L340,150"
              />
            </circle>
          ))}
          <text
            x="190"
            y="128"
            textAnchor="middle"
            fontSize="11"
            fontWeight={600}
            fill="#7dd3fc"
            style={{ letterSpacing: 0.3 }}
          >
            {flowRight ? "RELATIVE ENDOLYMPH FLOW →" : "← RELATIVE ENDOLYMPH FLOW"}
          </text>
        </g>
      )}
      {!flowActive && (
        <text x="190" y="128" textAnchor="middle" fontSize="10.5" fill="#64748b">
          minimal net endolymph flow at rest
        </text>
      )}

      {/* Nerve fibers converging to the vestibular nerve trunk */}
      <g stroke="#c7cdd8" strokeWidth="1.6" fill="none" opacity={0.75}>
        {NERVE_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <path d="M240,255 L240,304" stroke="#e7ddc6" strokeWidth="6" strokeLinecap="round" />
      <text x="240" y="316" textAnchor="middle" fontSize="10.5" fill="#cbd5e1" fontWeight={600}>
        VESTIBULAR NERVE
      </text>

      {/* Nerve firing pulses travelling down the trunk */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} r="3.4" fill="#facc15">
          <animateMotion
            dur={`${pulseDuration}s`}
            begin={`${i * (pulseDuration / 4)}s`}
            repeatCount="indefinite"
            path={NERVE_PATH}
          />
        </circle>
      ))}

      {/* Crista ampullaris */}
      <path
        d="M120,214 C 150,182 330,182 360,214 C 330,236 150,236 120,214 Z"
        fill="#c99a7c"
        opacity={0.9}
      />
      <text x="240" y="246" textAnchor="middle" fontSize="10" fill="#e2c9b3" fontWeight={600}>
        CRISTA AMPULLARIS
      </text>

      {/* Hair cells: body + stereocilia + kinocilium, bending together with the cupula */}
      {HAIR_CELL_X.map((x, i) => (
        <g key={i} transform={`translate(${x},214)`}>
          <ellipse cx={0} cy={-4} rx={9} ry={11} fill="#f5f1e6" stroke="#cbb896" strokeWidth={1} />
          <g
            style={{
              transform: `rotate(${bendDeg}deg)`,
              transformOrigin: "0px -12px",
              transition: reducedMotion ? "none" : "transform 0.35s ease-out",
            }}
          >
            {[0, 1, 2, 3].map((h) => (
              <line
                key={h}
                x1={-6 + h * 3.2}
                y1={-12}
                x2={-6 + h * 3.2}
                y2={-12 - (10 + h * 5)}
                stroke="#e6e1d4"
                strokeWidth={1.4}
                strokeLinecap="round"
              />
            ))}
            <line
              x1={7.6}
              y1={-12}
              x2={7.6}
              y2={-46}
              stroke="#fbbf24"
              strokeWidth={2.2}
              strokeLinecap="round"
            />
          </g>
        </g>
      ))}

      {/* Cupula: flexible dome bending with the hair bundles */}
      <g
        style={{
          transform: `rotate(${bendDeg}deg)`,
          transformOrigin: "240px 202px",
          transition: reducedMotion ? "none" : "transform 0.35s ease-out",
        }}
      >
        <path
          d="M150,204 C 150,150 175,100 240,96 C 305,100 330,150 330,204 C 300,222 180,222 150,204 Z"
          fill={color}
          fillOpacity={0.32}
          stroke={color}
          strokeOpacity={0.7}
          strokeWidth={1.6}
        />
      </g>
      <text x="240" y="78" textAnchor="middle" fontSize="10.5" fill={color} fontWeight={700}>
        CUPULA
      </text>
    </svg>
  );
}
