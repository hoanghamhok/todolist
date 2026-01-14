import { useState } from "react";
import Navbar from "../../shared/components/Navbar";
import Sidebar from "../../shared/components/Sidebar";
import { useProjects } from "../../projects/hooks/useProjects";
import { useAuth } from "../../auth/hooks/useAuth";
import { Clock } from "lucide-react";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const {
    data: projects,
    isLoading,
    isError,
  } = useProjects();
  console.log("PROJECTS:", projects);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        notifications={[]}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeMenu="dashboard"
      />

      <main className="lg:ml-64 pt-16 p-8">
        {isLoading && <p>Loading projects...</p>}
        {isError && <p className="text-red-500">Failed to load projects</p>}

        <div className="pt-6 pb-4 font-bold">
          <h2 className="flex gap-2"><Clock/>Đã xem gần đây</h2>
        </div>
        <div className="bg-white w-1/4 p-6 rounded-lg border">
              <h3 className="font-semibold">
                Project Mẫu
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Mô tả mẫu
              </p>
        </div>
        <div className="pt-6 font-bold">
          Tất cả các dự án của bạn
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {projects?.map((item) => (
            <div
              key={item.project.id}
              className="bg-white p-6 rounded-lg border"
            >
              <h3 className="font-semibold">
                {item.project.name}
              </h3>

              <p className="text-sm text-gray-600 mb-2">
                {item.project.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;