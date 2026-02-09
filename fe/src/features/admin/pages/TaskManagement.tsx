import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllTasks, deleteTask} from "../admin";
import { CheckSquare, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export const TaskManagement = () => {
    const queryClient = useQueryClient();
    const { data: tasks, isLoading, error } = useQuery({
        queryKey: ["admin", "tasks"],
        queryFn: getAllTasks,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "tasks"] });
            toast.success("Task deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete task");
        },
    });

    const handleDelete = (taskId: string) => {
        toast((t) => (
            <div className="flex items-center gap-3">
            <span className="text-sm">
                Are you sure to delete this task?
            </span>
            <div className="flex gap-2">
                <button
                    onClick={() => {
                        deleteMutation.mutate(taskId)
                        toast.dismiss(t.id)
                    }}
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                >
                Delete
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="px-2 py-1 text-xs bg-gray-200 rounded"
                >
                Cancel
                </button>
            </div>
            </div>
        ), {
            duration: Infinity,
        })
    }

    if (isLoading) return <div className="p-8">Loading tasks...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading tasks.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Task Management</h2>
                <div className="text-sm text-gray-500">
                    Total Tasks: {tasks?.length}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Task</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Project</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tasks?.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                                            <CheckSquare size={16} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 truncate max-w-md">{task.title}</p>
                                        </div>
                                    </div>
                                </td>
                    
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {task.project.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                        {task.column?.title || task.columnId?.substring(0, 8)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(task.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                                        title="Delete Task"
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
