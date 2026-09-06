"use client";

import { MousePointerClick } from "lucide-react";
import { STRUCTURE_INFO } from "@/lib/vestibularData";
import { useVestibular } from "@/lib/store";

export default function InfoPanel() {
  const { selected } = useVestibular();

  if (!selected) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-6 text-center">
        <MousePointerClick size={20} className="text-slate-500" aria-hidden />
        <p className="text-xs text-slate-400">
          Click any structure in the 3D model to see its name, orientation, function, and clinical
          relevance.
        </p>
      </div>
    );
  }

  const info = STRUCTURE_INFO[selected.structureId];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: info.color }}
          aria-hidden
        />
        <h3 className="text-sm font-semibold text-slate-100">{info.name}</h3>
        <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-slate-300 uppercase">
          {selected.ear} ear
        </span>
      </div>
      <dl className="space-y-2.5 text-xs">
        <div>
          <dt className="font-semibold text-slate-400">Orientation</dt>
          <dd className="mt-0.5 text-slate-300">{info.orientation}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-400">Function</dt>
          <dd className="mt-0.5 text-slate-300">{info.functionText}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-400">Primary movement detected</dt>
          <dd className="mt-0.5 text-slate-300">{info.primaryMovement}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-400">Clinical relevance</dt>
          <dd className="mt-0.5 text-slate-300">{info.clinicalRelevance}</dd>
        </div>
      </dl>
    </div>
  );
}
