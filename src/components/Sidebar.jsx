"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const navItems = [
 { id: "dashboard", icon: "⬡", label: "Dashboard" },
 { id: "crm", icon: "◈", label: "Clients" },
 { id: "finances", icon: "◎", label: "Finances" },
 { id: "taches", icon: "◻", label: "Tâches" },
 { id: "wiki", icon: "◷", label: "Wiki" },
 { id: "alertes", icon: "◉", label: "Alertes" },
];

export default function Sidebar({ activeNav, setActiveNav, theme }) {
 const [collapsed, setCollapsed] = useState(false);
 const isDark = theme === "dark";

 const handleLogout = async () => {
   await supabase.auth.signOut();
   localStorage.removeItem("wolo_user_id");
   window.location.href = "/login";
 };

 return (
   <div style={{ width: collapsed ? 64 : 220, background: isDark ? "#111128" : "#FFFFFF", borderRight: `1px solid ${isDark ? "#1E1E38" : "#E5E7EB"}`, display: "flex", flexDirection: "column", padding: "24px 0", transition: "width 0.25s ease", flexShrink: 0, position: "relative", zIndex: 10, height: "100vh" }}>
     
     {/* Logo */}
     <div style={{ padding: "0 20px 28px", borderBottom: `1px solid ${isDark ? "#1E1E38" : "#E5E7EB"}`, marginBottom: 16, display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
       <img src="/logo.svg" style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 8 }} />
       {!collapsed && <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.08em", color: isDark ? "#E8E8F0" : "#111827", whiteSpace: "nowrap" }}>WOLO</span>}
     </div>

     {/* Navigation */}
     <nav style={{ flex: 1, padding: "0 10px" }}>
       {navItems.map((item) => (
         <button key={item.id} onClick={() => setActiveNav(item.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 12px", marginBottom: 4, background: activeNav === item.id ? "rgba(245,166,35,0.1)" : "transparent", border: "none", borderRadius: 10, cursor: "pointer", color: activeNav === item.id ? "#F5A623" : isDark ? "#6B6B8A" : "#6B7280", fontSize: 14, fontWeight: activeNav === item.id ? 600 : 400, textAlign: "left", borderLeft: activeNav === item.id ? "2px solid #F5A623" : "2px solid transparent", overflow: "hidden", whiteSpace: "nowrap" }}>
           <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
           {!collapsed && <span>{item.label}</span>}
         </button>
       ))}
     </nav>

     {/* Bouton Abonnement */}
     <div style={{ padding: "0 10px 8px" }}>
       <a href="/abonnement" style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 12px", background: "linear-gradient(135deg, rgba(245,166,35,0.15), rgba(232,131,10,0.1))", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 10, cursor: "pointer", color: "#F5A623", fontSize: 14, fontWeight: 600, textDecoration: "none", overflow: "hidden", whiteSpace: "nowrap" }}>
         <span style={{ fontSize: 18, flexShrink: 0 }}>⭐</span>
         {!collapsed && <span>Abonnement</span>}
       </a>
     </div>

     {/* Déconnexion */}
     <div style={{ padding: "0 10px 0" }}>
       <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 12px", background: "rgba(232,85,85,0.08)", border: "none", borderRadius: 10, cursor: "pointer", color: "#E85555", fontSize: 14, fontWeight: 500, textAlign: "left", overflow: "hidden", whiteSpace: "nowrap" }}>
         <span style={{ fontSize: 18, flexShrink: 0 }}>⏻</span>
         {!collapsed && <span>Déconnexion</span>}
       </button>
     </div>

     {/* Utilisateur */}
     <div style={{ padding: "16px 14px 0", borderTop: `1px solid ${isDark ? "#1E1E38" : "#E5E7EB"}`, marginTop: 10, display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
       <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7C7CF0, #5A5AE8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>JD</div>
       {!collapsed && <div><div style={{ fontSize: 13, fontWeight: 600, color: isDark ? "#E8E8F0" : "#111827" }}>Jhon D.</div><div style={{ fontSize: 11, color: isDark ? "#6B6B8A" : "#6B7280" }}>Admin</div></div>}
     </div>

     {/* Toggle collapse */}
     <button onClick={() => setCollapsed(!collapsed)} style={{ position: "absolute", top: 24, right: -12, width: 24, height: 24, borderRadius: "50%", background: isDark ? "#1A1A2E" : "#F3F4F6", border: `1px solid ${isDark ? "#2A2A45" : "#E5E7EB"}`, color: isDark ? "#6B6B8A" : "#6B7280", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
       {collapsed ? "▶" : "◀"}
     </button>
   </div>
 );
}
