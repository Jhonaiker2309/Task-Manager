import React, { useMemo, useEffect } from "react";
import { useLists } from "../contexts/ListContext";
import { useForm } from "react-hook-form";

interface EditListModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  listSlug: string;
}

type FormValues = {
  title: string;
};

const EditListModal: React.FC<EditListModalProps> = ({
  isOpen,
  onClose,
  currentTitle,
  listSlug,
}) => {
  const { lists, updateListTitle } = useLists();
  const existingTitles = useMemo(
    () =>
      lists
        .filter((l) => l.slug !== listSlug)
        .map((l) => l.title.toLowerCase()),
    [lists, listSlug]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: { title: currentTitle },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ title: currentTitle });
    }
  }, [isOpen, currentTitle, reset]);

  if (!isOpen) return null;

  const onSubmit = ({ title }: FormValues) => {
    const trimmed = title.trim();
    updateListTitle(listSlug, trimmed);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 animate-modal-appear"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Editar Nombre de la Lista
          </h2>
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
            <label
              htmlFor="listNewTitle"
              className="block text-sm font-medium text-slate-300 mb-1.5"
            >
              Nuevo Título
            </label>
            <input
              id="title"
              {...register("title", {
                required: "El título es obligatorio.",
                maxLength: { value: 50, message: "Máximo 50 caracteres." },
                validate: {
                  notEmpty: (v) =>
                    v.trim().length > 0 || "No puede estar vacío.",
                  notChanged: (v) =>
                    v.trim() !== currentTitle.trim() ||
                    "No hay cambios que guardar.",
                  notTaken: (v) =>
                    !existingTitles.includes(v.trim().toLowerCase()) ||
                    "Ya existe una lista con ese nombre.",
                },
              })}
              className={`w-full px-4 py-3 bg-slate-700 border ${
                errors.title ? "border-red-500" : "border-slate-600"
              } rounded-md text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-shadow`}
              placeholder="Ej: Mis Proyectos Importantes"
              autoFocus
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.title.message}
              </p>
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
              disabled={!isValid}
              className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out transform hover:scale-105"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListModal;
