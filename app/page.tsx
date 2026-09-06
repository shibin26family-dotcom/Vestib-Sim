"use client";

import dynamic from "next/dynamic";
import { Activity } from "lucide-react";
import Navigation from "@/components/ui/Navigation";
import ControlPanel from "@/components/ui/ControlPanel";

const VestibularScene = dynamic(() => import("@/components/vestibular/VestibularScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-white/10 bg-[#04060b] text-xs text-slate-500">
      Loading 3D labyrinth model…
    </div>
  ),
});

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-white/10 bg-[#05070d]/90 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300">
            <Activity size={18} aria-hidden />
          </span>
          <div>
            <h1 className="text-sm leading-tight font-bold text-slate-50">Vestibular Lab</h1>
            <p className="text-[10px] leading-tight text-slate-500">
              Interactive Semicircular Canal &amp; Vestibular System Simulator
            </p>
          </div>
        </div>
      </header>

      <div className="border-b border-white/10 bg-[#05070d]/70">
        <Navigation />
      </div>

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 p-3 sm:p-4 lg:flex-row lg:p-6">
        <section
          className="h-[46vh] min-h-[340px] w-full lg:h-[calc(100vh-9.5rem)] lg:w-[67%]"
          aria-label="3D vestibular labyrinth viewer"
        >
          <VestibularScene />
        </section>

        <aside
          className="w-full flex-1 lg:h-[calc(100vh-9.5rem)] lg:w-[33%]"
          aria-label="Educational controls and information"
        >
          <ControlPanel />
        </aside>
      </main>

      <footer className="border-t border-white/10 px-4 py-2.5 text-center text-[10px] text-slate-600 sm:px-6">
        Vestibular Lab is a simplified educational model for teaching purposes and is not a
        substitute for clinical assessment or diagnostic tools.
      </footer>
    </div>
  );
}
