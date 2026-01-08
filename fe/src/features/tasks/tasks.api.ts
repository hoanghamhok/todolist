import api from '../../api/client'
import type { CreateTaskRequest,UpdateTaskRequest } from './types'

export const tasksAPI = {
    getAll:() =>
        api.get(`/tasks/all`),
    create: (data: CreateTaskRequest) =>
        api.post(`/tasks/create`, data),
    update:(id:string,data:UpdateTaskRequest) =>
        api.patch(`/tasks/${id}`,data),
    delete:(id:string) =>
        api.delete(`/tasks/${id}`),
    move:(id:string,data:any) =>
        api.patch(`/tasks/${id}/move`,data)
}
//alias 
export const fetchTasks = tasksAPI.getAll
export const createTask = tasksAPI.create
export const updateTask = tasksAPI.update
export const deleteTask = tasksAPI.delete
export const moveTask   = tasksAPI.move