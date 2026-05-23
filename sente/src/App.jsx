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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  const bg = darkMode ? "#0c0c0c" : "#d4edda";
  const surface = darkMode ? "#111" : "#c8e6ce";
  const border = darkMode ? "#1a1a1a" : "#b8d4bd";
  const text = darkMode ? "#e8dcc8" : "#1a3a2a";
  const sub = darkMode ? "#5a5a5a" : "#5a8a6a";
  const accent = "#2d6a4f";
  const gold = "#c8a96e";

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

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const searchResults = searchQuery.trim() === "" ? [] : perfumes.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.house?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8);

  const navItems = [
    { id: "reviews", label: "Reviews", icon: "◎" },
    { id: "discover", label: "Discover", icon: "⊕" },
    { id: "myself", label: "Myself", icon: "◯" },
  ];

  return (
    <div style={{ background: bg, minHeight: "100vh", color: text, fontFamily: "'Cormorant Garamond', Georgia, serif", display: "flex", flexDirection: isMobile ? "column" : "row", transition: "all 0.3s" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,400&family=DM+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #888; }
        textarea::placeholder { color: #888; }
      `}</style>

      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <div style={{ width: "220px", minHeight: "100vh", borderRight: `1px solid ${border}`, padding: "40px 20px", display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0, background: darkMode ? "#0a0a0a" : "#c8e6ce" }}>
          <h1
            onClick={() => navigate("/")}
            style={{ color: gold, fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: "2.5rem", fontFamily: "'DM Mono', monospace", cursor: "pointer" }}
          >
            Sente
          </h1>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                background: activeTab === item.id ? accent : "none",
                border: "none",
                borderRadius: "8px",
                color: activeTab === item.id ? "#fff" : sub,
                cursor: "pointer",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "0.7rem 1rem",
                textAlign: "left",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {item.label}
            </button>
          ))}
          <div style={{ marginTop: "auto" }}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{ background: "none", border: `1px solid ${border}`, borderRadius: "8px", padding: "0.5rem 0.8rem", color: sub, fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", width: "100%" }}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      )}

      {/* MOBILE TOP BAR */}
      {isMobile && (
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: darkMode ? "#0a0a0a" : "#c8e6ce", flexShrink: 0 }}>
          <h1
            onClick={() => navigate("/")}
            style={{ color: gold, fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", cursor: "pointer" }}
          >
            Sente
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{ background: "none", border: `1px solid ${border}`, borderRadius: "6px", padding: "0.4rem 0.8rem", color: sub, fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: isMobile ? "24px 16px 90px" : "50px 60px", overflowY: "auto", maxWidth: isMobile ? "100%" : "1000px" }}>

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: sub, marginBottom: "0.4rem" }}>Community</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "2.2rem" : "3rem", fontWeight: 700, color: text, lineHeight: 1.1, marginBottom: "0.8rem" }}>
                What people<br /><em>are wearing.</em>
              </h2>
              <div style={{ background: border, height: "1px", width: "50px" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {perfumes.slice(0, 10).map((p, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/perfume/${p.id}`)}
                  style={{ background: surface, border: `1px solid ${border}`, borderRadius: "14px", padding: "1rem 1.2rem", display: "flex", gap: "1rem", alignItems: "center", cursor: "pointer" }}
                >
                  <div style={{ width: "60px", height: "75px", background: `linear-gradient(135deg, ${accent}, #52b788)`, borderRadius: "10px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                    {p.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 700, color: text, marginBottom: "0.15rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: sub, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>{p.house}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "0.8rem", color: sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.notes}</div>
                  </div>
                  <div style={{ color: sub, flexShrink: 0 }}>→</div>
                </div>
              ))}
              {perfumes.length === 0 && <p style={{ color: sub, fontStyle: "italic" }}>Loading...</p>}
            </div>
          </div>
        )}

        {/* DISCOVER TAB */}
        {activeTab === "discover" && (
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: sub, marginBottom: "0.4rem" }}>Explore</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "2.2rem" : "3rem", fontWeight: 700, color: text, lineHeight: 1.1, marginBottom: "1.2rem" }}>
                Discover<br /><em>fragrances.</em>
              </h2>

              <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                <input
                  type="text"
                  placeholder="Search by name, house or notes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: "100%", background: surface, border: `1px solid ${border}`, borderRadius: "12px", padding: "0.9rem 1.1rem", color: text, fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", outline: "none" }}
                />
                {searchResults.length > 0 && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: surface, border: `1px solid ${border}`, borderRadius: "12px", marginTop: "0.5rem", zIndex: 100, overflow: "hidden" }}>
                    {searchResults.map((p, i) => (
                      <div
                        key={i}
                        onClick={() => { navigate(`/perfume/${p.id}`); setSearchQuery(""); }}
                        style={{ padding: "0.8rem 1.1rem", cursor: "pointer", display: "flex", gap: "0.8rem", alignItems: "center", borderBottom: i < searchResults.length - 1 ? `1px solid ${border}` : "none" }}
                      >
                        <span style={{ fontSize: "1rem" }}>{p.emoji}</span>
                        <div>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontWeight: 700, color: text }}>{p.name}</div>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: sub, textTransform: "uppercase", letterSpacing: "0.1em" }}>{p.house}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {CATEGORIES.map((cat, ci) => (
              <div key={ci} style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: sub }}>{cat.label}</h3>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem", scrollbarWidth: "none" }}>
                  {perfumes.slice(ci * 5, ci * 5 + 6).map((p, i) => (
                    <div
                      key={i}
                      onClick={() => navigate(`/perfume/${p.id}`)}
                      style={{ background: surface, border: `1px solid ${border}`, borderRadius: "12px", padding: "0.8rem", textAlign: "center", cursor: "pointer", flexShrink: 0, width: isMobile ? "130px" : "160px" }}
                    >
                      <div style={{ width: "100%", height: isMobile ? "80px" : "90px", background: `linear-gradient(135deg, ${accent}, #52b788)`, borderRadius: "8px", marginBottom: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>
                        {p.emoji}
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.82rem", fontWeight: 700, color: text, marginBottom: "0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", color: sub, textTransform: "uppercase", letterSpacing: "0.08em" }}>{p.house}</div>
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
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: sub, marginBottom: "0.4rem" }}>Personal</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "2.2rem" : "3rem", fontWeight: 700, color: text, lineHeight: 1.1 }}>
                My<br /><em>collection.</em>
              </h2>
            </div>

            {!user ? (
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "16px", padding: "2rem", textAlign: "center" }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: sub, fontSize: "1rem", marginBottom: "0.5rem" }}>Sign in to track your collection.</p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: sub, letterSpacing: "0.08em", marginBottom: "1.5rem" }}>Save favourites · Write reviews · Build your profile</p>
                <button
                  onClick={() => navigate("/")}
                  style={{ background: accent, border: "none", borderRadius: "8px", padding: "0.8rem 2rem", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "14px", padding: "1rem 1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: sub, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>Signed in as</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 700, color: text }}>{user.email?.split("@")[0]}</p>
                  </div>
                  <button
                    onClick={() => supabase.auth.signOut()}
                    style={{ background: "none", border: `1px solid ${border}`, borderRadius: "8px", color: sub, cursor: "pointer", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.5rem 0.8rem", fontFamily: "'DM Mono', monospace" }}
                  >
                    Sign Out
                  </button>
                </div>

                {[
                  { label: "Profile", sub: "Username and display name", icon: "◯" },
                  { label: "History", sub: "Your reviewed fragrances", icon: "◎" },
                  { label: "Appearance", sub: darkMode ? "Currently dark" : "Currently light", icon: "◑", action: () => setDarkMode(!darkMode) },
                  { label: "Subscription", sub: "Coming soon", icon: "◆" },
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={item.action}
                    style={{ background: surface, border: `1px solid ${border}`, borderRadius: "14px", padding: "1rem 1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                      <span style={{ fontSize: "1rem", color: accent }}>{item.icon}</span>
                      <div>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 700, color: text, marginBottom: "0.1rem" }}>{item.label}</p>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: sub, letterSpacing: "0.05em" }}>{item.sub}</p>
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

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: darkMode ? "#0a0a0a" : "#c8e6ce", borderTop: `1px solid ${border}`, display: "flex", justifyContent: "space-around", padding: "12px 0 20px", zIndex: 50 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer", padding: "0 16px" }}
            >
              <span style={{ fontSize: "1.1rem", color: activeTab === item.id ? accent : sub }}>{item.icon}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase", color: activeTab === item.id ? accent : sub }}>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;