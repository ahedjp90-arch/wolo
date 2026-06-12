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

export default function Home() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("wolo_theme");
    if (saved) setTheme(saved);
  }, []);

  const handleTheme = (t) => {
    setTheme(t);
    localStorage.setItem("wolo_theme", t);
  };

  const isDark = theme === "dark";
  const bg = isDark ? "#0F0F1A" : "#F3F4F6";

  return (
    <div style={{ display: "flex", height: "100vh", background: bg, overflow: "hidden" }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} theme={theme} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar activeNav={activeNav} theme={theme} setTheme={handleTheme} />
        {activeNav === "dashboard" && <Dashboard theme={theme} />}
        {activeNav === "crm" && <CRM theme={theme} />}
        {activeNav === "finances" && <Finances theme={theme} />}
        {activeNav === "taches" && <Taches theme={theme} />}
        {activeNav === "wiki" && <Wiki theme={theme} />}
        {activeNav === "alertes" && <Alertes theme={theme} />}
      </div>
    </div>
  );
}
