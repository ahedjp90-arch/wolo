"use client";
import { useState, useEffect } from "react";

const moduleNames = {
  fr: { dashboard: "Dashboard", crm: "Clients", finances: "Finances", taches: "Taches", wiki: "Wiki", alertes: "Alertes", facturation: "Facturation", support: "Support" },
  en: { dashboard: "Dashboard", crm: "Clients", finances: "Finances", taches: "Tasks", wiki: "Wiki", alertes: "Alerts", facturation: "Invoicing", support: "Support" }
};

export default function Topbar({ activeNav, theme, setTheme, lang = "fr", setLang }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleLang = () => {
    const newLang = lang === "fr" ? "en" : "fr";
    if (setLang) setLang(newLang);
  };

  const isDark = theme === "dark";
  const bg = isDark ? "#111128" : "#FFFFFF";
  const border = isDark ? "#1E1E38" : "#E5E7EB";
  const text = isDark ? "#E8E8F0" : "#111827";
  const sub = isDark ? "#6B6B8A" : "#6B7280";

  const dateStr = now.toLocaleDateString(lang === "en" ? "en-US" : "fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ background: bg, borderBottom: `1px solid ${border}`, padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: text }}>{moduleNames[lang]?.[activeNav] || moduleNames.fr[activeNav]}</div>
        <div style={{ fontSize: 12, color: sub, marginTop: 2, textTransform: "capitalize" }}>{dateStr}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={toggleLang} style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 8, color: "#F5A623", padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
          {lang === "fr" ? "🇬 EN" : "🇫🇷 FR"}
        </button>
        <button onClick={() => setTheme(isDark ? "light" : "dark")} style={{ background: isDark ? "#1A1A2E" : "#F3F4F6", border: `1px solid ${border}`, borderRadius: 8, color: sub, padding: "6px 12px", fontSize: 16, cursor: "pointer" }}>
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
}
