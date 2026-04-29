"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

interface Props {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  className?: string;
}

const PRESET_COLORS = [
  "#0A0A0A",
  "#F5F0E8",
  "#D4AF37",
  "#E8C76C",
  "#A88A2B",
  "#E8A5B8",
  "#0F7A5F",
  "#1C1C1C",
];

export function ColorSwatch({ label, value, onChange, className }: Props) {
  const id = useId();
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={id}
        className="label flex items-center justify-between"
      >
        <span>{label}</span>
        <span className="text-cream-muted normal-case tracking-normal font-mono text-[10px]">
          {value.toUpperCase()}
        </span>
      </label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            id={id}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="h-9 w-9 cursor-pointer rounded-full border border-cream/15 bg-transparent p-0
              [&::-webkit-color-swatch-wrapper]:p-0
              [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none"
            aria-label={`${label} color picker`}
          />
        </div>
        <div className="flex flex-1 flex-wrap gap-1.5">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              aria-label={`Set ${label} to ${c}`}
              className={cn(
                "h-5 w-5 rounded-full border transition-transform hover:scale-110",
                value.toUpperCase() === c
                  ? "border-gold ring-1 ring-gold ring-offset-1 ring-offset-bg"
                  : "border-cream/15"
              )}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
