"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getLang } from "@/lib/i18n";

const content = {
 fr: {
   login_title: "Connexion",
   login_desc: "Accédez à votre Business OS",
   signup_title: "Créer un compte",
   signup_desc: "Démarrez gratuitement",
   nom: "Votre nom",
   entreprise: "Nom de votre entreprise",
   email: "Email",
   password: "Mot de passe",
   signin_btn: "Se connecter",
   signup_btn: "Créer mon compte",
   no_account: "Pas encore de compte ?",
   has_account: "Déjà un compte ?",
   signup_link: "S'inscrire",
   signin_link: "Se connecter",
   forgot: "Mot de passe oublié ?",
   legal: "En continuant, vous acceptez nos",
   cgu: "CGU",
   and: "et notre",
   privacy: "Politique de confidentialité",
   reset_title: "Mot de passe oublié",
   reset_desc: "Entrez votre email pour recevoir un lien de réinitialisation",
   reset_btn: "Envoyer le lien",
   reset_sent: "Email envoyé ! Vérifiez votre boite mail.",
   back: "← Retour à la connexion",
   loading: "Chargement...",
   sending: "Envoi...",
 },
 en: {
   login_title: "Sign In",
   login_desc: "Access your Business OS",
   signup_title: "Create an account",
   signup_desc: "Start for free",
   nom: "Your name",
   entreprise: "Company name",
   email: "Email",
   password: "Password",
   signin_btn: "Sign in",
   signup_btn: "Create my account",
   no_account: "Don't have an account?",
   has_account: "Already have an account?",
   signup_link: "Sign up",
   signin_link: "Sign in",
   forgot: "Forgot password?",
   legal: "By continuing, you agree to our",
   cgu: "Terms of Service",
   and: "and our",
   privacy: "Privacy Policy",
   reset_title: "Forgot Password",
   reset_desc: "Enter your email to receive a reset link",
   reset_btn: "Send reset link",
   reset_sent: "Email sent! Check your inbox.",
   back: "← Back to sign in",
   loading: "Loading...",
   sending: "Sending...",
 }
};

