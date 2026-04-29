/**
 * Pattern tile renderers.
 *
 * Each function returns the inner SVG markup for ONE tile.
 * The engine wraps this in <pattern>...</pattern> and tiles it across the viewport.
 *
 * All tiles are 200×200 in their own coordinate space; the `scale` parameter
 * multiplies the tile size at the <pattern> level (preserves seamlessness).
 */

import type { PatternState } from "./types";
import { mulberry32 } from "./random";

export const BASE_TILE = 200;

// ──────────────────────────────────────────────────────────────────
// 1. DAMASK — baroque ornamental motif, 4-fold symmetric
// ──────────────────────────────────────────────────────────────────
function damask(s: PatternState): string {
  const cx = BASE_TILE / 2;
  const cy = BASE_TILE / 2;
  // Stylized fleur motif: a diamond with curved fronds
  const motif = `
    <g fill="${s.fg1}" opacity="0.95">
      <path d="M ${cx} ${cy - 50}
               C ${cx + 18} ${cy - 36}, ${cx + 30} ${cy - 18}, ${cx + 36} ${cy}
               C ${cx + 30} ${cy + 18}, ${cx + 18} ${cy + 36}, ${cx} ${cy + 50}
               C ${cx - 18} ${cy + 36}, ${cx - 30} ${cy + 18}, ${cx - 36} ${cy}
               C ${cx - 30} ${cy - 18}, ${cx - 18} ${cy - 36}, ${cx} ${cy - 50}
               Z" />
      <circle cx="${cx}" cy="${cy}" r="6" fill="${s.fg2}" />
    </g>
    <g fill="${s.fg1}" opacity="0.6">
      <circle cx="${cx}" cy="${cy - 70}" r="4" />
      <circle cx="${cx}" cy="${cy + 70}" r="4" />
      <circle cx="${cx - 70}" cy="${cy}" r="4" />
      <circle cx="${cx + 70}" cy="${cy}" r="4" />
    </g>
  `;
  // Corner mini-motifs for half-drop coverage
  const corners = [
    [0, 0],
    [BASE_TILE, 0],
    [0, BASE_TILE],
    [BASE_TILE, BASE_TILE],
  ]
    .map(
      ([x, y]) => `
      <g transform="translate(${x} ${y})">
        <circle r="3" fill="${s.fg1}" opacity="0.7" />
        <circle r="8" stroke="${s.fg1}" stroke-width="0.8" fill="none" opacity="0.5" />
      </g>
    `
    )
    .join("");
  return motif + corners;
}

// ──────────────────────────────────────────────────────────────────
// 2. TESSELLATION — hexagonal honeycomb
// ──────────────────────────────────────────────────────────────────
function tessellation(s: PatternState): string {
  // Hexagon math: pointy-top hexagons tile in a half-offset grid.
  // For a clean tile, use an even number of cols and offset rows.
  const r = 24 / s.density; // hex radius
  const w = Math.sqrt(3) * r;
  const h = 2 * r;
  const horiz = w;
  const vert = (3 / 4) * h;

  const hexPath = (cx: number, cy: number, fill: string) => {
    const pts = [0, 1, 2, 3, 4, 5]
      .map((i) => {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      })
      .join(" ");
    return `<polygon points="${pts}" fill="${fill}" stroke="${s.fg2}" stroke-width="1" />`;
  };

  let out = "";
  // Cover tile with extra row/col so edges seam
  for (let row = -1; row <= Math.ceil(BASE_TILE / vert) + 1; row++) {
    for (let col = -1; col <= Math.ceil(BASE_TILE / horiz) + 1; col++) {
      const cx = col * horiz + (row % 2 === 0 ? 0 : horiz / 2);
      const cy = row * vert;
      const fill = (row + col) % 2 === 0 ? s.fg1 : s.fg2;
      out += hexPath(cx, cy, fill);
    }
  }
  return out;
}

