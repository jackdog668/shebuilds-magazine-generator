"use client";

import * as Slider from "@radix-ui/react-slider";
import { Shuffle } from "lucide-react";
import {
  PATTERN_TYPES,
  PATTERN_LABELS,
  PATTERN_DESCRIPTIONS,
  type PatternState,
  type PatternType,
} from "@/lib/patterns/types";
import { ColorSwatch } from "./color-swatch";
import { cn } from "@/lib/cn";

interface Props {
  state: PatternState;
  onChange: (next: PatternState) => void;
  onRandom: () => void;
}

export function ControlPanel({ state, onChange, onRandom }: Props) {
  const set = <K extends keyof PatternState>(key: K, value: PatternState[K]) =>
    onChange({ ...state, [key]: value });

  return (
    <div className="space-y-8">
      {/* Pattern type — chip grid */}
      <Section label="Pattern">
        <div className="grid grid-cols-2 gap-1.5">
          {PATTERN_TYPES.map((t) => (
            <PatternChip
              key={t}
              type={t}
              active={state.type === t}
              onClick={() => set("type", t)}
            />
          ))}
        </div>
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-cream-muted">
          {PATTERN_DESCRIPTIONS[state.type]}
        </p>
      </Section>

      {/* Colors */}
      <Section label="Colors">
        <ColorSwatch
          label="Background"
          value={state.bg}
          onChange={(v) => set("bg", v)}
        />
        <ColorSwatch
          label="Primary"
          value={state.fg1}
          onChange={(v) => set("fg1", v)}
        />
        <ColorSwatch
          label="Accent"
          value={state.fg2}
          onChange={(v) => set("fg2", v)}
        />
      </Section>

      {/* Sliders */}
      <Section label="Composition">
        <SliderRow
          label="Scale"
          value={state.scale}
          min={0.5}
          max={2}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={(v) => set("scale", v)}
        />
        <SliderRow
          label="Density"
          value={state.density}
          min={0.3}
          max={1.5}
          step={0.05}
          format={(v) => v.toFixed(2)}
          onChange={(v) => set("density", v)}
        />
        <SliderRow
          label="Rotation"
          value={state.rotation}
          min={0}
          max={90}
          step={1}
          format={(v) => `${Math.round(v)}°`}
          onChange={(v) => set("rotation", v)}
        />
      </Section>

      {/* Randomize seed */}
      <button
        type="button"
        onClick={onRandom}
        className="group flex w-full items-center justify-between rounded-full border border-cream/15 px-5 py-3 text-sm transition-all hover:border-gold/60 hover:bg-gold/5"
      >
        <span className="font-mono uppercase tracking-[0.16em] text-[11px] text-cream-muted group-hover:text-cream">
          Surprise me
        </span>
        <Shuffle className="h-4 w-4 text-gold transition-transform group-hover:rotate-12" />
      </button>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="label mb-3">{label}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function PatternChip({
  type,
  active,
  onClick,
}: {
  type: PatternType;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-md border px-3 py-2.5 text-left text-sm transition-all",
        active
          ? "border-gold/60 bg-gold/10 text-cream shadow-gold-soft"
          : "border-cream/10 text-cream-muted hover:border-cream/30 hover:text-cream"
      )}
    >
      <div className="font-display text-base leading-tight">
        {PATTERN_LABELS[type]}
      </div>
    </button>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="label">{label}</span>
        <span className="font-mono text-[11px] text-cream">{format(value)}</span>
      </div>
      <Slider.Root
        className="relative flex h-5 w-full touch-none select-none items-center"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
        aria-label={label}
      >
        <Slider.Track className="relative h-[2px] grow rounded-full bg-cream/10">
          <Slider.Range className="absolute h-full rounded-full bg-gold" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-4 w-4 rounded-full border border-gold bg-bg shadow-gold-soft transition-shadow hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        />
      </Slider.Root>
    </div>
  );
}
