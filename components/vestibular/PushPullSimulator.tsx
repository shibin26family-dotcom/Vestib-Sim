"use client";

import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { useVestibular } from "@/lib/store";
import FiringRateGauge from "@/components/ui/FiringRateGauge";
import { CANAL_COLORS } from "@/lib/vestibularData";

export default function PushPullSimulator() {
  const { pushPullDirection, setPushPullDirection, setCanalExcitation, setHead, activeTab } =
    useVestibular();

  useEffect(() => {
    if (activeTab !== "push-pull") return;
    const val = pushPullDirection === "left" ? 55 : pushPullDirection === "right" ? -55 : 0;
    setCanalExcitation({
      horizontalL: val,
      horizontalR: -val,
      anteriorL: 0,
      anteriorR: 0,
      posteriorL: 0,
      posteriorR: 0,
    });
    setHead({
      yaw: pushPullDirection === "left" ? -24 : pushPullDirection === "right" ? 24 : 0,
      pitch: 0,
      roll: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushPullDirection, activeTab]);

  const eyesGoRight = pushPullDirection === "left";
  const eyesGoLeft = pushPullDirection === "right";

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-slate-400">
        The two horizontal canals work as a matched pair. Rotating the head one direction excites
        one labyrinth while inhibiting the other - the vestibular <strong>push-pull</strong>{" "}
        system.
      </p>

      <div className="grid grid-cols-3 gap-1.5">
        <button
          onClick={() => setPushPullDirection("left")}
          aria-pressed={pushPullDirection === "left"}
          className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-[11px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
            pushPullDirection === "left"
              ? "border-sky-400/50 bg-sky-500/15 text-sky-300"
              : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
          }`}
        >
          <ArrowLeft size={16} />
          Turn Left
        </button>
        <button
          onClick={() => setPushPullDirection("neutral")}
          aria-pressed={pushPullDirection === "neutral"}
          className={`rounded-lg border px-2 py-2.5 text-[11px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
            pushPullDirection === "neutral"
              ? "border-sky-400/50 bg-sky-500/15 text-sky-300"
              : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
          }`}
        >
          Neutral
        </button>
        <button
          onClick={() => setPushPullDirection("right")}
          aria-pressed={pushPullDirection === "right"}
          className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-[11px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
            pushPullDirection === "right"
              ? "border-sky-400/50 bg-sky-500/15 text-sky-300"
              : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
          }`}
        >
          <ArrowRight size={16} />
          Turn Right
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <FiringRateGauge
          label="Left Horizontal Canal"
          excitation={pushPullDirection === "left" ? 55 : pushPullDirection === "right" ? -55 : 0}
          accentColor={CANAL_COLORS.horizontal}
        />
        <FiringRateGauge
          label="Right Horizontal Canal"
          excitation={pushPullDirection === "left" ? -55 : pushPullDirection === "right" ? 55 : 0}
          accentColor={CANAL_COLORS.horizontal}
        />
      </div>

      <div className="flex items-center justify-center gap-3 rounded-lg border border-sky-500/20 bg-sky-500/10 p-3">
        <Eye size={16} className="text-sky-300" aria-hidden />
        <p className="text-center text-xs font-medium text-sky-200">
          {pushPullDirection === "neutral" && "Eyes remain centered at rest."}
          {eyesGoRight && "Head turns LEFT → eyes move RIGHT (compensatory VOR)"}
          {eyesGoLeft && "Head turns RIGHT → eyes move LEFT (compensatory VOR)"}
        </p>
      </div>
    </div>
  );
}
