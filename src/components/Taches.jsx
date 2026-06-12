"use client";
import { useState } from "react";

const colonnes = ["À faire", "En cours", "Terminé"];

const tachesInit = [
  { id: 1, titre: "Relancer client Diallo & Fils", priorite: "haute", categorie: "CRM", colonne: "À faire" },
  { id: 2, titre: "Envoyer devis Projet Cocody", priorite: "haute", categorie: "Finance", colonne: "À faire" },
  { id: 3, titre: "Réunion équipe commerciale", priorite: "moyenne", categorie: "Interne", colonne: "En cours" },
  { id: 4, titre: "Vérifier facture impayée #INV-042", priorite: "haute", categorie: "Finance", colonne: "Terminé" },
  { id: 5, titre: "Mise à jour base de données clients", priorite: "basse", categorie: "CRM", colonne: "À faire" },
  { id: 6, titre: "Préparer rapport mensuel", priorite: "moyenne", categorie: "Interne", colonne: "En cours" },
];

const prioriteColors = { haute: "#F5A623", moyenne: "#7C7CF0", basse: "#4A9B8E" };

export default function Taches() {
  const [taches, setTaches] = useState(tachesInit);
  const [showForm, setShowForm] = useState(false);
  const [newTache, setNewTache] = useState({ titre: "", priorite: "moyenne", categorie: "", colonne: "À faire" });

  const addTache = () => {
    if (!newTache.titre) return;
    setTaches([...taches, { ...newTache, id: Date.now() }]);
    setNewTache({ titre: "", priorite: "moyenne", categorie: "", colonne: "À faire" });
    setShowForm(false);
  };

  const moveTask = (id, newColonne) => {
    setTaches(taches.map(t => t.id === id ? { ...t, colonne: newColonne } : t));
  };

  const deleteTask = (id) => {
    setTaches(taches.filter(t => t.id !== id));
  };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: "#0F0F1A" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#E8E8F0" }}>Tâches</div>
          <div style={{ fontSize: 13, color: "#6B6B8A", marginTop: 2 }}>{taches.filter(t => t.colonne !== "Terminé").length} tâches en cours</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          + Nouvelle tâche
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div style={{ background: "#111128", border: "1px solid #2A2A45", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#E8E8F0", marginBottom: 16 }}>Nouvelle tâche</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input placeholder="Titre de la tâche" value={newTache.titre} onChange={e => setNewTache({ ...newTache, titre: e.target.value })}
              style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none", gridColumn: "span 2" }} />
            <select value={newTache.priorite} onChange={e => setNewTache({ ...newTache, priorite: e.target.value })}
              style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }}>
              <option value="haute">Priorité haute</option>
              <option value="moyenne">Priorité moyenne</option>
              <option value="basse">Priorité basse</option>
            </select>
            <input placeholder="Catégorie" value={newTache.categorie} onChange={e => setNewTache({ ...newTache, categorie: e.target.value })}
              style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button onClick={addTache} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Ajouter</button>
            <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: "1px solid #2A2A45", borderRadius: 8, color: "#6B6B8A", padding: "8px 20px", fontSize: 13, cursor: "pointer" }}>Annuler</button>
          </div>
        </div>
      )}

      {/* Kanban */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {colonnes.map(colonne => (
          <div key={colonne} style={{ background: "#111128", border: "1px solid #1E1E38", borderRadius: 14, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#E8E8F0" }}>{colonne}</div>
              <span style={{ background: "rgba(245,166,35,0.12)", color: "#F5A623", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>
                {taches.filter(t => t.colonne === colonne).length}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {taches.filter(t => t.colonne === colonne).map(task => (
                <div key={task.id} style={{ background: "#0F0F1A", border: "1px solid #1E1E38", borderRadius: 10, padding: 14, borderLeft: `3px solid ${prioriteColors[task.priorite]}` }}>
                  <div style={{ fontSize: 13, color: "#E8E8F0", marginBottom: 10, lineHeight: 1.4 }}>{task.titre}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#6B6B8A" }}>{task.categorie}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {colonnes.filter(c => c !== colonne).map(c => (
                        <button key={c} onClick={() => moveTask(task.id, c)}
                          style={{ background: "rgba(245,166,35,0.1)", border: "none", borderRadius: 4, color: "#F5A623", fontSize: 10, padding: "3px 6px", cursor: "pointer" }}>
                          {c === "À faire" ? "◀" : c === "En cours" ? "▶" : "✓"}
                        </button>
                      ))}
                      <button onClick={() => deleteTask(task.id)}
                        style={{ background: "rgba(232,85,85,0.1)", border: "none", borderRadius: 4, color: "#E85555", fontSize: 10, padding: "3px 6px", cursor: "pointer" }}>✕</button>
                    </div>
                  </div>
                </div>
              ))}
              {taches.filter(t => t.colonne === colonne).length === 0 && (
                <div style={{ fontSize: 12, color: "#3A3A5A", textAlign: "center", padding: "20px 0" }}>Aucune tâche</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
