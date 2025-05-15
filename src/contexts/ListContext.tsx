import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { CheckList, Item, ListContextType } from "../types";
import { generateSlug } from "../utils";
import notify from "../utils/notify";

const LS_KEY = "checkLists";
const DB_NAME = "CheckLists";
const DB_VERSION = "1.0";
const DB_DISPLAY = "CheckLists DB";
const DB_SIZE = 2 * 1024 * 1024;

const ListContext = createContext<ListContextType | undefined>(undefined);

const openDB = (): Database | null => {
  if (window.openDatabase) {
    return window.openDatabase(DB_NAME, DB_VERSION, DB_DISPLAY, DB_SIZE);
  }
  return null;
};

const initDB = () => {
  const db = openDB();
  if (!db) return;
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS lists (
         slug       TEXT NOT NULL,
         title      TEXT NOT NULL,
         created_at INTEGER,
         PRIMARY KEY (slug, title)
       )`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tasks (
         list_slug  TEXT NOT NULL,
         message    TEXT NOT NULL,
         done       INTEGER,
         created_at INTEGER,
         PRIMARY KEY (list_slug, message)
       )`
    );
    tx.executeSql(
      "CREATE INDEX IF NOT EXISTS idx_tasks_list_slug ON tasks(list_slug)"
    );
  });
};

initDB();

function saveListsToWebSQL(lists: CheckList[]) {
  const db = openDB();
  if (!db) return;
  db.transaction((tx: SQLTransaction) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS lists (id unique, data TEXT)",
      []
    );
    tx.executeSql("DELETE FROM lists", []);
    tx.executeSql("INSERT INTO lists (id, data) VALUES (?, ?)", [
      1,
      JSON.stringify(lists),
    ]);
  });
}

function loadListsFromWebSQL(): Promise<CheckList[] | null> {
  return new Promise((resolve) => {
    const db = openDB();
    if (!db) return resolve(null);
    db.transaction((tx: SQLTransaction) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS lists (id unique, data TEXT)",
        [],
        undefined,
        () => resolve(null)
      );
      tx.executeSql(
        "SELECT data FROM lists WHERE id = 1",
        [],
        (_tx: SQLTransaction, results: SQLResultSet) => {
          if (results.rows.length > 0) {
            try {
              const data = JSON.parse(results.rows.item(0).data);
              resolve(data);
            } catch {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        },
        () => resolve(null)
      );
    });
  });
}

