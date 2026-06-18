"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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

export default function Support({ theme }) {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [newTicket, setNewTicket] = useState({ sujet: "", message: "", priorite: "Normale", raison: "Question" });

  const isDark = theme === "dark";
  const bg = isDark ? "#0F0F1A" : "#F3F4F6";
  const card = isDark ? "#111128" : "#FFFFFF";
  const border = isDark ? "#1E1E38" : "#E5E7EB";
  const text = isDark ? "#E8E8F0" : "#111827";
  const sub = isDark ? "#6B6B8A" : "#6B7280";
  const input = isDark ? "#0F0F1A" : "#F9FAFB";
  const inputBorder = isDark ? "#2A2A45" : "#D1D5DB";
  const inputStyle = { background: input, border: `1px solid ${inputBorder}`, borderRadius: 8, padding: "10px 14px", color: text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" };

  useEffect(() => {
    const uid = localStorage.getItem("wolo_user_id");
    if (uid) { setUserId(uid); fetchTickets(uid); }
  }, []);

  const fetchTickets = async (uid) => {
    setLoading(true);
    const { data } = await supabase.from("tickets").select("*").eq("user_id", uid).order("created_at", { ascending: false });
    setTickets(data || []);
    setLoading(false);
  };

  const genRef = () => `TKT-${Date.now().toString().slice(-6)}`;

  const creerTicket = async () => {
    if (!newTicket.sujet || !userId) return;
    setSending(true);
    const ref = genRef();
    const clientEmail = localStorage.getItem("wolo_email") || "";
    const messages = [{ auteur: "client", texte: newTicket.message, date: new Date().toISOString() }];

    const { error } = await supabase.from("tickets").insert([{
      ...newTicket,
      user_id: userId,
      reference: ref,
      statut: "Ouvert",
      client_email: clientEmail,
      messages,
    }]);

    if (!error) {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "nouveau_ticket",
          email: "contact.prosperadigital@gmail.com",
          data: { reference: ref, sujet: newTicket.sujet, priorite: newTicket.priorite, raison: newTicket.raison, message: newTicket.message, clientEmail }
        })
      });
      fetchTickets(userId);
      setNewTicket({ sujet: "", message: "", priorite: "Normale", raison: "Question" });
      setShowForm(false);
    }
    setSending(false);
  };

  const envoyerMessage = async () => {
    if (!newMessage || !selected) return;
    setSending(true);
    const messages = [...(selected.messages || []), { auteur: "client", texte: newMessage, date: new Date().toISOString() }];
    const { error } = await supabase.from("tickets").update({ messages, statut: "Ouvert" }).eq("id", selected.id);
    if (!error) {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "nouveau_ticket",
          email: "contact.prosperadigital@gmail.com",
          data: { reference: selected.reference, sujet: selected.sujet, priorite: selected.priorite, raison: selected.raison, message: newMessage, clientEmail: selected.client_email }
        })
      });
      setNewMessage("");
      const updated = { ...selected, messages, statut: "Ouvert" };
      setSelected(updated);
      fetchTickets(userId);
    }
    setSending(false);
  };

  const filtered = tickets.filter(t => {
    const matchSearch = t.sujet?.toLowerCase().includes(search.toLowerCase()) || t.reference?.toLowerCase().includes(search.toLowerCase());
    const matchStatut = filtreStatut === "Tous" || t.statut === filtreStatut;
    return matchSearch && matchStatut;
  });

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: text }}>Support</div>
          <div style={{ fontSize: 13, color: sub, marginTop: 2 }}>Suivez vos demandes de support et incidents.</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Creer un ticket</button>
      </div>

      {showForm && (
        <div style={{ background: card, border: `1px solid ${inputBorder}`, borderRadius: 14, padding: 24, marginBottom: 24, marginTop: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 16 }}>Nouveau ticket</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input placeholder="Sujet" value={newTicket.sujet} onChange={e => setNewTicket({ ...newTicket, sujet: e.target.value })} style={inputStyle} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <select value={newTicket.priorite} onChange={e => setNewTicket({ ...newTicket, priorite: e.target.value })} style={inputStyle}>
                <option value="Basse">Basse</option>
                <option value="Normale">Normale</option>
                <option value="Haute">Haute</option>
                <option value="Urgente">Urgente</option>
              </select>
              <select value={newTicket.raison} onChange={e => setNewTicket({ ...newTicket, raison: e.target.value })} style={inputStyle}>
                <option value="Question">Question</option>
                <option value="Bug">Bug</option>
                <option value="Amelioration">Amelioration</option>
                <option value="Facturation">Facturation</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <textarea placeholder="Decrivez votre probleme..." value={newTicket.message} onChange={e => setNewTicket({ ...newTicket, message: e.target.value })}
              style={{ ...inputStyle, resize: "vertical", minHeight: 100 }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={creerTicket} disabled={sending} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: sending ? 0.7 : 1 }}>
              {sending ? "Envoi..." : "Envoyer"}
            </button>
            <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: `1px solid ${inputBorder}`, borderRadius: 8, color: sub, padding: "10px 24px", fontSize: 13, cursor: "pointer" }}>Annuler</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, margin: "16px 0" }}>
        <input placeholder="Rechercher un ticket..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 280 }} />
        <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
          <option value="Tous">Tous les statuts</option>
          <option value="Ouvert">Ouvert</option>
          <option value="En cours">En cours</option>
          <option value="Resolu">Resolu</option>
          <option value="Ferme">Ferme</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1.5fr" : "1fr", gap: 20 }}>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: isDark ? "#0F0F1A" : "#F9FAFB" }}>
                {["Sujet", "Statut", "Priorite", "Date"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: sub }}>Chargement...</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: sub }}>Aucun ticket trouve</td></tr>}
              {!loading && filtered.map((t) => (
                <tr key={t.id} onClick={() => setSelected(selected?.id === t.id ? null : t)}
                  style={{ borderTop: `1px solid ${border}`, cursor: "pointer", background: selected?.id === t.id ? "rgba(245,166,35,0.05)" : "transparent" }}>
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

        {selected && (
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 24, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: text }}>{selected.sujet}</div>
                <div style={{ fontSize: 12, color: sub, marginTop: 4 }}>{selected.reference} · {selected.raison}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: sub, fontSize: 18, cursor: "pointer" }}>x</button>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: statutColors[selected.statut]?.bg, color: statutColors[selected.statut]?.tx }}>{selected.statut}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: prioriteColors[selected.priorite]?.bg, color: prioriteColors[selected.priorite]?.tx }}>{selected.priorite}</span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", maxHeight: 320, display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {(selected.messages || []).map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.auteur === "client" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "80%", background: msg.auteur === "client" ? "rgba(245,166,35,0.1)" : "rgba(74,155,142,0.1)", border: `1px solid ${msg.auteur === "client" ? "rgba(245,166,35,0.2)" : "rgba(74,155,142,0.2)"}`, borderRadius: 12, padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, color: msg.auteur === "client" ? "#F5A623" : "#4A9B8E", fontWeight: 600, marginBottom: 4 }}>
                      {msg.auteur === "client" ? "Vous" : "Equipe WOLO"}
                    </div>
                    <div style={{ fontSize: 13, color: text, lineHeight: 1.5 }}>{msg.texte}</div>
                    <div style={{ fontSize: 10, color: sub, marginTop: 6 }}>{new Date(msg.date).toLocaleString("fr-FR")}</div>
                  </div>
                </div>
              ))}
              {(!selected.messages || selected.messages.length === 0) && (
                <div style={{ fontSize: 13, color: sub, textAlign: "center", padding: 20 }}>Aucun message</div>
              )}
            </div>

            {/* Envoyer un message */}
            {selected.statut !== "Ferme" && (
              <div style={{ display: "flex", gap: 8 }}>
                <input placeholder="Votre message..." value={newMessage} onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && envoyerMessage()}
                  style={{ ...inputStyle, flex: 1 }} />
                <button onClick={envoyerMessage} disabled={sending} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: sending ? 0.7 : 1, flexShrink: 0 }}>
                  {sending ? "..." : "Envoyer"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
