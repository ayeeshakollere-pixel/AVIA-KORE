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
const EXERCISE_LEVELS = {
  beginner: {
    label: "Beginner", sublabel: "Deep Activation", weeks: "Weeks 1–6",
    color: "#6B8F6B", bgColor: "#E8EDE8",
    exercises: [
      { id:"beg_01", name:"Pelvic Tilts",           reps:"10 reps × 2 sets", duration:45, level:"beginner" },
      { id:"beg_02", name:"Abdominal Bracing",       reps:"8 reps × 2 sets",  duration:40, level:"beginner" },
      { id:"beg_03", name:"Supported Heel Slides",   reps:"8 each side × 2",  duration:45, level:"beginner" },
      { id:"beg_04", name:"Low Glute Bridges",       reps:"10 reps × 2 sets", duration:45, level:"beginner" },
      { id:"beg_05", name:"Modified Dead Bug",       reps:"6 each side × 2",  duration:50, level:"beginner" },
      { id:"beg_06", name:"Seated TVA Contractions", reps:"10 reps × 2 sets", duration:40, level:"beginner" },
      { id:"beg_07", name:"Side-Lying Clamshells",   reps:"12 each side × 2", duration:45, level:"beginner" },
    ],
  },
  intermediate: {
    label: "Intermediate", sublabel: "Core Loading", weeks: "Weeks 7–12",
    color: "#6B2D4E", bgColor: "#EDE0E8",
    exercises: [
      { id:"int_01", name:"Unsupported Heel Slides",        reps:"10 each side × 3", duration:50, level:"intermediate" },
      { id:"int_02", name:"Dead Bug (Legs Only)",            reps:"8 each side × 3",  duration:50, level:"intermediate" },
      { id:"int_03", name:"Bird-Dog (Alt. Arm & Leg)",      reps:"8 each side × 3",  duration:55, level:"intermediate" },
      { id:"int_04", name:"Bent-Knee Fall Outs",            reps:"10 each side × 3", duration:45, level:"intermediate" },
      { id:"int_05", name:"Modified Side Plank (Knees)",    reps:"3 × 20-sec holds",  duration:40, level:"intermediate" },
      { id:"int_06", name:"Seated Heel Taps",               reps:"12 each side × 3", duration:45, level:"intermediate" },
      { id:"int_07", name:"Wall Squats with TVA Hold",      reps:"8 reps × 3 sets",  duration:50, level:"intermediate" },
    ],
  },
  advanced: {
    label: "Advanced", sublabel: "Functional Strength", weeks: "Weeks 13+",
    color: "#2D5A3D", bgColor: "#E8F0EB",
    exercises: [
      { id:"adv_01", name:"Full Dead Bug (Opp. Arm & Leg)", reps:"8 each side × 3",  duration:55, level:"advanced" },
      { id:"adv_02", name:"Full Bird-Dog",                   reps:"10 each side × 3", duration:55, level:"advanced" },
      { id:"adv_03", name:"Full Side Plank (From Feet)",    reps:"3 × 30-sec holds",  duration:45, level:"advanced" },
      { id:"adv_04", name:"Elevated Single-Leg Bridges",    reps:"10 each side × 3", duration:50, level:"advanced" },
      { id:"adv_05", name:"Modified Front Plank",           reps:"3 × 30-sec holds",  duration:45, level:"advanced" },
      { id:"adv_06", name:"Standing Paloff Press",          reps:"10 each side × 3", duration:50, level:"advanced" },
      { id:"adv_07", name:"Single-Leg Balance + Bracing",   reps:"30s each leg × 3", duration:45, level:"advanced" },
    ],
  },
};

