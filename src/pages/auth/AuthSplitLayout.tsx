import { Outlet } from '@tanstack/react-router'
import logo from '@/assets/cfl-logo.png'

export default function AuthSplitLayout() {
  return (
    <div className="flex w-full">
      <div className="w-1/2">
        <Outlet />
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <img src={logo} width={400}/>
      </div>
    </div>
  )
}
