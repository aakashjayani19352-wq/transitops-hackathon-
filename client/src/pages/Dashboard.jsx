import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const KPI = [
  {
    key: "activeVehicles",
    label: "Active Vehicles",
    icon: "🚛",
    color: "#4f8ef7",
  },
  {
    key: "availableVehicles",
    label: "Available Vehicles",
    icon: "✅",
    color: "#22c55e",
  },
  {
    key: "vehiclesInMaintenance",
    label: "In Maintenance",
    icon: "🔧",
    color: "#f59e0b",
  },
  { key: "activeTrips", label: "Active Trips", icon: "🗺️", color: "#4f8ef7" },
  { key: "pendingTrips", label: "Pending Trips", icon: "⏳", color: "#8b5cf6" },
  {
    key: "driversOnDuty",
    label: "Drivers On Duty",
    icon: "👤",
    color: "#22c55e",
  },
];

export default function Dashboard() {
  const { auth } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Expose token for axios interceptor
    window.__transitops_token__ = auth.token;
    api
      .get("/dashboard")
      .then(({ data }) => setStats(data))
      .catch((err) =>
        setError(
          err.response?.data?.message || "Failed to load dashboard data.",
        ),
      )
      .finally(() => setLoading(false));
  }, [auth.token]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your fleet operations</p>
        </div>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {loading ? (
        <div className="loader">
          <div className="spinner"></div> Loading dashboard…
        </div>
      ) : (
        <div className="kpi-grid">
          {KPI.map(({ key, label, icon }) => (
            <div className="kpi-card" key={key}>
              <div className="kpi-icon">{icon}</div>
              <div className="kpi-value">{stats?.[key] ?? "—"}</div>
              <div className="kpi-label">{label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <div className="table-wrap">
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border)",
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            ℹ️ Use the sidebar to navigate to Vehicles, Drivers, and Trips
            management.
          </div>
        </div>
      </div>
    </div>
  );
}
