/**
 * Custom hook to return a sorted array of tasks with their original indices.
 *
 * @param {Item[]} items - The array of task items to sort.
 * @param {"newToOld" | "oldToNew"} sortOrder - Sort order: "newToOld" for newest first, "oldToNew" for oldest first.
 * @returns {Array<Item & { origIdx: number }>} The sorted array of tasks, each with its original index.
 *
 * Uses useMemo for efficient memoization.
 * The original index is preserved for referencing the task in the source array.
 */
import { useMemo } from "react";
import type { Item } from "../types";

export function useSortedTasks(
  items: Item[],
  sortOrder: "newToOld" | "oldToNew"
): Array<Item & { origIdx: number }> {
  return useMemo(() => {
    const withIdx = items.map((it, idx) => ({ ...it, origIdx: idx }));
    return withIdx.sort((a, b) =>
      sortOrder === "newToOld"
        ? b.created_at.getTime() - a.created_at.getTime()
        : a.created_at.getTime() - b.created_at.getTime()
    );
  }, [items, sortOrder]);
}