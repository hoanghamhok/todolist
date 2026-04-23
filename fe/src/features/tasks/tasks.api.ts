import api from '../../api/client'
import type { CreateTaskRequest, UpdateTaskRequest } from './types'

export const tasksAPI = {
  getAll: () =>
    api.get(`/tasks`),

  getMyTasks: () =>
    api.get(`/tasks/my-tasks`),

  getByProjectId: (projectId: string) => 
    api.get(`/tasks/project/${projectId}`),
    
  getById: (id: string) =>
    api.get(`/tasks/detail/${id}`),

  create: (data: CreateTaskRequest) =>
    api.post(`/tasks`, data),

  update: (id: string, data: UpdateTaskRequest) =>
    api.patch(`/tasks/${id}`, data),

  move: (id: string, data: any) =>
    api.patch(`/tasks/${id}/move`, data),

  delete: (id: string) =>
    api.delete(`/tasks/${id}`),

  block: (id: string, reason: string) =>
    api.post(`/tasks/${id}/block`, { reason }),

  unblock: (id: string) =>
    api.post(`/tasks/${id}/unblock`),

  getBlockHistory: (id: string) =>
    api.get(`/tasks/${id}/block-history`),

  getDependencies: (id: string) =>
    api.get(`/tasks/${id}/dependencies`),

  addDependency: (id: string, dependsOnTaskId: string) =>
    api.post(`/tasks/${id}/dependencies`, { dependsOnTaskId }),

  removeDependency: (id: string, dependsOnTaskId: string) =>
    api.delete(`/tasks/${id}/dependencies/${dependsOnTaskId}`),
}

export const fetchTasks = tasksAPI.getAll
export const fetchMyTasks = tasksAPI.getMyTasks
export const fetchTasksByProjectID = tasksAPI.getByProjectId
export const fetchTaskById = tasksAPI.getById

export const createTask = tasksAPI.create
export const updateTask = tasksAPI.update
export const deleteTask = tasksAPI.delete
export const moveTask = tasksAPI.move