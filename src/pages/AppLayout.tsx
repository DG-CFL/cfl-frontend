import Sidebar from "@/components/Sidebar";
import { Outlet } from "@tanstack/react-router";

export default function AppLayout() {
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  )
}
