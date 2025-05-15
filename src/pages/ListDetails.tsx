import React, { useState, useMemo } from "react";
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
    index: number;
    message: string;
  } | null>(null);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{
    index: number;
    message: string;
  } | null>(null);

  const [sortOrder, setSortOrder] = useState<"newToOld" | "oldToNew">(
    "newToOld"
  );

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

  const handleToggleTask = (taskIndex: number) => {
    if (list) {
      const originalItem = sortedItems[taskIndex];
      const originalIndex = list.items.findIndex(
        (item) =>
          item.created_at === originalItem.created_at &&
          item.message === originalItem.message
      );
      if (originalIndex !== -1) {
        toggleTaskInList(list.slug, originalIndex);
      }
    }
  };

  const handleOpenEditTaskModal = (index: number, message: string) => {
    setTaskToEdit({ index, message });
    setIsEditTaskModalOpen(true);
  };
  const handleCloseEditTaskModal = () => {
    setIsEditTaskModalOpen(false);
    setTaskToEdit(null);
  };
  const handleSaveTask = (newMessage: string) => {
    if (list && taskToEdit !== null) {
      editTaskInList(list.slug, taskToEdit.index, newMessage);
    }
    handleCloseEditTaskModal();
  };

  const handleOpenDeleteTaskModal = (index: number, message: string) => {
    setTaskToDelete({ index, message });
    setIsDeleteTaskModalOpen(true);
  };
  const handleCloseDeleteTaskModal = () => {
    setIsDeleteTaskModalOpen(false);
    setTaskToDelete(null);
  };
  const handleConfirmDeleteTask = () => {
    if (list && taskToDelete !== null) {
      deleteTaskFromList(list.slug, taskToDelete.index);
    }
    handleCloseDeleteTaskModal();
  };

  const sortedItems = useMemo(() => {
    if (!list) return [];
    const itemsCopy = [...list.items]; // Crear una copia para no mutar el estado original
    return itemsCopy.sort((a, b) => {
      if (sortOrder === "newToOld") {
        return b.created_at.getTime() - a.created_at.getTime();
      } else {
        return a.created_at.getTime() - b.created_at.getTime();
      }
    });
  }, [list, sortOrder]);

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
        <h3 className="text-lg font-semibold mb-3 text-slate-200">Tareas</h3>
        <button
          onClick={() => setSortOrder("newToOld")}
          className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors mr-2 ${
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
        {sortedItems.length === 0 ? (
          <p className="text-slate-400">
            No hay tareas en esta lista. ¡Añade una para empezar!
          </p>
        ) : (
          <ul className="space-y-3 mt-4">
            {sortedItems.map((item, index) => (
              <TaskItem
                key={index}
                message={item.message}
                done={item.done}
                createdAt={item.created_at}
                onToggle={() => handleToggleTask(index)}
                onEdit={() => handleOpenEditTaskModal(index, item.message)}
                onDelete={() => handleOpenDeleteTaskModal(index, item.message)}
              />
            ))}
          </ul>
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
