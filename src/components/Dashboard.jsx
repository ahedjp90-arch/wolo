"use client";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { supabase } from "@/lib/supabase";
import { t } from "@/lib/i18n";

const moisLabels = { fr: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };

export default function Dashboard({ theme, lang = "fr" }) {
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);
  const [taches, setTaches] = useState([]);
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDark = theme === "dark";
  const bg = isDark ? "#0F0F1A" : "#F3F4F6";
  const card = isDark ? "#111128" : "#FFFFFF";
  const border = isDark ? "#1E1E38" : "#E5E7EB";
  const text = isDark ? "#E8E8F0" : "#111827";
  const sub = isDark ? "#6B6B8A" : "#6B7280";
  const divider = isDark ? "#1A1A30" : "#F3F4F6";

  useEffect(() => {
    const uid = localStorage.getItem("wolo_user_id");
    if (uid) fetchData(uid);
  }, []);

  const fetchData = async (uid) => {
    setLoading(true);
    const [txRes, clientRes, tacheRes, factureRes] = await Promise.all([
      supabase.from("transactions").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("clients").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("taches").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("factures").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
    ]);
    setTransactions(txRes.data || []);
    setClients(clientRes.data || []);
    setTaches(tacheRes.data || []);
    setFactures(factureRes.data || []);
    setLoading(false);
  };

  const totalEntrees = transactions.filter(tx => tx.type === "entree").reduce((s, tx) => s + tx.montant, 0);
  const totalSorties = transactions.filter(tx => tx.type === "sortie").reduce((s, tx) => s + tx.montant, 0);
  const tachesAFaire = taches.filter(tx => tx.colonne === "A faire").length;
  const facturesImpayees = factures.filter(f => f.statut === "Impayee").length;

  const currentYear = new Date().getFullYear();
  const mois = moisLabels[lang] || moisLabels.fr;
  const graphData = mois.map((m, i) => {
    const revenus = transactions.filter(tx => { if (!tx.created_at) return false; const d = new Date(tx.created_at); return tx.type === "entree" && d.getMonth() === i && d.getFullYear() === currentYear; }).reduce((s, tx) => s + tx.montant, 0);
    const depenses = transactions.filter(tx => { if (!tx.created_at) return false; const d = new Date(tx.created_at); return tx.type === "sortie" && d.getMonth() === i && d.getFullYear() === currentYear; }).reduce((s, tx) => s + tx.montant, 0);
    return { mois: m, revenus, depenses };
  });

  const clientsParStatut = [
    { statut: lang === "en" ? "Prospect" : "Prospect", count: clients.filter(c => c.statut === "Prospect").length, color: "#6B6B8A" },
    { statut: lang === "en" ? "Negotiation" : "Negociation", count: clients.filter(c => c.statut === "Negociation").length, color: "#F5A623" },
    { statut: lang === "en" ? "Won" : "Gagne", count: clients.filter(c => c.statut === "Gagne").length, color: "#4A9B8E" },
    { statut: lang === "en" ? "Follow-up" : "Relance", count: clients.filter(c => c.statut === "Relance due").length, color: "#E85555" },
  ];

  const statutColors = { "Relance due": { bg: "rgba(232,85,85,0.1)", tx: "#E85555" }, "Negociation": { bg: "rgba(245,166,35,0.1)", tx: "#F5A623" }, "Gagne": { bg: "rgba(74,155,142,0.1)", tx: "#4A9B8E" }, "Prospect": { bg: "rgba(107,107,138,0.1)", tx: "#6B6B8A" } };

  if (loading) return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: bg, color: sub }}>Loading...</div>;

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: bg }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: text }}>{t("bonjour", lang)} 👋</div>
        <div style={{ fontSize: 13, color: sub, marginTop: 2 }}>{tachesAFaire} {t("taches_a_faire", lang)} · {facturesImpayees} {t("factures_impayees", lang)}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: t("revenus", lang), valeur: totalEntrees.toLocaleString("fr-FR"), unite: "FCFA", color: "#4A9B8E", icon: "▲" },
          { label: t("depenses", lang), valeur: totalSorties.toLocaleString("fr-FR"), unite: "FCFA", color: "#E85555", icon: "▼" },
          { label: t("solde_net", lang), valeur: (totalEntrees - totalSorties).toLocaleString("fr-FR"), unite: "FCFA", color: totalEntrees >= totalSorties ? "#4A9B8E" : "#E85555", icon: "=" },
          { label: t("clients", lang), valeur: clients.length.toString(), unite: lang === "en" ? "clients" : "clients", color: "#7C7CF0", icon: "👥" },
        ].map((k, i) => (
          <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ fontSize: 12, color: sub, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: k.color }}>{k.icon} {k.valeur}</div>
            <div style={{ fontSize: 11, color: sub, marginTop: 4 }}>{k.unite}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 4 }}>{t("revenus", lang)} & {t("depenses", lang)} {currentYear}</div>
          <div style={{ fontSize: 12, color: sub, marginBottom: 16 }}>{lang === "en" ? "Real data by month" : "Donnees reelles par mois"}</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={graphData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F5A623" stopOpacity={0.3} /><stop offset="95%" stopColor="#F5A623" stopOpacity={0} /></linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E85555" stopOpacity={0.2} /><stop offset="95%" stopColor="#E85555" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="mois" tick={{ fill: sub, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: sub, fontSize: 10 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 8, color: text, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenus" name={t("revenus", lang)} stroke="#F5A623" strokeWidth={2} fill="url(#g1)" dot={false} />
              <Area type="monotone" dataKey="depenses" name={t("depenses", lang)} stroke="#E85555" strokeWidth={2} fill="url(#g2)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 16 }}>{t("pipeline_clients", lang)}</div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={clientsParStatut}>
              <XAxis dataKey="statut" tick={{ fill: sub, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 8, color: text, fontSize: 12 }} />
              <Bar dataKey="count" name={lang === "en" ? "Clients" : "Clients"} fill="#F5A623" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
            {clientsParStatut.map(s => (
              <div key={s.statut} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: sub }}>{s.statut}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 16 }}>{t("clients_recents", lang)}</div>
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
          {clients.length === 0 && <div style={{ fontSize: 13, color: sub, textAlign: "center", padding: 20 }}>{t("aucun_client", lang)}</div>}
        </div>

        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 16 }}>{t("transactions_recentes", lang)}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: tx.type === "entree" ? "rgba(74,155,142,0.15)" : "rgba(232,85,85,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{tx.type === "entree" ? "+" : "-"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: text }}>{tx.libelle}</div>
                  <div style={{ fontSize: 11, color: sub }}>{tx.categorie}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: tx.type === "entree" ? "#4A9B8E" : "#E85555" }}>{tx.type === "entree" ? "+" : "-"}{tx.montant?.toLocaleString("fr-FR")}</div>
              </div>
            ))}
            {transactions.length === 0 && <div style={{ fontSize: 13, color: sub, textAlign: "center", padding: 20 }}>{t("aucune_transaction", lang)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
