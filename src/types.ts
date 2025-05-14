export interface Item {
  message: string;
  done: boolean;
  created_at: Date;
}

export interface CheckList {
  slug: string;
  title: string;
  items: Array<Item>;
  created_at: Date;
}

export interface Data {
  lists: Array<CheckList>;
}

export interface ListContextType {
  lists: CheckList[];
  loading: boolean;
  fetchLists: () => void;
  createList: (title: string) => void;
  updateListTitle: (slug: string, newTitle: string) => void;
  deleteList: (slug: string) => void;
  getListBySlug: (slug: string) => CheckList | undefined;
  addTaskToList: (listSlug: string, taskMessage: string) => void;
  toggleTaskInList: (listSlug: string, taskIndex: number) => void;
  editTaskInList: (listSlug: string, taskIndex: number, newMessage: string) => void;
  deleteTaskFromList: (listSlug: string, taskIndex: number) => void; 
}