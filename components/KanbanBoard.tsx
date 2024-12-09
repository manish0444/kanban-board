'use client'

import React, { ReactNode, useState } from 'react';
import dynamic from 'next/dynamic';
import useKanbanStore from '../store/kanbanStore';
import Column from './Column';
import SearchBar from './SearchBar';
import { Button } from '@/components/ui/button';
import { Plus, Undo, Redo } from 'lucide-react';
import { DragDropContext, DroppableProvided, DropResult, DragStart } from '@hello-pangea/dnd';
import type { DroppableProps } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';

// Dynamically import the Droppable component with type assertion
const Droppable = dynamic(
  () => import('@hello-pangea/dnd').then((mod) => mod.Droppable as React.ComponentType<DroppableProps>),
  { ssr: false }
) as React.ComponentType<DroppableProps>;

const KanbanBoard: React.FC = () => {
  const { columns, addColumn, moveCard, moveColumn, searchTerm, undo, redo } = useKanbanStore();
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  
  const onDragStart = (start: DragStart) => {
    if (start.type === 'DEFAULT') {
      setDraggingCardId(start.draggableId);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    setDraggingCardId(null);
    
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
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided: DroppableProvided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-wrap gap-4"
            >
              {filteredColumns.map((column, index) => (
                <motion.div
                  key={column.id}
                  initial={false}
                  animate={{
                    scale: draggingCardId && !column.cards.find(card => card.id === draggingCardId) ? 1.05 : 1,
                    transition: { type: 'spring', stiffness: 300, damping: 30 }
                  }}
                >
                  <Column column={column} index={index} />
                </motion.div>
              ))}
              {provided.placeholder as ReactNode}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;

