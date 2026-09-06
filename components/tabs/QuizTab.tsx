"use client";

import Quiz from "@/components/ui/Quiz";

export default function QuizTab() {
  return (
    <div className="space-y-3">
      <p className="text-xs leading-relaxed text-slate-400">
        Test your understanding of vestibular anatomy and physiology with 18 questions covering the
        semicircular canals, endolymph dynamics, the VOR, Ewald&apos;s laws, and BPPV.
      </p>
      <Quiz />
    </div>
  );
}
