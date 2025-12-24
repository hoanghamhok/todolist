import { TaskColumn } from "./TaskColumn";
import { TaskForm } from "./TaskForm";
import { useTask } from "../hooks/useTasks";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type DragCancelEvent,
} from "@dnd-kit/core";
import { handleDrag } from "../drag/onDragEnd";
import type { Task } from "../types";

function TaskCardOverlay({ task }: { task: Task }) {
  return (
    <div style={{ width: 320, pointerEvents: "none" }}>
      <div className="card cardDragging" style={{ cursor: "grabbing" }}>
        <div className="cardTop">
          <div className="cardTitleWrap">
            <strong className="cardTitle">{task.title}</strong>
            {task.description && <p className="cardDesc">{task.description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TaskPage() {
  const {
    tasks,
    grouped,
    loading,
    error,
    add,
    remove,
    changeStatus,
    reload,
    reorder,
    edit,
    findStatusOfTask,
    reorderLocal,
  } = useTask();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  const activeTask = useMemo(
    () => (activeId ? tasks.find((t) => t.id === activeId) : undefined),
    [activeId, tasks]
  );

  const onDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
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

  const onDragCancel = useCallback((_event: DragCancelEvent) => {
    setActiveId(null);
  }, []);

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
        <h1>To Do List</h1>
        <TaskForm onSubmit={add} />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
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

          {createPortal(
            <DragOverlay
              adjustScale={false}
              dropAnimation={{
                duration: 180,
                easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
            >
              {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </div>
  );
}
