"use client";

import { Pause, Play, RefreshCw } from "lucide-react";
import Slider from "@/components/ui/Slider";
import { useVestibular } from "@/lib/store";
import type { MotionAxis } from "@/lib/types";
import { CANAL_COLORS } from "@/lib/vestibularData";

const AXIS_META: Record<
  MotionAxis,
  { label: string; description: string; highlight: string }
> = {
  yaw: {
    label: "Yaw",
    description: "Turning the head left and right.",
    highlight: "Strongly stimulates the horizontal (lateral) canals.",
  },
  pitch: {
    label: "Pitch",
    description: "Looking up and down (nodding).",
    highlight: "Stimulates the anterior and posterior canals together.",
  },
  roll: {
    label: "Roll",
    description: "Tilting the ear toward the shoulder.",
    highlight: "Stimulates a diagonal combination of anterior and posterior canals.",
  },
};

const ANGLE_SCALE = 0.6;

export default function HeadMovementSimulator() {
  const { headMovement, setHeadMovement, resetHeadMovement, setHead, head } = useVestibular();

  const setAxis = (axis: MotionAxis) => {
    setHeadMovement({ axis, playing: false });
    setHead({ yaw: 0, pitch: 0, roll: 0 });
  };

  const handleDirection = (v: number) => {
    setHeadMovement({ direction: v });
    if (!headMovement.playing) {
      setHead({
        yaw: headMovement.axis === "yaw" ? v * ANGLE_SCALE : 0,
        pitch: headMovement.axis === "pitch" ? v * ANGLE_SCALE : 0,
        roll: headMovement.axis === "roll" ? v * ANGLE_SCALE : 0,
      });
    }
  };

  const currentAngle = head[headMovement.axis];
  const meta = AXIS_META[headMovement.axis];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-300 uppercase">
          Rotation Axis
        </h3>
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(AXIS_META) as MotionAxis[]).map((axis) => (
            <button
              key={axis}
              onClick={() => setAxis(axis)}
              aria-pressed={headMovement.axis === axis}
              className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
                headMovement.axis === axis
                  ? "border-sky-400/50 bg-sky-500/15 text-sky-300"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
              }`}
            >
              {AXIS_META[axis].label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-slate-400">{meta.description}</p>
      </div>

      <div className="flex items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] py-3">
        <span
          className="text-2xl transition-transform"
          style={{ transform: `rotate(${Math.max(-45, Math.min(45, currentAngle))}deg)` }}
          aria-hidden
        >
          {currentAngle >= 0 ? "↻" : "↺"}
        </span>
        <span className="font-mono text-sm text-slate-200 tabular-nums">
          {currentAngle.toFixed(0)}°
        </span>
      </div>

      <Slider
        label="Direction / Angle"
        value={headMovement.direction}
        min={-100}
        max={100}
        onChange={handleDirection}
        formatValue={(v) => (v > 0 ? `+${v} (right/up)` : `${v} (left/down)`)}
      />
      <Slider
        label="Speed"
        value={headMovement.speed}
        min={5}
        max={100}
        onChange={(v) => setHeadMovement({ speed: v })}
        formatValue={(v) => `${v}%`}
      />

      <div className="flex gap-2">
        <button
          onClick={() => setHeadMovement({ playing: !headMovement.playing })}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-400 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:outline-none"
        >
          {headMovement.playing ? <Pause size={14} /> : <Play size={14} />}
          {headMovement.playing ? "Pause" : "Play"}
        </button>
        <button
          onClick={resetHeadMovement}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
        >
          <RefreshCw size={14} />
          Reset
        </button>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <p className="text-[11px] leading-relaxed text-slate-300">
          <span
            className="mr-1 inline-block h-2 w-2 rounded-full align-middle"
            style={{
              backgroundColor:
                headMovement.axis === "yaw"
                  ? CANAL_COLORS.horizontal
                  : CANAL_COLORS.anterior,
            }}
          />
          {meta.highlight}
        </p>
      </div>
    </div>
  );
}
