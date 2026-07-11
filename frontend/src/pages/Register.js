import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerUser({ name, email, password, role });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleRegister}>
        <div style={styles.iconWrap}>✨</div>
        <h2 style={styles.heading}>Create Account</h2>
        <p style={styles.subheading}>Join the Job Portal today</p>

        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            id="reg-name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email</label>
          <input
            id="reg-email"
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
            id="reg-password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>I am a...</label>
          <div style={styles.roleSelector}>
            <button
              type="button"
              id="role-student"
              onClick={() => setRole("student")}
              style={{
                ...styles.roleBtn,
                ...(role === "student" ? styles.roleBtnActive : {}),
              }}
            >
              🎓 Student
            </button>
            <button
              type="button"
              id="role-recruiter"
              onClick={() => setRole("recruiter")}
              style={{
                ...styles.roleBtn,
                ...(role === "recruiter" ? styles.roleBtnActive : {}),
              }}
            >
              🏢 Recruiter
            </button>
          </div>
        </div>

        <button id="reg-submit" type="submit" style={styles.button} disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.switchLink}>Sign in</Link>
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
    padding: "20px",
  },
  form: {
    background: "white",
    padding: "44px 40px",
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
    width: "400px",
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
  successBox: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
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
  },
  roleSelector: {
    display: "flex",
    gap: "12px",
  },
  roleBtn: {
    flex: 1,
    padding: "10px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#6b7280",
    transition: "all 0.2s",
  },
  roleBtnActive: {
    border: "2px solid #2563eb",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
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

export default Register;
