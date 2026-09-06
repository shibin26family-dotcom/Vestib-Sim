import type {
  BppvCondition,
  ClinicalCondition,
  EwaldLaw,
  StructureId,
  StructureInfo,
} from "./types";

export const CANAL_COLORS = {
  anterior: "#7c4fd1", // deep violet
  posterior: "#3a8f6b", // muted emerald
  horizontal: "#c2661c", // burnt orange
} as const;

export const VESTIBULE_COLOR = "#3f7f86"; // muted teal/blue
export const COCHLEA_COLOR = "#c99a3c"; // warm ochre/gold
export const NERVE_COLOR = "#e7ddc6"; // off-white / pale beige

export const STRUCTURE_INFO: Record<StructureId, StructureInfo> = {
  "anterior-canal": {
    id: "anterior-canal",
    name: "Anterior (Superior) Semicircular Canal",
    shortName: "Anterior Canal",
    orientation:
      "Oriented in a near-vertical plane, angled roughly 45° to the sagittal plane, tilted anterolaterally.",
    functionText:
      "Detects angular acceleration in the plane of pitch-like head rotations (nodding, forward somersault motion).",
    primaryMovement: "Pitch / forward-backward tumbling rotation",
    clinicalRelevance:
      "Least commonly affected in BPPV; can be involved in anterior-canal canalithiasis, producing a downbeating torsional nystagmus.",
    color: CANAL_COLORS.anterior,
  },
  "posterior-canal": {
    id: "posterior-canal",
    name: "Posterior Semicircular Canal",
    shortName: "Posterior Canal",
    orientation:
      "Oriented in a near-vertical plane, angled roughly 45° to the sagittal plane on the opposite diagonal from the anterior canal.",
    functionText:
      "Detects angular acceleration associated with pitch/roll combinations, especially motions that tip the ear toward the shoulder while nodding.",
    primaryMovement: "Combined pitch-roll rotation",
    clinicalRelevance:
      "The most common site of BPPV (posterior canal BPPV), diagnosed with the Dix-Hallpike maneuver.",
    color: CANAL_COLORS.posterior,
  },
  "horizontal-canal": {
    id: "horizontal-canal",
    name: "Horizontal (Lateral) Semicircular Canal",
    shortName: "Horizontal Canal",
    orientation:
      "Approximately horizontal when the head is tilted about 30° forward from anatomical position.",
    functionText:
      "Detects angular acceleration associated primarily with yaw rotation (turning the head left or right).",
    primaryMovement: "Yaw / turning left-right",
    clinicalRelevance:
      "Frequently involved in horizontal-canal BPPV; the primary canal tested by the horizontal head-impulse test.",
    color: CANAL_COLORS.horizontal,
  },
  vestibule: {
    id: "vestibule",
    name: "Vestibule",
    shortName: "Vestibule",
    orientation: "Central chamber of the bony labyrinth, medial to the middle ear.",
    functionText:
      "Houses the utricle and saccule, which detect linear acceleration and static head tilt (gravity), and connects all three semicircular canals.",
    primaryMovement: "Linear acceleration & head tilt (otolith organs)",
    clinicalRelevance:
      "Otolith dysfunction here contributes to some forms of BPPV (otoconia debris originates from the utricle).",
    color: VESTIBULE_COLOR,
  },
  cochlea: {
    id: "cochlea",
    name: "Cochlea",
    shortName: "Cochlea",
    orientation: "Coiled, snail-shaped structure anterior to the vestibule.",
    functionText:
      "The auditory portion of the inner ear; converts sound-induced fluid vibration into neural signals. Not part of the vestibular system, shown here for anatomical context.",
    primaryMovement: "Sound / auditory frequency encoding",
    clinicalRelevance:
      "Shared inner-ear pathology (e.g., Meniere disease, labyrinthitis) can affect both hearing and balance.",
    color: COCHLEA_COLOR,
  },
  "ampulla-anterior": {
    id: "ampulla-anterior",
    name: "Anterior Canal Ampulla",
    shortName: "Anterior Ampulla",
    orientation: "Swelling at one end of the anterior semicircular canal, adjacent to the vestibule.",
    functionText:
      "Contains the crista ampullaris and cupula that transduce endolymph movement from the anterior canal into neural signals.",
    primaryMovement: "Pitch-related angular acceleration",
    clinicalRelevance: "Site of cupula deflection in anterior-canal BPPV or neuritis.",
    color: CANAL_COLORS.anterior,
  },
  "ampulla-posterior": {
    id: "ampulla-posterior",
    name: "Posterior Canal Ampulla",
    shortName: "Posterior Ampulla",
    orientation: "Swelling at one end of the posterior semicircular canal, near the vestibule floor.",
    functionText:
      "Contains the crista ampullaris and cupula that transduce endolymph movement from the posterior canal into neural signals.",
    primaryMovement: "Pitch-roll combined angular acceleration",
    clinicalRelevance: "Most common site of otoconial debris accumulation in BPPV.",
    color: CANAL_COLORS.posterior,
  },
  "ampulla-horizontal": {
    id: "ampulla-horizontal",
    name: "Horizontal Canal Ampulla",
    shortName: "Horizontal Ampulla",
    orientation: "Swelling at the anterior end of the horizontal semicircular canal.",
    functionText:
      "Contains the crista ampullaris and cupula that transduce endolymph movement from the horizontal canal into neural signals.",
    primaryMovement: "Yaw angular acceleration",
    clinicalRelevance: "Second most common site of BPPV after the posterior canal.",
    color: CANAL_COLORS.horizontal,
  },
  "vestibular-nerve": {
    id: "vestibular-nerve",
    name: "Vestibular Nerve",
    shortName: "Vestibular Nerve",
    orientation: "Bundle of afferent fibers exiting the base of each ampulla and the otolith organs.",
    functionText:
      "Carries afferent signals encoding head rotation and orientation from hair cells to the vestibular nuclei in the brainstem.",
    primaryMovement: "Signal transmission (all axes)",
    clinicalRelevance:
      "Inflammation of this nerve (vestibular neuritis) causes acute unilateral vestibular hypofunction.",
    color: NERVE_COLOR,
  },
};

