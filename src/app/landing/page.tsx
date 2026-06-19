"use client";
import { useState, useEffect } from "react";
import { getLang } from "@/lib/i18n";

const content = {
  fr: {
    tagline: "Le cerveau de votre entreprise",
    desc: "WOLO est un Business OS tout-en-un conçu pour les entrepreneurs et PME d'Afrique. Gérez vos clients, finances, tâches, factures et support depuis une seule plateforme.",
    cta: "Commencer gratuitement",
    cta2: "Se connecter",
    features_title: "Tout ce dont vous avez besoin",
    features: [
      { icon: "👥", titre: "CRM", desc: "Gérez vos clients et votre pipeline commercial" },
      { icon: "💰", titre: "Finances", desc: "Revenus, dépenses et exports PDF/Excel" },
      { icon: "✅", titre: "Tâches", desc: "Kanban pour organiser votre travail" },
      { icon: "🧾", titre: "Facturation", desc: "Factures professionnelles envoyées par email" },
      { icon: "🎧", titre: "Support", desc: "Ticketing en temps réel avec vos clients" },
      { icon: "📚", titre: "Wiki", desc: "Base de connaissances de votre entreprise" },
    ],
    pricing_title: "Tarifs simples et transparents",
    pricing_desc: "7 jours gratuits · Annulation à tout moment",
    plans: [
      { nom: "Gratuit", prix: "0", desc: "7 jours d'essai", features: ["1 utilisateur", "Tous les modules", "CRM 5 clients", "10 transactions"] },
      { nom: "Starter", prix: "5 000", desc: "Pour démarrer", features: ["1 utilisateur", "CRM 20 clients", "Finance Tracker", "Support email"] },
      { nom: "Business", prix: "15 000", desc: "Le plus populaire", features: ["5 utilisateurs", "CRM illimité", "Tous les modules", "Support prioritaire"], popular: true },
      { nom: "Pro", prix: "35 000", desc: "Pour les équipes", features: ["Utilisateurs illimités", "Tout Business inclus", "Exports de données", "Support dédié"] },
    ],
    faq_title: "Questions fréquentes",
    faqs: [
      { q: "Est-ce que WOLO fonctionne sans internet ?", r: "Non, WOLO est une application web qui nécessite une connexion internet." },
      { q: "Comment puis-je payer ?", r: "Nous acceptons Mobile Money (Wave, Orange, MTN) et carte bancaire (locale et internationale)." },
      { q: "Puis-je annuler à tout moment ?", r: "Oui, vous pouvez annuler votre abonnement à tout moment sans frais." },
      { q: "Mes données sont-elles sécurisées ?", r: "Oui, vos données sont stockées sur des serveurs sécurisés en Europe avec chiffrement SSL." },
    ],
    footer: "Le cerveau de votre entreprise",
    rights: "Tous droits réservés",
  },
  en: {
    tagline: "The Brain of Your Business",
    desc: "WOLO is an all-in-one Business OS designed for entrepreneurs and SMEs in Africa. Manage your clients, finances, tasks, invoices, and support from a single platform.",
    cta: "Start for free",
    cta2: "Sign in",
    features_title: "Everything you need",
    features: [
      { icon: "👥", titre: "CRM", desc: "Manage your clients and sales pipeline" },
      { icon: "💰", titre: "Finances", desc: "Revenue, expenses and PDF/Excel exports" },
      { icon: "✅", titre: "Tasks", desc: "Kanban board to organize your work" },
      { icon: "🧾", titre: "Invoicing", desc: "Professional invoices sent by email" },
      { icon: "🎧", titre: "Support", desc: "Real-time ticketing with your clients" },
      { icon: "📚", titre: "Wiki", desc: "Your business knowledge base" },
    ],
    pricing_title: "Simple, transparent pricing",
    pricing_desc: "7-day free trial · Cancel anytime",
    plans: [
      { nom: "Free", prix: "0", desc: "7-day trial", features: ["1 user", "All modules", "CRM 5 clients", "10 transactions"] },
      { nom: "Starter", prix: "5,000", desc: "To get started", features: ["1 user", "CRM 20 clients", "Finance Tracker", "Email support"] },
      { nom: "Business", prix: "15,000", desc: "Most popular", features: ["5 users", "Unlimited CRM", "All modules", "Priority support"], popular: true },
      { nom: "Pro", prix: "35,000", desc: "For teams", features: ["Unlimited users", "All Business features", "Data exports", "Dedicated support"] },
    ],
    faq_title: "Frequently Asked Questions",
    faqs: [
      { q: "Does WOLO work offline?", r: "No, WOLO is a web application that requires an internet connection." },
      { q: "How can I pay?", r: "We accept Mobile Money (Wave, Orange, MTN) and card payments (local and international)." },
      { q: "Can I cancel anytime?", r: "Yes, you can cancel your subscription at any time with no fees." },
      { q: "Is my data secure?", r: "Yes, your data is stored on secure servers in Europe with SSL encryption." },
    ],
    footer: "The Brain of Your Business",
    rights: "All rights reserved",
  }
};

