import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Home,
  Calendar,
  Users,
  BarChart2,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Item = { label: string; to: string; icon: any };

const TOP: Item[] = [
  { label: "Home", to: "/", icon: Home },
  { label: "Text", to: "/calendar", icon: Calendar },
  { label: "Volunteer Management System", to: "/vms", icon: Users },
  { label: "Text", to: "/stats", icon: BarChart2 },
];

const BOTTOM: Item[] = [
  { label: "Profile", to: "/profile", icon: UserIcon },
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Sign Out", to: "/logout", icon: LogOut },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const collapsed = !expanded;

  return (
    <aside
      style={{
        width: expanded ? 248 : 72,
        height: "100vh",
        background: "#DADBDD",
        padding: 12,
        boxSizing: "border-box",
        position: "relative",
        transition: "width 160ms ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <button
        onClick={() => setExpanded((p) => !p)}
        style={{
          position: "absolute",
          top: "50%",
          right: -10,
          transform: "translateY(-50%)",
          width: 22,
          height: 22,
          borderRadius: 6,
          background: "#ECEDEF",
          border: "1px solid #BFC2C7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      <nav style={{ paddingTop: 4 }}>
        {collapsed ? (
          <CollapsedTop items={TOP} />
        ) : (
          <ExpandedTop items={TOP} />
        )}
      </nav>

      <div style={{ paddingTop: 10 }}>
        <div
          style={{
            height: 1,
            background: "#C9CCD1",
            margin: collapsed ? "8px 8px 10px" : "12px 8px 14px",
          }}
        />
        {collapsed ? (
          <CollapsedBottom items={BOTTOM} />
        ) : (
          <ExpandedBottom items={BOTTOM} />
        )}
      </div>
    </aside>
  );
}

function ExpandedTop({ items }: { items: Item[] }) {
  return (
    <div>
      {items.map((it) => (
        <ExpandedTopItem key={it.to} item={it} />
      ))}
    </div>
  );
}

function ExpandedTopItem({ item }: { item: Item }) {
  const Icon = item.icon;

  const base = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    borderRadius: 10,
    padding: "0 12px",
    margin: "0 4px 10px",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 700 as const,
    transition: "background 120ms ease, color 120ms ease, box-shadow 120ms ease",
  };

  const inactive: React.CSSProperties = {
    ...base,
    background: "#F1F3F5",
    color: "#0E121B",
    boxShadow: "inset 0 0 0 1px #D5D8DD",
  };

  const active: React.CSSProperties = {
    ...base,
    background: "#0E121B",
    color: "#FFFFFF",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  };

  return (
    <Link
      to={item.to}
      activeProps={{ style: active }}
      inactiveProps={{ style: inactive }}
      activeOptions={{ exact: true }}
      preload="intent"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
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
  );
}

function CollapsedTop({ items }: { items: Item[] }) {
  return (
    <div style={{ display: "grid", rowGap: 10, justifyItems: "center" }}>
      {items.map((it) => (
        <CollapsedTopItem key={it.to} item={it} />
      ))}
    </div>
  );
}

function CollapsedTopItem({ item }: { item: Item }) {
  const Icon = item.icon;

  const boxBase: React.CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    textDecoration: "none",
    transition: "background 120ms ease, color 120ms ease, box-shadow 120ms ease",
  };

  const inactive: React.CSSProperties = {
    ...boxBase,
    background: "#ECEFF2",
    color: "#0E121B",
    boxShadow: "inset 0 0 0 1px #D5D8DD",
  };

  const active: React.CSSProperties = {
    ...boxBase,
    background: "#3B4351",
    color: "#FFFFFF",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  };

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
  );
}

function ExpandedBottom({ items }: { items: Item[] }) {
  return (
    <div style={{ padding: "0 6px" }}>
      {items.map((it) => (
        <ExpandedBottomItem key={it.to} item={it} />
      ))}
    </div>
  );
}

function ExpandedBottomItem({ item }: { item: Item }) {
  const Icon = item.icon;

  const base: React.CSSProperties = {
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
  };

  const active: React.CSSProperties = {
    ...base,
    background: "#E6E8EB",
  };

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
  );
}

function CollapsedBottom({ items }: { items: Item[] }) {
  return (
    <div style={{ display: "grid", rowGap: 14, justifyItems: "center", paddingBottom: 6 }}>
      {items.map((it) => (
        <CollapsedBottomItem key={it.to} item={it} />
      ))}
    </div>
  );
}

function CollapsedBottomItem({ item }: { item: Item }) {
  const Icon = item.icon;

  const base: React.CSSProperties = {
    width: 24,
    height: 24,
    display: "grid",
    placeItems: "center",
    textDecoration: "none",
    color: "#3B4351",
    opacity: 0.9,
  };

  const active: React.CSSProperties = {
    ...base,
    color: "#0E121B",
    opacity: 1,
  };

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
  );
}
