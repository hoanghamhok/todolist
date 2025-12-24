import { useEffect, useMemo, useState } from "react";
import type { Task, TaskStatus,ReorderTaskPayload } from "../types";
import { createTask, deleteTask, fetchTasks, updateTaskStatus,updateTask } from "../api";
import { reorderTasks} from "../api";

const STATUSES: TaskStatus[] = ["TODO", "INPROGRESS", "DONE"];

const STORAGE_KEY = "todolist"

//Parse Json
function safeParse<T>(value:string | null ,fallback:T):T{
  try{
    return value? (JSON.parse(value) as T) : fallback;
  }catch{
    return fallback;
  }
}

// Filters tasks by status, sorts them by order, reassigns order values
function normalizeOrders(all: Task[], status: TaskStatus) {
  const col = all.filter(t => t.status === status).sort((a,b)=>a.order-b.order);
  return col.map((t, idx) => ({ ...t, order: idx }));
}

export function useTask() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window == "undefined") return [];
    return safeParse<Task[]>(localStorage.getItem(STORAGE_KEY),[])
  });

  //Save when task changed
  useEffect(() =>{
    if (typeof window == "undefined") return;
    localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks))
  },[tasks]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTasks();
      setTasks(res.data);
    } catch (e: any) {
      setError(e?.message ?? "Load Task Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async (title: string, description?: string) => {
    const maxOrder = tasks.filter(t => t.status === "TODO").reduce((m, t) => Math.max(m, t.order), -1);
    const res = await createTask({ title, description, status: "TODO", order: maxOrder + 1 });
    setTasks(prev => [...prev, res.data]);
  };

  //Edit task (title/description/...)
  const edit = async (
    id: string,
    data: Partial<Pick<Task, "title" | "description" | "status" | "order">> & Record<string, any>
  ) => {
    const res = await updateTask(id, data);
    setTasks(prev => prev.map(t => (t.id === id ? res.data : t)));
    return res.data;
  };

  //Delete task
  const remove = async (id: string) => {
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  //Change status
  const changeStatus = async (id: string, status: TaskStatus) => {
    const res = await updateTaskStatus(id, { status });
    setTasks(prev => prev.map(t => (t.id === id ? res.data : t)));
  };

  //local reorder (optimistic)
  const reorderLocal = (next: Task[]) => {
    // normalize order per column so UI + payload clean
    let normalized = next;
    for (const s of STATUSES) {
      const updatedCol = normalizeOrders(normalized, s);
      const others = normalized.filter(t => t.status !== s);
      normalized = [...others, ...updatedCol];
    }
    setTasks(normalized);
    return normalized;
  };

  //call backend /reorder
  const reorder = async (nextTasks: Task[]) => {
    const payload: ReorderTaskPayload[] = nextTasks.map(t => ({
      id: t.id,
      status: t.status,
      order: t.order,
    }));
    await reorderTasks(payload);
  };

  // Group tasks by status and sort each group by order
  const grouped = useMemo(() => {
    const byStatus: Record<TaskStatus, Task[]> = { TODO: [], INPROGRESS: [], DONE: [] };
    for (const t of tasks) byStatus[t.status].push(t);
    (Object.keys(byStatus) as TaskStatus[]).forEach(s => byStatus[s].sort((a,b)=>a.order-b.order));
    return byStatus;
  }, [tasks]);
 
  //Find task s status
  const findStatusOfTask = (tasks: { id: string; status: TaskStatus }[], taskId: string) =>{
    return tasks.find((t) => t.id === taskId)?.status;
  }
  
  return { tasks, grouped, loading, error, reload: load, add, remove, changeStatus, reorderLocal, reorder,edit,findStatusOfTask};
}
