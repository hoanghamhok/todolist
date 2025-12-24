  import { TaskColumn } from "./TaskColumn";
  import { TaskForm } from "./TaskForm";
  import { useTask } from "../hooks/useTasks";
  import { useCallback } from "react";
  import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
  } from "@dnd-kit/core";
  import type { DragEndEvent } from "@dnd-kit/core";
  import { handleDrag } from "../drag/onDragEnd";

  export function TaskPage() {
    const { tasks, grouped, loading, error, add, remove, changeStatus, reload, reorder, edit,findStatusOfTask,reorderLocal } = useTask();

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

    const onDragEnd = useCallback(
      (event: DragEndEvent) => {
        void handleDrag({
          event,
          tasks,
          grouped,
          reorder,
          reload,
          reorderLocal,
          findStatusOfTask,
        });
      },
      [tasks, grouped, reorder, reload, reorderLocal, findStatusOfTask]
    );

    if (loading) return <div>Loading...</div>;
    if (error)
      return (
        <div>
          Error: {error} <button onClick={reload}>Retry</button>
        </div>
      );
  
    return (
      <div className="app-wrapper">
        <div className="app-container">
          <h1>Tasks</h1>
          <TaskForm onSubmit={add} />

          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
            <div className="columns">
              <TaskColumn
                title="TODO"
                tasks={grouped.TODO}
                onDelete={remove}
                onChangeStatus={changeStatus}
                onEdit={edit}
              />
              <TaskColumn
                title="INPROGRESS"
                tasks={grouped.INPROGRESS}
                onDelete={remove}
                onChangeStatus={changeStatus}
                onEdit={edit}
              />
              <TaskColumn
                title="DONE"
                tasks={grouped.DONE}
                onDelete={remove}
                onChangeStatus={changeStatus}
                onEdit={edit}
              />
            </div>
          </DndContext>
        </div>
      </div>
    );
  }
