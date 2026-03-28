import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Bell, Globe2, Moon, Shield, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  const [emailEvents, setEmailEvents] = useState(true)
  const [emailWeekly, setEmailWeekly] = useState(false)
  const [productTips, setProductTips] = useState(true)
  const [compactSidebar, setCompactSidebar] = useState(false)
  const [language, setLanguage] = useState('en')
  const [theme, setTheme] = useState('system')

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] p-6">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Settings
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Placeholder preferences — wire these up when backend support is
              ready.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="h-9 rounded-lg border-gray-300 bg-white text-gray-700 shadow-none hover:bg-gray-50"
          >
            <Link to="/profile">View profile</Link>
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6B7C3F]/15 text-[#6B7C3F]">
                  <Bell className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Choose what you want to hear about (demo toggles only).
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="flex items-start gap-4">
                <Checkbox
                  id="email-events"
                  checked={emailEvents}
                  onCheckedChange={(v) => setEmailEvents(v === true)}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <Label htmlFor="email-events" className="text-gray-900">
                    Event reminders
                  </Label>
                  <p className="text-sm text-gray-500">
                    Email nudges before sessions you are involved in.
                  </p>
                </div>
              </div>
              <Separator className="bg-gray-100" />
              <div className="flex items-start gap-4">
                <Checkbox
                  id="email-weekly"
                  checked={emailWeekly}
                  onCheckedChange={(v) => setEmailWeekly(v === true)}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <Label htmlFor="email-weekly" className="text-gray-900">
                    Weekly summary
                  </Label>
                  <p className="text-sm text-gray-500">
                    A digest of activity across the platform.
                  </p>
                </div>
              </div>
              <Separator className="bg-gray-100" />
              <div className="flex items-start gap-4">
                <Checkbox
                  id="product-tips"
                  checked={productTips}
                  onCheckedChange={(v) => setProductTips(v === true)}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <Label htmlFor="product-tips" className="text-gray-900">
                    Tips & announcements
                  </Label>
                  <p className="text-sm text-gray-500">
                    Occasional product updates and best practices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200/80 text-slate-700">
                  <Globe2 className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">
                    Language & region
                  </CardTitle>
                  <CardDescription>
                    Display language for the interface (placeholder).
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="lang-select" className="text-gray-700">
                  Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger
                    id="lang-select"
                    className="h-11 max-w-md rounded-lg border-gray-200 bg-white"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español (placeholder)</SelectItem>
                    <SelectItem value="fr">Français (placeholder)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/90 text-amber-900">
                  <Moon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Theme preference for a future dark mode (placeholder).
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label htmlFor="theme-select" className="text-gray-700">
                  Theme
                </Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger
                    id="theme-select"
                    className="h-11 max-w-md rounded-lg border-gray-200 bg-white"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark (coming soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator className="bg-gray-100" />
              <div className="flex items-start gap-4">
                <Checkbox
                  id="compact-sidebar"
                  checked={compactSidebar}
                  onCheckedChange={(v) => setCompactSidebar(v === true)}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <Label htmlFor="compact-sidebar" className="text-gray-900">
                    Prefer compact navigation
                  </Label>
                  <p className="text-sm text-gray-500">
                    Tighter spacing in lists and side panels (demo only).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-dashed border-gray-300 bg-linear-to-br from-white to-gray-50/80 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                  <Shield className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">
                    Privacy & data
                  </CardTitle>
                  <CardDescription>
                    Export, retention, and consent tools will live here.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-lg text-sm text-gray-600">
                This section is a visual placeholder. When policies are
                finalized, you can add download-my-data, cookie controls, and
                linked accounts.
              </p>
              <Button
                type="button"
                disabled
                className="shrink-0 rounded-lg bg-[#6B7C3F] text-white hover:bg-[#5a6a35] disabled:opacity-60"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Coming soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
