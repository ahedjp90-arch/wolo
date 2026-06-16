"use client";
import { useState, useEffect } from "react";

const plans = [
  { nom: "Gratuit", prix: 0, desc: "7 jours d'essai", features: ["1 utilisateur", "Tous les modules", "CRM jusqu'à 5 clients", "10 transactions", "Sans carte bancaire"], code: "WOLO_FREE" },
  { nom: "Starter", prix: 5000, desc: "Pour démarrer", features: ["1 utilisateur", "CRM jusqu'à 20 clients", "Finance Tracker", "Tâches illimitées", "Support email"], code: "PLN_1cog0is9bljj7i4" },
  { nom: "Business", prix: 15000, desc: "Le plus populaire", features: ["5 utilisateurs", "CRM illimité", "Tous les modules", "Wiki & Alertes", "Support prioritaire"], popular: true, code: "PLN_2yi2j4rlx4xz1bf" },
  { nom: "Pro", prix: 35000, desc: "Pour les équipes", features: ["Utilisateurs illimités", "Tout Business inclus", "Exports de données", "Intégrations", "Support dédié"], code: "PLN_dtigt5d5a57xjoy" },
];

export default function Abonnement() {
  const [loading, setLoading] = useState(null);
  const [email, setEmail] = useState("client@wolo.com");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("wolo_email");
    if (saved) setEmail(saved);
    const savedTheme = localStorage.getItem("wolo_theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const isDark = theme === "dark";
  const bg = isDark ? "#0F0F1A" : "#F3F4F6";
  const card = isDark ? "#111128" : "#FFFFFF";
  const border = isDark ? "#1E1E38" : "#E5E7EB";
  const text = isDark ? "#E8E8F0" : "#111827";
  const sub = isDark ? "#6B6B8A" : "#6B7280";

  const payer = (plan) => {
    if (plan.prix === 0) {
      localStorage.setItem("wolo_plan", "FREE");
      localStorage.setItem("wolo_trial_end", Date.now() + 7 * 24 * 60 * 60 * 1000);
      window.location.href = "/";
      return;
    }
    setLoading(plan.code);
    const handler = window.PaystackPop.setup({
      key: "pk_live_c5c7a3ab3f50720c098bc2508d54fb401dc266a6",
      email: email,
      plan: plan.code,
      currency: "XOF",
      ref: `WOLO_${Date.now()}`,
      callback: (response) => {
        localStorage.setItem("wolo_plan", plan.nom);
        localStorage.setItem("wolo_ref", response.reference);
        alert(`Abonnement activé ! Bienvenue sur WOLO ${plan.nom} 🎉`);
        window.location.href = "/";
      },
      onClose: () => setLoading(null),
    });
    handler.openIframe();
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "Inter, sans-serif", padding: "60px 48px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 32 }}>
            <img src="/logo.svg" style={{ width: 40, height: 40, borderRadius: 8 }} />
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.08em" }}>WOLO</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12, color: text }}>Choisissez votre plan</h1>
          <p style={{ fontSize: 16, color: sub }}>7 jours gratuits · Annulation à tout moment · Paiement Mobile Money</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {plans.map((p, i) => (
            <div key={i} style={{ background: p.popular ? "linear-gradient(135deg, rgba(245,166,35,0.1), rgba(232,131,10,0.05))" : card, border: p.popular ? "2px solid #F5A623" : `1px solid ${border}`, borderRadius: 16, padding: 28, position: "relative" }}>
              {p.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#F5A623", color: "#0F0F1A", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>LE PLUS POPULAIRE</div>}
              {p.prix === 0 && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#4A9B8E", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>GRATUIT 7 JOURS</div>}
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: text }}>{p.nom}</div>
              <div style={{ fontSize: 13, color: sub, marginBottom: 16 }}>{p.desc}</div>
              <div style={{ fontSize: p.prix === 0 ? 24 : 30, fontWeight: 800, marginBottom: 4, color: text }}>
                {p.prix === 0 ? "Gratuit" : `${p.prix.toLocaleString()}`}
                {p.prix > 0 && <span style={{ fontSize: 13, fontWeight: 400, color: sub }}> FCFA/mois</span>}
              </div>
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${border}` }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: sub }}>
                    <span style={{ color: "#4A9B8E", fontWeight: 700 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button onClick={() => payer(p)} disabled={loading === p.code}
                style={{ width: "100%", background: p.prix === 0 ? "linear-gradient(135deg, #4A9B8E, #3A8B7E)" : p.popular ? "linear-gradient(135deg, #F5A623, #E8830A)" : "transparent", border: p.popular || p.prix === 0 ? "none" : `1px solid ${border}`, borderRadius: 10, color: p.popular || p.prix === 0 ? "#fff" : text, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: loading === p.code ? 0.7 : 1 }}>
                {loading === p.code ? "Chargement..." : p.prix === 0 ? "Démarrer gratuitement" : `Choisir ${p.nom}`}
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40, fontSize: 13, color: sub }}>
          Paiement sécurisé via Paystack · Wave · Orange Money · MTN
        </div>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <a href="/" style={{ fontSize: 13, color: sub, textDecoration: "none" }}>← Retour à l'application</a>
        </div>
      </div>
      <script src="https://js.paystack.co/v1/inline.js" />
    </div>
  );
}
