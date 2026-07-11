import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      // Store token + user in context (and localStorage)
      login(res.data.token, res.data.user);
      navigate("/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleLogin}>
        <div style={styles.iconWrap}>🔐</div>
        <h2 style={styles.heading}>Welcome Back</h2>
        <p style={styles.subheading}>Sign in to your account</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <button id="login-submit" type="submit" style={styles.button} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p style={styles.switchText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.switchLink}>Register here</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
  },
  form: {
    background: "white",
    padding: "44px 40px",
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
    width: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  iconWrap: {
    fontSize: "36px",
    textAlign: "center",
  },
  heading: {
    textAlign: "center",
    color: "#1e3a8a",
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
  },
  subheading: {
    textAlign: "center",
    color: "#6b7280",
    margin: 0,
    fontSize: "14px",
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    color: "#374151",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1.5px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    transition: "border 0.2s",
  },
  button: {
    padding: "13px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "4px",
  },
  switchText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  switchLink: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default Login;
