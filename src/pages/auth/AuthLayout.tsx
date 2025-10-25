import { Outlet } from "@tanstack/react-router";

export default function AuthLayout() {
  return (
    <div className="relative flex flex-col justify-center items-center w-screen h-screen">
      <div className="absolute left-0 top-0 h-full w-36 bg-lime-600/40"></div>
      <div className="absolute right-0 top-0 h-full w-36 bg-lime-600/40"></div>
       <div className="flex h-full w-full max-w-[calc(100%-18rem)] items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
