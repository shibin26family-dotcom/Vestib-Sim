"use client";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  description?: string;
}

export default function Toggle({ label, checked, onChange, description }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-left transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
    >
      <span>
        <span className="block text-xs font-medium text-slate-200">{label}</span>
        {description && <span className="block text-[11px] text-slate-400">{description}</span>}
      </span>
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? "bg-sky-500" : "bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
