import type { Task, TaskStatus } from "../types";

export function TaskCard({
  task,
  onDelete,
  onChangeStatus,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: TaskStatus) => void;
}) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <strong>{task.title}</strong>
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>

      {task.description && <p style={{ margin: "8px 0" }}>{task.description}</p>}

      <div style={{ display: "flex", gap: 8 }}>
        <button disabled={task.status === "TODO"} onClick={() => onChangeStatus(task.id, "TODO")}>
          TODO
        </button>
        <button disabled={task.status === "DOING"} onClick={() => onChangeStatus(task.id, "DOING")}>
          DOING
        </button>
        <button disabled={task.status === "DONE"} onClick={() => onChangeStatus(task.id, "DONE")}>
          DONE
        </button>
      </div>
    </div>
  );
}
