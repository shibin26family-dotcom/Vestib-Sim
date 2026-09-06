"use client";

import { useEffect } from "react";
import { Microscope } from "lucide-react";
import Slider from "@/components/ui/Slider";
import FiringRateGauge from "@/components/ui/FiringRateGauge";
import Modal from "@/components/ui/Modal";
import AmpullaExplorer from "@/components/vestibular/AmpullaExplorer";
import { useVestibular } from "@/lib/store";
import { CANAL_COLORS } from "@/lib/vestibularData";

export default function HairCellsTab() {
  const {
    angularAcceleration,
    setAngularAcceleration,
    setCanalExcitation,
    activeTab,
    ampullaModalOpen,
    setAmpullaModalOpen,
  } = useVestibular();

  useEffect(() => {
    if (activeTab !== "hair-cells") return;
    setCanalExcitation({
      horizontalL: angularAcceleration,
      horizontalR: -angularAcceleration,
      anteriorL: 0,
      anteriorR: 0,
      posteriorL: 0,
      posteriorR: 0,
    });
  }, [angularAcceleration, activeTab, setCanalExcitation]);

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-slate-400">
        Adjust simulated angular acceleration to see how the cupula bends, hair bundles tilt, and
        vestibular nerve firing changes.
      </p>

      <Slider
        label="Angular Acceleration"
        value={angularAcceleration}
        min={-100}
        max={100}
        onChange={setAngularAcceleration}
        accentColor={CANAL_COLORS.horizontal}
      />

      <FiringRateGauge
        label="Vestibular Nerve Firing (Left Horizontal)"
        excitation={angularAcceleration}
        accentColor={CANAL_COLORS.horizontal}
      />
      <FiringRateGauge
        label="Vestibular Nerve Firing (Right Horizontal)"
        excitation={-angularAcceleration}
        accentColor={CANAL_COLORS.horizontal}
      />

      <p className="text-[10px] text-slate-500">
        Simplified educational model - baseline firing ≈ 90 spikes/sec, increasing with excitation
        and decreasing with inhibition.
      </p>

      <button
        onClick={() => setAmpullaModalOpen(true)}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-slate-100 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
      >
        <Microscope size={15} aria-hidden />
        Explore Ampulla
      </button>

      <Modal
        open={ampullaModalOpen}
        onClose={() => setAmpullaModalOpen(false)}
        title="Ampulla Physiology Explorer"
      >
        <AmpullaExplorer />
      </Modal>
    </div>
  );
}
