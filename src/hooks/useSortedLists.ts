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