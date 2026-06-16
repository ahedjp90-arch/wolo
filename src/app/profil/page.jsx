"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Profil() {
 const [theme, setTheme] = useState("dark");
 const [loading, setLoading] = useState(false);
 const [saved, setSaved] = useState(false);
 const [profil, setProfil] = useState({
   nom: "",
   email: "",
   entreprise: "",
   telephone: "",
   ville: "Abidjan",
   pays: "Côte d'Ivoire",
 });

 useEffect(() => {
   const savedTheme = localStorage.getItem("wolo_theme");
   if (savedTheme) setTheme(savedTheme);
   const savedEmail = localStorage.getItem("wolo_email");
   if (savedEmail) setProfil(p => ({ ...p, email: savedEmail }));
   fetchProfil();
 }, []);

 const fetchProfil = async () => {
   const { data: { session } } = await supabase.auth.getSession();
   if (session?.user) {
     setProfil(p => ({
       ...p,
       email: session.user.email || p.email,
       nom: session.user.user_metadata?.nom || "",
       entreprise: session.user.user_metadata?.entreprise || "",
     }));
   }
 };

 const sauvegarder = async () => {
   setLoading(true);
   const { error } = await supabase.auth.updateUser({
     data: { nom: profil.nom, entreprise: profil.entreprise }
   });
   if (!error) {
     localStorage.setItem("wolo_email", profil.email);
     setSaved(true);
     setTimeout(() => setSaved(false), 3000);
   }
   setLoading(false);
 };

 const isDark = theme === "dark";
 const bg = isDark ? "#0F0F1A" : "#F3F4F6";
 const card = isDark ? "#111128" : "#FFFFFF";
 const border = isDark ? "#1E1E38" : "#E5E7EB";
 const text = isDark ? "#E8E8F0" : "#111827";
 const sub = isDark ? "#6B6B8A" : "#6B7280";
 const input = isDark ? "#0F0F1A" : "#F9FAFB";
 const inputBorder = isDark ? "#2A2A45" : "#D1D5DB";
 const inputStyle = { background: input, border: `1px solid ${inputBorder}`, borderRadius: 8, padding: "12px 14px", color: text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" };

 return (
   <div style={{ minHeight: "100vh", background: bg, padding: "60px 48px", fontFamily: "Inter, sans-serif" }}>
     <div style={{ maxWidth: 600, margin: "0 auto" }}>

       {/* Header */}
       <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
         <a href="/" style={{ color: sub, textDecoration: "none", fontSize: 13 }}>← Retour</a>
         <div style={{ flex: 1 }}>
           <div style={{ fontSize: 24, fontWeight: 700, color: text }}>Mon profil</div>
           <div style={{ fontSize: 13, color: sub, marginTop: 2 }}>Gérez vos informations personnelles</div>
         </div>
       </div>

       {/* Avatar */}
       <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 28, marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
         <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #7C7CF0, #5A5AE8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
           {profil.nom ? profil.nom[0].toUpperCase() : "?"}
         </div>
         <div>
           <div style={{ fontSize: 18, fontWeight: 700, color: text }}>{profil.nom || "Votre nom"}</div>
           <div style={{ fontSize: 13, color: sub, marginTop: 4 }}>{profil.email}</div>
           <div style={{ fontSize: 12, color: "#F5A623", marginTop: 4 }}>
             Plan : {localStorage.getItem("wolo_plan") || "Gratuit"}
           </div>
         </div>
       </div>

       {/* Formulaire */}
       <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 28, marginBottom: 20 }}>
         <div style={{ fontSize: 16, fontWeight: 600, color: text, marginBottom: 20 }}>Informations personnelles</div>
         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

           <div>
             <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Nom complet</label>
             <input placeholder="Votre nom" value={profil.nom} onChange={e => setProfil({ ...profil, nom: e.target.value })} style={inputStyle} />
           </div>

           <div>
             <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Email</label>
             <input placeholder="votre@email.com" value={profil.email} onChange={e => setProfil({ ...profil, email: e.target.value })} style={inputStyle} />
           </div>

           <div>
             <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Entreprise</label>
             <input placeholder="Nom de votre entreprise" value={profil.entreprise} onChange={e => setProfil({ ...profil, entreprise: e.target.value })} style={inputStyle} />
           </div>

           <div>
             <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Téléphone</label>
             <input placeholder="+225 07 00 00 00" value={profil.telephone} onChange={e => setProfil({ ...profil, telephone: e.target.value })} style={inputStyle} />
           </div>

           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
             <div>
               <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Ville</label>
               <input placeholder="Abidjan" value={profil.ville} onChange={e => setProfil({ ...profil, ville: e.target.value })} style={inputStyle} />
             </div>
             <div>
               <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Pays</label>
               <input placeholder="Côte d'Ivoire" value={profil.pays} onChange={e => setProfil({ ...profil, pays: e.target.value })} style={inputStyle} />
             </div>
           </div>

         </div>

         <button onClick={sauvegarder} disabled={loading} style={{ marginTop: 24, width: "100%", background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 10, color: "#0F0F1A", padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
           {loading ? "Sauvegarde..." : saved ? "✓ Sauvegardé !" : "Sauvegarder"}
         </button>
       </div>

       {/* Abonnement */}
       <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 28, marginBottom: 20 }}>
         <div style={{ fontSize: 16, fontWeight: 600, color: text, marginBottom: 16 }}>Mon abonnement</div>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <div>
             <div style={{ fontSize: 14, color: text, fontWeight: 600 }}>Plan {localStorage.getItem("wolo_plan") || "Gratuit"}</div>
             <div style={{ fontSize: 12, color: sub, marginTop: 4 }}>Gérez votre abonnement</div>
           </div>
           <a href="/abonnement" style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}>
             Changer de plan
           </a>
         </div>
       </div>

       {/* Danger zone */}
       <div style={{ background: card, border: `1px solid rgba(232,85,85,0.3)`, borderRadius: 16, padding: 28 }}>
         <div style={{ fontSize: 16, fontWeight: 600, color: "#E85555", marginBottom: 16 }}>Zone dangereuse</div>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <div>
             <div style={{ fontSize: 14, color: text }}>Se déconnecter</div>
             <div style={{ fontSize: 12, color: sub, marginTop: 4 }}>Fermer la session actuelle</div>
           </div>
           <button onClick={async () => { await supabase.auth.signOut(); localStorage.clear(); window.location.href = "/landing"; }}
             style={{ background: "rgba(232,85,85,0.1)", border: "1px solid rgba(232,85,85,0.3)", borderRadius: 8, color: "#E85555", padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
             Déconnexion
           </button>
         </div>
       </div>

     </div>
   </div>
 );
}
