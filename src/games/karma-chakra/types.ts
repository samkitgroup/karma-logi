export type Lang = "en" | "hi" | "gu";

export type GameMode = "start" | "play" | "over";

export type BondFx = "veil" | "pulse" | "shift" | "echo" | "bars" | "glow";

export type KarmaEntry = {
  g: 0 | 1;
  glyph: string;
  n: Record<Lang, string[]>;
  s: Record<Lang, string>;
  f: Record<Lang, string>;
};

export type WordEntry = [string, number, BondFx];

export type Bond = {
  text: string;
  prakritiId: string;
  k: number;
  fx: BondFx;
  x: number;
  y: number;
  t: number;
  speed: number;
  y0toC: number;
  ret?: boolean;
  warned?: number;
};

export type Layout = {
  r: number;
  cx: number;
  cy: number;
  pw: number;
  out: number;
  into: number;
  top: number;
  spawnY: number;
  jiva: number;
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
  life: number;
  c: string;
};

export type Mote = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  p: number;
  sp: number;
  o: number;
};

export type Star = {
  x: number;
  y: number;
  a: number;
  s: number;
  tw: number;
};

export type GameState = {
  mode: GameMode;
  lang: Lang;
  round: number;
  total: number;
  score: number;
  streak: number;
  best: number;
  hits: number;
  tries: number;
  met: Set<number>;
  bond: Bond | null;
  drag: boolean;
  target: number;
  feedbackWrong: number;
  feedbackCorrect: number;
  feedbackUntil: number;
  grading: boolean;
  endsAt: number;
  muted: boolean;
  shake: number;
  pulse: number;
  reduced: boolean;
};

export type HudState = {
  score: number;
  lives: number;
  streak: number;
  progress: number;
  toast: string;
  toastBad: boolean;
  coach: string;
  showStreak: boolean;
};

export type LearnState = {
  open: boolean;
  tag: string;
  tagClass: "g" | "a";
  name: string;
  native: string;
  simile: string;
  fn: string;
  nextLabel: string;
  timerProgress: number;
};

export type ResultState = {
  verdict: string;
  score: number;
  accuracy: string;
  bestStreak: number;
  metCount: string;
  mastery: Array<{ name: string; met: boolean; glyph: string; ghati: boolean }>;
};
