import { Outlet } from '@tanstack/react-router'
import logo from '@/assets/cfl-logo.png'

export default function AuthSplitLayout() {
  return (
    <div className="flex w-full">
      <div className="w-1/2">
        <Outlet />
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center gap-6">
        <img src={logo} width={220} alt="Caring for Life logo" />
        <p className="max-w-sm text-center text-2xl font-semibold text-[#6B7C3F]">
          Suicide prevention is everyone&apos;s business
        </p>
      </div>
    </div>
  )
}
