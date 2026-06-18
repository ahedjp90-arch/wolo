"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Facturation({ theme }) {
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [newFacture, setNewFacture] = useState({
    client: "", numero: "", date: new Date().toISOString().split("T")[0], echeance: "", lignes: [{ description: "", quantite: 1, prix: 0 }], notes: "", statut: "En attente"
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

  useEffect(() => {
    const uid = localStorage.getItem("wolo_user_id");
    if (uid) {
      setUserId(uid);
      fetchClients(uid);
      const saved = JSON.parse(localStorage.getItem(`wolo_factures_${uid}`) || "[]");
      setFactures(saved);
    }
  }, []);

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

  const sauvegarder = () => {
    const facture = { ...newFacture, numero: newFacture.numero || genererNumero(), id: Date.now(), totalHT: totalLignes, tva, totalTTC };
    const updated = [facture, ...factures];
    setFactures(updated);
    localStorage.setItem(`wolo_factures_${userId}`, JSON.stringify(updated));
    setNewFacture({ client: "", numero: "", date: new Date().toISOString().split("T")[0], echeance: "", lignes: [{ description: "", quantite: 1, prix: 0 }], notes: "", statut: "En attente" });
    setShowForm(false);
  };

  const exportPDF = async (facture) => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF();

    // Header
    doc.setFillColor(15, 15, 26);
    doc.rect(0, 0, 210, 45, "F");
    doc.setTextColor(245, 166, 35);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("WOLO", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(180, 180, 180);
    doc.text("Le cerveau de votre entreprise", 14, 28);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("FACTURE", 150, 22);
    doc.setFontSize(10);
    doc.setTextColor(180, 180, 180);
    doc.text(`N° ${facture.numero}`, 150, 30);
    doc.text(`Date: ${facture.date}`, 150, 37);

    // Infos client
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Facturé à :", 14, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(facture.client || "Client", 14, 68);
    if (facture.echeance) doc.text(`Échéance : ${facture.echeance}`, 14, 76);

    // Statut
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const statutColor = facture.statut === "Payée" ? [74, 155, 142] : facture.statut === "Impayée" ? [232, 85, 85] : [245, 166, 35];
    doc.setTextColor(...statutColor);
    doc.text(`Statut : ${facture.statut}`, 150, 60);

    // Tableau lignes
    autoTable(doc, {
      startY: 90,
      head: [["Description", "Qté", "Prix Unit. (FCFA)", "Total (FCFA)"]],
      body: facture.lignes.map(l => [l.description, l.quantite, l.prix.toLocaleString(), (l.quantite * l.prix).toLocaleString()]),
      headStyles: { fillColor: [15, 15, 26], textColor: [245, 166, 35], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 250] },
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: { 1: { halign: "center" }, 2: { halign: "right" }, 3: { halign: "right" } },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Total HT : ${facture.totalHT?.toLocaleString()} FCFA`, 140, finalY);
    doc.text(`TVA (18%) : ${facture.tva?.toLocaleString()} FCFA`, 140, finalY + 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(245, 166, 35);
    doc.text(`Total TTC : ${facture.totalTTC?.toLocaleString()} FCFA`, 140, finalY + 18);

    if (facture.notes) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("Notes : " + facture.notes, 14, finalY + 30);
    }

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("WOLO By Prospera Vision Group — wolo.e-plazastore.com", 14, doc.internal.pageSize.height - 10);

    doc.save(`Facture_${facture.numero}.pdf`);
  };

  const supprimerFacture = (id) => {
    const updated = factures.filter(f => f.id !== id);
    setFactures(updated);
    localStorage.setItem(`wolo_factures_${userId}`, JSON.stringify(updated));
  };

  const changerStatut = (id, statut) => {
    const updated = factures.map(f => f.id === id ? { ...f, statut } : f);
    setFactures(updated);
    localStorage.setItem(`wolo_factures_${userId}`, JSON.stringify(updated));
  };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: text }}>Facturation</div>
          <div style={{ fontSize: 13, color: sub, marginTop: 2 }}>{factures.length} factures</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Nouvelle facture</button>
      </div>

      {showForm && (
        <div style={{ background: card, border: `1px solid ${inputBorder}`, borderRadius: 14, padding: 28, marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: text, marginBottom: 20 }}>Nouvelle facture</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Client</label>
              <select value={newFacture.client} onChange={e => setNewFacture({ ...newFacture, client: e.target.value })} style={inputStyle}>
                <option value="">Choisir un client</option>
                {clients.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", display: "block", marginBottom: 6 }}>N° Facture</label>
              <input placeholder={genererNumero()} value={newFacture.numero} onChange={e => setNewFacture({ ...newFacture, numero: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Date</label>
              <input type="date" value={newFacture.date} onChange={e => setNewFacture({ ...newFacture, date: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Échéance</label>
              <input type="date" value={newFacture.echeance} onChange={e => setNewFacture({ ...newFacture, echeance: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Statut</label>
              <select value={newFacture.statut} onChange={e => setNewFacture({ ...newFacture, statut: e.target.value })} style={inputStyle}>
                <option value="En attente">En attente</option>
                <option value="Payée">Payée</option>
                <option value="Impayée">Impayée</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase" }}>Lignes de facturation</label>
              <button onClick={addLigne} style={{ background: "rgba(245,166,35,0.1)", border: "none", borderRadius: 6, color: "#F5A623", padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>+ Ligne</button>
            </div>
            {newFacture.lignes.map((l, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr auto", gap: 8, marginBottom: 8 }}>
                <input placeholder="Description" value={l.description} onChange={e => updateLigne(i, "description", e.target.value)} style={inputStyle} />
                <input placeholder="Qté" type="number" value={l.quantite} onChange={e => updateLigne(i, "quantite", e.target.value)} style={inputStyle} />
                <input placeholder="Prix unitaire" type="number" value={l.prix} onChange={e => updateLigne(i, "prix", e.target.value)} style={inputStyle} />
                <button onClick={() => removeLigne(i)} style={{ background: "rgba(232,85,85,0.1)", border: "none", borderRadius: 6, color: "#E85555", padding: "8px 10px", cursor: "pointer" }}>✕</button>
              </div>
            ))}
          </div>

          <div style={{ background: isDark ? "#0F0F1A" : "#F9FAFB", borderRadius: 10, padding: "14px 20px", marginBottom: 16, textAlign: "right" }}>
            <div style={{ fontSize: 13, color: sub, marginBottom: 4 }}>Total HT : {totalLignes.toLocaleString()} FCFA</div>
            <div style={{ fontSize: 13, color: sub, marginBottom: 4 }}>TVA (18%) : {tva.toLocaleString()} FCFA</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F5A623" }}>Total TTC : {totalTTC.toLocaleString()} FCFA</div>
          </div>

          <textarea placeholder="Notes (optionnel)" value={newFacture.notes} onChange={e => setNewFacture({ ...newFacture, notes: e.target.value })} style={{ ...inputStyle, resize: "vertical", minHeight: 60, marginBottom: 16 }} />

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={sauvegarder} style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Créer la facture</button>
            <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: `1px solid ${inputBorder}`, borderRadius: 8, color: sub, padding: "10px 24px", fontSize: 13, cursor: "pointer" }}>Annuler</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {factures.length === 0 && <div style={{ color: sub, textAlign: "center", padding: 40, fontSize: 14 }}>Aucune facture — créez-en une !</div>}
        {factures.map(f => (
          <div key={f.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: text }}>{f.numero}</div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: f.statut === "Payée" ? "rgba(74,155,142,0.1)" : f.statut === "Impayée" ? "rgba(232,85,85,0.1)" : "rgba(245,166,35,0.1)", color: f.statut === "Payée" ? "#4A9B8E" : f.statut === "Impayée" ? "#E85555" : "#F5A623" }}>{f.statut}</span>
              </div>
              <div style={{ fontSize: 13, color: sub }}>{f.client} · {f.date} {f.echeance ? `· Échéance : ${f.echeance}` : ""}</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#F5A623", marginRight: 16 }}>{f.totalTTC?.toLocaleString()} FCFA</div>
            <div style={{ display: "flex", gap: 8 }}>
              <select value={f.statut} onChange={e => changerStatut(f.id, e.target.value)} style={{ background: input, border: `1px solid ${inputBorder}`, borderRadius: 6, color: text, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>
                <option value="En attente">En attente</option>
                <option value="Payée">Payée</option>
                <option value="Impayée">Impayée</option>
              </select>
              <button onClick={() => exportPDF(f)} style={{ background: "rgba(74,155,142,0.1)", border: "none", borderRadius: 8, color: "#4A9B8E", padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📄 PDF</button>
              <button onClick={() => supprimerFacture(f.id)} style={{ background: "rgba(232,85,85,0.1)", border: "none", borderRadius: 8, color: "#E85555", padding: "8px 10px", fontSize: 12, cursor: "pointer" }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
