import React, { useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

interface DragContextProviderProps {
  children: React.ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
}

export function DragContextProvider({ children, onDragEnd }: DragContextProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(event) => {
        setActiveId(String(event.active.id));
      }}
      onDragEnd={(event) => {
        setActiveId(null);
        onDragEnd(event);
      }}
    >
      {children}
      <DragOverlay>
        {activeId ? (
          <div className="bg-blue-100 border-2 border-blue-500 rounded-2xl p-2.5 shadow-xl opacity-90">
            Dragging...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
