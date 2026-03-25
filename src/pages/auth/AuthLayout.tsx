import { Outlet } from "@tanstack/react-router";

export default function AuthLayout() {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-background">
      <div
        className="absolute inset-y-0 left-0 w-28 bg-[#6b7348]/22 sm:w-36 sm:bg-[#6b7348]/28"
        aria-hidden
      />
      <div
        className="absolute inset-y-0 right-0 w-28 bg-[#6b7348]/22 sm:w-36 sm:bg-[#6b7348]/28"
        aria-hidden
      />
      <div className="relative flex h-full w-full max-w-[calc(100%-7rem)] items-center justify-center px-2 sm:max-w-[calc(100%-18rem)] sm:px-4">
        <Outlet />
      </div>
    </div>
  )
}
