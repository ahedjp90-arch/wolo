"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { t } from "@/lib/i18n";

const formatNum = (n) => Math.round(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export default function Facturation({ theme, lang = "fr" }) {
 const [factures, setFactures] = useState([]);
 const [clients, setClients] = useState([]);
 const [showForm, setShowForm] = useState(false);
 const [loading, setLoading] = useState(true);
 const [userId, setUserId] = useState(null);
 const [sendModal, setSendModal] = useState(null);
 const [sendEmail, setSendEmail] = useState("");
 const [sending, setSending] = useState(false);
 const [newFacture, setNewFacture] = useState({
   client: "", numero: "", date: new Date().toISOString().split("T")[0],
   echeance: "", lignes: [{ description: "", quantite: 1, prix: 0 }],
   notes: "", statut: "En attente"
 });

 const isDark = theme === "dark";
 const bg = isDark ? "#0F0F1A" : "#F3F4F6";
 const card = isDark ? "#111128" : "#FFFFFF";
 const border = isDark ? "#1E1E38" : "#E5E7EB";
 const text = isDark ? "#E8E8F0" : "#111827";
 const sub = isDark ? "#6B6B8A" : "#6B7280";
 const input = isDark ? "#0F0F1A" : "#F9FAFB";
 const inputBorder = isDark ? "#2A2A45" : "#D1D5DB";
 const inputStyle = { background: input, border: `1px solid ${inputBorder}`, borderRadius: 8, padding: "10px 14px", color: text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" };

 const statutLabels = lang === "en"
   ? { "En attente": "Pending", "Payee": "Paid", "Impayee": "Unpaid" }
   : { "En attente": "En attente", "Payee": "Payee", "Impayee": "Impayee" };

 useEffect(() => {
   const uid = localStorage.getItem("wolo_user_id");
   if (uid) { setUserId(uid); fetchFactures(uid); fetchClients(uid); }
 }, []);

 const fetchFactures = async (uid) => {
   setLoading(true);
   const { data } = await supabase.from("factures").select("*").eq("user_id", uid).order("created_at", { ascending: false });
   setFactures(data || []);
   setLoading(false);
 };

 const fetchClients = async (uid) => {
   const { data } = await supabase.from("clients").select("*").eq("user_id", uid);
   setClients(data || []);
 };

 const totalLignes = newFacture.lignes.reduce((s, l) => s + (l.quantite * l.prix), 0);
 const tva = totalLignes * 0.18;
 const totalTTC = totalLignes + tva;

 const addLigne = () => setNewFacture({ ...newFacture, lignes: [...newFacture.lignes, { description: "", quantite: 1, prix: 0 }] });
 const removeLigne = (i) => setNewFacture({ ...newFacture, lignes: newFacture.lignes.filter((_, idx) => idx !== i) });
 const updateLigne = (i, field, value) => {
   const lignes = [...newFacture.lignes];
   lignes[i] = { ...lignes[i], [field]: field === "quantite" || field === "prix" ? Number(value) : value };
   setNewFacture({ ...newFacture, lignes });
 };

 const genererNumero = () => `FAC-${Date.now().toString().slice(-6)}`;

 const sauvegarder = async () => {
   if (!userId) return;
   const facture = {
     user_id: userId,
     numero: newFacture.numero || genererNumero(),
     client: newFacture.client,
     date: newFacture.date,
     echeance: newFacture.echeance,
     lignes: newFacture.lignes,
     notes: newFacture.notes,
     statut: newFacture.statut,
     total_ht: totalLignes,
     tva: tva,
     total_ttc: totalTTC,
   };
   const { error } = await supabase.from("factures").insert([facture]);
   if (!error) {
     fetchFactures(userId);
     setNewFacture({ client: "", numero: "", date: new Date().toISOString().split("T")[0], echeance: "", lignes: [{ description: "", quantite: 1, prix: 0 }], notes: "", statut: "En attente" });
     setShowForm(false);
   }
 };

 const supprimerFacture = async (id) => {
   await supabase.from("factures").delete().eq("id", id).eq("user_id", userId);
   fetchFactures(userId);
 };

 const changerStatut = async (id, statut) => {
   await supabase.from("factures").update({ statut }).eq("id", id).eq("user_id", userId);
   fetchFactures(userId);
 };

 const envoyerFacture = async (facture) => {
   if (!sendEmail) return;
   setSending(true);
   await fetch("/api/email", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       type: "facture",
       email: sendEmail,
       data: { numero: facture.numero, client: facture.client, date: facture.date, echeance: facture.echeance, notes: facture.notes, totalTTC: formatNum(facture.total_ttc) }
     })
   });
   setSending(false);
   setSendModal(null);
   setSendEmail("");
   alert(lang === "en" ? "Invoice sent!" : "Facture envoyee !");
 };

 const exportPDF = async (facture) => {
   const { default: jsPDF } = await import("jspdf");
   const { default: autoTable } = await import("jspdf-autotable");
   const doc = new jsPDF();
   doc.setFillColor(15, 15, 26);
   doc.rect(0, 0, 210, 45, "F");
   doc.setTextColor(245, 166, 35);
   doc.setFontSize(24);
   doc.setFont("helvetica", "bold");
   doc.text("WOLO", 14, 20);
   doc.setFontSize(10);
   doc.setTextColor(180, 180, 180);
   doc.text(lang === "en" ? "Your Business OS" : "Le cerveau de votre entreprise", 14, 28);
   doc.setTextColor(255, 255, 255);
   doc.setFontSize(18);
   doc.text(lang === "en" ? "INVOICE" : "FACTURE", 150, 22);
   doc.setFontSize(10);
   doc.setTextColor(180, 180, 180);
   doc.text(`N: ${facture.numero}`, 150, 30);
   doc.text(`${lang === "en" ? "Date" : "Date"}: ${facture.date}`, 150, 37);
   doc.setTextColor(0, 0, 0);
   doc.setFontSize(11);
   doc.setFont("helvetica", "bold");
   doc.text(lang === "en" ? "Bill to:" : "Facture a :", 14, 60);
   doc.setFont("helvetica", "normal");
   doc.setFontSize(10);
   doc.text(facture.client || (lang === "en" ? "Client" : "Client"), 14, 68);
   if (facture.echeance) doc.text(`${lang === "en" ? "Due" : "Echeance"} : ${facture.echeance}`, 14, 76);
   const statutColor = facture.statut === "Payee" ? [74, 155, 142] : facture.statut === "Impayee" ? [232, 85, 85] : [245, 166, 35];
   doc.setTextColor(...statutColor);
   doc.setFont("helvetica", "bold");
   doc.text(`${lang === "en" ? "Status" : "Statut"} : ${statutLabels[facture.statut] || facture.statut}`, 150, 60);
   const lignes = facture.lignes || [];
   autoTable(doc, {
     startY: 90,
     head: [[lang === "en" ? "Description" : "Description", lang === "en" ? "Qty" : "Qte", lang === "en" ? "Unit Price (FCFA)" : "Prix Unit. (FCFA)", lang === "en" ? "Total (FCFA)" : "Total (FCFA)"]],
     body: lignes.map(l => [l.description, l.quantite, formatNum(l.prix), formatNum(l.quantite * l.prix)]),
     headStyles: { fillColor: [15, 15, 26], textColor: [245, 166, 35], fontStyle: "bold" },
     alternateRowStyles: { fillColor: [245, 245, 250] },
     styles: { fontSize: 9, cellPadding: 5 },
     columnStyles: { 1: { halign: "center" }, 2: { halign: "right" }, 3: { halign: "right" } },
   });
   const finalY = doc.lastAutoTable.finalY + 10;
   doc.setFont("helvetica", "normal");
   doc.setFontSize(10);
   doc.setTextColor(0, 0, 0);
   doc.text(`${lang === "en" ? "Subtotal" : "Total HT"} : ${formatNum(facture.total_ht)} FCFA`, 140, finalY);
   doc.text(`${lang === "en" ? "VAT (18%)" : "TVA (18%)"} : ${formatNum(facture.tva)} FCFA`, 140, finalY + 8);
   doc.setFont("helvetica", "bold");
   doc.setFontSize(12);
   doc.setTextColor(245, 166, 35);
   doc.text(`${lang === "en" ? "Total" : "Total TTC"} : ${formatNum(facture.total_ttc)} FCFA`, 140, finalY + 18);
   if (facture.notes) { doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(100, 100, 100); doc.text((lang === "en" ? "Notes: " : "Notes : ") + facture.notes, 14, finalY + 30); }
   doc.setFontSize(8);
   doc.setTextColor(150, 150, 150);
   doc.text("WOLO By Prospera Vision Group - wolo.e-plazastore.com", 14, doc.internal.pageSize.height - 10);
   doc.save(`${lang === "en" ? "Invoice" : "Facture"}_${facture.numero}.pdf`);
 };

 return (
   <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: bg }}>

     {sendModal && (
       <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
         <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 32, width: 400 }}>
           <div style={{ fontSize: 16, fontWeight: 700, color: text, marginBottom: 8 }}>{lang === "en" ? "Send invoice" : "Envoyer la facture"}</div>
           <div style={{ fontSize: 13, color: sub, marginBottom: 20 }}>{sendModal.numero} · {formatNum(sendModal.total_ttc)} FCFA</div>
           <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{lang === "en" ? "Recipient email" : "Email du destinataire"}</label>
           <input placeholder="email@client.com" value={sendEmail} onChange={e => setSendEmail(e.target.value)} style={{ ...inputStyle, marginBottom: 16 }} />
           <div style={{ display: "flex", gap: 10 }}>
             <button onClick={() => envoyerFacture(sendModal)} disabled={sending}
               style={{ flex: 1, background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
               {sending ? "..." : `📧 ${lang === "en" ? "Send" : "Envoyer"}`}
             </button>
             <button onClick={() => { setSendModal(null); setSendEmail(""); }}
               style={{ flex: 1, background: "transparent", border: `1px solid ${border}`, borderRadius: 8, color: sub, padding: "12px", fontSize: 13, cursor: "pointer" }}>{t("annuler", lang)}</button>
           </div>
         </div>
       </div>
     )}

     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
       <div>
         <div style={{ fontSize: 22, fontWeight: 700, color: text }}>{lang === "en" ? "Invoicing" : "Facturation"}</div>
         <div style={{ fontSize: 13, color: sub, marginTop: 2 }}>{factures.length} {lang === "en" ? "invoice(s)" : "facture(s)"}</div>
       </div>
       <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{t("nouvelle_facture", lang)}</button>
     </div>

     {showForm && (
       <div style={{ background: card, border: `1px solid ${inputBorder}`, borderRadius: 14, padding: 28, marginBottom: 24 }}>
         <div style={{ fontSize: 16, fontWeight: 600, color: text, marginBottom: 20 }}>{lang === "en" ? "New invoice" : "Nouvelle facture"}</div>
         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
           <div>
             <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t("client", lang)}</label>
             <select value={newFacture.client} onChange={e => setNewFacture({ ...newFacture, client: e.target.value })} style={inputStyle}>
               <option value="">{lang === "en" ? "Choose a client" : "Choisir un client"}</option>
               {clients.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
               <option value="Autre">{lang === "en" ? "Other" : "Autre"}</option>
             </select>
           </div>
           <div>
             <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t("numero", lang)}</label>
             <input placeholder={genererNumero()} value={newFacture.numero} onChange={e => setNewFacture({ ...newFacture, numero: e.target.value })} style={inputStyle} />
           </div>
           <div>
             <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t("date", lang)}</label>
             <input type="date" value={newFacture.date} onChange={e => setNewFacture({ ...newFacture, date: e.target.value })} style={inputStyle} />
           </div>
           <div>
             <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t("echeance", lang)}</label>
             <input type="date" value={newFacture.echeance} onChange={e => setNewFacture({ ...newFacture, echeance: e.target.value })} style={inputStyle} />
           </div>
           <div>
             <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{t("statut", lang)}</label>
             <select value={newFacture.statut} onChange={e => setNewFacture({ ...newFacture, statut: e.target.value })} style={inputStyle}>
               <option value="En attente">{statutLabels["En attente"]}</option>
               <option value="Payee">{statutLabels["Payee"]}</option>
               <option value="Impayee">{statutLabels["Impayee"]}</option>
             </select>
           </div>
         </div>

         <div style={{ marginBottom: 16 }}>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
             <label style={{ fontSize: 11, color: sub, textTransform: "uppercase" }}>{t("lignes", lang)}</label>
             <button onClick={addLigne} style={{ background: "rgba(245,166,35,0.1)", border: "none", borderRadius: 6, color: "#F5A623", padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>{t("ajouter_ligne", lang)}</button>
           </div>
           {newFacture.lignes.map((l, i) => (
             <div key={i} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr auto", gap: 8, marginBottom: 8 }}>
               <input placeholder={t("description", lang)} value={l.description} onChange={e => updateLigne(i, "description", e.target.value)} style={inputStyle} />
               <input placeholder={t("quantite", lang)} type="number" value={l.quantite} onChange={e => updateLigne(i, "quantite", e.target.value)} style={inputStyle} />
               <input placeholder={t("prix_unitaire", lang)} type="number" value={l.prix} onChange={e => updateLigne(i, "prix", e.target.value)} style={inputStyle} />
               <button onClick={() => removeLigne(i)} style={{ background: "rgba(232,85,85,0.1)", border: "none", borderRadius: 6, color: "#E85555", padding: "8px 10px", cursor: "pointer" }}>x</button>
             </div>
           ))}
         </div>

         <div style={{ background: isDark ? "#0F0F1A" : "#F9FAFB", borderRadius: 10, padding: "14px 20px", marginBottom: 16, textAlign: "right" }}>
           <div style={{ fontSize: 13, color: sub, marginBottom: 4 }}>{t("total_ht", lang)} : {formatNum(totalLignes)} FCFA</div>
           <div style={{ fontSize: 13, color: sub, marginBottom: 4 }}>{t("tva", lang)} : {formatNum(tva)} FCFA</div>
           <div style={{ fontSize: 16, fontWeight: 700, color: "#F5A623" }}>{t("total_ttc", lang)} : {formatNum(totalTTC)} FCFA</div>
         </div>

         <textarea placeholder={t("notes_f", lang)} value={newFacture.notes} onChange={e => setNewFacture({ ...newFacture, notes: e.target.value })}
           style={{ ...inputStyle, resize: "vertical", minHeight: 60, marginBottom: 16 }} />

         <div style={{ display: "flex", gap: 10 }}>
           <button onClick={sauvegarder} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{t("creer_facture", lang)}</button>
           <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: `1px solid ${inputBorder}`, borderRadius: 8, color: sub, padding: "10px 24px", fontSize: 13, cursor: "pointer" }}>{t("annuler", lang)}</button>
         </div>
       </div>
     )}

     {loading && <div style={{ color: sub, textAlign: "center", padding: 40 }}>Loading...</div>}
     {!loading && (
       <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
         {factures.length === 0 && <div style={{ color: sub, textAlign: "center", padding: 40, fontSize: 14 }}>{t("aucune_facture", lang)}</div>}
         {factures.map(f => (
           <div key={f.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
             <div style={{ flex: 1 }}>
               <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                 <div style={{ fontSize: 15, fontWeight: 700, color: text }}>{f.numero}</div>
                 <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: f.statut === "Payee" ? "rgba(74,155,142,0.1)" : f.statut === "Impayee" ? "rgba(232,85,85,0.1)" : "rgba(245,166,35,0.1)", color: f.statut === "Payee" ? "#4A9B8E" : f.statut === "Impayee" ? "#E85555" : "#F5A623" }}>{statutLabels[f.statut] || f.statut}</span>
               </div>
               <div style={{ fontSize: 13, color: sub }}>{f.client} · {f.date}{f.echeance ? ` · ${lang === "en" ? "Due" : "Echeance"} : ${f.echeance}` : ""}</div>
             </div>
             <div style={{ fontSize: 18, fontWeight: 700, color: "#F5A623", marginRight: 8 }}>{formatNum(f.total_ttc)} FCFA</div>
             <div style={{ display: "flex", gap: 8 }}>
               <select value={f.statut} onChange={e => changerStatut(f.id, e.target.value)} style={{ background: input, border: `1px solid ${inputBorder}`, borderRadius: 6, color: text, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>
                 <option value="En attente">{statutLabels["En attente"]}</option>
                 <option value="Payee">{statutLabels["Payee"]}</option>
                 <option value="Impayee">{statutLabels["Impayee"]}</option>
               </select>
               <button onClick={() => { setSendModal(f); setSendEmail(clients.find(c => c.nom === f.client)?.email || ""); }}
                 style={{ background: "rgba(124,124,240,0.1)", border: "none", borderRadius: 8, color: "#7C7CF0", padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                 {t("envoyer_email", lang)}
               </button>
               <button onClick={() => exportPDF(f)} style={{ background: "rgba(74,155,142,0.1)", border: "none", borderRadius: 8, color: "#4A9B8E", padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>PDF</button>
               <button onClick={() => supprimerFacture(f.id)} style={{ background: "rgba(232,85,85,0.1)", border: "none", borderRadius: 8, color: "#E85555", padding: "8px 10px", fontSize: 12, cursor: "pointer" }}>x</button>
             </div>
           </div>
         ))}
       </div>
     )}
   </div>
 );
}
