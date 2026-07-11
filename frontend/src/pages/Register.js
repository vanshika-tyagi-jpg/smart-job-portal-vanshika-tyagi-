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
    <div className="min-h-screen flex justify-center items-center bg-paper font-body px-5 py-6">
      <form
        onSubmit={handleRegister}
        className="bg-white w-[400px] rounded-2xl shadow-sm border border-line overflow-hidden"
      >
        {/* Ticket-stub top strip */}
        <div className="bg-ink px-10 pt-7 pb-5 text-center border-b-2 border-dashed border-amber">
          <div className="text-4xl mb-2">✨</div>
          <h2 className="font-display font-bold text-xl text-white">Create account</h2>
          <p className="text-amber-light/80 text-xs font-mono mt-1 uppercase tracking-wider">
            Join the job portal today
          </p>
        </div>

        <div className="p-8 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-3.5 py-2.5 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 px-3.5 py-2.5 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-ink/80 text-sm font-medium">Full name</label>
            <input
              id="reg-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3.5 py-3 rounded-lg border border-line text-[15px] outline-none focus:border-teal focus:ring-2 focus:ring-teal-light transition-shadow"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-ink/80 text-sm font-medium">Email</label>
            <input
              id="reg-email"
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
              id="reg-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3.5 py-3 rounded-lg border border-line text-[15px] outline-none focus:border-teal focus:ring-2 focus:ring-teal-light transition-shadow"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-ink/80 text-sm font-medium">I am a...</label>
            <div className="flex gap-3">
              <button
                type="button"
                id="role-student"
                onClick={() => setRole("student")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                  role === "student"
                    ? "border-teal bg-teal-light text-teal-dark"
                    : "border-line bg-white text-slate"
                }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                id="role-recruiter"
                onClick={() => setRole("recruiter")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                  role === "recruiter"
                    ? "border-amber bg-amber-light text-amber-dark"
                    : "border-line bg-white text-slate"
                }`}
              >
                🏢 Recruiter
              </button>
            </div>
          </div>

          <button
            id="reg-submit"
            type="submit"
            disabled={loading}
            className="mt-1 py-3.5 bg-teal text-white rounded-lg font-semibold text-base hover:bg-teal-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-slate">
            Already have an account?{" "}
            <Link to="/login" className="text-teal font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;