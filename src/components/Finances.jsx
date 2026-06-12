"use client";
import { useState } from "react";

const transactionsInit = [
  { id: 1, type: "entree", libelle: "Paiement Tech Abidjan", montant: 430000, date: "10 juin 2026", categorie: "Prestation", statut: "encaissé" },
  { id: 2, type: "sortie", libelle: "Loyer bureau Plateau", montant: 75000, date: "01 juin 2026", categorie: "Charges fixes", statut: "payé" },
  { id: 3, type: "entree", libelle: "Acompte Groupe Kouamé", montant: 300000, date: "08 juin 2026", categorie: "Prestation", statut: "encaissé" },
  { id: 4, type: "sortie", libelle: "Abonnement Vercel + Supabase", montant: 25000, date: "05 juin 2026", categorie: "Outils", statut: "payé" },
  { id: 5, type: "entree", libelle: "Facture INV-041 — SARL Traoré", montant: 180000, date: "03 juin 2026", categorie: "Prestation", statut: "impayé" },
  { id: 6, type: "sortie", libelle: "Salaire assistant commercial", montant: 80000, date: "01 juin 2026", categorie: "RH", statut: "payé" },
];

export default function Finances() {
  const [transactions, setTransactions] = useState(transactionsInit);
  const [showForm, setShowForm] = useState(false);
  const [filtre, setFiltre] = useState("tous");
  const [newTx, setNewTx] = useState({ type: "entree", libelle: "", montant: "", date: "", categorie: "", statut: "encaissé" });

  const totalEntrees = transactions.filter(t => t.type === "entree").reduce((s, t) => s + t.montant, 0);
  const totalSorties = transactions.filter(t => t.type === "sortie").reduce((s, t) => s + t.montant, 0);
  const solde = totalEntrees - totalSorties;

  const filtered = transactions.filter(t => filtre === "tous" ? true : t.type === filtre);

  const addTx = () => {
    if (!newTx.libelle || !newTx.montant) return;
    setTransactions([{ ...newTx, id: Date.now(), montant: parseInt(newTx.montant) }, ...transactions]);
    setNewTx({ type: "entree", libelle: "", montant: "", date: "", categorie: "", statut: "encaissé" });
    setShowForm(false);
  };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: "#0F0F1A" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#E8E8F0" }}>Finances</div>
          <div style={{ fontSize: 13, color: "#6B6B8A", marginTop: 2 }}>Juin 2026</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          + Nouvelle transaction
        </button>
      </div>

      {/* KPIs */}
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

      {/* Formulaire */}
      {showForm && (
        <div style={{ background: "#111128", border: "1px solid #2A2A45", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#E8E8F0", marginBottom: 16 }}>Nouvelle transaction</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <select value={newTx.type} onChange={e => setNewTx({ ...newTx, type: e.target.value })}
              style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }}>
              <option value="entree">Entrée</option>
              <option value="sortie">Sortie</option>
            </select>
            <input placeholder="Libellé" value={newTx.libelle} onChange={e => setNewTx({ ...newTx, libelle: e.target.value })}
              style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }} />
            <input placeholder="Montant (FCFA)" type="number" value={newTx.montant} onChange={e => setNewTx({ ...newTx, montant: e.target.value })}
              style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }} />
            <input placeholder="Date" value={newTx.date} onChange={e => setNewTx({ ...newTx, date: e.target.value })}
              style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }} />
            <input placeholder="Catégorie" value={newTx.categorie} onChange={e => setNewTx({ ...newTx, categorie: e.target.value })}
              style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }} />
            <select value={newTx.statut} onChange={e => setNewTx({ ...newTx, statut: e.target.value })}
              style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }}>
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

      {/* Filtres */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["tous", "Tout"], ["entree", "Entrées"], ["sortie", "Sorties"]].map(([val, label]) => (
          <button key={val} onClick={() => setFiltre(val)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: filtre === val ? "#F5A623" : "#111128", color: filtre === val ? "#0F0F1A" : "#6B6B8A" }}>{label}</button>
        ))}
      </div>

      {/* Transactions */}
      <div style={{ background: "#111128", border: "1px solid #1E1E38", borderRadius: 14, overflow: "hidden" }}>
        {filtered.map((t, i) => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #1A1A30" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: t.type === "entree" ? "rgba(74,155,142,0.15)" : "rgba(232,85,85,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
              {t.type === "entree" ? "↓" : "↑"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#E8E8F0" }}>{t.libelle}</div>
              <div style={{ fontSize: 11, color: "#6B6B8A", marginTop: 2 }}>{t.date} · {t.categorie}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.type === "entree" ? "#4A9B8E" : "#E85555" }}>
                {t.type === "entree" ? "+" : "-"}{t.montant.toLocaleString()} FCFA
              </div>
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: t.statut === "impayé" ? "rgba(232,85,85,0.1)" : "rgba(74,155,142,0.1)", color: t.statut === "impayé" ? "#E85555" : "#4A9B8E" }}>{t.statut}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
