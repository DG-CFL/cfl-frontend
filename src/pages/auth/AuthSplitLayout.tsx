import { Outlet } from '@tanstack/react-router'
import logo from '@/assets/b0bcc1e094e7d036a3aeff9e780dc240edc44799.png'

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
