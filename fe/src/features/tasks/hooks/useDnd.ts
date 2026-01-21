import type { DragEndEvent } from "@dnd-kit/core";

interface UseDnDParams{
   columns:{id:string} [];
   byColumn:Record<string,any[]>;
   move:(
    taskId:string,
    targetColumnId:string,
    beforeTaskId?:string,
    afterTaskId?:string
   ) => Promise<unknown>;
}

export function useDnd({columns,byColumn,move}:UseDnDParams){
    return async function handleDragEnd(event:DragEndEvent) {

        const {active,over} = event;
        if(!over) return;
        const taskId = String(active.id);
        const overId=String(over.id);
        if(taskId == overId) return;

        let sourceColumnId ="";
        for(const [colId,tasks] of Object.entries(byColumn)){
            if(tasks.some(t=>t.id === taskId)){
                sourceColumnId=colId;
                break;
            }
        }
        if(!sourceColumnId) return;

        let targetColumnId="";
        const isOverColumn = columns.some(col=>col.id === overId);
        if(isOverColumn){
            targetColumnId=overId;
        }else{
            for (const [colId,tasks] of Object.entries(byColumn)){
                if(tasks.some(t=>t.id ===overId)){
                    targetColumnId=colId;
                    break;
                }
            }
        }

        if(!targetColumnId) return;

        const targetTasks = byColumn[targetColumnId] ?? [];

        let beforeTaskId:string|undefined;
        let afterTaskId:string|undefined;

        //tha vao task khac
        if(!isOverColumn && overId !== taskId){
            const overIndex = targetTasks.findIndex(t=>t.id === overId);
            if(overIndex >= 0){
                afterTaskId=overId;
            }
        }

        try{
            await move(taskId,targetColumnId,beforeTaskId,afterTaskId);
        }catch(error){
            console.error("Fail to move task:",error)
        }
    }
}