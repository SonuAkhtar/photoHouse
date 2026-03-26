import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/api";
import "../Login/Login.css";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { data } = await registerUser(name.trim(), email, password);
      login(data.token, data.user);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 2.5 L22 10 L22 22 L2 22 L2 10 Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <line
              x1="2"
              y1="10"
              x2="22"
              y2="10"
              stroke="currentColor"
              strokeWidth="0.9"
            />
            <circle
              cx="12"
              cy="16.5"
              r="4.8"
              stroke="currentColor"
              strokeWidth="1.1"
            />
            <circle
              cx="12"
              cy="16.5"
              r="2.2"
              stroke="currentColor"
              strokeWidth="0.9"
            />
            <circle cx="12" cy="16.5" r="0.7" fill="currentColor" />
            <line
              x1="13.56"
              y1="14.94"
              x2="14.97"
              y2="13.53"
              stroke="currentColor"
              strokeWidth="0.85"
            />
            <line
              x1="13.56"
              y1="18.06"
              x2="14.97"
              y2="19.47"
              stroke="currentColor"
              strokeWidth="0.85"
            />
            <line
              x1="10.44"
              y1="18.06"
              x2="9.03"
              y2="19.47"
              stroke="currentColor"
              strokeWidth="0.85"
            />
            <line
              x1="10.44"
              y1="14.94"
              x2="9.03"
              y2="13.53"
              stroke="currentColor"
              strokeWidth="0.85"
            />
          </svg>
          <span className="auth-brand-name">
            Photo<span>house</span>
          </span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Start your journal</h1>
          <p className="auth-subtitle">
            Create a free account to store your travel memories
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-name">
              Full name
            </label>
            <input
              id="signup-name"
              className="auth-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              autoComplete="name"
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-password">
              Password <span className="signup-hint">(min 6 characters)</span>
            </label>
            <input
              id="signup-password"
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" className="auth-switch-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
