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
      login(res.data.token, res.data.user);
      navigate("/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-paper font-body px-5">
      <form
        onSubmit={handleLogin}
        className="bg-white w-[380px] rounded-2xl shadow-sm border border-line overflow-hidden"
      >
        {/* Ticket-stub top strip */}
        <div className="bg-ink px-10 pt-7 pb-5 text-center border-b-2 border-dashed border-teal">
          <div className="text-4xl mb-2">🔐</div>
          <h2 className="font-display font-bold text-xl text-white">Welcome back</h2>
          <p className="text-teal-light/70 text-xs font-mono mt-1 uppercase tracking-wider">
            Sign in to continue
          </p>
        </div>

        <div className="p-8 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-3.5 py-2.5 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-ink/80 text-sm font-medium">Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3.5 py-3 rounded-lg border border-line text-[15px] outline-none focus:border-teal focus:ring-2 focus:ring-teal-light transition-shadow"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-ink/80 text-sm font-medium">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3.5 py-3 rounded-lg border border-line text-[15px] outline-none focus:border-teal focus:ring-2 focus:ring-teal-light transition-shadow"
              required
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="mt-1 py-3.5 bg-teal text-white rounded-lg font-semibold text-base hover:bg-teal-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-sm text-slate">
            Don't have an account?{" "}
            <Link to="/register" className="text-teal font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;