/**
 * Custom hook providing helper functions for managing tasks within a checklist.
 *
 * Features:
 * - Adds, edits, toggles, and deletes tasks in a checklist.
 * - Persists changes to both state and WebSQL storage.
 * - Maintains task order: incomplete tasks first, then completed, both sorted by creation date.
 *
 * @param {CheckList[]} lists - The current array of checklists.
 * @param {React.Dispatch<React.SetStateAction<CheckList[]>>} setLists - State setter for checklists.
 * @returns {object} Task helper functions: addTask, editTask, toggleTask, deleteTask.
 *
 * Functions:
 * - addTask(listSlug, message): Adds a new task to the specified checklist.
 * - editTask(listSlug, index, newMessage): Edits the message of a task at the given index.
 * - toggleTask(listSlug, index): Toggles the completion state of a task at the given index.
 * - deleteTask(listSlug, index): Removes a task at the given index from the checklist.
 */
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