export const ListProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lists, setLists] = useState<CheckList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const saveListsToLocalStorage = (currentLists: CheckList[]) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(currentLists));
    } catch (error) {
      console.error("Error guardando listas en localStorage:", error);
    }

    saveListsToWebSQL(currentLists);
  };

  const loadListsFromLocalStorage = useCallback(async () => {
    setLoading(true);
    try {
      let stored: CheckList[] | null = await loadListsFromWebSQL();
      if (!stored) {
        const ls = localStorage.getItem(LS_KEY);
        stored = ls ? JSON.parse(ls) : [];
      }
      if (stored) {
        const parsed: CheckList[] = stored.map((list: any) => ({
          ...list,
          created_at: new Date(list.created_at),
          items: list.items
            .map((item: any) => ({
              ...item,
              created_at: new Date(item.created_at),
            }))
            .sort((a: Item, b: Item) => {
              if (a.done === b.done) {
                return a.created_at.getTime() - b.created_at.getTime();
              }
              return a.done ? 1 : -1;
            }),
        }));
        setLists(
          parsed.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
        );
      } else {
        setLists([]);
      }
    } catch (err) {
      console.error("Error cargando listas:", err);
      setLists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const importLists = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string);
        if (
          !raw ||
          Array.isArray(raw) ||
          typeof raw !== "object" ||
          !("title" in raw) ||
          !("items" in raw)
        ) {
          notify(
            "error",
            "Formato JSON inválido: se esperaba un objeto lista con { title, items }"
          );
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
        const messages = parsedItems.map((it) => it.message);
        if (new Set(messages).size !== messages.length) {
          notify("error", "La lista importada contiene tareas repetidas.");
          return;
        }
        const newSlug = generateSlug(lst.title);
        if (lists.some((l) => l.slug === newSlug)) {
          notify("error", `La lista con slug '${newSlug}' ya existe.`);
          return;
        }
        const newList: CheckList = {
          slug: newSlug,
          title: lst.title.trim(),
          created_at: lst.created_at ? new Date(lst.created_at) : new Date(),
          items: parsedItems,
        };
        const updatedLists = [newList, ...lists].sort(
          (a, b) => b.created_at.getTime() - a.created_at.getTime()
        );
        setLists(updatedLists);
        saveListsToLocalStorage(updatedLists);
        notify("success", `Lista '${newList.title}' importada correctamente.`);
      } catch (err) {
        notify("error", "Error parseando JSON.");
      }
    };
    reader.readAsText(file);
  };

  const createList = (title: string) => {
    const newSlug = generateSlug(title);
    const newList: CheckList = {
      slug: newSlug,
      title: title.trim(),
      items: [],
      created_at: new Date(),
    };
    const updatedLists = [newList, ...lists].sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime()
    );
    setLists(updatedLists);
    saveListsToLocalStorage(updatedLists);
  };

  const updateListTitle = (slug: string, newTitle: string) => {
    const updatedLists = lists.map((list) =>
      list.slug === slug ? { ...list, title: newTitle.trim() } : list
    );
    setLists(updatedLists);
    saveListsToLocalStorage(updatedLists);
  };

  const deleteList = (slug: string) => {
    const updatedLists = lists.filter((list) => list.slug !== slug);
    setLists(updatedLists);
    saveListsToLocalStorage(updatedLists);
  };

  const getListBySlug = (slug: string): CheckList | undefined => {
    return lists.find((list) => list.slug === slug);
  };

  const addTaskToList = (listSlug: string, message: string) => {
    const task: Item = {
      message: message.trim(),
      done: false,
      created_at: new Date(),
    };
    const updated = lists.map((l) =>
      l.slug === listSlug
        ? {
            ...l,
            items: [task, ...l.items].sort((a, b) => {
              if (a.done === b.done) {
                return a.created_at.getTime() - b.created_at.getTime();
              }
              return a.done ? 1 : -1;
            }),
          }
        : l
    );
    setLists(updated);
    saveListsToLocalStorage(updated);
  };

  const editTaskInList = (
    listSlug: string,
    taskIndex: number,
    newMessage: string
  ) => {
    const updated = lists.map((l) => {
      if (l.slug !== listSlug) return l;
      const items = l.items.map((it, i) =>
        i === taskIndex ? { ...it, message: newMessage.trim() } : it
      );
      return { ...l, items };
    });
    setLists(updated);
    saveListsToLocalStorage(updated);
  };

  const toggleTaskInList = (listSlug: string, taskIndex: number) => {
    const updated = lists.map((l) => {
      if (l.slug !== listSlug) return l;
      const items = l.items.map((it, i) =>
        i === taskIndex ? { ...it, done: !it.done } : it
      );
      items.sort((a, b) => {
        if (a.done === b.done) {
          return a.created_at.getTime() - b.created_at.getTime();
        }
        return a.done ? 1 : -1;
      });
      return { ...l, items };
    });
    setLists(updated);
    saveListsToLocalStorage(updated);
  };

  const deleteTaskFromList = (listSlug: string, taskIndex: number) => {
    const updated = lists.map((l) =>
      l.slug === listSlug
        ? { ...l, items: l.items.filter((_, i) => i !== taskIndex) }
        : l
    );
    setLists(updated);
    saveListsToLocalStorage(updated);
  };

  const fetchLists = useCallback(() => {
    loadListsFromLocalStorage();
  }, [loadListsFromLocalStorage]);

  useEffect(() => {
    loadListsFromLocalStorage();
  }, [loadListsFromLocalStorage]);

  return (
    <ListContext.Provider
      value={{
        lists,
        loading,
        fetchLists,
        createList,
        updateListTitle,
        deleteList,
        getListBySlug,
        addTaskToList,
        toggleTaskInList,
        editTaskInList,
        deleteTaskFromList,
        importLists,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};

export const useLists = (): ListContextType => {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error("useLists debe ser usado dentro de un ListProvider");
  }
  return context;
};
