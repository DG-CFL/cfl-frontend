import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  Calendar,
  KeyRound,
  Mail,
  Shield,
  Smartphone,
  User as UserIcon,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type { User } from 'firebase/auth'

import type { UserRole } from '@/types/auth'
import { useCurrentUser } from '@/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

function formatRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    CFL: 'CFL',
    admin: 'Administrator',
    trainer: 'Trainer',
    public: 'Public',
  }
  return labels[role]
}

function formatProviderId(id: string): string {
  if (id === 'password') return 'Email & password'
  if (id === 'google.com') return 'Google'
  if (id === 'apple.com') return 'Apple'
  return id
}

function formatFirebaseDate(iso: string | undefined): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

function initials(name: string, email: string | null): string {
  const n = name.trim()
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      const first = parts[0]
      const last = parts[parts.length - 1]
      if (first && last) {
        const a = first.charAt(0)
        const b = last.charAt(0)
        if (a && b) return (a + b).toUpperCase()
      }
    }
    return n.slice(0, 2).toUpperCase()
  }
  if (email) return email.slice(0, 2).toUpperCase()
  return '?'
}

export default function ProfilePage() {
  const account = useCurrentUser()
  const [fbUser, setFbUser] = useState<User | null>(null)

  useEffect(() => {
    const auth = getAuth()
    return onAuthStateChanged(auth, setFbUser)
  }, [])

  const displayName =
    (account ? account.name.trim() : '') ||
    fbUser?.displayName?.trim() ||
    ''
  const email = fbUser?.email ?? null
  const photoUrl = fbUser?.photoURL ?? null

  const signInMethods = useMemo(() => {
    const list = fbUser?.providerData ?? []
    return list.map((p) => formatProviderId(p.providerId))
  }, [fbUser])

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] p-6">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Profile
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Your account information from sign-in and CFL access.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="h-9 rounded-lg border-gray-300 bg-white text-gray-700 shadow-none hover:bg-gray-50"
          >
            <Link to="/settings">Settings</Link>
          </Button>
        </div>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-6">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt=""
                  className="h-24 w-24 shrink-0 rounded-2xl border border-gray-200 object-cover shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-[#6B7C3F]/15 text-2xl font-bold text-[#4d5a2d]"
                  aria-hidden
                >
                  {initials(displayName, email)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <CardTitle className="text-2xl text-gray-900">
                  {displayName || 'No display name'}
                </CardTitle>
                <CardDescription className="mt-2 text-base text-gray-600">
                  {email ?? 'No email on file'}
                </CardDescription>
                {account && (
                  <span className="mt-3 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    {formatRoleLabel(account.role)}
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Details
            </h2>
            <dl className="grid gap-0 sm:grid-cols-1">
              <DetailRow
                icon={UserIcon}
                label="User ID"
                value={account?.userId ?? fbUser?.uid ?? '—'}
                mono
              />
              <Separator className="my-1 bg-gray-100" />
              <DetailRow
                icon={Shield}
                label="Role"
                value={
                  account ? formatRoleLabel(account.role) : '—'
                }
              />
              <Separator className="my-1 bg-gray-100" />
              <DetailRow
                icon={Mail}
                label="Email"
                value={email ?? '—'}
              />
              <Separator className="my-1 bg-gray-100" />
              <DetailRow
                icon={Shield}
                label="Email verified"
                value={
                  fbUser
                    ? fbUser.emailVerified
                      ? 'Yes'
                      : 'No'
                    : '—'
                }
              />
              <Separator className="my-1 bg-gray-100" />
              <DetailRow
                icon={Smartphone}
                label="Phone"
                value={fbUser?.phoneNumber || '—'}
              />
              <Separator className="my-1 bg-gray-100" />
              <DetailRow
                icon={Calendar}
                label="Account created"
                value={formatFirebaseDate(fbUser?.metadata.creationTime)}
              />
              <Separator className="my-1 bg-gray-100" />
              <DetailRow
                icon={Calendar}
                label="Last sign-in"
                value={formatFirebaseDate(fbUser?.metadata.lastSignInTime)}
              />
              <Separator className="my-1 bg-gray-100" />
              <DetailRow
                icon={KeyRound}
                label="Sign-in methods"
                value={
                  signInMethods.length > 0
                    ? signInMethods.join(', ')
                    : '—'
                }
              />
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex gap-4 py-3 sm:items-start">
      <div className="mt-0.5 shrink-0 text-gray-400">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </dt>
        <dd
          className={`mt-1 text-sm text-gray-900 ${mono ? 'break-all font-mono text-[13px]' : ''}`}
        >
          {value}
        </dd>
      </div>
    </div>
  )
}
