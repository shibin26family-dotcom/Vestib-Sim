"use client";

import { useEffect, useRef, useState } from "react";
import Toggle from "@/components/ui/Toggle";
import Slider from "@/components/ui/Slider";
import { useVestibular } from "@/lib/store";
import { Droplets } from "lucide-react";

const TIME_CONSTANT = 1.3; // seconds - simplified cupula/endolymph "return to rest" lag
const GAIN = 1.1;

export default function EndolymphTab() {
  const { showEndolymph, setShowEndolymph, setCanalExcitation, setHead, activeTab } =
    useVestibular();
  const [acceleration, setAcceleration] = useState(0);
  const [relativeFlow, setRelativeFlow] = useState(0);
  const flowRef = useRef(0);
  const accelRef = useRef(0);
  useEffect(() => {
    accelRef.current = acceleration;
  }, [acceleration]);

  // This tab's whole purpose is showing endolymph motion, so switch it on
  // automatically here even though the app defaults to a clean anatomy view.
  useEffect(() => {
    if (activeTab === "endolymph") setShowEndolymph(true);
  }, [activeTab, setShowEndolymph]);

  useEffect(() => {
    if (activeTab !== "endolymph") return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      flowRef.current += ((accelRef.current * GAIN - flowRef.current) / TIME_CONSTANT) * dt;
      setRelativeFlow(flowRef.current);
      setCanalExcitation({
        horizontalL: flowRef.current,
        horizontalR: -flowRef.current,
        anteriorL: 0,
        anteriorR: 0,
        posteriorL: 0,
        posteriorR: 0,
      });
      setHead({ yaw: Math.max(-40, Math.min(40, flowRef.current * 0.35)), pitch: 0, roll: 0 });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeTab, setCanalExcitation, setHead]);

  return (
    <div className="space-y-4">
      <Toggle
        label="Show Endolymph"
        description="Animate glowing particles representing fluid movement inside the canals."
        checked={showEndolymph}
        onChange={setShowEndolymph}
      />

      <Slider
        label="Simulated Head Angular Acceleration"
        value={acceleration}
        min={-100}
        max={100}
        onChange={setAcceleration}
      />

      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <Droplets size={18} className="shrink-0 text-sky-300" aria-hidden />
        <div className="flex-1">
          <div className="mb-1 flex justify-between text-[10px] text-slate-400">
            <span>Relative endolymph flow</span>
            <span className="font-mono text-slate-200">{relativeFlow.toFixed(0)}</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="absolute top-0 h-full w-1/2 origin-left rounded-full bg-sky-400 transition-transform"
              style={{
                transform: `scaleX(${Math.abs(relativeFlow) / 100}) ${
                  relativeFlow < 0 ? "translateX(-100%) scaleX(-1)" : ""
                }`,
                left: "50%",
              }}
            />
            <div className="absolute top-0 left-1/2 h-full w-px bg-slate-500" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-3 text-[11px] leading-relaxed text-sky-100">
        During angular acceleration, the semicircular canal moves with the head while endolymph
        initially lags because of inertia. This relative motion between the bony canal and the
        fluid deflects the cupula - shown here as reversing particle flow in the canals.
      </div>

      <p className="text-[10px] text-slate-500">
        Simplified educational model: the slider represents angular acceleration; the flow bar
        shows relative endolymph displacement decaying back toward rest, similar to a real
        semicircular canal&apos;s torsion-pendulum dynamics.
      </p>
    </div>
  );
}
