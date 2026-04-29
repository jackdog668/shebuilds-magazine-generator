"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { buildSVG } from "@/lib/patterns/engine";
import type { PatternState } from "@/lib/patterns/types";
import { cn } from "@/lib/cn";

interface Props {
  state: PatternState;
}

type ZoomLevel = "tile" | "page" | "mural";

const ZOOM_CONFIG: Record<
  ZoomLevel,
  { label: string; aspect: string; svg: { width: number; height: number } }
> = {
  // Single tile — useful for inspecting the repeat unit
  tile: { label: "Tile", aspect: "aspect-square", svg: { width: 400, height: 400 } },
  // KDP page mockup — what your final 8.5×11 will look like
  page: { label: "Page", aspect: "aspect-[8.5/11]", svg: { width: 800, height: 1040 } },
  // Wide repeat — see how the pattern reads from across a room
  mural: { label: "Mural", aspect: "aspect-[16/9]", svg: { width: 1600, height: 900 } },
};

/**
 * Live SVG preview. Same buildSVG used for exports — preview is exactly
 * what you ship.
 */
export function PatternPreview({ state }: Props) {
  const [zoom, setZoom] = useState<ZoomLevel>("page");
  const cfg = ZOOM_CONFIG[zoom];

  const svg = useMemo(
    () => buildSVG(state, cfg.svg),
    [state, cfg.svg],
  );

  return (
    <div>
      <div className="mb-4 flex justify-center">
        <ZoomToggle value={zoom} onChange={setZoom} />
      </div>

      <motion.div
        key={`${state.type}-${state.bg}-${state.fg1}-${state.fg2}-${zoom}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative w-full overflow-hidden rounded-md shadow-elevated ring-1 ring-cream/10",
          cfg.aspect,
        )}
        aria-label={`Live preview: ${state.type} pattern at ${cfg.label.toLowerCase()} zoom`}
      >
        <CornerBrackets />
        <div
          className="h-full w-full"
          // SVG is built from typed state and brand-controlled hex/enum values —
          // no user-supplied HTML, safe to inject.
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </motion.div>
    </div>
  );
}

function ZoomToggle({
  value,
  onChange,
}: {
  value: ZoomLevel;
  onChange: (v: ZoomLevel) => void;
}) {
  const levels: ZoomLevel[] = ["tile", "page", "mural"];
  return (
    <div
      role="tablist"
      aria-label="Preview zoom"
      className="inline-flex rounded-full border border-cream/10 bg-surface/40 p-1"
    >
      {levels.map((lvl) => {
        const active = value === lvl;
        return (
          <button
            key={lvl}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(lvl)}
            className={cn(
              "rounded-full px-4 py-1 font-mono text-[11px] uppercase tracking-[0.16em] transition-all",
              active
                ? "bg-gold/15 text-cream shadow-gold-soft"
                : "text-cream-muted hover:text-cream",
            )}
          >
            {ZOOM_CONFIG[lvl].label}
          </button>
        );
      })}
    </div>
  );
}

function CornerBrackets() {
  const arm = "absolute h-4 w-4 border-gold pointer-events-none z-10";
  return (
    <>
      <span className={`${arm} top-2 left-2 border-t border-l`} />
      <span className={`${arm} top-2 right-2 border-t border-r`} />
      <span className={`${arm} bottom-2 left-2 border-b border-l`} />
      <span className={`${arm} bottom-2 right-2 border-b border-r`} />
    </>
  );
}
