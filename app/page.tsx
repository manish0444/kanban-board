"use client"

import dynamic from 'next/dynamic';

const KanbanBoard = dynamic(() => import('../components/KanbanBoard'), { ssr: false });

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Kanban Board</h1>
      <KanbanBoard />
    </main>
  );
}

