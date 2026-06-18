"use client";

export default function ExportExcel({ transactions, clients, theme }) {
  const isDark = theme === "dark";

  const exportExcel = async () => {
    const XLSX = await import("xlsx");

    const wb = XLSX.utils.book_new();

    // Feuille Transactions
    const txData = [
      ["Date", "Description", "Catégorie", "Type", "Montant (FCFA)", "Statut"],
      ...transactions.map(t => [
        t.date || "",
        t.libelle || "",
        t.categorie || "",
        t.type === "entree" ? "Entrée" : "Sortie",
        t.montant || 0,
        t.statut || "",
      ])
    ];
    const wsTx = XLSX.utils.aoa_to_sheet(txData);
    wsTx["!cols"] = [{ wch: 12 }, { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsTx, "Transactions");

    // Feuille Clients
    const clientData = [
      ["Nom", "Contact", "Téléphone", "Email", "Secteur", "Statut", "Valeur (FCFA)", "Pipeline"],
      ...clients.map(c => [
        c.nom || "",
        c.contact || "",
        c.telephone || "",
        c.email || "",
        c.secteur || "",
        c.statut || "",
        c.valeur || 0,
        c.pipeline || "",
      ])
    ];
    const wsClients = XLSX.utils.aoa_to_sheet(clientData);
    wsClients["!cols"] = [{ wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsClients, "Clients");

    // Feuille Résumé
    const totalEntrees = transactions.filter(t => t.type === "entree").reduce((s, t) => s + (t.montant || 0), 0);
    const totalSorties = transactions.filter(t => t.type === "sortie").reduce((s, t) => s + (t.montant || 0), 0);
    const resumeData = [
      ["WOLO — Résumé Financier", ""],
      ["Date d'export", new Date().toLocaleDateString("fr-FR")],
      ["", ""],
      ["Total Entrées (FCFA)", totalEntrees],
      ["Total Sorties (FCFA)", totalSorties],
      ["Solde Net (FCFA)", totalEntrees - totalSorties],
      ["", ""],
      ["Total Clients", clients.length],
      ["Total Transactions", transactions.length],
    ];
    const wsResume = XLSX.utils.aoa_to_sheet(resumeData);
    wsResume["!cols"] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsResume, "Résumé");

    XLSX.writeFile(wb, `WOLO_Export_${new Date().toLocaleDateString("fr-FR").replace(/\//g, "-")}.xlsx`);
  };

  return (
    <button onClick={exportExcel} style={{ background: isDark ? "#1A1A2E" : "#F3F4F6", border: `1px solid ${isDark ? "#2A2A45" : "#E5E7EB"}`, borderRadius: 8, color: isDark ? "#E8E8F0" : "#111827", padding: "8px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
      📊 Exporter Excel
    </button>
  );
}
