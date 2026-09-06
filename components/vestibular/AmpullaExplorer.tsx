"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronDown, Pause, Play, RotateCcw } from "lucide-react";
import Slider from "@/components/ui/Slider";
import FiringMeter from "@/components/ui/FiringMeter";
import AmpullaDiagram from "./AmpullaDiagram";
import { useVestibular } from "@/lib/store";
import { excitationToFiringRate } from "@/lib/physiology";
import { CANAL_COLORS, STRUCTURE_INFO } from "@/lib/vestibularData";
import type { CanalId } from "@/lib/types";

const CANAL_OPTIONS: CanalId[] = ["horizontal", "anterior", "posterior"];

const CHAIN_STEPS = [
  "HEAD ROTATION",
  "ENDOLYMPH LAG",
  "CUPULA DEFLECTION",
  "HAIR-CELL DEFLECTION",
  "CN VIII FIRING CHANGE",
];

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-2.5 text-left text-xs font-semibold tracking-wide text-slate-300 uppercase focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
      >
        {title}
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && <div className="pb-3 text-[11px] leading-relaxed text-slate-400">{children}</div>}
    </div>
  );
}

export default function AmpullaExplorer() {
  const { angularAcceleration, setAngularAcceleration } = useVestibular();
  const [canalId, setCanalId] = useState<CanalId>("horizontal");
  const [demoPlaying, setDemoPlaying] = useState(false);

  const tweenRaf = useRef<number | null>(null);
  // Keep a ref mirror of the latest value so tweens always start from "now".
  const angularAccelerationRef = useRef(angularAcceleration);
  useEffect(() => {
    angularAccelerationRef.current = angularAcceleration;
  }, [angularAcceleration]);

  const stopTween = () => {
    if (tweenRaf.current) cancelAnimationFrame(tweenRaf.current);
    tweenRaf.current = null;
  };

  const tweenTo = (target: number, durationMs: number) => {
    stopTween();
    const start = performance.now();
    const from = angularAccelerationRef.current;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeInOutCubic(t);
      const value = from + (target - from) * eased;
      setAngularAcceleration(Math.round(value));
      if (t < 1) {
        tweenRaf.current = requestAnimationFrame(step);
      } else {
        tweenRaf.current = null;
      }
    };
    tweenRaf.current = requestAnimationFrame(step);
  };

  const runSlowMotionDemo = () => {
    stopTween();
    setDemoPlaying(true);
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const totalMs = reducedMotion ? 800 : 6000;
    const start = performance.now();
    const keyframes = [
      { t: 0, v: 0 },
      { t: 0.28, v: 78 },
      { t: 0.55, v: 78 },
      { t: 1, v: 0 },
    ];
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / totalMs);
      let value = 0;
      for (let i = 0; i < keyframes.length - 1; i++) {
        const a = keyframes[i];
        const b = keyframes[i + 1];
        if (t >= a.t && t <= b.t) {
          const localT = b.t === a.t ? 1 : (t - a.t) / (b.t - a.t);
          value = a.v + (b.v - a.v) * easeInOutCubic(localT);
          break;
        }
      }
      setAngularAcceleration(Math.round(value));
      if (t < 1) {
        tweenRaf.current = requestAnimationFrame(step);
      } else {
        tweenRaf.current = null;
        setDemoPlaying(false);
      }
    };
    tweenRaf.current = requestAnimationFrame(step);
  };

  const pauseDemo = () => {
    stopTween();
    setDemoPlaying(false);
  };

  const resetAll = () => {
    stopTween();
    setDemoPlaying(false);
    setAngularAcceleration(0);
  };

  useEffect(() => stopTween, []);

  const firingRate = excitationToFiringRate(angularAcceleration);
  const activeSteps = Math.abs(angularAcceleration) > 4 ? CHAIN_STEPS.length : 1;
  const color = CANAL_COLORS[canalId];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.9fr)]">
      <div className="space-y-3">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-[#03040a] sm:aspect-[11/7]">
          <AmpullaDiagram canalId={canalId} deflection={angularAcceleration} firingRate={firingRate} />
        </div>

        {/* Causal chain */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
          {CHAIN_STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-1.5">
              <span
                className={`rounded-md px-2 py-1 text-[9.5px] font-bold tracking-wide transition-colors ${
                  i < activeSteps
                    ? "bg-sky-500/20 text-sky-300"
                    : "bg-white/5 text-slate-500"
                }`}
              >
                {step}
              </span>
              {i < CHAIN_STEPS.length - 1 && (
                <span className={i < activeSteps - 1 ? "text-sky-400" : "text-slate-600"}>
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        <FiringMeter excitation={angularAcceleration} firingRate={firingRate} />
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="mb-1.5 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
            Canal
          </h4>
          <div className="flex gap-1.5">
            {CANAL_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setCanalId(c)}
                aria-pressed={canalId === c}
                className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold capitalize transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
                  canalId === c
                    ? "border-white/40 bg-white/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
                }`}
                style={{ color: canalId === c ? CANAL_COLORS[c] : undefined }}
              >
                {c}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            {STRUCTURE_INFO[`ampulla-${canalId}`].functionText}
          </p>
          <p className="mt-2 rounded-md bg-white/5 px-2.5 py-2 text-[10.5px] leading-relaxed text-slate-300">
            {canalId === "horizontal"
              ? "Horizontal canal excitation occurs with ampullopetal flow (toward the ampulla)."
              : "Vertical canal excitation occurs with ampullofugal flow (away from the ampulla) - the opposite of the horizontal canal."}
          </p>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <h4 className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
              Angular Acceleration
            </h4>
            <span className="text-[10px] text-slate-500">
              {angularAcceleration < 0 ? "LEFT" : angularAcceleration > 0 ? "RIGHT" : "NEUTRAL"}
            </span>
          </div>
          <Slider
            label=""
            value={angularAcceleration}
            min={-100}
            max={100}
            onChange={(v) => {
              stopTween();
              setDemoPlaying(false);
              setAngularAcceleration(v);
            }}
            accentColor={color}
          />
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <button
              onClick={() => tweenTo(-70, 550)}
              className="flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-[10.5px] font-semibold text-slate-300 hover:bg-white/[0.08]"
            >
              <ArrowDownRight size={12} /> Rotate Left
            </button>
            <button
              onClick={() => tweenTo(0, 400)}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-[10.5px] font-semibold text-slate-300 hover:bg-white/[0.08]"
            >
              Neutral
            </button>
            <button
              onClick={() => tweenTo(70, 550)}
              className="flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-[10.5px] font-semibold text-slate-300 hover:bg-white/[0.08]"
            >
              Rotate Right <ArrowUpRight size={12} />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={demoPlaying ? pauseDemo : runSlowMotionDemo}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-400 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:outline-none"
          >
            {demoPlaying ? <Pause size={14} /> : <Play size={14} />}
            {demoPlaying ? "Pause Demo" : "Slow-Motion Demo"}
          </button>
          <button
            onClick={resetAll}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <h4 className="mb-1.5 text-[10.5px] font-semibold tracking-wide text-slate-300 uppercase">
            Stereocilia → Kinocilium
          </h4>
          <div className="space-y-1 text-[10.5px] leading-relaxed text-slate-400">
            <p>
              <span className="font-semibold text-orange-300">Toward kinocilium</span> →
              depolarization → increased transmitter release → firing increases.
            </p>
            <p>
              <span className="font-semibold text-sky-300">Away from kinocilium</span> →
              hyperpolarization → decreased transmitter release → firing decreases.
            </p>
          </div>
        </div>

        <div className="divide-y divide-white/10 border-t border-white/10">
          <Section title="Anatomy">
            The ampulla is a widened portion of the semicircular duct containing the crista
            ampullaris, a ridge of sensory epithelium. Vestibular hair cells sit on the crista with
            their stereocilia and kinocilium embedded in the gelatinous cupula, which spans the
            ampulla like a swinging door and seals the lumen.
          </Section>
          <Section title="Hair Cell Physiology">
            Vestibular afferents fire tonically at rest (baseline ≈ 90 spikes/sec in this simplified
            model). The semicircular canals detect angular acceleration: because endolymph has
            inertia, it briefly lags the bony canal during a head turn, deflecting the cupula. The
            strongest afferent response corresponds to changes in angular velocity, not to
            continued flow during constant-velocity rotation.
          </Section>
          <Section title="Ewald's Laws">
            1) Eye movements occur in the plane of the stimulated canal. 2) The horizontal canal
            responds more strongly to ampullopetal flow. 3) The vertical canals respond more
            strongly to ampullofugal flow.
          </Section>
        </div>
      </div>
    </div>
  );
}
