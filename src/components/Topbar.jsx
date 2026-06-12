"use client";

export default function Topbar({ activeNav }) {
  const titres = {
    dashboard: "Dashboard",
    crm: "Clients",
    finances: "Finances",
    taches: "Tâches",
    wiki: "Wiki",
    alertes: "Alertes",
  };

  return (
    <div style={{ padding: "20px 32px", borderBottom: "1px solid #1E1E38", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0F0F1A", flexShrink: 0 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "sans-serif", color: "#E8E8F0" }}>
          {titres[activeNav] || "Dashboard"}
        </div>
        <div style={{ fontSize: 13, color: "#6B6B8A", marginTop: 2 }}>
          Vendredi 12 juin 2026
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button style={{ background: "#1A1A2E", border: "1px solid #2A2A45", borderRadius: 8, color: "#E8E8F0", padding: "8px 14px", fontSize: 13, cursor: "pointer" }}>
          ◉ Alertes
        </button>
        <button style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          + Nouveau
        </button>
      </div>
    </div>
  );
}
