import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/vehicles", label: "Vehicles", icon: "🚛" },
  { to: "/drivers", label: "Drivers", icon: "👤" },
  { to: "/trips", label: "Trips", icon: "🗺️" },
];

export default function Sidebar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>TransitOps</h2>
        <span>Fleet Management Platform</span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {auth.user && (
          <div className="sidebar-user">
            <strong>{auth.user.name}</strong>
            {auth.user.role}
          </div>
        )}
        <button className="nav-link" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
