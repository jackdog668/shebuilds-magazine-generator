/**
 * URL state encoding. Patterns are shareable via querystring.
 * Example: /?t=damask&bg=0A0A0A&f1=D4AF37&f2=F5F0E8&s=100&d=100&r=0&x=1234
 */
import type { PatternState, PatternType } from "./types";
import { DEFAULT_STATE, PATTERN_TYPES } from "./types";

const isHex = (v: string) => /^[0-9A-F]{6}$/i.test(v);

export function encodeState(state: PatternState): string {
  const params = new URLSearchParams({
    t: state.type,
    bg: state.bg.replace("#", ""),
    f1: state.fg1.replace("#", ""),
    f2: state.fg2.replace("#", ""),
    s: Math.round(state.scale * 100).toString(),
    d: Math.round(state.density * 100).toString(),
    r: Math.round(state.rotation).toString(),
    x: state.seed.toString(),
  });
  return params.toString();
}

export function decodeState(qs: string | URLSearchParams): PatternState {
  const params = typeof qs === "string" ? new URLSearchParams(qs) : qs;
  const type = params.get("t") as PatternType | null;
  const bg = params.get("bg");
  const f1 = params.get("f1");
  const f2 = params.get("f2");
  const s = params.get("s");
  const d = params.get("d");
  const r = params.get("r");
  const x = params.get("x");

  return {
    type: type && PATTERN_TYPES.includes(type) ? type : DEFAULT_STATE.type,
    bg: bg && isHex(bg) ? `#${bg.toUpperCase()}` : DEFAULT_STATE.bg,
    fg1: f1 && isHex(f1) ? `#${f1.toUpperCase()}` : DEFAULT_STATE.fg1,
    fg2: f2 && isHex(f2) ? `#${f2.toUpperCase()}` : DEFAULT_STATE.fg2,
    scale: s ? Math.max(0.5, Math.min(2, Number(s) / 100)) : DEFAULT_STATE.scale,
    density: d ? Math.max(0.3, Math.min(1.5, Number(d) / 100)) : DEFAULT_STATE.density,
    rotation: r ? Math.max(0, Math.min(90, Number(r))) : DEFAULT_STATE.rotation,
    seed: x ? Math.max(0, Math.min(9999, Number(x) | 0)) : DEFAULT_STATE.seed,
  };
}
