"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { excitationState, excitationToFiringRate } from "@/lib/physiology";
import { motion } from "framer-motion";

interface FiringRateGaugeProps {
  label: string;
  excitation: number; // -100..100
  accentColor?: string;
}

const STATE_META = {
  excited: { text: "EXCITED", Icon: ArrowUp, color: "#fb923c" },
  inhibited: { text: "INHIBITED", Icon: ArrowDown, color: "#38bdf8" },
  baseline: { text: "BASELINE", Icon: Minus, color: "#94a3b8" },
} as const;

export default function FiringRateGauge({
  label,
  excitation,
  accentColor = "#38bdf8",
}: FiringRateGaugeProps) {
  const rate = excitationToFiringRate(excitation);
  const state = excitationState(excitation);
  const meta = STATE_META[state];
  const pct = Math.min(100, (rate / 200) * 100);

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-200">{label}</span>
        <span
          className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide"
          style={{ color: meta.color, backgroundColor: `${meta.color}1f` }}
        >
          <meta.Icon size={11} aria-hidden />
          {meta.text}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accentColor }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      <div className="mt-1 flex items-baseline justify-between">
        <span className="font-mono text-sm font-semibold text-slate-100 tabular-nums">
          {rate}
        </span>
        <span className="text-[10px] text-slate-500">spikes/sec</span>
      </div>
    </div>
  );
}
