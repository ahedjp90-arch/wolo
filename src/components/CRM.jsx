"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const statutColors = {
  "Relance due": { bg: "rgba(232,85,85,0.1)", tx: "#E85555" },
  "Négociation": { bg: "rgba(245,166,35,0.1)", tx: "#F5A623" },
  "Gagné": { bg: "rgba(74,155,142,0.1)", tx: "#4A9B8E" },
  "Prospect": { bg: "rgba(107,107,138,0.1)", tx: "#6B6B8A" },
};

export default function CRM() {
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newClient, setNewClient] = useState({ nom: "", contact: "", telephone: "", email: "", secteur: "", statut: "Prospect", valeur: "", pipeline: "Premier contact", notes: "" });

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    if (!error) setClients(data || []);
    setLoading(false);
  };

  const addClient = async () => {
    if (!newClient.nom) return;
    const { data: { user } } = await supabase.auth.getUser();
    const avatar = newClient.nom[0].toUpperCase();
    const { error } = await supabase.from("clients").insert([{ ...newClient, user_id: user.id, avatar }]);
    if (!error) { fetchClients(); setNewClient({ nom: "", contact: "", telephone: "", email: "", secteur: "", statut: "Prospect", valeur: "", pipeline: "Premier contact", notes: "" }); setShowForm(false); }
  };

  const deleteClient = async (id) => {
    await supabase.from("clients").delete().eq("id", id);
    setSelected(null);
    fetchClients();
  };

  const filtered = clients.filter(c =>
    c.nom?.toLowerCase().includes(search.toLowerCase()) ||
    c.contact?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: "#0F0F1A" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#E8E8F0" }}>Clients</div>
          <div style={{ fontSize: 13, color: "#6B6B8A", marginTop: 2 }}>{clients.length} clients au total</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Nouveau client</button>
      </div>

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

      <input placeholder="Rechercher un client..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", background: "#111128", border: "1px solid #1E1E38", borderRadius: 10, padding: "10px 16px", color: "#E8E8F0", fontSize: 13, outline: "none", marginBottom: 16, boxSizing: "border-box" }} />

      {loading && <div style={{ color: "#6B6B8A", textAlign: "center", padding: 40 }}>Chargement...</div>}

      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 20 }}>
          <div style={{ background: "#111128", border: "1px solid #1E1E38", borderRadius: 14, overflow: "hidden" }}>
            {filtered.length === 0 && <div style={{ color: "#3A3A5A", textAlign: "center", padding: 40, fontSize: 14 }}>Aucun client — ajoutez-en un !</div>}
            {filtered.map((c, i) => (
              <div key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #1A1A30" : "none", cursor: "pointer", background: selected?.id === c.id ? "rgba(245,166,35,0.05)" : "transparent" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #7C7CF0, #5A5AE8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{c.nom?.[0]?.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#E8E8F0" }}>{c.nom}</div>
                  <div style={{ fontSize: 12, color: "#6B6B8A", marginTop: 2 }}>{c.contact} · {c.secteur}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: statutColors[c.statut]?.bg, color: statutColors[c.statut]?.tx }}>{c.statut}</span>
              </div>
            ))}
          </div>

          {selected && (
            <div style={{ background: "#111128", border: "1px solid #1E1E38", borderRadius: 14, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #7C7CF0, #5A5AE8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff" }}>{selected.nom?.[0]?.toUpperCase()}</div>
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
                <button onClick={() => deleteClient(selected.id)} style={{ flex: 1, background: "rgba(232,85,85,0.1)", border: "none", borderRadius: 8, color: "#E85555", padding: "8px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Supprimer</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
