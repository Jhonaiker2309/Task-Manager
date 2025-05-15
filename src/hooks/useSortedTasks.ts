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