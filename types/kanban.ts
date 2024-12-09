export interface Card {
  id: string;
  content: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export interface KanbanState {
  columns: Column[];
  searchTerm: string;
}

export interface KanbanStore extends KanbanState {
  addColumn: (title: string) => void;
  deleteColumn: (id: string) => void;
  editColumnTitle: (id: string, title: string) => void;
  addCard: (columnId: string, content: string) => void;
  editCard: (columnId: string, cardId: string, content: string) => void;
  moveCard: (sourceColId: string, destColId: string, sourceIndex: number, destIndex: number) => void;
  moveColumn: (sourceIndex: number, destIndex: number) => void;
  setSearchTerm: (term: string) => void;
  undo: () => void;
  redo: () => void;
  deleteCard: (columnId: string, cardId: string) => void;
  history: KanbanState[];
  historyIndex: number;
}

