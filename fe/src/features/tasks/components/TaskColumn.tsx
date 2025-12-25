import type { Task, TaskStatus } from "../types";
import { TaskCard } from "./TaskCard";
import "./task.css";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

const LABEL: Record<TaskStatus, string> = {
  TODO: "TO DO",
  INPROGRESS: "IN PROGRESS",
  DONE: "DONE",
};

export function TaskColumn({
  title,
  tasks,
  onDelete,
  onChangeStatus,
  onEdit,
}: {
  title: TaskStatus;
  tasks: Task[];
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: TaskStatus) => void;
  onEdit: (id: string, data: Partial<Pick<Task, "title" | "description">>) => Promise<void>;
}) {
  //Make the column a droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: title,
    data: { type: "COLUMN", status: title },
  });

  return (
    <div className={`column ${isOver ? "columnOver" : ""}`}>
      <div className="columnHeader">
        <div className="columnHeaderCenter">
          <span className="colTitle">{LABEL[title]}</span>
          <span className="badge">{tasks.length}</span>
        </div>
      </div>

      <div ref={setNodeRef} className="cards">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onDelete={onDelete}
              onChangeStatus={onChangeStatus}
              onEdit={onEdit}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && <div className="empty">Drop here</div>}
      </div>
    </div>
  );
}