export const CLINICAL_CONNECTIONS: ClinicalCondition[] = [
  {
    id: "bppv",
    name: "BPPV",
    summary: "Benign Paroxysmal Positional Vertigo",
    details:
      "Displaced otoconia (calcium carbonate crystals) from the utricle enter a semicircular canal - most often the posterior canal. Head position changes cause the otoconia to move (canalithiasis) or weigh down the cupula (cupulolithiasis), producing brief, intense vertigo with characteristic nystagmus, typically triggered by rolling over in bed or looking up.",
  },
  {
    id: "neuritis",
    name: "Vestibular Neuritis",
    summary: "Viral inflammation of the vestibular nerve",
    details:
      "Presumed viral inflammation of the vestibular portion of cranial nerve VIII causes sudden, severe, continuous vertigo lasting days, without hearing loss. Static asymmetry between the two labyrinths creates a spontaneous nystagmus even without head movement, because the brain interprets unequal baseline firing as rotation.",
  },
  {
    id: "uvh",
    name: "Unilateral Vestibular Hypofunction",
    summary: "Reduced function of one labyrinth",
    details:
      "A permanent or partial reduction in one ear's vestibular signal (from neuritis, surgery, or trauma) creates asymmetric push-pull firing. The head-impulse test detects this: a fast head thrust toward the weak side produces a corrective (catch-up) saccade because the VOR gain on that side is reduced.",
  },
  {
    id: "bvh",
    name: "Bilateral Vestibular Hypofunction",
    summary: "Reduced function of both labyrinths",
    details:
      "Loss of function in both inner ears (e.g., from ototoxic medications such as aminoglycosides) removes the push-pull signal entirely. Patients experience oscillopsia (bouncing vision) with head movement and imbalance that worsens in the dark, since the VOR can no longer stabilize gaze.",
  },
  {
    id: "oscillopsia",
    name: "Oscillopsia",
    summary: "Illusory bouncing or jumping of the visual world",
    details:
      "When the VOR fails to generate an eye movement that is equal and opposite to head movement, images slip across the retina during head motion. This produces the sensation that the visual world is bouncing, most noticeable while walking or with bilateral vestibular loss.",
  },
  {
    id: "migraine",
    name: "Vestibular Migraine",
    summary: "Migraine-associated episodic vertigo",
    details:
      "A common cause of recurrent vertigo, thought to involve abnormal processing of vestibular signals in migraine-sensitized brainstem and cortical pathways rather than a peripheral end-organ lesion. Episodes can last minutes to days and may or may not accompany headache.",
  },
  {
    id: "vor-dysfunction",
    name: "VOR Dysfunction",
    summary: "Impaired compensatory eye movements",
    details:
      "Any mismatch between sensed head rotation and generated eye rotation - from reduced canal input, central processing errors, or ocular motor disease - degrades gaze stability. Clinically quantified using VOR gain (eye velocity / head velocity), which should be close to 1.0.",
  },
];

export const EWALD_LAWS: EwaldLaw[] = [
  {
    id: 1,
    title: "Plane-Specific Eye Movements",
    description:
      "Eye movements evoked by stimulating a semicircular canal occur in the plane of that canal. Stimulating the horizontal canal produces horizontal eye movement; stimulating a vertical canal produces vertical/torsional eye movement.",
  },
  {
    id: 2,
    title: "Horizontal Canal: Ampullopetal > Ampullofugal",
    description:
      "For the horizontal canal, endolymph flow toward the ampulla (ampullopetal) produces a stronger response than flow away from the ampulla (ampullofugal). This is why turning the head toward the intact/stronger ear tends to give the larger signal.",
  },
  {
    id: 3,
    title: "Vertical Canals: Ampullofugal > Ampullopetal",
    description:
      "For the vertical canals (anterior and posterior), the response is opposite: endolymph flow away from the ampulla (ampullofugal) produces a stronger excitatory response than flow toward the ampulla (ampullopetal).",
  },
];

export const BPPV_CONDITION_INFO: Record<
  BppvCondition,
  { name: string; description: string }
> = {
  canalithiasis: {
    name: "Canalithiasis",
    description:
      "Free-floating otoconia move through the canal lumen under gravity, dragging endolymph and deflecting the cupula with a short delay. Vertigo and nystagmus are brief (usually < 60s) and fatigable.",
  },
  cupulolithiasis: {
    name: "Cupulolithiasis",
    description:
      "Otoconia adhere directly to the cupula, making it heavier than the surrounding endolymph and gravity-sensitive. Vertigo and nystagmus persist as long as the provoking head position is maintained.",
  },
};
