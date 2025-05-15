import { generateSlug, saveListsToWebSQL } from "../utils";
import type { CheckList } from "../types";

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