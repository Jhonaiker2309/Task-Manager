import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLists } from "../contexts/ListContext";
import EditTaskModal from "../components/EditTaskModal";
import DeleteTaskModal from "../components/DeleteTaskModal";

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
      toggleTaskInList(list.slug, taskIndex);
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
        {list.items.length === 0 ? (
          <p className="text-slate-400">
            No hay tareas en esta lista. ¡Añade una para empezar!
          </p>
        ) : (
          <ul className="space-y-3">
            {list.items.map((item, index) => (
              <li
                key={index} // Consider using a more stable key if items can be reordered significantly, e.g., item.id if available
                className={`p-4 rounded-lg shadow-md ${
                  item.done ? "bg-slate-700/50" : "bg-slate-800"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-grow mr-4">
                    <span
                      className={`block text-sm ${
                        item.done
                          ? "line-through text-slate-500"
                          : "text-slate-300"
                      }`}
                    >
                      {item.message}
                    </span>
                    <span className="block text-xs text-slate-400 mt-1">
                      Creada: {new Date(item.created_at).toLocaleDateString()} a
                      las {new Date(item.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleToggleTask(index)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold w-full sm:w-auto transition-colors ${
                        item.done
                          ? "bg-purple-500 hover:bg-purple-600 text-white"
                          : "bg-slate-600 hover:bg-slate-500 text-slate-300"
                      }`}
                    >
                      {item.done ? "Desmarcar" : "Completar"}
                    </button>
                    <button
                      onClick={() =>
                        handleOpenEditTaskModal(index, item.message)
                      }
                      className="px-3 py-1.5 rounded-md text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white w-full sm:w-auto transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        handleOpenDeleteTaskModal(index, item.message)
                      }
                      className="px-3 py-1.5 rounded-md text-xs font-semibold bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
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
