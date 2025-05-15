import React, { useState, useMemo } from "react";
import CreateListModal from "../components/CreateListModal";
import DeleteListModal from "../components/DeleteListModal";
import EditListModal from "../components/EditListModal";
import { useLists } from "../contexts/ListContext";
import ListCard from "../components/ListCard";

const Home: React.FC = () => {
  const { lists } = useLists();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<{
    slug: string;
    title: string;
  } | null>(null);
  const [listToModify, setListToModify] = useState<{
    slug: string;
    title: string;
  } | null>(null);
  const [sortOrder, setSortOrder] = useState<"newToOld" | "oldToNew">(
    "newToOld"
  );

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

  const sortedLists = useMemo(() => {
    const listsCopy = [...lists];
    return listsCopy.sort((a, b) => {
      if (sortOrder === "newToOld") {
        return b.created_at.getTime() - a.created_at.getTime();
      } else {
        return a.created_at.getTime() - b.created_at.getTime();
      }
    });
  }, [lists, sortOrder]);

  return (
    <div className="p-4 sm:p-8 bg-slate-900 min-h-screen text-white">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Mis Listas de Tareas
        </h1>
        <p className="text-slate-400 mt-1">
          Organiza tu día, una tarea a la vez.
        </p>
      </header>
      <button
        onClick={handleOpenCreateModal}
        className="my-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        Crear Nueva Lista
      </button>
      {lists.length > 1 && (
        <div className="flex space-x-2 order-2 sm:order-none mb-4">
          <button
            onClick={() => setSortOrder("newToOld")}
            className={`px-4 py-2 text-xs rounded-md font-medium transition-colors ${
              sortOrder === "newToOld"
                ? "bg-purple-500 text-white shadow-sm"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Más Recientes
          </button>
          <button
            onClick={() => setSortOrder("oldToNew")}
            className={`px-4 py-2 text-xs rounded-md font-medium transition-colors ${
              sortOrder === "oldToNew"
                ? "bg-purple-500 text-white shadow-sm"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Más Antiguas
          </button>
        </div>
      )}

      {lists.length === 0 && (
        <p className="text-slate-400">No hay listas aún. ¡Crea una!</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedLists.map((list) => (
          <ListCard
            key={list.slug}
            list={list}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
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
