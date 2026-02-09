import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProjects, deleteProject } from "../admin";
import { Folder, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";

export const ProjectManagement = () => {
    const queryClient = useQueryClient();
    const { data: projects, isLoading, error } = useQuery({
        queryKey: ["admin", "projects"],
        queryFn: getAllProjects,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
            toast.success("Project deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete project");
        },
    });

    const handleDelete = (projectId: string) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-900">
                Delete this project?
            </p>
            <p className="text-xs text-gray-500">
                This action cannot be undone. All tasks and data will be permanently removed.
            </p>

            <div className="flex justify-end gap-2 mt-2">
                <button
                onClick={() => toast.dismiss(t.id)}
                className="px-3 py-1.5 text-xs bg-gray-200 rounded"
                >
                Cancel
                </button>
                <button
                onClick={() => {
                    deleteMutation.mutate(projectId)
                    toast.dismiss(t.id)
                }}
                className="px-3 py-1.5 text-xs bg-red-600 text-white rounded"
                >
                Delete
                </button>
            </div>
            </div>
        ), {
            duration: Infinity,
        })
    }

    if (isLoading) return <div className="p-8">Loading projects...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading projects.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Project Management</h2>
                <div className="text-sm text-gray-500">
                    Total Projects: {projects?.length}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Project</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Owner</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Members</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Created At</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {projects?.map((project) => (
                            <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                            <Folder size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{project.name}</p>
                                            <p className="text-sm text-gray-500 truncate max-w-xs">{project.description || "No description"}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{project.owner?.username || "Unknown"}</div>
                                    <div className="text-xs text-gray-500">{project.owner?.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Users size={14} />
                                        <span className="text-sm">{project.members?.length || 0}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(project.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                                        title="Delete Project"
                                    >
                                        <Trash2 size={20} />
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
