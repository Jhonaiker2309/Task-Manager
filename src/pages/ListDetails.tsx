import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLists } from "../contexts/ListContext";
import EditTaskModal from "../components/EditTaskModal";
import DeleteTaskModal from "../components/DeleteTaskModal";
import TaskItem from "../components/TaskItem";

const ListDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    getListBySlug,
    addTaskToList,
    toggleTaskInList,
    editTaskInList,
    deleteTaskFromList,
  } = useLists();
  const list = getListBySlug(slug || "");
  const [newTaskMessage, setNewTaskMessage] = useState("");

  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<{
    originalIndex: number;
    message: string;
  } | null>(null);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{
    originalIndex: number;
    message: string;
  } | null>(null);

  const [sortOrder, setSortOrder] = useState<"newToOld" | "oldToNew">(
    "newToOld"
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const sortedItems = useMemo(() => {
    if (!list) return [];
    const itemsCopy = [...list.items];
    return itemsCopy.sort((a, b) => {
      if (sortOrder === "newToOld") {
        return b.created_at.getTime() - a.created_at.getTime();
      } else {
        return a.created_at.getTime() - b.created_at.getTime();
      }
    });
  }, [list, sortOrder]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskMessage.trim()) {
      alert("El mensaje de la tarea no puede estar vacío.");
      return;
    }
    if (list) {
      addTaskToList(list.slug, newTaskMessage);
      setNewTaskMessage("");
    }
  };

  const handleToggleTask = (taskSortedIndex: number) => {
    if (list) {
      const originalItem = sortedItems[taskSortedIndex];
      if (!originalItem) return;
      const originalListIndex = list.items.findIndex(
        (item) =>
          item.created_at.getTime() === originalItem.created_at.getTime() &&
          item.message === originalItem.message
      );
      if (originalListIndex !== -1) {
        toggleTaskInList(list.slug, originalListIndex);
      }
    }
  };

  const handleOpenEditTaskModal = (taskSortedIndex: number) => {
    if (!list) return;
    const itemInSortedArray = sortedItems[taskSortedIndex];
    if (!itemInSortedArray) return;

    const originalListIndex = list.items.findIndex(
      (it) =>
        it.created_at.getTime() === itemInSortedArray.created_at.getTime() &&
        it.message === itemInSortedArray.message
    );

    if (originalListIndex !== -1) {
      setTaskToEdit({
        originalIndex: originalListIndex,
        message: itemInSortedArray.message,
      });
      setIsEditTaskModalOpen(true);
    }
  };

  const handleCloseEditTaskModal = () => {
    setIsEditTaskModalOpen(false);
    setTaskToEdit(null);
  };
  const handleSaveTask = (newMessage: string) => {
    if (list && taskToEdit !== null) {
      editTaskInList(list.slug, taskToEdit.originalIndex, newMessage);
    }
    handleCloseEditTaskModal();
  };

  const handleOpenDeleteTaskModal = (taskSortedIndex: number) => {
    if (!list) return;
    const itemInSortedArray = sortedItems[taskSortedIndex];
    if (!itemInSortedArray) return;

    const originalListIndex = list.items.findIndex(
      (it) =>
        it.created_at.getTime() === itemInSortedArray.created_at.getTime() &&
        it.message === itemInSortedArray.message
    );

    if (originalListIndex !== -1) {
      setTaskToDelete({
        originalIndex: originalListIndex,
        message: itemInSortedArray.message,
      });
      setIsDeleteTaskModalOpen(true);
    }
  };

  const handleCloseDeleteTaskModal = () => {
    setIsDeleteTaskModalOpen(false);
    setTaskToDelete(null);
  };

  const handleConfirmDeleteTask = () => {
    if (list && taskToDelete !== null) {
      deleteTaskFromList(list.slug, taskToDelete.originalIndex);
    }
    handleCloseDeleteTaskModal();
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [list?.items.length, sortOrder]);

  useEffect(() => {
    const newTotalPages = Math.ceil(sortedItems.length / itemsPerPage);
    if (newTotalPages > 0 && currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0 && sortedItems.length === 0) {
      setCurrentPage(1);
    }
  }, [sortedItems.length, itemsPerPage, currentPage]);

  if (!list) {
    return (
      <div className="p-4 sm:p-8 bg-slate-900 min-h-screen text-white text-center">
        <h2 className="text-2xl text-red-500 mb-4">Lista no encontrada</h2>
        <p className="text-slate-400 mb-6">
          La lista con el slug "{slug}" no pudo ser encontrada o no existe.
        </p>
        <Link
          to="/"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Volver a Mis Listas
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-slate-900 min-h-screen text-white">
      <header className="mb-6 pb-4 border-b border-slate-700">
        <Link
          to="/"
          className="text-purple-400 hover:text-purple-300 mb-3 inline-block text-sm"
        >
          &larr; Volver a Mis Listas
        </Link>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-purple-200 break-words">
            {list.title}
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Creada: {new Date(list.created_at).toLocaleDateString()} a las{" "}
          {new Date(list.created_at).toLocaleTimeString()}
        </p>
      </header>

      <form
        onSubmit={handleAddTask}
        className="mb-8 p-4 bg-slate-800 rounded-lg shadow-md"
      >
        <h3 className="text-lg font-semibold mb-3 text-slate-200">
          Añadir Nueva Tarea
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newTaskMessage}
            onChange={(e) => setNewTaskMessage(e.target.value)}
            placeholder="Ej: Comprar leche, revisar correos..."
            className="flex-grow px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
            required
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-5 rounded-md shadow-sm transition-colors"
          >
            Añadir Tarea
          </button>
        </div>
      </form>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-slate-200">Tareas</h3>
          {sortedItems.length > 1 && ( // Solo mostrar botones de orden si hay más de una tarea
            <div className="flex space-x-2">
              <button
                onClick={() => setSortOrder("newToOld")}
                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                  sortOrder === "newToOld"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                }`}
              >
                Más Recientes
              </button>
              <button
                onClick={() => setSortOrder("oldToNew")}
                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                  sortOrder === "oldToNew"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                }`}
              >
                Más Antiguas
              </button>
            </div>
          )}
        </div>
        {sortedItems.length === 0 ? (
          <p className="text-slate-400 mt-4">
            No hay tareas en esta lista. ¡Añade una para empezar!
          </p>
        ) : (
          <>
            <div className="overflow-y-auto max-h-96 scrollbar-hide">
              <ul className="space-y-3 mt-4">
                {currentItems.map((item, pageIndex) => {
                  const originalSortedIndex = indexOfFirstItem + pageIndex;
                  return (
                    <TaskItem
                      key={`${item.created_at.toISOString()}-${
                        item.message
                      }-${originalSortedIndex}`}
                      message={item.message}
                      done={item.done}
                      createdAt={item.created_at}
                      onToggle={() => handleToggleTask(originalSortedIndex)}
                      onEdit={() =>
                        handleOpenEditTaskModal(originalSortedIndex)
                      }
                      onDelete={() =>
                        handleOpenDeleteTaskModal(originalSortedIndex)
                      }
                    />
                  );
                })}
              </ul>
            </div>
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="text-slate-400">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </section>
      {taskToEdit && list && (
        <EditTaskModal
          isOpen={isEditTaskModalOpen}
          onClose={handleCloseEditTaskModal}
          currentMessage={taskToEdit.message}
          onSave={handleSaveTask}
        />
      )}

      {taskToDelete && list && (
        <DeleteTaskModal
          isOpen={isDeleteTaskModalOpen}
          onClose={handleCloseDeleteTaskModal}
          taskMessage={taskToDelete.message}
          onConfirm={handleConfirmDeleteTask}
        />
      )}
    </div>
  );
};

export default ListDetails;
