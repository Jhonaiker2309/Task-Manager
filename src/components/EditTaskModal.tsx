/**
 * Modal component for editing the message of an existing task.
 *
 * Features:
 * - Displays a modal dialog for editing a task's message.
 * - Validates input: required, max 100 characters, not empty, unique, and must be different from the current message.
 * - Calls the provided `onSave` callback with the new message on submit.
 * - Resets form to the current message when opened.
 *
 * Props:
 * - isOpen: Controls modal visibility.
 * - onClose: Callback to close the modal.
 * - onSave: Callback to save the new message.
 * - currentMessage: The current message of the task.
 * - existingMessages: Array of all messages in the list (for uniqueness validation).
 *
 * UI:
 * - Textarea for editing the task message with validation feedback.
 * - Cancel and Save buttons.
 * - Accessible and responsive modal layout.
 */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newMessage: string) => void;
  currentMessage: string;
  existingMessages: string[];
}

type FormValues = {
  message: string;
};

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentMessage,
  existingMessages,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: { message: currentMessage },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ message: currentMessage });
    }
  }, [isOpen, currentMessage, reset]);

  if (!isOpen) return null;

  const onSubmit = ({ message }: FormValues) => {
    const trimmed = message.trim();
    onSave(trimmed);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Editar Tarea</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-3xl leading-none"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-slate-300 mb-1.5"
            >
              Nuevo Mensaje de la Tarea
            </label>
            <textarea
              id="message"
              {...register("message", {
                required: "El mensaje es obligatorio.",
                maxLength: {
                  value: 100,
                  message: "Máximo 100 caracteres.",
                },
                validate: {
                  notEmpty: (v) =>
                    v.trim().length > 0 || "El mensaje no puede estar vacío.",
                  notChanged: (v) =>
                    v.trim() !== currentMessage.trim() ||
                    "No hay cambios que guardar.",
                  notTaken: (v) =>
                    !existingMessages.includes(v.trim()) ||
                    "Ya existe una tarea con ese mensaje.",
                },
              })}
              className={`w-full px-4 py-3 bg-slate-700 border ${
                errors.message ? "border-red-500" : "border-slate-600"
              } rounded-md text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none min-h-[80px] transition-shadow`}
              placeholder="Describe la tarea..."
              autoFocus
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.message.message}
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
              className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out transform hover:scale-105"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;