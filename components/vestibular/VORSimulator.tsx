"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Play, Square, Target } from "lucide-react";
import { useVestibular } from "@/lib/store";
import Toggle from "@/components/ui/Toggle";

const MAX_ANGLE = 34;

export default function VORSimulator() {
  const { setHead, setCanalExcitation, vor, setVor, activeTab } = useVestibular();
  const [headAngle, setHeadAngle] = useState(0);
  const targetRef = useRef(0);
  const phaseRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeTab !== "vor") return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setHeadAngle((prev) => {
        let next = prev;
        if (vor.autoplay) {
          phaseRef.current += dt * 1.1;
          next = Math.sin(phaseRef.current) * MAX_ANGLE;
        } else {
          next = prev + (targetRef.current - prev) * Math.min(1, dt * 4);
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [vor.autoplay, activeTab]);

  useEffect(() => {
    if (activeTab !== "vor") return;
    setHead({ yaw: headAngle, pitch: 0, roll: 0 });
    const excitation = Math.max(-100, Math.min(100, (-headAngle / MAX_ANGLE) * 70));
    setCanalExcitation({
      horizontalL: excitation,
      horizontalR: -excitation,
      anteriorL: 0,
      anteriorR: 0,
      posteriorL: 0,
      posteriorR: 0,
    });
  }, [headAngle, activeTab, setHead, setCanalExcitation]);

  const eyeOffset = Math.max(-9, Math.min(9, -headAngle * 0.26));

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-slate-400">
        The vestibulo-ocular reflex stabilizes vision by producing a compensatory eye movement
        opposite the direction of head rotation.
      </p>

      <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
        {vor.fixation && (
          <div className="absolute top-4 flex flex-col items-center gap-1 text-amber-300">
            <Target size={16} aria-hidden />
            <span className="text-[9px] font-medium tracking-wide uppercase">Fixation Target</span>
          </div>
        )}
        <div
          className="relative flex h-20 w-28 items-center justify-center rounded-[50%] border-2 border-slate-400 bg-slate-700/60 transition-transform"
          style={{ transform: `rotate(${headAngle * 0.5}deg)` }}
        >
          <div className="flex gap-3">
            {[0, 1].map((eye) => (
              <div
                key={eye}
                className="relative flex h-6 w-6 items-center justify-center rounded-full bg-white"
              >
                <div
                  className="h-3 w-3 rounded-full bg-slate-900 transition-transform"
                  style={{ transform: `translateX(${eyeOffset}px)` }}
                />
              </div>
            ))}
          </div>
          <span className="absolute -bottom-5 text-[9px] font-medium tracking-wide text-slate-400 uppercase">
            head
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        <button
          onClick={() => {
            setVor({ autoplay: false });
            targetRef.current = -MAX_ANGLE;
          }}
          className="flex flex-col items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-2.5 text-[11px] font-semibold text-slate-300 transition-colors hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
        >
          <ArrowLeft size={16} />
          Turn Left
        </button>
        <button
          onClick={() => {
            setVor({ autoplay: false });
            targetRef.current = 0;
          }}
          className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-2.5 text-[11px] font-semibold text-slate-300 transition-colors hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
        >
          Center
        </button>
        <button
          onClick={() => {
            setVor({ autoplay: false });
            targetRef.current = MAX_ANGLE;
          }}
          className="flex flex-col items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-2.5 text-[11px] font-semibold text-slate-300 transition-colors hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
        >
          <ArrowRight size={16} />
          Turn Right
        </button>
      </div>

      <button
        onClick={() => setVor({ autoplay: !vor.autoplay })}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-400 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:outline-none"
      >
        {vor.autoplay ? <Square size={14} /> : <Play size={14} />}
        {vor.autoplay ? "Stop Autoplay" : "Autoplay"}
      </button>

      <Toggle
        label="Fixation Target"
        description="Show a stationary target the eyes stay locked on."
        checked={vor.fixation}
        onChange={(v) => setVor({ fixation: v })}
      />
    </div>
  );
}
