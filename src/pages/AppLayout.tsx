import Sidebar from "@/components/Sidebar";
import { Outlet } from "@tanstack/react-router";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen overflow-x-visible">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
