"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) { setError("Tous les champs sont obligatoires"); return; }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas"); return; }
    if (password.length < 6) { setError("Le mot de passe doit contenir au moins 6 caracteres"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); } else { setSuccess(true); }
    setLoading(false);
  };

  const inputStyle = { background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "12px 14px", color: "#E8E8F0", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", background: "#0F0F1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 400, background: "#111128", border: "1px solid #1E1E38", borderRadius: 16, padding: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <img src="/logo.svg" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <span style={{ fontSize: 22, fontWeight: 700, color: "#E8E8F0", letterSpacing: "0.08em" }}>WOLO</span>
        </div>

        {success ? (
          <div>
            <div style={{ fontSize: 40, textAlign: "center", marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#4A9B8E", textAlign: "center", marginBottom: 8 }}>Mot de passe modifie !</div>
            <a href="/login" style={{ display: "block", textAlign: "center", marginTop: 20, background: "linear-gradient(135deg, #F5A623, #E8830A)", borderRadius: 8, color: "#0F0F1A", padding: "13px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              Se connecter
            </a>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#E8E8F0", marginBottom: 6 }}>Nouveau mot de passe</div>
            <div style={{ fontSize: 13, color: "#6B6B8A", marginBottom: 28 }}>Choisissez un nouveau mot de passe securise</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <input placeholder="Nouveau mot de passe" type={showPassword ? "text" : "password"} value={password}
                  onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: 44 }} />
                <button onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#6B6B8A", fontSize: 16 }}>
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              <input placeholder="Confirmer le mot de passe" type="password" value={confirm}
                onChange={e => setConfirm(e.target.value)} style={inputStyle} />
            </div>
            {error && <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(232,85,85,0.1)", borderRadius: 8, fontSize: 12, color: "#E85555" }}>{error}</div>}
            <button onClick={handleReset} disabled={loading} style={{ width: "100%", marginTop: 20, background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Modification..." : "Modifier le mot de passe"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
