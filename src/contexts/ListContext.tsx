import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { ListContextType } from "../types";
import { usePersistedLists } from "../hooks/usePersistedLists";
import { useCRUDList } from "../hooks/useCRUDList";
import { useTaskHelpers } from "../hooks/useTaskHelpers";
import { useImportList } from "../hooks/useImportList";

const ListContext = createContext<ListContextType | undefined>(undefined);

export const ListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { lists, setLists, loading, fetchLists } = usePersistedLists();
  const { createList, updateListTitle, deleteList } = useCRUDList(lists, setLists);
  const {
    addTask: addTaskToList,
    editTask: editTaskInList,
    toggleTask: toggleTaskInList,
    deleteTask: deleteTaskFromList
  } = useTaskHelpers(lists, setLists);
  const importLists = useImportList(lists, setLists);

  const getListBySlug = (slug: string) =>
    lists.find((list) => list.slug === slug);

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
  if (!context) {
    throw new Error("useLists debe ser usado dentro de un ListProvider");
  }
  return context;
};