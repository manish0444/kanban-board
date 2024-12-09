'use client'

import React from 'react';
import dynamic from 'next/dynamic';
import useKanbanStore from '../store/kanbanStore';
import Column from './Column';
import SearchBar from './SearchBar';
import { Button } from '@/components/ui/button';
import { Plus, Undo, Redo } from 'lucide-react';

const DragDropContext = dynamic(
  () => import('@hello-pangea/dnd').then(mod => mod.DragDropContext),
  { ssr: false }
);

const Droppable = dynamic(
  () => import('@hello-pangea/dnd').then(mod => mod.Droppable),
  { ssr: false }
);

const KanbanBoard: React.FC = () => {
  const { columns, addColumn, moveCard, moveColumn, searchTerm, setSearchTerm, undo, redo } = useKanbanStore();

  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === 'COLUMN') {
      moveColumn(source.index, destination.index);
    } else {
      moveCard(source.droppableId, destination.droppableId, source.index, destination.index);
    }
  };

  const filteredColumns = columns.map(column => ({
    ...column,
    cards: column.cards.filter(card => 
      card.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(column => column.cards.length > 0 || column.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <SearchBar />
        <div className="space-x-2">
          <Button onClick={undo} variant="outline" size="icon">
            <Undo className="h-4 w-4" />
          </Button>
          <Button onClick={redo} variant="outline" size="icon">
            <Redo className="h-4 w-4" />
          </Button>
          <Button onClick={() => addColumn('New Column')} variant="outline">
            <Plus className="h-4 w-4 mr-2" /> Add Column
          </Button>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided: any) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-wrap gap-4"
            >
              {filteredColumns.map((column, index) => (
                <Column key={column.id} column={column} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;

