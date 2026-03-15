import { useState, useEffect, type CSSProperties } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import {
  Home,
  Calendar,
  Users,
  BarChart2,
  TrendingUp,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { getAuth, signOut } from "firebase/auth"

type Item = {
  label: string
  to: string
  icon: React.ComponentType<{ size?: number }>
}

const TOP: Item[] = [
  { label: "Home", to: "/", icon: Home },
  { label: "Calendar", to: "/calendar", icon: Calendar },
  { label: "Volunteer Management System", to: "/vms", icon: Users },
  { label: "Events", to: "/events", icon: BarChart2 },
  { label: "Analytics", to: "/analytics", icon: TrendingUp },
]

const BOTTOM: Item[] = [
  { label: "Profile", to: "/profile", icon: UserIcon },
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Sign Out", to: "/logout", icon: LogOut },
]

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const collapsed = !expanded || isMobile
    const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const auth = getAuth()
      await signOut(auth)
      navigate({ to: '/login' })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        width: isMobile ? 64 : expanded ? 248 : 72,
        flexShrink: 0,
        height: "100vh",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!isMobile && (
        <button
          onClick={() => setExpanded((p) => !p)}
          style={{
            position: "absolute",
            top: "50%",
            right: -11,
            transform: "translateY(-50%)",
            width: 22,
            height: 22,
            borderRadius: 6,
            background: "#FFFFFF",
            border: "1px solid #BFC2C7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      )}
      <aside
        style={{
          width: "100%",
          height: "100%",
          background: "#DADBDD",
          padding: isMobile ? 8 : 12,
          boxSizing: "border-box",
          position: "relative",
          transition: "width 160ms ease",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          maxHeight: "100vh",
        }}
      >
        <nav style={{ paddingTop: 4, flex: "1 1 0", overflowY: "auto", minHeight: 0 }}>
          {collapsed ? <CollapsedTop items={TOP} /> : <ExpandedTop items={TOP} />}
        </nav>

        <div style={{ paddingTop: 10, flexShrink: 0, marginTop: "auto" }}>
          <div
            style={{
              height: 1,
              background: "#C9CCD1",
              margin: collapsed ? "8px 8px 10px" : "12px 8px 14px",
            }}
          />
          {collapsed ? (
            <CollapsedBottom items={BOTTOM} onLogout={handleLogout} />
          ) : (
            <ExpandedBottom items={BOTTOM} onLogout={handleLogout} />
          )}
        </div>
      </aside>
    </div>
  )
}

function ExpandedTop({ items }: { items: Item[] }) {
  return (
    <div>
      {items.map((it) => (
        <ExpandedTopItem key={it.to} item={it} />
      ))}
    </div>
  )
}

function ExpandedTopItem({ item }: { item: Item }) {
  const Icon = item.icon

  const base: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    borderRadius: 10,
    padding: "0 12px",
    margin: "0 4px 10px",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 700,
    transition:
      "background 120ms ease, color 120ms ease, box-shadow 120ms ease",
  }

  const inactive: CSSProperties = {
    ...base,
    background: "#F1F3F5",
    color: "#0E121B",
    boxShadow: "inset 0 0 0 1px #D5D8DD",
  }

  const active: CSSProperties = {
    ...base,
    background: "#0E121B",
    color: "#FFFFFF",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  }

  return (
    <Link
      to={item.to}
      activeProps={{ style: active }}
      inactiveProps={{ style: inactive }}
      activeOptions={{ exact: true }}
      preload="intent"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          minWidth: 0,
        }}
      >
        <Icon size={18} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 170,
          }}
          title={item.label}
        >
          {item.label}
        </span>
      </div>
      <span style={{ fontSize: 16, opacity: 0.85 }}>›</span>
    </Link>
  )
}

function CollapsedTop({ items }: { items: Item[] }) {
  return (
    <div style={{ display: "grid", rowGap: 10, justifyItems: "center" }}>
      {items.map((it) => (
        <CollapsedTopItem key={it.to} item={it} />
      ))}
    </div>
  )
}

function CollapsedTopItem({ item }: { item: Item }) {
  const Icon = item.icon

  const boxBase: CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    textDecoration: "none",
    transition:
      "background 120ms ease, color 120ms ease, box-shadow 120ms ease",
  }

  const inactive: CSSProperties = {
    ...boxBase,
    background: "#ECEFF2",
    color: "#0E121B",
    boxShadow: "inset 0 0 0 1px #D5D8DD",
  }

  const active: CSSProperties = {
    ...boxBase,
    background: "#3B4351",
    color: "#FFFFFF",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  }

  return (
    <Link
      to={item.to}
      activeProps={{ style: active }}
      inactiveProps={{ style: inactive }}
      activeOptions={{ exact: true }}
      preload="intent"
      title={item.label}
    >
      <Icon size={18} />
    </Link>
  )
}

function ExpandedBottom({
  items,
  onLogout,
}: {
  items: Item[]
  onLogout: () => void
}) {
  return (
    <div style={{ padding: "0 6px" }}>
      {items.map((it) => (
        <ExpandedBottomItem key={it.to} item={it} onLogout={onLogout} />
      ))}
    </div>
  )
}

function ExpandedBottomItem({
  item,
  onLogout,
}: {
  item: Item
  onLogout: () => void
}) {
  const Icon = item.icon

  const base: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
    padding: "0 6px",
    borderRadius: 8,
    marginBottom: 10,
    textDecoration: "none",
    color: "#0E121B",
    background: "transparent",
    transition: "background 120ms ease",
    fontSize: 13,
    fontWeight: 600,
  }

  const active: CSSProperties = {
    ...base,
    background: "#E6E8EB",
  }

    if (item.label === "Sign Out") {
    return (
      <button
        type="button"
        onClick={onLogout}
        style={{
          ...base,
          width: "100%",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon size={18} />
          <span>{item.label}</span>
        </div>
        <span style={{ fontSize: 16, opacity: 0.6 }}>›</span>
      </button>
    )
  }

  return (
    <Link
      to={item.to}
      activeProps={{ style: active }}
      inactiveProps={{ style: base }}
      activeOptions={{ exact: true }}
      preload="intent"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon size={18} />
        <span>{item.label}</span>
      </div>
      <span style={{ fontSize: 16, opacity: 0.6 }}>›</span>
    </Link>
  )
}

function CollapsedBottom({
  items,
  onLogout,
}: {
  items: Item[]
  onLogout: () => void
}) {
  return (
    <div
      style={{
        display: "grid",
        rowGap: 14,
        justifyItems: "center",
        paddingBottom: 6,
      }}
    >
      {items.map((it) => (
        <CollapsedBottomItem key={it.to} item={it} onLogout={onLogout} />
      ))}
    </div>
  )
}

function CollapsedBottomItem({
  item,
  onLogout,
}: {
  item: Item
  onLogout: () => void
}) {
  const Icon = item.icon

  const base: CSSProperties = {
    width: 24,
    height: 24,
    display: "grid",
    placeItems: "center",
    textDecoration: "none",
    color: "#3B4351",
    opacity: 0.9,
  }

  const active: CSSProperties = {
    ...base,
    color: "#0E121B",
    opacity: 1,
  }

  if (item.label === "Sign Out") {
    return (
      <button
        type="button"
        onClick={onLogout}
        style={{
          ...base,
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
        title={item.label}
      >
        <Icon size={18} />
      </button>
    )
  }

  return (
    <Link
      to={item.to}
      activeProps={{ style: active }}
      inactiveProps={{ style: base }}
      activeOptions={{ exact: true }}
      preload="intent"
      title={item.label}
    >
      <Icon size={18} />
    </Link>
  )
}
