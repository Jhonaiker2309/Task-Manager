import React, { useState, useMemo, useRef } from "react";
import CreateListModal from "../components/CreateListModal";
import DeleteListModal from "../components/DeleteListModal";
import EditListModal from "../components/EditListModal";
import { useLists } from "../contexts/ListContext";
import ListCard from "../components/ListCard";

const Home: React.FC = () => {
  const { lists, importLists } = useLists();
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importLists(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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

  const totalPages = Math.ceil(sortedLists.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedLists.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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
      <div className="flex flex-row flex-wrap justify-between items-center my-4 gap-4">
        <button
          onClick={handleOpenCreateModal}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-5 rounded-lg mb-4 sm:mb-0"
        >
          Crear Nueva Lista
        </button>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImportJson}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title={
              "El JSON debe tener esta estructura:\n" +
              "[\n" +
              "  {\n" +
              "    title: string,\n" +
              "    created_at: string (ISO),\n" +
              "    items: [\n" +
              "      {\n" +
              "        message: string,\n" +
              "        done: boolean,\n" +
              "        created_at: string (ISO)\n" +
              "      },\n" +
              "      …\n" +
              "    ]\n" +
              "  },\n" +
              "  …\n" +
              "]"
            }
            className="ml-0 sm:ml-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-lg"
          >
            Importar JSON
          </button>
        </div>
      </div>
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
      <div className="overflow-y-auto max-h-96 scrollbar-hide lg:overflow-visible lg:max-h-none">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((list) => (
            <ListCard
              key={list.slug}
              list={list}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </div>
      </div>

      {lists.length > 0 && (
        <div className="mt-4 mb-4 flex justify-center items-center space-x-2">
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
