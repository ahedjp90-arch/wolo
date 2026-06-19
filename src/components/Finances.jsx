"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { t } from "@/lib/i18n";

const formatNum = (n) => Math.round(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export default function Finances({ theme, lang = "fr" }) {
 const [transactions, setTransactions] = useState([]);
 const [userId, setUserId] = useState(null);
 const [showForm, setShowForm] = useState(false);
 const [search, setSearch] = useState("");
 const [filtreType, setFiltreType] = useState("tous");
 const [filtreCategorie, setFiltreCategorie] = useState("Toutes");
 const [newTx, setNewTx] = useState({ type: "entree", libelle: "", montant: "", date: new Date().toISOString().split("T")[0], categorie: "", statut: "Confirme" });

 const isDark = theme === "dark";
 const bg = isDark ? "#0F0F1A" : "#F3F4F6";
 const card = isDark ? "#111128" : "#FFFFFF";
 const border = isDark ? "#1E1E38" : "#E5E7EB";
 const text = isDark ? "#E8E8F0" : "#111827";
 const sub = isDark ? "#6B6B8A" : "#6B7280";
 const input = isDark ? "#0F0F1A" : "#F9FAFB";
 const inputBorder = isDark ? "#2A2A45" : "#D1D5DB";
 const inputStyle = { background: input, border: `1px solid ${inputBorder}`, borderRadius: 8, padding: "10px 14px", color: text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" };

 const categories = lang === "en"
   ? ["Sales", "Services", "Rent", "Salaries", "Marketing", "Equipment", "Transport", "Other"]
   : ["Ventes", "Services", "Loyer", "Salaires", "Marketing", "Equipement", "Transport", "Autre"];

 useEffect(() => {
   const uid = localStorage.getItem("wolo_user_id");
   if (uid) { setUserId(uid); fetchTransactions(uid); }
 }, []);

 const fetchTransactions = async (uid) => {
   const { data } = await supabase.from("transactions").select("*").eq("user_id", uid).order("created_at", { ascending: false });
   setTransactions(data || []);
 };

 const ajouterTransaction = async () => {
   if (!newTx.libelle || !newTx.montant || !userId) return;
   await supabase.from("transactions").insert([{ ...newTx, montant: Number(newTx.montant), user_id: userId }]);
   fetchTransactions(userId);
   setNewTx({ type: "entree", libelle: "", montant: "", date: new Date().toISOString().split("T")[0], categorie: "", statut: "Confirme" });
   setShowForm(false);
 };

 const supprimerTransaction = async (id) => {
   await supabase.from("transactions").delete().eq("id", id).eq("user_id", userId);
   fetchTransactions(userId);
 };

 const totalEntrees = transactions.filter(tx => tx.type === "entree").reduce((s, tx) => s + tx.montant, 0);
 const totalSorties = transactions.filter(tx => tx.type === "sortie").reduce((s, tx) => s + tx.montant, 0);

 const filtered = transactions.filter(tx => {
   const matchSearch = tx.libelle?.toLowerCase().includes(search.toLowerCase());
   const matchType = filtreType === "tous" || tx.type === filtreType;
   const matchCat = filtreCategorie === "Toutes" || tx.categorie === filtreCategorie;
   return matchSearch && matchType && matchCat;
 });

 const exportPDF = async () => {
   const { default: jsPDF } = await import("jspdf");
   const { default: autoTable } = await import("jspdf-autotable");
   const doc = new jsPDF();
   doc.setFillColor(15, 15, 26);
   doc.rect(0, 0, 210, 30, "F");
   doc.setTextColor(245, 166, 35);
   doc.setFontSize(18);
   doc.setFont("helvetica", "bold");
   doc.text("WOLO", 14, 20);
   doc.setTextColor(255, 255, 255);
   doc.setFontSize(12);
   doc.text(lang === "en" ? "Financial Report" : "Rapport Financier", 80, 20);
   doc.setTextColor(0, 0, 0);
   doc.setFontSize(10);
   doc.text(`${lang === "en" ? "Revenue" : "Revenus"}: ${formatNum(totalEntrees)} FCFA`, 14, 45);
   doc.text(`${lang === "en" ? "Expenses" : "Depenses"}: ${formatNum(totalSorties)} FCFA`, 14, 53);
   doc.text(`${lang === "en" ? "Balance" : "Solde"}: ${formatNum(totalEntrees - totalSorties)} FCFA`, 14, 61);
   autoTable(doc, {
     startY: 70,
     head: [[lang === "en" ? "Label" : "Libelle", lang === "en" ? "Type" : "Type", lang === "en" ? "Amount" : "Montant", "Date", lang === "en" ? "Category" : "Categorie"]],
     body: filtered.map(tx => [tx.libelle, tx.type === "entree" ? (lang === "en" ? "Income" : "Entree") : (lang === "en" ? "Expense" : "Sortie"), `${tx.type === "entree" ? "+" : "-"}${formatNum(tx.montant)} FCFA`, tx.date || "", tx.categorie || ""]),
     headStyles: { fillColor: [15, 15, 26], textColor: [245, 166, 35] },
   });
   doc.save(`WOLO_${lang === "en" ? "Finance" : "Finances"}.pdf`);
 };

 const exportExcel = async () => {
   const { default: XLSX } = await import("xlsx");
   const data = filtered.map(tx => ({
     [lang === "en" ? "Label" : "Libelle"]: tx.libelle,
     [lang === "en" ? "Type" : "Type"]: tx.type,
     [lang === "en" ? "Amount" : "Montant"]: tx.montant,
     "Date": tx.date,
     [lang === "en" ? "Category" : "Categorie"]: tx.categorie,
   }));
   const ws = XLSX.utils.json_to_sheet(data);
   const wb = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, lang === "en" ? "Finance" : "Finances");
   XLSX.writeFile(wb, `WOLO_${lang === "en" ? "Finance" : "Finances"}.xlsx`);
 };

 return (
   <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: bg }}>
     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
       <div>
         <div style={{ fontSize: 22, fontWeight: 700, color: text }}>{lang === "en" ? "Finances" : "Finances"}</div>
         <div style={{ fontSize: 13, color: sub, marginTop: 2 }}>
           {lang === "en" ? "Revenue" : "Revenus"}: <span style={{ color: "#4A9B8E", fontWeight: 600 }}>{formatNum(totalEntrees)} FCFA</span> · {lang === "en" ? "Expenses" : "Depenses"}: <span style={{ color: "#E85555", fontWeight: 600 }}>{formatNum(totalSorties)} FCFA</span>
         </div>
       </div>
       <div style={{ display: "flex", gap: 8 }}>
         <button onClick={exportPDF} style={{ background: "rgba(232,85,85,0.1)", border: "1px solid rgba(232,85,85,0.3)", borderRadius: 8, color: "#E85555", padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t("export_pdf", lang)}</button>
         <button onClick={exportExcel} style={{ background: "rgba(74,155,142,0.1)", border: "1px solid rgba(74,155,142,0.3)", borderRadius: 8, color: "#4A9B8E", padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t("export_excel", lang)}</button>
         <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{t("nouvelle_transaction", lang)}</button>
       </div>
     </div>

     {showForm && (
       <div style={{ background: card, border: `1px solid ${inputBorder}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
           <select value={newTx.type} onChange={e => setNewTx({ ...newTx, type: e.target.value })} style={inputStyle}>
             <option value="entree">{t("entree", lang)}</option>
             <option value="sortie">{t("sortie", lang)}</option>
           </select>
           <input placeholder={t("libelle", lang)} value={newTx.libelle} onChange={e => setNewTx({ ...newTx, libelle: e.target.value })} style={inputStyle} />
           <input placeholder={t("montant", lang)} type="number" value={newTx.montant} onChange={e => setNewTx({ ...newTx, montant: e.target.value })} style={inputStyle} />
           <input type="date" value={newTx.date} onChange={e => setNewTx({ ...newTx, date: e.target.value })} style={inputStyle} />
           <select value={newTx.categorie} onChange={e => setNewTx({ ...newTx, categorie: e.target.value })} style={inputStyle}>
             <option value="">{lang === "en" ? "Category" : "Categorie"}</option>
             {categories.map(c => <option key={c} value={c}>{c}</option>)}
           </select>
         </div>
         <div style={{ display: "flex", gap: 10 }}>
           <button onClick={ajouterTransaction} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{lang === "en" ? "Add" : "Ajouter"}</button>
           <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: `1px solid ${inputBorder}`, borderRadius: 8, color: sub, padding: "10px 24px", fontSize: 13, cursor: "pointer" }}>{t("annuler", lang)}</button>
         </div>
       </div>
     )}

     <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
       <input placeholder={lang === "en" ? "Search..." : "Rechercher..."} value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 280 }} />
       <select value={filtreType} onChange={e => setFiltreType(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
         <option value="tous">{lang === "en" ? "All" : "Tous"}</option>
         <option value="entree">{t("entree", lang)}</option>
         <option value="sortie">{t("sortie", lang)}</option>
       </select>
       <select value={filtreCategorie} onChange={e => setFiltreCategorie(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
         <option value="Toutes">{t("toutes_categories", lang)}</option>
         {categories.map(c => <option key={c} value={c}>{c}</option>)}
       </select>
     </div>

     <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, overflow: "hidden" }}>
       <table style={{ width: "100%", borderCollapse: "collapse" }}>
         <thead>
           <tr style={{ background: isDark ? "#0F0F1A" : "#F9FAFB" }}>
             {[t("libelle", lang), t("type", lang), t("montant", lang), t("date", lang), t("categorie", lang), ""].map((h, i) => (
               <th key={i} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{h}</th>
             ))}
           </tr>
         </thead>
         <tbody>
           {filtered.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: sub }}>{lang === "en" ? "No transactions" : "Aucune transaction"}</td></tr>}
           {filtered.map(tx => (
             <tr key={tx.id} style={{ borderTop: `1px solid ${border}` }}>
               <td style={{ padding: "14px 20px", fontSize: 13, color: text, fontWeight: 600 }}>{tx.libelle}</td>
               <td style={{ padding: "14px 20px" }}>
                 <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: tx.type === "entree" ? "rgba(74,155,142,0.1)" : "rgba(232,85,85,0.1)", color: tx.type === "entree" ? "#4A9B8E" : "#E85555" }}>
                   {tx.type === "entree" ? t("entree", lang) : t("sortie", lang)}
                 </span>
               </td>
               <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 700, color: tx.type === "entree" ? "#4A9B8E" : "#E85555" }}>
                 {tx.type === "entree" ? "+" : "-"}{formatNum(tx.montant)} FCFA
               </td>
               <td style={{ padding: "14px 20px", fontSize: 13, color: sub }}>{tx.date}</td>
               <td style={{ padding: "14px 20px", fontSize: 13, color: sub }}>{tx.categorie}</td>
               <td style={{ padding: "14px 20px" }}>
                 <button onClick={() => supprimerTransaction(tx.id)} style={{ background: "rgba(232,85,85,0.1)", border: "none", borderRadius: 6, color: "#E85555", padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>x</button>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   </div>
 );
}
