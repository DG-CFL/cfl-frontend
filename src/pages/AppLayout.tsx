import Sidebar from "@/components/Sidebar";
import { Outlet } from "@tanstack/react-router";

export default function AppLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
