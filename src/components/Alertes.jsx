"use client";
import { useState } from "react";

const alertesInit = [
  { id: 1, type: "warning", message: "Facture INV-041 impayée depuis 15 jours", temps: "Il y a 2h", lu: false },
  { id: 2, type: "info", message: "Relance prévue pour Diallo & Fils", temps: "Il y a 4h", lu: false },
  { id: 3, type: "success", message: "Paiement reçu — Tech Abidjan (430 000 FCFA)", temps: "Hier", lu: true },
  { id: 4, type: "warning", message: "3 tâches en retard cette semaine", temps: "Hier", lu: true },
  { id: 5, type: "info", message: "Nouveau prospect : Maison Bamba ajouté au CRM", temps: "Il y a 2 jours", lu: true },
];

const alerteColors = {
  warning: { border: "#E85555", bg: "rgba(232,85,85,0.06)", icon: "⚠️", label: "Attention" },
  info: { border: "#7C7CF0", bg: "rgba(124,124,240,0.06)", icon: "ℹ️", label: "Info" },
  success: { border: "#4A9B8E", bg: "rgba(74,155,142,0.06)", icon: "✅", label: "Succès" },
};

export default function Alertes({ theme }) {
  const [alertes, setAlertes] = useState(alertesInit);
  const [filtre, setFiltre] = useState("tous");

  const isDark = theme === "dark";
  const bg = isDark ? "#0F0F1A" : "#F3F4F6";
  const card = isDark ? "#111128" : "#FFFFFF";
  const border = isDark ? "#1E1E38" : "#E5E7EB";
  const text = isDark ? "#E8E8F0" : "#111827";
  const sub = isDark ? "#6B6B8A" : "#6B7280";

  const marquerLu = (id) => setAlertes(alertes.map(a => a.id === id ? { ...a, lu: true } : a));
  const supprimer = (id) => setAlertes(alertes.filter(a => a.id !== id));
  const toutMarquer = () => setAlertes(alertes.map(a => ({ ...a, lu: true })));

  const filtered = alertes.filter(a => {
    if (filtre === "tous") return true;
    if (filtre === "nonlu") return !a.lu;
    return a.type === filtre;
  });

  const nonLues = alertes.filter(a => !a.lu).length;

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: text }}>Alertes</div>
          <div style={{ fontSize: 13, color: sub, marginTop: 2 }}>
            {nonLues > 0 ? `${nonLues} non lue${nonLues > 1 ? "s" : ""}` : "Tout est à jour ✓"}
          </div>
        </div>
        {nonLues > 0 && (
          <button onClick={toutMarquer} style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 8, color: sub, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["tous", "Tout"], ["nonlu", "Non lues"], ["warning", "Attention"], ["info", "Info"], ["success", "Succès"]].map(([val, label]) => (
          <button key={val} onClick={() => setFiltre(val)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${filtre === val ? "#F5A623" : border}`, fontSize: 12, fontWeight: 600, cursor: "pointer", background: filtre === val ? "#F5A623" : card, color: filtre === val ? "#0F0F1A" : sub }}>{label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && <div style={{ textAlign: "center", color: sub, fontSize: 14, padding: "40px 0" }}>Aucune alerte</div>}
        {filtered.map(a => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 12, background: alerteColors[a.type].bg, borderLeft: `4px solid ${alerteColors[a.type].border}`, opacity: a.lu ? 0.6 : 1 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{alerteColors[a.type].icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: text, fontWeight: a.lu ? 400 : 600, lineHeight: 1.4 }}>{a.message}</div>
              <div style={{ fontSize: 11, color: sub, marginTop: 4 }}>{a.temps} · {alerteColors[a.type].label}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {!a.lu && (
                <button onClick={() => marquerLu(a.id)} style={{ background: "rgba(74,155,142,0.1)", border: "none", borderRadius: 6, color: "#4A9B8E", fontSize: 11, padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>Lu</button>
              )}
              <button onClick={() => supprimer(a.id)} style={{ background: "rgba(232,85,85,0.1)", border: "none", borderRadius: 6, color: "#E85555", fontSize: 11, padding: "4px 10px", cursor: "pointer" }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
