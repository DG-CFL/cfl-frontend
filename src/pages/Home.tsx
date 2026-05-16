import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BarChart2,
  Calendar,
  Heart,
  Leaf,
  Phone,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'

import { useCurrentUser } from '@/auth/AuthProvider'
import heroImage from '@/assets/b0bcc1e094e7d036a3aeff9e780dc240edc44799.png'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const quickLinks = [
  {
    title: 'Calendar',
    description: 'View schedules and upcoming activities.',
    to: '/calendar',
    icon: Calendar,
  },
  {
    title: 'Events',
    description: 'Manage and explore community events.',
    to: '/events',
    icon: BarChart2,
  },
  {
    title: 'Volunteer system',
    description: 'Coordinate volunteers and outreach.',
    to: '/vms',
    icon: Users,
  },
  {
    title: 'Analytics',
    description: 'Reports and insights at a glance.',
    to: '/analytics',
    icon: TrendingUp,
  },
] as const

export default function Home() {
  const user = useCurrentUser()
  const displayName = user?.name?.trim() || 'there'

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#eef1ea]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(107, 124, 63, 0.18) 0%, transparent 45%),
            radial-gradient(circle at 80% 60%, rgba(61, 79, 46, 0.12) 0%, transparent 40%),
            linear-gradient(180deg, #f7f9f4 0%, #eef1ea 55%, #e8ece3 100%)`,
        }}
      />

      <main className="relative mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#5a6b45] sm:text-left">
          Caring For Life
        </p>

        <div className="overflow-hidden rounded-3xl border border-[#d4dcc8] bg-white/90 shadow-[0_24px_60px_-20px_rgba(45,55,35,0.18)] backdrop-blur-sm">
          <div className="grid lg:grid-cols-12 lg:gap-0">
            <div className="relative flex flex-col justify-center px-6 py-10 sm:px-10 lg:col-span-5 lg:py-14 lg:pl-12 lg:pr-8">
              <div
                className="pointer-events-none absolute -right-20 top-1/2 hidden h-[120%] w-40 -translate-y-1/2 bg-linear-to-r from-white/95 to-transparent lg:block"
                aria-hidden
              />
              <div className="relative z-1 flex items-center gap-2 text-[#4d5c3a]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6B7C3F]/15">
                  <Leaf className="h-4 w-4 text-[#5a6d38]" strokeWidth={2} />
                </span>
                <span className="text-sm font-medium text-[#5c6d47]">
                  Welcome back
                </span>
              </div>
              <h1 className="relative z-1 mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#2a3320] sm:text-4xl">
                Hi, {displayName}
              </h1>
              <p className="relative z-1 mt-4 max-w-md text-base leading-relaxed text-[#4a5540]">
                You are not alone. Use the tools below to stay connected with
                events, volunteers, and the community we serve together.
              </p>
              <div className="relative z-1 mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="h-11 rounded-xl bg-[#4d5c3a] px-6 text-base font-semibold text-white shadow-md hover:bg-[#3d4a2e]"
                >
                  <Link to="/calendar">
                    Open calendar
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-xl border-[#c5cfba] bg-white/80 text-[#3d4a2e] hover:bg-[#f4f7ef]"
                >
                  <Link to="/events">Browse events</Link>
                </Button>
              </div>
            </div>

            <div className="relative min-h-[280px] lg:col-span-7 lg:min-h-[420px]">
              <img
                src={heroImage}
                alt="Two people sitting together on a bench in a sunlit park, sharing a supportive moment."
                className="h-full w-full object-cover object-[center_25%] sm:object-[center_20%]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#2a3320]/50 via-transparent to-[#2a3320]/10 lg:bg-linear-to-l lg:from-transparent lg:via-transparent lg:to-white/90" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1 rounded-2xl border border-white/25 bg-black/35 px-4 py-3 text-white shadow-lg backdrop-blur-md sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm">
                <p className="font-serif text-lg font-semibold tracking-wide sm:text-xl">
                  You are not alone.
                </p>
                <p className="text-xs text-white/85 sm:text-sm">
                  Support is here when you need it.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <a
          href="tel:+6567891234"
          className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#c5cfba] bg-linear-to-br from-[#5a6d38] to-[#3d4a2e] px-6 py-5 text-white shadow-lg sm:flex-row sm:px-8"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Phone className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#dfe8d4]">
                HOPE hotline · 24/7
              </p>
              <p className="text-lg font-semibold sm:text-xl">+65 6789 1234</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium ring-1 ring-white/20">
            <Heart className="h-4 w-4 shrink-0" aria-hidden />
            Tap to call
          </span>
        </a> */}

        <div className="mt-12">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-[#2a3320]">
                <Sparkles className="h-5 w-5 text-[#6B7C3F]" aria-hidden />
                Your workspace
              </h2>
              <p className="mt-1 text-sm text-[#5c6654]">
                Shortcuts to the areas you use most.
              </p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {quickLinks.map(({ title, description, to, icon: Icon }) => (
              <Link key={to} to={to} className="group block h-full">
                <Card className="h-full border-[#d4dcc8] bg-white/95 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b8c4a8] hover:shadow-md">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#6B7C3F]/12 text-[#4d5c3a] transition-colors group-hover:bg-[#6B7C3F]/20">
                      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg text-[#2a3320]">
                        {title}
                      </CardTitle>
                      <CardDescription className="mt-1.5 text-[#5c6654]">
                        {description}
                      </CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-[#9aaa8c] transition-transform group-hover:translate-x-0.5 group-hover:text-[#5a6d38]" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <span className="text-sm font-medium text-[#6B7C3F]">
                      Go to {title.toLowerCase()}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <footer className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#d4dcc8] pt-10 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3 text-[#5c6654]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6B7C3F]/12">
              <Leaf className="h-5 w-5 text-[#5a6d38]" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#3d4a2e]">
                caringforlife.sg
              </p>
              <p className="text-xs text-[#6b7568]">
                Community, care, and connection.
              </p>
            </div>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-[#7a8474]">
            Need account or access changes? Contact your administrator or use
            Profile &amp; Settings from the sidebar.
          </p>
        </footer>
      </main>
    </div>
  )
}
