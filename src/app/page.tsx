"use client";
import { useState } from "react";
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

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0F0F1A", overflow: "hidden" }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar activeNav={activeNav} />
        {activeNav === "dashboard" && <Dashboard />}
        {activeNav === "crm" && <CRM />}
        {activeNav === "finances" && <Finances />}
        {activeNav === "taches" && <Taches />}
        {activeNav === "wiki" && <Wiki />}
        {activeNav === "alertes" && <Alertes />}
      </div>
    </div>
  );
}
