"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Confirm() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const handleConfirm = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
        localStorage.setItem("wolo_user_id", session.user.id);
        localStorage.setItem("wolo_email", session.user.email);
        setStatus("success");
        setTimeout(() => window.location.href = "/", 2000);
      } else {
        setStatus("error");
      }
    };
    handleConfirm();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0F0F1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ textAlign: "center", padding: 40 }}>
        <img src="/logo.svg" style={{ width: 60, height: 60, borderRadius: 12, marginBottom: 24 }} />
        {status === "loading" && <div style={{ color: "#6B6B8A", fontSize: 16 }}>Vérification en cours...</div>}
        {status === "success" && (
          <div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div style={{ color: "#4A9B8E", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Email confirmé !</div>
            <div style={{ color: "#6B6B8A", fontSize: 14 }}>Redirection vers WOLO...</div>
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
