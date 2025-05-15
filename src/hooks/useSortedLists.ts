/**
 * Custom hook to return a sorted array of checklists based on creation date.
 *
 * @param {CheckList[]} lists - The array of checklists to sort.
 * @param {"newToOld" | "oldToNew"} sortOrder - Sort order: "newToOld" for newest first, "oldToNew" for oldest first.
 * @returns {CheckList[]} The sorted array of checklists.
 *
 * Uses useMemo for efficient memoization.
 */
import { useMemo } from "react";
import type { CheckList } from "../types";

export function useSortedLists(
  lists: CheckList[],
  sortOrder: "newToOld" | "oldToNew"
): CheckList[] {
  return useMemo(() => {
    const copy = [...lists];
    return copy.sort((a, b) =>
      sortOrder === "newToOld"
        ? b.created_at.getTime() - a.created_at.getTime()
        : a.created_at.getTime() - b.created_at.getTime()
    );
  }, [lists, sortOrder]);
}