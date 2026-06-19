"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { t } from "@/lib/i18n";

export default function Taches({ theme, lang = "fr" }) {
  const [taches, setTaches] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newTache, setNewTache] = useState({ titre: "", priorite: "Normale", categorie: "", colonne: "A faire" });
  const [drag, setDrag] = useState(null);

  const isDark = theme === "dark";
  const bg = isDark ? "#0F0F1A" : "#F3F4F6";
  const card = isDark ? "#111128" : "#FFFFFF";
  const border = isDark ? "#1E1E38" : "#E5E7EB";
  const text = isDark ? "#E8E8F0" : "#111827";
  const sub = isDark ? "#6B6B8A" : "#6B7280";
  const input = isDark ? "#0F0F1A" : "#F9FAFB";
  const inputBorder = isDark ? "#2A2A45" : "#D1D5DB";
  const inputStyle = { background: input, border: `1px solid ${inputBorder}`, borderRadius: 8, padding: "10px 14px", color: text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" };

  const colonnes = [
    { key: "A faire", label: t("a_faire", lang), color: "#6B6B8A" },
    { key: "En cours", label: t("en_cours", lang), color: "#F5A623" },
    { key: "Termine", label: t("termine", lang), color: "#4A9B8E" },
  ];

  const prioriteColors = { "Haute": "#E85555", "Normale": "#7C7CF0", "Basse": "#4A9B8E" };

  useEffect(() => {
    const uid = localStorage.getItem("wolo_user_id");
    if (uid) { setUserId(uid); fetchTaches(uid); }
  }, []);

  const fetchTaches = async (uid) => {
    const { data } = await supabase.from("taches").select("*").eq("user_id", uid).order("created_at", { ascending: false });
    setTaches(data || []);
  };

  const ajouterTache = async () => {
    if (!newTache.titre || !userId) return;
    await supabase.from("taches").insert([{ ...newTache, user_id: userId }]);
    fetchTaches(userId);
    setNewTache({ titre: "", priorite: "Normale", categorie: "", colonne: "A faire" });
    setShowForm(false);
  };

  const supprimerTache = async (id) => {
    await supabase.from("taches").delete().eq("id", id).eq("user_id", userId);
    fetchTaches(userId);
  };

  const deplacerTache = async (id, colonne) => {
    await supabase.from("taches").update({ colonne }).eq("id", id).eq("user_id", userId);
    fetchTaches(userId);
  };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: text }}>{lang === "en" ? "Tasks" : "Taches"}</div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{t("nouvelle_tache", lang)}</button>
      </div>

      {showForm && (
        <div style={{ background: card, border: `1px solid ${inputBorder}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            <input placeholder={lang === "en" ? "Task title" : "Titre de la tache"} value={newTache.titre} onChange={e => setNewTache({ ...newTache, titre: e.target.value })} style={inputStyle} />
            <select value={newTache.priorite} onChange={e => setNewTache({ ...newTache, priorite: e.target.value })} style={inputStyle}>
              <option value="Haute">{lang === "en" ? "High" : "Haute"}</option>
              <option value="Normale">{lang === "en" ? "Normal" : "Normale"}</option>
              <option value="Basse">{lang === "en" ? "Low" : "Basse"}</option>
            </select>
            <select value={newTache.colonne} onChange={e => setNewTache({ ...newTache, colonne: e.target.value })} style={inputStyle}>
              <option value="A faire">{t("a_faire", lang)}</option>
              <option value="En cours">{t("en_cours", lang)}</option>
              <option value="Termine">{t("termine", lang)}</option>
            </select>
          </div>
          <input placeholder={lang === "en" ? "Category (optional)" : "Categorie (optionnel)"} value={newTache.categorie} onChange={e => setNewTache({ ...newTache, categorie: e.target.value })} style={{ ...inputStyle, marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={ajouterTache} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{lang === "en" ? "Add" : "Ajouter"}</button>
            <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: `1px solid ${inputBorder}`, borderRadius: 8, color: sub, padding: "10px 24px", fontSize: 13, cursor: "pointer" }}>{t("annuler", lang)}</button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {colonnes.map(col => (
          <div key={col.key} onDragOver={e => e.preventDefault()} onDrop={() => drag && deplacerTache(drag, col.key)}
            style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 20, minHeight: 300 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: text }}>{col.label}</div>
              <div style={{ fontSize: 12, color: sub, marginLeft: "auto" }}>{taches.filter(t => t.colonne === col.key).length}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {taches.filter(tk => tk.colonne === col.key).map(tk => (
                <div key={tk.id} draggable onDragStart={() => setDrag(tk.id)} onDragEnd={() => setDrag(null)}
                  style={{ background: isDark ? "#0F0F1A" : "#F9FAFB", border: `1px solid ${border}`, borderRadius: 10, padding: "12px 14px", cursor: "grab" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: text, flex: 1 }}>{tk.titre}</div>
                    <button onClick={() => supprimerTache(tk.id)} style={{ background: "transparent", border: "none", color: sub, fontSize: 14, cursor: "pointer", flexShrink: 0 }}>x</button>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: `${prioriteColors[tk.priorite]}20`, color: prioriteColors[tk.priorite] }}>{tk.priorite}</span>
                    {tk.categorie && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: isDark ? "#1A1A2E" : "#E5E7EB", color: sub }}>{tk.categorie}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
