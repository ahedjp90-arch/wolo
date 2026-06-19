"use client";
import { useState, useEffect } from "react";
import { getLang } from "@/lib/i18n";

const getPlans = (lang) => [
  { nom: lang === "en" ? "Free" : "Gratuit", prix: 0, desc: lang === "en" ? "7-day trial" : "7 jours d'essai", features: lang === "en" ? ["1 user", "All modules", "CRM up to 5 clients", "10 transactions", "No credit card"] : ["1 utilisateur", "Tous les modules", "CRM jusqu'a 5 clients", "10 transactions", "Sans carte bancaire"], code: "WOLO_FREE" },
  { nom: "Starter", prix: 5000, desc: lang === "en" ? "To get started" : "Pour demarrer", features: lang === "en" ? ["1 user", "CRM up to 20 clients", "Finance Tracker", "Unlimited tasks", "Email support"] : ["1 utilisateur", "CRM jusqu'a 20 clients", "Finance Tracker", "Taches illimitees", "Support email"], code: "PLN_1cog0is9bljj7i4" },
  { nom: "Business", prix: 15000, desc: lang === "en" ? "Most popular" : "Le plus populaire", features: lang === "en" ? ["5 users", "Unlimited CRM", "All modules", "Wiki & Alerts", "Priority support"] : ["5 utilisateurs", "CRM illimite", "Tous les modules", "Wiki & Alertes", "Support prioritaire"], popular: true, code: "PLN_2yi2j4rlx4xz1bf" },
  { nom: "Pro", prix: 35000, desc: lang === "en" ? "For teams" : "Pour les equipes", features: lang === "en" ? ["Unlimited users", "All Business features", "Data exports", "Integrations", "Dedicated support"] : ["Utilisateurs illimites", "Tout Business inclus", "Exports de donnees", "Integrations", "Support dedie"], code: "PLN_dtigt5d5a57xjoy" },
];

