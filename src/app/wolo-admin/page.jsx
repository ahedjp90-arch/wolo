"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function WoloAdmin() {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalClients: 0, totalTransactions: 0, totalRevenu: 0, totalTickets: 0 });
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reponse, setReponse] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("wolo_theme") || "dark";
    setTheme(savedTheme);
  }, []);

  const isDark = theme === "dark";
  const bg = isDark ? "#0F0F1A" : "#F3F4F6";
  const card = isDark ? "#111128" : "#FFFFFF";
  const border = isDark ? "#1E1E38" : "#E5E7EB";
  const text = isDark ? "#E8E8F0" : "#111827";
  const sub = isDark ? "#6B6B8A" : "#6B7280";
  const input = isDark ? "#0F0F1A" : "#F9FAFB";
  const inputBorder = isDark ? "#2A2A45" : "#D1D5DB";
  const tableBg = isDark ? "#0F0F1A" : "#F9FAFB";
  const inputStyle = { background: input, border: `1px solid ${inputBorder}`, borderRadius: 8, padding: "10px 14px", color: text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" };

  const statutColors = {
    "Ouvert": { bg: "rgba(245,166,35,0.1)", tx: "#F5A623" },
    "En cours": { bg: "rgba(124,124,240,0.1)", tx: "#7C7CF0" },
    "Resolu": { bg: "rgba(74,155,142,0.1)", tx: "#4A9B8E" },
    "Ferme": { bg: "rgba(107,107,138,0.1)", tx: "#6B6B8A" },
  };

  const prioriteColors = {
    "Basse": { bg: "rgba(74,155,142,0.1)", tx: "#4A9B8E" },
    "Normale": { bg: "rgba(124,124,240,0.1)", tx: "#7C7CF0" },
    "Haute": { bg: "rgba(245,166,35,0.1)", tx: "#F5A623" },
    "Urgente": { bg: "rgba(232,85,85,0.1)", tx: "#E85555" },
  };

  const handleLogin = () => {
    if (password === "dygrew-wIpsu1-mehfif") {
      setAuth(true);
      fetchData();
    } else {
      setError("Mot de passe incorrect");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const [clientsRes, transactionsRes, tachesRes, wikiRes, ticketsRes] = await Promise.all([
      supabase.from("clients").select("user_id"),
      supabase.from("transactions").select("user_id, montant, type"),
      supabase.from("taches").select("user_id"),
      supabase.from("wiki").select("user_id"),
      supabase.from("tickets").select("*").order("created_at", { ascending: false }),
    ]);

    const clients = clientsRes.data || [];
    const transactions = transactionsRes.data || [];
    const taches = tachesRes.data || [];
    const wiki = wikiRes.data || [];
    const ticketsList = ticketsRes.data || [];

    setTickets(ticketsList);

    const uniqueUsers = [...new Set([
      ...clients.map(c => c.user_id),
      ...transactions.map(t => t.user_id),
      ...taches.map(t => t.user_id),
      ...wiki.map(w => w.user_id),
    ].filter(Boolean))];

    const totalRevenu = transactions.filter(t => t.type === "entree").reduce((s, t) => s + (t.montant || 0), 0);

    const userStats = uniqueUsers.map(uid => ({
      id: uid,
      clients: clients.filter(c => c.user_id === uid).length,
      transactions: transactions.filter(t => t.user_id === uid).length,
      taches: taches.filter(t => t.user_id === uid).length,
      wiki: wiki.filter(w => w.user_id === uid).length,
      revenu: transactions.filter(t => t.user_id === uid && t.type === "entree").reduce((s, t) => s + (t.montant || 0), 0),
    }));

    setUsers(userStats);
    setStats({ totalUsers: uniqueUsers.length, totalClients: clients.length, totalTransactions: transactions.length, totalRevenu, totalTickets: ticketsList.length });
    setLoading(false);
  };

  const repondreTicket = async (ticket) => {
    if (!reponse) return;
    setSending(true);

    const messages = [...(ticket.messages || []), {
      auteur: "admin",
      texte: reponse,
      date: new Date().toISOString()
    }];

    await supabase.from("tickets").update({ messages, reponse, statut: "Resolu" }).eq("id", ticket.id);

    await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "reponse_ticket",
        email: ticket.client_email || "",
        data: { reference: ticket.reference, sujet: ticket.sujet, reponse }
      })
    });

    setReponse("");
    setSelectedTicket({ ...ticket, messages, statut: "Resolu" });
    fetchData();
    setSending(false);
    alert("Reponse envoyee !");
  };

  const changerStatutTicket = async (id, statut) => {
    await supabase.from("tickets").update({ statut }).eq("id", id);
    fetchData();
  };

  if (!auth) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <div style={{ width: 360, background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <img src="/logo.svg" style={{ width: 36, height: 36, borderRadius: 8 }} />
            <span style={{ fontSize: 18, fontWeight: 700, color: text }}>WOLO Admin</span>
          </div>
          <input type="password" placeholder="Mot de passe admin" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ ...inputStyle, marginBottom: 8 }} />
          {error && <div style={{ marginBottom: 8, fontSize: 12, color: "#E85555" }}>{error}</div>}
          <button onClick={handleLogin} style={{ width: "100%", marginTop: 8, background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Acceder
          </button>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
            <button onClick={() => setTheme("light")} style={{ background: theme === "light" ? "#F5A623" : "transparent", border: `1px solid ${border}`, borderRadius: 6, color: theme === "light" ? "#0F0F1A" : sub, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Clair</button>
            <button onClick={() => setTheme("dark")} style={{ background: theme === "dark" ? "#F5A623" : "transparent", border: `1px solid ${border}`, borderRadius: 6, color: theme === "dark" ? "#0F0F1A" : sub, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Sombre</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "Inter, sans-serif", padding: "40px 48px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/logo.svg" style={{ width: 36, height: 36, borderRadius: 8 }} />
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: text }}>WOLO Admin</div>
              <div style={{ fontSize: 13, color: sub }}>Vue d'ensemble de la plateforme</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setTheme("light")} style={{ background: theme === "light" ? "#F5A623" : "transparent", border: `1px solid ${border}`, borderRadius: 6, color: theme === "light" ? "#0F0F1A" : sub, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Clair</button>
            <button onClick={() => setTheme("dark")} style={{ background: theme === "dark" ? "#F5A623" : "transparent", border: `1px solid ${border}`, borderRadius: 6, color: theme === "dark" ? "#0F0F1A" : sub, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Sombre</button>
            <button onClick={fetchData} style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 8, color: "#F5A623", padding: "6px 14px", fontSize: 12, cursor: "pointer" }}>Actualiser</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Utilisateurs", valeur: stats.totalUsers, icon: "👥" },
            { label: "Clients", valeur: stats.totalClients, icon: "🏢" },
            { label: "Transactions", valeur: stats.totalTransactions, icon: "💰" },
            { label: "Revenus clients", valeur: stats.totalRevenu?.toLocaleString("fr-FR") + " FCFA", icon: "📈" },
            { label: "Tickets", valeur: stats.totalTickets, icon: "🎧" },
          ].map((s, i) => (
            <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "20px 24px" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#F5A623" }}>{s.valeur}</div>
              <div style={{ fontSize: 12, color: sub, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[["dashboard", "Utilisateurs"], ["tickets", "Tickets Support"]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${activeTab === id ? "#F5A623" : border}`, background: activeTab === id ? "#F5A623" : "transparent", color: activeTab === id ? "#0F0F1A" : sub, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{label}</button>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${border}` }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: text }}>Utilisateurs ({users.length})</div>
            </div>
            {loading && <div style={{ color: sub, textAlign: "center", padding: 40 }}>Chargement...</div>}
            {!loading && (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: tableBg }}>
                    {["User ID", "Clients", "Transactions", "Taches", "Wiki", "Revenus"].map(h => (
                      <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderTop: `1px solid ${border}` }}>
                      <td style={{ padding: "14px 20px", fontSize: 12, color: sub, fontFamily: "monospace" }}>{u.id?.substring(0, 16)}...</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: text, fontWeight: 600 }}>{u.clients}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: text, fontWeight: 600 }}>{u.transactions}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: text, fontWeight: 600 }}>{u.taches}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: text, fontWeight: 600 }}>{u.wiki}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#4A9B8E", fontWeight: 700 }}>{u.revenu?.toLocaleString("fr-FR")} FCFA</td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: sub }}>Aucun utilisateur</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "tickets" && (
          <div style={{ display: "grid", gridTemplateColumns: selectedTicket ? "1fr 1.5fr" : "1fr", gap: 20 }}>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: tableBg }}>
                    {["Sujet", "Statut", "Priorite", "Date"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: sub }}>Chargement...</td></tr>}
                  {!loading && tickets.length === 0 && <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: sub }}>Aucun ticket</td></tr>}
                  {!loading && tickets.map((t) => (
                    <tr key={t.id} onClick={() => { setSelectedTicket(selectedTicket?.id === t.id ? null : t); setReponse(""); }}
                      style={{ borderTop: `1px solid ${border}`, cursor: "pointer", background: selectedTicket?.id === t.id ? "rgba(245,166,35,0.05)" : "transparent" }}>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: text, fontWeight: 600 }}>{t.sujet}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: statutColors[t.statut]?.bg, color: statutColors[t.statut]?.tx }}>{t.statut}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: prioriteColors[t.priorite]?.bg, color: prioriteColors[t.priorite]?.tx }}>{t.priorite}</span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 12, color: sub }}>{new Date(t.created_at).toLocaleDateString("fr-FR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedTicket && (
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 24, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: text }}>{selectedTicket.sujet}</div>
                    <div style={{ fontSize: 12, color: sub, marginTop: 4 }}>{selectedTicket.reference} · {selectedTicket.client_email}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select value={selectedTicket.statut} onChange={e => changerStatutTicket(selectedTicket.id, e.target.value)}
                      style={{ background: input, border: `1px solid ${inputBorder}`, borderRadius: 6, color: text, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>
                      <option value="Ouvert">Ouvert</option>
                      <option value="En cours">En cours</option>
                      <option value="Resolu">Resolu</option>
                      <option value="Ferme">Ferme</option>
                    </select>
                    <button onClick={() => setSelectedTicket(null)} style={{ background: "transparent", border: "none", color: sub, fontSize: 18, cursor: "pointer" }}>x</button>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", maxHeight: 320, display: "flex", flexDirection: "column", gap: 10, marginBottom: 16, padding: "4px 0" }}>
                  {(selectedTicket.messages || []).map((msg, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: msg.auteur === "admin" ? "flex-end" : "flex-start" }}>
                      <div style={{ maxWidth: "80%", background: msg.auteur === "admin" ? "rgba(74,155,142,0.1)" : "rgba(245,166,35,0.1)", border: `1px solid ${msg.auteur === "admin" ? "rgba(74,155,142,0.2)" : "rgba(245,166,35,0.2)"}`, borderRadius: 12, padding: "10px 14px" }}>
                        <div style={{ fontSize: 11, color: msg.auteur === "admin" ? "#4A9B8E" : "#F5A623", fontWeight: 600, marginBottom: 4 }}>
                          {msg.auteur === "admin" ? "Vous (Admin)" : "Client"}
                        </div>
                        <div style={{ fontSize: 13, color: text, lineHeight: 1.5 }}>{msg.texte}</div>
                        <div style={{ fontSize: 10, color: sub, marginTop: 6 }}>{new Date(msg.date).toLocaleString("fr-FR")}</div>
                      </div>
                    </div>
                  ))}
                  {(!selectedTicket.messages || selectedTicket.messages.length === 0) && (
                    <div style={{ fontSize: 13, color: sub, textAlign: "center", padding: 20 }}>Aucun message</div>
                  )}
                </div>

                {/* Reponse */}
                <textarea placeholder="Votre reponse au client..." value={reponse} onChange={e => setReponse(e.target.value)}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 80, marginBottom: 12 }} />
                <button onClick={() => repondreTicket(selectedTicket)} disabled={sending}
                  style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: sending ? 0.7 : 1 }}>
                  {sending ? "Envoi..." : "Envoyer la reponse"}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
