'use client'

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Column as ColumnType } from '../types/kanban';
import Card from './Card';
import useKanbanStore from '../store/kanbanStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash, Edit } from 'lucide-react';
import { DroppableProps } from '@hello-pangea/dnd';

const Droppable = dynamic(
  () => import('@hello-pangea/dnd').then((mod) => mod.Droppable as React.ComponentType<DroppableProps>),
  { ssr: false }
) as React.ComponentType<DroppableProps>;

const Draggable = dynamic(
  () => import('@hello-pangea/dnd').then(mod => mod.Draggable),
  { ssr: false }
);

interface ColumnProps {
  column: ColumnType;
  index: number;
}

const Column: React.FC<ColumnProps> = ({ column, index }) => {
  const { addCard, deleteColumn, editColumnTitle } = useKanbanStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const handleTitleEdit = () => {
    editColumnTitle(column.id, editedTitle);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided: any) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-gray-100 p-4 rounded-lg shadow-md w-72 flex-shrink-0"
        >
          <div className="flex justify-between items-center mb-4" {...provided.dragHandleProps}>
            {isEditing ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleEdit}
                onKeyPress={(e) => e.key === 'Enter' && handleTitleEdit()}
                autoFocus
              />
            ) : (
              <h2 className="text-lg font-semibold">{column.title}</h2>
            )}
            <div className="space-x-2">
              <Button onClick={() => setIsEditing(!isEditing)} variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button onClick={() => addCard(column.id, 'New Card')} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
              <Button onClick={() => deleteColumn(column.id)} variant="outline" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Droppable droppableId={column.id} type="CARD">
            {(provided: any) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {column.cards.map((card, cardIndex) => (
                  <Card key={card.id} card={card} index={cardIndex} columnId={column.id} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;

