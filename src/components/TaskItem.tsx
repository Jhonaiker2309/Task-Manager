/**
 * Task item component for displaying a single task with actions.
 *
 * Features:
 * - Shows the task message, completion state, and creation date.
 * - Provides buttons to toggle completion, edit, and delete the task.
 * - Visual feedback for completed tasks (line-through and color change).
 *
 * Props:
 * - message: The task message to display.
 * - done: Whether the task is completed.
 * - createdAt: Date when the task was created.
 * - onToggle: Callback to toggle the completion state.
 * - onEdit: Callback to edit the task.
 * - onDelete: Callback to delete the task.
 *
 * UI:
 * - Responsive layout with accessible buttons.
 * - Color and style changes based on task state.
 */
import React from "react";

interface TaskItemProps {
  message: string;
  done: boolean;
  createdAt: Date;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ message, done, createdAt, onToggle, onEdit, onDelete }) => {
  return (
    <li
      className={`p-4 rounded-lg shadow-md ${
        done ? "bg-slate-700/50" : "bg-slate-800"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-grow mr-4">
          <span
            className={`block text-sm ${
              done ? "line-through text-slate-500" : "text-slate-300"
            }`}
          >
            {message}
          </span>
          <span className="block text-xs text-slate-400 mt-1">
            Creada: {createdAt.toLocaleDateString()} a las {createdAt.toLocaleTimeString()}
          </span>
        </div>
        <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
          <button
            onClick={onToggle}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold w-full sm:w-auto transition-colors ${
              done
                ? "bg-purple-500 hover:bg-purple-600 text-white"
                : "bg-slate-600 hover:bg-slate-500 text-slate-300"
            }`}
          >
            {done ? "Desmarcar" : "Completar"}
          </button>
          <button
            onClick={onEdit}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white w-full sm:w-auto transition-colors"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </li>
  );
};

export default TaskItem;