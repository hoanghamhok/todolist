import api from '../../api/client'
import type { CreateTaskDto,ReorderTaskPayload } from './types'

export const tasksAPI = {
    getAll:() =>
        api.get(`/tasks/all`),

    create: (data: CreateTaskDto & { order: number }) =>
        api.post(`/tasks/create`, data),

    update:(id:string,data:any) =>
        api.patch(`/tasks/${id}`,data),

    updateStatus:(id:string,data:any) =>
        api.patch(`/tasks/${id}/status`,data),

    delete:(id:string) =>
        api.delete(`/tasks/${id}`),
    
}

//alias 
export const fetchTasks = tasksAPI.getAll
export const createTask = tasksAPI.create
export const updateTask = tasksAPI.update
export const updateTaskStatus = tasksAPI.updateStatus
export const deleteTask = tasksAPI.delete
export function reorderTasks(tasks: ReorderTaskPayload[]) {
    return api.patch("/tasks/reorder", { tasks }); // body: { tasks: [...] }
}