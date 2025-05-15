/**
 * Represents an individual task within a checklist.
 */
export interface Item {
  /** Task text */
  message: string;
  /** Completion status */
  done: boolean;
  /** Creation date */
  created_at: Date;
}

/**
 * Represents a checklist containing multiple tasks.
 */
export interface CheckList {
  /** Unique identifier (slug) */
  slug: string;
  /** Checklist title */
  title: string;
  /** Array of tasks */
  items: Array<Item>;
  /** Checklist creation date */
  created_at: Date;
}

/**
 * Structure for global data (e.g., for export/import).
 */
export interface Data {
  /** All checklists */
  lists: Array<CheckList>;
}

/**
 * Interface for the global checklist context.
 */
export interface ListContextType {
  /** All checklists */
  lists: CheckList[];
  /** Loading state */
  loading: boolean;
  /** Reloads checklists from storage */
  fetchLists: () => void;
  /** Creates a new checklist */
  createList: (title: string) => void;
  /** Updates the title of a checklist */
  updateListTitle: (slug: string, newTitle: string) => void;
  /** Deletes a checklist by its slug */
  deleteList: (slug: string) => void;
  /** Gets a checklist by its slug */
  getListBySlug: (slug: string) => CheckList | undefined;
  /** Adds a task to a checklist */
  addTaskToList: (listSlug: string, taskMessage: string) => void;
  /** Toggles the completion state of a task */
  toggleTaskInList: (listSlug: string, taskIndex: number) => void;
  /** Edits the message of a task */
  editTaskInList: (listSlug: string, taskIndex: number, newMessage: string) => void;
  /** Deletes a task from a checklist */
  deleteTaskFromList: (listSlug: string, taskIndex: number) => void;
  /** Imports checklists from a JSON file */
  importLists: (file: File) => void;
}