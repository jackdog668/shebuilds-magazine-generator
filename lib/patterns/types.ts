export const PATTERN_TYPES = [
  "damask",
  "tessellation",
  "polka",
  "stripes",
  "floral",
  "boho",
  "art-deco",
  "confetti",
] as const;

export type PatternType = (typeof PATTERN_TYPES)[number];

export interface PatternState {
  type: PatternType;
  bg: string;
  fg1: string;
  fg2: string;
  scale: number;       // 0.5 - 2.0 (motif size multiplier)
  density: number;     // 0.3 - 1.5 (pattern-specific)
  rotation: number;    // 0 - 90 (degrees)
  seed: number;        // 0 - 9999 (for deterministic randomness)
}

export const PATTERN_LABELS: Record<PatternType, string> = {
  damask: "Damask",
  tessellation: "Tessellation",
  polka: "Polka",
  stripes: "Stripes",
  floral: "Floral",
  boho: "Boho",
  "art-deco": "Art Deco",
  confetti: "Confetti",
};

export const PATTERN_DESCRIPTIONS: Record<PatternType, string> = {
  damask: "Baroque ornamental, four-fold symmetry.",
  tessellation: "Hexagonal honeycomb tiling.",
  polka: "Classic dots on a half-drop grid.",
  stripes: "Bold parallel bands. Adjustable angle.",
  floral: "Stylized petal motifs in soft repeat.",
  boho: "Diamond-and-tribal accent shapes.",
  "art-deco": "Sunburst fans and Gatsby lines.",
  confetti: "Scattered shapes. Pseudo-random, deterministic.",
};

export const DEFAULT_STATE: PatternState = {
  type: "damask",
  bg: "#F5F0E8",
  fg1: "#D4AF37",
  fg2: "#0A0A0A",
  scale: 1,
  density: 1,
  rotation: 0,
  seed: 1234,
};
