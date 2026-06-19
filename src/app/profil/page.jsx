"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Profil() {
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [plan, setPlan] = useState("Gratuit");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profil, setProfil] = useState({ nom: "", email: "", entreprise: "", telephone: "", ville: "Abidjan", pays: "Cote d'Ivoire" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("wolo_theme") || "dark";
    setTheme(savedTheme);
    const savedPlan = localStorage.getItem("wolo_plan") || "Gratuit";
    setPlan(savedPlan);
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setProfil(p => ({
        ...p,
        email: session.user.email || "",
        nom: session.user.user_metadata?.nom || "",
        entreprise: session.user.user_metadata?.entreprise || "",
      }));
    }
  };

  const sauvegarder = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ data: { nom: profil.nom, entreprise: profil.entreprise } });
    if (!error) {
      localStorage.setItem("wolo_email", profil.email);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  };

  const changerMotDePasse = async () => {
    setPwError("");
    setPwSuccess("");
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setPwError("Tous les champs sont obligatoires");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setPwError("Les mots de passe ne correspondent pas");
      return;
    }
    if (passwords.newPass.length < 6) {
      setPwError("Le mot de passe doit contenir au moins 6 caracteres");
      return;
    }
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: profil.email, password: passwords.current });
    if (signInError) { setPwError("Mot de passe actuel incorrect"); setLoading(false); return; }
    const { error } = await supabase.auth.updateUser({ password: passwords.newPass });
    if (error) { setPwError(error.message); } else {
      setPwSuccess("Mot de passe modifie avec succes !");
      setPasswords({ current: "", newPass: "", confirm: "" });
      setTimeout(() => setPwSuccess(""), 3000);
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

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <a href="/" style={{ color: sub, textDecoration: "none", fontSize: 13 }}>← Retour</a>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: text }}>Mon profil</div>
            <div style={{ fontSize: 13, color: sub, marginTop: 2 }}>Gerez vos informations personnelles</div>
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
            <div style={{ fontSize: 12, color: "#F5A623", marginTop: 4 }}>Plan : {plan}</div>
          </div>
        </div>

        {/* Infos */}
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
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Telephone</label>
              <input placeholder="+225 07 00 00 00" value={profil.telephone} onChange={e => setProfil({ ...profil, telephone: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <button onClick={sauvegarder} disabled={loading} style={{ marginTop: 24, width: "100%", background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 10, color: "#0F0F1A", padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Sauvegarde..." : saved ? "Sauvegarde !" : "Sauvegarder"}
          </button>
        </div>

        {/* Modifier mot de passe */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 28, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: text, marginBottom: 20 }}>Modifier le mot de passe</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Mot de passe actuel</label>
              <div style={{ position: "relative" }}>
                <input type={showCurrentPassword ? "text" : "password"} placeholder="Mot de passe actuel" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} style={{ ...inputStyle, paddingRight: 44 }} />
                <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: sub, fontSize: 16 }}>
                  {showCurrentPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Nouveau mot de passe</label>
              <div style={{ position: "relative" }}>
                <input type={showNewPassword ? "text" : "password"} placeholder="Nouveau mot de passe" value={passwords.newPass} onChange={e => setPasswords({ ...passwords, newPass: e.target.value })} style={{ ...inputStyle, paddingRight: 44 }} />
                <button onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: sub, fontSize: 16 }}>
                  {showNewPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Confirmer nouveau mot de passe</label>
              <input type="password" placeholder="Confirmer" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} style={inputStyle} />
            </div>
          </div>
          {pwError && <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(232,85,85,0.1)", borderRadius: 8, fontSize: 12, color: "#E85555" }}>{pwError}</div>}
          {pwSuccess && <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(74,155,142,0.1)", borderRadius: 8, fontSize: 12, color: "#4A9B8E" }}>{pwSuccess}</div>}
          <button onClick={changerMotDePasse} disabled={loading} style={{ marginTop: 16, width: "100%", background: isDark ? "#1A1A2E" : "#F3F4F6", border: `1px solid ${border}`, borderRadius: 10, color: text, padding: "13px", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            Modifier le mot de passe
          </button>
        </div>

        {/* Abonnement */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 28, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: text, marginBottom: 16 }}>Mon abonnement</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, color: text, fontWeight: 600 }}>Plan {plan}</div>
              <div style={{ fontSize: 12, color: sub, marginTop: 4 }}>Gerez votre abonnement</div>
            </div>
            <a href="/abonnement" style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}>
              Changer de plan
            </a>
          </div>
        </div>

        {/* Deconnexion */}
        <div style={{ background: card, border: `1px solid rgba(232,85,85,0.3)`, borderRadius: 16, padding: 28 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#E85555", marginBottom: 16 }}>Zone dangereuse</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, color: text }}>Se deconnecter</div>
              <div style={{ fontSize: 12, color: sub, marginTop: 4 }}>Fermer la session actuelle</div>
            </div>
            <button onClick={async () => { await supabase.auth.signOut(); localStorage.clear(); window.location.href = "/landing"; }}
              style={{ background: "rgba(232,85,85,0.1)", border: "1px solid rgba(232,85,85,0.3)", borderRadius: 8, color: "#E85555", padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Deconnexion
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
