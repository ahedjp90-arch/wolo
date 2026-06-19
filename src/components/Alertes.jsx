"use client";
import { useState } from "react";

const getAlertes = (lang) => [
  { id: 1, type: "attention", icon: "⚠️", titre: lang === "en" ? "Invoice INV-041 unpaid for 15 days" : "Facture INV-041 impayee depuis 15 jours", temps: lang === "en" ? "2h ago" : "Il y a 2h", lu: false },
  { id: 2, type: "info", icon: "ℹ️", titre: lang === "en" ? "Follow-up planned for Diallo & Fils" : "Relance prevue pour Diallo & Fils", temps: lang === "en" ? "4h ago" : "Il y a 4h", lu: false },
  { id: 3, type: "succes", icon: "✅", titre: lang === "en" ? "Payment received — Tech Abidjan (430,000 FCFA)" : "Paiement recu — Tech Abidjan (430 000 FCFA)", temps: lang === "en" ? "Yesterday" : "Hier", lu: true },
  { id: 4, type: "attention", icon: "⚠️", titre: lang === "en" ? "3 tasks overdue this week" : "3 taches en retard cette semaine", temps: lang === "en" ? "Yesterday" : "Hier", lu: true },
  { id: 5, type: "info", icon: "ℹ️", titre: lang === "en" ? "New prospect: Maison Bamba added to CRM" : "Nouveau prospect : Maison Bamba ajoute au CRM", temps: lang === "en" ? "2 days ago" : "Il y a 2 jours", lu: true },
];

const typeColors = {
  attention: { bg: "rgba(245,166,35,0.1)", tx: "#F5A623", label_fr: "Attention", label_en: "Warning" },
  info: { bg: "rgba(124,124,240,0.1)", tx: "#7C7CF0", label_fr: "Info", label_en: "Info" },
  succes: { bg: "rgba(74,155,142,0.1)", tx: "#4A9B8E", label_fr: "Succes", label_en: "Success" },
};

export default function Alertes({ theme, lang = "fr" }) {
  const [alertes, setAlertes] = useState(getAlertes(lang));
  const [filtre, setFiltre] = useState("tous");

  const isDark = theme === "dark";
  const bg = isDark ? "#0F0F1A" : "#F3F4F6";
  const card = isDark ? "#111128" : "#FFFFFF";
  const border = isDark ? "#1E1E38" : "#E5E7EB";
  const text = isDark ? "#E8E8F0" : "#111827";
  const sub = isDark ? "#6B6B8A" : "#6B7280";

  const nonLues = alertes.filter(a => !a.lu).length;

  const marquerToutesLues = () => setAlertes(alertes.map(a => ({ ...a, lu: true })));
  const marquerLue = (id) => setAlertes(alertes.map(a => a.id === id ? { ...a, lu: true } : a));
  const supprimer = (id) => setAlertes(alertes.filter(a => a.id !== id));

  const filtered = alertes.filter(a => {
    if (filtre === "non_lues") return !a.lu;
    if (filtre === "attention") return a.type === "attention";
    if (filtre === "info") return a.type === "info";
    if (filtre === "succes") return a.type === "succes";
    return true;
  });

  const filtres = lang === "en"
    ? [{ val: "tous", label: "All" }, { val: "non_lues", label: "Unread" }, { val: "attention", label: "Warning" }, { val: "info", label: "Info" }, { val: "succes", label: "Success" }]
    : [{ val: "tous", label: "Tout" }, { val: "non_lues", label: "Non lues" }, { val: "attention", label: "Attention" }, { val: "info", label: "Info" }, { val: "succes", label: "Succes" }];

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: text }}>{lang === "en" ? "Alerts" : "Alertes"}</div>
          <div style={{ fontSize: 13, color: sub, marginTop: 2 }}>{nonLues} {lang === "en" ? "unread" : "non lues"}</div>
        </div>
        {nonLues > 0 && (
          <button onClick={marquerToutesLues} style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 8, color: "#F5A623", padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            {lang === "en" ? "Mark all as read" : "Tout marquer comme lu"}
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {filtres.map(f => (
          <button key={f.val} onClick={() => setFiltre(f.val)} style={{ background: filtre === f.val ? "rgba(245,166,35,0.1)" : "transparent", border: `1px solid ${filtre === f.val ? "rgba(245,166,35,0.4)" : border}`, borderRadius: 8, color: filtre === f.val ? "#F5A623" : sub, padding: "6px 14px", fontSize: 12, fontWeight: filtre === f.val ? 600 : 400, cursor: "pointer" }}>
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && <div style={{ color: sub, textAlign: "center", padding: 40 }}>{lang === "en" ? "No alerts" : "Aucune alerte"}</div>}
        {filtered.map(a => (
          <div key={a.id} style={{ background: card, border: `1px solid ${a.lu ? border : "rgba(245,166,35,0.3)"}`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, opacity: a.lu ? 0.7 : 1 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: typeColors[a.type]?.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: a.lu ? 400 : 600, color: text }}>{a.titre}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: sub }}>{a.temps}</span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "1px 8px", borderRadius: 10, background: typeColors[a.type]?.bg, color: typeColors[a.type]?.tx }}>
                  {lang === "en" ? typeColors[a.type]?.label_en : typeColors[a.type]?.label_fr}
                </span>
                {a.lu && <span style={{ fontSize: 11, color: "#4A9B8E" }}>{lang === "en" ? "Read" : "Lu"}</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {!a.lu && (
                <button onClick={() => marquerLue(a.id)} style={{ background: "rgba(74,155,142,0.1)", border: "none", borderRadius: 6, color: "#4A9B8E", padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>
                  {lang === "en" ? "Mark read" : "Lu"}
                </button>
              )}
              <button onClick={() => supprimer(a.id)} style={{ background: "transparent", border: "none", color: sub, fontSize: 16, cursor: "pointer" }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
