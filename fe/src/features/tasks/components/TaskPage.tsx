import { useTask } from "../hooks/useTasks";
import { TaskColumn } from "./TaskColumn";
import { TaskForm } from "./TaskForm";

export function TaskPage() {
  const { grouped, loading, error, add, remove, changeStatus, reload } = useTask();

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        Error: {error} <button onClick={reload}>Retry</button>
      </div>
    );

  return (
    <div style={{ padding: 16 }}>
      <h1>Tasks</h1>

      <TaskForm onSubmit={add} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 }}>
        <TaskColumn
          title="TODO"
          tasks={grouped.TODO}
          onDelete={remove}
          onChangeStatus={changeStatus}
        />
        <TaskColumn
          title="DOING"
          tasks={grouped.DOING}
          onDelete={remove}
          onChangeStatus={changeStatus}
        />
        <TaskColumn
          title="DONE"
          tasks={grouped.DONE}
          onDelete={remove}
          onChangeStatus={changeStatus}
        />
      </div>
    </div>
  );
}
