import api from "../../api/client";
import type { Column } from "../tasks/types";

export interface User {
    id: string;
    email: string;
    username: string;
    role: "USER" | "SUPER_ADMIN";
    createdAt: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    owner: User;
    created_at: string;
    updated_at: string;
    members: any[];
    ownerId: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    projectId: string;
    columnId: string;
    created_at: string;
    assignees: any[];
    column:Column;
    project:Project;
    position:number;
    updateAt?:string;
    dueDate?: string;
    completedAt?: string;
    assigneeIds: string[];
}

export const getAllUsers = async (): Promise<User[]> => {
    const response = await api.get("/users/all");
    return response.data;
};

export const getAllProjects = async (): Promise<Project[]> => {
    const response = await api.get("/projects/all");
    return response.data;
};

export const getAllTasks = async (): Promise<Task[]> => {
    const response = await api.get("/tasks/all");
    return response.data;
};

export const getAllColumns = async (): Promise<Column[]> => {
    const response = await api.get("/columns/all");
    return response.data;
};

export const getStats = async () => {
    const [users, projects, tasks] = await Promise.all([
        getAllUsers(),
        getAllProjects(),
        getAllTasks()
    ]);
    return {
        totalUsers: users.length,
        totalProjects: projects.length,
        totalTasks: tasks.length
    };
};

export const updateUserRole = async (userId: string, role: "USER" | "SUPER_ADMIN") => {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
};

export const deleteProject = async (projectId: string) => {
    const response = await api.delete(`/projects/remove/${projectId}`);
    return response.data;
};

export const deleteTask = async (taskId: string) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
};

export const deleteUser = async (userId:string) => {
    const response = await api.delete(`/auth/DeleteUser/${userId}`);
    return response.data;
}
