"use client";

import {
  AlertTriangle,
  ArrowLeftRight,
  BookOpen,
  Droplets,
  Eye,
  GraduationCap,
  RotateCw,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useVestibular } from "@/lib/store";
import type { TabId } from "@/lib/types";

interface TabDef {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

const TABS: TabDef[] = [
  { id: "anatomy", label: "Anatomy", icon: BookOpen },
  { id: "head-movement", label: "Head Movement", icon: RotateCw },
  { id: "endolymph", label: "Endolymph", icon: Droplets },
  { id: "hair-cells", label: "Hair Cells", icon: Sparkles },
  { id: "push-pull", label: "Push-Pull", icon: ArrowLeftRight },
  { id: "vor", label: "VOR", icon: Eye },
  { id: "bppv", label: "BPPV", icon: AlertTriangle },
  { id: "quiz", label: "Quiz", icon: GraduationCap },
];

export default function Navigation() {
  const { activeTab, setActiveTab } = useVestibular();

  return (
    <nav
      role="tablist"
      aria-label="Vestibular Lab sections"
      className="flex gap-1 overflow-x-auto px-2 py-1.5 sm:px-4"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
              isActive
                ? "bg-sky-500/15 text-sky-300"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <Icon size={15} aria-hidden />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
