import type { Task, Column } from "../types";
import { TaskCard } from "./TaskCard";
import "./task.css";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export function TaskColumn({
  column,
  tasks,
  onDelete,
  onEdit,
}: {
  column: Column;
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (
    id: string,
    data: Partial<Pick<Task, "title" | "description">>
  ) => Promise<void>;
}) {
  // 🔥 Column là droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "COLUMN",
      columnId: column.id,
    },
  });

  return (
    <div className={`column ${isOver ? "columnOver" : ""}`}>
      <div className="columnHeader">
        <div className="columnHeaderCenter">
          <span className="colTitle">{column.title}</span>
          <span className="badge">{tasks.length}</span>
        </div>
      </div>

      <div ref={setNodeRef} className="cards">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="empty">Drop here</div>
        )}
      </div>
    </div>
  );
}
