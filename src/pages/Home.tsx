import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CheckList } from '../types';
import CreateListModal from '../components/CreateListModal';
import { generateSlug } from '../utils';

const Home: React.FC = () => {
  const [lists, setLists] = useState<CheckList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const mockLists: CheckList[] = [
      { slug: 'compras-semanales', title: 'Compras Semanales', items: [], created_at: new Date() },
      { slug: 'tareas-proyecto-x', title: 'Tareas Proyecto X', items: [], created_at: new Date(Date.now() - 86400000) },
    ];
    setLists(mockLists.sort((a, b) => b.created_at.getTime() - a.created_at.getTime()));
    console.log('Home page cargada, listas:', mockLists);
  }, []);

  const handleOpenCreateModal = () => setIsModalOpen(true);
  const handleCloseCreateModal = () => setIsModalOpen(false);

  
  const handleCreateList = (title: string) => {
    const newSlug = generateSlug(title) + '-' + Date.now();
    const newList: CheckList = {
      slug: newSlug,
      title,
      items: [],
      created_at: new Date(),
    };
    setLists(prevLists => [newList, ...prevLists].sort((a, b) => b.created_at.getTime() - a.created_at.getTime()));
    handleCloseCreateModal();
  };

  return (
    <div className="p-4 sm:p-8 bg-slate-900 min-h-screen text-white">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Mis Listas de Tareas</h1>
        <p className="text-slate-400 mt-1">Organiza tu día, una tarea a la vez.</p>
    </header>
    <button
          onClick={handleOpenCreateModal}
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Crear Nueva Lista
        </button>

      {lists.length === 0 && <p className="text-slate-400">No hay listas aún. ¡Crea una!</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.map((list) => (
          <div key={list.slug} className="bg-slate-800 p-5 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-purple-400 mb-2">{list.title}</h2>
            <p className="text-sm text-slate-400 mb-1">Creada: {list.created_at.toLocaleDateString()}</p>
            <p className="text-sm text-slate-500 mb-3">Tareas: {list.items.length}</p>
            <Link
              to={`/list/${list.slug}`}
              className="inline-block bg-purple-500/30 hover:bg-purple-500/50 text-purple-300 py-2 px-4 rounded-md text-sm"
            >
              Ver Detalles
            </Link>
          </div>
        ))}
      </div>

      <CreateListModal
        isOpen={isModalOpen}
        onClose={handleCloseCreateModal}
        onCreateList={handleCreateList}
      />
    </div>
  );
};

export default Home;