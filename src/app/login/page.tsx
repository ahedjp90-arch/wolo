"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const [mode, setMode] = useState<"login" | "signup">(searchParams?.get("mode") === "signup" ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else window.location.href = "/";
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { nom, entreprise } } });
      if (error) setError(error.message);
      else window.location.href = "/";
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F0F1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 400, background: "#111128", border: "1px solid #1E1E38", borderRadius: 16, padding: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #F5A623, #E8830A)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#0F0F1A" }}>W</div>
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
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", marginTop: 20, background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>
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
