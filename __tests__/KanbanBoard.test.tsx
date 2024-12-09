import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import KanbanBoard from '../components/KanbanBoard';

// Mock the zustand store
jest.mock('../store/kanbanStore', () => ({
  __esModule: true,
  default: () => ({
    columns: [
      { id: '1', title: 'To Do', cards: [{ id: '1', content: 'Task 1' }] },
      { id: '2', title: 'In Progress', cards: [] },
    ],
    addColumn: jest.fn(),
    moveCard: jest.fn(),
    searchTerm: '',
    setSearchTerm: jest.fn(),
    undo: jest.fn(),
    redo: jest.fn(),
  }),
}));

describe('KanbanBoard', () => {
  it('renders columns and cards', () => {
    render(<KanbanBoard />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  it('allows adding a new column', () => {
    render(<KanbanBoard />);
    fireEvent.click(screen.getByText('Add Column'));
    expect(require('../store/kanbanStore').default().addColumn).toHaveBeenCalled();
  });

  it('allows searching for cards', () => {
    render(<KanbanBoard />);
    const searchInput = screen.getByPlaceholderText('Search cards...');
    fireEvent.change(searchInput, { target: { value: 'Task' } });
    expect(require('../store/kanbanStore').default().setSearchTerm).toHaveBeenCalledWith('Task');
  });

  it('allows undo and redo actions', () => {
    render(<KanbanBoard />);
    fireEvent.click(screen.getByLabelText('Undo'));
    expect(require('../store/kanbanStore').default().undo).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Redo'));
    expect(require('../store/kanbanStore').default().redo).toHaveBeenCalled();
  });
});

