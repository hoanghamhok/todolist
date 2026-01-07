import { useState } from "react";
import Navbar from "../../shared/components/Navbar";
import Sidebar from "../../shared/components/Sidebar";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const mockNotifications = [
    { id: 1, message: 'Alice assigned you a new task', time: '5 minutes ago', read: false },
    { id: 2, message: 'Project "Website Redesign" deadline is tomorrow', time: '1 hour ago', read: false },
    { id: 3, message: 'Bob commented on your task', time: '2 hours ago', read: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        user={mockUser}
        notifications={mockNotifications}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeMenu="dashboard"
      />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to TaskBoard</h1>
            <p className="text-gray-600 mb-8">
              This is a demo of the Navbar and Sidebar components. Try resizing your browser to see the responsive behavior.
            </p>

            {/* Demo Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Card {i}</h3>
                  <p className="text-gray-600 text-sm">
                    This is sample content to demonstrate the layout with navbar and sidebar.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;