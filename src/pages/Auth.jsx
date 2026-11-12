import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");
const API_URL = `${API_BASE_URL}/api/auth`;

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const isRegister = location.pathname === "/register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (isRegister && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegister ? "register" : "login";

      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(isRegister ? { name: name.trim() } : {}),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      if (isRegister) {
        setSuccess("Registration successful! Please log in.");
        navigate("/login", {
          replace: true,
          state: { registered: true },
        });
        return;
      }

      if (!data.token || !data.user) {
        throw new Error("The server returned an invalid login response.");
      }

      login(data);

      // A successful login starts a fresh account-specific session.
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect. Check whether your server is running.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">R</span>
          Resume Builder
        </Link>

        <div className="auth-heading">
          <p className="auth-eyebrow">
            {isRegister ? "GET STARTED" : "WELCOME BACK"}
          </p>

          <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>

          <p>
            {isRegister
              ? "Create professional resumes and manage them in one place."
              : "Log in to continue working on your resumes."}
          </p>
        </div>

        {location.state?.registered && !isRegister && (
          <div className="auth-success">
            Account created successfully. You can now log in.
          </div>
        )}

        {error && <div className="auth-error">{error}</div>}

        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <label>
              Full name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                maxLength={80}
                autoComplete="name"
                required
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <div className="auth-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                maxLength={72}
                autoComplete={isRegister ? "new-password" : "current-password"}
                required
              />

              <button
                type="button"
                className="auth-show-password"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account"
                : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>

        <p className="auth-footer">Your career journey starts here.</p>
      </section>
    </main>
  );
}
