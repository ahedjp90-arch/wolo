"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const categorieColors = {
  CRM: { bg: "rgba(124,124,240,0.1)", tx: "#7C7CF0" },
  Finance: { bg: "rgba(245,166,35,0.1)", tx: "#F5A623" },
  Interne: { bg: "rgba(74,155,142,0.1)", tx: "#4A9B8E" },
};

export default function Wiki() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [newArticle, setNewArticle] = useState({ titre: "", categorie: "CRM", contenu: "" });

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("wiki").select("*").order("created_at", { ascending: false });
    if (!error) setArticles(data || []);
    setLoading(false);
  };

  const addArticle = async () => {
    if (!newArticle.titre || !newArticle.contenu) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("wiki").insert([{ ...newArticle, user_id: user.id }]);
    if (!error) { fetchArticles(); setNewArticle({ titre: "", categorie: "CRM", contenu: "" }); setShowForm(false); }
  };

  const deleteArticle = async (id) => {
    await supabase.from("wiki").delete().eq("id", id);
    setSelected(null);
    fetchArticles();
  };

  const filtered = articles.filter(a =>
    a.titre?.toLowerCase().includes(search.toLowerCase()) ||
    a.categorie?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: "#0F0F1A" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#E8E8F0" }}>Wiki</div>
          <div style={{ fontSize: 13, color: "#6B6B8A", marginTop: 2 }}>{articles.length} articles</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Nouvel article</button>
      </div>

      {showForm && (
        <div style={{ background: "#111128", border: "1px solid #2A2A45", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#E8E8F0", marginBottom: 16 }}>Nouvel article</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input placeholder="Titre" value={newArticle.titre} onChange={e => setNewArticle({ ...newArticle, titre: e.target.value })}
              style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }} />
            <select value={newArticle.categorie} onChange={e => setNewArticle({ ...newArticle, categorie: e.target.value })}
              style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }}>
              <option value="CRM">CRM</option>
              <option value="Finance">Finance</option>
              <option value="Interne">Interne</option>
            </select>
            <textarea placeholder="Contenu..." value={newArticle.contenu} onChange={e => setNewArticle({ ...newArticle, contenu: e.target.value })}
              style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "10px 14px", color: "#E8E8F0", fontSize: 13, outline: "none", resize: "vertical", minHeight: 120 }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button onClick={addArticle} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Publier</button>
            <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: "1px solid #2A2A45", borderRadius: 8, color: "#6B6B8A", padding: "8px 20px", fontSize: 13, cursor: "pointer" }}>Annuler</button>
          </div>
        </div>
      )}

      <input placeholder="Rechercher un article..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", background: "#111128", border: "1px solid #1E1E38", borderRadius: 10, padding: "10px 16px", color: "#E8E8F0", fontSize: 13, outline: "none", marginBottom: 16, boxSizing: "border-box" }} />

      {loading && <div style={{ color: "#6B6B8A", textAlign: "center", padding: 40 }}>Chargement...</div>}

      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1.5fr" : "repeat(3, 1fr)", gap: 16 }}>
          {filtered.length === 0 && !selected && (
            <div style={{ gridColumn: "span 3", color: "#3A3A5A", textAlign: "center", padding: 40, fontSize: 14 }}>Aucun article — créez-en un !</div>
          )}
          {filtered.map(article => (
            <div key={article.id} onClick={() => setSelected(selected?.id === article.id ? null : article)}
              style={{ background: "#111128", border: `1px solid ${selected?.id === article.id ? "#F5A623" : "#1E1E38"}`, borderRadius: 14, padding: 20, cursor: "pointer" }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: categorieColors[article.categorie]?.bg, color: categorieColors[article.categorie]?.tx }}>{article.categorie}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#E8E8F0", marginBottom: 8, lineHeight: 1.4 }}>{article.titre}</div>
              <div style={{ fontSize: 12, color: "#6B6B8A", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{article.contenu}</div>
            </div>
          ))}

          {selected && (
            <div style={{ background: "#111128", border: "1px solid #1E1E38", borderRadius: 14, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: categorieColors[selected.categorie]?.bg, color: categorieColors[selected.categorie]?.tx }}>{selected.categorie}</span>
                <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: "#6B6B8A", fontSize: 18, cursor: "pointer" }}>✕</button>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#E8E8F0", marginBottom: 16, lineHeight: 1.3 }}>{selected.titre}</div>
              <div style={{ fontSize: 13, color: "#B8B8D0", lineHeight: 1.8, whiteSpace: "pre-line" }}>{selected.contenu}</div>
              <button onClick={() => deleteArticle(selected.id)} style={{ marginTop: 20, background: "rgba(232,85,85,0.1)", border: "none", borderRadius: 8, color: "#E85555", padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Supprimer</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
