"use client";

import { useEffect } from "react";
import { Pause, Play, RefreshCw } from "lucide-react";
import Slider from "@/components/ui/Slider";
import FiringRateGauge from "@/components/ui/FiringRateGauge";
import { useVestibular } from "@/lib/store";
import { CANAL_COLORS, STRUCTURE_INFO } from "@/lib/vestibularData";
import type { MotionAxis } from "@/lib/types";
import { excitationToFiringRate } from "@/lib/physiology";

const AXIS_INFO: Record<
  MotionAxis,
  { label: string; description: string; icon: string }
> = {
  yaw: {
    label: "Yaw (Rotation)",
    description: "Turn head left and right",
    icon: "↻",
  },
  pitch: {
    label: "Pitch (Nod)",
    description: "Look up and down",
    icon: "⟲",
  },
  roll: {
    label: "Roll (Tilt)",
    description: "Tilt ear toward shoulder",
    icon: "↪",
  },
};

export default function HeadMovementSimulator() {
  const {
    head,
    setHead,
    headMovement,
    setHeadMovement,
    resetHeadMovement,
    canalExcitation,
    selected,
    select,
    showBothEars,
    setShowBothEars,
    activeTab,
  } = useVestibular();

  useEffect(() => {
    if (activeTab === "head-movement") {
      setShowBothEars(true);
    }
  }, [activeTab, setShowBothEars]);

  const currentYaw = Math.round(head.yaw);
  const currentPitch = Math.round(head.pitch);
  const currentRoll = Math.round(head.roll);

  const setAxisValue = (axis: MotionAxis, value: number) => {
    setHead({
      yaw: axis === "yaw" ? value : head.yaw,
      pitch: axis === "pitch" ? value : head.pitch,
      roll: axis === "roll" ? value : head.roll,
    });
  };

  const quickRotate = (axis: MotionAxis, direction: "left" | "neutral" | "right") => {
    const angleMaps = {
      yaw: { left: -60, neutral: 0, right: 60 },
      pitch: { left: -60, neutral: 0, right: 60 },
      roll: { left: -45, neutral: 0, right: 45 },
    };
    const angle = angleMaps[axis][direction];
    setAxisValue(axis, angle);
  };

  const selectedStructure = selected ? STRUCTURE_INFO[selected.structureId] : null;

  const horizontalLeftExcitation = canalExcitation.horizontalL;
  const horizontalRightExcitation = canalExcitation.horizontalR;
  const anteriorExcitation = (canalExcitation.anteriorL + canalExcitation.anteriorR) / 2;
  const posteriorExcitation = (canalExcitation.posteriorL + canalExcitation.posteriorR) / 2;

  return (
    <div className="space-y-4">
      {/* Head Rotation Controls */}
      <div>
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-300 uppercase">
          Head Rotation Controls
        </h3>
        <div className="space-y-2">
          {(["yaw", "pitch", "roll"] as MotionAxis[]).map((axis) => {
            const info = AXIS_INFO[axis];
            const current =
              axis === "yaw" ? currentYaw : axis === "pitch" ? currentPitch : currentRoll;

            return (
              <div key={axis}>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">{info.label}</label>
                  <span className="font-mono text-xs text-slate-400">{current}°</span>
                </div>
                <Slider
                  label=""
                  value={current}
                  min={-90}
                  max={90}
                  onChange={(v) => setAxisValue(axis, v)}
                  accentColor={
                    axis === "yaw"
                      ? CANAL_COLORS.horizontal
                      : axis === "pitch"
                        ? CANAL_COLORS.anterior
                        : CANAL_COLORS.posterior
                  }
                />
                <div className="mt-1 grid grid-cols-3 gap-1">
                  <button
                    onClick={() => quickRotate(axis, "left")}
                    className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-slate-200 focus-visible:ring-1 focus-visible:ring-sky-400 focus-visible:outline-none"
                  >
                    {axis === "yaw" ? "←" : axis === "pitch" ? "↓" : "⤴"}
                  </button>
                  <button
                    onClick={() => quickRotate(axis, "neutral")}
                    className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-slate-200 focus-visible:ring-1 focus-visible:ring-sky-400 focus-visible:outline-none"
                  >
                    Center
                  </button>
                  <button
                    onClick={() => quickRotate(axis, "right")}
                    className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-slate-200 focus-visible:ring-1 focus-visible:ring-sky-400 focus-visible:outline-none"
                  >
                    {axis === "yaw" ? "→" : axis === "pitch" ? "↑" : "⤵"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animation Speed Control */}
      <Slider
        label="Animation Speed"
        value={headMovement.speed}
        min={5}
        max={100}
        onChange={(v) => setHeadMovement({ speed: v })}
        formatValue={(v) => `${v}%`}
      />

      {/* Play/Reset Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setHeadMovement({ playing: !headMovement.playing })}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-400 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:outline-none"
        >
          {headMovement.playing ? <Pause size={14} /> : <Play size={14} />}
          {headMovement.playing ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => {
            resetHeadMovement();
            setHead({ yaw: 0, pitch: 0, roll: 0 });
          }}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
        >
          <RefreshCw size={14} />
          Reset
        </button>
      </div>

      {/* Canal Activation Meters */}
      <div>
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-300 uppercase">
          Canal Activation
        </h3>
        <div className="space-y-1.5">
          <FiringRateGauge
            label="Horizontal Canals"
            excitation={(horizontalLeftExcitation + horizontalRightExcitation) / 2}
            accentColor={CANAL_COLORS.horizontal}
          />
          <FiringRateGauge
            label="Anterior Canals"
            excitation={anteriorExcitation}
            accentColor={CANAL_COLORS.anterior}
          />
          <FiringRateGauge
            label="Posterior Canals"
            excitation={posteriorExcitation}
            accentColor={CANAL_COLORS.posterior}
          />
        </div>
      </div>

      {/* Selected Structure Info */}
      {selectedStructure && (
        <div className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-3">
          <h4 className="mb-1.5 text-xs font-semibold text-sky-300">{selectedStructure.name}</h4>
          <p className="text-[10px] leading-relaxed text-sky-200">{selectedStructure.functionText}</p>
          <div className="mt-2 pt-2 border-t border-sky-500/20">
            <p className="text-[10px] text-sky-300/70">
              <span className="font-semibold">Stimulated by:</span> {selectedStructure.primaryMovement}
            </p>
          </div>
        </div>
      )}

      {!selectedStructure && (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-[10.5px] leading-relaxed text-slate-400">
          <p className="mb-1 font-semibold text-slate-300">
            Click on a canal or structure in the 3D model to see details.
          </p>
          <p>
            Try rotating the head to see how different head movements stimulate specific semicircular
            canals and vestibular nerve firing patterns.
          </p>
        </div>
      )}
    </div>
  );
}
