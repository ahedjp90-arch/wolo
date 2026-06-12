"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const colonnes = ["À faire", "En cours", "Terminé"];
const prioriteColors = { haute: "#F5A623", moyenne: "#7C7CF0", basse: "#4A9B8E" };

export default function Taches() {
 const [taches, setTaches] = useState([]);
 const [showForm, setShowForm] = useState(false);
 const [loading, setLoading] = useState(true);
 const [userId, setUserId] = useState(null);
 const [newTache, setNewTache] = useState({ titre: "", priorite: "moyenne", categorie: "", colonne: "À faire" });

 useEffect(() => {
   supabase.auth.getSession().then(({ data: { session } }) => {
     if (session?.user) setUserId(session.user.id);
   });
   fetchTaches();
 }, []);

 const fetchTaches = async () => {
   setLoading(true);
   const { data } = await supabase.from("taches").select("*").order("created_at", { ascending: false });
   setTaches(data || []);
   setLoading(false);
 };

 const addTache = async () => {
   if (!newTache.titre || !userId) return;
   const { error } = await supabase.from("taches").insert([{ ...newTache, user_id: userId }]);
   if (!error) { fetchTaches(); setNewTache({ titre: "", priorite: "moyenne", categorie: "", colonne: "À faire" }); setShowForm(false); }
 };

 const moveTask = async (id, newColonne) => {
   await supabase.from("taches").update({ colonne: newColonne }).eq("id", id);
   fetchTaches();
 };

 const deleteTask = async (id) => {
   await supabase.from("taches").delete().eq("id", id);
   fetchTaches();
 };

 return (
   <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: "#0F0F1A" }}>
     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
       <div>
         <div style={{ fontSize: 22, fontWeight: 700, color: "#E8E8F0" }}>Tâches</div>
         <div style={{ fontSize: 13, color: "#6B6B8A", marginTop: 2 }}>{taches.filter(t => t.colonne !== "Terminé").length} tâches en cours</div>
       </div>
       <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Nouvelle tâche</button>
     </div>

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

     {loading && <div style={{ color: "#6B6B8A", textAlign: "center", padding: 40 }}>Chargement...</div>}
     {!loading && (
       <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
         {colonnes.map(colonne => (
           <div key={colonne} style={{ background: "#111128", border: "1px solid #1E1E38", borderRadius: 14, padding: 16 }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
               <div style={{ fontSize: 13, fontWeight: 600, color: "#E8E8F0" }}>{colonne}</div>
               <span style={{ background: "rgba(245,166,35,0.12)", color: "#F5A623", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>{taches.filter(t => t.colonne === colonne).length}</span>
             </div>
             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
               {taches.filter(t => t.colonne === colonne).map(task => (
                 <div key={task.id} style={{ background: "#0F0F1A", border: "1px solid #1E1E38", borderRadius: 10, padding: 14, borderLeft: `3px solid ${prioriteColors[task.priorite]}` }}>
                   <div style={{ fontSize: 13, color: "#E8E8F0", marginBottom: 10, lineHeight: 1.4 }}>{task.titre}</div>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <span style={{ fontSize: 11, color: "#6B6B8A" }}>{task.categorie}</span>
                     <div style={{ display: "flex", gap: 4 }}>
                       {colonnes.filter(c => c !== colonne).map(c => (
                         <button key={c} onClick={() => moveTask(task.id, c)} style={{ background: "rgba(245,166,35,0.1)", border: "none", borderRadius: 4, color: "#F5A623", fontSize: 10, padding: "3px 6px", cursor: "pointer" }}>
                           {c === "À faire" ? "◀" : c === "En cours" ? "▶" : "✓"}
                         </button>
                       ))}
                       <button onClick={() => deleteTask(task.id)} style={{ background: "rgba(232,85,85,0.1)", border: "none", borderRadius: 4, color: "#E85555", fontSize: 10, padding: "3px 6px", cursor: "pointer" }}>✕</button>
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
     )}
   </div>
 );
}
