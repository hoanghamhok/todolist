import type { Task, TaskStatus } from "../types";
import { TaskCard } from "./TaskCard";

export function TaskColumn({
  title,
  tasks,
  onDelete,
  onChangeStatus,
}: {
  title: TaskStatus;
  tasks: Task[];
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: TaskStatus) => void;
}) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h2>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} onDelete={onDelete} onChangeStatus={onChangeStatus} />
        ))}
      </div>
    </div>
  );
}
