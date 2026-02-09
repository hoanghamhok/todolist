import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "../admin";
import { Users, Folder, CheckSquare } from "lucide-react";
import { UserManagement } from "./UserManagement";
import { ProjectManagement } from "./ProjectManagement";
import { TaskManagement } from "./TaskManagement";

export const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("users");
    const { data: statsData } = useQuery({
        queryKey: ["admin", "stats"],
        queryFn: getStats,
    });

    const tabs = [
        { id: "users", label: "Users", icon: Users },
        { id: "projects", label: "Projects", icon: Folder },
        { id: "tasks", label: "Tasks", icon: CheckSquare },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Users" value={statsData?.totalUsers || 0} icon={Users} color="bg-blue-500" />
                <StatCard label="Total Projects" value={statsData?.totalProjects || 0} icon={Folder} color="bg-orange-500" />
                <StatCard label="Total Tasks" value={statsData?.totalTasks || 0} icon={CheckSquare} color="bg-green-500" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                <div className="flex gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex-1 justify-center
                                ${activeTab === tab.id
                                    ? "bg-gray-100 text-gray-900 shadow-sm border border-gray-200"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                {activeTab === "users" && <UserManagement />}
                {activeTab === "projects" && <ProjectManagement />}
                {activeTab === "tasks" && <TaskManagement />}
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color} text-white`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);
