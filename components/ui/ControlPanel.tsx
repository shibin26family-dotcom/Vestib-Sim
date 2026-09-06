"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useVestibular } from "@/lib/store";
import AnatomyTab from "@/components/tabs/AnatomyTab";
import EndolymphTab from "@/components/tabs/EndolymphTab";
import HairCellsTab from "@/components/tabs/HairCellsTab";
import QuizTab from "@/components/tabs/QuizTab";
import HeadMovementSimulator from "@/components/vestibular/HeadMovementSimulator";
import PushPullSimulator from "@/components/vestibular/PushPullSimulator";
import VORSimulator from "@/components/vestibular/VORSimulator";
import BPPVSimulator from "@/components/vestibular/BPPVSimulator";
import type { TabId } from "@/lib/types";

const TAB_TITLES: Record<TabId, string> = {
  anatomy: "Anatomy",
  "head-movement": "Head Movement Simulator",
  endolymph: "Endolymph Simulation",
  "hair-cells": "Cupula & Hair Cell Simulation",
  "push-pull": "Push-Pull Vestibular System",
  vor: "VOR Simulator",
  bppv: "BPPV Simulator",
  quiz: "Quiz",
};

export default function ControlPanel() {
  const { activeTab } = useVestibular();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <h2 className="mb-3 text-sm font-bold tracking-wide text-slate-100">
        {TAB_TITLES[activeTab]}
      </h2>
      <div className="min-h-0 flex-1 overflow-y-auto pr-1" id={`panel-${activeTab}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "anatomy" && <AnatomyTab />}
            {activeTab === "head-movement" && <HeadMovementSimulator />}
            {activeTab === "endolymph" && <EndolymphTab />}
            {activeTab === "hair-cells" && <HairCellsTab />}
            {activeTab === "push-pull" && <PushPullSimulator />}
            {activeTab === "vor" && <VORSimulator />}
            {activeTab === "bppv" && <BPPVSimulator />}
            {activeTab === "quiz" && <QuizTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
