"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/header";
import { ControlPanel } from "@/components/control-panel";
import { PatternPreview } from "@/components/pattern-preview";
import { PresetRail } from "@/components/preset-rail";
import { FavoritesRail } from "@/components/favorites-rail";
import { ExportBar } from "@/components/export-bar";
import { DEFAULT_STATE, type PatternState } from "@/lib/patterns/types";
import { decodeState, encodeState } from "@/lib/patterns/url-state";
import { brand } from "@/lib/brand";

export default function Page() {
  const [state, setState] = useState<PatternState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.toString()) setState(decodeState(params));
    setHydrated(true);
  }, []);

  // Sync state → URL (debounced via rAF)
  useEffect(() => {
    if (!hydrated) return;
    let raf = 0;
    raf = requestAnimationFrame(() => {
      const qs = encodeState(state);
      const next = `${window.location.pathname}?${qs}`;
      if (window.location.search !== `?${qs}`) {
        window.history.replaceState({}, "", next);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [state, hydrated]);

  const handleRandom = useCallback(() => {
    setState((prev) => ({
      ...prev,
      seed: Math.floor(Math.random() * 9999),
      // also re-roll some visual params for variety
      density: 0.4 + Math.random() * 1.0,
      rotation: prev.type === "stripes" ? Math.floor(Math.random() * 91) : prev.rotation,
    }));
  }, []);

  return (
    <>
      <Header />

      <section className="mx-auto max-w-[1600px] px-6 pt-10 pb-6 lg:px-10">
        <p className="label mb-3">Toolkit · 01</p>
        <h1 className="font-display text-display-lg leading-[0.95] tracking-tight">
          <span className="text-foil">Patterns</span> that tile{" "}
          <em className="font-display font-light italic text-cream-muted">forever</em>.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream-muted">
          {brand.subTagline} Eight motifs, your colors, KDP-ready exports.
          No login, no watermark, no limits.
        </p>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 pb-16 lg:px-10">
        <div className="mb-6">
          <PresetRail current={state} onSelect={setState} />
        </div>

        <div className="mb-6">
          <FavoritesRail current={state} onSelect={setState} />
        </div>

        <div className="gold-rule mb-8" />

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Controls — left rail */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="rounded-lg border border-cream/[0.06] bg-surface/40 p-6 backdrop-blur-sm lg:sticky lg:top-6">
              <ControlPanel state={state} onChange={setState} onRandom={handleRandom} />
            </div>
          </aside>

          {/* Preview + exports — main */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="paper rounded-lg border border-cream/[0.06] p-6 lg:p-10">
              <div className="mx-auto max-w-2xl">
                <PatternPreview state={state} />
              </div>

              <div className="gold-rule mt-10 mb-6" />

              <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <p className="label mb-1">Export</p>
                  <p className="text-sm text-cream-muted">
                    KDP PDF is 8.5 × 11 in @ 300 dpi · PNG is 2400 px square · SVG is vector.
                  </p>
                </div>
                <ExportBar state={state} />
              </div>
            </div>

            <p className="mt-6 text-center font-mono text-[11px] tracking-wider text-cream-muted/60">
              Made by SheBuilds Digital · Free, forever ·{" "}
              <a
                href={brand.links.school}
                target="_blank"
                rel="noreferrer"
                className="text-gold hover:text-gold-light"
              >
                See the school
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
