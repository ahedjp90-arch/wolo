"use client";
import { useState } from "react";

const navItems = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "crm", icon: "◈", label: "Clients" },
  { id: "finances", icon: "◎", label: "Finances" },
  { id: "taches", icon: "◻", label: "Tâches" },
  { id: "wiki", icon: "◷", label: "Wiki" },
  { id: "alertes", icon: "◉", label: "Alertes" },
];

export default function Sidebar({ activeNav, setActiveNav }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ width: collapsed ? 64 : 220, background: "#111128", borderRight: "1px solid #1E1E38", display: "flex", flexDirection: "column", padding: "24px 0", transition: "width 0.25s ease", flexShrink: 0, position: "relative", zIndex: 10, height: "100vh" }}>
      <div style={{ padding: "0 20px 28px", borderBottom: "1px solid #1E1E38", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
        <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #F5A623, #E8830A)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#0F0F1A", flexShrink: 0 }}>W</div>
        {!collapsed && <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.08em", color: "#E8E8F0", whiteSpace: "nowrap" }}>WOLO</span>}
      </div>
      <nav style={{ flex: 1, padding: "0 10px" }}>
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setActiveNav(item.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 12px", marginBottom: 4, background: activeNav === item.id ? "rgba(245,166,35,0.1)" : "transparent", border: "none", borderRadius: 10, cursor: "pointer", color: activeNav === item.id ? "#F5A623" : "#6B6B8A", fontSize: 14, fontWeight: activeNav === item.id ? 600 : 400, textAlign: "left", borderLeft: activeNav === item.id ? "2px solid #F5A623" : "2px solid transparent", overflow: "hidden", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
      <div style={{ padding: "16px 14px 0", borderTop: "1px solid #1E1E38", display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7C7CF0, #5A5AE8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>JD</div>
        {!collapsed && <div><div style={{ fontSize: 13, fontWeight: 600, color: "#E8E8F0" }}>Jhon D.</div><div style={{ fontSize: 11, color: "#6B6B8A" }}>Admin</div></div>}
      </div>
      <button onClick={() => setCollapsed(!collapsed)} style={{ position: "absolute", top: 24, right: -12, width: 24, height: 24, borderRadius: "50%", background: "#1A1A2E", border: "1px solid #2A2A45", color: "#6B6B8A", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{collapsed ? "▶" : "◀"}</button>
    </div>
  );
}
