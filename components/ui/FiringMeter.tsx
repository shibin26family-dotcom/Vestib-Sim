"use client";

import { motion } from "framer-motion";
import { excitationState } from "@/lib/physiology";

interface FiringMeterProps {
  excitation: number; // -100..100
  firingRate: number; // spikes/sec
}

const MIN_RATE = 20;
const MAX_RATE = 200;

const STATE_TEXT: Record<ReturnType<typeof excitationState>, { label: string; color: string }> = {
  inhibited: { label: "INHIBITED", color: "#38bdf8" },
  baseline: { label: "BASELINE", color: "#94a3b8" },
  excited: { label: "EXCITED", color: "#fb923c" },
};

export default function FiringMeter({ excitation, firingRate }: FiringMeterProps) {
  const state = excitationState(excitation);
  const meta = STATE_TEXT[state];
  const pct = Math.max(0, Math.min(100, ((firingRate - MIN_RATE) / (MAX_RATE - MIN_RATE)) * 100));

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
          Vestibular Nerve Firing
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide"
          style={{ color: meta.color, backgroundColor: `${meta.color}1f` }}
        >
          {meta.label}
        </span>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between text-[9px] font-semibold tracking-wide text-slate-500 uppercase">
          <span>Inhibited</span>
          <span>Baseline</span>
          <span>Excited</span>
        </div>
        <div className="relative mt-1 h-2 rounded-full bg-gradient-to-r from-sky-500/40 via-slate-500/40 to-orange-500/40">
          <div className="absolute top-1/2 left-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-slate-400/60" />
          <motion.div
            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-slate-900 shadow"
            style={{ backgroundColor: meta.color }}
            animate={{ left: `calc(${pct}% - 8px)` }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
          />
        </div>
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <span className="font-mono text-lg font-bold text-slate-100 tabular-nums">
          {Math.round(firingRate)}
        </span>
        <span className="text-[10px] text-slate-500">spikes/sec (simplified educational model)</span>
      </div>
    </div>
  );
}
