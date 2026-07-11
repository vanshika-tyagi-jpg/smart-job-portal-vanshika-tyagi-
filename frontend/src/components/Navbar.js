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

  const linkClass = (path) =>
    `px-3 py-1.5 rounded-md text-sm transition-colors ${
      isActive(path)
        ? "text-teal font-semibold border-b-2 border-teal"
        : "text-slate font-normal hover:text-ink"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-line px-8 py-3.5 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-2xl leading-none">🚀</span>
        <span className="font-display font-bold text-xl text-ink">Job Portal</span>
      </div>

      <div className="flex items-center gap-2">
        <Link to="/jobs" className={linkClass("/jobs")}>
          Jobs
        </Link>
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          🌐 Global Jobs
        </Link>

        {isLoggedIn ? (
          <>
            <Link to="/applications" className={linkClass("/applications")}>
              My Applications
            </Link>
            <span className="font-mono text-xs text-teal-dark bg-teal-light px-3 py-1.5 rounded-full">
              👤 {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={linkClass("/login")}>
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 bg-amber text-amber-dark font-semibold text-sm rounded-md hover:bg-amber-dark hover:text-amber-light transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;