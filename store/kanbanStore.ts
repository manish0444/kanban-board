import { create } from 'zustand';
import { KanbanStore, Column, Card, KanbanState } from '../types/kanban';
import { persist, createJSONStorage } from 'zustand/middleware';

const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      columns: [],
      searchTerm: '',
      history: [{ columns: [], searchTerm: '' }],
      historyIndex: 0,

      addColumn: (title) => {
        const newColumn: Column = { id: Date.now().toString(), title, cards: [] };
        set((state) => {
          const newState: KanbanState = { columns: [...state.columns, newColumn], searchTerm: state.searchTerm };
          return {
            ...newState,
            history: [...state.history.slice(0, state.historyIndex + 1), newState],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      deleteColumn: (id) => {
        set((state) => {
          const newState: KanbanState = { columns: state.columns.filter((col) => col.id !== id), searchTerm: state.searchTerm };
          return {
            ...newState,
            history: [...state.history.slice(0, state.historyIndex + 1), newState],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      editColumnTitle: (id, title) => {
        set((state) => {
          const newColumns = state.columns.map((col) =>
            col.id === id ? { ...col, title } : col
          );
          const newState: KanbanState = { columns: newColumns, searchTerm: state.searchTerm };
          return {
            ...newState,
            history: [...state.history.slice(0, state.historyIndex + 1), newState],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      addCard: (columnId, content) => {
        const newCard: Card = { id: Date.now().toString(), content };
        set((state) => {
          const newColumns = state.columns.map((col) =>
            col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
          );
          const newState: KanbanState = { columns: newColumns, searchTerm: state.searchTerm };
          return {
            ...newState,
            history: [...state.history.slice(0, state.historyIndex + 1), newState],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      editCard: (columnId, cardId, content) => {
        set((state) => {
          const newColumns = state.columns.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  cards: col.cards.map((card) =>
                    card.id === cardId ? { ...card, content } : card
                  ),
                }
              : col
          );
          const newState: KanbanState = { columns: newColumns, searchTerm: state.searchTerm };
          return {
            ...newState,
            history: [...state.history.slice(0, state.historyIndex + 1), newState],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      moveCard: (sourceColId, destColId, sourceIndex, destIndex) => {
        set((state) => {
          const newColumns = [...state.columns];
          const sourceCol = newColumns.find((col) => col.id === sourceColId)!;
          const destCol = newColumns.find((col) => col.id === destColId)!;
          const [movedCard] = sourceCol.cards.splice(sourceIndex, 1);
          destCol.cards.splice(destIndex, 0, movedCard);
          const newState: KanbanState = { columns: newColumns, searchTerm: state.searchTerm };
          return {
            ...newState,
            history: [...state.history.slice(0, state.historyIndex + 1), newState],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      moveColumn: (sourceIndex, destIndex) => {
        set((state) => {
          const newColumns = [...state.columns];
          const [movedColumn] = newColumns.splice(sourceIndex, 1);
          newColumns.splice(destIndex, 0, movedColumn);
          const newState: KanbanState = { columns: newColumns, searchTerm: state.searchTerm };
          return {
            ...newState,
            history: [...state.history.slice(0, state.historyIndex + 1), newState],
            historyIndex: state.historyIndex + 1,
          };
        });
      },

      setSearchTerm: (term) => set((state) => {
        const newState: KanbanState = { columns: state.columns, searchTerm: term };
        return {
          ...newState,
          history: [...state.history.slice(0, state.historyIndex + 1), newState],
          historyIndex: state.historyIndex + 1,
        };
      }),

      undo: () => {
        set((state) => {
          if (state.historyIndex > 0) {
            return {
              ...state.history[state.historyIndex - 1],
              historyIndex: state.historyIndex - 1,
            };
          }
          return state;
        });
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            return {
              ...state.history[state.historyIndex + 1],
              historyIndex: state.historyIndex + 1,
            };
          }
          return state;
        });
      },

      deleteCard: (columnId: string, cardId: string) => {
        set((state) => {
          const newColumns = state.columns.map((col) =>
            col.id === columnId
              ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
              : col
          );
          const newState: KanbanState = { columns: newColumns, searchTerm: state.searchTerm };
          return {
            ...newState,
            history: [...state.history.slice(0, state.historyIndex + 1), newState],
            historyIndex: state.historyIndex + 1,
          };
        });
      },
    }),
    {
      name: 'kanban-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useKanbanStore;

