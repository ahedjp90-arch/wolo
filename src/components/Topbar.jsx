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
    facturation: "Facturation",
  };

  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
      setDateStr(now.toLocaleDateString("fr-FR", options));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === "dark";
  const bg = isDark ? "#111128" : "#FFFFFF";
  const border = isDark ? "#1E1E38" : "#E5E7EB";
  const text = isDark ? "#E8E8F0" : "#111827";
  const sub = isDark ? "#6B6B8A" : "#6B7280";

  return (
    <div style={{ padding: "20px 32px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: bg, flexShrink: 0 }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: text }}>{titres[activeNav] || activeNav}</div>
        <div style={{ fontSize: 13, color: sub, marginTop: 2, textTransform: "capitalize" }}>{dateStr}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setTheme("light")} style={{ background: theme === "light" ? "#F5A623" : "transparent", border: `1px solid ${border}`, borderRadius: 8, color: theme === "light" ? "#0F0F1A" : sub, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>☀️ Clair</button>
        <button onClick={() => setTheme("dark")} style={{ background: theme === "dark" ? "#F5A623" : "transparent", border: `1px solid ${border}`, borderRadius: 8, color: theme === "dark" ? "#0F0F1A" : sub, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>🌙 Sombre</button>
      </div>
    </div>
  );
}
