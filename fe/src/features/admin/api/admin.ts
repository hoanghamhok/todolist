import api from "../../../api/client"

export interface User {
    id: string;
    email: string;
    username: string;
    role: "USER" | "SUPER_ADMIN";
    createdAt: string;
}

export const getAllUsers = async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
};

export const getStats = async () => {
    const users = await getAllUsers();
    return {
        totalUsers: users.length,
        activeProjects: 0 // Placeholder
    };
};



export const updateUserRole = async (userId: string, role: "USER" | "SUPER_ADMIN") => {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
};
