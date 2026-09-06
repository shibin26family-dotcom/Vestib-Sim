"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Toggle from "@/components/ui/Toggle";
import InfoPanel from "@/components/ui/InfoPanel";
import EwaldsLaws from "@/components/ui/EwaldsLaws";
import ClinicalConnections from "@/components/ui/ClinicalConnections";
import { useVestibular } from "@/lib/store";
import { CANAL_COLORS } from "@/lib/vestibularData";

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-2 text-xs font-semibold tracking-wide text-slate-300 uppercase focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
      >
        {title}
        <ChevronDown
          size={15}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  );
}

export default function AnatomyTab() {
  const { showLabels, setShowLabels, showBothEars, setShowBothEars, showEndolymph, setShowEndolymph } =
    useVestibular();

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-slate-400">
        Explore the bony labyrinth of the inner ear. Rotate, zoom, and click any structure to learn
        its orientation, function, and clinical relevance.
      </p>

      <div className="flex flex-wrap gap-2 text-[11px]">
        {(["anterior", "posterior", "horizontal"] as const).map((c) => (
          <span key={c} className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: CANAL_COLORS[c] }}
              aria-hidden
            />
            <span className="text-slate-300 capitalize">{c} canal</span>
          </span>
        ))}
      </div>

      <div className="space-y-2">
        <Toggle label="Show Labels" checked={showLabels} onChange={setShowLabels} />
        <Toggle
          label="Show Both Ears"
          description="Compare left and right labyrinths side by side."
          checked={showBothEars}
          onChange={setShowBothEars}
        />
        <Toggle label="Show Endolymph" checked={showEndolymph} onChange={setShowEndolymph} />
      </div>

      <InfoPanel />

      <div className="divide-y divide-white/10 border-t border-white/10">
        <Section title="Ewald's Laws">
          <EwaldsLaws />
        </Section>
        <Section title="Clinical Connections">
          <ClinicalConnections />
        </Section>
      </div>
    </div>
  );
}
