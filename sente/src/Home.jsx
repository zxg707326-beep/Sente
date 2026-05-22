import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

function Dartboard({ size = 120 }) {
  const c = size / 2;
  const rings = [
    { r: size * 0.48, color: "#1a3a2a" },
    { r: size * 0.38, color: "#c8a96e" },
    { r: size * 0.28, color: "#1a3a2a" },
    { r: size * 0.18, color: "#c8a96e" },
    { r: size * 0.08, color: "#1a3a2a" },
  ];
  const lines = Array.from({ length: 20 }, (_, i) => i * 18);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((ring, i) => (
        <circle key={i} cx={c} cy={c} r={ring.r} fill={ring.color} stroke="#2d6a4f" strokeWidth="1" />
      ))}
      {lines.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={c}
            y1={c}
            x2={c + Math.cos(rad) * size * 0.48}
            y2={c + Math.sin(rad) * size * 0.48}
            stroke="#2d6a4f"
            strokeWidth="0.5"
            opacity="0.5"
          />
        );
      })}
      <circle cx={c} cy={c} r={size * 0.04} fill="#c8a96e" />
    </svg>
  );
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const bg = "#d4edda";
  const surface = "#c8e6ce";
  const border = "#b8d4bd";
  const text = "#1a3a2a";
  const sub = "#5a8a6a";
  const accent = "#2d6a4f";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleAuth = async () => {
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Check your email to confirm your account!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else setShowAuth(false);
    }
  };

  if (loading) return (
    <div style={{ background: bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: sub, fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", letterSpacing: "0.2em" }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ background: bg, minHeight: "100vh", fontFamily: "'Playfair Display', Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #888; }
      `}</style>

      {/* MAIN CONTENT */}
      <div style={{ textAlign: "center", maxWidth: "600px", width: "100%" }}>

        {/* DARTBOARD LOGO */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <Dartboard size={140} />
        </div>

        {/* NAME */}
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "5rem", fontWeight: 700, color: text, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "0.5rem" }}>
          Sente
        </h1>

        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: sub, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "3rem" }}>
          Find your signature trail
        </p>

        {/* TWO MAIN BUTTONS */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "4rem" }}>
          <button
            onClick={() => navigate("/app")}
            style={{ background: accent, border: "none", borderRadius: "12px", padding: "1rem 2.5rem", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}
          >
            Reviews
          </button>
          <button
            onClick={() => navigate("/app?tab=discover")}
            style={{ background: "none", border: `2px solid ${accent}`, borderRadius: "12px", padding: "1rem 2.5rem", color: accent, fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}
          >
            Discover
          </button>
        </div>

        {/* DIVIDER */}
        <div style={{ height: "1px", background: border, marginBottom: "2rem" }} />

        {/* USER SECTION */}
        {user ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1.1rem", color: sub }}>
              Welcome back,
            </p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: text, letterSpacing: "0.05em" }}>
              {user.email?.split("@")[0]}
            </p>
            <button
              onClick={() => supabase.auth.signOut()}
              style={{ background: "none", border: `1px solid ${border}`, borderRadius: "8px", padding: "0.5rem 1.2rem", color: sub, fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            {!showAuth ? (
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button
                  onClick={() => { setShowAuth(true); setIsSignUp(false); }}
                  style={{ background: "none", border: `1px solid ${border}`, borderRadius: "8px", padding: "0.7rem 1.5rem", color: sub, fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setShowAuth(true); setIsSignUp(true); }}
                  style={{ background: surface, border: `1px solid ${border}`, borderRadius: "8px", padding: "0.7rem 1.5rem", color: text, fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Create Account
                </button>
              </div>
            ) : (
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "16px", padding: "1.5rem", maxWidth: "360px", margin: "0 auto" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: text, marginBottom: "1.2rem" }}>
                  {isSignUp ? "Create Account" : "Sign In"}
                </p>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: "100%", background: bg, border: `1px solid ${border}`, borderRadius: "8px", padding: "0.8rem 1rem", color: text, fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", marginBottom: "0.75rem", outline: "none" }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAuth()}
                  style={{ width: "100%", background: bg, border: `1px solid ${border}`, borderRadius: "8px", padding: "0.8rem 1rem", color: text, fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", marginBottom: "1rem", outline: "none" }}
                />
                <button
                  onClick={handleAuth}
                  style={{ width: "100%", background: accent, border: "none", borderRadius: "8px", padding: "0.85rem", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", marginBottom: "0.75rem" }}
                >
                  {isSignUp ? "Create Account" : "Sign In"}
                </button>
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  style={{ width: "100%", background: "none", border: "none", color: sub, fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", marginBottom: "0.5rem" }}
                >
                  {isSignUp ? "Already have an account? Sign in" : "New here? Create account"}
                </button>
                <button
                  onClick={() => setShowAuth(false)}
                  style={{ width: "100%", background: "none", border: "none", color: sub, fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}