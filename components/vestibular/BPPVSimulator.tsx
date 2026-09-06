"use client";

import { useEffect } from "react";
import { PlayCircle, RotateCcw } from "lucide-react";
import { useVestibular } from "@/lib/store";
import Slider from "@/components/ui/Slider";
import { BPPV_CONDITION_INFO, CANAL_COLORS } from "@/lib/vestibularData";
import type { BppvCondition, CanalId } from "@/lib/types";

const CANAL_OPTIONS: { id: CanalId; label: string }[] = [
  { id: "posterior", label: "Posterior" },
  { id: "horizontal", label: "Horizontal" },
  { id: "anterior", label: "Anterior" },
];

const CONDITION_OPTIONS: BppvCondition[] = ["canalithiasis", "cupulolithiasis"];

const DIX_HALLPIKE_CAPTIONS: Record<number, string> = {
  1: "Step 1: Patient sits upright with the head turned 45° toward the tested (right) ear.",
  2: "Step 2: The patient is moved quickly backward into a supine position, head extended slightly below horizontal.",
  3: "Step 3: The head remains turned and extended - gravity now acts along the posterior canal's long axis.",
  4: "Step 4: Otoconia move through the posterior canal under gravity, dragging endolymph with them.",
  5: "Step 5: Endolymph movement deflects the cupula, triggering an abnormal vestibular signal.",
  6: "Step 6: The mismatched signal produces vertigo and the characteristic upbeating-torsional nystagmus.",
};

export default function BPPVSimulator() {
  const { bppv, setBppv, runDixHallpike, setHead, activeTab } = useVestibular();

  useEffect(() => {
    if (activeTab !== "bppv" || !bppv.playingDixHallpike) return;
    const step = bppv.dixHallpikeStep;
    if (step === 1) {
      setHead({ yaw: 45, pitch: 0, roll: 0 });
      setBppv({ headTilt: 0 });
    } else if (step === 2 || step === 3) {
      setHead({ yaw: 45, pitch: -55, roll: 0 });
    } else if (step === 4) {
      setBppv({ headTilt: 85 });
    } else if (step >= 5) {
      setBppv({ headTilt: 100 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bppv.dixHallpikeStep, bppv.playingDixHallpike, activeTab]);

  const resetPosition = () => {
    setHead({ yaw: 0, pitch: 0, roll: 0 });
    setBppv({ headTilt: 0, dixHallpikeStep: 0 });
  };

  const conditionInfo = BPPV_CONDITION_INFO[bppv.condition];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-1.5 text-xs font-semibold tracking-wide text-slate-300 uppercase">
          Affected Canal
        </h3>
        <div className="grid grid-cols-3 gap-1.5">
          {CANAL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setBppv({ canal: opt.id })}
              aria-pressed={bppv.canal === opt.id}
              className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
                bppv.canal === opt.id
                  ? "border-white/40 bg-white/10"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
              }`}
              style={{ color: bppv.canal === opt.id ? CANAL_COLORS[opt.id] : undefined }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1.5 text-xs font-semibold tracking-wide text-slate-300 uppercase">
          Condition
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {CONDITION_OPTIONS.map((cond) => (
            <button
              key={cond}
              onClick={() => setBppv({ condition: cond })}
              aria-pressed={bppv.condition === cond}
              className={`rounded-lg border px-2 py-2 text-xs font-semibold capitalize transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
                bppv.condition === cond
                  ? "border-sky-400/50 bg-sky-500/15 text-sky-300"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
          {conditionInfo.description}
        </p>
      </div>

      <Slider
        label="Rotate Head (simulate positioning)"
        value={bppv.headTilt}
        min={-100}
        max={100}
        onChange={(v) => setBppv({ headTilt: v })}
      />

      <div className="flex gap-2">
        <button
          onClick={runDixHallpike}
          disabled={bppv.playingDixHallpike}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-400 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:outline-none"
        >
          <PlayCircle size={14} />
          Simulate Dix-Hallpike
        </button>
        <button
          onClick={resetPosition}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {bppv.playingDixHallpike && (
        <div className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-3 text-[11px] leading-relaxed text-sky-200">
          {DIX_HALLPIKE_CAPTIONS[bppv.dixHallpikeStep]}
        </div>
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-[11px] leading-relaxed text-slate-300">
        <p className="mb-1 font-semibold text-slate-200">
          Posterior canal BPPV is the most common form of BPPV.
        </p>
        <p>
          Simplified nystagmus rule: canalithiasis of the right posterior canal typically produces
          upbeating, torsional (geotropic top-pole) nystagmus during the Dix-Hallpike test, fatiguing
          within about a minute. Cupulolithiasis produces similar but more persistent nystagmus with
          little or no latency.
        </p>
      </div>
    </div>
  );
}