export default function Login() {
 const [mode, setMode] = useState("login");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [nom, setNom] = useState("");
 const [entreprise, setEntreprise] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [resetMode, setResetMode] = useState(false);
 const [resetEmail, setResetEmail] = useState("");
 const [resetSent, setResetSent] = useState(false);
 const [lang, setLang] = useState("fr");
 const [theme, setTheme] = useState("dark");

 useEffect(() => {
   const params = new URLSearchParams(window.location.search);
   if (params.get("mode") === "signup") setMode("signup");
   setLang(getLang());
   const savedTheme = localStorage.getItem("wolo_theme") || "dark";
   setTheme(savedTheme);
 }, []);

 const c = content[lang];
 const isDark = theme === "dark";
 const bg = isDark ? "#0F0F1A" : "#F3F4F6";
 const card = isDark ? "#111128" : "#FFFFFF";
 const border = isDark ? "#1E1E38" : "#E5E7EB";
 const text = isDark ? "#E8E8F0" : "#111827";
 const sub = isDark ? "#6B6B8A" : "#6B7280";
 const inputBg = isDark ? "#0F0F1A" : "#F9FAFB";
 const inputBorder = isDark ? "#2A2A45" : "#D1D5DB";
 const inputStyle = { background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 8, padding: "12px 14px", color: text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" as const };

 const toggleLang = () => {
   const newLang = lang === "fr" ? "en" : "fr";
   setLang(newLang);
   localStorage.setItem("wolo_lang", newLang);
 };

 const toggleTheme = () => {
   const newTheme = theme === "dark" ? "light" : "dark";
   setTheme(newTheme);
   localStorage.setItem("wolo_theme", newTheme);
 };

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
       localStorage.setItem("wolo_nom", data.user.user_metadata?.nom || email.split("@")[0]);
       window.location.replace("/");
     }
   } else {
     const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { nom, entreprise } } });
     if (error) { setError(error.message); setLoading(false); return; }
     if (data.user) {
       localStorage.setItem("wolo_user_id", data.user.id);
       localStorage.setItem("wolo_email", email);
       localStorage.setItem("wolo_nom", nom || email.split("@")[0]);
       await fetch("/api/confirm", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ userId: data.user.id, email, nom }),
       });
       setSuccess(lang === "en" ? `Confirmation email sent to ${email}` : `Un email de confirmation a été envoyé à ${email}`);
     }
   }
   setLoading(false);
 };

 const handleReset = async () => {
   if (!resetEmail) { setError(lang === "en" ? "Enter your email" : "Entrez votre email"); return; }
   setLoading(true);
   const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
     redirectTo: "https://wolo.e-plazastore.com/reset-password",
   });
   if (error) { setError(error.message); } else { setResetSent(true); }
   setLoading(false);
 };

 const TopBar = () => (
   <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 8 }}>
     <button onClick={toggleLang} style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 8, color: "#F5A623", padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
       {lang === "fr" ? "EN" : "FR"}
     </button>
     <button onClick={toggleTheme} style={{ background: isDark ? "#1A1A2E" : "#F3F4F6", border: `1px solid ${border}`, borderRadius: 8, color: sub, padding: "6px 12px", fontSize: 14, cursor: "pointer" }}>
       {isDark ? "☀️" : "🌙"}
     </button>
   </div>
 );

 if (resetMode) {
   return (
     <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
       <TopBar />
       <div style={{ width: 400, background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 40 }}>
         <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
           <img src="/logo.svg" style={{ width: 36, height: 36, borderRadius: 8 }} />
           <span style={{ fontSize: 22, fontWeight: 700, color: text, letterSpacing: "0.08em" }}>WOLO</span>
         </div>
         <div style={{ fontSize: 20, fontWeight: 700, color: text, marginBottom: 6 }}>{c.reset_title}</div>
         <div style={{ fontSize: 13, color: sub, marginBottom: 28 }}>{c.reset_desc}</div>

         {!resetSent ? (
           <>
             <input placeholder="Email" type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} style={inputStyle} />
             {error && <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(232,85,85,0.1)", borderRadius: 8, fontSize: 12, color: "#E85555" }}>{error}</div>}
             <button onClick={handleReset} disabled={loading} style={{ width: "100%", marginTop: 16, background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
               {loading ? c.sending : c.reset_btn}
             </button>
           </>
         ) : (
           <div style={{ padding: "16px", background: "rgba(74,155,142,0.1)", borderRadius: 8, fontSize: 13, color: "#4A9B8E", textAlign: "center" }}>
             {c.reset_sent}
           </div>
         )}

         <div style={{ textAlign: "center", marginTop: 20 }}>
           <span onClick={() => { setResetMode(false); setError(""); setResetSent(false); }} style={{ color: "#F5A623", cursor: "pointer", fontSize: 13 }}>
             {c.back}
           </span>
         </div>
       </div>
     </div>
   );
 }

 return (
   <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
     <TopBar />
     <div style={{ width: 400, background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 40 }}>
       <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
         <img src="/logo.svg" style={{ width: 36, height: 36, borderRadius: 8 }} />
         <span style={{ fontSize: 22, fontWeight: 700, color: text, letterSpacing: "0.08em" }}>WOLO</span>
       </div>
       <div style={{ fontSize: 20, fontWeight: 700, color: text, marginBottom: 6 }}>{mode === "login" ? c.login_title : c.signup_title}</div>
       <div style={{ fontSize: 13, color: sub, marginBottom: 28 }}>{mode === "login" ? c.login_desc : c.signup_desc}</div>

       <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
         {mode === "signup" && (
           <>
             <input placeholder={c.nom} value={nom} onChange={e => setNom(e.target.value)} style={inputStyle} />
             <input placeholder={c.entreprise} value={entreprise} onChange={e => setEntreprise(e.target.value)} style={inputStyle} />
           </>
         )}
         <input placeholder={c.email} type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
         <div style={{ position: "relative" }}>
           <input placeholder={c.password} type={showPassword ? "text" : "password"} value={password}
             onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()}
             style={{ ...inputStyle, paddingRight: 44 }} />
           <button onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: sub, fontSize: 16 }}>
             {showPassword ? "🙈" : "👁"}
           </button>
         </div>
       </div>

       {mode === "login" && (
         <div style={{ textAlign: "right", marginTop: 8 }}>
           <span onClick={() => setResetMode(true)} style={{ color: "#F5A623", cursor: "pointer", fontSize: 12 }}>{c.forgot}</span>
         </div>
       )}

       {error && <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(232,85,85,0.1)", borderRadius: 8, fontSize: 12, color: "#E85555" }}>{error}</div>}
       {success && <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(74,155,142,0.1)", borderRadius: 8, fontSize: 12, color: "#4A9B8E" }}>{success}</div>}

       {!success && (
         <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", marginTop: 16, background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
           {loading ? c.loading : mode === "login" ? c.signin_btn : c.signup_btn}
         </button>
       )}

       <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: sub }}>
         {mode === "login" ? c.no_account : c.has_account}{" "}
         <span onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ color: "#F5A623", cursor: "pointer", fontWeight: 600 }}>
           {mode === "login" ? c.signup_link : c.signin_link}
         </span>
       </div>

       <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: sub }}>
         {c.legal}{" "}
         <a href="/cgu" style={{ color: "#F5A623", textDecoration: "none" }}>{c.cgu}</a>
         {" "}{c.and}{" "}
         <a href="/confidentialite" style={{ color: "#F5A623", textDecoration: "none" }}>{c.privacy}</a>
       </div>
     </div>
   </div>
 );
}
