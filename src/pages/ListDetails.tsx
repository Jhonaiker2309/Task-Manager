import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { CheckList, Item } from '../types';

const ListDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [list, setList] = useState<CheckList | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTaskMessage, setNewTaskMessage] = useState('');

  const fetchListDetails = useCallback(() => {
    setLoading(true);
    const storedLists = localStorage.getItem('checkLists');
    let foundList: CheckList | undefined;

    if (storedLists) {
      const parsedLists: CheckList[] = JSON.parse(storedLists).map((l: CheckList) => ({
        ...l,
        created_at: new Date(l.created_at),
        items: l.items.map(item => ({
          ...item,
          created_at: new Date(item.created_at)
        })).sort((a, b) => {
            if (a.done === b.done) {
                return a.created_at.getTime() - b.created_at.getTime();
            }
            return a.done ? 1 : -1;
        })
      }));
      foundList = parsedLists.find(l => l.slug === slug);
    }

    if (foundList) {
      setList(foundList);
    } else {
      console.warn(`Lista con slug "${slug}" no encontrada. Esto podría ser un error o la lista no existe.`);
      setList(null);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchListDetails();
  }, [fetchListDetails]);



  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!list || !newTaskMessage.trim()) {
        if (!newTaskMessage.trim()) alert("El mensaje de la tarea no puede estar vacío.");
        return;
    }
    const newTask: Item = {
      message: newTaskMessage.trim(),
      done: false,
      created_at: new Date()
    };
    
    const updatedItems = [newTask, ...list.items].sort((a, b) => {
        if (a.done === b.done) {
            return a.created_at.getTime() - b.created_at.getTime();
        }
        return a.done ? 1 : -1;
    });

    const updatedList = { ...list, items: updatedItems };
    setList(updatedList);
    setNewTaskMessage('');
  };

  if (loading) {
    return <div className="p-4 sm:p-8 text-white text-center">Cargando detalles de la lista...</div>;
  }

  if (!list) {
    return (
      <div className="p-4 sm:p-8 bg-slate-900 min-h-screen text-white text-center">
        <h2 className="text-2xl text-red-500 mb-4">Lista no encontrada</h2>
        <p className="text-slate-400 mb-6">La lista con el slug "{slug}" no pudo ser encontrada o no existe.</p>
        <Link to="/" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg">
          Volver a Mis Listas
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-slate-900 min-h-screen text-white">
      <header className="mb-6 pb-4 border-b border-slate-700">
        <Link to="/" className="text-purple-400 hover:text-purple-300 mb-3 inline-block text-sm">
          &larr; Volver a Mis Listas
        </Link>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-purple-200 break-words">{list.title}</h1>
          <button
            className="mt-2 sm:mt-0 bg-slate-700 hover:bg-slate-600 text-sm text-slate-300 py-2 px-4 rounded-md transition-colors"
          >
            Editar Nombre Lista (P)
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Creada: {list.created_at.toLocaleDateString()} a las {list.created_at.toLocaleTimeString()}
        </p>
      </header>

      <form onSubmit={handleAddTask} className="mb-8 p-4 bg-slate-800 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-slate-200">Añadir Nueva Tarea</h3>
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
    </div>
  );
};

export default ListDetails;