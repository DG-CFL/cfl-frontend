import { Outlet } from '@tanstack/react-router'
import logo from '@/assets/cfl-logo.png'

export default function AuthSplitLayout() {
  return (
    <div className="flex w-full">
      <div className="w-1/2">
        <Outlet />
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center gap-4">
        <img
          src={logo}
          width={180}
          height={180}
          alt="Caring For Life"
          style={{ imageRendering: 'auto' }}
        />
        <p
          className="text-xl text-center italic max-w-[260px] leading-relaxed"
          style={{ color: '#6b7348', fontFamily: 'Georgia, serif' }}
        >
          Suicide Prevention is Everyone's Business.
        </p>
      </div>
    </div>
  )
}
