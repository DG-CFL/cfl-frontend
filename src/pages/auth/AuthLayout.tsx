import { Outlet } from "@tanstack/react-router";

export default function AuthLayout() {
  return (
    <div className="flex flex-col gap-10 justify-center items-center w-screen h-screen">
      <Outlet/>
    </div>
  )
}
