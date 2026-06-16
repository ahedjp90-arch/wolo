"use client";
import { useState } from "react";

const plans = [
  { nom: "Starter", prix: 5000, desc: "Pour démarrer", features: ["1 utilisateur", "CRM jusqu'à 20 clients", "Finance Tracker", "Tâches illimitées", "Support email"], code: "WOLO_STARTER" },
  { nom: "Business", prix: 15000, desc: "Le plus populaire", features: ["5 utilisateurs", "CRM illimité", "Tous les modules", "Wiki & Alertes", "Support prioritaire"], popular: true, code: "WOLO_BUSINESS" },
  { nom: "Pro", prix: 35000, desc: "Pour les équipes", features: ["Utilisateurs illimités", "Tout Business inclus", "Exports de données", "Intégrations", "Support dédié"], code: "WOLO_PRO" },
];

export default function Abonnement() {
  const [loading, setLoading] = useState(null);

  const payer = (plan) => {
    setLoading(plan.code);
    const email = localStorage.getItem("wolo_email") || "client@wolo.com";
    const handler = window.PaystackPop.setup({
      key: "pk_live_c5c7a3ab3f50720c098bc2508d54fb401dc266a6",
      email: email,
      amount: plan.prix * 100,
      currency: "XOF",
      ref: `WOLO_${Date.now()}`,
      metadata: { plan: plan.code },
      callback: (response) => {
        alert(`Paiement réussi ! Référence: ${response.reference}`);
        window.location.href = "/";
      },
      onClose: () => setLoading(null),
    });
    handler.openIframe();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F0F1A", color: "#E8E8F0", fontFamily: "Inter, sans-serif", padding: "60px 48px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 32 }}>
            <img src="/logo.svg" style={{ width: 40, height: 40, borderRadius: 8 }} />
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.08em" }}>WOLO</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>Choisissez votre plan</h1>
          <p style={{ fontSize: 16, color: "#6B6B8A" }}>Accédez à tous les outils pour piloter votre business</p>
        </div>

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {plans.map((p, i) => (
            <div key={i} style={{ background: p.popular ? "linear-gradient(135deg, rgba(245,166,35,0.1), rgba(232,131,10,0.05))" : "#111128", border: p.popular ? "2px solid #F5A623" : "1px solid #1E1E38", borderRadius: 16, padding: 32, position: "relative" }}>
              {p.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#F5A623", color: "#0F0F1A", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20 }}>LE PLUS POPULAIRE</div>}
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{p.nom}</div>
              <div style={{ fontSize: 13, color: "#6B6B8A", marginBottom: 20 }}>{p.desc}</div>
              <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>
                {p.prix.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 400, color: "#6B6B8A" }}>FCFA/mois</span>
              </div>
              <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #1E1E38" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#B8B8D0" }}>
                    <span style={{ color: "#4A9B8E", fontWeight: 700 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button onClick={() => payer(p)} disabled={loading === p.code}
                style={{ width: "100%", background: p.popular ? "linear-gradient(135deg, #F5A623, #E8830A)" : "transparent", border: p.popular ? "none" : "1px solid #2A2A45", borderRadius: 10, color: p.popular ? "#0F0F1A" : "#E8E8F0", padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: loading === p.code ? 0.7 : 1 }}>
                {loading === p.code ? "Chargement..." : `Choisir ${p.nom}`}
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40, fontSize: 13, color: "#4A4A6A" }}>
          Paiement sécurisé via Paystack · Mobile Money · Carte bancaire
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <a href="/" style={{ fontSize: 13, color: "#6B6B8A", textDecoration: "none" }}>← Retour à l'application</a>
        </div>
      </div>

      <script src="https://js.paystack.co/v1/inline.js" />
    </div>
  );
}
