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

function saveListsToWebSQL(lists: CheckList[]) {
  const db = openDB();
  if (!db) return;
  db.transaction((tx: SQLTransaction) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS lists (id unique, data TEXT)",
      [],
      undefined,
      undefined
    );
    tx.executeSql("DELETE FROM lists", [], undefined, undefined);
    tx.executeSql(
      "INSERT INTO lists (id, data) VALUES (?, ?)",
      [1, JSON.stringify(lists)],
      undefined,
      undefined
    );
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
      // Intenta cargar desde WebSQL primero
      let storedLists: CheckList[] | null = await loadListsFromWebSQL();
      if (!storedLists) {
        // Si no hay datos en WebSQL, usa localStorage
        const ls = localStorage.getItem(LS_KEY);
        storedLists = ls ? JSON.parse(ls) : [];
      }
      if (storedLists) {
        const parsedLists: CheckList[] = storedLists.map((list: any) => ({
          ...list,
          created_at: new Date(list.created_at),
          items: list.items.map((item: any) => ({
            ...item,
            created_at: new Date(item.created_at)
          })).sort((a: Item, b: Item) => {
            if (a.done === b.done) {
              return a.created_at.getTime() - b.created_at.getTime();
            }
            return a.done ? 1 : -1;
          })
        }));
        setLists(parsedLists.sort((a, b) => b.created_at.getTime() - a.created_at.getTime()));
      } else {
        setLists([]);
      }
    } catch (error) {
      console.error("Error cargando listas:", error);
      setLists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListsFromLocalStorage();
  }, [loadListsFromLocalStorage]);

  const fetchLists = useCallback(() => {
    loadListsFromLocalStorage();
  }, [loadListsFromLocalStorage]);

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

  const addTaskToList = (listSlug: string, taskMessage: string) => {
    const newTask: Item = {
      message: taskMessage.trim(),
      done: false,
      created_at: new Date(),
    };
    const updatedLists = lists.map((list) => {
      if (list.slug === listSlug) {
        const updatedItems = [newTask, ...list.items].sort((a, b) => {
          if (a.done === b.done) {
            return a.created_at.getTime() - b.created_at.getTime();
          }
          return a.done ? 1 : -1;
        });
        return { ...list, items: updatedItems };
      }
      return list;
    });
    setLists(updatedLists);
    saveListsToLocalStorage(updatedLists);
  };

  const editTaskInList = (
    listSlug: string,
    taskIndex: number,
    newMessage: string
  ) => {
    const updatedLists = lists.map((list) => {
      if (list.slug === listSlug) {
        const updatedItems = list.items.map((item, index) =>
          index === taskIndex ? { ...item, message: newMessage.trim() } : item
        );
        return { ...list, items: updatedItems };
      }
      return list;
    });
    setLists(updatedLists);
    saveListsToLocalStorage(updatedLists);
  };

  const toggleTaskInList = (listSlug: string, taskIndex: number) => {
    const updatedLists = lists.map((list) => {
      if (list.slug === listSlug) {
        if (taskIndex < 0 || taskIndex >= list.items.length) {
          console.warn(
            `Índice de tarea ${taskIndex} fuera de rango para la lista ${listSlug}`
          );
          return list;
        }
        const updatedItems = list.items.map((item, index) =>
          index === taskIndex ? { ...item, done: !item.done } : item
        );

        updatedItems.sort((a, b) => {
          if (a.done === b.done) {
            return a.created_at.getTime() - b.created_at.getTime();
          }
          return a.done ? 1 : -1;
        });
        return { ...list, items: updatedItems };
      }
      return list;
    });
    setLists(updatedLists);
    saveListsToLocalStorage(updatedLists);
  };

  const deleteTaskFromList = (listSlug: string, taskIndex: number) => {
    const updatedLists = lists.map((list) => {
      if (list.slug === listSlug) {
        const updatedItems = list.items.filter(
          (_, index) => index !== taskIndex
        );
        return { ...list, items: updatedItems };
      }
      return list;
    });
    setLists(updatedLists);
    saveListsToLocalStorage(updatedLists);
  };

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