// ──────────────────────────────────────────────────────────────────
// 3. POLKA — classic half-drop dots
// ──────────────────────────────────────────────────────────────────
function polka(s: PatternState): string {
  const r = 14 * s.density;
  // 5 dots: 4 corners + center → seamless half-drop
  const positions = [
    [0, 0],
    [BASE_TILE, 0],
    [0, BASE_TILE],
    [BASE_TILE, BASE_TILE],
    [BASE_TILE / 2, BASE_TILE / 2],
  ];
  return positions
    .map(
      ([x, y], i) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="${i === 4 ? s.fg2 : s.fg1}" />`
    )
    .join("");
}

// ──────────────────────────────────────────────────────────────────
// 4. STRIPES — alternating bands; rotation gives diagonals
// ──────────────────────────────────────────────────────────────────
function stripes(s: PatternState): string {
  // Density controls band ratio: low = thin fg1 / thick fg2, high = balanced
  const ratio = Math.max(0.2, Math.min(0.8, 0.5 * s.density));
  const fg1Width = BASE_TILE * ratio;
  return `
    <rect x="0" y="0" width="${fg1Width}" height="${BASE_TILE}" fill="${s.fg1}" />
    <rect x="${fg1Width}" y="0" width="${BASE_TILE - fg1Width}" height="${BASE_TILE}" fill="${s.fg2}" />
  `;
}

// ──────────────────────────────────────────────────────────────────
// 5. FLORAL — stylized petal motif with rotational symmetry
// ──────────────────────────────────────────────────────────────────
function floral(s: PatternState): string {
  const cx = BASE_TILE / 2;
  const cy = BASE_TILE / 2;
  const petals = Math.max(4, Math.min(8, Math.round(6 * s.density)));
  const petalLen = 38;
  const petalWid = 14;
  let out = `<circle cx="${cx}" cy="${cy}" r="6" fill="${s.fg2}" />`;
  for (let i = 0; i < petals; i++) {
    const angle = (360 / petals) * i;
    out += `
      <ellipse cx="${cx}" cy="${cy - 22}" rx="${petalWid}" ry="${petalLen / 2}"
        fill="${s.fg1}" opacity="0.85"
        transform="rotate(${angle} ${cx} ${cy})" />
    `;
  }
  // Corner accents (half-drop)
  const corner = (x: number, y: number) =>
    `<circle cx="${x}" cy="${y}" r="3" fill="${s.fg1}" opacity="0.6" />`;
  out += corner(0, 0) + corner(BASE_TILE, 0) + corner(0, BASE_TILE) + corner(BASE_TILE, BASE_TILE);
  return out;
}

// ──────────────────────────────────────────────────────────────────
// 6. BOHO — diamond + tribal mark accents
// ──────────────────────────────────────────────────────────────────
function boho(s: PatternState): string {
  const cx = BASE_TILE / 2;
  const cy = BASE_TILE / 2;
  const d = 60 * s.density;
  // Diamond outline
  const diamond = (size: number, fill: string, stroke: string, sw: number) =>
    `<polygon points="${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}"
      fill="${fill}" stroke="${stroke}" stroke-width="${sw}" />`;
  let out = "";
  out += diamond(d, "none", s.fg1, 2);
  out += diamond(d * 0.6, s.fg1, "none", 0);
  out += diamond(d * 0.25, s.fg2, "none", 0);
  // Plus marks at corners
  const plus = (x: number, y: number) => `
    <line x1="${x - 6}" y1="${y}" x2="${x + 6}" y2="${y}" stroke="${s.fg1}" stroke-width="1.5" />
    <line x1="${x}" y1="${y - 6}" x2="${x}" y2="${y + 6}" stroke="${s.fg1}" stroke-width="1.5" />
  `;
  out +=
    plus(0, 0) +
    plus(BASE_TILE, 0) +
    plus(0, BASE_TILE) +
    plus(BASE_TILE, BASE_TILE) +
    plus(BASE_TILE / 2, 0) +
    plus(0, BASE_TILE / 2) +
    plus(BASE_TILE, BASE_TILE / 2) +
    plus(BASE_TILE / 2, BASE_TILE);
  return out;
}

// ──────────────────────────────────────────────────────────────────
// 7. ART DECO — quarter-circle fans + linear flair
// ──────────────────────────────────────────────────────────────────
function artDeco(s: PatternState): string {
  const cx = BASE_TILE / 2;
  const cy = BASE_TILE / 2;
  const lineCount = Math.max(3, Math.min(10, Math.round(6 * s.density)));
  let out = "";
  // Sunburst at center
  for (let i = 0; i < lineCount; i++) {
    const a = (Math.PI / lineCount) * i;
    const x2 = cx + Math.cos(a) * 60;
    const y2 = cy + Math.sin(a) * 60;
    const x1 = cx - Math.cos(a) * 60;
    const y1 = cy - Math.sin(a) * 60;
    out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${s.fg1}" stroke-width="1.2" />`;
  }
  // Center disc
  out += `<circle cx="${cx}" cy="${cy}" r="6" fill="${s.fg2}" />`;
  // Corner fan quarters
  const fan = (x: number, y: number, dx: number, dy: number) => {
    const arc = `M ${x} ${y} L ${x + dx * 30} ${y} A 30 30 0 0 ${dx * dy > 0 ? 1 : 0} ${x} ${y + dy * 30} Z`;
    return `<path d="${arc}" fill="${s.fg1}" opacity="0.8" />`;
  };
  out +=
    fan(0, 0, 1, 1) +
    fan(BASE_TILE, 0, -1, 1) +
    fan(0, BASE_TILE, 1, -1) +
    fan(BASE_TILE, BASE_TILE, -1, -1);
  return out;
}

// ──────────────────────────────────────────────────────────────────
// 8. CONFETTI — pseudo-random scattered shapes (deterministic by seed)
// ──────────────────────────────────────────────────────────────────
function confetti(s: PatternState): string {
  const rng = mulberry32(s.seed);
  const count = Math.max(8, Math.min(30, Math.round(18 * s.density)));
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = rng() * BASE_TILE;
    const y = rng() * BASE_TILE;
    const size = 4 + rng() * 8;
    const rot = rng() * 360;
    const color = rng() < 0.5 ? s.fg1 : s.fg2;
    const shape = Math.floor(rng() * 3);
    if (shape === 0) {
      out += `<circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity="0.85" />`;
    } else if (shape === 1) {
      out += `<rect x="${x - size}" y="${y - size}" width="${size * 2}" height="${size * 2}"
        fill="${color}" opacity="0.85" transform="rotate(${rot} ${x} ${y})" />`;
    } else {
      const pts = [0, 1, 2]
        .map((k) => {
          const a = (Math.PI * 2 * k) / 3 - Math.PI / 2;
          return `${x + size * Math.cos(a)},${y + size * Math.sin(a)}`;
        })
        .join(" ");
      out += `<polygon points="${pts}" fill="${color}" opacity="0.85" transform="rotate(${rot} ${x} ${y})" />`;
    }
  }
  return out;
}

// ──────────────────────────────────────────────────────────────────
// Dispatcher
// ──────────────────────────────────────────────────────────────────
export function renderTile(state: PatternState): string {
  switch (state.type) {
    case "damask":
      return damask(state);
    case "tessellation":
      return tessellation(state);
    case "polka":
      return polka(state);
    case "stripes":
      return stripes(state);
    case "floral":
      return floral(state);
    case "boho":
      return boho(state);
    case "art-deco":
      return artDeco(state);
    case "confetti":
      return confetti(state);
  }
}
