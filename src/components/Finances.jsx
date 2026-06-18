"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ExportPDF from "@/components/ExportPDF";
import ExportExcel from "@/components/ExportExcel";

const categoriesEntree = ["Prestation", "Vente produit", "Acompte client", "Remboursement", "Autre"];
const categoriesSortie = ["Loyer", "Salaire", "Outils & Abonnements", "Transport", "Fournitures", "Marketing", "Autre"];

export default function Finances({ theme }) {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filtre, setFiltre] = useState("tous");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [clients, setClients] = useState([]);
  const [newTx, setNewTx] = useState({ type: "entree", libelle: "", montant: "", date: "", categorie: "Prestation", statut: "encaissé" });

  const isDark = theme === "dark";
  const bg = isDark ? "#0F0F1A" : "#F3F4F6";
  const card = isDark ? "#111128" : "#FFFFFF";
  const border = isDark ? "#1E1E38" : "#E5E7EB";
  const text = isDark ? "#E8E8F0" : "#111827";
  const sub = isDark ? "#6B6B8A" : "#6B7280";
  const input = isDark ? "#0F0F1A" : "#F9FAFB";
  const inputBorder = isDark ? "#2A2A45" : "#D1D5DB";

  useEffect(() => {
    const uid = localStorage.getItem("wolo_user_id");
    if (uid) { setUserId(uid); fetchTransactions(uid);
    supabase.from("clients").select("*").eq("user_id", uid).then(r => setClients(r.data || [])); }
  }, []);

  const fetchTransactions = async (uid) => {
    setLoading(true);
    const { data } = await supabase.from("transactions").select("*").eq("user_id", uid).order("created_at", { ascending: false });
    setTransactions(data || []);
    setLoading(false);
  };

  const addTx = async () => {
    if (!newTx.libelle || !newTx.montant || !userId) return;
    const { error } = await supabase.from("transactions").insert([{ ...newTx, user_id: userId, montant: parseInt(newTx.montant) }]);
    if (!error) { fetchTransactions(userId); setNewTx({ type: "entree", libelle: "", montant: "", date: "", categorie: "Prestation", statut: "encaissé" }); setShowForm(false); }
  };

  const deleteTx = async (id) => {
    await supabase.from("transactions").delete().eq("id", id).eq("user_id", userId);
    fetchTransactions(userId);
  };

  const totalEntrees = transactions.filter(t => t.type === "entree").reduce((s, t) => s + t.montant, 0);
  const totalSorties = transactions.filter(t => t.type === "sortie").reduce((s, t) => s + t.montant, 0);
  const solde = totalEntrees - totalSorties;
  const filtered = transactions.filter(t => filtre === "tous" ? true : t.type === filtre);
  const categories = newTx.type === "entree" ? categoriesEntree : categoriesSortie;
  const inputStyle = { background: input, border: `1px solid ${inputBorder}`, borderRadius: 8, padding: "10px 14px", color: text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: text }}>Finances</div>
          <div style={{ fontSize: 13, color: sub, marginTop: 2 }}>Aperçu financier</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <ExportPDF transactions={transactions} theme={theme} />
          <ExportExcel transactions={transactions} clients={clients} theme={theme} />
          <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Nouvelle transaction</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total entrées", valeur: totalEntrees.toLocaleString(), couleur: "#4A9B8E", signe: "▲" },
          { label: "Total sorties", valeur: totalSorties.toLocaleString(), couleur: "#E85555", signe: "▼" },
          { label: "Solde net", valeur: solde.toLocaleString(), couleur: solde >= 0 ? "#4A9B8E" : "#E85555", signe: solde >= 0 ? "▲" : "▼" },
        ].map((k, i) => (
          <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "20px 24px" }}>
            <div style={{ fontSize: 12, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: k.couleur }}>{k.signe} {k.valeur} <span style={{ fontSize: 12, fontWeight: 400, color: sub }}>FCFA</span></div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ background: card, border: `1px solid ${inputBorder}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 16 }}>Nouvelle transaction</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em" }}>Type</label>
              <select value={newTx.type} onChange={e => setNewTx({ ...newTx, type: e.target.value, categorie: e.target.value === "entree" ? "Prestation" : "Loyer" })} style={inputStyle}>
                <option value="entree">💰 Entrée d'argent</option>
                <option value="sortie">💸 Sortie d'argent</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em" }}>Catégorie</label>
              <select value={newTx.categorie} onChange={e => setNewTx({ ...newTx, categorie: e.target.value })} style={inputStyle}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</label>
              <input placeholder="Ex: Paiement client Diallo" value={newTx.libelle} onChange={e => setNewTx({ ...newTx, libelle: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em" }}>Montant (FCFA)</label>
              <input placeholder="Ex: 150000" type="number" value={newTx.montant} onChange={e => setNewTx({ ...newTx, montant: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</label>
              <input type="date" value={newTx.date} onChange={e => setNewTx({ ...newTx, date: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em" }}>Statut</label>
              <select value={newTx.statut} onChange={e => setNewTx({ ...newTx, statut: e.target.value })} style={inputStyle}>
                <option value="encaissé">✅ Encaissé</option>
                <option value="payé">✅ Payé</option>
                <option value="impayé">⚠️ Impayé</option>
                <option value="en attente">🕐 En attente</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={addTx} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Ajouter</button>
            <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: `1px solid ${inputBorder}`, borderRadius: 8, color: sub, padding: "10px 24px", fontSize: 13, cursor: "pointer" }}>Annuler</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["tous", "Tout"], ["entree", "💰 Entrées"], ["sortie", "💸 Sorties"]].map(([val, label]) => (
          <button key={val} onClick={() => setFiltre(val)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${filtre === val ? "#F5A623" : border}`, fontSize: 12, fontWeight: 600, cursor: "pointer", background: filtre === val ? "#F5A623" : card, color: filtre === val ? "#0F0F1A" : sub }}>{label}</button>
        ))}
      </div>

      {loading && <div style={{ color: sub, textAlign: "center", padding: 40 }}>Chargement...</div>}
      {!loading && (
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, overflow: "hidden" }}>
          {filtered.length === 0 && <div style={{ color: sub, textAlign: "center", padding: 40, fontSize: 14 }}>Aucune transaction</div>}
          {filtered.map((t, i) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < filtered.length - 1 ? `1px solid ${border}` : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: t.type === "entree" ? "rgba(74,155,142,0.15)" : "rgba(232,85,85,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{t.type === "entree" ? "↓" : "↑"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{t.libelle}</div>
                <div style={{ fontSize: 11, color: sub, marginTop: 2 }}>{t.date} · {t.categorie}</div>
              </div>
              <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.type === "entree" ? "#4A9B8E" : "#E85555" }}>{t.type === "entree" ? "+" : "-"}{t.montant?.toLocaleString()} FCFA</div>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: t.statut === "impayé" ? "rgba(232,85,85,0.1)" : "rgba(74,155,142,0.1)", color: t.statut === "impayé" ? "#E85555" : "#4A9B8E" }}>{t.statut}</span>
                </div>
                <button onClick={() => deleteTx(t.id)} style={{ background: "rgba(232,85,85,0.1)", border: "none", borderRadius: 6, color: "#E85555", fontSize: 11, padding: "4px 8px", cursor: "pointer" }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
