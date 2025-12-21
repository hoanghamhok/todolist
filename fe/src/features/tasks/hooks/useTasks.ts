import { use, useEffect,useMemo,useState } from "react";
import type {Task,TaskStatus} from "../types";
import { createTask,updateTask,deleteTask,updateTaskStatus,fetchTasks } from "../api";

export function useTask(){
    const [tasks,setTasks] = useState<Task[]>([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState<string| null>(null);

    const load = async () =>{
        setLoading(true);
        setError(null);
        try{
            const res = await fetchTasks();
            setTasks(res.data);
        }catch(e:any){
            setError(e?.message ?? "Load Task Failed")
        }finally{
            setLoading(false)
        }
    };

    useEffect(()=>{
        load()
    },[]);

    const add = async (title:string,description?:string) =>{
        const res = await createTask(title,description ?? '');
        setTasks((prev) => [...prev,res.data])
    }

    const remove = async (id:string) => {
        const res = await deleteTask(id);
        setTasks((prev) => prev.filter((t) => t.id !== id))
    }

    const changeStatus = async (id:string,status:TaskStatus) => {
        const res = await updateTaskStatus(id,{status});
        setTasks((prev) => prev.map((t)=>(t.id === id ? res.data : t)))
    }

    const grouped = useMemo(() => {
        const byStatus: Record<TaskStatus, Task[]> = { TODO: [], DOING: [], DONE: [] };
        for (const t of tasks) byStatus[t.status].push(t);
        // nếu bạn muốn sort theo order:
        (Object.keys(byStatus) as TaskStatus[]).forEach((s) =>
          byStatus[s].sort((a, b) => a.order - b.order)
        );
        return byStatus;
      }, [tasks]);

    return { tasks, grouped, loading, error, reload: load, add, remove, changeStatus };
}
