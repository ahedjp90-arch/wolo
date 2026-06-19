"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { t } from "@/lib/i18n";

const statutColors = {
 "Prospect": { bg: "rgba(107,107,138,0.1)", tx: "#6B6B8A" },
 "Negociation": { bg: "rgba(245,166,35,0.1)", tx: "#F5A623" },
 "Gagne": { bg: "rgba(74,155,142,0.1)", tx: "#4A9B8E" },
 "Relance due": { bg: "rgba(232,85,85,0.1)", tx: "#E85555" },
};

export default function CRM({ theme, lang = "fr" }) {
 const [clients, setClients] = useState([]);
 const [userId, setUserId] = useState(null);
 const [showForm, setShowForm] = useState(false);
 const [editClient, setEditClient] = useState(null);
 const [search, setSearch] = useState("");
 const [filtreStatut, setFiltreStatut] = useState("Tous");
 const [filtreSecteur, setFiltreSecteur] = useState("Tous");
 const [newClient, setNewClient] = useState({ nom: "", contact: "", telephone: "", email: "", secteur: "", statut: "Prospect", valeur: "", pipeline: "", notes: "" });

 const isDark = theme === "dark";
 const bg = isDark ? "#0F0F1A" : "#F3F4F6";
 const card = isDark ? "#111128" : "#FFFFFF";
 const border = isDark ? "#1E1E38" : "#E5E7EB";
 const text = isDark ? "#E8E8F0" : "#111827";
 const sub = isDark ? "#6B6B8A" : "#6B7280";
 const input = isDark ? "#0F0F1A" : "#F9FAFB";
 const inputBorder = isDark ? "#2A2A45" : "#D1D5DB";
 const inputStyle = { background: input, border: `1px solid ${inputBorder}`, borderRadius: 8, padding: "10px 14px", color: text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" };

 const statutOptions = lang === "en"
   ? [{ val: "Tous", label: "All" }, { val: "Prospect", label: "Prospect" }, { val: "Negociation", label: "Negotiation" }, { val: "Gagne", label: "Won" }, { val: "Relance due", label: "Follow-up" }]
   : [{ val: "Tous", label: "Tous" }, { val: "Prospect", label: "Prospect" }, { val: "Negociation", label: "Negociation" }, { val: "Gagne", label: "Gagne" }, { val: "Relance due", label: "Relance due" }];

 useEffect(() => {
   const uid = localStorage.getItem("wolo_user_id");
   if (uid) { setUserId(uid); fetchClients(uid); }
 }, []);

 const fetchClients = async (uid) => {
   const { data } = await supabase.from("clients").select("*").eq("user_id", uid).order("created_at", { ascending: false });
   setClients(data || []);
 };

 const sauvegarderClient = async () => {
   if (!newClient.nom || !userId) return;
   if (editClient) {
     await supabase.from("clients").update(newClient).eq("id", editClient.id).eq("user_id", userId);
   } else {
     await supabase.from("clients").insert([{ ...newClient, user_id: userId }]);
   }
   fetchClients(userId);
   setNewClient({ nom: "", contact: "", telephone: "", email: "", secteur: "", statut: "Prospect", valeur: "", pipeline: "", notes: "" });
   setShowForm(false);
   setEditClient(null);
 };

 const supprimerClient = async (id) => {
   await supabase.from("clients").delete().eq("id", id).eq("user_id", userId);
   fetchClients(userId);
 };

 const secteurs = [...new Set(clients.map(c => c.secteur).filter(Boolean))];

 const filtered = clients.filter(c => {
   const matchSearch = c.nom?.toLowerCase().includes(search.toLowerCase()) || c.contact?.toLowerCase().includes(search.toLowerCase());
   const matchStatut = filtreStatut === "Tous" || c.statut === filtreStatut;
   const matchSecteur = filtreSecteur === "Tous" || c.secteur === filtreSecteur;
   return matchSearch && matchStatut && matchSecteur;
 });

 return (
   <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: bg }}>
     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
       <div>
         <div style={{ fontSize: 22, fontWeight: 700, color: text }}>{lang === "en" ? "Clients" : "Clients"}</div>
         <div style={{ fontSize: 13, color: sub, marginTop: 2 }}>{filtered.length} {lang === "en" ? "clients" : "clients"}</div>
       </div>
       <button onClick={() => { setShowForm(!showForm); setEditClient(null); setNewClient({ nom: "", contact: "", telephone: "", email: "", secteur: "", statut: "Prospect", valeur: "", pipeline: "", notes: "" }); }}
         style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
         {t("nouveau_client", lang)}
       </button>
     </div>

     {showForm && (
       <div style={{ background: card, border: `1px solid ${inputBorder}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
         <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 16 }}>{editClient ? (lang === "en" ? "Edit client" : "Modifier client") : (lang === "en" ? "New client" : "Nouveau client")}</div>
         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
           <input placeholder={t("nom", lang)} value={newClient.nom} onChange={e => setNewClient({ ...newClient, nom: e.target.value })} style={inputStyle} />
           <input placeholder={t("contact", lang)} value={newClient.contact} onChange={e => setNewClient({ ...newClient, contact: e.target.value })} style={inputStyle} />
           <input placeholder={t("telephone", lang)} value={newClient.telephone} onChange={e => setNewClient({ ...newClient, telephone: e.target.value })} style={inputStyle} />
           <input placeholder={t("email", lang)} value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} style={inputStyle} />
           <input placeholder={t("secteur", lang)} value={newClient.secteur} onChange={e => setNewClient({ ...newClient, secteur: e.target.value })} style={inputStyle} />
           <select value={newClient.statut} onChange={e => setNewClient({ ...newClient, statut: e.target.value })} style={inputStyle}>
             {statutOptions.filter(o => o.val !== "Tous").map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
           </select>
           <input placeholder={t("valeur", lang)} type="number" value={newClient.valeur} onChange={e => setNewClient({ ...newClient, valeur: e.target.value })} style={inputStyle} />
           <input placeholder={t("pipeline", lang)} value={newClient.pipeline} onChange={e => setNewClient({ ...newClient, pipeline: e.target.value })} style={inputStyle} />
         </div>
         <textarea placeholder={t("notes", lang)} value={newClient.notes} onChange={e => setNewClient({ ...newClient, notes: e.target.value })}
           style={{ ...inputStyle, resize: "vertical", minHeight: 70, marginBottom: 12 }} />
         <div style={{ display: "flex", gap: 10 }}>
           <button onClick={sauvegarderClient} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{t("sauvegarder", lang)}</button>
           <button onClick={() => { setShowForm(false); setEditClient(null); }} style={{ background: "transparent", border: `1px solid ${inputBorder}`, borderRadius: 8, color: sub, padding: "10px 24px", fontSize: 13, cursor: "pointer" }}>{t("annuler", lang)}</button>
         </div>
       </div>
     )}

     <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
       <input placeholder={t("rechercher_client", lang)} value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 280 }} />
       <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
         {statutOptions.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
       </select>
       <select value={filtreSecteur} onChange={e => setFiltreSecteur(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
         <option value="Tous">{t("tous_secteurs", lang)}</option>
         {secteurs.map(s => <option key={s} value={s}>{s}</option>)}
       </select>
     </div>

     <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, overflow: "hidden" }}>
       <table style={{ width: "100%", borderCollapse: "collapse" }}>
         <thead>
           <tr style={{ background: isDark ? "#0F0F1A" : "#F9FAFB" }}>
             {[t("nom", lang), t("contact", lang), t("telephone", lang), t("secteur", lang), t("statut", lang), t("valeur", lang), ""].map((h, i) => (
               <th key={i} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{h}</th>
             ))}
           </tr>
         </thead>
         <tbody>
           {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: sub }}>{t("aucun_client_trouve", lang)}</td></tr>}
           {filtered.map(c => (
             <tr key={c.id} style={{ borderTop: `1px solid ${border}` }}>
               <td style={{ padding: "14px 20px", fontSize: 13, color: text, fontWeight: 600 }}>{c.nom}</td>
               <td style={{ padding: "14px 20px", fontSize: 13, color: sub }}>{c.contact}</td>
               <td style={{ padding: "14px 20px", fontSize: 13, color: sub }}>{c.telephone}</td>
               <td style={{ padding: "14px 20px", fontSize: 13, color: sub }}>{c.secteur}</td>
               <td style={{ padding: "14px 20px" }}>
                 <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: statutColors[c.statut]?.bg, color: statutColors[c.statut]?.tx }}>{c.statut}</span>
               </td>
               <td style={{ padding: "14px 20px", fontSize: 13, color: "#F5A623", fontWeight: 700 }}>{c.valeur ? `${Number(c.valeur).toLocaleString("fr-FR")} FCFA` : "-"}</td>
               <td style={{ padding: "14px 20px" }}>
                 <div style={{ display: "flex", gap: 8 }}>
                   <button onClick={() => { setEditClient(c); setNewClient(c); setShowForm(true); }} style={{ background: "rgba(124,124,240,0.1)", border: "none", borderRadius: 6, color: "#7C7CF0", padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>{lang === "en" ? "Edit" : "Modifier"}</button>
                   <button onClick={() => supprimerClient(c.id)} style={{ background: "rgba(232,85,85,0.1)", border: "none", borderRadius: 6, color: "#E85555", padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>x</button>
                 </div>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   </div>
 );
}
