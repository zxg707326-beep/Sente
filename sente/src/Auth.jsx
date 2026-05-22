import { useState } from "react";
import { supabase } from "./supabase";

function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setError("Check your email to confirm signup!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else onLogin();
    }
  };

  return (
    <div style={{ background: "#0c0c0c", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
      <div style={{ width: "360px", padding: "2.5rem", background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px" }}>
        <h1 style={{ color: "#c8a96e", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: "2rem" }}>Sente</h1>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 300, color: "#f0e8d8", marginBottom: "2rem" }}>
          {isSignUp ? "Join the trail." : "Welcome back."}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", background: "#0c0c0c", border: "1px solid #1e1e1e", borderRadius: "8px", padding: "0.8rem 1rem", color: "#e8dcc8", fontFamily: "Georgia, serif", fontSize: "0.85rem", marginBottom: "0.75rem", outline: "none", boxSizing: "border-box" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", background: "#0c0c0c", border: "1px solid #1e1e1e", borderRadius: "8px", padding: "0.8rem 1rem", color: "#e8dcc8", fontFamily: "Georgia, serif", fontSize: "0.85rem", marginBottom: "1rem", outline: "none", boxSizing: "border-box" }}
        />

        {error && <p style={{ color: "#c86e6e", fontSize: "0.75rem", marginBottom: "1rem" }}>{error}</p>}

        <button
          onClick={handleSubmit}
          style={{ width: "100%", background: "#c8a96e", border: "none", borderRadius: "8px", padding: "0.9rem", color: "#0c0c0c", fontFamily: "Georgia, serif", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", marginBottom: "1rem" }}
        >
          {isSignUp ? "Create Account" : "Sign In"}
        </button>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ width: "100%", background: "none", border: "1px solid #1e1e1e", borderRadius: "8px", padding: "0.9rem", color: "#555", fontFamily: "Georgia, serif", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
        >
          {isSignUp ? "Already have an account? Sign in" : "New here? Create account"}
        </button>
      </div>
    </div>
  );
}

export default Auth;