// ── Simulated voice cue hook ───────────────────────────────────────────────
function usePracticeSession(exercise) {
  const [phase, setPhase]       = useState("countdown");
  const [countdown, setCount]   = useState(3);
  const [elapsed, setElapsed]   = useState(0);
  const [formScore, setScore]   = useState(100);
  const [breathPhase, setBP]    = useState("inhale");
  const [correction, setCorr]   = useState(null);
  const [camGranted, setCam]    = useState(false);
  const cameraRef               = useRef(null);
  const streamRef               = useRef(null);
  const animRef                 = useRef(null);
  const voiceSynth              = typeof window !== "undefined" ? window.speechSynthesis : null;

  const speak = useCallback((text) => {
    if (!voiceSynth) return;
    voiceSynth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.88; u.pitch = 1.05; u.volume = 1.0;
    const voices = voiceSynth.getVoices();
    const v = voices.find(v => v.lang.startsWith("en-GB") || v.name.includes("Samantha") || v.name.includes("Karen")) || voices[0];
    if (v) u.voice = v;
    voiceSynth.speak(u);
  }, []);

  // Camera
  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then(s => { streamRef.current = s; if (cameraRef.current) cameraRef.current.srcObject = s; setCam(true); })
      .catch(() => setCam(false));
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()); if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown === 3) speak("Take a moment to get into position. Whenever you're ready, let's begin.");
    if (countdown <= 0) { setPhase("active"); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, phase]);

  // Timer + simulated AI
  useEffect(() => {
    if (phase !== "active") return;
    let frame = 0;
    const CORRECTIONS = [
      { type: "spineArching",      msg: "Your back is arching slightly, love — gently tilt your pelvis forward to protect your core.", threshold: 0.96 },
      { type: "breathHolding",     msg: "Keep breathing, mama. Release your jaw and breathe steadily.",                                threshold: 0.98 },
      { type: "pelvicTiltForward", msg: "Find a neutral pelvis — not arched, not tucked. Just balanced.",                             threshold: 0.97 },
    ];
    const corrCooldowns = {};
    const aiTick = () => {
      frame++;
      const newBreath = Math.sin(frame / 18) > 0 ? "inhale" : "exhale";
      setBP(newBreath);
      const r = Math.random();
      let penalty = 0;
      CORRECTIONS.forEach(c => {
        if (r > c.threshold) {
          const now = Date.now();
          if (!corrCooldowns[c.type] || now - corrCooldowns[c.type] > 8000) {
            corrCooldowns[c.type] = now;
            setCorr(c.msg);
            speak(c.msg);
            setTimeout(() => setCorr(null), 5000);
          }
          penalty += 15;
        }
      });
      setScore(Math.max(0, 100 - penalty));
      animRef.current = requestAnimationFrame(aiTick);
    };
    const timer = setInterval(() => {
      setElapsed(e => {
        if (e + 1 >= exercise.duration) { clearInterval(timer); cancelAnimationFrame(animRef.current); setPhase("rest"); speak("Wonderful. That's one exercise complete. Take a gentle breath."); return e + 1; }
        if ((e + 1) === Math.floor(exercise.duration / 2)) speak("You're doing beautifully. Every small movement is healing your body from within.");
        return e + 1;
      });
    }, 1000);
    animRef.current = requestAnimationFrame(aiTick);
    return () => { clearInterval(timer); cancelAnimationFrame(animRef.current); };
  }, [phase, exercise.duration]);

  return { phase, setPhase, countdown, elapsed, formScore, breathPhase, correction, camGranted, cameraRef, speak };
}

// ── Session screen ─────────────────────────────────────────────────────────
function SessionScreen({ exercise, levelData, sessionList, currentIdx, onNext, onExit }) {
  const { phase, setPhase, countdown, elapsed, formScore, breathPhase, correction, camGranted, cameraRef, speak } = usePracticeSession(exercise);
  const scoreColor = formScore >= 80 ? SAGE_DARK : formScore >= 60 ? "#B45309" : "#DC2626";
  const progress = exercise.duration > 0 ? elapsed / exercise.duration : 0;

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
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ADE80" }} />
              <span style={{ color: WHITE, fontSize: 8 }}>AI</span>
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

        {/* Exercise dots */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          {sessionList.map((_, i) => <div key={i} style={{ width: i === currentIdx ? 20 : 7, height: 7, borderRadius: 4, background: i < currentIdx ? PLUM_LIGHT : i === currentIdx ? PLUM_PALE : "rgba(255,255,255,0.15)", transition: "all 0.3s" }} />)}
        </div>
      </div>
    </div>
  );
}

