"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "signup") setMode("signup");
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data.user) {
        localStorage.setItem("wolo_user_id", data.user.id);
        localStorage.setItem("wolo_email", email);
        window.location.replace("/");
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { nom, entreprise } } });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data.user) {
        localStorage.setItem("wolo_user_id", data.user.id);
        localStorage.setItem("wolo_email", email);
        await fetch("/api/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data.user.id, email, nom }),
        });
        setSuccess("Un email de confirmation a été envoyé à " + email + ". Vérifiez votre boîte mail.");
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F0F1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 400, background: "#111128", border: "1px solid #1E1E38", borderRadius: 16, padding: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <img src="/logo.svg" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <span style={{ fontSize: 22, fontWeight: 700, color: "#E8E8F0", letterSpacing: "0.08em" }}>WOLO</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#E8E8F0", marginBottom: 6 }}>{mode === "login" ? "Connexion" : "Créer un compte"}</div>
        <div style={{ fontSize: 13, color: "#6B6B8A", marginBottom: 28 }}>{mode === "login" ? "Accédez à votre Business OS" : "Démarrez gratuitement"}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "signup" && (
            <>
              <input placeholder="Votre nom" value={nom} onChange={e => setNom(e.target.value)} style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "12px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }} />
              <input placeholder="Nom de votre entreprise" value={entreprise} onChange={e => setEntreprise(e.target.value)} style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "12px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }} />
            </>
          )}
          <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "12px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }} />
          <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "12px 14px", color: "#E8E8F0", fontSize: 13, outline: "none" }} />
        </div>
        {error && <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(232,85,85,0.1)", borderRadius: 8, fontSize: 12, color: "#E85555" }}>{error}</div>}
        {success && <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(74,155,142,0.1)", borderRadius: 8, fontSize: 12, color: "#4A9B8E" }}>{success}</div>}
        {!success && (
          <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", marginTop: 20, background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
        )}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#6B6B8A" }}>
          {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <span onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ color: "#F5A623", cursor: "pointer", fontWeight: 600 }}>
            {mode === "login" ? "S'inscrire" : "Se connecter"}
          </span>
        </div>
      </div>
    </div>
  );
}
