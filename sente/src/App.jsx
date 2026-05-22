import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

const CATEGORIES = [
  { label: "To the Office", emoji: "💼" },
  { label: "Date Night", emoji: "🌹" },
  { label: "To the Gym", emoji: "🏃" },
  { label: "Winter Evenings", emoji: "❄️" },
  { label: "Summer Days", emoji: "☀️" },
  { label: "Special Events", emoji: "✨" },
];

function App() {
  const [activeTab, setActiveTab] = useState("reviews");
  const [perfumes, setPerfumes] = useState([]);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const bg = darkMode ? "#0c0c0c" : "#d4edda";
  const surface = darkMode ? "#111" : "#c8e6ce";
  const border = darkMode ? "#1a1a1a" : "#b8d4bd";
  const text = darkMode ? "#e8dcc8" : "#1a3a2a";
  const sub = darkMode ? "#5a5a5a" : "#5a8a6a";
  const accent = "#2d6a4f";
  const sidebarBg = darkMode ? "#0a0a0a" : "#c8e6ce";

  useEffect(() => {
    async function fetchPerfumes() {
      const { data } = await supabase.from("perfumes").select("*");
      if (data) setPerfumes(data);
    }
    fetchPerfumes();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const searchResults = searchQuery.trim() === "" ? [] : perfumes.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.house?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8);

  return (
    <div style={{ background: bg, minHeight: "100vh", color: text, fontFamily: "'Playfair Display', 'Georgia', serif", display: "flex", transition: "all 0.3s" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #888; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{ width: "240px", minHeight: "100vh", borderRight: `1px solid ${border}`, padding: "40px 24px", display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0, background: sidebarBg }}>
        <h1 style={{ color: accent, fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: "2.5rem", fontFamily: "'DM Mono', monospace" }}>
          Sente
        </h1>
        {["reviews", "discover", "myself"].map(item => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            style={{
              background: activeTab === item ? accent : "none",
              border: "none",
              borderRadius: "8px",
              color: activeTab === item ? "#fff" : sub,
              cursor: "pointer",
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0.7rem 1rem",
              textAlign: "left",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "50px 60px", maxWidth: "1100px" }}>

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div>
            <div style={{ marginBottom: "3rem" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: sub, marginBottom: "0.5rem" }}>Community</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", fontWeight: 700, color: text, lineHeight: 1.1, marginBottom: "1rem" }}>
                What people<br /><em>are wearing.</em>
              </h2>
              <div style={{ background: border, height: "1px", width: "60px" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {perfumes.slice(0, 8).map((p, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/perfume/${p.id}`)}
                  style={{ background: surface, border: `1px solid ${border}`, borderRadius: "14px", padding: "1.2rem 1.5rem", display: "flex", gap: "1.5rem", alignItems: "center", cursor: "pointer" }}
                >
                  <div style={{ width: "70px", height: "85px", background: `linear-gradient(135deg, ${accent}, #52b788)`, borderRadius: "10px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>
                    {p.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: text, marginBottom: "0.2rem" }}>{p.name}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: sub, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>{p.house}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "0.85rem", color: sub }}>{p.notes}</div>
                  </div>
                  <div style={{ color: sub }}>→</div>
                </div>
              ))}
              {perfumes.length === 0 && <p style={{ color: sub, fontStyle: "italic" }}>Loading...</p>}
            </div>
          </div>
        )}

        {/* DISCOVER TAB */}
        {activeTab === "discover" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: sub, marginBottom: "0.5rem" }}>Explore</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", fontWeight: 700, color: text, lineHeight: 1.1, marginBottom: "1.5rem" }}>
                Discover<br /><em>fragrances.</em>
              </h2>

              {/* SEARCH BAR — only in discover */}
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search by name, house or notes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: "100%", background: surface, border: `1px solid ${border}`, borderRadius: "12px", padding: "1rem 1.2rem", color: text, fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", outline: "none" }}
                />

                {searchResults.length > 0 && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: surface, border: `1px solid ${border}`, borderRadius: "12px", marginTop: "0.5rem", zIndex: 100, overflow: "hidden" }}>
                    {searchResults.map((p, i) => (
                      <div
                        key={i}
                        onClick={() => { navigate(`/perfume/${p.id}`); setSearchQuery(""); }}
                        style={{ padding: "0.85rem 1.2rem", cursor: "pointer", display: "flex", gap: "1rem", alignItems: "center", borderBottom: i < searchResults.length - 1 ? `1px solid ${border}` : "none" }}
                      >
                        <span style={{ fontSize: "1.2rem" }}>{p.emoji}</span>
                        <div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", color: text }}>{p.name}</div>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: sub, textTransform: "uppercase", letterSpacing: "0.1em" }}>{p.house}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* NETFLIX STYLE CATEGORIES */}
            {CATEGORIES.map((cat, ci) => (
              <div key={ci} style={{ marginBottom: "2.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <span>{cat.emoji}</span>
                  <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: sub }}>{cat.label}</h3>
                </div>
                <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
                  {perfumes.slice(ci * 5, ci * 5 + 6).map((p, i) => (
                    <div
                      key={i}
                      onClick={() => navigate(`/perfume/${p.id}`)}
                      style={{ background: surface, border: `1px solid ${border}`, borderRadius: "14px", padding: "1rem", textAlign: "center", cursor: "pointer", flexShrink: 0, width: "160px" }}
                    >
                      <div style={{ width: "100%", height: "90px", background: `linear-gradient(135deg, ${accent}, #52b788)`, borderRadius: "10px", marginBottom: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
                        {p.emoji}
                      </div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.82rem", color: text, marginBottom: "0.2rem" }}>{p.name}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: sub, textTransform: "uppercase", letterSpacing: "0.08em" }}>{p.house}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MYSELF TAB */}
        {activeTab === "myself" && (
          <div>
            <div style={{ marginBottom: "3rem" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: sub, marginBottom: "0.5rem" }}>Personal</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", fontWeight: 700, color: text, lineHeight: 1.1 }}>
                My<br /><em>collection.</em>
              </h2>
            </div>

            {!user ? (
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "16px", padding: "3rem", maxWidth: "420px" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: sub, fontSize: "1rem", marginBottom: "0.5rem" }}>Sign in to track your collection.</p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: sub, letterSpacing: "0.08em", marginBottom: "2rem" }}>Save favourites · Write reviews · Build your profile</p>

                <button
                  onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
                  style={{ width: "100%", background: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "0.85rem", color: "#333", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", marginBottom: "1rem" }}
                >
                  Continue with Google
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1rem 0" }}>
                  <div style={{ flex: 1, height: "1px", background: border }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: sub }}>or</span>
                  <div style={{ flex: 1, height: "1px", background: border }} />
                </div>

                <input type="email" placeholder="Email" id="login-email"
                  style={{ width: "100%", background: bg, border: `1px solid ${border}`, borderRadius: "8px", padding: "0.85rem 1rem", color: text, fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", marginBottom: "0.75rem", outline: "none" }} />
                <input type="password" placeholder="Password" id="login-password"
                  style={{ width: "100%", background: bg, border: `1px solid ${border}`, borderRadius: "8px", padding: "0.85rem 1rem", color: text, fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", marginBottom: "1rem", outline: "none" }} />

                <button
                  onClick={async () => {
                    const email = document.getElementById("login-email").value;
                    const password = document.getElementById("login-password").value;
                    const { error } = await supabase.auth.signInWithPassword({ email, password });
                    if (error) alert(error.message);
                  }}
                  style={{ width: "100%", background: accent, border: "none", borderRadius: "8px", padding: "0.85rem", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", marginBottom: "0.75rem" }}
                >
                  Sign In
                </button>

                <button
                  onClick={async () => {
                    const email = document.getElementById("login-email").value;
                    const password = document.getElementById("login-password").value;
                    const { error } = await supabase.auth.signUp({ email, password });
                    if (error) alert(error.message);
                    else alert("Check your email to confirm!");
                  }}
                  style={{ width: "100%", background: "none", border: `1px solid ${border}`, borderRadius: "8px", padding: "0.85rem", color: sub, fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Create Account
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "600px" }}>
                <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "14px", padding: "1.2rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: sub, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Signed in as</p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: text }}>{user.email}</p>
                  </div>
                  <button onClick={() => supabase.auth.signOut()}
                    style={{ background: "none", border: `1px solid ${border}`, borderRadius: "8px", color: sub, cursor: "pointer", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.5rem 0.9rem", fontFamily: "'DM Mono', monospace" }}>
                    Sign Out
                  </button>
                </div>

                {[
                  { label: "Profile", sub: "Username and display name", icon: "◯" },
                  { label: "History", sub: "Your reviewed fragrances", icon: "◎" },
                  { label: "Appearance", sub: darkMode ? "Currently dark" : "Currently light", icon: "◑", action: () => setDarkMode(!darkMode) },
                  { label: "Subscription", sub: "Coming soon", icon: "◆" },
                ].map((item, i) => (
                  <div key={i} onClick={item.action}
                    style={{ background: surface, border: `1px solid ${border}`, borderRadius: "14px", padding: "1.2rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <span style={{ fontSize: "1.2rem", color: accent }}>{item.icon}</span>
                      <div>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: text, marginBottom: "0.15rem" }}>{item.label}</p>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: sub, letterSpacing: "0.05em" }}>{item.sub}</p>
                      </div>
                    </div>
                    <span style={{ color: sub }}>→</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;