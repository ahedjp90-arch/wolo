"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Dashboard from "@/components/Dashboard";
import CRM from "@/components/CRM";
import Finances from "@/components/Finances";
import Taches from "@/components/Taches";
import Wiki from "@/components/Wiki";
import Alertes from "@/components/Alertes";
import Facturation from "@/components/Facturation";
import Support from "@/components/Support";
import { getLang } from "@/lib/i18n";

export default function Home() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [theme, setTheme] = useState("dark");
  const [auth, setAuth] = useState(false);
  const [lang, setLang] = useState("fr");

  useEffect(() => {
    const savedTheme = localStorage.getItem("wolo_theme") || "dark";
    setTheme(savedTheme);
    const savedNav = localStorage.getItem("wolo_nav") || "dashboard";
    setActiveNav(savedNav);
    const userId = localStorage.getItem("wolo_user_id");
    if (!userId) window.location.href = "/landing";
    else setAuth(true);
    setLang(getLang());

    const handleLangChange = () => setLang(getLang());
    window.addEventListener("wolo_lang_change", handleLangChange);
    return () => window.removeEventListener("wolo_lang_change", handleLangChange);
  }, []);

  const handleNav = (nav) => {
    setActiveNav(nav);
    localStorage.setItem("wolo_nav", nav);
  };

  const handleTheme = (t) => {
    setTheme(t);
    localStorage.setItem("wolo_theme", t);
  };

  if (!auth) return null;

  const isDark = theme === "dark";
  const bg = isDark ? "#0F0F1A" : "#F3F4F6";

  return (
    <div style={{ display: "flex", height: "100vh", background: bg, overflow: "hidden" }}>
      <Sidebar activeNav={activeNav} setActiveNav={handleNav} theme={theme} lang={lang} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar activeNav={activeNav} theme={theme} setTheme={handleTheme} />
        {activeNav === "dashboard" && <Dashboard theme={theme} lang={lang} />}
        {activeNav === "crm" && <CRM theme={theme} lang={lang} />}
        {activeNav === "finances" && <Finances theme={theme} lang={lang} />}
        {activeNav === "taches" && <Taches theme={theme} lang={lang} />}
        {activeNav === "wiki" && <Wiki theme={theme} lang={lang} />}
        {activeNav === "alertes" && <Alertes theme={theme} lang={lang} />}
        {activeNav === "facturation" && <Facturation theme={theme} lang={lang} />}
        {activeNav === "support" && <Support theme={theme} lang={lang} />}
      </div>
    </div>
  );
}
