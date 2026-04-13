import { Outlet } from "react-router-dom";
import Navbar from "../components/ProjectNavbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] dark:bg-slate-900">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}