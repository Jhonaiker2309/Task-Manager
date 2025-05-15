import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLists } from "../contexts/ListContext";
import EditTaskModal from "../components/EditTaskModal";
import DeleteTaskModal from "../components/DeleteTaskModal";
import TaskItem from "../components/TaskItem";
import { useForm } from "react-hook-form";
import { useSortedTasks } from "../hooks/useSortedTasks";
import { usePagination } from "../hooks/usePagination";
import { useModal } from "../hooks/useModal";

type FormValues = { message: string };

const ListDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    getListBySlug,
    addTaskToList,
    toggleTaskInList,
    editTaskInList,
    deleteTaskFromList,
  } = useLists();

  const list = getListBySlug(slug ?? "");
  const existingMessages = list?.items.map((it) => it.message) ?? [];

  const [sortOrder, setSortOrder] = useState<"newToOld" | "oldToNew">(
    "newToOld"
  );
  const sortedTasks = useSortedTasks(list?.items ?? [], sortOrder);

  const perPage = 5;
  const { currentPage, totalPages, currentItems: pageItems, paginate } =
    usePagination(sortedTasks, perPage);

  const editModal = useModal<number>();
  const deleteModal = useModal<number>();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "onChange", defaultValues: { message: "" } });

  const onSubmit = handleSubmit(({ message }) => {
    if (!list) return;
    addTaskToList(list.slug, message.trim());
    reset({ message: "" });
    paginate(1);
  });

  useEffect(() => {
    paginate(1);
  }, [sortedTasks, paginate]);

  if (!list) {
    return (
      <div className="p-4 sm:p-8 bg-slate-900 min-h-screen text-white text-center">
        <h2 className="text-2xl text-red-500 mb-4">Lista no encontrada</h2>
        <Link
          to="/"
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
        >
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-slate-900 min-h-screen text-white">
      <header className="mb-6 pb-4 border-b border-slate-700">
        <Link to="/" className="text-purple-400 hover:text-purple-300 text-sm">
          &larr; Mis Listas
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-purple-200 mt-2">
          {list.title}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Creada: {list.created_at.toLocaleDateString()} a las{" "}
          {list.created_at.toLocaleTimeString()}
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="mb-8 p-4 bg-slate-800 rounded-lg shadow-md"
      >
        <h3 className="text-lg font-semibold mb-3 text-slate-200">
          Añadir Nueva Tarea
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            {...register("message", {
              required: "El mensaje es obligatorio",
              maxLength: { value: 100, message: "Máx. 100 caracteres" },
              validate: (v) =>
                existingMessages.includes(v.trim())
                  ? "Ya existe esa tarea"
                  : true,
            })}
            placeholder="Ej: Comprar leche, revisar correos..."
            className="flex-grow px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-md 
                       text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 
                       focus:border-purple-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!isValid || !watch("message")?.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed 
                       text-white font-semibold py-2.5 px-5 rounded-md shadow-sm transition-colors"
          >
            Añadir Tarea
          </button>
        </div>
        {errors.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.message.message}
          </p>
        )}
      </form>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-slate-200">Tareas</h3>
          {sortedTasks.length > 1 && (
            <div className="flex space-x-2">
              <button
                onClick={() => setSortOrder("newToOld")}
                className={`px-3 py-1.5 text-xs rounded-md font-medium ${
                  sortOrder === "newToOld"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                }`}
              >
                Más recientes
              </button>
              <button
                onClick={() => setSortOrder("oldToNew")}
                className={`px-3 py-1.5 text-xs rounded-md font-medium ${
                  sortOrder === "oldToNew"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                }`}
              >
                Más antiguas
              </button>
            </div>
          )}
        </div>

        {pageItems.length === 0 ? (
          <p className="text-slate-400">No hay tareas. ¡Añade una!</p>
        ) : (
          <>
            <ul className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {pageItems.map((item) => (
                <TaskItem
                  key={`${item.created_at.toISOString()}-${item.message}`}
                  message={item.message}
                  done={item.done}
                  createdAt={item.created_at}
                  onToggle={() =>
                    toggleTaskInList(list.slug, item.origIdx)
                  }
                  onEdit={() => editModal.open(item.origIdx)}
                  onDelete={() => deleteModal.open(item.origIdx)}
                />
              ))}
            </ul>
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-slate-700 text-slate-300 rounded-md 
                             hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="text-slate-400">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-slate-700 text-slate-300 rounded-md 
                             hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {editModal.payload !== null && (
        <EditTaskModal
          isOpen={editModal.isOpen}
          onClose={editModal.close}
          currentMessage={list.items[editModal.payload].message}
          onSave={(msg) => {
            editTaskInList(list.slug, editModal.payload!, msg);
            editModal.close();
          }}
          existingMessages={existingMessages}
        />
      )}

      {deleteModal.payload !== null && (
        <DeleteTaskModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          taskMessage={list.items[deleteModal.payload].message}
          onConfirm={() => {
            deleteTaskFromList(list.slug, deleteModal.payload!);
            deleteModal.close();
          }}
        />
      )}
    </div>
  );
};

export default ListDetails;