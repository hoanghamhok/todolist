import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "../types";

type Params = {
  event: DragEndEvent;
  tasks: Task[];
  grouped: Record<TaskStatus, Task[]>;
  reorder: (tasks: Task[]) => Promise<void>;
  reload: () => Promise<void>;
  reorderLocal: (tasks: Task[]) => Task[];
  findStatusOfTask: (tasks: { id: string; status: TaskStatus }[], taskId: string) => TaskStatus | undefined;
};

const STATUSES: TaskStatus[] = ["TODO", "INPROGRESS", "DONE"];

export async function handleDrag({
  event,
  tasks,
  grouped,
  reorder,
  reload,
  reorderLocal,
  findStatusOfTask,
}: Params) {
  const { active, over } = event;
  if (!over) return;//discard if not the right zone

  const activeId = String(active.id);
  const overId = String(over.id);
  if (activeId === overId) return;//do nothing if drag-end itself

  const activeStatus = findStatusOfTask(tasks, activeId);//current col
  if (!activeStatus) return;

  const overStatus =
    (STATUSES.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : findStatusOfTask(tasks, overId)) ?? activeStatus;//drop in col => col||task => task's status

  const from = grouped[activeStatus].map((t) => t.id);// tasks in old column
  const to = grouped[overStatus].map((t) => t.id);//task in new column

  const fromIndex = from.indexOf(activeId);//old pos

  const overIndex = to.indexOf(overId);
  let insertIndex = overIndex < 0 ? to.length : overIndex;//default insert before over task

  //if over is col => insert in the end
  if (STATUSES.includes(overId as TaskStatus)) {
    insertIndex = to.length;
  } else {
    // half down item=>insert after
    const overRect = over.rect;
    const activeRect = active.rect.current.translated ?? active.rect.current.initial;
  
    if (overRect && activeRect) {
      const activeMidY = activeRect.top + activeRect.height / 2;
      const overMidY = overRect.top + overRect.height / 2;
  
      const isAfter = activeMidY > overMidY;
      if (isAfter) insertIndex = overIndex + 1;
    }
  
    if (insertIndex > to.length) insertIndex = to.length;
  }

  //clone task and update status
  const next = tasks.map((t) => ({ ...t }));
  const moving = next.find((t) => t.id === activeId);
  if (!moving) return;
  moving.status = overStatus;

  const nextFromIds =
    activeStatus === overStatus ? to : from.filter((id) => id !== activeId);
  const nextToIds =
    activeStatus === overStatus
      ? arrayMove(to, fromIndex, insertIndex)//change pos in a array
      : (() => {
          const clone = [...to];
          clone.splice(insertIndex, 0, activeId);
          return clone;
        })();//drag to other col => del old,insert to insertIndex

  //reassign status and order for all
  for (const s of STATUSES) {
    let ids: string[];
    if (activeStatus === overStatus && s === activeStatus) {
      ids = nextToIds;
    } else if (s === activeStatus) {
      ids = nextFromIds;
    } else if (s === overStatus) {
      ids = nextToIds;
    } else {
      ids = grouped[s].map((t) => t.id);
    }
    ids.forEach((id, idx) => {
      const tt = next.find((x) => x.id === id);
      if (tt) {
        tt.status = s;
        tt.order = idx;
      }
    });
  }
  //normalize and save backend
  const normalized = reorderLocal(next);
  try {
    await reorder(normalized);
  } catch {
    await reload();
  }
}