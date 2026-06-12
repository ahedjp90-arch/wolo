"use client";
import { useState } from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const kpis = [
  { label: "Revenus ce mois", valeur: "685 000", unite: "FCFA", variation: "+8%", positif: true },
  { label: "Dépenses", valeur: "210 000", unite: "FCFA", variation: "-3%", positif: true },
  { label: "Clients actifs", valeur: "12", unite: "clients", variation: "+2", positif: true },
  { label: "Tâches en retard", valeur: "3", unite: "tâches", variation: "+1", positif: false },
];

const revenueData = [
  { mois: "Jan", revenus: 420000, depenses: 180000 },
  { mois: "Fév", revenus: 380000, depenses: 160000 },
  { mois: "Mar", revenus: 610000, depenses: 220000 },
  { mois: "Avr", revenus: 540000, depenses: 195000 },
  { mois: "Mai", revenus: 720000, depenses: 240000 },
  { mois: "Jun", revenus: 685000, depenses: 210000 },
];

const tachesInit = [
  { id: 1, titre: "Relancer client Diallo & Fils", priorite: "#F5A623", heure: "09:00", fait: false },
  { id: 2, titre: "Envoyer devis Projet Cocody", priorite: "#F5A623", heure: "11:00", fait: false },
  { id: 3, titre: "Réunion équipe commerciale", priorite: "#7C7CF0", heure: "14:00", fait: false },
  { id: 4, titre: "Vérifier facture impayée #INV-042", priorite: "#F5A623", heure: "15:30", fait: true },
  { id: 5, titre: "Mise à jour base clients", priorite: "#4A9B8E", heure: "17:00", fait: false },
];

const clients = [
  { nom: "Diallo & Fils", statut: "Relance due", valeur: "850 000 FCFA", avatar: "D", sc: { bg: "rgba(232,85,85,0.1)", tx: "#E85555" } },
  { nom: "Groupe Kouamé", statut: "Négociation", valeur: "1 200 000 FCFA", avatar: "G", sc: { bg: "rgba(245,166,35,0.1)", tx: "#F5A623" } },
  { nom: "Tech Abidjan", statut: "Gagné", valeur: "430 000 FCFA", avatar: "T", sc: { bg: "rgba(74,155,142,0.1)", tx: "#4A9B8E" } },
  { nom: "SARL Traoré", statut: "Prospect", valeur: "–", avatar: "S", sc: { bg: "rgba(107,107,138,0.1)", tx: "#6B6B8A" } },
];

const alertes = [
  { type: "warning", message: "Facture INV-041 impayée depuis 15 jours", temps: "Il y a 2h" },
  { type: "info", message: "Relance prévue pour Diallo & Fils", temps: "Il y a 4h" },
  { type: "success", message: "Paiement reçu — Tech Abidjan", temps: "Hier" },
];

const alerteColors = {
  warning: { border: "#E85555", bg: "rgba(232,85,85,0.06)" },
  info: { border: "#7C7CF0", bg: "rgba(124,124,240,0.06)" },
  success: { border: "#4A9B8E", bg: "rgba(74,155,142,0.06)" },
};

export default function Dashboard({ theme }) {
  const [taches, setTaches] = useState(tachesInit);
  const isDark = theme === "dark";
  const bg = isDark ? "#0F0F1A" : "#F3F4F6";
  const card = isDark ? "#111128" : "#FFFFFF";
  const border = isDark ? "#1E1E38" : "#E5E7EB";
  const text = isDark ? "#E8E8F0" : "#111827";
  const sub = isDark ? "#6B6B8A" : "#6B7280";
  const divider = isDark ? "#1A1A30" : "#F3F4F6";

  const toggle = (id) => setTaches(t => t.map(x => x.id === id ? { ...x, fait: !x.fait } : x));

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: bg }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: text }}>Bonjour, Jhon 👋</div>
        <div style={{ fontSize: 13, color: sub, marginTop: 2 }}>3 tâches urgentes aujourd'hui</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ fontSize: 12, color: sub, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: text }}>{k.valeur} <span style={{ fontSize: 12, color: sub, fontWeight: 400 }}>{k.unite}</span></div>
            <div style={{ marginTop: 10, fontSize: 12, fontWeight: 600, color: k.positif ? "#4A9B8E" : "#E85555" }}>
              {k.positif ? "▲" : "▼"} {k.variation} vs mois dernier
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 4 }}>Revenus & Dépenses</div>
          <div style={{ fontSize: 12, color: sub, marginBottom: 16 }}>6 derniers mois</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5A623" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C7CF0" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7C7CF0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="mois" tick={{ fill: sub, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 8, color: text, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenus" stroke="#F5A623" strokeWidth={2} fill="url(#g1)" dot={false} />
              <Area type="monotone" dataKey="depenses" stroke="#7C7CF0" strokeWidth={2} fill="url(#g2)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: text }}>Tâches du jour</div>
            <span style={{ background: "rgba(245,166,35,0.12)", color: "#F5A623", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20 }}>
              {taches.filter(t => !t.fait).length} restantes
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {taches.map(task => (
              <div key={task.id} onClick={() => toggle(task.id)} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 10, background: task.fait ? "rgba(74,155,142,0.06)" : isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px solid ${task.fait ? "rgba(74,155,142,0.15)" : border}`, cursor: "pointer" }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${task.fait ? "#4A9B8E" : task.priorite}`, background: task.fait ? "#4A9B8E" : "transparent", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#0F0F1A" }}>{task.fait ? "✓" : ""}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: task.fait ? sub : text, textDecoration: task.fait ? "line-through" : "none" }}>{task.titre}</div>
                  <div style={{ fontSize: 11, color: sub, marginTop: 2 }}>{task.heure}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 16 }}>Clients actifs</div>
          {clients.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 10px", borderBottom: i < clients.length - 1 ? `1px solid ${divider}` : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #7C7CF0, #5A5AE8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{c.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{c.nom}</div>
                <div style={{ fontSize: 11, color: sub }}>{c.valeur}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: c.sc.bg, color: c.sc.tx }}>{c.statut}</span>
            </div>
          ))}
        </div>

        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 16 }}>Alertes récentes</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alertes.map((a, i) => (
              <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: alerteColors[a.type].bg, borderLeft: `3px solid ${alerteColors[a.type].border}` }}>
                <div style={{ fontSize: 12, color: text, lineHeight: 1.4 }}>{a.message}</div>
                <div style={{ fontSize: 11, color: sub, marginTop: 4 }}>{a.temps}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
