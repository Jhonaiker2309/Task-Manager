import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CreateListModal from '../components/CreateListModal';
import DeleteListModal from '../components/DeleteListModal';
import EditListModal from '../components/EditListModal';
import { useLists } from '../contexts/ListContext'; // Importa el hook del contexto

const Home: React.FC = () => {
  const { lists } = useLists(); // Obtén las funciones y datos del contexto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<{ slug: string; title: string } | null>(null);
  const [listToModify, setListToModify] = useState<{ slug: string; title: string } | null>(null);

  const handleOpenCreateModal = () => setIsModalOpen(true);
  const handleCloseCreateModal = () => setIsModalOpen(false);

  const handleOpenDeleteModal = (list: { slug: string; title: string }) => {
    setListToDelete(list);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setListToDelete(null);
  };

  const handleOpenEditModal = (list: { slug: string; title: string }) => {
    setListToModify(list);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setListToModify(null);
  };

  return (
    <div className="p-4 sm:p-8 bg-slate-900 min-h-screen text-white">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Mis Listas de Tareas</h1>
        <p className="text-slate-400 mt-1">Organiza tu día, una tarea a la vez.</p>
      </header>
      <button
        onClick={handleOpenCreateModal}
        className="my-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        Crear Nueva Lista
      </button>

      {lists.length === 0 && <p className="text-slate-400">No hay listas aún. ¡Crea una!</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.map((list) => (
          <div
            key={list.slug}
            className="bg-slate-800/70 p-5 rounded-xl shadow-lg flex flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-purple-500/20 hover:-translate-y-1"
          >
            <div>
              <h2 className="text-xl font-semibold text-purple-300 mb-2 truncate" title={list.title}>
                {list.title}
              </h2>
              <p className="text-xs text-slate-400 mb-1">
                Creada: {new Date(list.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-slate-500 mb-4">Tareas: {list.items.length}</p>
            </div>

            <div className="mt-auto space-y-2">
              <Link
                to={`/list/${list.slug}`}
                className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
              >
                Ver Detalles
              </Link>
              <button
                onClick={() => handleOpenEditModal({ slug: list.slug, title: list.title })}
                className="block w-full text-center bg-sky-600/60 hover:bg-sky-600/90 text-sky-100 font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75"
              >
                Editar Nombre
              </button>
              <button
                onClick={() => handleOpenDeleteModal({ slug: list.slug, title: list.title })}
                className="block w-full text-center bg-red-600/50 hover:bg-red-600/80 text-red-100 font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <CreateListModal isOpen={isModalOpen} onClose={handleCloseCreateModal} />

      <DeleteListModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        listSlug={listToDelete?.slug}
        listTitle={listToDelete?.title}
      />

      {listToModify && (
        <EditListModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          currentTitle={listToModify.title}
          listSlug={listToModify.slug}
        />
      )}
    </div>
  );
};

export default Home;