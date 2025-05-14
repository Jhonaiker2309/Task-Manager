import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLists } from "../contexts/ListContext";

const ListDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getListBySlug, addTaskToList, toggleTaskInList } = useLists();
  const list = getListBySlug(slug || "");
  const [newTaskMessage, setNewTaskMessage] = useState("");

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
          <button className="mt-2 sm:mt-0 bg-slate-700 hover:bg-slate-600 text-sm text-slate-300 py-2 px-4 rounded-md transition-colors">
            Editar Nombre Lista (P)
          </button>
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
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg shadow-md ${
                  item.done ? "bg-slate-700/50" : "bg-slate-800"
                }`}
              >
                <div className="flex-grow">
                  <span
                    className={`block text-sm ${
                      item.done
                        ? "line-through text-slate-500"
                        : "text-slate-300"
                    }`}
                  >
                    {item.message}
                  </span>
                  <span className="block text-xs text-slate-100 mt-1">
                    Creada: {new Date(item.created_at).toLocaleDateString()} a
                    las {new Date(item.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleTask(index)}
                  className={`ml-4 px-3 py-1 rounded-md text-xs font-semibold ${
                    item.done
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-slate-600 hover:bg-slate-500 text-slate-300"
                  }`}
                >
                  {item.done ? "Desmarcar" : "Completar"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ListDetails;
