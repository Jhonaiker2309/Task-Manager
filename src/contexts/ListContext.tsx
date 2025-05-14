import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { CheckList, Item, ListContextType } from '../types';
import { generateSlug } from '../utils';

const LS_KEY = 'checkLists';

const ListContext = createContext<ListContextType | undefined>(undefined);

export const ListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<CheckList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const saveListsToLocalStorage = (currentLists: CheckList[]) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(currentLists));
    } catch (error) {
      console.error("Error guardando listas en localStorage:", error);
    }
  };

  const loadListsFromLocalStorage = useCallback(() => {
    setLoading(true);
    try {
      const storedLists = localStorage.getItem(LS_KEY);
      if (storedLists) {
        const parsedLists: CheckList[] = JSON.parse(storedLists).map((list: any) => ({
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
      console.error("Error cargando listas desde localStorage:", error);
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
    const newSlug = generateSlug(title) + '-' + Date.now();
    const newList: CheckList = {
      slug: newSlug,
      title: title.trim(),
      items: [],
      created_at: new Date(),
    };
    const updatedLists = [newList, ...lists].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    setLists(updatedLists);
    saveListsToLocalStorage(updatedLists);
  };

  const updateListTitle = (slug: string, newTitle: string) => {
    const updatedLists = lists.map(list =>
      list.slug === slug ? { ...list, title: newTitle.trim() } : list
    );
    setLists(updatedLists);
    saveListsToLocalStorage(updatedLists);
  };

  const deleteList = (slug: string) => {
    const updatedLists = lists.filter(list => list.slug !== slug);
    setLists(updatedLists);
    saveListsToLocalStorage(updatedLists);
  };

  const getListBySlug = (slug: string): CheckList | undefined => {
    return lists.find(list => list.slug === slug);
  };

  const addTaskToList = (listSlug: string, taskMessage: string) => {
    const newTask: Item = {
      message: taskMessage.trim(),
      done: false,
      created_at: new Date()
    };
    const updatedLists = lists.map(list => {
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

  const toggleTaskInList = (listSlug: string, taskIndex: number) => {
     const updatedLists = lists.map(list => {
      if (list.slug === listSlug) {
        if (taskIndex < 0 || taskIndex >= list.items.length) {
            console.warn(`Índice de tarea ${taskIndex} fuera de rango para la lista ${listSlug}`);
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

  return (
    <ListContext.Provider value={{
      lists,
      loading,
      fetchLists,
      createList,
      updateListTitle,
      deleteList,
      getListBySlug,
      addTaskToList,
      toggleTaskInList
    }}>
      {children}
    </ListContext.Provider>
  );
};

export const useLists = (): ListContextType => {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error('useLists debe ser usado dentro de un ListProvider');
  }
  return context;
};