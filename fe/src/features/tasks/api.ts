import api from '../../api/client'
import type { Task } from './types'
import type { CreateTaskDto,TaskStatus } from './types'

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

    reorder:(tasks:{id:string,order:number}[])=>
        api.patch<Task[]>(`/tasks/reorder`,{tasks})
}

//alias 
export const fetchTasks = tasksAPI.getAll
export const createTask = tasksAPI.create
export const updateTask = tasksAPI.update
export const updateTaskStatus = tasksAPI.updateStatus
export const deleteTask = tasksAPI.delete
export const reorderTasks = tasksAPI.reorder