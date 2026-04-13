import { Outlet } from "react-router-dom";
import Navbar from "../components/ProjectNavbar";

export default function ProjectLayout() {
  return (
    <div className="h-screen overflow-hidden flex bg-gray-50">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-4 min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}