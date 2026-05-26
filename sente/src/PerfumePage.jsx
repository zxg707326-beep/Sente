import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function StarRating({ value, onChange, readonly }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{
            fontSize: readonly ? "1rem" : "2rem",
            cursor: readonly ? "default" : "pointer",
            color: star <= (hover || value) ? "#2d6a4f" : "#b8d4bd",
            transition: "color 0.15s",
            userSelect: "none",
          }}
        >★</span>
      ))}
    </div>
  );
}

const COLLECTIONS = [
  { key: "collection", label: "My Collection", icon: "◯" },
  { key: "top5", label: "Top 5", icon: "★" },
  { key: "wishlist", label: "Wish List", icon: "♡" },
  { key: "reviewed", label: "Used & Reviewed", icon: "✓" },
];

export default function PerfumePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [perfume, setPerfume] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const [savedCollections, setSavedCollections] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  const bg = "#d4edda";
  const surface = "#c8e6ce";
  const border = "#b8d4bd";
  const text = "#1a3a2a";
  const sub = "#5a8a6a";
  const accent = "#2d6a4f";

  useEffect(() => {
    async function load() {
      const { data: p } = await supabase.from("perfumes").select("*").eq("id", id).single();
      if (p) setPerfume(p);

      const { data: r } = await supabase.from("reviews").select("*").eq("perfume_id", id).order("created_at", { ascending: false });
      if (r) {
        setReviews(r);
        if (r.length > 0) {
          const avg = r.reduce((sum, rev) => sum + rev.rating, 0) / r.length;
          setAvgRating(Math.round(avg * 10) / 10);
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: cols } = await supabase.from("user_collections").select("collection_type").eq("user_id", session.user.id).eq("perfume_id", id);
        if (cols) setSavedCollections(cols.map(c => c.collection_type));
      }
    }
    load();
  }, [id]);

  const submitReview = async () => {
    if (!user) { alert("Please sign in to write a review."); return; }
    if (rating === 0) { alert("Please select a star rating."); return; }
    if (!comment.trim()) { alert("Please write a comment."); return; }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      perfume_id: id,
      user_id: user.id,
      user_email: user.email,
      rating,
      comment: comment.trim(),
    });
    if (error) alert(error.message);
    else {
      const newReview = { perfume_id: id, user_id: user.id, user_email: user.email, rating, comment: comment.trim(), created_at: new Date().toISOString() };
      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);
      const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
      setAvgRating(Math.round(avg * 10) / 10);
      setRating(0);
      setComment("");
    }
    setSubmitting(false);
  };

  const toggleCollection = async (type) => {
    if (!user) { alert("Please sign in to save to collection."); return; }
    const isIn = savedCollections.includes(type);
    if (isIn) {
      await supabase.from("user_collections").delete().eq("user_id", user.id).eq("perfume_id", id).eq("collection_type", type);
      setSavedCollections(savedCollections.filter(c => c !== type));
    } else {
      if (type === "top5") {
        const { data } = await supabase.from("user_collections").select("*").eq("user_id", user.id).eq("collection_type", "top5");
        if (data && data.length >= 5) { alert("Your Top 5 is full. Remove one first."); return; }
      }
      await supabase.from("user_collections").insert({ user_id: user.id, perfume_id: id, collection_type: type });
      setSavedCollections([...savedCollections, type]);
    }
    setShowCollectionMenu(false);
  };

  if (!perfume) return (
    <div style={{ background: bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: sub, fontFamily: "Georgia, serif", fontSize: "0.8rem" }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ background: bg, minHeight: "100vh", fontFamily: "'Cormorant Garamond', Georgia, serif", width: "100%", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,400&family=DM+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea::placeholder { color: #888; }
        body { overflow-x: hidden; }
      `}</style>

      {/* TOP BAR */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: surface, width: "100%" }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: `1px solid ${border}`, borderRadius: "8px", padding: "0.5rem 1rem", color: sub, fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
        >
          ← Back
        </button>
        <span style={{ color: accent, fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Sente</span>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowCollectionMenu(!showCollectionMenu)}
            style={{ background: accent, border: "none", borderRadius: "8px", padding: "0.5rem 1rem", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
          >
            + Save
          </button>

          {showCollectionMenu && (
            <div style={{ position: "absolute", right: 0, top: "110%", background: surface, border: `1px solid ${border}`, borderRadius: "12px", padding: "0.5rem", zIndex: 100, width: "180px" }}>
              {COLLECTIONS.map(col => (
                <div
                  key={col.key}
                  onClick={() => toggleCollection(col.key)}
                  style={{ padding: "0.7rem 0.8rem", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "8px", background: savedCollections.includes(col.key) ? border : "none" }}
                >
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: text }}>{col.icon} {col.label}</span>
                  {savedCollections.includes(col.key) && <span style={{ color: accent }}>✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "24px 20px", maxWidth: "600px", margin: "0 auto", width: "100%" }}>

        {/* PERFUME HERO — STACKED ON MOBILE */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ width: "100%", height: "220px", background: `linear-gradient(135deg, ${accent}, #52b788)`, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem", marginBottom: "1.5rem" }}>
            {perfume.emoji}
          </div>

          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: sub, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{perfume.house}</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.8rem", fontWeight: 700, color: text, lineHeight: 1.1, marginBottom: "0.8rem", wordBreak: "break-word" }}>{perfume.name}</h1>

          {avgRating > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.8rem" }}>
              <StarRating value={Math.round(avgRating)} readonly />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: sub }}>{avgRating} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
            </div>
          )}

          <p style={{ fontFamily: "'DM Mono', monospace", fontStyle: "italic", fontSize: "0.78rem", color: sub, marginBottom: "0.8rem" }}>{perfume.notes}</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: sub, lineHeight: 1.7 }}>{perfume.description}</p>
        </div>

        <div style={{ background: border, height: "1px", marginBottom: "2rem" }} />

        {/* WRITE A REVIEW */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 700, color: text, marginBottom: "1.2rem" }}>Write a Review</h2>

          {!user ? (
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "12px", padding: "1.5rem", textAlign: "center" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: sub, marginBottom: "1rem", letterSpacing: "0.08em" }}>Sign in to write a review</p>
              <button
                onClick={() => navigate("/")}
                style={{ background: accent, border: "none", borderRadius: "8px", padding: "0.7rem 1.5rem", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
              >
                Sign In
              </button>
            </div>
          ) : (
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "14px", padding: "1.2rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: sub, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.6rem" }}>Your Rating</p>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: sub, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Your Review</p>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="What do you think about this fragrance?"
                  rows={4}
                  style={{ width: "100%", background: bg, border: `1px solid ${border}`, borderRadius: "8px", padding: "0.85rem 1rem", color: text, fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", outline: "none", resize: "none", lineHeight: 1.6 }}
                />
              </div>

              <button
                onClick={submitReview}
                disabled={submitting}
                style={{ background: accent, border: "none", borderRadius: "8px", padding: "0.85rem 2rem", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? "Posting..." : "Post Review"}
              </button>
            </div>
          )}
        </div>

        {/* REVIEWS LIST */}
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 700, color: text, marginBottom: "1.2rem" }}>
            {reviews.length > 0 ? `${reviews.length} Review${reviews.length !== 1 ? "s" : ""}` : "No Reviews Yet"}
          </h2>

          {reviews.length === 0 && (
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "14px", padding: "1.5rem", textAlign: "center" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: sub, fontSize: "1rem" }}>Be the first to review this fragrance.</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ background: surface, border: `1px solid ${border}`, borderRadius: "14px", padding: "1rem 1.2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: text, letterSpacing: "0.05em", marginBottom: "0.3rem" }}>{r.user_email?.split("@")[0]}</p>
                    <StarRating value={r.rating} readonly />
                  </div>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: sub }}>{new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", color: text, lineHeight: 1.6, marginTop: "0.6rem" }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}