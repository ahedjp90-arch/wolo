"use client";

export default function ExportPDF({ transactions, theme }) {
  const isDark = theme === "dark";

  const exportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    // Header
    doc.setFillColor(15, 15, 26);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(245, 166, 35);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("WOLO", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(200, 200, 200);
    doc.text("Rapport Financier", 14, 30);
    doc.text(new Date().toLocaleDateString("fr-FR"), 150, 30);

    // KPIs
    const entrees = transactions.filter(t => t.type === "entree").reduce((s, t) => s + t.montant, 0);
    const sorties = transactions.filter(t => t.type === "sortie").reduce((s, t) => s + t.montant, 0);
    const solde = entrees - sorties;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Résumé", 14, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(74, 155, 142);
    doc.text(`Total Entrées : ${entrees.toLocaleString()} FCFA`, 14, 65);
    doc.setTextColor(232, 85, 85);
    doc.text(`Total Sorties : ${sorties.toLocaleString()} FCFA`, 14, 73);
    doc.setTextColor(solde >= 0 ? 74 : 232, solde >= 0 ? 155 : 85, solde >= 0 ? 142 : 85);
    doc.text(`Solde Net : ${solde.toLocaleString()} FCFA`, 14, 81);

    // Tableau
    autoTable(doc, {
      startY: 95,
      head: [["Date", "Description", "Catégorie", "Type", "Montant (FCFA)", "Statut"]],
      body: transactions.map(t => [
        t.date || "-",
        t.libelle,
        t.categorie || "-",
        t.type === "entree" ? "Entrée" : "Sortie",
        (t.type === "entree" ? "+" : "-") + t.montant?.toLocaleString(),
        t.statut,
      ]),
      headStyles: { fillColor: [15, 15, 26], textColor: [245, 166, 35], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 250] },
      styles: { fontSize: 9, cellPadding: 4 },
      columnStyles: {
        4: { halign: "right" },
      },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`WOLO — Le cerveau de votre entreprise | Page ${i}/${pageCount}`, 14, doc.internal.pageSize.height - 10);
    }

    doc.save(`WOLO_Finances_${new Date().toLocaleDateString("fr-FR").replace(/\//g, "-")}.pdf`);
  };

  return (
    <button onClick={exportPDF} style={{ background: isDark ? "#1A1A2E" : "#F3F4F6", border: `1px solid ${isDark ? "#2A2A45" : "#E5E7EB"}`, borderRadius: 8, color: isDark ? "#E8E8F0" : "#111827", padding: "8px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
      📄 Exporter PDF
    </button>
  );
}
