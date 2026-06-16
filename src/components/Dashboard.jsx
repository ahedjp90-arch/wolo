"use client";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/lib/supabase";

export default function Dashboard({ theme }) {
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);
  const [taches, setTaches] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDark = theme === "dark";
  const bg = isDark ? "#0F0F1A" : "#F3F4F6";
  const card = isDark ? "#111128" : "#FFFFFF";
  const border = isDark ? "#1E1E38" : "#E5E7EB";
  const text = isDark ? "#E8E8F0" : "#111827";
  const sub = isDark ? "#6B6B8A" : "#6B7280";
  const divider = isDark ? "#1A1A30" : "#F3F4F6";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [txRes, clientRes, tacheRes] = await Promise.all([
      supabase.from("transactions").select("*").order("created_at", { ascending: false }),
      supabase.from("clients").select("*").order("created_at", { ascending: false }),
      supabase.from("taches").select("*").order("created_at", { ascending: false }),
    ]);
    setTransactions(txRes.data || []);
    setClients(clientRes.data || []);
    setTaches(tacheRes.data || []);
    setLoading(false);
  };

  const totalEntrees = transactions.filter(t => t.type === "entree").reduce((s, t) => s + t.montant, 0);
  const totalSorties = transactions.filter(t => t.type === "sortie").reduce((s, t) => s + t.montant, 0);
  const tachesEnRetard = taches.filter(t => t.colonne === "À faire").length;

  const kpis = [
    { label: "Revenus ce mois", valeur: totalEntrees.toLocaleString(), unite: "FCFA", variation: "+", positif: true },
    { label: "Dépenses", valeur: totalSorties.toLocaleString(), unite: "FCFA", variation: "-", positif: false },
    { label: "Clients actifs", valeur: clients.length.toString(), unite: "clients", variation: "", positif: true },
    { label: "Tâches à faire", valeur: tachesEnRetard.toString(), unite: "tâches", variation: "", positif: tachesEnRetard === 0 },
  ];

  const revenueData = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"].map((mois, i) => ({
    mois,
    revenus: transactions.filter(t => t.type === "entree").reduce((s, t) => s + t.montant, 0) / 6,
    depenses: transactions.filter(t => t.type === "sortie").reduce((s, t) => s + t.montant, 0) / 6,
  }));

  const alerteColors = {
    warning: { border: "#E85555", bg: "rgba(232,85,85,0.06)" },
    info: { border: "#7C7CF0", bg: "rgba(124,124,240,0.06)" },
    success: { border: "#4A9B8E", bg: "rgba(74,155,142,0.06)" },
  };

  const statutColors = {
    "Relance due": { bg: "rgba(232,85,85,0.1)", tx: "#E85555" },
    "Négociation": { bg: "rgba(245,166,35,0.1)", tx: "#F5A623" },
    "Gagné": { bg: "rgba(74,155,142,0.1)", tx: "#4A9B8E" },
    "Prospect": { bg: "rgba(107,107,138,0.1)", tx: "#6B6B8A" },
  };

  if (loading) return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: bg, color: sub }}>Chargement...</div>;

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: bg }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: text }}>Bonjour 👋</div>
        <div style={{ fontSize: 13, color: sub, marginTop: 2 }}>{tachesEnRetard} tâches à faire aujourd'hui</div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ fontSize: 12, color: sub, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: text }}>{k.valeur} <span style={{ fontSize: 12, color: sub, fontWeight: 400 }}>{k.unite}</span></div>
            <div style={{ marginTop: 10, fontSize: 12, fontWeight: 600, color: k.positif ? "#4A9B8E" : "#E85555" }}>
              Données en temps réel
            </div>
          </div>
        ))}
      </div>

      {/* Graphique + Tâches */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 4 }}>Revenus & Dépenses</div>
          <div style={{ fontSize: 12, color: sub, marginBottom: 16 }}>Aperçu financier</div>
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
            <div style={{ fontSize: 15, fontWeight: 600, color: text }}>Tâches</div>
            <span style={{ background: "rgba(245,166,35,0.12)", color: "#F5A623", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20 }}>
              {taches.filter(t => t.colonne !== "Terminé").length} en cours
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {taches.slice(0, 5).map(task => (
              <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: task.colonne === "Terminé" ? "rgba(74,155,142,0.06)" : isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px solid ${border}` }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: task.priorite === "haute" ? "#F5A623" : task.priorite === "moyenne" ? "#7C7CF0" : "#4A9B8E", flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 13, color: task.colonne === "Terminé" ? sub : text, textDecoration: task.colonne === "Terminé" ? "line-through" : "none" }}>{task.titre}</div>
                <span style={{ fontSize: 10, color: sub }}>{task.colonne}</span>
              </div>
            ))}
            {taches.length === 0 && <div style={{ fontSize: 13, color: sub, textAlign: "center", padding: 20 }}>Aucune tâche</div>}
          </div>
        </div>
      </div>

      {/* Clients + Transactions récentes */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 16 }}>Clients récents</div>
          {clients.slice(0, 4).map((c, i) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 10px", borderBottom: i < Math.min(clients.length, 4) - 1 ? `1px solid ${divider}` : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #7C7CF0, #5A5AE8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{c.nom?.[0]?.toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{c.nom}</div>
                <div style={{ fontSize: 11, color: sub }}>{c.secteur}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: statutColors[c.statut]?.bg || "rgba(107,107,138,0.1)", color: statutColors[c.statut]?.tx || "#6B6B8A" }}>{c.statut}</span>
            </div>
          ))}
          {clients.length === 0 && <div style={{ fontSize: 13, color: sub, textAlign: "center", padding: 20 }}>Aucun client</div>}
        </div>

        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 16 }}>Transactions récentes</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {transactions.slice(0, 4).map((t, i) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: t.type === "entree" ? "rgba(74,155,142,0.15)" : "rgba(232,85,85,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{t.type === "entree" ? "↓" : "↑"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: text }}>{t.libelle}</div>
                  <div style={{ fontSize: 11, color: sub }}>{t.categorie}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.type === "entree" ? "#4A9B8E" : "#E85555" }}>
                  {t.type === "entree" ? "+" : "-"}{t.montant?.toLocaleString()}
                </div>
              </div>
            ))}
            {transactions.length === 0 && <div style={{ fontSize: 13, color: sub, textAlign: "center", padding: 20 }}>Aucune transaction</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
