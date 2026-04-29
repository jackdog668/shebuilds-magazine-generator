"use client";

import { Bookmark, BookmarkPlus, X } from "lucide-react";
import { isSameState, useFavorites, type SavedFavorite } from "@/lib/patterns/favorites";
import type { PatternState } from "@/lib/patterns/types";
import { cn } from "@/lib/cn";

interface Props {
  current: PatternState;
  onSelect: (state: PatternState) => void;
}

export function FavoritesRail({ current, onSelect }: Props) {
  const { favorites, hydrated, save, remove } = useFavorites();

  const handleSave = () => save(current);

  // Avoid SSR/hydration mismatch — render skeleton until client storage read
  if (!hydrated) {
    return (
      <div className="flex items-center gap-3">
        <h3 className="label">Yours</h3>
        <span className="font-mono text-[10px] text-cream-muted/60">…</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="label">Yours</h3>
        <button
          type="button"
          onClick={handleSave}
          className="group flex items-center gap-1.5 rounded-full border border-cream/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cream-muted transition-all hover:border-gold/60 hover:text-cream"
        >
          <BookmarkPlus className="h-3 w-3 text-gold transition-transform group-hover:scale-110" />
          Save current
        </button>
      </div>

      {favorites.length === 0 ? (
        <p className="font-mono text-[11px] leading-relaxed text-cream-muted/60">
          Nothing saved yet. Tweak a pattern you like, then hit{" "}
          <span className="text-cream">Save current</span>.
        </p>
      ) : (
        <div className="-mx-6 overflow-x-auto px-6 pb-2 lg:mx-0 lg:px-0">
          <div className="flex gap-2 lg:flex-wrap">
            {favorites.map((fav) => (
              <FavoriteChip
                key={fav.id}
                fav={fav}
                active={isSameState(current, fav.state)}
                onSelect={() => onSelect(fav.state)}
                onRemove={() => remove(fav.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FavoriteChip({
  fav,
  active,
  onSelect,
  onRemove,
}: {
  fav: SavedFavorite;
  active: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={cn(
        "group inline-flex flex-shrink-0 items-center gap-2 rounded-full border pl-3.5 pr-1 py-1.5 text-xs transition-all",
        active
          ? "border-gold/60 bg-gold/10 text-cream"
          : "border-cream/10 text-cream-muted hover:border-cream/30 hover:text-cream",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex items-center gap-2"
        aria-pressed={active}
      >
        <Swatch state={fav.state} />
        <span className="font-display tracking-tight">{fav.name}</span>
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Delete ${fav.name}`}
        className="ml-1 rounded-full p-1 text-cream-muted/60 transition-colors hover:bg-cream/5 hover:text-rose-300"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

function Swatch({ state }: { state: PatternState }) {
  return (
    <span
      className="flex h-3.5 w-3.5 overflow-hidden rounded-full ring-1 ring-cream/10"
      aria-hidden
    >
      <span className="h-full w-1/3" style={{ background: state.bg }} />
      <span className="h-full w-1/3" style={{ background: state.fg1 }} />
      <span className="h-full w-1/3" style={{ background: state.fg2 }} />
    </span>
  );
}

