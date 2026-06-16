"use client";
import { useState, useEffect } from "react";

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const btn = { background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 10, color: "#0F0F1A", padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" };

  const features = [
    { icon: "👥", titre: "CRM Clients", desc: "Suivez chaque client, gérez vos relances et ne laissez plus aucune opportunité vous échapper." },
    { icon: "💰", titre: "Finance Tracker", desc: "Visualisez vos entrées, sorties et cashflow en temps réel. Sachez exactement où va votre argent." },
    { icon: "✅", titre: "Tâches Kanban", desc: "Organisez votre journée avec un tableau Kanban simple. Priorisez et avancez efficacement." },
    { icon: "📚", titre: "Wiki Interne", desc: "Centralisez vos procédures, modèles et informations clés. Votre entreprise documentée." },
    { icon: "📊", titre: "Dashboard KPIs", desc: "Un coup d'œil suffit pour savoir où en est votre business chaque matin." },
    { icon: "🔔", titre: "Alertes Intelligentes", desc: "Recevez des rappels sur les factures impayées, relances dues et tâches en retard." },
  ];

  const plans = [
    { nom: "Starter", prix: "5 000", desc: "Pour démarrer", features: ["1 utilisateur", "CRM jusqu'à 20 clients", "Finance Tracker", "Tâches illimitées", "Support email"] },
    { nom: "Business", prix: "15 000", desc: "Le plus populaire", features: ["5 utilisateurs", "CRM illimité", "Tous les modules", "Wiki & Alertes", "Support prioritaire"], popular: true },
    { nom: "Pro", prix: "35 000", desc: "Pour les équipes", features: ["Utilisateurs illimités", "Tout Business inclus", "Exports de données", "Intégrations", "Support dédié"] },
  ];

  const temoignages = [
    { nom: "Kofi Asante", role: "Gérant, Tech Abidjan", texte: "WOLO a transformé ma façon de gérer mon business. Je vois tout d'un coup d'œil.", avatar: "K" },
    { nom: "Aya Kouamé", role: "Directrice, Groupe Kouamé", texte: "Fini les Excel partout. Tout est centralisé et mes équipes savent quoi faire.", avatar: "A" },
    { nom: "Ibrahim Traoré", role: "CEO, SARL Traoré", texte: "Le meilleur outil que j'ai utilisé. Simple, rapide et fait pour l'Afrique.", avatar: "I" },
  ];

  return (
    <div style={{ background: "#0F0F1A", color: "#E8E8F0", fontFamily: "Inter, sans-serif", minHeight: "100vh" }}>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "16px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", background: scrolled ? "rgba(15,15,26,0.95)" : "transparent", backdropFilter: scrolled ? "blur(10px)" : "none", borderBottom: scrolled ? "1px solid #1E1E38" : "none", transition: "all 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.svg" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.08em" }}>WOLO</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="#features" style={{ color: "#6B6B8A", textDecoration: "none", fontSize: 14 }}>Fonctionnalités</a>
          <a href="#pricing" style={{ color: "#6B6B8A", textDecoration: "none", fontSize: 14 }}>Tarifs</a>
          <a href="/login" style={{ color: "#6B6B8A", textDecoration: "none", fontSize: 14 }}>Connexion</a>
          <a href="/login?mode=signup" style={{ ...btn, padding: "10px 20px", fontSize: 13, textDecoration: "none" }}>Commencer</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 48px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 20, padding: "6px 16px", fontSize: 13, color: "#F5A623", marginBottom: 24, display: "inline-block" }}>
          🌍 Conçu pour les entrepreneurs africains
        </div>
        <h1 style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, marginBottom: 24, maxWidth: 800 }}>
          Le cerveau de<br />
          <span style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>votre entreprise</span>
        </h1>
        <p style={{ fontSize: 20, color: "#6B6B8A", maxWidth: 600, lineHeight: 1.6, marginBottom: 40 }}>
          WOLO centralise tout ce dont vous avez besoin pour piloter votre business — clients, finances, tâches et documents — dans un seul outil.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <a href="/login?mode=signup" style={{ ...btn, textDecoration: "none", fontSize: 16, padding: "16px 40px" }}>Démarrer gratuitement</a>
          <a href="#features" style={{ background: "transparent", border: "1px solid #2A2A45", borderRadius: 10, color: "#E8E8F0", padding: "16px 40px", fontSize: 16, cursor: "pointer", textDecoration: "none" }}>Voir les fonctionnalités</a>
        </div>
        <p style={{ marginTop: 20, fontSize: 13, color: "#4A4A6A" }}>Aucune carte bancaire requise · Accès immédiat</p>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "80px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>Tout ce qu'il vous faut</h2>
          <p style={{ fontSize: 18, color: "#6B6B8A", maxWidth: 500, margin: "0 auto" }}>6 modules pensés pour la réalité des entrepreneurs africains</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "#111128", border: "1px solid #1E1E38", borderRadius: 16, padding: 28, transition: "border 0.2s" }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{f.titre}</div>
              <div style={{ fontSize: 14, color: "#6B6B8A", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "80px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>Tarifs simples</h2>
          <p style={{ fontSize: 18, color: "#6B6B8A" }}>Payez uniquement ce dont vous avez besoin</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {plans.map((p, i) => (
            <div key={i} style={{ background: p.popular ? "linear-gradient(135deg, rgba(245,166,35,0.1), rgba(232,131,10,0.05))" : "#111128", border: p.popular ? "2px solid #F5A623" : "1px solid #1E1E38", borderRadius: 16, padding: 32, position: "relative" }}>
              {p.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#F5A623", color: "#0F0F1A", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20 }}>LE PLUS POPULAIRE</div>}
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{p.nom}</div>
              <div style={{ fontSize: 13, color: "#6B6B8A", marginBottom: 20 }}>{p.desc}</div>
              <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>{p.prix} <span style={{ fontSize: 14, fontWeight: 400, color: "#6B6B8A" }}>FCFA/mois</span></div>
              <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #1E1E38" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#B8B8D0" }}>
                    <span style={{ color: "#4A9B8E", fontWeight: 700 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <a href="/login?mode=signup" style={{ display: "block", textAlign: "center", textDecoration: "none", background: p.popular ? "linear-gradient(135deg, #F5A623, #E8830A)" : "transparent", border: p.popular ? "none" : "1px solid #2A2A45", borderRadius: 10, color: p.popular ? "#0F0F1A" : "#E8E8F0", padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Commencer
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section style={{ padding: "80px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>Ils utilisent WOLO</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {temoignages.map((t, i) => (
            <div key={i} style={{ background: "#111128", border: "1px solid #1E1E38", borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 14, color: "#B8B8D0", lineHeight: 1.7, marginBottom: 20 }}>"{t.texte}"</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #7C7CF0, #5A5AE8)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff" }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t.nom}</div>
                  <div style={{ fontSize: 12, color: "#6B6B8A" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "80px 48px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(245,166,35,0.1), rgba(124,124,240,0.05))", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 24, padding: "60px 48px", maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>Prêt à piloter votre business ?</h2>
          <p style={{ fontSize: 18, color: "#6B6B8A", marginBottom: 36 }}>Rejoignez les entrepreneurs qui utilisent WOLO pour gérer leur business efficacement.</p>
          <a href="/login?mode=signup" style={{ ...btn, textDecoration: "none", fontSize: 16, padding: "16px 48px" }}>Démarrer gratuitement</a>
          <p style={{ marginTop: 16, fontSize: 13, color: "#4A4A6A" }}>Aucune carte bancaire · Accès immédiat · Annulation à tout moment</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 48px", borderTop: "1px solid #1E1E38", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.svg" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <span style={{ fontSize: 16, fontWeight: 700 }}>WOLO</span>
        </div>
        <div style={{ fontSize: 13, color: "#4A4A6A" }}>© 2026 WOLO By Prospera Vision Group — Le cerveau de votre entreprise</div>
        <a href="/login" style={{ fontSize: 13, color: "#6B6B8A", textDecoration: "none" }}>Se connecter</a>
      </footer>

    </div>
  );
}
