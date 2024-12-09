'use client'

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card as CardType } from '../types/kanban';
import useKanbanStore from '../store/kanbanStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit } from 'lucide-react';
import { Trash2 } from 'lucide-react';

const Draggable = dynamic(
  () => import('@hello-pangea/dnd').then(mod => mod.Draggable),
  { ssr: false }
);

interface CardProps {
  card: CardType;
  index: number;
  columnId: string;
}

const Card: React.FC<CardProps> = ({ card, index, columnId }) => {
  const { editCard, deleteCard } = useKanbanStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(card.content);

  const handleContentEdit = () => {
    editCard(columnId, card.id, editedContent);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided: any) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-3 rounded shadow-sm"
        >
          {isEditing ? (
            <Input
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onBlur={handleContentEdit}
              onKeyPress={(e) => e.key === 'Enter' && handleContentEdit()}
              autoFocus
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{card.content}</span>
              <div>
                <Button onClick={() => setIsEditing(true)} variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button onClick={() => deleteCard(columnId, card.id)} variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Card;

