/**
 * Pattern engine — wraps tile content in a complete <svg> document.
 *
 * The same buildSVG output is used for:
 *   - live preview (innerHTML on a div)
 *   - SVG export (download as .svg)
 *   - PNG export (rasterize via canvas)
 *   - PDF export (PNG → embed in pdf-lib)
 *
 * Single source of truth = no rendering drift between preview and export.
 */

import type { PatternState } from "./types";
import { renderTile, BASE_TILE } from "./renderers";

export interface SVGOptions {
  /** SVG viewport width (px) */
  width: number;
  /** SVG viewport height (px) */
  height: number;
}

export function buildSVG(state: PatternState, opts: SVGOptions): string {
  const tileSize = BASE_TILE * state.scale;
  const inner = renderTile(state);
  const transform = state.rotation
    ? ` patternTransform="rotate(${state.rotation})"`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${opts.width}" height="${opts.height}" viewBox="0 0 ${opts.width} ${opts.height}">
  <defs>
    <pattern id="shebuilds-pattern" width="${tileSize}" height="${tileSize}" patternUnits="userSpaceOnUse"${transform}>
      <rect width="${tileSize}" height="${tileSize}" fill="${state.bg}" />
      <g transform="scale(${state.scale})">
        ${inner}
      </g>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#shebuilds-pattern)" />
</svg>`;
}
