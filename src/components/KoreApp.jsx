import React, { useState, useCallback, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// COLOR SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
const PLUM = "#6B2D4E";
const PLUM_DARK = "#4A1F36";
const PLUM_LIGHT = "#C9A8BB";
const PLUM_PALE = "#EDE0E8";
const CREAM = "#F5F0EA";
const CREAM_DARK = "#EDE8E1";
const SAGE = "#E8EDE8";
const SAGE_DARK = "#6B8F6B";
const WHITE = "#FFFFFF";
const TEXT_DARK = "#2C1A24";
const TEXT_MID = "#7A6570";
const TEXT_LIGHT = "#A89BA3";
const BORDER = "#E0D8DC";

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@400;500;600&display=swap');
`;

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
    <path d="M9 11l3 3L22 4"/><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);
const IconCircle = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>
  </svg>
);
const IconResources = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><circle cx="12" cy="8" r="5"/><path d="M7 14h10"/>
  </svg>
);

// ─── Logo ────────────────────────────────────────────────────────────────────
function KoreLogo({ size = 32 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: size,
        height: size,
        background: PLUM,
        borderRadius: `${size * 0.4}px ${size * 0.4}px 0 0`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: WHITE,
        fontSize: size * 0.5,
        fontWeight: 700,
        fontFamily: "'Playfair Display', serif",
      }}>K</div>
      {size > 20 && <div style={{ fontFamily: "'Playfair Display', serif", fontSize: size * 0.6, fontWeight: 600, color: PLUM_DARK }}>KORE</div>}
    </div>
  );
}

function KoreHeroLogo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
        {[PLUM, PLUM_LIGHT, SAGE_DARK].map((color, i) => (
          <div key={i} style={{ width: 12, height: 20 + i * 8, background: color, borderRadius: 3 }} />
        ))}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: PLUM_DARK }}>KORE</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 8-EXERCISE SCHEMA — Using YOUR actual videos
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

const EXERCISE_LEVELS_8 = {
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

// ═══════════════════════════════════════════════════════════════════════════
// EXERCISE VIDEO PLAYER — With smart looping and PiP camera
// ═══════════════════════════════════════════════════════════════════════════
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
      } else {
        console.log(`Exercise "${exercise.name}" completed all ${loopCount} loops`);
      }
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: 0, paddingBottom: "56.25%", background: "#1a1a1a", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
      <video
        ref={videoRef}
        src={videoPath}
        autoPlay
        playsInline
        muted
        onEnded={handleVideoEnd}
        onLoadedData={() => setVideoLoading(false)}
        onError={() => {
          setVideoError(true);
          setVideoLoading(false);
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          width: "120px",
          height: "160px",
          borderRadius: 10,
          border: "2px solid rgba(255,255,255,0.9)",
          background: "#000",
          overflow: "hidden",
          zIndex: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        <video
          ref={cameraRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            background: "rgba(0,0,0,0.7)",
            color: trackingStatus === "tracking" ? "#4ADE80" : "#FCD34D",
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 6px",
            borderRadius: 4,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          ● {trackingStatus === "tracking" ? "Tracking" : "Ready"}
        </div>
      </div>

      {videoLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(90deg, #222 25%, #333 50%, #222 75%)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 2s infinite",
          }}
        />
      )}

      {videoError && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.8)",
            color: WHITE,
            textAlign: "center",
            padding: 20,
            zIndex: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎬</div>
            <p style={{ fontSize: 13, color: TEXT_LIGHT, marginBottom: 4 }}>Video not available yet</p>
            <p style={{ fontSize: 12, color: TEXT_LIGHT, lineHeight: 1.5 }}>
              The exercise video will be available once files are uploaded to the assets folder.
            </p>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "rgba(0,0,0,0.7)",
          color: PLUM_LIGHT,
          fontSize: 12,
          fontWeight: 600,
          padding: "6px 12px",
          borderRadius: 20,
          fontFamily: "'DM Sans', sans-serif",
          zIndex: 5,
        }}
      >
        {loopCount > 1 ? `${loopCount} loops` : "Play once"}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
function InstructionPanel({ exercise }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ background: WHITE, borderRadius: 12, border: `1px solid ${BORDER}`, marginTop: 16, overflow: "hidden" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 15,
          fontWeight: 600,
          color: TEXT_DARK,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <span>📋 Step-by-Step Guide</span>
        <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
      </button>
      {isOpen && (
        <div style={{ padding: "0 16px 16px", background: CREAM, borderTop: `1px solid ${BORDER}` }}>
          {exercise.steps.map((step, i) => (
            <div key={i} style={{ marginBottom: 12, fontSize: 13, color: TEXT_MID, lineHeight: 1.6 }}>
              <span style={{ color: PLUM, fontWeight: 600 }}>{step.split(":")[0]}</span>: {step.split(":")[1]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SESSION SCREEN — Main practice screen
function SessionScreen({ exercise, onNext, onExit, userData }) {
  const cameraRef = useRef(null);
  const [trackingStatus, setTrackingStatus] = useState("ready");
  const [isAuto, setIsAuto] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      .then(stream => {
        if (cameraRef.current) {
          cameraRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error("Camera access denied:", err));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: CREAM, padding: "20px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {/* Exercise Video */}
        <ExerciseVideoPlayer exercise={exercise} cameraRef={cameraRef} trackingStatus={trackingStatus} />

        {/* Instruction Panel */}
        <InstructionPanel exercise={exercise} />

        {/* Mode Toggle */}
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button
            onClick={() => setIsAuto(!isAuto)}
            style={{
              flex: 1,
              padding: "12px",
              background: isAuto ? PLUM : WHITE,
              color: isAuto ? WHITE : TEXT_DARK,
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {isAuto ? "✓ Auto Mode" : "Manual Mode"}
          </button>
          <button
            onClick={onNext}
            style={{
              flex: 1,
              padding: "12px",
              background: PLUM,
              color: WHITE,
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Next Exercise →
          </button>
          <button
            onClick={onExit}
            style={{
              padding: "12px 24px",
              background: WHITE,
              color: TEXT_DARK,
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// HOME TAB
function HomeTab({ userData }) {
  return (
    <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, color: TEXT_DARK, marginBottom: 8 }}>Welcome back, mama 💜</h1>
      <p style={{ fontSize: 14, color: TEXT_MID, marginBottom: 24 }}>Your recovery journey continues. Let's build strength, together.</p>

      <div style={{ background: WHITE, borderRadius: 14, padding: "20px", marginBottom: 20, border: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 12, color: TEXT_MID, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Today's Suggested Workout</div>
        <h2 style={{ fontSize: 20, color: PLUM_DARK, marginBottom: 12 }}>Beginner Foundation</h2>
        <p style={{ fontSize: 13, color: TEXT_MID, marginBottom: 16, lineHeight: 1.6 }}>3 exercises • 15 minutes • Perfect for recovery</p>
        <button style={{ width: "100%", padding: "12px", background: PLUM, color: WHITE, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Start Workout →
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[["Days Active", "12"], ["Current Level", "Beginner"], ["Total Time", "4h 32m"]].map(([label, value]) => (
          <div key={label} style={{ background: WHITE, borderRadius: 12, padding: "16px", border: `1px solid ${BORDER}`, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: TEXT_MID, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: PLUM_DARK }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PRACTICE TAB
function PracticeTab({ userData }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);

  if (activeExercise) {
    return (
      <SessionScreen
        exercise={activeExercise}
        onNext={() => {
          const currentIndex = activeExercise.level === "beginner" ? EXERCISE_LEVELS_8.beginner.exercises.findIndex(e => e.id === activeExercise.id) : activeExercise.level === "intermediate" ? EXERCISE_LEVELS_8.intermediate.exercises.findIndex(e => e.id === activeExercise.id) : EXERCISE_LEVELS_8.advanced.exercises.findIndex(e => e.id === activeExercise.id);
          const exercises = activeExercise.level === "beginner" ? EXERCISE_LEVELS_8.beginner.exercises : activeExercise.level === "intermediate" ? EXERCISE_LEVELS_8.intermediate.exercises : EXERCISE_LEVELS_8.advanced.exercises;
          if (currentIndex < exercises.length - 1) {
            setActiveExercise(exercises[currentIndex + 1]);
          } else {
            setActiveExercise(null);
            setSelectedLevel(null);
          }
        }}
        onExit={() => { setActiveExercise(null); setSelectedLevel(null); }}
        userData={userData}
      />
    );
  }

  if (selectedLevel) {
    const exercises = EXERCISE_LEVELS_8[selectedLevel].exercises;
    return (
      <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
        <button onClick={() => setSelectedLevel(null)} style={{ background: "none", border: "none", cursor: "pointer", color: PLUM, fontSize: 14, fontWeight: 600, marginBottom: 20 }}>← Back</button>
        <h1 style={{ fontSize: 24, color: TEXT_DARK, marginBottom: 6 }}>{EXERCISE_LEVELS_8[selectedLevel].label}</h1>
        <p style={{ fontSize: 13, color: TEXT_MID, marginBottom: 20 }}>{exercises.length} exercises</p>
        {exercises.map(ex => (
          <div key={ex.id} style={{ background: WHITE, borderRadius: 12, padding: "16px", marginBottom: 12, border: `1px solid ${BORDER}`, cursor: "pointer" }} onClick={() => setActiveExercise(ex)}>
            <div style={{ fontSize: 16, fontWeight: 600, color: TEXT_DARK, marginBottom: 4 }}>{ex.name}</div>
            <div style={{ fontSize: 13, color: TEXT_MID }}>{ex.duration}s • {ex.reps}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, color: TEXT_DARK, marginBottom: 24 }}>Practice</h1>
      {Object.entries(EXERCISE_LEVELS_8).map(([key, level]) => (
        <div key={key} onClick={() => setSelectedLevel(key)} style={{ background: level.bgColor, borderRadius: 14, padding: "20px", marginBottom: 16, cursor: "pointer", border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 12, color: level.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>{level.weeks}</div>
          <h2 style={{ fontSize: 22, color: level.color, marginBottom: 4 }}>{level.label}</h2>
          <p style={{ fontSize: 13, color: TEXT_MID }}>{level.sublabel}</p>
          <div style={{ marginTop: 12, fontSize: 12, color: TEXT_MID }}>{level.exercises.length} exercises</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// CHECKIN TAB
function CheckinTab() {
  return (
    <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, color: TEXT_DARK, marginBottom: 20 }}>Self-Assessment</h1>
      <div style={{ background: WHITE, borderRadius: 12, padding: "20px", border: `1px solid ${BORDER}` }}>
        <p style={{ fontSize: 13, color: TEXT_MID, lineHeight: 1.6 }}>Track your core strength and pelvic floor health with our simple self-assessment. Do this weekly to monitor progress.</p>
        <button style={{ width: "100%", marginTop: 16, padding: "12px", background: PLUM, color: WHITE, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Begin Assessment
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// CIRCLE TAB
function CircleTab() {
  return (
    <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, color: TEXT_DARK, marginBottom: 20 }}>Mama Circles</h1>
      <div style={{ background: WHITE, borderRadius: 12, padding: "20px", border: `1px solid ${BORDER}` }}>
        <p style={{ fontSize: 13, color: TEXT_MID, lineHeight: 1.6 }}>Connect with other mothers on their recovery journey. Share experiences, celebrate wins, and support each other.</p>
        <button style={{ width: "100%", marginTop: 16, padding: "12px", background: PLUM, color: WHITE, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Join Community
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// RESOURCES TAB
function ResourcesTab() {
  return (
    <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, color: TEXT_DARK, marginBottom: 20 }}>Resources</h1>

      <div style={{ background: WHITE, borderRadius: 12, padding: "16px", marginBottom: 16, border: `1px solid ${BORDER}` }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: TEXT_DARK, marginBottom: 12 }}>Featured Videos</h3>
        <iframe width="100%" height="200" src="https://www.youtube.com/embed/2XAzDXZokEs" style={{ borderRadius: 8, border: "none" }} allowFullScreen></iframe>
      </div>

      <div style={{ background: WHITE, borderRadius: 12, padding: "16px", border: `1px solid ${BORDER}` }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: TEXT_DARK, marginBottom: 12 }}>Articles</h3>
        {["Understanding Abdominal Separation", "DIY Self-Assessment Guide", "Core Anatomy 101"].map(title => (
          <div key={title} style={{ paddingBottom: 12, borderBottom: `1px solid ${BORDER}`, marginBottom: 12, fontSize: 13, color: TEXT_MID, cursor: "pointer" }}>
            {title} →
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// LANDING PAGE
function Landing({ onStart, onHowItWorks }) {
  return (
    <div style={{ minHeight: "100vh", background: CREAM, padding: 32 }}>
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
            Now, let's rebuild your foundation. Private, data-driven diastasis recovery designed to make you feel strong again—at home, on your own terms.
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

// ─────────────────────────────────────────────────────────────────────────
// HOW IT WORKS
function HowItWorks({ onBack, onBegin }) {
  return (
    <div style={{ minHeight: "100vh", background: CREAM }}>
      <div style={{ background: WHITE, borderBottom: `1px solid ${BORDER}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: TEXT_MID, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TEXT_MID} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Home
        </button>
        <KoreLogo size={28} />
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 60px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, color: TEXT_DARK, marginBottom: 12 }}>How KORE Works</h1>
        <p style={{ fontSize: 16, color: TEXT_MID, marginBottom: 32, lineHeight: 1.7 }}>
          KORE uses AI-powered pose tracking to guide you through safe, effective core recovery exercises. Your phone becomes your personal trainer.
        </p>

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: TEXT_DARK, marginBottom: 20 }}>Three Steps to Recovery</h2>
          {[
            { num: 1, title: "Set Up Your Phone", desc: "Place your device where the camera can see your full body. No special equipment needed." },
            { num: 2, title: "Follow the Video", desc: "Watch Tolani guide you through each movement with clear instructions and warm encouragement." },
            { num: 3, title: "Get Real-Time Feedback", desc: "The app watches your form and speaks gentle corrections if needed. You heal safely at home." },
          ].map(step => (
            <div key={step.num} style={{ marginBottom: 20, display: "flex", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: PLUM, color: WHITE, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, flexShrink: 0 }}>{step.num}</div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: TEXT_DARK, marginBottom: 6 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onBegin} style={{ width: "100%", padding: "16px", background: PLUM, color: WHITE, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", marginBottom: 24 }}>
          Begin Your Recovery →
        </button>

        <div style={{ background: WHITE, borderRadius: 12, padding: "24px", border: `1px solid ${BORDER}` }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: TEXT_DARK, marginBottom: 16 }}>Frequently Asked Questions</h3>
          {[
            { q: "Is this recorded?", a: "Never. Your camera data stays on your device. We never record, save, or upload anything." },
            { q: "Will this really work?", a: "These exercises are clinically-backed and proven effective for diastasis recti recovery." },
          ].map(faq => (
            <div key={faq.q} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ fontWeight: 600, color: TEXT_DARK, marginBottom: 6, fontSize: 14 }}>{faq.q}</div>
              <div style={{ fontSize: 13, color: TEXT_MID, lineHeight: 1.6 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// ONBOARDING SURVEY MODAL
function OnboardingSurveyModal({ isOpen, onComplete }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
    else onComplete(answers);
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: WHITE, borderRadius: 20, padding: 32, maxWidth: 500, width: "90%", maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ fontSize: 12, color: TEXT_MID, marginBottom: 20 }}>STEP {step} OF 6</div>
        <div style={{ width: "100%", height: 4, background: CREAM, borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
          <div style={{ width: `${(step / 6) * 100}%`, height: "100%", background: PLUM, transition: "width 0.3s" }} />
        </div>

        {step === 1 && (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: TEXT_DARK, marginBottom: 16 }}>How far along are you?</h2>
            <input
              type="number"
              placeholder="Weeks postpartum"
              onChange={(e) => setAnswers({ ...answers, weeksPostpartum: e.target.value })}
              style={{ width: "100%", padding: "12px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 14, marginBottom: 16 }}
            />
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: TEXT_DARK, marginBottom: 16 }}>How did you give birth?</h2>
            {["Vaginal", "C-section", "Assisted"].map(option => (
              <ChoiceRow key={option} label={option} selected={answers.birthType === option} onClick={() => setAnswers({ ...answers, birthType: option })} />
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: TEXT_DARK, marginBottom: 16 }}>Any pain right now?</h2>
            <input
              type="range"
              min="0"
              max="10"
              onChange={(e) => setAnswers({ ...answers, painLevel: e.target.value })}
              style={{ width: "100%", marginBottom: 16 }}
            />
            <div style={{ textAlign: "center", fontSize: 14, color: TEXT_MID }}>0 = No pain • 10 = Severe</div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: TEXT_DARK, marginBottom: 16 }}>What symptoms are you experiencing?</h2>
            {["Core weakness", "Leaking", "Heaviness", "Back pain", "Pelvic pressure"].map(symptom => (
              <div key={symptom} style={{ marginBottom: 10 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" onChange={(e) => setAnswers({ ...answers, symptoms: e.target.checked ? [...(answers.symptoms || []), symptom] : (answers.symptoms || []).filter(s => s !== symptom) })} />
                  <span>{symptom}</span>
                </label>
              </div>
            ))}
          </>
        )}

        {step === 5 && (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: TEXT_DARK, marginBottom: 16 }}>Your fitness level?</h2>
            {["Not active", "Lightly active", "Moderately active", "Very active"].map(level => (
              <ChoiceRow key={level} label={level} selected={answers.fitnessLevel === level} onClick={() => setAnswers({ ...answers, fitnessLevel: level })} />
            ))}
          </>
        )}

        {step === 6 && (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: TEXT_DARK, marginBottom: 16 }}>What's your main goal?</h2>
            {["Regain core strength", "Stop leaking", "Feel more confident", "Prepare for exercise"].map(goal => (
              <ChoiceRow key={goal} label={goal} selected={answers.goal === goal} onClick={() => setAnswers({ ...answers, goal })} />
            ))}
          </>
        )}

        <button onClick={handleNext} style={{ width: "100%", marginTop: 24, padding: "14px", background: PLUM, color: WHITE, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          {step === 6 ? "Enter KORE →" : "Continue ›"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// APP SHELL & NAVIGATION
function AppShell({ activeTab, setActiveTab, children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
      <div style={{ background: WHITE, borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-around", padding: "12px 0", position: "sticky", bottom: 0 }}>
        {[
          { id: "home", icon: IconHome, label: "Home" },
          { id: "practice", icon: IconPractice, label: "Practice" },
          { id: "checkin", icon: IconCheckin, label: "Check-in" },
          { id: "circle", icon: IconCircle, label: "Circle" },
          { id: "resources", icon: IconResources, label: "Resources" },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1,
              padding: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: activeTab === id ? PLUM : TEXT_LIGHT,
              fontSize: 11,
              fontWeight: 500,
              transition: "color 0.2s",
            }}
          >
            <Icon color={activeTab === id ? PLUM : TEXT_LIGHT} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MAIN APP
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [onboardStep, setOnboardStep] = useState(1);
  const [userData, setUserData] = usePersistedState("kore_user_data", {});
  const [activeTab, setActiveTab] = useState("home");
  const [showSurvey, setShowSurvey] = useState(!hasSurveyBeenCompleted());

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
    const steps = [
      () => <div style={{ padding: 20 }}><h2>Step 1</h2></div>,
      () => <div style={{ padding: 20 }}><h2>Step 2</h2></div>,
      () => <div style={{ padding: 20 }}><h2>Step 3</h2></div>,
      () => <div style={{ padding: 20 }}><h2>Step 4</h2></div>,
      () => <div style={{ padding: 20 }}><h2>Step 5</h2></div>,
      () => <div style={{ padding: 20 }}><h2>Step 6</h2></div>,
    ];
    return (
      <><style>{fonts}{globalStyle}</style><div style={{ minHeight: "100vh", background: CREAM, padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: WHITE, borderRadius: 20, padding: 32, maxWidth: 500, width: "100%" }}>
          {steps[onboardStep - 1]()}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button onClick={goBack} style={{ flex: 1, padding: "12px", border: `1px solid ${BORDER}`, borderRadius: 8, cursor: "pointer" }}>Back</button>
            <button onClick={goNext} style={{ flex: 1, padding: "12px", background: PLUM, color: WHITE, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Next</button>
          </div>
        </div>
      </div></>
    );
  }

  const tabMap = {
    home: <HomeTab userData={userData} />,
    practice: <PracticeTab userData={userData} />,
    checkin: <CheckinTab />,
    circle: <CircleTab />,
    resources: <ResourcesTab />,
  };

  return (
    <><style>{fonts}{globalStyle}</style>
    <OnboardingSurveyModal isOpen={showSurvey && screen === "app"} onComplete={handleSurveyComplete} />
    <AppShell activeTab={activeTab} setActiveTab={setActiveTab}>
      {tabMap[activeTab]}
    </AppShell></>
  );
}
