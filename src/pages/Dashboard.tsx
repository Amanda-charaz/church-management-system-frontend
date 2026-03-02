import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [verse, setVerse] = useState<any>(null);
  const [stats, setStats] = useState({
    members: 0,
    visitors: 0,
    balance: 0,
    announcements: 0,
  });

  // ✅ Fetch Daily Verse
  const fetchVerse = useCallback(async () => {
    try {
      const res = await API.get("/verse");
      setVerse(res.data.verse);
    } catch (err) {
      console.error("Verse error:", err);
    }
  }, []);

  // ✅ Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const [membersRes, visitorsRes, announcementsRes] =
        await Promise.all([
          API.get("/members"),
          API.get("/visitors"),
          API.get("/announcements"),
        ]);

      setStats((prev) => ({
        ...prev,
        members: membersRes.data.members.length,
        visitors: visitorsRes.data.visitors.length,
        announcements: announcementsRes.data.announcements.length,
      }));

      if (user?.role === "ADMIN" || user?.role === "FINANCE") {
        const financeRes = await API.get("/finances");

        setStats((prev) => ({
          ...prev,
          balance: financeRes.data.summary.balance,
        }));
      }
    } catch (err) {
      console.error("Stats error:", err);
    }
  }, [user]);

  // ✅ Run On Mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
    fetchVerse();
    fetchStats();
  }, [fetchVerse, fetchStats]);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div style={{ display: "flex", fontFamily: "Arial, sans-serif" }}>
      <Sidebar />
      <div
        style={{
          marginLeft: "240px",
          flex: 1,
          background: "#f0f4f8",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "white",
            padding: "16px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "24px", color: "#1a2a4a" }}>
              Dashboard
            </h1>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              Overview of church activities
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#1a2a4a", fontWeight: "bold" }}>
              {dateStr}
            </div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>
              {timeStr}
            </div>
          </div>
        </div>

        <div style={{ padding: "32px" }}>
          {/* Daily Verse */}
          {verse && (
            <div
              style={{
                background:
                  "linear-gradient(135deg, #1a2a4a, #2d4a7a)",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "32px",
                color: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <span style={{ fontSize: "28px" }}>📖</span>
                <span
                  style={{
                    color: "#f0a500",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  Daily Verse
                </span>
              </div>
              <p
                style={{
                  fontSize: "16px",
                  fontStyle: "italic",
                  margin: "0 0 8px",
                }}
              >
                "{verse.text}"
              </p>
              <p style={{ color: "#f0a500", margin: 0 }}>
                — {verse.reference}
              </p>
            </div>
          )}

          {/* Welcome */}
          <h2 style={{ color: "#1a2a4a", marginBottom: "24px" }}>
            Welcome back, {user?.name}! Here's your church overview.
          </h2>

          {/* Stats Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
            {(user?.role === "ADMIN" ||
              user?.role === "PASTOR") && (
              <>
                <StatCard
                  icon="👥"
                  value={stats.members}
                  label="Total Members"
                />
                <StatCard
                  icon="🙋"
                  value={stats.visitors}
                  label="Total Visitors"
                />
              </>
            )}

            {(user?.role === "ADMIN" ||
              user?.role === "FINANCE") && (
              <StatCard
                icon="💰"
                value={`$${stats.balance}`}
                label="Current Balance"
              />
            )}

            <StatCard
              icon="📢"
              value={stats.announcements}
              label="Announcements"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// 🔥 Reusable Card Component
const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: string;
  value: any;
  label: string;
}) => (
  <div
    style={{
      background: "white",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    }}
  >
    <div style={{ fontSize: "32px", marginBottom: "8px" }}>
      {icon}
    </div>
    <div
      style={{
        fontSize: "32px",
        fontWeight: "bold",
        color: "#1a2a4a",
      }}
    >
      {value}
    </div>
    <div style={{ color: "#6b7280" }}>{label}</div>
  </div>
);

export default Dashboard;
