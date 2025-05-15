import type { CheckList, Item } from "../types";
import { saveListsToWebSQL } from "../utils"
export function useTaskHelpers(
  lists: CheckList[],
  setLists: React.Dispatch<React.SetStateAction<CheckList[]>>
) {
  const addTask = (listSlug: string, message: string) => {
    const task: Item = { message: message.trim(), done: false, created_at: new Date() };
    const updated = lists.map(l =>
      l.slug === listSlug
        ? {
            ...l,
            items: [task, ...l.items].sort((a, b) =>
              a.done === b.done ? a.created_at.getTime() - b.created_at.getTime() : a.done ? 1 : -1
            ),
          }
        : l
    );
    setLists(updated);
    saveListsToWebSQL(updated);
  };

  const editTask = (listSlug: string, index: number, newMessage: string) => {
    const updated = lists.map(l => {
      if (l.slug !== listSlug) return l;
      const items = l.items.map((it, i) => (i === index ? { ...it, message: newMessage.trim() } : it));
      return { ...l, items };
    });
    setLists(updated);
    saveListsToWebSQL(updated);
  };

  const toggleTask = (listSlug: string, index: number) => {
    const updated = lists.map(l => {
      if (l.slug !== listSlug) return l;
      const items = l.items.map((it, i) => (i === index ? { ...it, done: !it.done } : it));
      items.sort((a, b) =>
        a.done === b.done ? a.created_at.getTime() - b.created_at.getTime() : a.done ? 1 : -1
      );
      return { ...l, items };
    });
    setLists(updated);
    saveListsToWebSQL(updated);
  };

  const deleteTask = (listSlug: string, index: number) => {
    const updated = lists.map(l =>
      l.slug === listSlug ? { ...l, items: l.items.filter((_, i) => i !== index) } : l
    );
    setLists(updated);
    saveListsToWebSQL(updated);
  };

  return { addTask, editTask, toggleTask, deleteTask };
}