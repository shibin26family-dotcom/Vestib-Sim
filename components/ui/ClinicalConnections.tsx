"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { CLINICAL_CONNECTIONS } from "@/lib/vestibularData";

export default function ClinicalConnections() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {CLINICAL_CONNECTIONS.map((condition) => {
        const isOpen = openId === condition.id;
        return (
          <div
            key={condition.id}
            className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : condition.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
            >
              <span>
                <span className="block text-xs font-semibold text-slate-100">
                  {condition.name}
                </span>
                <span className="block text-[11px] text-slate-400">{condition.summary}</span>
              </span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-3 pb-3 text-xs leading-relaxed text-slate-300"
              >
                {condition.details}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
