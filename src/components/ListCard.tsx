import React from "react";
import { Link } from "react-router-dom";
import type { CheckList } from "../types";

interface ListCardProps {
  list: CheckList;
  onEdit: (list: { slug: string; title: string }) => void;
  onDelete: (list: { slug: string; title: string }) => void;
}

const ListCard: React.FC<ListCardProps> = ({ list, onEdit, onDelete }) => {
  const handleDownload = () => {
    const data = JSON.stringify(list, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${list.slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="bg-slate-800/70 p-5 rounded-xl shadow-lg flex flex-col justify-between
               transition-all duration-300 ease-in-out hover:shadow-purple-500/20 hover:-translate-y-1"
    >
      <div>
        <h2
          className="text-xl font-semibold text-purple-300 mb-2 truncate"
          title={list.title}
        >
          {list.title}
        </h2>
        <p className="text-xs text-slate-400 mb-1">
          Creada: {new Date(list.created_at).toLocaleDateString()} a las{" "}
          {new Date(list.created_at).toLocaleTimeString()}
        </p>
        <p className="text-sm text-slate-500 mb-4">
          Tareas: {list.items.length}
        </p>
      </div>

      <div className="mt-auto space-y-2">
        <Link
          to={`/list/${list.slug}`}
          className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white
                   font-medium py-2.5 px-4 rounded-md shadow-sm transition-colors
                   duration-150 ease-in-out focus:outline-none focus:ring-2
                   focus:ring-purple-500 focus:ring-opacity-75"
        >
          Ver Detalles
        </Link>
        <button
          onClick={() => onEdit({ slug: list.slug, title: list.title })}
          className="block w-full text-center bg-sky-600/60 hover:bg-sky-600/90 text-sky-100
                   font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-150
                   ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500
                   focus:ring-opacity-75"
        >
          Editar Nombre
        </button>
        <button
          onClick={handleDownload}
          className="block w-full text-center bg-green-600 hover:bg-green-700 text-white
                     font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-150
                     ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500
                     focus:ring-opacity-75"
        >
          Descargar JSON
        </button>
        <button
          onClick={() => onDelete({ slug: list.slug, title: list.title })}
          className="block w-full text-center bg-red-600/50 hover:bg-red-600/80 text-red-100
                   font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-150
                   ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500
                   focus:ring-opacity-75"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ListCard;
