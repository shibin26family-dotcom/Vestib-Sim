export const BASELINE_FIRING_RATE = 90;
const FIRING_GAIN = 0.65;
const MAX_FIRING_RATE = 200;

/** Simplified educational mapping from canal excitation (-100..100) to afferent firing rate. */
export function excitationToFiringRate(excitation: number): number {
  const raw = BASELINE_FIRING_RATE + excitation * FIRING_GAIN;
  return Math.round(Math.min(MAX_FIRING_RATE, Math.max(0, raw)));
}

export type ExcitationState = "excited" | "inhibited" | "baseline";

export function excitationState(excitation: number): ExcitationState {
  if (excitation > 8) return "excited";
  if (excitation < -8) return "inhibited";
  return "baseline";
}
