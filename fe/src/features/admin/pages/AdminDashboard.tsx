import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../admin";
import { Users, LayoutList } from "lucide-react";

export const AdminDashboard = () => {
    const { data: users, isLoading } = useQuery({
        queryKey: ["admin", "users"],
        queryFn: getAllUsers,
    });

    if (isLoading) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    const stats = [
        {
            label: "Total Users",
            value: users?.length || 0,
            icon: Users,
            color: "bg-blue-500",
        },
        {
            label: "System Status",
            value: "Active",
            icon: LayoutList,
            color: "bg-green-500"
        }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
