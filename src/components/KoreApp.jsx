import { useState, useEffect, useRef, useCallback } from "react";

const PLUM = "#6B2D4E";
const PLUM_DARK = "#4A1F36";
const PLUM_LIGHT = "#C9A8BB";
const PLUM_PALE = "#EDE0E8";
const CREAM = "#F5F0EA";
const CREAM_DARK = "#EDE8E1";
const SAGE = "#E8EDE8";
const SAGE_MID = "#C5D4C5";
const SAGE_DARK = "#6B8F6B";
const WHITE = "#FFFFFF";
const TEXT_DARK = "#2C1A24";
const TEXT_MID = "#7A6570";
const TEXT_LIGHT = "#A89BA3";
const BORDER = "#E0D8DC";

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');`;
const globalStyle = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${CREAM}; font-family: 'DM Sans', sans-serif; }
  h1, h2, h3, h4, h5 { font-family: 'Playfair Display', serif; font-weight: 500; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes toastIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
  @keyframes shimmer { 0% { backgroundPosition: 200% 0; } 100% { backgroundPosition: -200% 0; } }
  @keyframes breatheIn { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
  @keyframes breatheOut { 0% { transform: scale(1.3); } 100% { transform: scale(1); } }
`;

// ─── SVG Tab Icons ────────────────────────────────────────────────────────────
const IconHome = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/>
  </svg>
);
const IconPractice = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IconCheckin = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M9 16l2 2 4-4"/>
  </svg>
);
const IconCircle = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IconResources = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);

// ─── Shared ───────────────────────────────────────────────────────────────────
// ── Arched K crest icon (reusable at any size) ───────────────────────────────
function KoreCrest({ size = 32 }) {
  const w = size;
  const h = size * 1.125;
  return (
    <svg width={w} height={h} viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <path d="M 16 86 L 16 36 Q 16 14, 40 14 Q 64 14, 64 36 L 64 86 Z" fill={PLUM_PALE} stroke={PLUM} strokeWidth="1.5"/>
      <text x="40" y="58" fontFamily="'Playfair Display', Georgia, serif" fontSize="40" fontWeight="500" fill={PLUM} textAnchor="middle">K</text>
      <path d="M 24 72 Q 28 68, 34 68" stroke={SAGE_DARK} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <ellipse cx="28" cy="70" rx="4.5" ry="2" fill={SAGE_DARK} transform="rotate(-30 28 70)"/>
      <path d="M 56 72 Q 52 68, 46 68" stroke={SAGE_DARK} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <ellipse cx="52" cy="70" rx="4.5" ry="2" fill={SAGE_DARK} transform="rotate(30 52 70)"/>
    </svg>
  );
}

// ── Inline header logo: crest + wordmark side-by-side ────────────────────────
function KoreLogo({ size = 32 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <KoreCrest size={size} />
      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 500, fontSize: 20, color: TEXT_DARK, letterSpacing: 4 }}>KORE</span>
    </div>
  );
}

// ── Full hero logo: crest above wordmark with tagline ────────────────────────
function KoreHeroLogo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <KoreCrest size={88} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 38, fontWeight: 500, color: PLUM, letterSpacing: 8, lineHeight: 1 }}>KORE</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 24, height: 1, background: SAGE_DARK }} />
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M 5 1 Q 9 3, 5 9 Q 1 3, 5 1 Z" fill={SAGE_DARK}/></svg>
          <span style={{ width: 24, height: 1, background: SAGE_DARK }} />
        </div>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 12, color: TEXT_MID, letterSpacing: 2 }}>postpartum sanctuary</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SHIMMER SKELETON LOADER — Beautiful loading placeholders
// ═══════════════════════════════════════════════════════════════════════════
function ShimmerSkeleton({ width = "100%", height = "200px", borderRadius = "12px", count = 1 }) {
  return (
    <div style={{ display: "flex", flexDirection: count > 1 ? "column" : "row", gap: 12 }}>
      {Array(count).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            width,
            height,
            borderRadius,
            background: `linear-gradient(90deg, ${CREAM_DARK} 25%, ${CREAM} 50%, ${CREAM_DARK} 75%)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 2s infinite",
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY — Graceful error handling & camera permission errors
// ═══════════════════════════════════════════════════════════════════════════
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "24px", background: CREAM, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: TEXT_DARK, marginBottom: 12 }}>Something went wrong</h2>
            <p style={{ fontSize: 14, color: TEXT_MID, marginBottom: 20, lineHeight: 1.6 }}>
              We encountered an unexpected issue. Try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "12px 24px",
                background: PLUM,
                color: WHITE,
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Camera Permission Error Component
function CameraPermissionError({ onRetry }) {
  return (
    <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "20px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: TEXT_DARK, marginBottom: 12 }}>Camera access required</h3>
      <p style={{ fontSize: 14, color: TEXT_MID, marginBottom: 18, lineHeight: 1.6 }}>
        KORE uses your device camera to track your posture and provide real-time feedback.
      </p>
      <div style={{ background: "#FEF3C7", borderLeft: "4px solid #F59E0B", padding: "12px 14px", borderRadius: 6, marginBottom: 18, textAlign: "left" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#B45309", marginBottom: 4 }}>How to fix:</div>
        <ol style={{ fontSize: 12, color: "#92400E", margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
          <li>Tap the lock icon in your browser's address bar</li>
          <li>Find "Camera" and change to "Allow"</li>
          <li>Refresh and try again</li>
        </ol>
      </div>
      <button
        onClick={onRetry}
        style={{
          padding: "12px 24px",
          background: PLUM,
          color: WHITE,
          border: "none",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          width: "100%",
        }}
      >
        Try again
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
function PillButton({ label, onClick, style = {}, variant = "primary", icon }) {
  const base = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 28px", borderRadius: 50, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 15, transition: "opacity 0.15s" };
  const variants = {
    primary: { background: PLUM, color: WHITE },
    secondary: { background: WHITE, color: TEXT_DARK, border: `1px solid ${BORDER}` },
    dimmed: { background: PLUM_LIGHT, color: WHITE },
    ghost: { background: "transparent", color: TEXT_MID },
    danger: { background: "#C0392B", color: WHITE },
    outline: { background: WHITE, color: TEXT_DARK, border: `1px solid ${BORDER}` },
  };
  return <button style={{ ...base, ...variants[variant], ...style }} onClick={onClick}>{icon && <span style={{ fontSize: 16 }}>{icon}</span>}{label}</button>;
}

function ChoiceRow({ label, sublabel, selected, onClick }) {
  return (
    <div onClick={onClick} style={{ padding: "16px 20px", borderRadius: 14, border: `1.5px solid ${selected ? PLUM : BORDER}`, background: selected ? PLUM_PALE : WHITE, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: selected ? PLUM_DARK : TEXT_DARK, fontWeight: 500 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 13, color: TEXT_MID, marginTop: 2 }}>{sublabel}</div>}
      </div>
      {selected && <span style={{ color: PLUM, fontSize: 18 }}>✓</span>}
    </div>
  );
}

function ProgressBar({ step, total }) {
  return (
    <div style={{ height: 3, background: CREAM_DARK, borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(step / total) * 100}%`, background: PLUM, borderRadius: 3, transition: "width 0.3s" }} />
    </div>
  );
}

function OnboardingShell({ step, total, children }) {
  return (
    <div style={{ minHeight: "100vh", background: CREAM, padding: "0 0 60px" }}>
      <div style={{ padding: "20px 24px 0" }}><KoreLogo /><div style={{ marginTop: 16 }}><ProgressBar step={step} total={total} /><div style={{ fontSize: 11, color: TEXT_LIGHT, marginTop: 8, letterSpacing: 1, textTransform: "uppercase" }}>Step {step} of {total} · A gentle hello</div></div></div>
      <div style={{ padding: "32px 24px 0" }}>{children}</div>
    </div>
  );
}

function AppShell({ activeTab, setActiveTab, children }) {
  const tabs = [
    { id: "home", label: "Home", Icon: IconHome },
    { id: "practice", label: "Practice", Icon: IconPractice },
    { id: "checkin", label: "Check-in", Icon: IconCheckin },
    { id: "circle", label: "Circle", Icon: IconCircle },
    { id: "resources", label: "Resources", Icon: IconResources },
  ];
  return (
    <div style={{ minHeight: "100vh", background: CREAM, display: "flex", flexDirection: "column" }}>
      <div style={{ background: WHITE, borderBottom: `1px solid ${BORDER}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <KoreLogo />
        <span style={{ fontSize: 11, letterSpacing: 2, color: TEXT_LIGHT, textTransform: "uppercase" }}>Postpartum sanctuary</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>{children}</div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: WHITE, borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-around", padding: "10px 0 14px", zIndex: 20 }}>
        {tabs.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button key={id} onClick={() => setActiveTab(id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: active ? PLUM : TEXT_LIGHT, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: active ? 500 : 400, minWidth: 50 }}>
              <Icon color={active ? PLUM : TEXT_LIGHT} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────
function Landing({ onStart, onHowItWorks }) {
  return (
    <div style={{ minHeight: "100vh", background: CREAM, padding: 32 }}>
      {/* Top-left brand mark */}
      <div style={{ marginBottom: 24 }}>
        <KoreLogo size={36} />
      </div>
      <div style={{ display: "flex", gap: 48, alignItems: "center", minHeight: "75vh" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: SAGE, padding: "6px 14px", borderRadius: 20, fontSize: 11, color: SAGE_DARK, letterSpacing: 1, fontWeight: 500, marginBottom: 24, textTransform: "uppercase" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: SAGE_DARK, display: "inline-block" }} />
            For Africans, by Africans
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, lineHeight: 1.1, color: TEXT_DARK, marginBottom: 20 }}>
            Your body just did something <em style={{ color: PLUM }}>monumental.</em>
          </h1>
          <p style={{ fontSize: 16, color: TEXT_MID, lineHeight: 1.7, maxWidth: 420, marginBottom: 32 }}>
            Now, let's rebuild your foundation. Private, data-driven diastasis recovery designed to make you feel strong again — at home, on your own terms.
          </p>
          <div style={{ display: "flex", gap: 12, marginBottom: 48 }}>
            <PillButton label="Begin your recovery" onClick={onStart} />
            <PillButton label="Learn how it works" variant="secondary" onClick={onHowItWorks} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[["On-device", "Edge AI privacy"], ["5–10 min", "Micro-sessions"], ["24/7", "Myth-buster bot"]].map(([big, small]) => (
              <div key={big}><div style={{ color: PLUM, fontWeight: 500, fontSize: 17, marginBottom: 2 }}>{big}</div><div style={{ fontSize: 13, color: TEXT_MID }}>{small}</div></div>
            ))}
          </div>
        </div>
        <div style={{ width: 340 }}>
          <div style={{ background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 24, padding: "44px 32px", minHeight: 480, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 24px rgba(107, 45, 78, 0.08)" }}>
            <KoreHeroLogo />
            <div style={{ textAlign: "center", margin: "32px 0" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: TEXT_DARK, fontStyle: "italic", lineHeight: 1.5, marginBottom: 14 }}>"Strength, dignity, empathy, truth."</p>
              <p style={{ fontSize: 12, color: TEXT_MID, letterSpacing: 1, textTransform: "uppercase" }}>The four pillars we build around you</p>
            </div>
            <div style={{ width: "100%", background: SAGE, borderRadius: 12, padding: "14px 18px", textAlign: "center" }}>
              <p style={{ fontSize: 13, color: SAGE_DARK, fontWeight: 500, marginBottom: 3 }}>Bridging clinical expertise</p>
              <p style={{ fontSize: 13, color: TEXT_MID }}>and home convenience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── How It Works Page ────────────────────────────────────────────────────────
function HowItWorks({ onBack, onBegin }) {
  const [faqOpen, setFaqOpen] = useState(null);

  const steps = [
    {
      num: 1,
      title: "Prop Your Phone",
      desc: "Place your phone on the floor or a table so the camera is facing your exercise mat. That's it — no special equipment needed.",
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect x="14" y="4" width="16" height="28" rx="3" stroke={PLUM} strokeWidth="2" fill={PLUM_PALE}/>
          <circle cx="22" cy="28" r="2" fill={PLUM}/>
          <rect x="18" y="8" width="8" height="2" rx="1" fill={PLUM_LIGHT}/>
          <path d="M8 36h28" stroke={SAGE_DARK} strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M4 40h36" stroke={SAGE_DARK} strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2"/>
        </svg>
      ),
    },
    {
      num: 2,
      title: "Follow the Video",
      desc: "A professional instructor will appear on your screen and show you exactly what to do, step by step. Just watch and move along with her.",
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect x="4" y="10" width="30" height="22" rx="3" stroke={PLUM} strokeWidth="2" fill={PLUM_PALE}/>
          <circle cx="19" cy="21" r="6" fill={PLUM} opacity="0.15" stroke={PLUM} strokeWidth="1.5"/>
          <path d="M17 18.5l6 2.5-6 2.5z" fill={PLUM}/>
          <path d="M36 16l4-3v14l-4-3V16z" fill={PLUM_LIGHT} stroke={PLUM} strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      num: 3,
      title: "Get Live Guidance",
      desc: "The app acts like a smart mirror. It watches your posture in real-time and gently speaks to you if you need to adjust your form — so you always heal safely.",
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <ellipse cx="22" cy="26" rx="14" ry="10" stroke={PLUM} strokeWidth="2" fill={PLUM_PALE}/>
          <circle cx="22" cy="26" r="4" fill={PLUM} opacity="0.2" stroke={PLUM} strokeWidth="1.5"/>
          <circle cx="22" cy="26" r="1.5" fill={PLUM}/>
          <path d="M22 6c-5 0-9 3-11 7" stroke={SAGE_DARK} strokeWidth="2" strokeLinecap="round"/>
          <path d="M22 6c5 0 9 3 11 7" stroke={SAGE_DARK} strokeWidth="2" strokeLinecap="round"/>
          <path d="M14 10l-3-1 1 3" stroke={SAGE_DARK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M30 10l3-1-1 3" stroke={SAGE_DARK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 38c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={PLUM_LIGHT} strokeWidth="1.5" strokeLinecap="round"/>
          <rect x="19" y="32" width="6" height="3" rx="1" fill={PLUM_PALE} stroke={PLUM_LIGHT} strokeWidth="1"/>
        </svg>
      ),
    },
  ];

  const faqs = [
    {
      q: "Will this app record me or show my body to anyone?",
      a: "Never. KORE works entirely inside your phone's hardware. It does not record video, save files, or upload anything to the internet. Nobody will ever see you — not even us.",
    },
    {
      q: "Does it swallow up my mobile data?",
      a: "No. Once downloaded, the tracking system runs locally on your device without draining your cellular data package. You can use it with no internet connection at all.",
    },
    {
      q: "Is it too late for my body to heal?",
      a: "It is never too late. Whether you gave birth 3 months ago or 3 years ago, these targeted movements are medically structured to rebuild your core strength safely, at any stage.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: CREAM }}>
      {/* Top bar */}
      <div style={{ background: WHITE, borderBottom: `1px solid ${BORDER}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: TEXT_MID, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TEXT_MID} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Home
        </button>
        <KoreLogo size={28} />
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 60px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: PLUM_PALE, color: PLUM, padding: "6px 18px", borderRadius: 20, fontSize: 12, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>How it works</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, color: TEXT_DARK, lineHeight: 1.2, marginBottom: 14 }}>
            Simple steps. <em style={{ color: PLUM }}>Real healing.</em>
          </h1>
          <p style={{ fontSize: 16, color: TEXT_MID, lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>
            You don't need any special equipment or technical skills. If you can prop up your phone, you are ready to begin.
          </p>
        </div>

        {/* 3 Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ background: WHITE, borderRadius: 18, border: `1px solid ${BORDER}`, padding: "28px 28px", display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: PLUM_PALE, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {s.icon}
                </div>
                {i < steps.length - 1 && <div style={{ width: 2, height: 24, background: BORDER, borderRadius: 2 }} />}
              </div>
              <div style={{ flex: 1, paddingTop: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: PLUM, color: WHITE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, flexShrink: 0 }}>{s.num}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: TEXT_DARK }}>{s.title}</h3>
                </div>
                <p style={{ fontSize: 15, color: TEXT_MID, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Deep Healing Block */}
        <div style={{ background: `linear-gradient(135deg, ${PLUM_PALE} 0%, ${CREAM_DARK} 100%)`, borderRadius: 20, border: `1px solid ${PLUM_LIGHT}`, padding: "32px 28px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: PLUM_LIGHT, opacity: 0.15 }} />
          <div style={{ position: "absolute", bottom: -30, left: -30, width: 100, height: 100, borderRadius: "50%", background: SAGE_MID, opacity: 0.2 }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: PLUM, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: PLUM_DARK }}>How KORE Heals Your Body From Within</h2>
            </div>
            <p style={{ fontSize: 15, color: TEXT_DARK, lineHeight: 1.8 }}>
              When you experience abdominal separation (Diastasis Recti), your deep, underlying core muscles simply need a bit of targeted activation to regain their strength. KORE acts as your gentle, at-home personal trainer, guiding you through specialised movements that gently pull these deep core muscles back together naturally.
            </p>
            <div style={{ height: 1, background: PLUM_LIGHT, opacity: 0.4, margin: "18px 0" }} />
            <p style={{ fontSize: 15, color: TEXT_DARK, lineHeight: 1.8 }}>
              By using your phone's camera as a smart mirror, KORE watches your alignment in real-time. If your form drifts, the app gently uses voice cues to guide you back into place — ensuring your muscles always present correctly so you can heal safely and effectively.
            </p>
          </div>
        </div>

        {/* Privacy reassurance row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 40 }}>
          {[
            { icon: "🔒", title: "100% Private", sub: "Nothing ever leaves your phone" },
            { icon: "📵", title: "No data used", sub: "Works fully offline" },
            { icon: "🕐", title: "5–10 minutes", sub: "Fits into any busy day" },
          ].map(({ icon, title, sub }) => (
            <div key={title} style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "16px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: TEXT_DARK, marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 12, color: TEXT_LIGHT, lineHeight: 1.4 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: TEXT_DARK, marginBottom: 8 }}>Questions you might be thinking</h2>
        <p style={{ fontSize: 15, color: TEXT_MID, marginBottom: 20, lineHeight: 1.6 }}>We've answered the most common worries here, in plain language.</p>
        <div style={{ background: WHITE, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden", marginBottom: 40 }}>
          {faqs.map((item, i) => (
            <div key={i} style={{ borderBottom: i < faqs.length - 1 ? `1px solid ${CREAM_DARK}` : "none" }}>
              <div
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer", gap: 16 }}
              >
                <span style={{ fontSize: 15, color: TEXT_DARK, fontWeight: 500, lineHeight: 1.5, flex: 1 }}>{item.q}</span>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: faqOpen === i ? PLUM : CREAM_DARK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={faqOpen === i ? WHITE : TEXT_MID} strokeWidth="2.5" strokeLinecap="round">
                    {faqOpen === i ? <path d="M18 15l-6-6-6 6"/> : <path d="M6 9l6 6 6-6"/>}
                  </svg>
                </div>
              </div>
              {faqOpen === i && (
                <div style={{ padding: "0 24px 20px", fontSize: 15, color: TEXT_MID, lineHeight: 1.7, borderTop: `1px solid ${CREAM_DARK}` }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: PLUM, borderRadius: 20, padding: "36px 32px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: WHITE, marginBottom: 10 }}>Ready to begin healing?</h2>
          <p style={{ fontSize: 15, color: PLUM_LIGHT, lineHeight: 1.6, marginBottom: 24 }}>Your body is ready. KORE will guide you — gently, privately, at your own pace.</p>
          <PillButton label="Begin Your Recovery →" onClick={onBegin} style={{ background: WHITE, color: PLUM_DARK, fontSize: 16, padding: "14px 36px" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Onboarding Steps ─────────────────────────────────────────────────────────
function Step1({ onNext, onBack, data, setData }) {
  return (
    <OnboardingShell step={1} total={6}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: TEXT_DARK, marginBottom: 8 }}>What shall we call you?</h2>
      <p style={{ color: TEXT_MID, fontSize: 15, marginBottom: 28 }}>A name we whisper to you, never shared with anyone.</p>
      <input value={data.name || ""} onChange={e => setData({ ...data, name: e.target.value })} placeholder="Your name" style={{ width: "100%", padding: "16px 20px", borderRadius: 50, border: `1.5px solid ${BORDER}`, background: WHITE, fontSize: 16, color: TEXT_DARK, outline: "none", fontFamily: "'DM Sans', sans-serif", marginBottom: 40 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: TEXT_LIGHT, fontSize: 14, cursor: "pointer" }} onClick={onBack}>‹ Back</span>
        <PillButton label="Continue ›" onClick={onNext} variant={data.name ? "primary" : "dimmed"} />
      </div>
    </OnboardingShell>
  );
}

function Step2({ onNext, onBack, data, setData }) {
  const opts = [["1 – 6 months", "Early healing"], ["7 – 12 months", "Rebuilding"], ["1 – 2 years", "Restoring strength"], ["3 years & beyond", "Long-term recovery"]];
  return (
    <OnboardingShell step={2} total={6}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: TEXT_DARK, marginBottom: 8 }}>How long since baby arrived?</h2>
      <p style={{ color: TEXT_MID, fontSize: 15, marginBottom: 28 }}>Every stage of postpartum is sacred. We meet you exactly where you are.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>{opts.map(([l, s]) => <ChoiceRow key={l} label={l} sublabel={s} selected={data.postpartumStage === l} onClick={() => setData({ ...data, postpartumStage: l })} />)}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: TEXT_LIGHT, fontSize: 14, cursor: "pointer" }} onClick={onBack}>‹ Back</span>
        <PillButton label="Continue ›" onClick={onNext} variant={data.postpartumStage ? "primary" : "dimmed"} />
      </div>
    </OnboardingShell>
  );
}

function Step3({ onNext, onBack, data, setData }) {
  const opts = ["Vaginal birth", "C-section", "Assisted delivery", "Prefer not to say"];
  return (
    <OnboardingShell step={3} total={6}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: TEXT_DARK, marginBottom: 8 }}>How was baby born?</h2>
      <p style={{ color: TEXT_MID, fontSize: 15, marginBottom: 28 }}>This shapes which exercises are safe in your first weeks.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>{opts.map(l => <ChoiceRow key={l} label={l} selected={data.birthType === l} onClick={() => setData({ ...data, birthType: l })} />)}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: TEXT_LIGHT, fontSize: 14, cursor: "pointer" }} onClick={onBack}>‹ Back</span>
        <PillButton label="Continue ›" onClick={onNext} variant={data.birthType ? "primary" : "dimmed"} />
      </div>
    </OnboardingShell>
  );
}

function Step4({ onNext, onBack, data, setData }) {
  const opts = [["Mostly resting", "Less than 1 walk a week"], ["Light & gentle", "Short walks, baby carrying"], ["Moderately active", "2–3 sessions a week"], ["Active", "Regular structured movement"]];
  return (
    <OnboardingShell step={4} total={6}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: TEXT_DARK, marginBottom: 8 }}>How active are you, today?</h2>
      <p style={{ color: TEXT_MID, fontSize: 15, marginBottom: 28 }}>Honest, not aspirational. This sets your starting line.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>{opts.map(([l, s]) => <ChoiceRow key={l} label={l} sublabel={s} selected={data.activity === l} onClick={() => setData({ ...data, activity: l })} />)}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: TEXT_LIGHT, fontSize: 14, cursor: "pointer" }} onClick={onBack}>‹ Back</span>
        <PillButton label="Continue ›" onClick={onNext} variant={data.activity ? "primary" : "dimmed"} />
      </div>
    </OnboardingShell>
  );
}

function Step5({ onNext, onBack, data, setData }) {
  const symptoms = ["Belly bulging / coning", "Lower back pain", "Pelvic heaviness", "Leaking when sneezing", "Painful intimacy", "Low energy"];
  const toggleSym = s => { const cur = data.symptoms || []; setData({ ...data, symptoms: cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s] }); };
  return (
    <OnboardingShell step={5} total={6}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: TEXT_DARK, marginBottom: 8 }}>A few measurements</h2>
      <p style={{ color: TEXT_MID, fontSize: 15, marginBottom: 28 }}>Used only to track your progress — never compared, never judged.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[["CURRENT WEIGHT (KG)", "weight", "e.g. 68"], ["HEIGHT (CM)", "height", "e.g. 165"]].map(([lbl, key, ph]) => (
          <div key={key}><div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{lbl}</div><input value={data[key] || ""} onChange={e => setData({ ...data, [key]: e.target.value })} placeholder={ph} style={{ width: "100%", padding: "13px 18px", borderRadius: 50, border: `1.5px solid ${data[key] ? PLUM : BORDER}`, background: WHITE, fontSize: 15, color: TEXT_DARK, outline: "none", fontFamily: "'DM Sans', sans-serif" }} /></div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Any of these feel familiar?</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
        {symptoms.map(s => { const sel = (data.symptoms || []).includes(s); return <span key={s} onClick={() => toggleSym(s)} style={{ padding: "7px 14px", borderRadius: 20, border: `1px solid ${sel ? PLUM : BORDER}`, background: sel ? PLUM_PALE : WHITE, color: sel ? PLUM_DARK : TEXT_MID, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{s}</span>; })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: TEXT_LIGHT, fontSize: 14, cursor: "pointer" }} onClick={onBack}>‹ Back</span>
        <PillButton label="Continue ›" onClick={onNext} />
      </div>
    </OnboardingShell>
  );
}

function Step6({ onNext, onBack, data, setData }) {
  const goals = ["Close my diastasis gap", "Rebuild core strength", "Feel confident again", "Return to exercise", "Manage pelvic floor"];
  return (
    <OnboardingShell step={6} total={6}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: TEXT_DARK, marginBottom: 8 }}>What matters most right now?</h2>
      <p style={{ color: TEXT_MID, fontSize: 15, marginBottom: 28 }}>We'll shape your daily practice around this intention.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>{goals.map(g => <ChoiceRow key={g} label={g} selected={data.goal === g} onClick={() => setData({ ...data, goal: g })} />)}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: TEXT_LIGHT, fontSize: 14, cursor: "pointer" }} onClick={onBack}>‹ Back</span>
        <PillButton label="Enter KORE ›" onClick={onNext} variant={data.goal ? "primary" : "dimmed"} />
      </div>
    </OnboardingShell>
  );
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────
function HomeTab({ userData }) {
  const name = userData?.name || "Maya";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const gapData = [3.8, 3.6, 3.4, 3.2, 3.0, 2.8, 2.5, 2.3];
  const chartW = 460, chartH = 90;
  const minV = 2.0, maxV = 4.2;
  const pts = gapData.map((v, i) => { const x = 20 + (i / (gapData.length - 1)) * (chartW - 40); const y = chartH - 10 - ((v - minV) / (maxV - minV)) * (chartH - 20); return [x, y]; });
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const fillD = pathD + ` L${pts[pts.length - 1][0]},${chartH} L${pts[0][0]},${chartH} Z`;
  const labels = ["Apr 12", "Apr 14", "Apr 16", "Apr 18", "Apr 20", "Apr 22", "Apr 23", "Today"];

  return (
    <div style={{ padding: "24px 24px 0" }}>
      <div style={{ fontSize: 12, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{greeting}, {name}</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: TEXT_DARK, marginBottom: 24 }}>You're healing beautifully.</h2>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div><div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Your plan</div><div style={{ fontSize: 16, fontWeight: 500, color: TEXT_DARK }}>Monthly Maintenance</div></div>
        <span style={{ color: TEXT_LIGHT, fontSize: 18 }}>›</span>
      </div>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Inter-recti gap</div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div><span style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, color: TEXT_DARK }}>2.3</span><span style={{ fontSize: 16, color: TEXT_MID, marginLeft: 4 }}>cm</span></div>
          <svg width={70} height={70} viewBox="0 0 70 70">
            <circle cx={35} cy={35} r={28} fill="none" stroke={SAGE} strokeWidth={7}/>
            <circle cx={35} cy={35} r={28} fill="none" stroke={SAGE_DARK} strokeWidth={7} strokeDasharray={`${0.42 * 175.9} 175.9`} strokeLinecap="round" transform="rotate(-90 35 35)"/>
            <text x={35} y={40} textAnchor="middle" fontSize={14} fontWeight={500} fill={PLUM} fontFamily="DM Sans, sans-serif">42%</text>
          </svg>
        </div>
        <div style={{ background: SAGE, borderRadius: 10, padding: "12px 8px 4px", overflow: "hidden" }}>
          <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 20}`} style={{ display: "block" }}>
            <defs><linearGradient id="gapGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={PLUM} stopOpacity={0.3}/><stop offset="100%" stopColor={PLUM} stopOpacity={0.0}/></linearGradient></defs>
            <path d={fillD} fill="url(#gapGrad)"/>
            <path d={pathD} fill="none" stroke={PLUM} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill={PLUM}/>)}
            {labels.filter((_, i) => i % 2 === 0).map((l, idx) => { const i = idx * 2; return <text key={l} x={pts[i][0]} y={chartH + 18} textAnchor="middle" fontSize={9} fill={TEXT_LIGHT} fontFamily="DM Sans">{l}</text>; })}
          </svg>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ background: PLUM, borderRadius: 14, padding: "18px 16px" }}>
          <div style={{ marginBottom: 10 }}><svg width="22" height="22" viewBox="0 0 24 24" fill={PLUM_PALE}><polygon points="5,3 19,12 5,21"/></svg></div>
          <div style={{ fontWeight: 500, fontSize: 15, color: WHITE }}>Today's practice</div>
          <div style={{ fontSize: 12, color: PLUM_LIGHT, marginTop: 3 }}>12 min · 3 exercises</div>
        </div>
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "18px 16px" }}>
          <div style={{ marginBottom: 10 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={TEXT_MID} strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></div>
          <div style={{ fontWeight: 500, fontSize: 15, color: TEXT_DARK }}>Daily check-in</div>
          <div style={{ fontSize: 12, color: TEXT_MID, marginTop: 3 }}>Log how you feel</div>
        </div>
      </div>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>6-week recovery summary</div>
        <div style={{ fontSize: 20, fontFamily: "'Playfair Display', serif", color: TEXT_DARK, marginBottom: 14 }}>Your transformation</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[["+35%", "Posture alignment improved"], ["−1.5", "Core gap reduced (cm)"]].map(([n, l]) => (
            <div key={l} style={{ background: CREAM_DARK, borderRadius: 10, padding: "16px 14px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: PLUM }}>{n}</div>
              <div style={{ fontSize: 12, color: TEXT_MID, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: TEXT_MID, lineHeight: 1.6 }}>Small, consistent sessions are adding up. Your core engagement and pelvic stability have both measurably improved — keep going.</p>
      </div>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Gentle reminder</div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: TEXT_DARK, lineHeight: 1.6 }}>Small, consistent steps add up. Aim for today's 12-minute flow to keep your momentum.</p>
      </div>

      <div style={{ background: SAGE, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={SAGE_DARK} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        <span style={{ fontSize: 13, color: TEXT_MID }}>All measurements processed on-device. Nothing leaves your phone.</span>
      </div>
    </div>
  );
}

// ─── Practice Tab  (now delegates to Exercise Module) ───────────────────────
// The PracticeTab renders the Exercise Library inline.
// All exercise logic, AI posture tracking, voice engine, and session flow
// live in KoreExerciseModule.jsx — import and swap accordingly in production.

// ── Exercise DB (subset for PracticeTab quick-launch) ─────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// 20-EXERCISE DATABASE — Production-Ready with Instructions & Voice Scripts
// ═══════════════════════════════════════════════════════════════════════════
const EXERCISES_8 = [
  {
    id: "beg_01",
    name: "Diaphragmatic Breathing",
    level: "beginner",
    duration: 45,
    reps: "5 rounds × 5 breaths",
    videoFile: "beg_01_diaphragmatic_breathing.mp4",
    tolaniIntro: "Close your eyes, love. Place your hands on your tummy, inhale deeply, and imagine gently blowing up a beautiful balloon right through your belly button.",
    steps: [
      "Step 1: Lie on your back, knees bent, feet flat on the floor.",
      "Step 2: Breathe in slowly through your nose for a count of four.",
      "Step 3: Exhale for a count of six, imagining the air flowing down your spine.",
      "Step 4: Gently draw your lower belly in toward your spine.",
      "Step 5: Release and rest for two breaths. Repeat this cycle five times.",
    ],
  },
  {
    id: "beg_02",
    name: "Glute Bridges",
    level: "beginner",
    duration: 45,
    reps: "10 reps × 2 sets",
    videoFile: "beg_02_glute_bridge.mp4",
    tolaniIntro: "Your glutes are your powerhouse, mama. We're waking them up gently. Squeeze like you're holding a coin between your cheeks—firm but kind.",
    steps: [
      "Step 1: Lie on your back, knees bent, feet hip-width apart.",
      "Step 2: Press through your heels and lift your hips toward the ceiling.",
      "Step 3: Squeeze your glutes at the top for two seconds.",
      "Step 4: Lower back down slowly, one vertebra at a time.",
      "Step 5: Rest at the bottom for one breath. Repeat ten times.",
    ],
  },
  {
    id: "beg_03",
    name: "Toe Taps",
    level: "beginner",
    duration: 45,
    reps: "12 each side × 2 sets",
    videoFile: "beg_03_toe_taps.mp4",
    tolaniIntro: "Lie on your back, love. We're going to gently tap one foot down at a time while keeping your core engaged. Light and controlled.",
    steps: [
      "Step 1: Lie on your back, knees bent at ninety degrees, feet hovering off the floor.",
      "Step 2: Keep your lower back flat against the mat.",
      "Step 3: Gently tap one foot to the floor, then lift it back up.",
      "Step 4: Tap the other foot down, then lift it back up.",
      "Step 5: Alternate for twelve reps on each side, rest, then do a second set.",
    ],
  },
  {
    id: "int_01",
    name: "Heel Slides",
    level: "intermediate",
    duration: 50,
    reps: "10 each side × 3",
    videoFile: "int_01_heel_slides.mp4",
    tolaniIntro: "You're building strength now, sweetheart. Slide one foot out—keep your back flat and your core braced. This is precision work.",
    steps: [
      "Step 1: Lie on your back, knees bent, feet flat on the floor.",
      "Step 2: Exhale and gently brace your core.",
      "Step 3: Keeping your core engaged, slowly slide one heel away from you.",
      "Step 4: Your lower back should stay flat—if it arches, bring your leg back a bit closer.",
      "Step 5: Slide your heel back to starting position. Repeat ten times on one side, then switch.",
    ],
  },
  {
    id: "int_03",
    name: "Bird-Dog",
    level: "intermediate",
    duration: 55,
    reps: "8 each side × 3",
    videoFile: "int_03_bird_dog.mp4",
    tolaniIntro: "On your hands and knees, love. We're extending one leg back—keep your hips level, like you're balancing a cup of tea on your lower back.",
    steps: [
      "Step 1: Come to all fours—hands under shoulders, knees under hips.",
      "Step 2: Engage your core by drawing your belly in gently.",
      "Step 3: Keeping your hips still and level, slowly extend one leg straight back.",
      "Step 4: Squeeze your glute at full extension for one second.",
      "Step 5: Return your knee to the mat with control. Repeat eight times on one side, then switch.",
    ],
  },
  {
    id: "int_04",
    name: "Leg Extensions",
    level: "intermediate",
    duration: 50,
    reps: "10 each side × 3",
    videoFile: "int_04_leg_extensions.mp4",
    tolaniIntro: "On your back, knees bent. We're straightening one leg while keeping the other bent. Slow, controlled movements.",
    steps: [
      "Step 1: Lie on your back, both knees bent, feet flat on the floor.",
      "Step 2: Brace your core gently.",
      "Step 3: Keeping one knee bent, slowly straighten the other leg out.",
      "Step 4: Don't let your lower back lift off the mat.",
      "Step 5: Return to bent position. Repeat ten times on one side, then switch.",
    ],
  },
  {
    id: "adv_01",
    name: "Bear Hold",
    level: "advanced",
    duration: 45,
    reps: "3 × 20-sec holds",
    videoFile: "adv_01_bear_hold.mp4",
    tolaniIntro: "Hands and feet on the ground, hips low, knees hovering just above the mat. Hold this beast position with power and breath.",
    steps: [
      "Step 1: Come to hands and feet, hands under shoulders, feet under hips.",
      "Step 2: Engage your core strongly and lift your knees just one inch off the ground.",
      "Step 3: Your body should be one straight line from head to heels.",
      "Step 4: Breathe steadily—never hold your breath in this position.",
      "Step 5: Hold for twenty seconds, then rest. Repeat two more times.",
    ],
  },
  {
    id: "adv_02",
    name: "Dead Bugs",
    level: "advanced",
    duration: 55,
    reps: "8 each side × 3",
    videoFile: "adv_02_dead_bugs.mp4",
    tolaniIntro: "Lie on your back, arms reaching up, knees bent at ninety degrees. We're extending opposite limbs—opposite arm and leg, slow and steady.",
    steps: [
      "Step 1: Lie on your back, arms extended toward the ceiling, knees bent at ninety degrees.",
      "Step 2: Exhale and lower your right arm overhead while straightening your left leg.",
      "Step 3: Keep your lower back pressed into the mat the entire time—no arching.",
      "Step 4: Return to starting position, breathing naturally.",
      "Step 5: Repeat on the opposite side—left arm, right leg. Alternate for eight reps each side.",
    ],
  },
];

const EXERCISE_LEVELS_8_8 = {
  beginner: {
    label: "Beginner",
    sublabel: "Foundation & Re-activation",
    weeks: "Weeks 1–6",
    color: "#6B8F6B",
    bgColor: "#E8EDE8",
    exercises: EXERCISES_8.filter(e => e.level === "beginner"),
  },
  intermediate: {
    label: "Intermediate",
    sublabel: "Progression & Core Stability",
    weeks: "Weeks 7–12",
    color: "#6B2D4E",
    bgColor: "#EDE0E8",
    exercises: EXERCISES_8.filter(e => e.level === "intermediate"),
  },
  advanced: {
    label: "Advanced",
    sublabel: "Functional Strength & Integration",
    weeks: "Weeks 13+",
    color: "#2D5A3D",
    bgColor: "#E8F0EB",
    exercises: EXERCISES_8.filter(e => e.level === "advanced"),
  },
};

// ── Simulated voice cue hook ───────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════
// LOCALSTORAGE HOOKS — Persistent state across refreshes
// ═══════════════════════════════════════════════════════════════════════════
function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  const setPersisted = useCallback((value) => {
    try {
      const newValue = typeof value === "function" ? value(state) : value;
      setState(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (err) {
      console.error(`Error persisting ${key}:`, err);
    }
  }, [state, key]);
  return [state, setPersisted];
}

function saveSurveyAnswers(answers) {
  try {
    localStorage.setItem("kore_survey_answers", JSON.stringify(answers));
    localStorage.setItem("kore_survey_completed", "true");
  } catch (err) {
    console.error("Error saving survey:", err);
  }
}

function loadSurveyAnswers() {
  try {
    return JSON.parse(localStorage.getItem("kore_survey_answers")) || null;
  } catch {
    return null;
  }
}

function hasSurveyBeenCompleted() {
  return localStorage.getItem("kore_survey_completed") === "true";
}

function saveUserProgress(userData, level, sessionData) {
  try {
    localStorage.setItem("kore_user_data", JSON.stringify(userData));
    localStorage.setItem("kore_active_level", level);
    if (sessionData) localStorage.setItem("kore_session_data", JSON.stringify(sessionData));
  } catch (err) {
    console.error("Error saving progress:", err);
  }
}

function loadUserProgress() {
  try {
    return {
      userData: JSON.parse(localStorage.getItem("kore_user_data")) || {},
      activeLevel: localStorage.getItem("kore_active_level") || "beginner",
      sessionData: JSON.parse(localStorage.getItem("kore_session_data")) || null,
    };
  } catch {
    return { userData: {}, activeLevel: "beginner", sessionData: null };
  }
}

// ─────────────────────────────────────────────────────────────────────────
function OnboardingSurveyModal({ isOpen, onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    weeksPostpartum: "",
    birthType: "",
    painLevel: 5,
    currentSymptoms: [],
    fitnessLevel: "",
    goals: "",
  });

  const questions = [
    { id: "weeksPostpartum", label: "How many weeks postpartum are you?", type: "number", placeholder: "e.g., 8" },
    { id: "birthType", label: "What type of birth did you have?", type: "select", options: ["Vaginal", "C-section", "Assisted (forceps/vacuum)"] },
    { id: "painLevel", label: "Rate your current core/pelvic pain (0 = none, 10 = severe)", type: "slider", min: 0, max: 10 },
    { id: "currentSymptoms", label: "Which symptoms are you experiencing? (select all)", type: "checkbox", options: ["Leaking with cough/sneeze", "Lower back pain", "Heaviness/pressure", "Pain during intimacy", "Visible bulging belly", "None of these"] },
    { id: "fitnessLevel", label: "How would you describe your fitness level before pregnancy?", type: "select", options: ["Sedentary", "Lightly active", "Moderately active", "Very active"] },
    { id: "goals", label: "What is your primary goal?", type: "select", options: ["Close my gap", "Stop leaking", "Reduce back pain", "Feel strong again", "Return to exercise"] },
  ];

  const handleAnswer = (key, value) => {
    if (key === "currentSymptoms") {
      const curr = answers.currentSymptoms || [];
      setAnswers({
        ...answers,
        currentSymptoms: curr.includes(value) ? curr.filter(v => v !== value) : [...curr, value],
      });
    } else {
      setAnswers({ ...answers, [key]: value });
    }
  };

  const handleNext = () => {
    if (step < questions.length - 1) setStep(step + 1);
    else onComplete(answers);
  };

  if (!isOpen) return null;

  const q = questions[step];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: CREAM, borderRadius: 24, padding: 32, maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: TEXT_MID, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
            Question {step + 1} of {questions.length}
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: TEXT_DARK, marginBottom: 16 }}>{q.label}</h2>
          <div style={{ height: 2, background: PLUM_PALE, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", background: PLUM, width: `${((step + 1) / questions.length) * 100}%`, transition: "width 0.3s" }} />
          </div>
        </div>

        {q.type === "number" && (
          <input
            type="number"
            placeholder={q.placeholder}
            value={answers[q.id]}
            onChange={(e) => handleAnswer(q.id, e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 16, marginBottom: 20 }}
          />
        )}

        {q.type === "select" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(q.id, opt)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: answers[q.id] === opt ? `2px solid ${PLUM}` : `1px solid ${BORDER}`,
                  background: answers[q.id] === opt ? PLUM_PALE : WHITE,
                  color: TEXT_DARK,
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 14,
                  transition: "all 0.2s",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {q.type === "slider" && (
          <div style={{ marginBottom: 20 }}>
            <input
              type="range"
              min={q.min}
              max={q.max}
              value={answers[q.id]}
              onChange={(e) => handleAnswer(q.id, parseInt(e.target.value))}
              style={{ width: "100%", cursor: "pointer", marginBottom: 12 }}
            />
            <div style={{ textAlign: "center", fontSize: 28, color: PLUM, fontWeight: 600 }}>{answers[q.id]}</div>
          </div>
        )}

        {q.type === "checkbox" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {q.options.map((opt) => (
              <label key={opt} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: TEXT_DARK }}>
                <input
                  type="checkbox"
                  checked={(answers.currentSymptoms || []).includes(opt)}
                  onChange={() => handleAnswer(q.id, opt)}
                  style={{ width: 18, height: 18, cursor: "pointer" }}
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        <button
          onClick={handleNext}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: PLUM,
            color: WHITE,
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: 1,
          }}
        >
          {step === questions.length - 1 ? "Complete Survey" : "Next"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  VOICE COACHING SCRIPTS — Plain language, warm, conversational
// ═══════════════════════════════════════════════════════════════════════════
// Written for African mothers — no clinical jargon. Body-relatable cues only.

// ── Per-exercise breath coaching scripts ──────────────────────────────────
// Each exercise has 4–6 cycle lines that loop with realistic rep tempo.
// Cycle gap = seconds between each cue line. Most reps run 6–8 seconds total.
const BREATH_COACHING = {
  "Pelvic Tilts": {
    cycleGap: 7,
    cues: [
      "Breathe in slowly... let your belly soften and rise.",
      "Now breathe out, gently flatten your lower back into the mat. Beautiful.",
      "And again — breathe in... soften.",
      "Breathe out... press your back down, like you're trying to leave a print on the floor.",
      "One more breath in... fill up.",
      "Now exhale... and reset. You're doing this perfectly.",
    ],
  },
  "Abdominal Bracing": {
    cycleGap: 8,
    cues: [
      "Take a deep breath in through your nose...",
      "Now breathe out and gently pull your tummy in — like you're zipping up tight jeans. Hold.",
      "Two... three... four... five. Release. Beautiful.",
      "Breathe in again...",
      "And out, draw it in, hold... two... three... four... five. Let go.",
      "Your deep tummy muscles are waking up right now. Keep going, my love.",
    ],
  },
  "Supported Heel Slides": {
    cycleGap: 7,
    cues: [
      "Breathe in to prepare...",
      "Breathe out, gently slide your heel away from you. Slowly.",
      "Breathe in, and bring it back. Lovely.",
      "Switch sides. Breathe out... slide it out.",
      "Breathe in... bring it home.",
      "Keep your tummy soft and held in throughout, mama. You've got this.",
    ],
  },
  "Low Glute Bridges": {
    cycleGap: 6,
    cues: [
      "Breathe in, get ready.",
      "Now breathe out and squeeze your bum, lift your hips just a little.",
      "Hold... two... breathe naturally.",
      "Breathe in as you lower down slowly. Don't drop.",
      "Again — breathe out, lift up. Squeeze.",
      "Breathe in, come back down. You're stronger than you think.",
    ],
  },
  "Modified Dead Bug": {
    cycleGap: 8,
    cues: [
      "Breathe in, arms reach up.",
      "Breathe out as you lower one arm slowly toward the floor behind you.",
      "Keep your back pressed down — don't let it lift off the mat.",
      "Breathe in as you bring the arm back up.",
      "Switch sides. Breathe out, lower the other arm.",
      "Slow and steady, mama. This is real work.",
    ],
  },
  "Seated TVA Contractions": {
    cycleGap: 7,
    cues: [
      "Sit up tall, breathe in deeply...",
      "Breathe out, gently pull your lower tummy in and up — like a soft hug around your waist.",
      "Hold for five seconds. Two... three... four... five. Release.",
      "Breathe in again, ribs expanding.",
      "And out, draw in gently. Don't suck in hard — just a kind hug.",
      "Beautiful. This is the muscle that holds you together.",
    ],
  },
  "Side-Lying Clamshells": {
    cycleGap: 5,
    cues: [
      "Breathe in.",
      "Breathe out, slowly open your top knee like a clam shell.",
      "Keep your hips stacked — don't let them roll back.",
      "Breathe in, close gently.",
      "And again — breathe out, open. Breathe in, close.",
      "Feel your bum muscles working. That's exactly what we want.",
    ],
  },
  // ── Intermediate ──────────────────────────────────────────────────────
  "Unsupported Heel Slides": {
    cycleGap: 7,
    cues: [
      "Breathe in to set yourself.",
      "Now breathe out, slide your heel out. Slow as honey.",
      "Keep your back glued to the mat — no arching.",
      "Breathe in, slide it back.",
      "Switch sides. You're doing it perfectly.",
      "If your back wants to lift, make the slide smaller. Listen to your body.",
    ],
  },
  "Dead Bug (Legs Only)": {
    cycleGap: 7,
    cues: [
      "Knees above your hips. Breathe in.",
      "Breathe out, lower one foot toward the floor. Just a tap.",
      "Breathe in, bring it back up.",
      "Other side — breathe out, lower.",
      "Breathe in, return.",
      "Your tummy stays braced the whole time. Beautiful.",
    ],
  },
  "Bird-Dog (Alt. Arm & Leg)": {
    cycleGap: 8,
    cues: [
      "On your hands and knees. Breathe in to centre.",
      "Breathe out, extend the opposite arm and leg until they're straight.",
      "Hold three seconds. Don't let your back sag.",
      "Breathe in, bring them back.",
      "Switch sides. Breathe out, extend.",
      "Imagine balancing a cup of tea on your lower back. Steady.",
    ],
  },
  "Bent-Knee Fall Outs": {
    cycleGap: 6,
    cues: [
      "Breathe in.",
      "Breathe out, slowly drop one knee out to the side.",
      "Only as far as your hips can stay still. Don't twist.",
      "Breathe in, bring it back.",
      "Other side. Slow control.",
      "Your tummy is doing all the work here, my love.",
    ],
  },
  "Modified Side Plank (Knees)": {
    cycleGap: 5,
    cues: [
      "Breathe steadily — no holding.",
      "Lift your hips and hold strong.",
      "Stay long from head to knees. No sagging.",
      "Breathe in... breathe out... keep going.",
      "Almost there. You're stronger than you know.",
      "Beautiful hold. Now release gently.",
    ],
  },
  "Seated Heel Taps": {
    cycleGap: 4,
    cues: [
      "Sit tall, feet lifted.",
      "Breathe out, tap one heel down.",
      "Breathe in, lift back.",
      "Breathe out, tap the other.",
      "Keep your back long, not hunched.",
      "You're firing up your deep core. Excellent.",
    ],
  },
  "Wall Squats with TVA Hold": {
    cycleGap: 8,
    cues: [
      "Slide down the wall until your thighs are level.",
      "Breathe in deeply...",
      "Breathe out, gently pull your tummy in. Hold five seconds.",
      "Two... three... four... five. Release.",
      "Breathe naturally through the squat.",
      "Slide back up. Beautiful work.",
    ],
  },
  // ── Advanced ──────────────────────────────────────────────────────────
  "Full Dead Bug (Opp. Arm & Leg)": {
    cycleGap: 8,
    cues: [
      "Breathe in to prepare.",
      "Breathe out fully — extend opposite arm and leg.",
      "Don't let your back peel up. Press it down hard.",
      "Breathe in, bring them home.",
      "Switch sides. Smooth, controlled.",
      "This is your strength returning. Feel it.",
    ],
  },
  "Full Bird-Dog": {
    cycleGap: 8,
    cues: [
      "Hands under shoulders, knees under hips.",
      "Breathe out, extend opposite arm and leg fully.",
      "Reach long through your fingers and toes. Hold three.",
      "Breathe in, return.",
      "Other side, breathe out, extend.",
      "Stay level. No swaying. Beautiful.",
    ],
  },
  "Full Side Plank (From Feet)": {
    cycleGap: 5,
    cues: [
      "Stack your feet. Lift your hips strong.",
      "Breathe steadily — short out-breaths every few seconds.",
      "Stay long. Don't let your hips dip.",
      "Halfway through. You're doing this.",
      "Almost there. Hold strong.",
      "Beautiful — release slowly.",
    ],
  },
  "Elevated Single-Leg Bridges": {
    cycleGap: 6,
    cues: [
      "One leg extended. Breathe in.",
      "Breathe out, drive your heel down and lift your hips.",
      "Hold two seconds. Don't let the other hip drop.",
      "Breathe in, lower with control.",
      "Again — breathe out, lift.",
      "Squeeze that bum. Power through.",
    ],
  },
  "Modified Front Plank": {
    cycleGap: 5,
    cues: [
      "Forearms down, knees down.",
      "Pull your tummy up toward your spine — make a little hollow.",
      "Breathe short, steady breaths. Never hold.",
      "Halfway. Stay strong.",
      "Don't let your hips lift up or sag down. Stay level.",
      "Almost done. Beautiful.",
    ],
  },
  "Standing Paloff Press": {
    cycleGap: 6,
    cues: [
      "Hold the band at your chest. Breathe in.",
      "Breathe out, press your hands straight forward. Resist the pull.",
      "Hold two seconds. Don't let your body twist.",
      "Breathe in, bring it back.",
      "Again — slow press out.",
      "Your core is fighting against rotation. That's the magic.",
    ],
  },
  "Single-Leg Balance + Bracing": {
    cycleGap: 6,
    cues: [
      "Stand on one leg. Soft knee.",
      "Breathe naturally. Gently pull your tummy in.",
      "Stay grounded. You can do thirty seconds.",
      "Halfway. Beautiful balance.",
      "Almost there.",
      "Switch legs. You've got this.",
    ],
  },
};

// ── Plain-language posture corrections (warm, body-relatable, no jargon) ─
const PLAIN_CORRECTIONS = {
  spineArching: [
    "Press your lower back down into the mat, mama. Imagine you're trying to squeeze a coin between your back and the floor.",
    "Your back is lifting a bit — gently push it down flat. There. Much better.",
    "Soften your back into the mat, my love. Let it melt down.",
  ],
  pelvicTilt: [
    "Your hips are leaning to one side — try to keep them even, like you're lying perfectly flat on a tray.",
    "Bring your hips back to centre, sweetheart. Even and balanced.",
    "Don't let one hip drop. Keep them level, both kissing the mat the same way.",
  ],
  breathHolding: [
    "Don't forget to breathe, my love. Open your mouth a little and let the air flow out.",
    "Keep breathing, mama. Hold your breath, you hold your tension. Let it flow.",
    "I can hear you holding your breath. Breathe steady — your body needs that air.",
  ],
  lowLight: [], // populated dynamically with user name
};
// ─────────────────────────────────────────────────────────────────────────────
// MEDIAPIPE POSE TRACKING — On-device computer vision
// ─────────────────────────────────────────────────────────────────────────────
// Loads MediaPipe Pose from the official Google CDN. Runs locally on the user's
// device — no video frames ever leave the phone. Throttled to ~8 FPS for budget
// phones. Includes low-light detection via landmark confidence scoring.

const MP_POSE_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/";

// Landmark indices from MediaPipe Pose (33-point skeleton)
const MP_LM = {
  LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12,
  LEFT_HIP: 23, RIGHT_HIP: 24,
  LEFT_KNEE: 25, RIGHT_KNEE: 26,
  NOSE: 0,
};

// Loads MediaPipe scripts once and caches the Pose constructor
let _mpPosePromise = null;
function loadMediaPipePose() {
  if (_mpPosePromise) return _mpPosePromise;
  _mpPosePromise = new Promise((resolve, reject) => {
    if (window.Pose) { resolve(window.Pose); return; }
    const script = document.createElement("script");
    script.src = `${MP_POSE_CDN}pose.js`;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      // Pose attaches to window
      if (window.Pose) resolve(window.Pose);
      else reject(new Error("MediaPipe Pose did not initialise."));
    };
    script.onerror = () => reject(new Error("Could not load MediaPipe from CDN."));
    document.head.appendChild(script);
  });
  return _mpPosePromise;
}

// Geometric helper: angle at point B formed by A-B-C (in degrees)
function angleAt(a, b, c) {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.hypot(ab.x, ab.y);
  const magCB = Math.hypot(cb.x, cb.y);
  if (magAB === 0 || magCB === 0) return 180;
  return (Math.acos(Math.min(1, Math.max(-1, dot / (magAB * magCB)))) * 180) / Math.PI;
}

// Midpoint between two landmarks
function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

// ─────────────────────────────────────────────────────────────────────────────
// usePracticeSession — Main session hook with real AI tracking
// ─────────────────────────────────────────────────────────────────────────────
function usePracticeSession(exercise, userName = "love") {
  const [phase, setPhase]               = useState("countdown");
  const [countdown, setCount]           = useState(3);
  const [elapsed, setElapsed]           = useState(0);
  const [formScore, setScore]           = useState(100);
  const [breathPhase, setBP]            = useState("inhale");
  const [correction, setCorr]           = useState(null);
  const [postureError, setPostureError] = useState(false);
  const [camGranted, setCam]            = useState(false);
  const [trackingStatus, setTrackStatus] = useState("loading"); // loading | tracking | low-light | error
  const cameraRef                       = useRef(null);
  const streamRef                       = useRef(null);
  const poseRef                         = useRef(null);
  const intervalRef                     = useRef(null);
  const torsoHistoryRef                 = useRef([]);
  const corrCooldownsRef                = useRef({});
  const breathHoldRef                   = useRef(0);

  // ── VOICE ENGINE — ElevenLabs Tolani.kore with browser fallback ──────────
  // Talks to /api/voice (Vercel serverless function) which proxies ElevenLabs
  // so the API key NEVER appears in client code. Falls back to browser TTS if
  // the serverless function fails (offline, error, or running on localhost).
  const audioRef          = useRef(null);
  const voiceQueueRef     = useRef([]);
  const voiceIsSpeakingRef = useRef(false);
  const voiceSynth        = typeof window !== "undefined" ? window.speechSynthesis : null;

  // Browser voice fallback (only used if ElevenLabs fails)
  const speakBrowser = useCallback((text) => {
    if (!voiceSynth) return;
    voiceSynth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.88; u.pitch = 1.05; u.volume = 1.0;
    const voices = voiceSynth.getVoices();
    const v = voices.find(v => v.lang.startsWith("en-GB") || v.name.includes("Samantha") || v.name.includes("Karen")) || voices[0];
    if (v) u.voice = v;
    voiceSynth.speak(u);
  }, [voiceSynth]);

  // Plays next queued audio
  const playNextInQueue = useCallback(async () => {
    if (voiceQueueRef.current.length === 0) { voiceIsSpeakingRef.current = false; return; }
    voiceIsSpeakingRef.current = true;
    const text = voiceQueueRef.current.shift();
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Voice API non-200");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = url;
      audioRef.current.onended = () => { URL.revokeObjectURL(url); playNextInQueue(); };
      audioRef.current.onerror = () => { URL.revokeObjectURL(url); playNextInQueue(); };
      await audioRef.current.play();
    } catch (err) {
      // Fallback to browser TTS
      speakBrowser(text);
      // Wait roughly enough for the browser voice, then proceed
      setTimeout(() => playNextInQueue(), Math.min(8000, text.length * 75));
    }
  }, [speakBrowser]);

  const speak = useCallback((text, priority = "normal") => {
    if (!text) return;
    if (priority === "high") {
      // Interrupt: stop current audio, clear queue, speak immediately
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
      voiceQueueRef.current = [text];
      voiceIsSpeakingRef.current = false;
      voiceSynth?.cancel();
      playNextInQueue();
    } else {
      voiceQueueRef.current.push(text);
      if (!voiceIsSpeakingRef.current) playNextInQueue();
    }
  }, [playNextInQueue, voiceSynth]);

  // ── TOLANI INTRO SCRIPT — Plays for 5-10 seconds at exercise start ────────
  useEffect(() => {
    if (phase === "countdown" && countdown === 1) {
      // Intro script plays as countdown ends
      if (exercise.tolaniIntro) {
        speak(exercise.tolaniIntro, "high");
      }
    }
  }, [phase, countdown, exercise.tolaniIntro]);
  useEffect(() => () => {
    // CRITICAL: Stop Tolani from continuing to speak after user exits
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    voiceQueueRef.current = [];
    voiceIsSpeakingRef.current = false;
    voiceSynth?.cancel();
    // Also cancel MediaPipe interval
    if (intervalRef.current) clearInterval(intervalRef.current);
    // Cleanup breath coaching timers if they exist
    if (window._breathTimer) clearInterval(window._breathTimer);
  }, [voiceSynth]);

  // Speak a correction respecting per-type cooldown (prevent repeating same cue)
  const speakCorrection = useCallback((type, message) => {
    const now = Date.now();
    if (corrCooldownsRef.current[type] && now - corrCooldownsRef.current[type] < 8000) return;
    corrCooldownsRef.current[type] = now;
    setCorr(message);
    speak(message);
    setPostureError(true);
    setTimeout(() => { setCorr(null); setPostureError(false); }, 5000);
  }, [speak]);

  // ── 1. CAMERA INIT ───────────────────────────────────────────────────────
  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        streamRef.current = stream;
        if (cameraRef.current) {
          cameraRef.current.srcObject = stream;
          await cameraRef.current.play().catch(() => {});
        }
        setCam(true);
      } catch (err) {
        setCam(false);
        setTrackStatus("error");
      }
    })();
    cleanup = () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (poseRef.current?.close) poseRef.current.close();
    };
    return cleanup;
  }, []);

  // ── 2. MEDIAPIPE INIT (runs once camera is ready) ─────────────────────────
  useEffect(() => {
    if (!camGranted || phase !== "active") return;
    let cancelled = false;

    (async () => {
      try {
        setTrackStatus("loading");
        const Pose = await loadMediaPipePose();
        if (cancelled) return;

        const pose = new Pose({
          locateFile: (file) => `${MP_POSE_CDN}${file}`,
        });
        pose.setOptions({
          modelComplexity: 0,         // lite — best for budget phones
          smoothLandmarks: true,
          enableSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        pose.onResults((results) => {
          if (cancelled) return;
          analyzePose(results);
        });

        poseRef.current = pose;
        setTrackStatus("tracking");

        // ── 3. THROTTLED PROCESSING LOOP — 8 FPS (~125 ms interval) ─────────
        // This is far cheaper than processing every frame (~30 FPS) and is
        // smooth enough for posture detection while preserving battery.
        intervalRef.current = setInterval(async () => {
          if (cancelled || !cameraRef.current || cameraRef.current.readyState < 2) return;
          try {
            await pose.send({ image: cameraRef.current });
          } catch (e) {
            // swallow transient errors — they happen during teardown
          }
        }, 125);
      } catch (err) {
        if (!cancelled) {
          setTrackStatus("error");
          // Fall back to simulated tracking so the demo still works
          startSimulatedFallback();
        }
      }
    })();

    return () => { cancelled = true; if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [camGranted, phase]);

  // ── 4. POSE ANALYSIS — runs on every MediaPipe result (~8x per second) ───
  function analyzePose(results) {
    const lm = results.poseLandmarks;

    // ── LOW-LIGHT / NO-DETECTION FAIL-SAFE ──────────────────────────────
    // MediaPipe returns null landmarks when it can't detect a body, often
    // because of poor lighting. Each landmark also has a `visibility` score.
    if (!lm || lm.length < 29) {
      handleLowLight();
      return;
    }

    // Compute mean visibility of the core landmarks we care about
    const coreIndices = [MP_LM.LEFT_SHOULDER, MP_LM.RIGHT_SHOULDER, MP_LM.LEFT_HIP, MP_LM.RIGHT_HIP, MP_LM.LEFT_KNEE, MP_LM.RIGHT_KNEE];
    const meanVis = coreIndices.reduce((s, i) => s + (lm[i]?.visibility || 0), 0) / coreIndices.length;

    if (meanVis < 0.5) {
      handleLowLight();
      return;
    }

    // Tracking is healthy
    if (trackingStatus !== "tracking") setTrackStatus("tracking");
    breathHoldRef.current = 0; // reset low-light counter on good detection

    // ── ANGLE CALCULATION: Shoulder → Hip → Knee ────────────────────────
    // Measures the angle at the hip joint. In a neutral spine, this should
    // be ~160-180° (a near-straight line from shoulder through hip to knee).
    // Excessive arching produces a smaller angle (the torso leans back).
    const midShoulder = midpoint(lm[MP_LM.LEFT_SHOULDER], lm[MP_LM.RIGHT_SHOULDER]);
    const midHip      = midpoint(lm[MP_LM.LEFT_HIP],      lm[MP_LM.RIGHT_HIP]);
    const midKnee     = midpoint(lm[MP_LM.LEFT_KNEE],     lm[MP_LM.RIGHT_KNEE]);
    const spineAngle  = angleAt(midShoulder, midHip, midKnee);

    // ── PELVIC TILT: vertical difference between left and right hip ─────
    const hipLevelDiff = Math.abs(lm[MP_LM.LEFT_HIP].y - lm[MP_LM.RIGHT_HIP].y);

    // ── BREATHING RHYTHM PROXY: torso height oscillation ────────────────
    const torsoHeight = Math.abs(midShoulder.y - midHip.y);
    torsoHistoryRef.current.push(torsoHeight);
    if (torsoHistoryRef.current.length > 16) torsoHistoryRef.current.shift(); // ~2s @ 8fps
    const torsoRange = Math.max(...torsoHistoryRef.current) - Math.min(...torsoHistoryRef.current);
    const isBreathing = torsoRange > 0.008;
    setBP(torsoHistoryRef.current.length > 1 && torsoHistoryRef.current[torsoHistoryRef.current.length - 1] > torsoHistoryRef.current[0] ? "inhale" : "exhale");

    // ── DETECT ISSUES AND FIRE CORRECTIONS ──────────────────────────────
    let penalty = 0;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Spine arching: angle drops too low (torso bent backward at hip)
    if (spineAngle < 145) {
      penalty += 20;
      speakCorrection("spineArching", pick(PLAIN_CORRECTIONS.spineArching));
    }

    // Pelvic tilt: hips visibly uneven
    if (hipLevelDiff > 0.06) {
      penalty += 15;
      speakCorrection("pelvicTilt", pick(PLAIN_CORRECTIONS.pelvicTilt));
    }

    // Breath holding: no torso movement for ~2 seconds
    if (!isBreathing && torsoHistoryRef.current.length === 16) {
      breathHoldRef.current++;
      if (breathHoldRef.current > 8) {
        penalty += 12;
        speakCorrection("breathHolding", pick(PLAIN_CORRECTIONS.breathHolding));
      }
    } else {
      breathHoldRef.current = 0;
    }

    setScore(Math.max(0, 100 - penalty));
  }

  // ── LOW-LIGHT HANDLER ────────────────────────────────────────────────────
  function handleLowLight() {
    if (trackingStatus !== "low-light") {
      setTrackStatus("low-light");
      const msg = `It's a bit dark, ${userName} — try moving to a brighter spot so I can see you clearly.`;
      // Only speak this once per cooldown window
      speakCorrection("lowLight", msg);
    }
  }

  // ── FALLBACK: If MediaPipe fails to load, use the simulated tracker ──────
  function startSimulatedFallback() {
    let frame = 0;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const tick = () => {
      frame++;
      setBP(Math.sin(frame / 18) > 0 ? "inhale" : "exhale");
      const r = Math.random();
      if (r > 0.97) speakCorrection("spineArching", pick(PLAIN_CORRECTIONS.spineArching));
      if (r < 0.02) speakCorrection("breathHolding", pick(PLAIN_CORRECTIONS.breathHolding));
      setScore(Math.max(0, 100 - (r > 0.96 ? 18 : 0)));
    };
    intervalRef.current = setInterval(tick, 200);
  }

  // ── COUNTDOWN ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown === 3) speak("Take a moment to get into position. Whenever you're ready, let's begin.", "high");
    if (countdown <= 0) { setPhase("active"); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, phase]);

  // ── EXERCISE TIMER ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "active") return;

    // ── BREATH COACHING — Tolani speaks rhythmic cues throughout ────────
    // Pulls per-exercise script from BREATH_COACHING and loops through cues
    // at the exercise's natural rep tempo.
    const breathScript = BREATH_COACHING[exercise.name];
    let breathTimer = null;
    let breathCueIndex = 0;
    if (breathScript) {
      // First cue 2 seconds in (after countdown ends)
      const fireBreathCue = () => {
        const cue = breathScript.cues[breathCueIndex % breathScript.cues.length];
        speak(cue);
        breathCueIndex++;
      };
      const startDelay = setTimeout(() => {
        fireBreathCue();
        breathTimer = setInterval(fireBreathCue, breathScript.cycleGap * 1000);
      }, 2000);
      // Cleanup includes startDelay
      var cleanupBreath = () => { clearTimeout(startDelay); if (breathTimer) clearInterval(breathTimer); };
    }

    const timer = setInterval(() => {
      setElapsed(e => {
        if (e + 1 >= exercise.duration) {
          clearInterval(timer);
          if (cleanupBreath) cleanupBreath();
          if (intervalRef.current) clearInterval(intervalRef.current);
          setPhase("rest");
          speak("Wonderful. That's one exercise complete. Take a gentle breath.", "high");
          return e + 1;
        }
        return e + 1;
      });
    }, 1000);
    return () => { clearInterval(timer); if (cleanupBreath) cleanupBreath(); };
  }, [phase, exercise.duration, exercise.name]);

  return {
    phase, setPhase, countdown, elapsed, formScore, breathPhase,
    correction, postureError, camGranted, cameraRef, speak, trackingStatus,
  };
}

// ── Session screen ─────────────────────────────────────────────────────────
function SessionScreen({ exercise, levelData, sessionList, currentIdx, onNext, onExit, userName = "love" }) {
  const { phase, setPhase, countdown, elapsed, formScore, breathPhase, correction, camGranted, cameraRef, speak, trackingStatus } = usePracticeSession(exercise, userName);
  const [workoutMode, setWorkoutMode] = useState("manual"); // manual | automatic
  const [nextExerciseBuffer, setNextBuffer] = useState(null); // countdown to next
  const scoreColor = formScore >= 80 ? SAGE_DARK : formScore >= 60 ? "#B45309" : "#DC2626";
  const progress = exercise.duration > 0 ? elapsed / exercise.duration : 0;

  // Tracking badge style
  const trackingBadge = {
    "loading":    { color: "#FCD34D", label: "Loading AI" },
    "tracking":   { color: "#4ADE80", label: "AI tracking" },
    "low-light":  { color: "#FB923C", label: "Low light" },
    "error":      { color: "#EF4444", label: "Limited" },
  }[trackingStatus] || { color: "#94A3B8", label: "Ready" };

  // Auto-transition logic: when exercise ends, in auto mode, wait 5s then go to next
  useEffect(() => {
    if (phase === "rest" && workoutMode === "automatic" && nextExerciseBuffer === null) {
      speak("Get ready for the next one, love.", "high");
      let countdown = 5;
      setNextBuffer(countdown);
      const timer = setInterval(() => {
        countdown--;
        setNextBuffer(countdown);
        if (countdown === 0) {
          clearInterval(timer);
          onNext();
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase, workoutMode, nextExerciseBuffer]);

  // Rest auto-advance
  useEffect(() => {
    if (phase !== "rest") return;
    const t = setTimeout(() => {
      if (currentIdx < sessionList.length - 1) onNext();
      else { setPhase("complete"); speak("That is your session complete, mama. I am so proud of you for showing up today."); }
    }, 8000);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "countdown") return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: PLUM_LIGHT, marginBottom: 16 }}>{exercise.name}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 96, color: WHITE }}>{countdown || "Go"}</div>
      <div style={{ fontSize: 13, color: TEXT_LIGHT, marginTop: 8 }}>Get into position</div>
    </div>
  );

  if (phase === "complete") return (
    <div style={{ background: CREAM, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: SAGE, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={SAGE_DARK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: TEXT_DARK, marginBottom: 10 }}>Session complete.</h2>
      <p style={{ fontSize: 15, color: TEXT_MID, lineHeight: 1.7, maxWidth: 280, marginBottom: 32 }}>Your body worked beautifully today. Every movement is healing you from within.</p>
      <button onClick={onExit} style={{ padding: "14px 36px", borderRadius: 50, background: PLUM, border: "none", color: WHITE, fontFamily: "'Playfair Display', serif", fontSize: 16, cursor: "pointer" }}>Done</button>
    </div>
  );

  return (
    <div style={{ background: "#0D0D0D", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Video area */}
      <div style={{ flex: 1, position: "relative", background: `linear-gradient(160deg, ${levelData.bgColor}18, #111)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: WHITE, opacity: 0.8 }}>{exercise.name}</div>
          <div style={{ fontSize: 13, color: PLUM_LIGHT, marginTop: 4 }}>Instructor video</div>
        </div>

        {/* Exit */}
        <button onClick={onExit} style={{ position: "absolute", top: 16, left: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* Form score */}
        <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.65)", borderRadius: 12, padding: "8px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: PLUM_LIGHT, marginBottom: 2 }}>FORM</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: scoreColor }}>{formScore}</div>
        </div>

        {/* PiP camera */}
        <div style={{ position: "absolute", bottom: 16, right: 16, width: 96, height: 136, borderRadius: 14, overflow: "hidden", border: `2px solid ${camGranted ? (formScore >= 80 ? SAGE_DARK : "#B45309") : BORDER}` }}>
          {camGranted
            ? <video ref={cameraRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
            : <div style={{ width: "100%", height: "100%", background: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={TEXT_LIGHT} strokeWidth="1.5"><path d="M1 1l22 22M17 17H3a2 2 0 01-2-2V7a2 2 0 012-2h3m3-3h6l2 2h4a2 2 0 012 2v9.34"/></svg>
                <span style={{ fontSize: 9, color: TEXT_LIGHT, textAlign: "center", padding: "0 6px" }}>Enable camera for AI tracking</span>
              </div>
          }
          {camGranted && (
            <div style={{ position: "absolute", top: 5, left: 5, background: "rgba(0,0,0,0.7)", borderRadius: 6, padding: "2px 6px", display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: trackingBadge.color, animation: trackingStatus === "loading" ? "pulse 1s infinite" : "none" }} />
              <span style={{ color: WHITE, fontSize: 8 }}>{trackingBadge.label}</span>
            </div>
          )}
        </div>

        {/* Correction toast */}
        {correction && phase === "active" && (
          <div style={{ position: "absolute", top: 60, left: 12, right: 12, background: "rgba(180,83,9,0.92)", borderRadius: 12, padding: "10px 14px", display: "flex", gap: 8, animation: "toastIn 0.3s ease" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2" strokeLinecap="round" style={{ marginTop: 2, flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <span style={{ fontSize: 13, color: WHITE, lineHeight: 1.5 }}>{correction}</span>
          </div>
        )}
      </div>

      {/* Instruction Panel */}
      <div style={{ background: CREAM, padding: "16px 16px 0", maxHeight: 280, overflowY: "auto" }}>
        <InstructionPanel exercise={exercise} />
      </div>

      {/* Controls */}
      <div style={{ background: "#0D0D0D", padding: "14px 20px 28px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: WHITE }}>{exercise.name}</span>
            <span style={{ fontSize: 13, color: TEXT_LIGHT }}>{phase === "active" ? `${exercise.duration - elapsed}s left` : "Rest · next exercise soon"}</span>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
            <div style={{ height: "100%", width: `${progress * 100}%`, background: PLUM_LIGHT, borderRadius: 3, transition: "width 1s linear" }} />
          </div>
        </div>

        {/* Breathing dot */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: PLUM_LIGHT, animation: breathPhase === "inhale" ? "breatheIn 2s ease-in-out forwards" : "breatheOut 2s ease-in-out forwards" }} />
          <span style={{ fontSize: 12, color: TEXT_LIGHT }}>{breathPhase === "inhale" ? "Inhale..." : "Exhale..."}</span>
        </div>

        {/* Mode toggle (only show after first exercise) */}
        {phase === "rest" && currentIdx > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => setWorkoutMode("manual")}
              style={{
                flex: 1,
                padding: "10px 12px",
                background: workoutMode === "manual" ? PLUM : "rgba(255,255,255,0.08)",
                color: WHITE,
                border: "none",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Manual
            </button>
            <button
              onClick={() => setWorkoutMode("automatic")}
              style={{
                flex: 1,
                padding: "10px 12px",
                background: workoutMode === "automatic" ? PLUM : "rgba(255,255,255,0.08)",
                color: WHITE,
                border: "none",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Auto
            </button>
          </div>
        )}

        {/* Manual next button or auto countdown */}
        {phase === "rest" && currentIdx < sessionList.length - 1 && (
          nextExerciseBuffer !== null && workoutMode === "automatic" ? (
            <div style={{ textAlign: "center", fontSize: 14, color: PLUM_LIGHT, marginBottom: 10, fontWeight: 600 }}>
              Next in {nextExerciseBuffer}...
            </div>
          ) : workoutMode === "manual" ? (
            <button
              onClick={onNext}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: PLUM,
                color: WHITE,
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: 10,
                transition: "all 0.2s",
              }}
            >
              Next Exercise
            </button>
          ) : null
        )}

        {/* Exit button */}
        {(phase === "rest" || currentIdx === sessionList.length - 1) && (
          <button
            onClick={onExit}
            style={{
              width: "100%",
              padding: "10px 16px",
              background: "rgba(255,255,255,0.1)",
              color: TEXT_LIGHT,
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Exit Session
          </button>
        )}

        {/* Exercise dots */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          {sessionList.map((_, i) => <div key={i} style={{ width: i === currentIdx ? 20 : 7, height: 7, borderRadius: 4, background: i < currentIdx ? PLUM_LIGHT : i === currentIdx ? PLUM_PALE : "rgba(255,255,255,0.15)", transition: "all 0.3s" }} />)}
        </div>
      </div>
    </div>
  );
}

// ── Instruction Panel Component ────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────
function ExerciseVideoPlayer({ exercise, cameraRef, trackingStatus }) {
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const videoRef = useRef(null);

  const getLoopCount = () => {
    const parts = exercise.reps.split("×");
    if (parts.length === 2) {
      const multiplier = parseInt(parts[1].trim().split(/\s+/)[0]);
      return multiplier || 1;
    }
    const numMatch = exercise.reps.match(/(\d+)/);
    return numMatch ? parseInt(numMatch[1]) : 1;
  };

  const loopCount = getLoopCount();
  const videoPath = `/videos/${exercise.videoFile}`;

  const handleVideoEnd = () => {
    if (videoRef.current) {
      const loopsCompleted = Math.floor(videoRef.current.currentTime / videoRef.current.duration);
      if (loopsCompleted < loopCount) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: 0, paddingBottom: "56.25%", background: "#1a1a1a", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
      <video ref={videoRef} src={videoPath} autoPlay playsInline muted onEnded={handleVideoEnd} onLoadedData={() => setVideoLoading(false)} onError={() => { setVideoError(true); setVideoLoading(false); }} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", bottom: 12, right: 12, width: "120px", height: "160px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.9)", background: "#000", overflow: "hidden", zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
        <video ref={cameraRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
        <div style={{ position: "absolute", top: 4, left: 4, background: "rgba(0,0,0,0.7)", color: trackingStatus === "tracking" ? "#4ADE80" : "#FCD34D", fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4 }}>● {trackingStatus === "tracking" ? "Tracking" : "Ready"}</div>
      </div>
      {videoLoading && <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: `linear-gradient(90deg, #222 25%, #333 50%, #222 75%)`, backgroundSize: "200% 100%", animation: "shimmer 2s infinite" }} />}
      {videoError && <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)", color: "white", textAlign: "center", padding: 20 }}><div><div style={{ fontSize: 32, marginBottom: 8 }}>🎬</div><p style={{ fontSize: 13, marginBottom: 4 }}>Video not available yet</p></div></div>}
      <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.7)", color: PLUM_LIGHT, fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 20, zIndex: 5 }}>{loopCount > 1 ? `${loopCount} loops` : "Play once"}</div>
    </div>
  );
}

function InstructionPanel({ exercise }) {
  const [expanded, setExpanded] = useState(true);
  
  return (
    <div style={{ background: WHITE, borderRadius: 12, border: `1px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "14px 16px",
          background: PLUM_PALE,
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 14,
          fontWeight: 600,
          color: PLUM_DARK,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <span>📋 Step-by-step instructions</span>
        <span style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>▼</span>
      </button>
      {expanded && (
        <div style={{ padding: "16px" }}>
          {exercise.steps?.map((step, i) => (
            <div key={i} style={{ marginBottom: i === exercise.steps.length - 1 ? 0 : 12, fontSize: 13, color: TEXT_DARK, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ fontWeight: 600, color: PLUM }}>{step.split(":")[0]}:</span> {step.split(":").slice(1).join(":").trim()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function PracticeTab({ userData }) {
  const [view, setView]         = useState("library");
  const [activeLevel, setLevel] = useState("beginner");
  const [selected, setSelected] = useState(null);
  const [sessionList, setSessionList] = useState([]);
  const [sessionIdx, setSessionIdx]   = useState(0);
  const userName = userData?.name || "love";

  const levelData = EXERCISE_LEVELS_8[activeLevel];

  function startSession(lvl) {
    const list = EXERCISE_LEVELS_8[lvl].exercises;
    setSessionList(list); setSessionIdx(0); setSelected(list[0]); setView("session");
  }
  function startSingle(ex) { setSessionList([ex]); setSessionIdx(0); setSelected(ex); setView("session"); }

  if (view === "detail" && selected) return (
    <div style={{ background: CREAM, minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => setView("library")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: TEXT_MID, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TEXT_MID} strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </button>
      </div>
      <div style={{ margin: "0 20px", borderRadius: 20, background: `linear-gradient(160deg, ${EXERCISE_LEVELS_8[selected.level].bgColor}, ${CREAM_DARK})`, height: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 20, border: `1px solid ${EXERCISE_LEVELS_8[selected.level].color}33`, position: "relative" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: EXERCISE_LEVELS_8[selected.level].color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={WHITE}><polygon points="5,3 19,12 5,21"/></svg>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: EXERCISE_LEVELS_8[selected.level].color }}>{selected.name}</div>
        <div style={{ fontSize: 12, color: TEXT_MID, marginTop: 4 }}>Guided video · {selected.duration}s</div>
        <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.4)", borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
          <span style={{ color: WHITE, fontSize: 11 }}>AI tracking ready</span>
        </div>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div style={{ background: WHITE, borderRadius: 16, border: `1px solid ${BORDER}`, padding: "16px 18px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Reps</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: TEXT_DARK }}>{selected.reps}</div>
        </div>
        <button onClick={() => startSingle(selected)} style={{ width: "100%", padding: "15px", borderRadius: 50, background: PLUM, border: "none", color: WHITE, fontFamily: "'Playfair Display', serif", fontSize: 17, cursor: "pointer" }}>Begin Exercise</button>
      </div>
    </div>
  );

  if (view === "session" && selected) return (
    <SessionScreen
      exercise={selected}
      levelData={EXERCISE_LEVELS_8[selected.level]}
      sessionList={sessionList}
      currentIdx={sessionIdx}
      userName={userName}
      onNext={() => { const next = sessionIdx + 1; if (next < sessionList.length) { setSessionIdx(next); setSelected(sessionList[next]); } }}
      onExit={() => { setView("library"); setSelected(null); setSessionIdx(0); }}
    />
  );

  // ── Library view ─────────────────────────────────────────────────────────
  return (
    <div style={{ background: CREAM, paddingBottom: 80 }}>
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Exercise library</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: TEXT_DARK, marginBottom: 6 }}>Your healing programme</h1>
        <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6, marginBottom: 20 }}>21 clinically approved exercises, guided by real-time AI posture tracking.</p>
      </div>

      {/* Level tabs */}
      <div style={{ padding: "0 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(EXERCISE_LEVELS_8).map(([key, d]) => (
            <button key={key} onClick={() => setLevel(key)} style={{ flex: 1, padding: "10px 6px", borderRadius: 12, border: `1.5px solid ${activeLevel === key ? d.color : BORDER}`, background: activeLevel === key ? d.bgColor : WHITE, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: activeLevel === key ? d.color : TEXT_MID, transition: "all 0.15s" }}>
              {d.label}
              <div style={{ fontSize: 10, marginTop: 2, color: activeLevel === key ? d.color : TEXT_LIGHT }}>{d.weeks}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Level badge */}
      <div style={{ margin: "0 20px 14px", background: levelData.bgColor, borderRadius: 14, padding: "12px 16px", border: `1px solid ${levelData.color}22` }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: levelData.color, marginBottom: 2 }}>{levelData.sublabel}</div>
        <div style={{ fontSize: 13, color: TEXT_MID }}>{levelData.weeks} · {levelData.exercises.length} exercises</div>
      </div>

      {/* Start session */}
      <div style={{ padding: "0 20px 14px" }}>
        <button onClick={() => startSession(activeLevel)} style={{ width: "100%", padding: "14px", borderRadius: 50, background: PLUM, border: "none", color: WHITE, fontFamily: "'Playfair Display', serif", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={WHITE}><polygon points="5,3 19,12 5,21"/></svg>
          Start {levelData.label} Session
        </button>
      </div>

      {/* Exercise list */}
      <div style={{ padding: "0 20px" }}>
        {levelData.exercises.map(ex => (
          <div key={ex.id} onClick={() => { setSelected(ex); setView("detail"); }} style={{ background: WHITE, borderRadius: 16, border: `1px solid ${BORDER}`, padding: "14px 16px", marginBottom: 10, cursor: "pointer", display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 50, height: 50, borderRadius: 12, background: levelData.bgColor, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 17, color: levelData.color }}>{ex.order || levelData.exercises.indexOf(ex) + 1}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: TEXT_DARK, marginBottom: 3 }}>{ex.name}</div>
              <div style={{ fontSize: 12, color: TEXT_LIGHT }}>{ex.reps} · {ex.duration}s</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TEXT_LIGHT} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Check-in Tab ─────────────────────────────────────────────────────────────
function CheckinTab() {
  const [feeling, setFeeling] = useState("Pushing through");
  const [journal, setJournal] = useState("");
  const [gap, setGap] = useState("");
  const [assessStep, setAssessStep] = useState(1); // 1-4
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const feelings = ["Demotivated", "Overwhelmed", "Tired", "Pushing through", "Calm", "Happy", "Energized", "Stronger"];

  const assessmentSteps = [
    { num: 1, title: "Lie down comfortably", desc: "Find a flat surface. Lie on your back with knees bent and feet flat on the floor. Relax your shoulders.", icon: "knees" },
    { num: 2, title: "Locate your separation", desc: "Place your fingers horizontally above the navel, between the two sides of your rectus abdominis muscle.", icon: "hands" },
    { num: 3, title: "Measure your gap", desc: "Press gently and count how many fingers fit between the muscle bellies. Relax and repeat 2–3 times.", icon: "measure" },
    { num: 4, title: "Record your baseline", desc: "Write down the number. This is your starting point. We'll track progress together from here.", icon: "record" },
  ];

  const currentStep = assessmentSteps[assessStep - 1];

  return (
    <div style={{ padding: "24px 24px 0" }}>
      <div style={{ fontSize: 12, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>April 23 · Check-in</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: TEXT_DARK, marginBottom: 20 }}>How are you today?</h2>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase" }}>Self-assessment</div>
          <span style={{ background: SAGE, padding: "4px 12px", borderRadius: 20, fontSize: 12, color: TEXT_MID }}>Step {assessStep} / 4</span>
        </div>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <svg width={80} height={60} viewBox="0 0 80 60"><circle cx={40} cy={14} r={10} fill="none" stroke={PLUM_LIGHT} strokeWidth={1.5}/><ellipse cx={40} cy={42} rx={22} ry={10} fill="none" stroke={PLUM_LIGHT} strokeWidth={1.5}/><circle cx={40} cy={42} r={4} fill={SAGE_DARK}/></svg>
          <div style={{ fontSize: 12, color: TEXT_LIGHT }}>Knees bent · Back flat</div>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: TEXT_DARK, marginBottom: 8 }}>{currentStep.title}</h3>
        <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6, marginBottom: 16 }}>{currentStep.desc}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
          {[0, 1, 2, 3].map(i => <div key={i} style={{ width: i < assessStep ? 24 : 8, height: 4, borderRadius: 3, background: i < assessStep ? PLUM : CREAM_DARK, transition: "all 0.3s" }} />)}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {assessStep > 1 && (
            <button onClick={() => setAssessStep(assessStep - 1)} style={{ flex: 1, padding: "14px", borderRadius: 50, border: `1px solid ${BORDER}`, background: WHITE, fontSize: 14, fontWeight: 500, cursor: "pointer", color: TEXT_DARK }}>
              ‹ Back
            </button>
          )}
          <button onClick={() => assessStep < 4 ? setAssessStep(assessStep + 1) : null} style={{ flex: 1, padding: "14px", borderRadius: 50, background: assessStep === 4 ? SAGE : PLUM, color: WHITE, border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            {assessStep === 4 ? "✓ Complete" : "Next step ›"}
          </button>
        </div>
      </div>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase" }}>How are you feeling?</div>
          <div style={{ fontSize: 12, color: TEXT_LIGHT }}>Tap all that apply</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {feelings.map(f => { const sel = feeling === f; return <span key={f} onClick={() => setFeeling(f)} style={{ padding: "8px 16px", borderRadius: 20, cursor: "pointer", fontSize: 14, background: sel ? PLUM : WHITE, color: sel ? WHITE : TEXT_DARK, border: `1px solid ${sel ? PLUM : BORDER}`, fontFamily: "'DM Sans', sans-serif" }}>{f}</span>; })}
        </div>
      </div>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase" }}>Your private journal</div>
          <div style={{ fontSize: 12, color: TEXT_LIGHT }}>Only you can see this</div>
        </div>
        <p style={{ fontSize: 14, color: TEXT_MID, marginBottom: 12 }}>A safe space to write whatever's on your heart today, mama.</p>
        <textarea value={journal} onChange={e => setJournal(e.target.value)} placeholder="Today I feel..." style={{ width: "100%", minHeight: 100, border: "none", background: CREAM_DARK, borderRadius: 10, padding: "14px", fontSize: 14, color: TEXT_DARK, resize: "none", outline: "none", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }} />
      </div>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Abdominal measurement</div>
        <p style={{ fontSize: 14, color: TEXT_MID, marginBottom: 12 }}>Measure at the widest point above the navel.</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <input value={gap} onChange={e => setGap(e.target.value)} placeholder="Enter cm" style={{ flex: 1, padding: "13px 18px", borderRadius: 50, border: `1px solid ${BORDER}`, background: CREAM_DARK, fontSize: 15, color: TEXT_DARK, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
          <span style={{ fontSize: 14, color: TEXT_MID }}>cm</span>
        </div>
        <div style={{ fontSize: 12, color: TEXT_LIGHT, marginBottom: 14 }}>Last: 3.2 cm</div>
        <button onClick={() => setShowPhotoMenu(true)} style={{ width: "100%", background: SAGE, borderRadius: 10, padding: "12px 16px", border: "none", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={SAGE_DARK} strokeWidth="1.8"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <span style={{ fontSize: 13, color: TEXT_MID, fontFamily: "'DM Sans', sans-serif" }}>Attach a secure photo (on-device)</span>
        </button>
      </div>

      {/* Photo menu modal */}
      {showPhotoMenu && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", zIndex: 9999 }}>
          <div style={{ width: "100%", background: WHITE, borderRadius: "20px 20px 0 0", padding: "20px", paddingBottom: 40 }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: TEXT_DARK, marginBottom: 4 }}>Add measurement photo</h3>
              <p style={{ fontSize: 13, color: TEXT_MID }}>Take a photo or choose from your device</p>
            </div>
            <button onClick={() => { setShowPhotoMenu(false); alert("Camera will open"); }} style={{ width: "100%", padding: "16px", background: PLUM, color: WHITE, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: "pointer", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
              📷 Snap Photo Now
            </button>
            <button onClick={() => { setShowPhotoMenu(false); alert("Gallery will open"); }} style={{ width: "100%", padding: "16px", background: SAGE, color: SAGE_DARK, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: "pointer", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
              🖼️ Choose From Album
            </button>
            <button onClick={() => setShowPhotoMenu(false)} style={{ width: "100%", padding: "16px", background: CREAM_DARK, color: TEXT_DARK, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: SAGE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={SAGE_DARK} strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5 19.79 19.79 0 01.07 4.72C.05 3.61.82 2.68 1.93 2H4.97a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          </div>
          <div><div style={{ fontSize: 16, fontWeight: 500, color: TEXT_DARK, marginBottom: 3 }}>Unsure about your gap?</div><div style={{ fontSize: 14, color: TEXT_MID }}>Share your tracking log with a certified pelvic floor therapist for personalised guidance.</div></div>
        </div>
        <PillButton label="Ping a therapist" style={{ width: "100%", padding: "14px", borderRadius: 50 }} />
      </div>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Today's summary</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: TEXT_DARK, marginBottom: 8 }}>Small improvement — great consistency.</div>
        <p style={{ fontSize: 14, color: TEXT_MID, marginBottom: 16 }}>Keep following your program; gentle core engagement may help sustain progress.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["Week-over-week", "−0.2 cm", "3 sessions"], ["Month-over-month", "−0.4 cm", "4 weeks"]].map(([lbl, val, sub]) => (
            <div key={lbl}><div style={{ fontSize: 12, color: TEXT_LIGHT, marginBottom: 4 }}>{lbl}</div><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: PLUM }}>{val}</div><div style={{ fontSize: 12, color: TEXT_MID }}>{sub}</div></div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <PillButton label="Submit check-in" style={{ padding: "14px", borderRadius: 50 }} />
        <PillButton label="Save draft" variant="outline" style={{ padding: "14px", borderRadius: 50 }} />
      </div>
    </div>
  );
}

// ─── Circle Tab ───────────────────────────────────────────────────────────────
function CircleTab() {
  const [tab, setTab] = useState("Groups");
  const [botMessages, setBotMessages] = useState([{ from: "bot", text: "Hello mama 🌿 I'm the Myth-Buster. Ask me anything about postpartum recovery — diastasis, pelvic floor, returning to movement, or those whispers from aunties. I'll separate truth from myth, gently." }]);
  const [botInput, setBotInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const groups = [
    { name: "0–3 months postpartum", count: 248, last: "Amina: The breath cue really helped today 🌿", badge: 4 },
    { name: "3–6 months postpartum", count: 412, last: "Group lead: New gentle flow posted", badge: 0 },
    { name: "C-section recovery", count: 187, last: "Fatou: Anyone else feeling tender at week 6?", badge: 2 },
    { name: "Pelvic floor support", count: 156, last: "Moderator: Reminder — be kind, be honest 💛", badge: 0 },
  ];
  const dms = [
    { name: "Lerato M.", role: "Walking partner · Nairobi", last: "See you tomorrow at 6!", badge: 1, color: PLUM_PALE, textColor: PLUM_DARK },
    { name: "Ngozi A.", role: "Diastasis buddy · week 9", last: "I tried the heel slide ❤️", badge: 0, color: SAGE, textColor: SAGE_DARK },
    { name: "Amaka O.", role: "Doula", last: "Sending you a breathing audio", badge: 0, color: CREAM_DARK, textColor: TEXT_MID },
  ];

  // Pre-written myth-buster answer library
  // Keyword-matched responses written in the warm, evidence-based tone of the brand
  const MYTH_BUSTER_LIBRARY = [
    {
      keywords: ["exercise", "exercising", "workout", "6 week", "six week", "start exercising", "when can"],
      answer: "After 6 weeks (and once cleared by your doctor), most mothers can safely begin gentle core reconnection work — deep breathing, pelvic tilts, and supported heel slides. Avoid crunches, sit-ups, and planks until your gap has closed to under 2cm. Your body is healing beautifully — go slow, listen to it. 💜"
    },
    {
      keywords: ["diastasis", "gap", "normal", "wide", "separation", "how big"],
      answer: "A gap of 2 fingers (2.5cm) or less is considered normal postpartum. Up to 3 fingers is common in the first 6 months. What matters more than size is whether the connective tissue feels firm or 'doughy' when you brace your core. Consistent gentle work closes it over time — most mothers see real improvement by week 12."
    },
    {
      keywords: ["belly", "firm", "flat", "ever", "tummy", "again", "look", "soft"],
      answer: "Yes, mama — your belly can absolutely feel firm and strong again. The softness you feel now is your tissues healing and your deep core muscles waiting to be re-engaged. With consistent, targeted work (not crunches!), most mothers see real change by week 8–12. Your body has done something monumental. Be patient with her. 🌿"
    },
    {
      keywords: ["pelvic floor", "leak", "leaking", "sneeze", "cough", "wee", "urine", "incontinence"],
      answer: "Leaking when you sneeze or laugh is very common postpartum, but it's not something you have to live with. It's a sign your pelvic floor needs gentle reactivation — not 100 kegels a day, but proper coordination work with breathing. The exercises in your KORE programme address this directly. Most mothers see significant improvement within 4–6 weeks of consistent practice."
    },
    {
      keywords: ["c-section", "csection", "cesarean", "scar", "section"],
      answer: "C-section recovery has its own timeline — your incision needs 6–8 weeks minimum before any core engagement. Once cleared, begin with the gentlest breathing exercises and scar mobilisation (gentle circles around the scar). Your deep core has been disrupted but absolutely can recover. You are not behind. You are healing on your own beautiful timeline. 💜"
    },
    {
      keywords: ["back pain", "lower back", "ache", "back hurts", "back"],
      answer: "Lower back pain postpartum is almost always linked to a weakened deep core — when your transverse abdominis can't stabilise your spine, your back muscles overwork to compensate. Gentle pelvic tilts and TVA breathing (the first exercises in your programme) directly relieve this. Most mothers feel a difference within 2 weeks of daily practice."
    },
    {
      keywords: ["intimacy", "sex", "painful", "intercourse", "dry", "discomfort"],
      answer: "Painful intimacy postpartum is very common and rarely talked about — but it's real, and it's treatable. Hormonal changes (especially while breastfeeding) cause dryness, and the pelvic floor may be holding tension or weakness. A certified pelvic floor physiotherapist can help. You can also tap 'Ping a therapist' on your check-in screen for a private referral. You deserve to feel whole again. 🌿"
    },
    {
      keywords: ["breastfeed", "breast feed", "nursing", "milk", "feed"],
      answer: "Yes, you can absolutely exercise while breastfeeding — gentle movement actually helps your recovery and doesn't affect milk supply. Just stay hydrated, eat enough, and feed baby before exercise to be comfortable. The hormone relaxin stays in your body while nursing, so be extra gentle with your joints. Your body is doing two miraculous things at once. 💜"
    },
    {
      keywords: ["how long", "how many", "weeks", "months", "see results", "progress"],
      answer: "Most mothers feel meaningful change within 4 weeks of consistent daily practice — usually less back pain, better posture, and a stronger feeling when they brace. Visible flattening of the abdomen takes 8–12 weeks. Real healing is never linear, mama. Trust the small wins. Every breath, every brace, every gentle session is adding up."
    },
    {
      keywords: ["late", "too late", "old", "years", "3 year", "2 year"],
      answer: "It is never too late, my love. Whether you gave birth 3 months ago or 3 years ago, the same deep core muscles are there, waiting to be reactivated. Many mothers see significant changes years postpartum once they begin targeted, gentle work. Your body remembers how to heal. You haven't missed anything."
    },
    {
      keywords: ["coning", "doming", "bulge", "tent", "bulging"],
      answer: "Coning or doming is your abdomen's signal that the exercise is too advanced — the deep core can't yet manage the load, so superficial muscles take over. Stop that movement and return to gentle bracing exercises. It's not a failure — it's your body talking to you clearly. KORE's AI tracking watches for this and gently guides you back to safer movements."
    },
    {
      keywords: ["pain", "hurts", "sharp", "ache"],
      answer: "Sharp or persistent pain is your body asking you to stop and rest. Gentle discomfort during a new exercise is normal; pain is not. If you feel pain during any KORE exercise, pause, breathe, and either regress to an easier version or skip it for today. If the pain persists, please use 'Ping a therapist' for personalised guidance. 💜"
    },
  ];

  const sampleAnswer = (question) => {
    const q = question.toLowerCase();
    const match = MYTH_BUSTER_LIBRARY.find(item =>
      item.keywords.some(kw => q.includes(kw))
    );
    if (match) return match.answer;
    return "That's a beautiful question, mama. While I can't give you a tailored answer to this specific one right now, I'd encourage you to tap 'Ping a therapist' from your check-in screen — a certified pelvic floor specialist can give you the personalised guidance you deserve. In the meantime, keep breathing, keep moving gently, and trust your body's healing. 🌿";
  };

  const sendBotMessage = async () => {
    if (!botInput.trim()) return;
    const userMsg = botInput.trim();
    setBotInput("");
    setBotMessages(prev => [...prev, { from: "user", text: userMsg }]);
    setLoading(true);
    // Realistic typing delay so the bot feels alive, not instant
    setTimeout(() => {
      setBotMessages(prev => [...prev, { from: "bot", text: sampleAnswer(userMsg) }]);
      setLoading(false);
    }, 900 + Math.random() * 600);
  };

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [botMessages, loading]);

  return (
    <div style={{ padding: "24px 24px 0" }}>
      <div style={{ fontSize: 12, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Mama circle</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: TEXT_DARK, marginBottom: 6 }}>You are not alone</h2>
      <p style={{ fontSize: 14, color: TEXT_MID, marginBottom: 20 }}>Private group chats and one-to-one messages with mothers walking the same path.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", background: SAGE, borderRadius: 50, padding: 3, marginBottom: 20 }}>
        {["Groups", "DMs", "Myth-Buster"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "9px", borderRadius: 50, border: "none", cursor: "pointer", background: tab === t ? WHITE : "transparent", color: tab === t ? TEXT_DARK : TEXT_MID, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: tab === t ? 500 : 400, boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>{t}</button>
        ))}
      </div>

      {tab === "Groups" && (
        <>
          {groups.map(g => (
            <div key={g.name} style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "16px 20px", marginBottom: 10, display: "flex", gap: 14, alignItems: "center", cursor: "pointer" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: SAGE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={SAGE_DARK} strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: TEXT_DARK }}>{g.name}</div>
                <div style={{ fontSize: 12, color: TEXT_LIGHT, marginBottom: 3 }}>{g.count} mothers</div>
                <div style={{ fontSize: 13, color: TEXT_MID, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.last}</div>
              </div>
              {g.badge > 0 && <div style={{ width: 24, height: 24, borderRadius: "50%", background: PLUM, color: WHITE, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{g.badge}</div>}
            </div>
          ))}
          <PromiseBanner />
        </>
      )}

      {tab === "DMs" && (
        <>
          {dms.map(d => (
            <div key={d.name} style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "16px 20px", marginBottom: 10, display: "flex", gap: 14, alignItems: "center", cursor: "pointer" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: d.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 500, color: d.textColor, flexShrink: 0 }}>{d.name[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: TEXT_DARK }}>{d.name}</div>
                <div style={{ fontSize: 12, color: TEXT_LIGHT, marginBottom: 3 }}>{d.role}</div>
                <div style={{ fontSize: 13, color: TEXT_MID }}>{d.last}</div>
              </div>
              {d.badge > 0 && <div style={{ width: 24, height: 24, borderRadius: "50%", background: PLUM, color: WHITE, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{d.badge}</div>}
            </div>
          ))}
          <PromiseBanner />
        </>
      )}

      {tab === "Myth-Buster" && (
        <>
          <div style={{ background: PLUM_PALE, borderRadius: 14, border: `1px solid ${PLUM_LIGHT}`, padding: "14px 18px", display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: PLUM, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
            </div>
            <div><div style={{ fontSize: 15, fontWeight: 500, color: PLUM_DARK }}>Myth-Buster AI</div><div style={{ fontSize: 12, color: TEXT_MID }}>Evidence-based. Private. Available 24/7 — even at 3am feeds.</div></div>
          </div>
          <div ref={chatRef} style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "16px", minHeight: 200, maxHeight: 320, overflowY: "auto", marginBottom: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {botMessages.map((m, i) => <div key={i} style={{ maxWidth: "85%", padding: "12px 16px", borderRadius: 14, fontSize: 14, lineHeight: 1.6, alignSelf: m.from === "user" ? "flex-end" : "flex-start", background: m.from === "user" ? PLUM_PALE : SAGE, color: m.from === "user" ? PLUM_DARK : TEXT_DARK, borderBottomRightRadius: m.from === "user" ? 4 : 14, borderBottomLeftRadius: m.from === "bot" ? 4 : 14 }}>{m.text}</div>)}
            {loading && <div style={{ alignSelf: "flex-start", background: SAGE, padding: "10px 16px", borderRadius: 14, fontSize: 14, color: TEXT_MID }}>Thinking…</div>}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {["Can I start exercising at 6 weeks?", "Is my diastasis gap normal?", "Will my belly ever feel firm again?"].map(q => <button key={q} onClick={() => setBotInput(q)} style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "7px 13px", fontSize: 12, color: TEXT_MID, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{q}</button>)}
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input value={botInput} onChange={e => setBotInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendBotMessage()} placeholder="Ask the Myth-Buster..." style={{ flex: 1, padding: "13px 18px", borderRadius: 50, border: `1px solid ${BORDER}`, background: WHITE, fontSize: 14, color: TEXT_DARK, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
            <button onClick={sendBotMessage} style={{ width: 46, height: 46, borderRadius: "50%", background: PLUM, border: "none", color: WHITE, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
          <PromiseBanner />
        </>
      )}
    </div>
  );
}

function PromiseBanner() {
  return (
    <div style={{ background: SAGE, borderRadius: 14, padding: "14px 18px", display: "flex", gap: 10, alignItems: "flex-start", marginTop: 8, marginBottom: 8 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PLUM_LIGHT} strokeWidth="1.8" style={{ flexShrink: 0, marginTop: 1 }}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      <div><div style={{ fontSize: 13, fontWeight: 500, color: PLUM }}>Circle promise</div><div style={{ fontSize: 13, color: TEXT_MID }}>Conversations are encrypted, never used for ads, and gently moderated by certified doulas.</div></div>
    </div>
  );
}

// ─── Resources Tab ────────────────────────────────────────────────────────────
function ResourcesTab({ onHowItWorks }) {
  const [faqOpen, setFaqOpen] = useState(null);
  const articles = [
    { title: "Understanding Abdominal Separation: What is Diastasis Recti?", author: "Clinical Overview", read: "10 min read", tag: "ANATOMY" },
    { title: "3-Step DIY Diastasis Recti Self-Assessment at Home", author: "Practical Guide", read: "7 min read", tag: "ASSESSMENT" },
    { title: "Deep Core Anatomy: How Your Abdominals Work with Your Pelvic Floor", author: "Rehabilitation Mechanics", read: "12 min read", tag: "ANATOMY" },
  ];
  const videos = [
    { title: "How To Test for Diastasis Recti", author: "Dr. Brianne Grogan, PT, DPT", desc: "Clear step-by-step physical therapy instructions for checking your gap baseline at home safely.", url: "https://www.youtube.com/embed/2XAzDXZokEs" },
    { title: "DIASTASIS RECTI - The Best 3D Animation Explanation", author: "Pregnancy and Postpartum TV", desc: "High-end 3D animation mapping how the linea alba stretches during pregnancy.", url: "https://www.youtube.com/embed/RKjRTtoHZHQ" },
  ];
  const physios = [
    { name: "Dr. Sofia Martin", spec: "Pelvic health", dist: "2.3 km", initials: "S" },
    { name: "Marcus Lee, MSc", spec: "Women's health", dist: "4.1 km", initials: "L" },
    { name: "Dr. Anika Shah", spec: "Postpartum rehab", dist: "6.8 km", initials: "A" },
  ];
  const faqs = [
    { q: "Will this app record me or show my body to anyone?", a: "Never. KORE works entirely inside your phone's hardware. It does not record video, save files, or upload anything to the internet. Nobody will ever see you — not even us." },
    { q: "Does it swallow up my mobile data?", a: "No. Once downloaded, the tracking system runs locally on your device without draining your cellular data package. You can use it with no internet connection at all." },
    { q: "Is it too late for my body to heal?", a: "It is never too late. Whether you gave birth 3 months ago or 3 years ago, these targeted movements are medically structured to rebuild your core strength safely, at any stage." },
  ];

  return (
    <div style={{ padding: "24px 24px 0" }}>
      <div style={{ fontSize: 12, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Resources & support</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: TEXT_DARK, marginBottom: 20 }}>A quiet library, just for you.</h2>

      {/* How It Works banner — first thing */}
      <div onClick={onHowItWorks} style={{ background: `linear-gradient(135deg, ${PLUM} 0%, ${PLUM_DARK} 100%)`, borderRadius: 16, padding: "22px 24px", marginBottom: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: WHITE, opacity: 0.06 }} />
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: WHITE, marginBottom: 3 }}>How KORE Works</div>
          <div style={{ fontSize: 13, color: PLUM_LIGHT }}>3 simple steps · No tech skills needed</div>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PLUM_LIGHT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </div>

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: WHITE, borderRadius: 50, border: `1px solid ${BORDER}`, padding: "11px 18px", marginBottom: 16 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TEXT_LIGHT} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input placeholder="Search FAQs, articles or specialists" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: TEXT_DARK, fontFamily: "'DM Sans', sans-serif", background: "transparent" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "18px 16px", cursor: "pointer" }}>
          <div style={{ marginBottom: 8 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={TEXT_MID} strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5 19.79 19.79 0 01.07 4.72C.05 3.61.82 2.68 1.93 2H4.97a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></div>
          <div style={{ fontSize: 15, fontWeight: 500, color: TEXT_DARK }}>Refer specialist</div>
          <div style={{ fontSize: 12, color: TEXT_MID, marginTop: 2 }}>Vetted nearby</div>
        </div>
        <div style={{ background: PLUM_PALE, borderRadius: 14, border: `1px solid ${PLUM_LIGHT}`, padding: "18px 16px", cursor: "pointer" }}>
          <div style={{ marginBottom: 8 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PLUM} strokeWidth="1.8"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></div>
          <div style={{ fontSize: 15, fontWeight: 500, color: TEXT_DARK }}>Video guides</div>
          <div style={{ fontSize: 12, color: TEXT_MID, marginTop: 2 }}>Expert explanations</div>
        </div>
      </div>

      {/* Emergency */}
      <div style={{ background: "#FEF2F2", borderRadius: 14, border: "1px solid #FECACA", padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#991B1B" }}>Emergency & Red Flags</div>
          <span style={{ background: "#DC2626", color: WHITE, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>HIGH PRIORITY</span>
        </div>
        {["Sudden severe pelvic or abdominal pain", "Heavy vaginal bleeding or fever", "Sudden inability to move or severe numbness"].map(s => <div key={s} style={{ fontSize: 14, color: "#7F1D1D", marginBottom: 4 }}>· {s}</div>)}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          <PillButton label="Call emergency" variant="danger" style={{ padding: "12px", borderRadius: 50 }} />
          <PillButton label="Get urgent referral" variant="outline" style={{ padding: "12px", borderRadius: 50 }} />
        </div>
      </div>

      {/* Articles */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: TEXT_DARK }}>Curated articles</div>
        <span style={{ fontSize: 13, color: PLUM, cursor: "pointer" }}>See all</span>
      </div>
      {articles.map(a => (
        <div key={a.title} style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "16px 20px", marginBottom: 10, display: "flex", gap: 14, alignItems: "center", cursor: "pointer" }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: SAGE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={SAGE_DARK} strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: TEXT_DARK, marginBottom: 2 }}>{a.title}</div>
            <div style={{ fontSize: 12, color: TEXT_MID, marginBottom: 6 }}>{a.author} · {a.read}</div>
            <span style={{ background: SAGE, color: SAGE_DARK, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{a.tag}</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TEXT_LIGHT} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      ))}

      {/* Video Embeds */}
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: TEXT_DARK, marginBottom: 12, marginTop: 20 }}>Video guides from experts</div>
      {videos.map((v, i) => (
        <div key={i} style={{ marginBottom: 16, background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <div style={{ width: "100%", paddingBottom: "56.25%", position: "relative", background: "#000", height: 0 }}>
            <iframe
              title={v.title}
              src={v.url}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            />
          </div>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: TEXT_DARK, marginBottom: 2 }}>{v.title}</div>
            <div style={{ fontSize: 12, color: TEXT_MID, marginBottom: 8 }}>{v.author}</div>
            <div style={{ fontSize: 13, color: TEXT_MID, lineHeight: 1.4 }}>{v.desc}</div>
          </div>
        </div>
      ))}

      {/* Physios */}
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: TEXT_DARK, marginBottom: 12, marginTop: 8 }}>Vetted physiotherapists</div>
      {physios.map(p => (
        <div key={p.name} style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "14px 20px", marginBottom: 10, display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: PLUM_PALE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 500, color: PLUM_DARK, flexShrink: 0 }}>{p.initials}</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 500, color: TEXT_DARK }}>{p.name}</div><div style={{ fontSize: 13, color: TEXT_MID }}>{p.spec} · {p.dist}</div></div>
          <span style={{ background: SAGE, color: SAGE_DARK, padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Refer</span>
        </div>
      ))}

      {/* FAQ */}
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: TEXT_DARK, marginBottom: 8, marginTop: 8 }}>Frequently asked</div>
      <p style={{ fontSize: 14, color: TEXT_MID, marginBottom: 16 }}>Plain answers to the questions you might be thinking.</p>
      <div style={{ background: WHITE, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden", marginBottom: 20 }}>
        {faqs.map((item, i) => (
          <div key={i} style={{ borderBottom: i < faqs.length - 1 ? `1px solid ${CREAM_DARK}` : "none" }}>
            <div onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer", gap: 12 }}>
              <span style={{ fontSize: 14, color: TEXT_DARK, fontWeight: 500, lineHeight: 1.5, flex: 1 }}>{item.q}</span>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: faqOpen === i ? PLUM : CREAM_DARK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={faqOpen === i ? WHITE : TEXT_MID} strokeWidth="2.5" strokeLinecap="round">
                  {faqOpen === i ? <path d="M18 15l-6-6-6 6"/> : <path d="M6 9l6 6 6-6"/>}
                </svg>
              </div>
            </div>
            {faqOpen === i && <div style={{ padding: "0 20px 18px", fontSize: 14, color: TEXT_MID, lineHeight: 1.7, borderTop: `1px solid ${CREAM_DARK}` }}>{item.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [onboardStep, setOnboardStep] = useState(1);
  const [userData, setUserData] = usePersistedState("kore_user_data", {});
  const [activeTab, setActiveTab] = useState("home");
  const [showSurvey, setShowSurvey] = useState(!hasSurveyBeenCompleted()); // Hide if already completed

  const goNext = () => { if (onboardStep < 6) setOnboardStep(onboardStep + 1); else setScreen("app"); };
  const goBack = () => { if (onboardStep > 1) setOnboardStep(onboardStep - 1); else setScreen("landing"); };
  const startOnboard = () => { setOnboardStep(1); setScreen("onboard"); };
  const goHowItWorks = () => setScreen("howitworks");

  const handleSurveyComplete = (surveyAnswers) => {
    setUserData({ ...userData, surveyAnswers });
    saveSurveyAnswers(surveyAnswers);
    setShowSurvey(false);
  };

  if (screen === "landing") return (
    <><style>{fonts}{globalStyle}</style><Landing onStart={startOnboard} onHowItWorks={goHowItWorks} /></>
  );

  if (screen === "howitworks") return (
    <><style>{fonts}{globalStyle}</style><HowItWorks onBack={() => setScreen("landing")} onBegin={startOnboard} /></>
  );

  if (screen === "onboard") {
    const steps = [Step1, Step2, Step3, Step4, Step5, Step6];
    const StepComp = steps[onboardStep - 1];
    return (
      <><style>{fonts}{globalStyle}</style><StepComp step={onboardStep} onNext={goNext} onBack={goBack} data={userData} setData={setUserData} /></>
    );
  }

  const tabMap = {
    home: <HomeTab userData={userData} />,
    practice: <PracticeTab userData={userData} />,
    checkin: <CheckinTab />,
    circle: <CircleTab />,
    resources: <ResourcesTab onHowItWorks={goHowItWorks} />,
  };

  return (
    <><style>{fonts}{globalStyle}</style>
    <OnboardingSurveyModal isOpen={showSurvey && screen === "app"} onComplete={handleSurveyComplete} />
    <AppShell activeTab={activeTab} setActiveTab={setActiveTab}>
      {tabMap[activeTab]}
    </AppShell></>
  );
}
