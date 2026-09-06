import type { QuizQuestion } from "./types";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which semicircular canal is primarily responsible for detecting yaw rotation?",
    choices: ["Anterior canal", "Posterior canal", "Horizontal canal", "Cochlear duct"],
    correctIndex: 2,
    explanation:
      "The horizontal (lateral) semicircular canal lies roughly in the plane of yaw rotation and is maximally stimulated when the head turns left or right.",
  },
  {
    id: 2,
    question: "What happens to the right horizontal canal when the head turns left?",
    choices: [
      "It is excited (firing increases)",
      "It is inhibited (firing decreases)",
      "It stops firing completely",
      "It detects sound instead of rotation",
    ],
    correctIndex: 1,
    explanation:
      "During a leftward head turn, endolymph flow is ampullopetal in the left horizontal canal (excitation) and ampullofugal in the right horizontal canal (inhibition) - the push-pull system.",
  },
  {
    id: 3,
    question: "What structure is deflected by endolymph movement within the ampulla?",
    choices: ["The cochlea", "The cupula", "The utricle macula", "The tympanic membrane"],
    correctIndex: 1,
    explanation:
      "The cupula is a gelatinous dome spanning the ampulla. Relative endolymph flow pushes against it, bending the embedded hair cell stereocilia.",
  },
  {
    id: 4,
    question: "Where are the vestibular hair cells of the semicircular canals located?",
    choices: [
      "In the organ of Corti",
      "In the crista ampullaris within each ampulla",
      "In the semicircular canal walls only",
      "In the vestibular nerve itself",
    ],
    correctIndex: 1,
    explanation:
      "Hair cells sit on the crista ampullaris, a ridge of sensory epithelium inside each ampulla, with stereocilia projecting into the cupula.",
  },
  {
    id: 5,
    question: "What direction do the eyes move when the head turns left during a normal VOR?",
    choices: ["Left", "Right", "Upward", "The eyes stay fixed in the orbit"],
    correctIndex: 1,
    explanation:
      "The vestibulo-ocular reflex generates a compensatory eye movement opposite to head rotation - a leftward head turn drives the eyes rightward to keep gaze fixed on a target.",
  },
  {
    id: 6,
    question: "During angular acceleration, what happens to the endolymph relative to the bony labyrinth?",
    choices: [
      "It accelerates faster than the labyrinth",
      "It moves in perfect synchrony with the labyrinth",
      "It initially lags behind due to inertia",
      "It stops moving entirely",
    ],
    correctIndex: 2,
    explanation:
      "Because endolymph is a fluid with inertia, the bony canal moves with the head first while the endolymph briefly lags, creating relative flow that deflects the cupula.",
  },
  {
    id: 7,
    question: "What is the approximate baseline (resting) firing rate used in this simplified model?",
    choices: ["0 spikes/sec", "45 spikes/sec", "90 spikes/sec", "300 spikes/sec"],
    correctIndex: 2,
    explanation:
      "This app uses a simplified baseline of about 90 spikes/sec for vestibular afferents at rest, which increases with excitation and decreases with inhibition.",
  },
  {
    id: 8,
    question: "Which type of BPPV is most common?",
    choices: [
      "Anterior canal BPPV",
      "Posterior canal BPPV",
      "Horizontal canal BPPV",
      "Cochlear canal BPPV",
    ],
    correctIndex: 1,
    explanation:
      "Posterior canal BPPV accounts for the large majority of BPPV cases, which is why the Dix-Hallpike maneuver targets this canal.",
  },
  {
    id: 9,
    question: "In canalithiasis, where are the otoconia located?",
    choices: [
      "Attached to the cupula",
      "Free-floating within the canal lumen",
      "Inside the cochlea",
      "Attached to the vestibular nerve",
    ],
    correctIndex: 1,
    explanation:
      "In canalithiasis, otoconia are free-floating debris within the endolymph of the canal, moving under gravity and producing transient, fatigable symptoms.",
  },
  {
    id: 10,
    question: "In cupulolithiasis, what happens to the otoconia?",
    choices: [
      "They dissolve immediately",
      "They remain attached to the cupula, making it gravity-sensitive",
      "They travel to the opposite ear",
      "They enter the cochlea and affect hearing",
    ],
    correctIndex: 1,
    explanation:
      "In cupulolithiasis, otoconia adhere to the cupula itself, so it no longer has the same density as endolymph and becomes persistently gravity-sensitive, causing longer-lasting nystagmus.",
  },
  {
    id: 11,
    question: "According to Ewald's first law, eye movements evoked by a semicircular canal occur:",
    choices: [
      "Randomly, unrelated to canal orientation",
      "In the plane of the stimulated canal",
      "Only in the horizontal plane",
      "Only during sleep",
    ],
    correctIndex: 1,
    explanation:
      "Ewald's first law states that stimulation of a canal produces eye movement in that canal's own plane of orientation.",
  },
  {
    id: 12,
    question: "For the horizontal canal, which endolymph flow direction produces the stronger response?",
    choices: [
      "Ampullofugal (away from the ampulla)",
      "Ampullopetal (toward the ampulla)",
      "Both directions are equal",
      "Neither direction produces a response",
    ],
    correctIndex: 1,
    explanation:
      "Ewald's second law: in the horizontal canal, ampullopetal flow (toward the ampulla) produces a larger excitatory response than ampullofugal flow.",
  },
  {
    id: 13,
    question: "For the vertical canals (anterior/posterior), which flow direction produces the stronger response?",
    choices: [
      "Ampullopetal (toward the ampulla)",
      "Ampullofugal (away from the ampulla)",
      "Both directions are equal",
      "Neither direction produces a response",
    ],
    correctIndex: 1,
    explanation:
      "Ewald's third law: for the vertical canals, ampullofugal flow (away from the ampulla) produces the stronger excitatory response - the opposite of the horizontal canal.",
  },
  {
    id: 14,
    question: "Which maneuver is used to diagnose posterior canal BPPV?",
    choices: ["Epley maneuver", "Dix-Hallpike test", "Romberg test", "Weber test"],
    correctIndex: 1,
    explanation:
      "The Dix-Hallpike test positions the head to move otoconia through the posterior canal, provoking characteristic vertigo and upbeating-torsional nystagmus.",
  },
  {
    id: 15,
    question: "What is oscillopsia?",
    choices: [
      "A hearing loss pattern",
      "The illusory bouncing or jumping of the visual world during head movement",
      "A type of otoconia crystal",
      "A surgical repair technique",
    ],
    correctIndex: 1,
    explanation:
      "Oscillopsia occurs when the VOR fails to fully compensate for head motion, so images slip on the retina and the world appears to bounce, common in bilateral vestibular loss.",
  },
  {
    id: 16,
    question: "In vestibular neuritis, what typically happens to hearing?",
    choices: [
      "Complete hearing loss in the affected ear",
      "Hearing is unaffected because the cochlea is spared",
      "Hearing improves temporarily",
      "Hearing loss occurs only at night",
    ],
    correctIndex: 1,
    explanation:
      "Vestibular neuritis selectively affects the vestibular nerve fibers, sparing the cochlear division and hearing, which distinguishes it from labyrinthitis.",
  },
  {
    id: 17,
    question: "What does a positive head-impulse test toward the weak side indicate?",
    choices: [
      "Normal vestibular function bilaterally",
      "Reduced VOR gain on that side, revealed by a corrective saccade",
      "A cochlear disorder",
      "Excess otoconia in the cochlea",
    ],
    correctIndex: 1,
    explanation:
      "A corrective (catch-up) saccade after a fast head thrust indicates the VOR could not fully compensate on that side, suggesting unilateral vestibular hypofunction.",
  },
  {
    id: 18,
    question: "Which structure connects all three semicircular canals?",
    choices: ["The cochlea", "The vestibule", "The tympanic membrane", "The stapes"],
    correctIndex: 1,
    explanation:
      "The vestibule is the central chamber of the bony labyrinth that all three semicircular canals open into, and it also houses the utricle and saccule.",
  },
];
