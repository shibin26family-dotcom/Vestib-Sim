"use client";

import { EWALD_LAWS } from "@/lib/vestibularData";

export default function EwaldsLaws() {
  return (
    <div className="space-y-2">
      {EWALD_LAWS.map((law) => (
        <div key={law.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-[10px] font-bold text-sky-300">
              {law.id}
            </span>
            <h4 className="text-xs font-semibold text-slate-100">{law.title}</h4>
          </div>
          <p className="pl-7 text-[11px] leading-relaxed text-slate-400">{law.description}</p>
        </div>
      ))}
    </div>
  );
}
