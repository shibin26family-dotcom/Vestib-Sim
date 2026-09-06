export type CanalId = "anterior" | "posterior" | "horizontal";

export type Ear = "left" | "right";

export type MotionAxis = "yaw" | "pitch" | "roll";

export type StructureId =
  | "anterior-canal"
  | "posterior-canal"
  | "horizontal-canal"
  | "vestibule"
  | "cochlea"
  | "ampulla-anterior"
  | "ampulla-posterior"
  | "ampulla-horizontal"
  | "vestibular-nerve";

export type TabId =
  | "anatomy"
  | "head-movement"
  | "endolymph"
  | "hair-cells"
  | "push-pull"
  | "vor"
  | "bppv"
  | "quiz";

export interface StructureInfo {
  id: StructureId;
  name: string;
  shortName: string;
  orientation: string;
  functionText: string;
  primaryMovement: string;
  clinicalRelevance: string;
  color: string;
}

export interface CanalExcitation {
  anteriorL: number;
  anteriorR: number;
  posteriorL: number;
  posteriorR: number;
  horizontalL: number;
  horizontalR: number;
}

export type BppvCondition = "canalithiasis" | "cupulolithiasis";

export interface ClinicalCondition {
  id: string;
  name: string;
  summary: string;
  details: string;
}

export interface EwaldLaw {
  id: number;
  title: string;
  description: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}
