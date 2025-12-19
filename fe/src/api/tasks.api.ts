import api from '../api/client'

export const tasksAPI = {
    getAll:() =>
        api.get(`/tasks/all`),

    create:(title:string,description:string) =>
        api.post(`/tasks/create`,{title,description}),

    update:(id:string,data:any) =>
        api.patch(`/task/${id}`),

    updateStatus:(id:string,status:string) =>
        api.patch(`/task/${id}/status`),

    delete:(id:string) =>
        api.delete(`/tasks/${id}`),

    reorder:(tasks:{id:string,order:number}[])=>
        api.patch(`/tasks/reorder`,{tasks})
}

//alias 
export const fetchTasks = tasksAPI.getAll
export const createTask = tasksAPI.create
export const updateTask = tasksAPI.update
export const updateTaskStatus = tasksAPI.updateStatus
export const deleteTask = tasksAPI.delete
export const reorderTasks = tasksAPI.reorder