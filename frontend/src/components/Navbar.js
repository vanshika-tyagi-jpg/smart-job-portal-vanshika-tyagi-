import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: isActive(path) ? "#2563eb" : "#4b5563",
    fontWeight: isActive(path) ? "600" : "400",
    padding: "6px 10px",
    borderRadius: "6px",
    transition: "color 0.2s",
  });

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>
        <span style={{ fontSize: "22px" }}>🚀</span>
        <span style={styles.brandText}>Job Portal</span>
      </div>

      <div style={styles.links}>
        <Link to="/jobs" style={linkStyle("/jobs")}>Jobs</Link>
        <Link to="/dashboard" style={linkStyle("/dashboard")}>🌐 Global Jobs</Link>

        {isLoggedIn ? (
          <>
            <Link to="/applications" style={linkStyle("/applications")}>My Applications</Link>
            <span style={styles.userName}>👤 {user?.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle("/login")}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: "white",
    boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
    padding: "14px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  brandText: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#2563eb",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  userName: {
    color: "#374151",
    fontWeight: "500",
    padding: "6px 12px",
    backgroundColor: "#eff6ff",
    borderRadius: "20px",
    fontSize: "14px",
  },
  logoutBtn: {
    padding: "7px 16px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
  },
  registerBtn: {
    padding: "7px 16px",
    backgroundColor: "#2563eb",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "14px",
  },
};

export default Navbar;
