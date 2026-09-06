"use client";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  accentColor?: string;
  id?: string;
}

export default function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  accentColor = "#38bdf8",
  id,
}: SliderProps) {
  const inputId = id ?? `slider-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-300">
        <label htmlFor={inputId}>{label}</label>
        <span className="font-mono text-slate-100 tabular-nums">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-700/70 accent-sky-400 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
        style={{ accentColor }}
      />
    </div>
  );
}
