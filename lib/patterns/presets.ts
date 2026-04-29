import type { PatternState } from "./types";

/**
 * Curated brand presets. Names match SheBuilds editorial-luxe voice.
 * Each preset is a complete state — apply with one click.
 */
export interface Preset {
  id: string;
  name: string;
  state: PatternState;
}

export const PRESETS: Preset[] = [
  {
    id: "couture",
    name: "Couture",
    state: {
      type: "damask",
      bg: "#0A0A0A",
      fg1: "#D4AF37",
      fg2: "#F5F0E8",
      scale: 1,
      density: 1,
      rotation: 0,
      seed: 1234,
    },
  },
  {
    id: "powder-room",
    name: "Powder Room",
    state: {
      type: "polka",
      bg: "#F5F0E8",
      fg1: "#E8A5B8",
      fg2: "#D4AF37",
      scale: 0.9,
      density: 0.8,
      rotation: 0,
      seed: 1234,
    },
  },
  {
    id: "studio-floor",
    name: "Studio Floor",
    state: {
      type: "tessellation",
      bg: "#F5F0E8",
      fg1: "#0A0A0A",
      fg2: "#D4AF37",
      scale: 1,
      density: 1,
      rotation: 0,
      seed: 1234,
    },
  },
  {
    id: "garden-party",
    name: "Garden Party",
    state: {
      type: "floral",
      bg: "#F5F0E8",
      fg1: "#0F7A5F",
      fg2: "#E8A5B8",
      scale: 1,
      density: 1.1,
      rotation: 0,
      seed: 1234,
    },
  },
  {
    id: "bazaar",
    name: "Bazaar",
    state: {
      type: "boho",
      bg: "#0A0A0A",
      fg1: "#E8C76C",
      fg2: "#E8A5B8",
      scale: 1,
      density: 1,
      rotation: 0,
      seed: 1234,
    },
  },
  {
    id: "gatsby",
    name: "Gatsby",
    state: {
      type: "art-deco",
      bg: "#0A0A0A",
      fg1: "#D4AF37",
      fg2: "#F5F0E8",
      scale: 1,
      density: 1.2,
      rotation: 0,
      seed: 1234,
    },
  },
  {
    id: "regatta",
    name: "Regatta",
    state: {
      type: "stripes",
      bg: "#F5F0E8",
      fg1: "#0F7A5F",
      fg2: "#F5F0E8",
      scale: 1.4,
      density: 0.6,
      rotation: 0,
      seed: 1234,
    },
  },
  {
    id: "release-party",
    name: "Release Party",
    state: {
      type: "confetti",
      bg: "#F5F0E8",
      fg1: "#D4AF37",
      fg2: "#E8A5B8",
      scale: 1,
      density: 1.2,
      rotation: 0,
      seed: 4242,
    },
  },
];
