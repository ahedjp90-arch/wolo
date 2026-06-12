"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Finances() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filtre, setFiltre] = useState("tous");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [newTx, setNewTx] = useState({ type: "entree", libelle: "", montant: "", date: "", categorie: "", statut: "encaissé" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id);
    });
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data } = await supabase.from("transactions").select("*").order("created_at", { ascending: false });
    setTransactions(data || []);
    setLoading(false);
  };

  const addTx = async () => {
    if (!newTx.libelle || !newTx.montant || !userId) return;
    const { error } = await supabase.from("transactions").insert([{ ...newTx, user_id: userId, montant: parseInt(newTx.montant) }]);
    if (!error) { fetchTransactions(); setNewTx({ type: "entree", libelle: "", montant: "", date: "", categorie: "", statut: "encaissé" }); setShowForm(false); }
  };

  const deleteTx = async (id) => {
    await supabase.from("transactions").delete().eq("id", id);
    fetchTransactions();
  };

  const totalEntrees = transactions.filter(t => t.type === "entree").reduce((s, t) => s + t.montant, 0);
  const totalSorties = transactions.filter(t => t.type === "sortie").reduce((s, t) => s + t.montant, 0);
  const solde = totalEntrees - totalSorties;
  const filtered = transactions.filter(t => filtre === "tous" ? true : t.type === filtre);

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: "#0F0F1A" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#E8E8F0" }}>Finances</div>
          <div style={{ fontSize: 13, color: "#6B6B8A", marginTop: 2 }}>Juin 2026</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Nouvelle transaction</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total entrées", valeur: totalEntrees.toLocaleString(), couleur: "#4A9B8E", signe: "▲" },
          { label: "Total sorties", valeur: totalSorties.toLocaleString(), couleur: "#E85555", signe: "▼" },
          { label: "Solde net", valeur: solde.toLocaleString(), couleur: solde >= 0 ? "#4A9B8E" : "#E85555", signe: solde >= 0 ? "▲" : "▼" },
        ].map((k, i) => (
          <div key={i} style={{ background: "#111128", border: "1px solid #1E1E38", borderRadius: 14, padding: "20px 24px" }}>
            <div style={{ fontSize: 12, color: "#6B6B8A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: k.couleur }}>{k.signe} {k.valeur} <span style={{ fontSize: 12, fontWeight: 400, color: "#6B6B8A" }}>FCFA</span></div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ background: "#111128", border: "1px solid #2A2A45", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#E8E8F0", marginBottom: 16 }}>Nouvelle transaction</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <select value={newTx.type} onChange={e => setNewTx({ ...newTx, type: e.target.value })} style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }}>
              <option value="entree">Entrée</option>
              <option value="sortie">Sortie</option>
            </select>
            <input placeholder="Libellé" value={newTx.libelle} onChange={e => setNewTx({ ...newTx, libelle: e.target.value })} style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }} />
            <input placeholder="Montant (FCFA)" type="number" value={newTx.montant} onChange={e => setNewTx({ ...newTx, montant: e.target.value })} style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }} />
            <input placeholder="Date" value={newTx.date} onChange={e => setNewTx({ ...newTx, date: e.target.value })} style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }} />
            <input placeholder="Catégorie" value={newTx.categorie} onChange={e => setNewTx({ ...newTx, categorie: e.target.value })} style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }} />
            <select value={newTx.statut} onChange={e => setNewTx({ ...newTx, statut: e.target.value })} style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }}>
              <option value="encaissé">Encaissé</option>
              <option value="payé">Payé</option>
              <option value="impayé">Impayé</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button onClick={addTx} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Ajouter</button>
            <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: "1px solid #2A2A45", borderRadius: 8, color: "#6B6B8A", padding: "8px 20px", fontSize: 13, cursor: "pointer" }}>Annuler</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["tous", "Tout"], ["entree", "Entrées"], ["sortie", "Sorties"]].map(([val, label]) => (
          <button key={val} onClick={() => setFiltre(val)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: filtre === val ? "#F5A623" : "#111128", color: filtre === val ? "#0F0F1A" : "#6B6B8A" }}>{label}</button>
        ))}
      </div>

      {loading && <div style={{ color: "#6B6B8A", textAlign: "center", padding: 40 }}>Chargement...</div>}
      {!loading && (
        <div style={{ background: "#111128", border: "1px solid #1E1E38", borderRadius: 14, overflow: "hidden" }}>
          {filtered.length === 0 && <div style={{ color: "#3A3A5A", textAlign: "center", padding: 40, fontSize: 14 }}>Aucune transaction</div>}
          {filtered.map((t, i) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #1A1A30" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: t.type === "entree" ? "rgba(74,155,142,0.15)" : "rgba(232,85,85,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{t.type === "entree" ? "↓" : "↑"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#E8E8F0" }}>{t.libelle}</div>
                <div style={{ fontSize: 11, color: "#6B6B8A", marginTop: 2 }}>{t.date} · {t.categorie}</div>
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
