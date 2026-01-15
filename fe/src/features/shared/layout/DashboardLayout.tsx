import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../../auth/hooks/useAuth";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="h-screen bg-gray-50">
      {/* Navbar (fixed) */}
      <Navbar
        user={user}
        notifications={[]}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeMenu="dashboard"
        />

        {/* Content */}
        <div className="flex-1 lg:ml-64 flex flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
