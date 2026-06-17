"use client";
import { useState, useEffect } from "react";

export default function Confirm() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) { setStatus("error"); return; }

    fetch(`/api/confirm?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus("success");
          setTimeout(() => window.location.href = "/login", 3000);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0F0F1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ textAlign: "center", padding: 40 }}>
        <img src="/logo.svg" style={{ width: 60, height: 60, borderRadius: 12, marginBottom: 24 }} />
        {status === "loading" && (
          <div>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
            <div style={{ color: "#6B6B8A", fontSize: 16 }}>Vérification en cours...</div>
          </div>
        )}
        {status === "success" && (
          <div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div style={{ color: "#4A9B8E", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Email confirmé !</div>
            <div style={{ color: "#6B6B8A", fontSize: 14 }}>Redirection vers la connexion...</div>
          </div>
        )}
        {status === "error" && (
          <div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
            <div style={{ color: "#E85555", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Lien invalide ou expiré</div>
            <a href="/login" style={{ background: "linear-gradient(135deg, #F5A623, #E8830A)", color: "#0F0F1A", padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>Se connecter</a>
          </div>
        )}
      </div>
    </div>
  );
}
