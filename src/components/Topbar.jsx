"use client";
import { useState, useEffect } from "react";

export default function Topbar({ activeNav, theme, setTheme }) {
 const titres = {
   dashboard: "Dashboard",
   crm: "Clients",
   finances: "Finances",
   taches: "Tâches",
   wiki: "Wiki",
   alertes: "Alertes",
 };

 const isDark = theme === "dark";

 return (
   <div style={{ padding: "20px 32px", borderBottom: `1px solid ${isDark ? "#1E1E38" : "#E5E7EB"}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: isDark ? "#0F0F1A" : "#F3F4F6", flexShrink: 0 }}>
     <div>
       <div style={{ fontSize: 22, fontWeight: 700, color: isDark ? "#E8E8F0" : "#111827" }}>
         {titres[activeNav] || "Dashboard"}
       </div>
       <div style={{ fontSize: 13, color: isDark ? "#6B6B8A" : "#6B7280", marginTop: 2 }}>
         Vendredi 12 juin 2026
       </div>
     </div>
     <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
       {/* Toggle thème */}
       <button onClick={() => setTheme(isDark ? "light" : "dark")}
         style={{ background: isDark ? "#1A1A2E" : "#E5E7EB", border: `1px solid ${isDark ? "#2A2A45" : "#D1D5DB"}`, borderRadius: 20, color: isDark ? "#E8E8F0" : "#374151", padding: "8px 16px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
         {isDark ? "☀️ Clair" : "🌙 Sombre"}
       </button>
       <button style={{ background: isDark ? "#1A1A2E" : "#E5E7EB", border: `1px solid ${isDark ? "#2A2A45" : "#D1D5DB"}`, borderRadius: 8, color: isDark ? "#E8E8F0" : "#374151", padding: "8px 14px", fontSize: 13, cursor: "pointer" }}>
         ◉ Alertes
       </button>
       <button style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
         + Nouveau
       </button>
     </div>
   </div>
 );
}
