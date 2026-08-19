export type KarmaConceptTone = "shadow" | "light";

export type KarmaConcept = {
  id: string;
  label: string;
  tone: KarmaConceptTone;
  description: string;
  position: "top-left" | "mid-left" | "bottom-left" | "top-right" | "mid-right" | "bottom-right";
};

export const karmaConcepts: KarmaConcept[] = [
  {
    id: "pain",
    label: "Pain",
    tone: "shadow",
    description: "Every hardship carries a lesson waiting to be understood.",
    position: "top-left",
  },
  {
    id: "mistakes",
    label: "Mistakes",
    tone: "shadow",
    description: "Errors are not endings—they are turning points in our journey.",
    position: "mid-left",
  },
  {
    id: "suffering",
    label: "Suffering",
    tone: "shadow",
    description: "When we resist less and reflect more, suffering becomes wisdom.",
    position: "bottom-left",
  },
  {
    id: "good-deeds",
    label: "Good Deeds",
    tone: "light",
    description: "Small acts of virtue ripple outward through countless lives.",
    position: "top-right",
  },
  {
    id: "kindness",
    label: "Kindness",
    tone: "light",
    description: "Compassion softens karma and opens the path to liberation.",
    position: "mid-right",
  },
  {
    id: "positivity",
    label: "Positivity",
    tone: "light",
    description: "A steady mind transforms obstacles into opportunities for growth.",
    position: "bottom-right",
  },
];
