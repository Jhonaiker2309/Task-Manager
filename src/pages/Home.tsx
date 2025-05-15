/**
 * Home page component for the checklist application.
 *
 * Features:
 * - Displays all user-created checklists with pagination and sorting.
 * - Allows creating, editing, and deleting lists via modals.
 * - Supports importing lists from a JSON file.
 * - Provides sorting by newest or oldest lists.
 * - Responsive grid layout for displaying lists.
 *
 * Hooks used:
 * - useLists: Provides access to the global lists state.
 * - useFileImport: Handles importing lists from a JSON file.
 * - useSortedLists: Returns lists sorted by the selected order.
 * - usePagination: Manages pagination state and logic.
 * - useModal: Controls modal open/close state and payloads.
 *
 * UI:
 * - "Crear Nueva Lista" button opens the create modal.
 * - "Importar JSON" button opens a file picker for importing lists.
 * - Sorting buttons toggle between "Más Recientes" and "Más Antiguas".
 * - Pagination controls for navigating between pages of lists.
 * - Renders ListCard components for each list on the current page.
 * - Modals for creating, editing, and deleting lists.
 */
import React, { useState } from "react";
import CreateListModal from "../components/CreateListModal";
import DeleteListModal from "../components/DeleteListModal";
import EditListModal from "../components/EditListModal";
import { useLists } from "../contexts/ListContext";
import ListCard from "../components/ListCard";
import { useFileImport } from "../hooks/useFileImport";
import { useSortedLists } from "../hooks/useSortedLists";
import { usePagination } from "../hooks/usePagination";
import { useModal } from "../hooks/useModal";

const Home: React.FC = () => {
  const { lists } = useLists();
  const { fileInputRef, handleImport } = useFileImport();
  const [sortOrder, setSortOrder] = useState<"newToOld" | "oldToNew">("newToOld");

  const sortedLists = useSortedLists(lists, sortOrder);
  const { currentPage, totalPages, currentItems, paginate } = usePagination(
    sortedLists,
    6
  );

  const createModal = useModal();
  const deleteModal = useModal<{ slug: string; title: string }>();
  const editModal = useModal<{ slug: string; title: string }>();

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
          onClick={() => createModal.open()}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-5 rounded-lg"
        >
          Crear Nueva Lista
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleImport}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-lg"
          title={
            "El JSON debe tener esta estructura:\n" +
            "[\n" +
            "  {\n" +
            "    title: string,\n" +
            "    created_at: string (ISO),\n" +
            "    items: [\n" +
            "      { message, done, created_at }\n" +
            "    ]\n" +
            "  }\n" +
            "]"
          }
        >
          Importar JSON
        </button>
      </div>

      {lists.length > 1 && (
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setSortOrder("newToOld")}
            className={`px-4 py-2 text-xs rounded-md font-medium ${
              sortOrder === "newToOld"
                ? "bg-purple-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Más Recientes
          </button>
          <button
            onClick={() => setSortOrder("oldToNew")}
            className={`px-4 py-2 text-xs rounded-md font-medium ${
              sortOrder === "oldToNew"
                ? "bg-purple-500 text-white"
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
        {currentItems.map((list) => (
          <ListCard
            key={list.slug}
            list={list}
            onEdit={() => editModal.open(list)}
            onDelete={() => deleteModal.open(list)}
          />
        ))}
      </div>

      {lists.length > 0 && (
        <div className="mt-4 mb-4 flex justify-center items-center space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-slate-400">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      <CreateListModal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
      />

      <DeleteListModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        listSlug={deleteModal.payload?.slug}
        listTitle={deleteModal.payload?.title}
      />

      {editModal.payload && (
        <EditListModal
          isOpen={editModal.isOpen}
          onClose={editModal.close}
          currentTitle={editModal.payload.title}
          listSlug={editModal.payload.slug}
        />
      )}
    </div>
  );
};

export default Home;