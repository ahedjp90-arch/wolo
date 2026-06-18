"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function WoloAdmin() {
 const [users, setUsers] = useState([]);
 const [stats, setStats] = useState({ totalUsers: 0, totalClients: 0, totalTransactions: 0, totalRevenu: 0 });
 const [loading, setLoading] = useState(true);
 const [auth, setAuth] = useState(false);
 const [password, setPassword] = useState("");
 const [error, setError] = useState("");

 const handleLogin = () => {
   if (password === "dygrew-wIpsu1-mehfif") {
     setAuth(true);
     fetchData();
   } else {
     setError("Mot de passe incorrect");
   }
 };

 const fetchData = async () => {
   setLoading(true);
   const [clientsRes, transactionsRes, tachesRes, wikiRes] = await Promise.all([
     supabase.from("clients").select("user_id"),
     supabase.from("transactions").select("user_id, montant, type"),
     supabase.from("taches").select("user_id"),
     supabase.from("wiki").select("user_id"),
   ]);

   const clients = clientsRes.data || [];
   const transactions = transactionsRes.data || [];
   const taches = tachesRes.data || [];
   const wiki = wikiRes.data || [];

   const uniqueUsers = [...new Set([
     ...clients.map(c => c.user_id),
     ...transactions.map(t => t.user_id),
     ...taches.map(t => t.user_id),
     ...wiki.map(w => w.user_id),
   ].filter(Boolean))];

   const totalRevenu = transactions.filter(t => t.type === "entree").reduce((s, t) => s + (t.montant || 0), 0);

   const userStats = uniqueUsers.map(uid => ({
     id: uid,
     clients: clients.filter(c => c.user_id === uid).length,
     transactions: transactions.filter(t => t.user_id === uid).length,
     taches: taches.filter(t => t.user_id === uid).length,
     wiki: wiki.filter(w => w.user_id === uid).length,
     revenu: transactions.filter(t => t.user_id === uid && t.type === "entree").reduce((s, t) => s + (t.montant || 0), 0),
   }));

   setUsers(userStats);
   setStats({ totalUsers: uniqueUsers.length, totalClients: clients.length, totalTransactions: transactions.length, totalRevenu });
   setLoading(false);
 };

 if (!auth) {
   return (
     <div style={{ minHeight: "100vh", background: "#0F0F1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
       <div style={{ width: 360, background: "#111128", border: "1px solid #1E1E38", borderRadius: 16, padding: 40 }}>
         <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
           <img src="/logo.svg" style={{ width: 36, height: 36, borderRadius: 8 }} />
           <span style={{ fontSize: 18, fontWeight: 700, color: "#E8E8F0" }}>WOLO Admin</span>
         </div>
         <input type="password" placeholder="Mot de passe admin" value={password} onChange={e => setPassword(e.target.value)}
           onKeyDown={e => e.key === "Enter" && handleLogin()}
           style={{ width: "100%", background: "#0F0F1A", border: "1px solid #2A2A45", borderRadius: 8, padding: "12px 14px", color: "#E8E8F0", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
         {error && <div style={{ marginTop: 8, fontSize: 12, color: "#E85555" }}>{error}</div>}
         <button onClick={handleLogin} style={{ width: "100%", marginTop: 16, background: "linear-gradient(135deg, #F5A623, #E8830A)", border: "none", borderRadius: 8, color: "#0F0F1A", padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
           Accéder
         </button>
       </div>
     </div>
   );
 }

 return (
   <div style={{ minHeight: "100vh", background: "#0F0F1A", color: "#E8E8F0", fontFamily: "Inter, sans-serif", padding: "40px 48px" }}>
     <div style={{ maxWidth: 1200, margin: "0 auto" }}>
       <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
         <img src="/logo.svg" style={{ width: 36, height: 36, borderRadius: 8 }} />
         <div>
           <div style={{ fontSize: 24, fontWeight: 700 }}>WOLO Admin</div>
           <div style={{ fontSize: 13, color: "#6B6B8A" }}>Vue d'ensemble de la plateforme</div>
         </div>
       </div>

       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
         {[
           { label: "Utilisateurs actifs", valeur: stats.totalUsers, icon: "👥" },
           { label: "Total clients", valeur: stats.totalClients, icon: "🏢" },
           { label: "Total transactions", valeur: stats.totalTransactions, icon: "💰" },
           { label: "Revenus clients", valeur: stats.totalRevenu?.toLocaleString() + " FCFA", icon: "📈" },
         ].map((s, i) => (
           <div key={i} style={{ background: "#111128", border: "1px solid #1E1E38", borderRadius: 14, padding: "20px 24px" }}>
             <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
             <div style={{ fontSize: 22, fontWeight: 700, color: "#F5A623" }}>{s.valeur}</div>
             <div style={{ fontSize: 12, color: "#6B6B8A", marginTop: 4 }}>{s.label}</div>
           </div>
         ))}
       </div>

       <div style={{ background: "#111128", border: "1px solid #1E1E38", borderRadius: 14, overflow: "hidden" }}>
         <div style={{ padding: "20px 24px", borderBottom: "1px solid #1E1E38", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <div style={{ fontSize: 16, fontWeight: 600 }}>Utilisateurs ({users.length})</div>
           <button onClick={fetchData} style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 8, color: "#F5A623", padding: "6px 14px", fontSize: 12, cursor: "pointer" }}>
             🔄 Actualiser
           </button>
         </div>
         {loading && <div style={{ color: "#6B6B8A", textAlign: "center", padding: 40 }}>Chargement...</div>}
         {!loading && (
           <table style={{ width: "100%", borderCollapse: "collapse" }}>
             <thead>
               <tr style={{ background: "#0F0F1A" }}>
                 {["User ID", "Clients", "Transactions", "Tâches", "Wiki", "Revenus"].map(h => (
                   <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, color: "#6B6B8A", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{h}</th>
                 ))}
               </tr>
             </thead>
             <tbody>
               {users.map((u) => (
                 <tr key={u.id} style={{ borderTop: "1px solid #1E1E38" }}>
                   <td style={{ padding: "14px 20px", fontSize: 12, color: "#6B6B8A", fontFamily: "monospace" }}>{u.id?.substring(0, 16)}...</td>
                   <td style={{ padding: "14px 20px", fontSize: 13, color: "#E8E8F0", fontWeight: 600 }}>{u.clients}</td>
                   <td style={{ padding: "14px 20px", fontSize: 13, color: "#E8E8F0", fontWeight: 600 }}>{u.transactions}</td>
                   <td style={{ padding: "14px 20px", fontSize: 13, color: "#E8E8F0", fontWeight: 600 }}>{u.taches}</td>
                   <td style={{ padding: "14px 20px", fontSize: 13, color: "#E8E8F0", fontWeight: 600 }}>{u.wiki}</td>
                   <td style={{ padding: "14px 20px", fontSize: 13, color: "#4A9B8E", fontWeight: 700 }}>{u.revenu?.toLocaleString()} FCFA</td>
                 </tr>
               ))}
               {users.length === 0 && (
                 <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#6B6B8A" }}>Aucun utilisateur actif</td></tr>
               )}
             </tbody>
           </table>
         )}
       </div>
     </div>
   </div>
 );
}
