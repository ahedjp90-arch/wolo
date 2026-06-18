"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const secteurs = [
  "Commerce & Distribution", "Restauration & Alimentation", "BTP & Construction",
  "Transport & Logistique", "Informatique & Tech", "Santé & Pharmacie",
  "Éducation & Formation", "Agriculture & Élevage", "Mode & Textile",
  "Beauté & Cosmétiques", "Immobilier", "Finance & Assurance",
  "Hôtellerie & Tourisme", "Médias & Communication", "Énergie & Environnement",
  "Industrie & Manufacture", "ONG & Associations", "Services aux entreprises", "Autre"
];

const statutColors = {
  "Relance due": { bg: "rgba(232,85,85,0.1)", tx: "#E85555" },
  "Négociation": { bg: "rgba(245,166,35,0.1)", tx: "#F5A623" },
  "Gagné": { bg: "rgba(74,155,142,0.1)", tx: "#4A9B8E" },
  "Prospect": { bg: "rgba(107,107,138,0.1)", tx: "#6B6B8A" },
};

export default function CRM({ theme }) {
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [newClient, setNewClient] = useState({ nom: "", contact: "", telephone: "", email: "", secteur: "", statut: "Prospect", valeur: "", pipeline: "Premier contact", notes: "" });

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
    if (uid) { setUserId(uid); fetchClients(uid); }
  }, []);

  const fetchClients = async (uid) => {
    setLoading(true);
    const { data } = await supabase.from("clients").select("*").eq("user_id", uid).order("created_at", { ascending: false });
    setClients(data || []);
    setLoading(false);
  };

  const addClient = async () => {
    if (!newClient.nom || !userId) return;
    const { error } = await supabase.from("clients").insert([{ ...newClient, user_id: userId }]);
    if (!error) {
      fetchClients(userId);
      setNewClient({ nom: "", contact: "", telephone: "", email: "", secteur: "", statut: "Prospect", valeur: "", pipeline: "Premier contact", notes: "" });
      setShowForm(false);
    }
  };

  const deleteClient = async (id) => {
    await supabase.from("clients").delete().eq("id", id).eq("user_id", userId);
    setSelected(null);
    fetchClients(userId);
  };

  const filtered = clients.filter(c =>
    c.nom?.toLowerCase().includes(search.toLowerCase()) ||
    c.contact?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: text }}>Clients</div>
          <div style={{ fontSize: 13, color: sub, marginTop: 2 }}>{clients.length} clients au total</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Nouveau client</button>
      </div>

      {showForm && (
        <div style={{ background: card, border: `1px solid ${inputBorder}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 16 }}>Nouveau client</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input placeholder="Nom entreprise" value={newClient.nom} onChange={e => setNewClient({ ...newClient, nom: e.target.value })} style={inputStyle} />
            <input placeholder="Nom contact" value={newClient.contact} onChange={e => setNewClient({ ...newClient, contact: e.target.value })} style={inputStyle} />
            <input placeholder="Téléphone" value={newClient.telephone} onChange={e => setNewClient({ ...newClient, telephone: e.target.value })} style={inputStyle} />
            <input placeholder="Email" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} style={inputStyle} />
            <select value={newClient.secteur} onChange={e => setNewClient({ ...newClient, secteur: e.target.value })} style={inputStyle}>
              <option value="">Choisir un secteur</option>
              {secteurs.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input placeholder="Valeur estimée (FCFA)" value={newClient.valeur} onChange={e => setNewClient({ ...newClient, valeur: e.target.value })} style={inputStyle} />
            <select value={newClient.statut} onChange={e => setNewClient({ ...newClient, statut: e.target.value })} style={inputStyle}>
              <option value="Prospect">Prospect</option>
              <option value="Négociation">Négociation</option>
              <option value="Gagné">Gagné</option>
              <option value="Relance due">Relance due</option>
            </select>
            <select value={newClient.pipeline} onChange={e => setNewClient({ ...newClient, pipeline: e.target.value })} style={inputStyle}>
              <option value="Premier contact">Premier contact</option>
              <option value="Proposition envoyée">Proposition envoyée</option>
              <option value="En négociation">En négociation</option>
              <option value="Contrat signé">Contrat signé</option>
              <option value="Perdu">Perdu</option>
            </select>
          </div>
          <textarea placeholder="Notes..." value={newClient.notes} onChange={e => setNewClient({ ...newClient, notes: e.target.value })}
            style={{ ...inputStyle, marginTop: 12, resize: "vertical", minHeight: 80 }} />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button onClick={addClient} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Ajouter</button>
            <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: `1px solid ${inputBorder}`, borderRadius: 8, color: sub, padding: "8px 20px", fontSize: 13, cursor: "pointer" }}>Annuler</button>
          </div>
        </div>
      )}

      <input placeholder="Rechercher un client..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, marginBottom: 16 }} />

      {loading && <div style={{ color: sub, textAlign: "center", padding: 40 }}>Chargement...</div>}
      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 20 }}>
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, overflow: "hidden" }}>
            {filtered.length === 0 && <div style={{ color: sub, textAlign: "center", padding: 40, fontSize: 14 }}>Aucun client — ajoutez-en un !</div>}
            {filtered.map((c, i) => (
              <div key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: i < filtered.length - 1 ? `1px solid ${border}` : "none", cursor: "pointer", background: selected?.id === c.id ? "rgba(245,166,35,0.05)" : "transparent" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #7C7CF0, #5A5AE8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{c.nom?.[0]?.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: text }}>{c.nom}</div>
                  <div style={{ fontSize: 12, color: sub, marginTop: 2 }}>{c.contact} · {c.secteur}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: statutColors[c.statut]?.bg, color: statutColors[c.statut]?.tx }}>{c.statut}</span>
              </div>
            ))}
          </div>
          {selected && (
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #7C7CF0, #5A5AE8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff" }}>{selected.nom?.[0]?.toUpperCase()}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: text }}>{selected.nom}</div>
                    <div style={{ fontSize: 12, color: sub }}>{selected.pipeline}</div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: sub, fontSize: 18, cursor: "pointer" }}>✕</button>
              </div>
              {[["Contact", selected.contact], ["Téléphone", selected.telephone], ["Email", selected.email], ["Secteur", selected.secteur], ["Valeur", selected.valeur ? selected.valeur + " FCFA" : "–"]].map(([label, val]) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 13, color: text }}>{val}</div>
                </div>
              ))}
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Notes</div>
                <div style={{ fontSize: 13, color: text, background: input, borderRadius: 8, padding: "10px 14px", lineHeight: 1.5 }}>{selected.notes}</div>
              </div>
              <button onClick={() => deleteClient(selected.id)} style={{ marginTop: 16, width: "100%", background: "rgba(232,85,85,0.1)", border: "none", borderRadius: 8, color: "#E85555", padding: "8px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Supprimer</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
