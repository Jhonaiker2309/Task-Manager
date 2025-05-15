/**
 * Custom hook for importing a single checklist from a JSON file.
 *
 * Features:
 * - Reads and parses a JSON file to import a checklist.
 * - Validates the JSON structure (expects { title, items }).
 * - Ensures no duplicate tasks within the imported list.
 * - Prevents importing a list with a slug that already exists.
 * - Notifies the user of success or specific errors using toast notifications.
 * - Updates the checklist state and persists to localStorage.
 *
 * @param {CheckList[]} lists - The current array of checklists.
 * @param {React.Dispatch<React.SetStateAction<CheckList[]>>} setLists - State setter for checklists.
 * @returns {function} importList - Function to call with a File to import.
 */
import type { CheckList, Item } from "../types";
import { generateSlug } from "../utils";
import notify from "../utils/notify";

export function useImportList(
  lists: CheckList[],
  setLists: React.Dispatch<React.SetStateAction<CheckList[]>>
) {
  const importList = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string);
        if (!raw || typeof raw !== "object" || Array.isArray(raw) || !("title" in raw) || !("items" in raw)) {
          notify("error", "Formato JSON inválido: se esperaba { title, items }");
          return;
        }
        const lst: any = raw;
        const parsedItems: Item[] = Array.isArray(lst.items)
          ? lst.items.map((it: any) => ({
              message: it.message.trim(),
              done: Boolean(it.done),
              created_at: it.created_at ? new Date(it.created_at) : new Date(),
            }))
          : [];
        if (new Set(parsedItems.map(i => i.message)).size !== parsedItems.length) {
          notify("error", "La lista importada contiene tareas repetidas.");
          return;
        }
        const newSlug = generateSlug(lst.title);
        if (lists.some(l => l.slug === newSlug)) {
          notify("error", `La lista '${lst.title}' ya existe.`);
          return;
        }
        const newList: CheckList = {
          slug: newSlug,
          title: lst.title.trim(),
          created_at: lst.created_at ? new Date(lst.created_at) : new Date(),
          items: parsedItems,
        };
        const updated = [newList, ...lists].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
        setLists(updated);
        localStorage.setItem("checkLists", JSON.stringify(updated));
        notify("success", `Lista '${newList.title}' importada.`);
      } catch {
        notify("error", "Error parseando JSON.");
      }
    };
    reader.readAsText(file);
  };

  return importList;
}