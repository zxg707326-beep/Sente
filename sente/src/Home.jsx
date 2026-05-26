import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

function Dartboard({ size = 140, accent, dark }) {
  const c = size / 2;
  const segments = 20;
  const colors = [dark ? "#1a3a2a" : "#2d6a4f", accent];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {Array.from({ length: segments }).map((_, i) => {
        const angle = (360 / segments) * i;
        const rad1 = ((angle - 9) * Math.PI) / 180;
        const rad2 = ((angle + 9) * Math.PI) / 180;
        const r = size * 0.47;
        const x1 = c + Math.cos(rad1) * r;
        const y1 = c + Math.sin(rad1) * r;
        const x2 = c + Math.cos(rad2) * r;
        const y2 = c + Math.sin(rad2) * r;
        return (
          <path
            key={i}
            d={`M ${c} ${c} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
            fill={colors[i % 2]}
            stroke={dark ? "#0c0c0c" : "#d4edda"}
            strokeWidth="1"
          />
        );
      })}
      {[0.38, 0.28, 0.18, 0.08].map((ratio, i) => (
        <circle
          key={i}
          cx={c} cy={c}
          r={size * ratio}
          fill={i % 2 === 0 ? (dark ? "#0c0c0c" : "#b8d4bd") : accent}
          stroke={dark ? "#0c0c0c" : "#d4edda"}
          strokeWidth="1"
        />
      ))}
      <circle cx={c} cy={c} r={size * 0.04} fill={accent} />
    </svg>
  );
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [sent, setSent] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const bg = darkMode ? "#0c0c0c" : "#d4edda";
  const surface = darkMode ? "#111" : "#c8e6ce";
  const border = darkMode ? "#1e1e1e" : "#b8d4bd";
  const text = darkMode ? "#e8dcc8" : "#1a3a2a";
  const sub = darkMode ? "#5a5a5a" : "#5a8a6a";
  const accent = "#c8a96e";
  const green = "#2d6a4f";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleMagicLink = async () => {
    if (!email.trim()) { alert("Please enter your email."); return; }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/app",
      }
    });
    if (error) alert(error.message);
    else setSent(true);
  };

  if (loading) return (
    <div style={{ background: bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: sub, fontFamily: "Georgia, serif", fontSize: "0.8rem" }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ background: bg, minHeight: "100vh", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", transition: "all 0.3s" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,400&family=DM+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #888; }
      `}</style>

      {/* DARK MODE TOGGLE */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{ position: "fixed", top: "20px", right: "20px", background: surface, border: `1px solid ${border}`, borderRadius: "8px", padding: "0.5rem 1rem", color: sub, fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}
      >
        {darkMode ? "Light" : "Dark"}
      </button>

      <div style={{ textAlign: "center", maxWidth: "500px", width: "100%" }}>

        {/* DARTBOARD */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <Dartboard size={130} accent={accent} dark={darkMode} />
        </div>

        {/* NAME */}
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "5.5rem", fontWeight: 700, color: text, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "0.3rem" }}>
          Sente
        </h1>

        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: sub, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "3rem" }}>
          Find your signature trail
        </p>

        {/* TWO MAIN BUTTONS */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "3.5rem", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/app")}
            style={{ background: green, border: "none", borderRadius: "12px", padding: "1rem 2.5rem", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Reviews
          </button>
          <button
            onClick={() => navigate("/app?tab=discover")}
            style={{ background: accent, border: "none", borderRadius: "12px", padding: "1rem 2.5rem", color: "#0c0c0c", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Discover
          </button>
        </div>

        <div style={{ height: "1px", background: border, marginBottom: "2.5rem" }} />

        {/* USER SECTION */}
        {user ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.1rem", color: sub }}>
              Welcome back,
            </p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: text, letterSpacing: "0.05em" }}>
              {user.email?.split("@")[0]}
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => navigate("/app")}
                style={{ background: green, border: "none", borderRadius: "8px", padding: "0.6rem 1.5rem", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
              >
                Enter App
              </button>
              <button
                onClick={() => supabase.auth.signOut()}
                style={{ background: "none", border: `1px solid ${border}`, borderRadius: "8px", padding: "0.6rem 1.2rem", color: sub, fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div>
            {!showAuth ? (
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button
                  onClick={() => setShowAuth(true)}
                  style={{ background: "none", border: `1px solid ${border}`, borderRadius: "8px", padding: "0.75rem 1.8rem", color: sub, fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowAuth(true)}
                  style={{ background: surface, border: `1px solid ${border}`, borderRadius: "8px", padding: "0.75rem 1.8rem", color: text, fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Create Account
                </button>
              </div>
            ) : sent ? (
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "16px", padding: "2rem", textAlign: "center" }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 700, color: text, marginBottom: "0.5rem" }}>Check your email</p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: sub, letterSpacing: "0.08em", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  We sent a magic link to<br /><strong style={{ color: text }}>{email}</strong><br />Click it to sign in instantly.
                </p>
                <button
                  onClick={() => { setSent(false); setEmail(""); }}
                  style={{ background: "none", border: `1px solid ${border}`, borderRadius: "8px", padding: "0.6rem 1.2rem", color: sub, fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Use different email
                </button>
              </div>
            ) : (
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "16px", padding: "1.5rem", maxWidth: "360px", margin: "0 auto" }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 700, color: text, marginBottom: "0.3rem" }}>
                  Welcome.
                </p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: sub, letterSpacing: "0.08em", marginBottom: "1.2rem" }}>
                  Enter your email — we'll send you a magic link. No password needed.
                </p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleMagicLink()}
                  style={{ width: "100%", background: bg, border: `1px solid ${border}`, borderRadius: "8px", padding: "0.85rem 1rem", color: text, fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", marginBottom: "0.75rem", outline: "none" }}
                />
                <button
                  onClick={handleMagicLink}
                  style={{ width: "100%", background: green, border: "none", borderRadius: "8px", padding: "0.9rem", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", marginBottom: "0.75rem" }}
                >
                  Send Magic Link
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