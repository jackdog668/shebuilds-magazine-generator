/**
 * User-saved favorites — persisted to localStorage.
 *
 * Distinct from the curated PRESETS in `presets.ts`:
 *   - PRESETS are brand-authored, ship with the app, immutable
 *   - FAVORITES are user-authored, written client-side, fully mutable
 *
 * Schema is versioned via the storage key. If we ever add fields to
 * SavedFavorite, bump the version and write a migration — never silently
 * change the v1 shape.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { PATTERN_LABELS, type PatternState } from "./types";

export interface SavedFavorite {
  id: string;
  name: string;
  state: PatternState;
  savedAt: number;
}

const STORAGE_KEY = "shebuilds-pattern-favorites:v1";
const MAX_FAVORITES = 24;

/** Read favorites from localStorage. Returns [] on any failure. */
function readFavorites(): SavedFavorite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedFavorite[]) : [];
  } catch {
    return [];
  }
}

/** Write favorites to localStorage. Swallows quota errors. */
function writeFavorites(favs: SavedFavorite[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  } catch (err) {
    console.warn("[favorites] localStorage write failed", err);
  }
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `fav_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function isSameState(a: PatternState, b: PatternState): boolean {
  return (
    a.type === b.type &&
    a.bg === b.bg &&
    a.fg1 === b.fg1 &&
    a.fg2 === b.fg2 &&
    a.scale === b.scale &&
    a.density === b.density &&
    a.rotation === b.rotation &&
    a.seed === b.seed
  );
}

/**
 * Policy: auto-name from pattern + date, skip exact duplicates silently,
 * cap via FIFO eviction (handled by the hook's .slice(0, MAX_FAVORITES)).
 */
export function createFavoriteFromState(
  state: PatternState,
  existing: SavedFavorite[],
  proposedName?: string,
): SavedFavorite | null {
  if (existing.some((f) => isSameState(f.state, state))) return null;
  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const name = proposedName?.trim() || `${PATTERN_LABELS[state.type]} · ${date}`;
  return { id: "", name, state, savedAt: 0 };
}

export interface UseFavoritesResult {
  favorites: SavedFavorite[];
  hydrated: boolean;
  save: (state: PatternState, proposedName?: string) => SavedFavorite | null;
  remove: (id: string) => void;
  clear: () => void;
}

/**
 * SSR-safe hook. On server / first paint we return [] + hydrated=false,
 * then hydrate from localStorage in an effect. The `hydrated` flag lets
 * the UI suppress save buttons until storage is readable, preventing
 * a flash of "Save" that would no-op on a not-yet-hydrated state.
 *
 * Cross-tab sync via the `storage` event — open the app in two tabs,
 * save in one, see it in the other. Cheap UX win.
 */
export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<SavedFavorite[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(readFavorites());
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFavorites(readFavorites());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback(
    (state: PatternState, proposedName?: string) => {
      const fav = createFavoriteFromState(state, favorites, proposedName);
      if (!fav) return null;
      // Stamp id + savedAt here so the save fn can stay focused on
      // policy (name, dedupe, cap) and not bookkeeping.
      const stamped: SavedFavorite = {
        ...fav,
        id: fav.id || generateId(),
        savedAt: fav.savedAt || Date.now(),
      };
      const next = [stamped, ...favorites].slice(0, MAX_FAVORITES);
      setFavorites(next);
      writeFavorites(next);
      return stamped;
    },
    [favorites],
  );

  const remove = useCallback(
    (id: string) => {
      const next = favorites.filter((f) => f.id !== id);
      setFavorites(next);
      writeFavorites(next);
    },
    [favorites],
  );

  const clear = useCallback(() => {
    setFavorites([]);
    writeFavorites([]);
  }, []);

  return { favorites, hydrated, save, remove, clear };
}
