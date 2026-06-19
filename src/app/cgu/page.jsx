"use client";
import { useState, useEffect } from "react";

export default function CGU() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("wolo_theme") || "dark";
    setTheme(saved);
  }, []);

  const isDark = theme === "dark";
  const bg = isDark ? "#0F0F1A" : "#F3F4F6";
  const card = isDark ? "#111128" : "#FFFFFF";
  const border = isDark ? "#1E1E38" : "#E5E7EB";
  const text = isDark ? "#E8E8F0" : "#111827";
  const sub = isDark ? "#6B6B8A" : "#6B7280";

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "Inter, sans-serif", padding: "60px 48px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
          <img src="/logo.svg" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <span style={{ fontSize: 20, fontWeight: 700, color: text }}>WOLO</span>
        </div>

        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: text, marginBottom: 8 }}>Conditions Generales d'Utilisation</h1>
          <p style={{ fontSize: 13, color: sub, marginBottom: 32 }}>Derniere mise a jour : Juin 2026</p>

          {[
            {
              titre: "1. Acceptation des conditions",
              contenu: "En utilisant WOLO, vous acceptez les presentes conditions generales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service."
            },
            {
              titre: "2. Description du service",
              contenu: "WOLO est un Business OS SaaS (Software as a Service) qui permet aux entrepreneurs et PME de gerer leurs clients, finances, taches, factures et documents depuis une seule plateforme. Le service est fourni par Prospera Vision Group."
            },
            {
              titre: "3. Compte utilisateur",
              contenu: "Vous devez creer un compte pour utiliser WOLO. Vous etes responsable de la confidentialite de vos identifiants. Vous devez nous notifier immediatement en cas d'acces non autorise a votre compte. Vous devez avoir au moins 18 ans pour utiliser WOLO."
            },
            {
              titre: "4. Abonnements et paiements",
              contenu: "WOLO propose un essai gratuit de 7 jours suivi de plans payants mensuels. Les paiements sont traites via Paystack (Mobile Money) et CinetPay (Carte bancaire). Les abonnements sont automatiquement renouvelables et peuvent etre annules a tout moment."
            },
            {
              titre: "5. Utilisation acceptable",
              contenu: "Vous vous engagez a utiliser WOLO uniquement a des fins legales et conformes aux presentes conditions. Il est interdit d'utiliser WOLO pour des activites frauduleuses, illegales ou nuisibles."
            },
            {
              titre: "6. Propriete intellectuelle",
              contenu: "WOLO et tous ses contenus (logo, design, code, fonctionnalites) sont la propriete exclusive de Prospera Vision Group. Vos donnees (clients, finances, documents) restent votre propriete."
            },
            {
              titre: "7. Disponibilite du service",
              contenu: "Nous nous efforcons de maintenir WOLO disponible 24h/24 et 7j/7. Nous nous reservons le droit d'effectuer des maintenances pouvant entrainer des interruptions temporaires."
            },
            {
              titre: "8. Limitation de responsabilite",
              contenu: "Prospera Vision Group ne peut etre tenu responsable des pertes de donnees, interruptions de service ou dommages indirects. Notre responsabilite est limitee au montant paye pour le service au cours des 3 derniers mois."
            },
            {
              titre: "9. Resiliation",
              contenu: "Vous pouvez resilier votre abonnement a tout moment. Nous nous reservons le droit de suspendre ou resilier votre compte en cas de violation des presentes conditions."
            },
            {
              titre: "10. Droit applicable",
              contenu: "Les presentes conditions sont regies par le droit ivoirien. Tout litige sera soumis aux tribunaux competents d'Abidjan, Cote d'Ivoire."
            },
            {
              titre: "11. Contact",
              contenu: "Pour toute question relative aux presentes CGU, contactez Prospera Vision Group a contact.prosperadigital@gmail.com."
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: text, marginBottom: 8 }}>{section.titre}</h2>
              <p style={{ fontSize: 14, color: sub, lineHeight: 1.7 }}>{section.contenu}</p>
            </div>
          ))}

          <div style={{ borderTop: `1px solid ${border}`, paddingTop: 24, marginTop: 8 }}>
            <p style={{ fontSize: 13, color: sub, textAlign: "center" }}>
              © 2026 WOLO By Prospera Vision Group · Abidjan, Cote d'Ivoire
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, display: "flex", gap: 24, justifyContent: "center" }}>
          <a href="/login" style={{ fontSize: 13, color: sub, textDecoration: "none" }}>← Retour</a>
          <a href="/confidentialite" style={{ fontSize: 13, color: "#F5A623", textDecoration: "none" }}>Politique de confidentialite</a>
        </div>
      </div>
    </div>
  );
}
