/**
 * Custom hook for managing persisted checklists using both WebSQL and localStorage.
 *
 * Features:
 * - Loads checklists from WebSQL if available, otherwise falls back to localStorage.
 * - Persists checklist changes to both WebSQL and localStorage.
 * - Handles date parsing and sorting for lists and their items.
 * - Provides loading state and a manual fetchLists function to reload data.
 *
 * @returns {object} An object containing:
 *   - lists: The current array of checklists.
 *   - setLists: State setter for checklists (persists changes).
 *   - loading: Boolean indicating if lists are being loaded.
 *   - fetchLists: Function to manually reload lists from storage.
 */
import { useState, useCallback, useEffect } from "react";
import type { CheckList, Item } from "../types";
import { loadListsFromWebSQL, saveListsToWebSQL } from "../utils";

const LS_KEY = "checkLists";

export function usePersistedLists(): {
  lists: CheckList[];
  setLists: React.Dispatch<React.SetStateAction<CheckList[]>>;
  loading: boolean;
  fetchLists: () => void;
} {
  const [lists, setListsState] = useState<CheckList[]>([]);
  const [loading, setLoading] = useState(true);

  // Persist lists to both localStorage and WebSQL
  const persist = (current: CheckList[]) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(current));
      saveListsToWebSQL(current);
    } catch {
      console.error("Error guardando listas persistidas");
    }
  };

  // Custom setLists that persists changes
  const setLists: React.Dispatch<React.SetStateAction<CheckList[]>> = (value) => {
    setListsState((prev) => {
      const next = typeof value === "function" ? (value as any)(prev) : value;
      persist(next);
      return next;
    });
  };

  // Loads lists from WebSQL or localStorage, parses dates, and sorts
  const load = useCallback(async () => {
    setLoading(true);
    try {
      let stored = await loadListsFromWebSQL();
      if (!stored) {
        const ls = localStorage.getItem(LS_KEY);
        stored = ls ? JSON.parse(ls) : [];
      }
      const parsed = (stored as any[]).map((l) => ({
        ...l,
        created_at: new Date(l.created_at),
        items: (l.items as Item[])
          .map((i) => ({ ...i, created_at: new Date(i.created_at) }))
          .sort((a, b) =>
            a.done === b.done
              ? a.created_at.getTime() - b.created_at.getTime()
              : a.done
              ? 1
              : -1
          ),
      }));
      setListsState(parsed.sort((a, b) => b.created_at.getTime() - a.created_at.getTime()));
    } catch (err) {
      console.error("Error cargando listas:", err);
      setListsState([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Expose a manual fetchLists function
  const fetchLists = () => load();

  return { lists, setLists, loading, fetchLists };
}