// ── Practice Tab root ──────────────────────────────────────────────────────
function PracticeTab() {
  const [view, setView]         = useState("library");
  const [activeLevel, setLevel] = useState("beginner");
  const [selected, setSelected] = useState(null);
  const [sessionList, setSessionList] = useState([]);
  const [sessionIdx, setSessionIdx]   = useState(0);

  const levelData = EXERCISE_LEVELS[activeLevel];

  function startSession(lvl) {
    const list = EXERCISE_LEVELS[lvl].exercises;
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
      <div style={{ margin: "0 20px", borderRadius: 20, background: `linear-gradient(160deg, ${EXERCISE_LEVELS[selected.level].bgColor}, ${CREAM_DARK})`, height: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 20, border: `1px solid ${EXERCISE_LEVELS[selected.level].color}33`, position: "relative" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: EXERCISE_LEVELS[selected.level].color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={WHITE}><polygon points="5,3 19,12 5,21"/></svg>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: EXERCISE_LEVELS[selected.level].color }}>{selected.name}</div>
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
      levelData={EXERCISE_LEVELS[selected.level]}
      sessionList={sessionList}
      currentIdx={sessionIdx}
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
          {Object.entries(EXERCISE_LEVELS).map(([key, d]) => (
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
  const feelings = ["Demotivated", "Overwhelmed", "Tired", "Pushing through", "Calm", "Happy", "Energized", "Stronger"];

  return (
    <div style={{ padding: "24px 24px 0" }}>
      <div style={{ fontSize: 12, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>April 23 · Check-in</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: TEXT_DARK, marginBottom: 20 }}>How are you today?</h2>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase" }}>Self-assessment</div>
          <span style={{ background: SAGE, padding: "4px 12px", borderRadius: 20, fontSize: 12, color: TEXT_MID }}>Step 1 / 4</span>
        </div>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <svg width={80} height={60} viewBox="0 0 80 60"><circle cx={40} cy={14} r={10} fill="none" stroke={PLUM_LIGHT} strokeWidth={1.5}/><ellipse cx={40} cy={42} rx={22} ry={10} fill="none" stroke={PLUM_LIGHT} strokeWidth={1.5}/><circle cx={40} cy={42} r={4} fill={SAGE_DARK}/></svg>
          <div style={{ fontSize: 12, color: TEXT_LIGHT }}>Knees bent · Back flat</div>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: TEXT_DARK, marginBottom: 8 }}>Lie down comfortably</h3>
        <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6, marginBottom: 16 }}>Find a flat surface. Lie on your back with knees bent and feet flat on the floor. Relax your shoulders.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
          {[0, 1, 2, 3].map(i => <div key={i} style={{ width: i === 0 ? 24 : 8, height: 4, borderRadius: 3, background: i === 0 ? PLUM : CREAM_DARK }} />)}
        </div>
        <PillButton label="Next step ›" style={{ width: "100%", padding: "14px", borderRadius: 50 }} />
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
        <div style={{ background: SAGE, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={SAGE_DARK} strokeWidth="1.8"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <span style={{ fontSize: 13, color: TEXT_MID }}>Attach a secure photo (on-device)</span>
        </div>
      </div>

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
    { title: "Gentle Breathing for Pelvic Stability", author: "Dr. Amelia Rivers", read: "6 min read", tag: "BREATHING" },
    { title: "Posture Cues to Reduce Pelvic Pressure", author: "Renée Parker", read: "8 min read", tag: "POSTURE" },
    { title: "Returning to Movement at 12 Weeks", author: "Dr. Sofia Martin", read: "5 min read", tag: "MOVEMENT" },
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
        <div style={{ background: PLUM, borderRadius: 14, padding: "18px 16px", cursor: "pointer" }}>
          <div style={{ marginBottom: 8 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PLUM_PALE} strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div>
          <div style={{ fontSize: 15, fontWeight: 500, color: WHITE }}>Myth-Buster Bot</div>
          <div style={{ fontSize: 12, color: PLUM_LIGHT, marginTop: 2 }}>Ask anything · 24/7</div>
        </div>
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "18px 16px", cursor: "pointer" }}>
          <div style={{ marginBottom: 8 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={TEXT_MID} strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5 19.79 19.79 0 01.07 4.72C.05 3.61.82 2.68 1.93 2H4.97a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></div>
          <div style={{ fontSize: 15, fontWeight: 500, color: TEXT_DARK }}>Refer specialist</div>
          <div style={{ fontSize: 12, color: TEXT_MID, marginTop: 2 }}>Vetted nearby</div>
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
  const [userData, setUserData] = useState({});
  const [activeTab, setActiveTab] = useState("home");

  const goNext = () => { if (onboardStep < 6) setOnboardStep(onboardStep + 1); else setScreen("app"); };
  const goBack = () => { if (onboardStep > 1) setOnboardStep(onboardStep - 1); else setScreen("landing"); };
  const startOnboard = () => { setOnboardStep(1); setScreen("onboard"); };
  const goHowItWorks = () => setScreen("howitworks");

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
    practice: <PracticeTab />,
    checkin: <CheckinTab />,
    circle: <CircleTab />,
    resources: <ResourcesTab onHowItWorks={goHowItWorks} />,
  };

  return (
    <><style>{fonts}{globalStyle}</style>
    <AppShell activeTab={activeTab} setActiveTab={setActiveTab}>
      {tabMap[activeTab]}
    </AppShell></>
  );
}
