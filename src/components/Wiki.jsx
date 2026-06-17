"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const categorieColors = {
  CRM: { bg: "rgba(124,124,240,0.1)", tx: "#7C7CF0" },
  Finance: { bg: "rgba(245,166,35,0.1)", tx: "#F5A623" },
  Interne: { bg: "rgba(74,155,142,0.1)", tx: "#4A9B8E" },
};

export default function Wiki({ theme }) {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [newArticle, setNewArticle] = useState({ titre: "", categorie: "CRM", contenu: "" });

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
    if (uid) { setUserId(uid); fetchArticles(uid); }
  }, []);

  const fetchArticles = async (uid) => {
    setLoading(true);
    const { data } = await supabase.from("wiki").select("*").eq("user_id", uid).order("created_at", { ascending: false });
    setArticles(data || []);
    setLoading(false);
  };

  const addArticle = async () => {
    if (!newArticle.titre || !newArticle.contenu || !userId) return;
    const { error } = await supabase.from("wiki").insert([{ ...newArticle, user_id: userId }]);
    if (!error) { fetchArticles(userId); setNewArticle({ titre: "", categorie: "CRM", contenu: "" }); setShowForm(false); }
  };

  const deleteArticle = async (id) => {
    await supabase.from("wiki").delete().eq("id", id).eq("user_id", userId);
    setSelected(null);
    fetchArticles(userId);
  };

  const filtered = articles.filter(a =>
    a.titre?.toLowerCase().includes(search.toLowerCase()) ||
    a.categorie?.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = { background: input, border: `1px solid ${inputBorder}`, borderRadius: 8, padding: "10px 14px", color: text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: text }}>Wiki</div>
          <div style={{ fontSize: 13, color: sub, marginTop: 2 }}>{articles.length} articles</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Nouvel article</button>
      </div>

      {showForm && (
        <div style={{ background: card, border: `1px solid ${inputBorder}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 16 }}>Nouvel article</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input placeholder="Titre" value={newArticle.titre} onChange={e => setNewArticle({ ...newArticle, titre: e.target.value })} style={inputStyle} />
            <select value={newArticle.categorie} onChange={e => setNewArticle({ ...newArticle, categorie: e.target.value })} style={inputStyle}>
              <option value="CRM">CRM</option>
              <option value="Finance">Finance</option>
              <option value="Interne">Interne</option>
            </select>
            <textarea placeholder="Contenu..." value={newArticle.contenu} onChange={e => setNewArticle({ ...newArticle, contenu: e.target.value })}
              style={{ ...inputStyle, resize: "vertical", minHeight: 120 }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button onClick={addArticle} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Publier</button>
            <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: `1px solid ${inputBorder}`, borderRadius: 8, color: sub, padding: "8px 20px", fontSize: 13, cursor: "pointer" }}>Annuler</button>
          </div>
        </div>
      )}

      <input placeholder="Rechercher un article..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, marginBottom: 16 }} />

      {loading && <div style={{ color: sub, textAlign: "center", padding: 40 }}>Chargement...</div>}
      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1.5fr" : "repeat(3, 1fr)", gap: 16 }}>
          {filtered.length === 0 && !selected && <div style={{ gridColumn: "span 3", color: sub, textAlign: "center", padding: 40, fontSize: 14 }}>Aucun article</div>}
          {filtered.map(article => (
            <div key={article.id} onClick={() => setSelected(selected?.id === article.id ? null : article)}
              style={{ background: card, border: `1px solid ${selected?.id === article.id ? "#F5A623" : border}`, borderRadius: 14, padding: 20, cursor: "pointer" }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: categorieColors[article.categorie]?.bg, color: categorieColors[article.categorie]?.tx }}>{article.categorie}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: text, marginBottom: 8 }}>{article.titre}</div>
              <div style={{ fontSize: 12, color: sub, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{article.contenu}</div>
            </div>
          ))}
          {selected && (
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: categorieColors[selected.categorie]?.bg, color: categorieColors[selected.categorie]?.tx }}>{selected.categorie}</span>
                <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: sub, fontSize: 18, cursor: "pointer" }}>✕</button>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 16 }}>{selected.titre}</div>
              <div style={{ fontSize: 13, color: sub, lineHeight: 1.8, whiteSpace: "pre-line" }}>{selected.contenu}</div>
              <button onClick={() => deleteArticle(selected.id)} style={{ marginTop: 20, background: "rgba(232,85,85,0.1)", border: "none", borderRadius: 8, color: "#E85555", padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Supprimer</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