export default function Abonnement() {
  const [loading, setLoading] = useState(null);
  const [email, setEmail] = useState("client@wolo.com");
  const [nom, setNom] = useState("");
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("fr");

  useEffect(() => {
    const savedTheme = localStorage.getItem("wolo_theme") || "dark";
    setTheme(savedTheme);
    const savedEmail = localStorage.getItem("wolo_email");
    if (savedEmail) setEmail(savedEmail);
    const savedNom = localStorage.getItem("wolo_nom");
    if (savedNom) setNom(savedNom);
    setLang(getLang());
  }, []);

  const isDark = theme === "dark";
  const bg = isDark ? "#0F0F1A" : "#F3F4F6";
  const card = isDark ? "#111128" : "#FFFFFF";
  const border = isDark ? "#1E1E38" : "#E5E7EB";
  const text = isDark ? "#E8E8F0" : "#111827";
  const sub = isDark ? "#6B6B8A" : "#6B7280";

  const plans = getPlans(lang);

  const payerPaystack = (plan) => {
    if (plan.prix === 0) {
      localStorage.setItem("wolo_plan", "FREE");
      localStorage.setItem("wolo_trial_end", Date.now() + 7 * 24 * 60 * 60 * 1000);
      window.location.href = "/";
      return;
    }
    setLoading(`ps_${plan.code}`);
    const handler = window.PaystackPop.setup({
      key: "pk_live_c5c7a3ab3f50720c098bc2508d54fb401dc266a6",
      email: email,
      plan: plan.code,
      currency: "XOF",
      ref: `WOLO_${Date.now()}`,
      callback: (response) => {
        localStorage.setItem("wolo_plan", plan.nom);
        localStorage.setItem("wolo_ref", response.reference);
        alert(lang === "en" ? `Subscription activated! Welcome to WOLO ${plan.nom}` : `Abonnement active ! Bienvenue sur WOLO ${plan.nom}`);
        window.location.href = "/";
      },
      onClose: () => setLoading(null),
    });
    handler.openIframe();
  };

  const payerCinetpay = async (plan) => {
    if (plan.prix === 0) return;
    setLoading(`cp_${plan.code}`);
    try {
      const res = await fetch('/api/cinetpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: plan.prix, email, nom, plan: plan.nom }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert((lang === "en" ? "CinetPay error: " : "Erreur CinetPay : ") + (data.error || "Unknown error"));
        setLoading(null);
      }
    } catch (err) {
      alert(lang === "en" ? "Connection error" : "Erreur de connexion");
      setLoading(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "Inter, sans-serif", padding: "60px 48px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 32 }}>
            <img src="/logo.svg" style={{ width: 40, height: 40, borderRadius: 8 }} />
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.08em" }}>WOLO</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12, color: text }}>{lang === "en" ? "Choose your plan" : "Choisissez votre plan"}</h1>
          <p style={{ fontSize: 16, color: sub }}>{lang === "en" ? "7-day free trial · Cancel anytime · Mobile Money & Card" : "7 jours gratuits · Annulation a tout moment · Mobile Money & Carte bancaire"}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {plans.map((p, i) => (
            <div key={i} style={{ background: p.popular ? "linear-gradient(135deg, rgba(245,166,35,0.1), rgba(232,131,10,0.05))" : card, border: p.popular ? "2px solid #F5A623" : `1px solid ${border}`, borderRadius: 16, padding: 28, position: "relative" }}>
              {p.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#F5A623", color: "#0F0F1A", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>{lang === "en" ? "MOST POPULAR" : "LE PLUS POPULAIRE"}</div>}
              {p.prix === 0 && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#4A9B8E", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>{lang === "en" ? "FREE 7 DAYS" : "GRATUIT 7 JOURS"}</div>}
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: text }}>{p.nom}</div>
              <div style={{ fontSize: 13, color: sub, marginBottom: 16 }}>{p.desc}</div>
              <div style={{ fontSize: p.prix === 0 ? 24 : 30, fontWeight: 800, marginBottom: 4, color: text }}>
                {p.prix === 0 ? (lang === "en" ? "Free" : "Gratuit") : `${p.prix.toLocaleString("fr-FR")}`}
                {p.prix > 0 && <span style={{ fontSize: 13, fontWeight: 400, color: sub }}> FCFA/{lang === "en" ? "mo" : "mois"}</span>}
              </div>
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${border}` }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: sub }}>
                    <span style={{ color: "#4A9B8E", fontWeight: 700 }}>✓</span> {f}
                  </div>
                ))}
              </div>

              {p.prix === 0 ? (
                <button onClick={() => payerPaystack(p)} style={{ width: "100%", background: "linear-gradient(135deg, #4A9B8E, #3A8B7E)", border: "none", borderRadius: 10, color: "#fff", padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  {lang === "en" ? "Start for free" : "Demarrer gratuitement"}
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => payerPaystack(p)} disabled={!!loading}
                    style={{ width: "100%", background: p.popular ? "linear-gradient(135deg, #F5A623, #E8830A)" : "transparent", border: p.popular ? "none" : `1px solid ${border}`, borderRadius: 10, color: p.popular ? "#0F0F1A" : text, padding: "10px", fontSize: 12, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                    {loading === `ps_${p.code}` ? "..." : "📱 Mobile Money"}
                  </button>
                  <button onClick={() => payerPaystack(p)} disabled={!!loading}
                    style={{ width: "100%", background: "transparent", border: `1px solid ${border}`, borderRadius: 10, color: text, padding: "10px", fontSize: 12, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                    {loading === `ps_${p.code}` ? "..." : `💳 ${lang === "en" ? "International Card" : "Carte internationale"}`}
                  </button>
                  <button onClick={() => payerCinetpay(p)} disabled={!!loading}
                    style={{ width: "100%", background: "transparent", border: "1px solid rgba(245,166,35,0.4)", borderRadius: 10, color: "#F5A623", padding: "10px", fontSize: 12, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                    {loading === `cp_${p.code}` ? "..." : `💳 ${lang === "en" ? "Local Card (CinetPay)" : "Carte locale (CinetPay)"}`}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40, fontSize: 13, color: sub }}>
          {lang === "en" ? "📱 Mobile Money via Paystack · 💳 International Card via Paystack · 💳 Local Card via CinetPay" : "📱 Mobile Money via Paystack · 💳 Carte internationale via Paystack · 💳 Carte locale via CinetPay"}
        </div>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <a href="/" style={{ fontSize: 13, color: sub, textDecoration: "none" }}>← {lang === "en" ? "Back to app" : "Retour a l'application"}</a>
        </div>
      </div>
      <script src="https://js.paystack.co/v1/inline.js" />
    </div>
  );
}
