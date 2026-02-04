import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, updateUserRole } from "../admin";
import { MoreHorizontal, Shield, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";

export const UserManagement = () => {
    const queryClient = useQueryClient();
    const { data: users, isLoading, error } = useQuery({
        queryKey: ["admin", "users"],
        queryFn: getAllUsers,
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: "USER" | "SUPER_ADMIN" }) =>
            updateUserRole(userId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
            toast.success("User role updated successfully");
        },
        onError: () => {
            toast.error("Failed to update user role");
        },
    });

    const handleRoleChange = (userId: string, currentRole: string) => {
        const newRole = currentRole === "USER" ? "SUPER_ADMIN" : "USER";
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            updateRoleMutation.mutate({ userId, role: newRole });
        }
    };

    if (isLoading) return <div className="p-8">Loading users...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading users.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                <div className="text-sm text-gray-500">
                    Total Users: {users?.length}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Created At</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users?.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {user.username?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.username || "No Username"}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.role === "SUPER_ADMIN"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-gray-100 text-gray-700"
                                        }`}>
                                        {user.role === "SUPER_ADMIN" ? <Shield size={12} /> : <UserIcon size={12} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleRoleChange(user.id, user.role)}
                                        className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                                        title="Change Role"
                                    >
                                        <MoreHorizontal size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
