/**
 * Modal component for creating a new checklist.
 *
 * Features:
 * - Displays a modal dialog for entering a new checklist title.
 * - Validates input: required, max 50 characters, and unique title.
 * - Calls `createList` from context and closes modal on submit.
 * - Resets form when opened.
 *
 * Props:
 * - isOpen: Controls modal visibility.
 * - onClose: Callback to close the modal.
 *
 * UI:
 * - Input for checklist title with validation feedback.
 * - Cancel and Create buttons.
 * - Accessible and responsive modal layout.
 */
import React, { useMemo, useEffect } from 'react';
import { useLists } from '../contexts/ListContext';
import { useForm } from 'react-hook-form';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormValues = {
  title: string;
};

const CreateListModal: React.FC<CreateListModalProps> = ({ isOpen, onClose }) => {
  const { lists, createList } = useLists();
  const existingTitles = useMemo(
    () => lists.map((l) => l.title.toLowerCase()),
    [lists]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { title: '' },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ title: '' });
    }
  }, [isOpen, reset]);

  const onSubmit = ({ title }: FormValues) => {
    const trimmed = title.trim();
    createList(trimmed);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      data-testid="modal-background"
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 animate-modal-appear"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Crear Nueva Lista</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors text-3xl leading-none"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label htmlFor="listTitle" className="block text-sm font-medium text-slate-300 mb-1.5">
              Título de la Lista
            </label>
            <input
              type="text"
              id="listTitle"
              {...register('title', {
                required: 'El título es obligatorio.',
                maxLength: { value: 50, message: 'Máximo 50 caracteres.' },
                validate: (v) =>
                  !existingTitles.includes(v.trim().toLowerCase()) ||
                  'Ya existe una lista con ese nombre.',
              })}
              className={`w-full px-4 py-3 bg-slate-700 border ${
                errors.title ? 'border-red-500' : 'border-slate-600'
              } rounded-md text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-shadow`}
              placeholder="Ej: Tareas del Hogar"
              autoFocus
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1.5">{errors.title.message}</p>
            )}
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
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-md"
              disabled={!isValid}
            >
              Crear Lista
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListModal;