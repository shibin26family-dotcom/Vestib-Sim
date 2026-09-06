"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  BppvCondition,
  CanalExcitation,
  CanalId,
  Ear,
  MotionAxis,
  StructureId,
  TabId,
} from "./types";

export interface Selection {
  structureId: StructureId;
  ear: Ear;
}

export interface HeadMovementControl {
  axis: MotionAxis;
  direction: number; // -100..100, sign = direction, magnitude = amplitude
  speed: number; // 1..100
  playing: boolean;
}

export interface HeadAngles {
  yaw: number;
  pitch: number;
  roll: number;
}

export interface VorState {
  autoplay: boolean;
  fixation: boolean;
  manualTurn: -1 | 0 | 1;
}

export interface BppvState {
  canal: CanalId;
  condition: BppvCondition;
  playingDixHallpike: boolean;
  dixHallpikeStep: number;
  headTilt: number; // manual rotation for canal demo outside dix-hallpike
}

const NEUTRAL_EXCITATION: CanalExcitation = {
  anteriorL: 0,
  anteriorR: 0,
  posteriorL: 0,
  posteriorR: 0,
  horizontalL: 0,
  horizontalR: 0,
};

interface VestibularContextValue {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  showBothEars: boolean;
  setShowBothEars: (v: boolean) => void;

  showLabels: boolean;
  setShowLabels: (v: boolean) => void;

  showEndolymph: boolean;
  setShowEndolymph: (v: boolean) => void;

  selected: Selection | null;
  select: (sel: Selection | null) => void;

  head: HeadAngles;
  setHead: (h: Partial<HeadAngles>) => void;

  headMovement: HeadMovementControl;
  setHeadMovement: (v: Partial<HeadMovementControl>) => void;
  resetHeadMovement: () => void;

  angularAcceleration: number;
  setAngularAcceleration: (v: number) => void;

  canalExcitation: CanalExcitation;
  setCanalExcitation: (v: Partial<CanalExcitation>) => void;
  resetCanalExcitation: () => void;

  pushPullDirection: "left" | "right" | "neutral";
  setPushPullDirection: (v: "left" | "right" | "neutral") => void;

  vor: VorState;
  setVor: (v: Partial<VorState>) => void;

  bppv: BppvState;
  setBppv: (v: Partial<BppvState>) => void;
  runDixHallpike: () => void;

  ampullaModalOpen: boolean;
  setAmpullaModalOpen: (v: boolean) => void;

  cameraResetSignal: number;
  resetCamera: () => void;
}

const VestibularContext = createContext<VestibularContextValue | null>(null);

export function VestibularProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>("anatomy");
  const [showBothEars, setShowBothEars] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showEndolymph, setShowEndolymph] = useState(false);
  const [selected, setSelected] = useState<Selection | null>(null);
  const [head, setHeadState] = useState<HeadAngles>({ yaw: 0, pitch: 0, roll: 0 });
  const [headMovement, setHeadMovementState] = useState<HeadMovementControl>({
    axis: "yaw",
    direction: 0,
    speed: 40,
    playing: false,
  });
  const [angularAcceleration, setAngularAcceleration] = useState(0);
  const [canalExcitation, setCanalExcitationState] =
    useState<CanalExcitation>(NEUTRAL_EXCITATION);
  const [pushPullDirection, setPushPullDirection] = useState<
    "left" | "right" | "neutral"
  >("neutral");
  const [vor, setVorState] = useState<VorState>({
    autoplay: false,
    fixation: true,
    manualTurn: 0,
  });
  const [bppv, setBppvState] = useState<BppvState>({
    canal: "posterior",
    condition: "canalithiasis",
    playingDixHallpike: false,
    dixHallpikeStep: 0,
    headTilt: 0,
  });
  const [ampullaModalOpen, setAmpullaModalOpen] = useState(false);
  const [cameraResetSignal, setCameraResetSignal] = useState(0);

  const setHead = useCallback((h: Partial<HeadAngles>) => {
    setHeadState((prev) => ({ ...prev, ...h }));
  }, []);

  const setHeadMovement = useCallback((v: Partial<HeadMovementControl>) => {
    setHeadMovementState((prev) => ({ ...prev, ...v }));
  }, []);

  const resetHeadMovement = useCallback(() => {
    setHeadMovementState((prev) => ({ ...prev, playing: false }));
    setHeadState({ yaw: 0, pitch: 0, roll: 0 });
  }, []);

  const setCanalExcitation = useCallback((v: Partial<CanalExcitation>) => {
    setCanalExcitationState((prev) => ({ ...prev, ...v }));
  }, []);

  const resetCanalExcitation = useCallback(() => {
    setCanalExcitationState(NEUTRAL_EXCITATION);
  }, []);

  const setVor = useCallback((v: Partial<VorState>) => {
    setVorState((prev) => ({ ...prev, ...v }));
  }, []);

  const setBppv = useCallback((v: Partial<BppvState>) => {
    setBppvState((prev) => ({ ...prev, ...v }));
  }, []);

  const resetCamera = useCallback(() => {
    setCameraResetSignal((n) => n + 1);
  }, []);

  const dixHallpikeTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runDixHallpike = useCallback(() => {
    dixHallpikeTimeouts.current.forEach(clearTimeout);
    dixHallpikeTimeouts.current = [];
    setBppvState((prev) => ({ ...prev, playingDixHallpike: true, dixHallpikeStep: 1 }));
    const steps = [1, 2, 3, 4, 5, 6];
    steps.forEach((step, i) => {
      const t = setTimeout(() => {
        setBppvState((prev) => ({ ...prev, dixHallpikeStep: step }));
        if (step === 6) {
          const finish = setTimeout(() => {
            setBppvState((prev) => ({ ...prev, playingDixHallpike: false }));
          }, 2200);
          dixHallpikeTimeouts.current.push(finish);
        }
      }, i * 1800);
      dixHallpikeTimeouts.current.push(t);
    });
  }, []);

  useEffect(() => {
    return () => {
      dixHallpikeTimeouts.current.forEach(clearTimeout);
    };
  }, []);

  // Head-movement play/pause animation loop (oscillates head angle on the chosen axis).
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef(0);
  useEffect(() => {
    if (!headMovement.playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const speedFactor = 0.3 + (headMovement.speed / 100) * 1.7;
      phaseRef.current += dt * speedFactor;
      const amplitude = Math.max(5, Math.abs(headMovement.direction)) * 0.6;
      const sign = headMovement.direction >= 0 ? 1 : -1;
      const angle = Math.sin(phaseRef.current) * amplitude * sign;
      setHeadState((prev) => {
        const next: HeadAngles = { yaw: 0, pitch: 0, roll: 0 };
        next[headMovement.axis === "yaw" ? "yaw" : headMovement.axis === "pitch" ? "pitch" : "roll"] =
          angle;
        return { ...prev, ...next };
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [headMovement.playing, headMovement.speed, headMovement.direction, headMovement.axis]);

  // Derive canal excitation from the active head-movement animation. Every other
  // tab drives excitation explicitly via setCanalExcitation, so this only takes
  // over while the Head Movement tab is active.
  const headMovementExcitation = useMemo<CanalExcitation | null>(() => {
    if (activeTab !== "head-movement") return null;
    const amplitude = Math.max(5, Math.abs(headMovement.direction)) * 0.6;
    const norm = (v: number) => clamp((v / amplitude) * 100, -100, 100);
    if (headMovement.axis === "yaw") {
      return {
        ...NEUTRAL_EXCITATION,
        horizontalL: norm(head.yaw),
        horizontalR: norm(-head.yaw),
      };
    }
    if (headMovement.axis === "pitch") {
      return {
        ...NEUTRAL_EXCITATION,
        anteriorL: norm(head.pitch),
        anteriorR: norm(head.pitch),
        posteriorL: norm(-head.pitch),
        posteriorR: norm(-head.pitch),
      };
    }
    return {
      ...NEUTRAL_EXCITATION,
      anteriorL: norm(head.roll),
      posteriorR: norm(head.roll),
      anteriorR: norm(-head.roll),
      posteriorL: norm(-head.roll),
    };
  }, [head, headMovement.axis, headMovement.direction, activeTab]);

  const effectiveCanalExcitation = headMovementExcitation ?? canalExcitation;

  const value = useMemo<VestibularContextValue>(
    () => ({
      activeTab,
      setActiveTab,
      showBothEars,
      setShowBothEars,
      showLabels,
      setShowLabels,
      showEndolymph,
      setShowEndolymph,
      selected,
      select: setSelected,
      head,
      setHead,
      headMovement,
      setHeadMovement,
      resetHeadMovement,
      angularAcceleration,
      setAngularAcceleration,
      canalExcitation: effectiveCanalExcitation,
      setCanalExcitation,
      resetCanalExcitation,
      pushPullDirection,
      setPushPullDirection,
      vor,
      setVor,
      bppv,
      setBppv,
      runDixHallpike,
      ampullaModalOpen,
      setAmpullaModalOpen,
      cameraResetSignal,
      resetCamera,
    }),
    [
      activeTab,
      showBothEars,
      showLabels,
      showEndolymph,
      selected,
      head,
      setHead,
      headMovement,
      setHeadMovement,
      resetHeadMovement,
      angularAcceleration,
      effectiveCanalExcitation,
      setCanalExcitation,
      resetCanalExcitation,
      pushPullDirection,
      vor,
      setVor,
      bppv,
      setBppv,
      runDixHallpike,
      ampullaModalOpen,
      cameraResetSignal,
      resetCamera,
    ],
  );

  return <VestibularContext.Provider value={value}>{children}</VestibularContext.Provider>;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function useVestibular(): VestibularContextValue {
  const ctx = useContext(VestibularContext);
  if (!ctx) throw new Error("useVestibular must be used within VestibularProvider");
  return ctx;
}
