/**
 * Modal component for confirming the deletion of a checklist.
 *
 * Features:
 * - Displays a modal dialog asking the user to confirm deletion of a checklist.
 * - Shows the checklist title (if provided) in the confirmation message.
 * - Calls `deleteList` from context and closes the modal on confirmation.
 * - Provides Cancel and Delete buttons.
 * - Accessible and responsive modal layout.
 *
 * Props:
 * - isOpen: Controls modal visibility.
 * - onClose: Callback to close the modal.
 * - listSlug: Slug of the checklist to delete (optional).
 * - listTitle: Title of the checklist to display in the confirmation (optional).
 *
 * UI:
 * - Confirmation message with checklist title.
 * - Cancel and Delete buttons.
 * - Modal closes on background click or Cancel.
 */
import React from 'react';
import { useLists } from '../contexts/ListContext';

interface DeleteListModalProps {
  isOpen: boolean;
  onClose: () => void;
  listSlug?: string;
  listTitle?: string;
}

const DeleteListModal: React.FC<DeleteListModalProps> = ({
  isOpen,
  onClose,
  listSlug,
  listTitle,
}) => {
  const { deleteList } = useLists();

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    if (listSlug) {
      deleteList(listSlug);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      data-testid="modal-background"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 animate-modal-appear"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-red-400">Confirmar Eliminación</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors text-3xl leading-none"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>
        <div className="mb-6">
          <p className="text-slate-300">
            ¿Estás seguro de que quieres eliminar la lista
            {listTitle && <strong className="text-purple-300"> "{listTitle}"</strong>}?
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Esta acción no se puede deshacer. Todas las tareas asociadas a esta lista también serán eliminadas.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 border border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out transform hover:scale-105"
          >
            Eliminar Lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteListModal;