"use client";
import { useState } from "react";

const clientsInit = [
  { id: 1, nom: "Diallo & Fils", contact: "Mamadou Diallo", telephone: "+225 07 00 11 22", email: "m.diallo@dialloetfils.ci", secteur: "Commerce", statut: "Relance due", valeur: "850 000", avatar: "D", pipeline: "Négociation", notes: "Intéressé par le pack Business." },
  { id: 2, nom: "Groupe Kouamé", contact: "Aya Kouamé", telephone: "+225 05 44 33 22", email: "a.kouame@groupekouame.ci", secteur: "Import/Export", statut: "Négociation", valeur: "1 200 000", avatar: "G", pipeline: "Proposition envoyée", notes: "En attente de validation du devis." },
  { id: 3, nom: "Tech Abidjan", contact: "Koffi Assi", telephone: "+225 01 55 66 77", email: "k.assi@techabidjan.ci", secteur: "Technologie", statut: "Gagné", valeur: "430 000", avatar: "T", pipeline: "Clôturé", notes: "Contrat signé. Livraison prévue." },
  { id: 4, nom: "SARL Traoré", contact: "Ibrahim Traoré", telephone: "+225 07 88 99 00", email: "i.traore@sarltraore.ci", secteur: "BTP", statut: "Prospect", valeur: "–", avatar: "S", pipeline: "Premier contact", notes: "Rencontré au salon PME Abidjan." },
  { id: 5, nom: "Maison Bamba", contact: "Fatoumata Bamba", telephone: "+225 05 22 33 44", email: "f.bamba@maisonbamba.ci", secteur: "Distribution", statut: "Prospect", valeur: "–", avatar: "M", pipeline: "Premier contact", notes: "Intéressée par une démo." },
];

const statutColors = {
  "Relance due": { bg: "rgba(232,85,85,0.1)", tx: "#E85555" },
  "Négociation": { bg: "rgba(245,166,35,0.1)", tx: "#F5A623" },
  "Gagné": { bg: "rgba(74,155,142,0.1)", tx: "#4A9B8E" },
  "Prospect": { bg: "rgba(107,107,138,0.1)", tx: "#6B6B8A" },
};

export default function CRM() {
  const [clients, setClients] = useState(clientsInit);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({ nom: "", contact: "", telephone: "", email: "", secteur: "", statut: "Prospect", valeur: "", pipeline: "Premier contact", notes: "" });

  const filtered = clients.filter(c =>
    c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.contact.toLowerCase().includes(search.toLowerCase())
  );

  const addClient = () => {
    if (!newClient.nom) return;
    const avatar = newClient.nom[0].toUpperCase();
    setClients([...clients, { ...newClient, id: Date.now(), avatar }]);
    setNewClient({ nom: "", contact: "", telephone: "", email: "", secteur: "", statut: "Prospect", valeur: "", pipeline: "Premier contact", notes: "" });
    setShowForm(false);
  };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: "#0F0F1A" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#E8E8F0" }}>Clients</div>
          <div style={{ fontSize: 13, color: "#6B6B8A", marginTop: 2 }}>{clients.length} clients au total</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          + Nouveau client
        </button>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div style={{ background: "#111128", border: "1px solid #2A2A45", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#E8E8F0", marginBottom: 16 }}>Nouveau client</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["nom", "Nom entreprise"], ["contact", "Nom contact"], ["telephone", "Téléphone"], ["email", "Email"], ["secteur", "Secteur"], ["valeur", "Valeur estimée (FCFA)"]].map(([key, placeholder]) => (
              <input key={key} placeholder={placeholder} value={newClient[key]} onChange={e => setNewClient({ ...newClient, [key]: e.target.value })}
                style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }} />
            ))}
          </div>
          <textarea placeholder="Notes..." value={newClient.notes} onChange={e => setNewClient({ ...newClient, notes: e.target.value })}
            style={{ width: "100%", marginTop: 12, background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button onClick={addClient} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Ajouter</button>
            <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: "1px solid #2A2A45", borderRadius: 8, color: "#6B6B8A", padding: "8px 20px", fontSize: 13, cursor: "pointer" }}>Annuler</button>
          </div>
        </div>
      )}

      {/* Recherche */}
      <input placeholder="Rechercher un client..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", background: "#111128", border: "1px solid #1E1E38", borderRadius: 10, padding: "10px 16px", color: "#E8E8F0", fontSize: 13, outline: "none", marginBottom: 16, boxSizing: "border-box" }} />

      {/* Liste + Détail */}
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 20 }}>
        {/* Liste */}
        <div style={{ background: "#111128", border: "1px solid #1E1E38", borderRadius: 14, overflow: "hidden" }}>
          {filtered.map((c, i) => (
            <div key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #1A1A30" : "none", cursor: "pointer", background: selected?.id === c.id ? "rgba(245,166,35,0.05)" : "transparent" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #7C7CF0, #5A5AE8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{c.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#E8E8F0" }}>{c.nom}</div>
                <div style={{ fontSize: 12, color: "#6B6B8A", marginTop: 2 }}>{c.contact} · {c.secteur}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: statutColors[c.statut]?.bg, color: statutColors[c.statut]?.tx }}>{c.statut}</span>
                {c.valeur !== "–" && <div style={{ fontSize: 12, color: "#6B6B8A", marginTop: 4 }}>{c.valeur} FCFA</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Détail client */}
        {selected && (
          <div style={{ background: "#111128", border: "1px solid #1E1E38", borderRadius: 14, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #7C7CF0, #5A5AE8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff" }}>{selected.avatar}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#E8E8F0" }}>{selected.nom}</div>
                  <div style={{ fontSize: 12, color: "#6B6B8A" }}>{selected.pipeline}</div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: "#6B6B8A", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            {[["Contact", selected.contact], ["Téléphone", selected.telephone], ["Email", selected.email], ["Secteur", selected.secteur], ["Valeur", selected.valeur !== "–" ? selected.valeur + " FCFA" : "–"]].map(([label, val]) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#6B6B8A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 13, color: "#E8E8F0" }}>{val}</div>
              </div>
            ))}
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 11, color: "#6B6B8A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Notes</div>
              <div style={{ fontSize: 13, color: "#E8E8F0", background: "#0F0F1A", borderRadius: 8, padding: "10px 14px", lineHeight: 1.5 }}>{selected.notes}</div>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button style={{ flex: 1, background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Relancer</button>
              <button style={{ flex: 1, background: "transparent", border: "1px solid #2A2A45", borderRadius: 8, color: "#6B6B8A", padding: "8px", fontSize: 12, cursor: "pointer" }}>Modifier</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
