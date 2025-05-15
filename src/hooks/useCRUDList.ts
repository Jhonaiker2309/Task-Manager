import { generateSlug, saveListsToWebSQL } from "../utils";
import type { CheckList } from "../types";

/**
 * Custom hook providing CRUD operations for managing checklists.
 *
 * @param {CheckList[]} lists - The current array of checklists.
 * @param {React.Dispatch<React.SetStateAction<CheckList[]>>} setLists - State setter for checklists.
 * @returns {object} CRUD functions: createList, updateListTitle, deleteList.
 *
 * Features:
 * - createList: Adds a new checklist with a generated slug and current date.
 * - updateListTitle: Updates the title of a checklist by slug.
 * - deleteList: Removes a checklist by slug.
 * - All operations update both state and WebSQL storage.
 */
export function useCRUDList(
  lists: CheckList[],
  setLists: React.Dispatch<React.SetStateAction<CheckList[]>>
) {
  const createList = (title: string) => {
    const newList: CheckList = {
      slug: generateSlug(title),
      title: title.trim(),
      items: [],
      created_at: new Date(),
    };
    const updated = [newList, ...lists].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    setLists(updated);
    saveListsToWebSQL(updated);
  };

  const updateListTitle = (slug: string, newTitle: string) => {
    const updated = lists.map(l => (l.slug === slug ? { ...l, title: newTitle.trim() } : l));
    setLists(updated);
    saveListsToWebSQL(updated);
  };

  const deleteList = (slug: string) => {
    const updated = lists.filter(l => l.slug !== slug);
    setLists(updated);
    saveListsToWebSQL(updated);
  };

  return { createList, updateListTitle, deleteList };
}