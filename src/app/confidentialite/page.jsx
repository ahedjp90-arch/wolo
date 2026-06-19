"use client";
import { useState, useEffect } from "react";

export default function Confidentialite() {
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
          <h1 style={{ fontSize: 28, fontWeight: 800, color: text, marginBottom: 8 }}>Politique de Confidentialite</h1>
          <p style={{ fontSize: 13, color: sub, marginBottom: 32 }}>Derniere mise a jour : Juin 2026</p>

          {[
            {
              titre: "1. Introduction",
              contenu: "WOLO By Prospera Vision Group s'engage a proteger la vie privee de ses utilisateurs. Cette politique explique comment nous collectons, utilisons et protegeons vos donnees personnelles."
            },
            {
              titre: "2. Donnees collectees",
              contenu: "Nous collectons les donnees suivantes : nom, adresse email, nom d'entreprise, donnees financieres et clients que vous saisissez dans l'application, informations de paiement (traitees par Paystack et CinetPay)."
            },
            {
              titre: "3. Utilisation des donnees",
              contenu: "Vos donnees sont utilisees pour : fournir les services WOLO, vous envoyer des notifications importantes, ameliorer notre plateforme, traiter vos paiements. Nous ne vendons jamais vos donnees a des tiers."
            },
            {
              titre: "4. Stockage et securite",
              contenu: "Vos donnees sont stockees sur des serveurs securises via Supabase (EU West). Nous utilisons le chiffrement SSL/TLS pour toutes les communications. Chaque utilisateur n'a acces qu'a ses propres donnees."
            },
            {
              titre: "5. Partage des donnees",
              contenu: "Nous partageons vos donnees uniquement avec : Supabase (stockage), Paystack et CinetPay (paiements), Resend (emails transactionnels). Ces partenaires sont soumis a des obligations strictes de confidentialite."
            },
            {
              titre: "6. Vos droits",
              contenu: "Vous avez le droit d'acceder a vos donnees, de les modifier, de les supprimer et de vous opposer a leur traitement. Pour exercer ces droits, contactez-nous a contact.prosperadigital@gmail.com."
            },
            {
              titre: "7. Cookies",
              contenu: "WOLO utilise des cookies essentiels pour le fonctionnement de l'application (session utilisateur, preferences de theme). Nous n'utilisons pas de cookies publicitaires."
            },
            {
              titre: "8. Conservation des donnees",
              contenu: "Vos donnees sont conservees tant que votre compte est actif. En cas de suppression de compte, vos donnees sont effacees dans un delai de 30 jours."
            },
            {
              titre: "9. Contact",
              contenu: "Pour toute question concernant cette politique, contactez Prospera Vision Group a contact.prosperadigital@gmail.com ou via le module Support de WOLO."
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

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <a href="/landing" style={{ fontSize: 13, color: sub, textDecoration: "none" }}>← Retour</a>
        </div>
      </div>
    </div>
  );
}