export default function Landing() {
  const [lang, setLang] = useState("fr");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setLang(getLang());
    const savedTheme = localStorage.getItem("wolo_theme") || "dark";
    setTheme(savedTheme);
  }, []);

  const toggleLang = () => {
    const newLang = lang === "fr" ? "en" : "fr";
    setLang(newLang);
    localStorage.setItem("wolo_lang", newLang);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("wolo_theme", newTheme);
  };

  const c = content[lang];
  const isDark = theme === "dark";
  const bg = isDark ? "#0F0F1A" : "#F8F9FA";
  const bg2 = isDark ? "#111128" : "#FFFFFF";
  const border = isDark ? "#1E1E38" : "#E5E7EB";
  const text = isDark ? "#E8E8F0" : "#111827";
  const sub = isDark ? "#6B6B8A" : "#6B7280";

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "Inter, sans-serif", color: text }}>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: isDark ? "rgba(15,15,26,0.95)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${border}`, padding: "0 48px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.svg" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.08em", color: text }}>WOLO</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={toggleLang} style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 8, color: "#F5A623", padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {lang === "fr" ? "EN" : "FR"}
          </button>
          <button onClick={toggleTheme} style={{ background: isDark ? "#1A1A2E" : "#F3F4F6", border: `1px solid ${border}`, borderRadius: 8, color: sub, padding: "6px 12px", fontSize: 16, cursor: "pointer" }}>
            {isDark ? "☀️" : "🌙"}
          </button>
          <a href="/login" style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 8, color: text, padding: "8px 16px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>{c.cta2}</a>
          <a href="/login?mode=signup" style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>{c.cta}</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: "100px 48px 80px", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 600, color: "#F5A623", marginBottom: 24 }}>
          🚀 {lang === "en" ? "Now available in English & French" : "Disponible en français et en anglais"}
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.15, marginBottom: 24, color: text }}>
          {lang === "en" ? "The Business OS for" : "Le Business OS pour"}<br />
          <span style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {lang === "en" ? "African Entrepreneurs" : "les Entrepreneurs Africains"}
          </span>
        </h1>
        <p style={{ fontSize: 18, color: sub, lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>{c.desc}</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/login?mode=signup" style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 12, color: "#0F0F1A", padding: "16px 32px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>{c.cta} →</a>
          <a href="/login" style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 12, color: text, padding: "16px 32px", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>{c.cta2}</a>
        </div>
        <div style={{ marginTop: 20, fontSize: 13, color: sub }}>
          {lang === "en" ? "✓ Free 7-day trial  ✓ No credit card required  ✓ Cancel anytime" : "✓ 7 jours gratuits  ✓ Sans carte bancaire  ✓ Annulation à tout moment"}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "80px 48px", background: isDark ? "#111128" : "#FFFFFF" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", marginBottom: 12, color: text }}>{c.features_title}</h2>
          <p style={{ textAlign: "center", color: sub, marginBottom: 60, fontSize: 16 }}>
            {lang === "en" ? "6 powerful modules in one platform" : "6 modules puissants dans une seule plateforme"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {c.features.map((f, i) => (
              <div key={i} style={{ background: isDark ? "#0F0F1A" : "#F8F9FA", border: `1px solid ${border}`, borderRadius: 16, padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 8 }}>{f.titre}</div>
                <div style={{ fontSize: 14, color: sub, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: "80px 48px", background: bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", marginBottom: 12, color: text }}>{c.pricing_title}</h2>
          <p style={{ textAlign: "center", color: sub, marginBottom: 60, fontSize: 16 }}>{c.pricing_desc}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {c.plans.map((p, i) => (
              <div key={i} style={{ background: p.popular ? "linear-gradient(135deg, rgba(245,166,35,0.1), rgba(232,131,10,0.05))" : bg2, border: p.popular ? "2px solid #F5A623" : `1px solid ${border}`, borderRadius: 16, padding: 28, position: "relative" }}>
                {p.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#F5A623", color: "#0F0F1A", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>{lang === "en" ? "MOST POPULAR" : "LE PLUS POPULAIRE"}</div>}
                <div style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 4 }}>{p.nom}</div>
                <div style={{ fontSize: 13, color: sub, marginBottom: 16 }}>{p.desc}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: text, marginBottom: 4 }}>
                  {p.prix === "0" ? (lang === "en" ? "Free" : "Gratuit") : p.prix}
                  {p.prix !== "0" && <span style={{ fontSize: 13, fontWeight: 400, color: sub }}> FCFA/{lang === "en" ? "mo" : "mois"}</span>}
                </div>
                <div style={{ borderTop: `1px solid ${border}`, margin: "16px 0" }} />
                {p.features.map((f, j) => (
                  <div key={j} style={{ fontSize: 13, color: sub, marginBottom: 8, display: "flex", gap: 8 }}>
                    <span style={{ color: "#4A9B8E" }}>✓</span> {f}
                  </div>
                ))}
                <a href="/login?mode=signup" style={{ display: "block", marginTop: 20, background: p.popular ? "linear-gradient(135deg, #F5A623, #E8830A)" : "transparent", border: p.popular ? "none" : `1px solid ${border}`, borderRadius: 10, color: p.popular ? "#0F0F1A" : text, padding: "12px", fontSize: 13, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>
                  {lang === "en" ? "Get started" : "Commencer"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: "80px 48px", background: isDark ? "#111128" : "#FFFFFF" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", marginBottom: 48, color: text }}>{c.faq_title}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {c.faqs.map((faq, i) => (
              <div key={i} style={{ background: isDark ? "#0F0F1A" : "#F8F9FA", border: `1px solid ${border}`, borderRadius: 14, padding: "20px 24px" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 14, color: sub, lineHeight: 1.6 }}>{faq.r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div style={{ padding: "80px 48px", textAlign: "center", background: "linear-gradient(135deg, rgba(245,166,35,0.1), rgba(232,131,10,0.05))", borderTop: `1px solid ${border}` }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: text, marginBottom: 16 }}>
          {lang === "en" ? "Ready to grow your business?" : "Prêt à développer votre entreprise ?"}
        </h2>
        <p style={{ fontSize: 16, color: sub, marginBottom: 32 }}>
          {lang === "en" ? "Join hundreds of African entrepreneurs already using WOLO" : "Rejoignez des centaines d'entrepreneurs africains qui utilisent déjà WOLO"}
        </p>
        <a href="/login?mode=signup" style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 12, color: "#0F0F1A", padding: "18px 40px", fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
          {c.cta} →
        </a>
      </div>

      {/* Footer */}
      <footer style={{ background: isDark ? "#0A0A14" : "#111827", padding: "40px 48px", borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.svg" style={{ width: 28, height: 28, borderRadius: 6 }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: "#E8E8F0" }}>WOLO</span>
            <span style={{ fontSize: 13, color: "#4A4A6A" }}>· {c.footer}</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <a href="/cgu" style={{ fontSize: 13, color: "#4A4A6A", textDecoration: "none" }}>CGU</a>
            <a href="/confidentialite" style={{ fontSize: 13, color: "#4A4A6A", textDecoration: "none" }}>{lang === "en" ? "Privacy Policy" : "Confidentialité"}</a>
            <a href="/login" style={{ fontSize: 13, color: "#4A4A6A", textDecoration: "none" }}>{lang === "en" ? "Login" : "Connexion"}</a>
          </div>
          <div style={{ fontSize: 13, color: "#4A4A6A" }}>© 2026 Prospera Vision Group · {c.rights}</div>
        </div>
      </footer>
    </div>
  );
}
