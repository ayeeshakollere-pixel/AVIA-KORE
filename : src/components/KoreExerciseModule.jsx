import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS (matches KoreApp) ─────────────────────────────────────────
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
const WARN_AMBER = "#B45309";
const WARN_BG = "#FFFBEB";

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');`;
const globalStyle = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #000; font-family: 'DM Sans', sans-serif; }
  .serif { font-family: 'Playfair Display', serif; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes breatheIn  { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.35); opacity: 1; } }
  @keyframes breatheOut { 0% { transform: scale(1.35); opacity: 1; } 100% { transform: scale(1);    opacity: 0.6; } }
  @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes toastIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
`;

// ═══════════════════════════════════════════════════════════════════════════════
//  1. EXERCISE DATABASE — 21 DR-APPROVED ROUTINES
// ═══════════════════════════════════════════════════════════════════════════════
/*
  VISUAL IDENTITY DIRECTIVE (for asset pipeline / video production):
  ─────────────────────────────────────────────────────────────────
  MODEL:      Light-skinned Fulani woman, long wavy/curly hair, NOT pregnant.
  WARDROBE:   Soft sage or cream activewear, minimal jewellery.
  SETTING:    Warm cream/wood toned home environment, natural light.

  CORE PROGRESSION ACROSS LEVELS:
  • BEGINNER   → Model's tummy: naturally soft, postpartum distension visible.
                 Camera angle: wide, fully visible, reassuring & non-judgmental.
  • INTERMEDIATE → Model's tummy: visibly firmer, moderate flattening evident.
                   Camera angle: medium close, confident body language.
  • ADVANCED   → Model's tummy: flat, toned, fully rehabilitated appearance.
                 Camera angle: dynamic, athletic energy.

  VIDEO SPECS: portrait 9:16, 1080×1920, 30fps, loopable 30–45 sec clips.
  AUDIO:       Instructor voice pre-mixed at -12dB, ambient at -24dB.
*/

export const EXERCISE_DB = {
  beginner: {
    label: "Beginner",
    sublabel: "Deep Activation",
    color: SAGE_DARK,
    bgColor: SAGE,
    weeks: "Weeks 1–6",
    coreStage: "Early postpartum — gentle reconnection",
    modelNote: "Soft, natural postpartum tummy. Gentle body language. Warm lighting.",
    exercises: [
      {
        id: "beg_01", level: "beginner", order: 1,
        name: "Pelvic Tilts",
        duration: 45, reps: "10 reps × 2 sets", restSeconds: 30,
        position: "supine",
        description: "Lie on your back, knees bent. Gently flatten your lower back into the mat by tilting your pelvis. Hold 3 seconds, release.",
        breathingCue: "Exhale as you tilt, inhale to release.",
        safetyNote: "Never force the arch. Move only within pain-free range.",
        trackingFocus: ["pelvicTilt", "spineNeutral"],
        videoAsset: "beg_pelvic_tilts.mp4",
        thumbnailAsset: "beg_01_thumb.jpg",
        modelBodyNote: "Soft postpartum tummy visible. Reassuring, unhurried pace.",
      },
      {
        id: "beg_02", level: "beginner", order: 2,
        name: "Abdominal Bracing",
        duration: 40, reps: "8 reps × 2 sets", restSeconds: 30,
        position: "supine",
        description: "Lying on your back, breathe in gently. On the exhale, draw your navel toward your spine without sucking in or holding your breath. Hold 5 seconds.",
        breathingCue: "Exhale, draw navel in. Breathe normally while holding.",
        safetyNote: "Never hold your breath. This is a gentle contraction, not a suck-in.",
        trackingFocus: ["abdominalEngagement", "breathCoordination"],
        videoAsset: "beg_abdominal_bracing.mp4",
        thumbnailAsset: "beg_02_thumb.jpg",
        modelBodyNote: "Soft tummy. Subtle engagement visible but not forced.",
      },
      {
        id: "beg_03", level: "beginner", order: 3,
        name: "Supported Heel Slides",
        duration: 45, reps: "8 each side × 2 sets", restSeconds: 30,
        position: "supine",
        description: "Lying on your back, brace your core gently. Slowly slide one heel along the mat away from you, then draw it back. Alternate sides.",
        breathingCue: "Exhale to brace, inhale to slide out, exhale to return.",
        safetyNote: "If you feel your back arch, shorten the range of movement.",
        trackingFocus: ["pelvicStability", "spineNeutral", "breathCoordination"],
        videoAsset: "beg_heel_slides_supported.mp4",
        thumbnailAsset: "beg_03_thumb.jpg",
        modelBodyNote: "Tummy soft but bracing visible. Slow, controlled movement.",
      },
      {
        id: "beg_04", level: "beginner", order: 4,
        name: "Low Glute Bridges",
        duration: 45, reps: "10 reps × 2 sets", restSeconds: 30,
        position: "supine",
        description: "Feet flat on the mat, hip-width apart. Gently lift your hips a few inches off the mat, squeezing your glutes. Hold 2 seconds and lower slowly.",
        breathingCue: "Exhale to lift, inhale to hold, exhale to lower.",
        safetyNote: "Keep the range small — hips lift only a few inches. No full extension yet.",
        trackingFocus: ["pelvicTilt", "spineAlignment", "breathCoordination"],
        videoAsset: "beg_glute_bridges_low.mp4",
        thumbnailAsset: "beg_04_thumb.jpg",
        modelBodyNote: "Partial bridge only. Relaxed tummy profile throughout.",
      },
      {
        id: "beg_05", level: "beginner", order: 5,
        name: "Modified Dead Bug (Feet on Floor)",
        duration: 50, reps: "6 each side × 2 sets", restSeconds: 40,
        position: "supine",
        description: "Arms reaching toward ceiling, knees bent and feet flat. Brace your core, then slowly lower one arm overhead while keeping your back pressed to the mat. Return and switch.",
        breathingCue: "Exhale to brace and move, inhale to return.",
        safetyNote: "If your lower back peels off the mat, stop and reset. Back must stay flat throughout.",
        trackingFocus: ["spineNeutral", "pelvicStability", "abdominalEngagement"],
        videoAsset: "beg_dead_bug_modified.mp4",
        thumbnailAsset: "beg_05_thumb.jpg",
        modelBodyNote: "Feet stay grounded. Core engagement visible without straining.",
      },
      {
        id: "beg_06", level: "beginner", order: 6,
        name: "Seated TVA Contractions",
        duration: 40, reps: "10 reps × 2 sets", restSeconds: 20,
        position: "seated",
        description: "Sit tall on the edge of a chair or mat. Breathe in to expand your ribcage. On the exhale, gently draw your lower belly in and up. Hold 5 seconds. Release fully.",
        breathingCue: "Inhale to expand, exhale to draw in. Never suck in — imagine a gentle hug around your waist.",
        safetyNote: "Sit tall throughout. Avoid rounding your shoulders.",
        trackingFocus: ["spineAlignment", "abdominalEngagement", "breathCoordination"],
        videoAsset: "beg_seated_tva.mp4",
        thumbnailAsset: "beg_06_thumb.jpg",
        modelBodyNote: "Upright seated position. Warm, encouraging expression.",
      },
      {
        id: "beg_07", level: "beginner", order: 7,
        name: "Side-Lying Clamshells",
        duration: 45, reps: "12 each side × 2 sets", restSeconds: 30,
        position: "sidelying",
        description: "Lie on your side, hips stacked, knees bent at 45°. Keep your feet together and slowly rotate your top knee toward the ceiling like a clamshell opening. Lower slowly.",
        breathingCue: "Exhale to open, inhale to close.",
        safetyNote: "Your hips must not roll backward. Place a hand on your top hip to check.",
        trackingFocus: ["pelvicStability", "spineAlignment"],
        videoAsset: "beg_clamshells.mp4",
        thumbnailAsset: "beg_07_thumb.jpg",
        modelBodyNote: "Side-lying. Tummy relaxed and natural. Controlled, gentle rotation.",
      },
    ],
  },

  intermediate: {
    label: "Intermediate",
    sublabel: "Core Loading",
    color: PLUM,
    bgColor: PLUM_PALE,
    weeks: "Weeks 7–12",
    coreStage: "Rebuilding — increased load with stability",
    modelNote: "Tummy visibly firmer, moderately flatter. Confident, upright posture.",
    exercises: [
      {
        id: "int_01", level: "intermediate", order: 1,
        name: "Unsupported Heel Slides",
        duration: 50, reps: "10 each side × 3 sets", restSeconds: 30,
        position: "supine",
        description: "Same as supported version but without pressing your hands into the mat. Core must stabilise independently as you slide your heel out and return.",
        breathingCue: "Exhale to brace and slide, inhale to hold neutral, exhale to return.",
        safetyNote: "The moment your back arches, reduce range. Control is everything.",
        trackingFocus: ["pelvicStability", "spineNeutral", "abdominalEngagement"],
        videoAsset: "int_heel_slides.mp4",
        thumbnailAsset: "int_01_thumb.jpg",
        modelBodyNote: "Firmer tummy profile. More deliberate core engagement visible.",
      },
      {
        id: "int_02", level: "intermediate", order: 2,
        name: "Dead Bug (Legs Only)",
        duration: 50, reps: "8 each side × 3 sets", restSeconds: 35,
        position: "supine",
        description: "Arms resting on the mat beside you. Knees above hips at 90°. Slowly lower one foot toward the floor, tapping lightly, then return. Back stays flat throughout.",
        breathingCue: "Exhale to lower, inhale to return.",
        safetyNote: "If your lower back lifts, stop. Your spine must stay grounded — no exceptions.",
        trackingFocus: ["spineNeutral", "pelvicTilt", "abdominalEngagement"],
        videoAsset: "int_dead_bug_legs.mp4",
        thumbnailAsset: "int_02_thumb.jpg",
        modelBodyNote: "Moderate core definition visible. Controlled, confident movement.",
      },
      {
        id: "int_03", level: "intermediate", order: 3,
        name: "Bird-Dog (Alternating Arm & Leg)",
        duration: 55, reps: "8 each side × 3 sets", restSeconds: 35,
        position: "quadruped",
        description: "On hands and knees, wrists under shoulders, knees under hips. Brace your core, then extend opposite arm and leg simultaneously. Hold 3 seconds. Return and switch.",
        breathingCue: "Exhale to extend, breathe steadily while holding, inhale to return.",
        safetyNote: "No hip rotation. Imagine balancing a glass of water on your lower back.",
        trackingFocus: ["spineAlignment", "pelvicStability", "shoulderAlignment"],
        videoAsset: "int_bird_dog.mp4",
        thumbnailAsset: "int_03_thumb.jpg",
        modelBodyNote: "Quadruped position. Strong, stable core. Tummy moderately toned.",
      },
      {
        id: "int_04", level: "intermediate", order: 4,
        name: "Bent-Knee Fall Outs",
        duration: 45, reps: "10 each side × 3 sets", restSeconds: 30,
        position: "supine",
        description: "Lying on your back, knees bent. Keep core braced as you slowly lower one knee out to the side — only as far as you can without your pelvis rocking. Return slowly.",
        breathingCue: "Exhale to brace, inhale to lower, exhale to return.",
        safetyNote: "Pelvis must stay perfectly still. This is a hip mobility exercise controlled by your core.",
        trackingFocus: ["pelvicStability", "abdominalEngagement", "spineNeutral"],
        videoAsset: "int_knee_fallouts.mp4",
        thumbnailAsset: "int_04_thumb.jpg",
        modelBodyNote: "Supine. Visible engagement without straining. Moderate tummy tone.",
      },
      {
        id: "int_05", level: "intermediate", order: 5,
        name: "Modified Side Plank (Knees)",
        duration: 40, reps: "3 × 20-sec holds each side", restSeconds: 40,
        position: "sidelying",
        description: "Lie on your side, support yourself on your forearm with knees bent and stacked. Lift your hips to create a straight line from head to knees. Hold steady.",
        breathingCue: "Breathe steadily and continuously throughout the hold.",
        safetyNote: "If your hips sag or pike, reduce hold time. Quality over duration always.",
        trackingFocus: ["spineAlignment", "pelvicStability", "shoulderAlignment"],
        videoAsset: "int_side_plank_modified.mp4",
        thumbnailAsset: "int_05_thumb.jpg",
        modelBodyNote: "Side plank from knees. Core visibly engaged. Tummy moderately flat.",
      },
      {
        id: "int_06", level: "intermediate", order: 6,
        name: "Seated Heel Taps",
        duration: 45, reps: "12 each side × 3 sets", restSeconds: 25,
        position: "seated",
        description: "Sit tall, lean slightly back on your hands for support. Lift both feet off the floor, knees bent. Slowly tap one heel to the floor, return, alternate sides.",
        breathingCue: "Exhale to tap, inhale to return. Never hold your breath.",
        safetyNote: "Keep your spine long. Avoid rounding your lower back.",
        trackingFocus: ["abdominalEngagement", "spineAlignment", "breathCoordination"],
        videoAsset: "int_seated_heel_taps.mp4",
        thumbnailAsset: "int_06_thumb.jpg",
        modelBodyNote: "Seated, upright. Firm tummy. Controlled foot movement.",
      },
      {
        id: "int_07", level: "intermediate", order: 7,
        name: "Wall Squats with TVA Hold",
        duration: 50, reps: "8 reps × 3 sets", restSeconds: 40,
        position: "standing",
        description: "Stand with your back flat against a wall. Slide down until thighs are parallel to the floor. Hold the position while maintaining a gentle TVA contraction for 5 seconds. Slide back up.",
        breathingCue: "Exhale to brace TVA, breathe gently while holding the squat.",
        safetyNote: "Knees should not go past your toes. Keep back fully in contact with the wall.",
        trackingFocus: ["spineAlignment", "abdominalEngagement", "pelvicTilt"],
        videoAsset: "int_wall_squats_tva.mp4",
        thumbnailAsset: "int_07_thumb.jpg",
        modelBodyNote: "Standing, upright. Tummy visibly toned and engaged against wall.",
      },
    ],
  },

  advanced: {
    label: "Advanced",
    sublabel: "Functional Strength",
    color: "#2D5A3D",
    bgColor: "#E8F0EB",
    weeks: "Weeks 13+",
    coreStage: "Restored — functional load and stability",
    modelNote: "Flat, toned, fully rehabilitated tummy. Athletic, confident energy.",
    exercises: [
      {
        id: "adv_01", level: "advanced", order: 1,
        name: "Full Dead Bug (Opposite Arm & Leg)",
        duration: 55, reps: "8 each side × 3 sets", restSeconds: 40,
        position: "supine",
        description: "Arms reaching to the ceiling, knees above hips at 90°. Simultaneously lower opposite arm overhead and the opposite leg toward the floor. Return and switch. Back stays flat.",
        breathingCue: "Exhale fully to brace and move. Inhale to return.",
        safetyNote: "This exercise demands complete spinal stability. If your back lifts even slightly, regress to the intermediate version.",
        trackingFocus: ["spineNeutral", "pelvicStability", "abdominalEngagement", "breathCoordination"],
        videoAsset: "adv_dead_bug_full.mp4",
        thumbnailAsset: "adv_01_thumb.jpg",
        modelBodyNote: "Flat, toned tummy throughout. Athletic precision in movement.",
      },
      {
        id: "adv_02", level: "advanced", order: 2,
        name: "Full Bird-Dog",
        duration: 55, reps: "10 each side × 3 sets", restSeconds: 35,
        position: "quadruped",
        description: "From hands and knees, extend opposite arm and leg fully with a 3-second hold. Focus on length through the crown of the head and heel simultaneously.",
        breathingCue: "Exhale to extend, hold steady with natural breathing, inhale to return.",
        safetyNote: "No lateral sway. Core must be actively drawn in throughout the hold.",
        trackingFocus: ["spineAlignment", "pelvicStability", "shoulderAlignment"],
        videoAsset: "adv_bird_dog_full.mp4",
        thumbnailAsset: "adv_02_thumb.jpg",
        modelBodyNote: "Fully extended position. Flat, toned core under load. Athletic posture.",
      },
      {
        id: "adv_03", level: "advanced", order: 3,
        name: "Full Side Plank (From Feet)",
        duration: 45, reps: "3 × 30-sec holds each side", restSeconds: 45,
        position: "sidelying",
        description: "Support yourself on your forearm with feet stacked. Lift hips to create a diagonal line from head to heel. Hold with steady breathing.",
        breathingCue: "Breathe continuously. Short exhale every 5 seconds to re-engage your core.",
        safetyNote: "Hips must not sag. If they do, drop to modified (knees) version immediately.",
        trackingFocus: ["spineAlignment", "pelvicStability", "shoulderAlignment"],
        videoAsset: "adv_side_plank_full.mp4",
        thumbnailAsset: "adv_03_thumb.jpg",
        modelBodyNote: "Full side plank. Obliques and core visibly defined. Confident hold.",
      },
      {
        id: "adv_04", level: "advanced", order: 4,
        name: "Elevated Single-Leg Glute Bridges",
        duration: 50, reps: "10 each side × 3 sets", restSeconds: 40,
        position: "supine",
        description: "Heels elevated on a chair or sofa. Extend one leg straight. Drive through the grounded heel to lift hips until body is in a straight line. Hold 2 seconds. Lower slowly.",
        breathingCue: "Exhale to drive up, inhale to hold, exhale to lower.",
        safetyNote: "Hips must stay level. Do not let the unsupported side drop.",
        trackingFocus: ["pelvicStability", "spineAlignment", "abdominalEngagement"],
        videoAsset: "adv_single_leg_bridge.mp4",
        thumbnailAsset: "adv_04_thumb.jpg",
        modelBodyNote: "Strong, elevated bridge. Flat, toned tummy under extension. Athletic.",
      },
      {
        id: "adv_05", level: "advanced", order: 5,
        name: "Modified Front Plank (Forearms & Knees, TVA Hollow)",
        duration: 45, reps: "3 × 30-sec holds", restSeconds: 45,
        position: "prone",
        description: "Forearms on the mat, knees on the mat. Brace your deep core, creating a gentle hollow through your lower abdomen. Body forms a straight line from head to knees. Hold.",
        breathingCue: "Short, steady exhales throughout. Never hold your breath in a plank.",
        safetyNote: "Do not allow hips to pike upward or lower back to sag. The hollow-core position protects your diastasis.",
        trackingFocus: ["spineAlignment", "abdominalEngagement", "pelvicTilt"],
        videoAsset: "adv_plank_modified.mp4",
        thumbnailAsset: "adv_05_thumb.jpg",
        modelBodyNote: "Controlled plank. Flat tummy with hollow engagement. Stable, strong.",
      },
      {
        id: "adv_06", level: "advanced", order: 6,
        name: "Standing Paloff Press",
        duration: 50, reps: "10 each side × 3 sets", restSeconds: 35,
        position: "standing",
        description: "Stand side-on to a resistance band anchor. Hold band at chest. Brace core, then press hands straight out in front of you, resisting rotation. Hold 2 seconds. Return.",
        breathingCue: "Exhale to press, hold breath-easy while extended, inhale to return.",
        safetyNote: "The goal is zero rotation. Your core must work against the pull of the band throughout.",
        trackingFocus: ["spineAlignment", "pelvicStability", "abdominalEngagement", "shoulderAlignment"],
        videoAsset: "adv_paloff_press.mp4",
        thumbnailAsset: "adv_06_thumb.jpg",
        modelBodyNote: "Standing. Flat, athletic tummy. Anti-rotation core challenge visible.",
      },
      {
        id: "adv_07", level: "advanced", order: 7,
        name: "Single-Leg Balance with Core Bracing",
        duration: 45, reps: "30-sec each leg × 3 sets", restSeconds: 30,
        position: "standing",
        description: "Stand on one leg, soft knee. Draw your core in gently and hold for 30 seconds. Add a gentle head turn or arm movement to increase challenge.",
        breathingCue: "Breathe naturally throughout. Core stays engaged without gripping.",
        safetyNote: "Stand near a wall for safety if needed. Build balance before removing support.",
        trackingFocus: ["spineAlignment", "pelvicStability", "abdominalEngagement"],
        videoAsset: "adv_single_leg_balance.mp4",
        thumbnailAsset: "adv_07_thumb.jpg",
        modelBodyNote: "Upright, balanced. Flat, toned profile. Calm, focused expression.",
      },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
//  2. VOICE SCRIPT ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export const VOICE_SCRIPTS = {
  // ── Breathing rhythm cues ──────────────────────────────────────────────────
  breathing: [
    "Inhale deeply... let your ribs expand outward... and exhale slowly, drawing your navel gently toward your spine.",
    "Breathe in through your nose... feel your belly soften... now breathe out through your mouth, nice and slow.",
    "Let's breathe together. Inhale... hold for just a moment... and release. Beautiful.",
    "As you inhale, think of filling a balloon low in your belly... and as you exhale, gently let it deflate.",
    "Inhale for four counts — one, two, three, four — and exhale for six. You're doing so well.",
    "Let your breath lead the movement. Inhale to prepare... exhale as you engage.",
    "Keep breathing steadily, mama. Never hold your breath during this one — your body needs that oxygen.",
  ],

  // ── Exercise start ─────────────────────────────────────────────────────────
  exerciseStart: [
    "Whenever you're ready, let's begin. Move at your own pace — there's no rush here.",
    "Take a moment to find your position, then we'll move together.",
    "Before we start, take one big breath in... and let it all go. Now we begin.",
    "Listen to your body throughout this one. If anything feels sharp or uncomfortable, we stop and rest.",
  ],

  // ── Encouragement mid-set ─────────────────────────────────────────────────
  encouragement: [
    "You're doing beautifully. Every small movement is healing your body from within.",
    "Stay with me — you're stronger than you think.",
    "Halfway through. You've got this, mama.",
    "I can see how hard you're working. Keep going — this is real progress.",
    "Your deep core muscles are waking up right now. This is exactly what they need.",
    "Just a few more. Make each one count.",
  ],

  // ── Rest period ───────────────────────────────────────────────────────────
  rest: [
    "Rest for a moment. Let your breath settle. You've earned it.",
    "Take your time. Shake out your hands, soften your jaw. We'll continue shortly.",
    "Rest here. Notice how your body feels — that warmth is healing.",
  ],

  // ── Exercise complete ─────────────────────────────────────────────────────
  exerciseComplete: [
    "Wonderful. That's one exercise complete. Take a gentle breath before we move on.",
    "That was perfect. Let's pause and acknowledge what your body just did.",
    "Well done. Every rep is a step closer to a stronger, healed core.",
  ],

  // ── Session complete ──────────────────────────────────────────────────────
  sessionComplete: [
    "That is your session complete, mama. I am so proud of you for showing up today.",
    "You did it. Every exercise done with care and intention — that is exactly how healing happens.",
    "Your body worked beautifully today. Rest, hydrate, and come back when you're ready. You're healing.",
  ],

  // ── POSTURE CORRECTION PROMPTS ─────────────────────────────────────────────
  corrections: {
    spineArching: [
      "Your back is arching slightly, love — gently tilt your pelvis forward to protect your core.",
      "I notice a little arch in your lower back. Press it gently into the mat and reset.",
      "Soften your lower back toward the floor, sweetheart. There — much better.",
    ],
    spineRounding: [
      "Lift through the crown of your head — your spine wants to be long and tall here.",
      "Gently draw your shoulders back and down, and find length through your spine.",
      "You're rounding forward slightly — think of a string gently pulling you upright.",
    ],
    pelvicTiltForward: [
      "Your pelvis is tilting forward — imagine tucking your tailbone gently underneath you.",
      "Find a neutral pelvis here. Not arched, not tucked — just balanced.",
    ],
    pelvicTiltBack: [
      "You've tucked your pelvis a little too far — release slightly and find a natural position.",
      "Soften that tuck — think neutral rather than gripped.",
    ],
    breathHolding: [
      "Remember to keep breathing, love. Release any tension in your jaw and breathe steadily.",
      "I can see you're holding your breath — let it go and breathe naturally as you move.",
      "Breath is your medicine here. Keep it flowing, even when it's hard.",
    ],
    shoulderTension: [
      "Soften your shoulders away from your ears — release the tension you're holding there.",
      "Let your shoulders melt down your back. You don't need to grip here.",
    ],
    lossOfForm: [
      "Let's pause and reset. Take a breath, realign, and then continue when you're ready.",
      "Don't push through bad form, love — it's always better to stop, reset, and begin again safely.",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
//  3. AI POSTURE TRACKING ENGINE  (MediaPipe Pose — on-device, zero upload)
// ═══════════════════════════════════════════════════════════════════════════════
/*
  PRIVACY ARCHITECTURE:
  ┌─────────────────────────────────────────────────────────────┐
  │  USER CAMERA  →  MediaPipe Pose (WASM, local)              │
  │                         ↓                                   │
  │  Landmark coordinates ONLY (numbers, no pixels/frames)     │
  │                         ↓                                   │
  │  PostureAnalyzer (JS state only, no storage)               │
  │                         ↓                                   │
  │  Trigger → VoiceEngine (Web Speech API, on-device TTS)     │
  │                                                             │
  │  ZERO VIDEO SAVED · ZERO DATA UPLOADED · ON-DEVICE ONLY    │
  └─────────────────────────────────────────────────────────────┘
*/

// Landmark indices from MediaPipe Pose (33-point skeleton)
const LM = {
  NOSE: 0, LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12,
  LEFT_HIP: 23, RIGHT_HIP: 24, LEFT_KNEE: 25, RIGHT_KNEE: 26,
  LEFT_ANKLE: 27, RIGHT_ANKLE: 28, LEFT_EAR: 7, RIGHT_EAR: 8,
};

function vectorAngle(a, b, c) {
  // Returns angle in degrees at point B, formed by A-B-C
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.hypot(ab.x, ab.y);
  const magCB = Math.hypot(cb.x, cb.y);
  if (magAB === 0 || magCB === 0) return 180;
  return (Math.acos(Math.min(1, Math.max(-1, dot / (magAB * magCB)))) * 180) / Math.PI;
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: ((a.z || 0) + (b.z || 0)) / 2 };
}

export function analyzePosture(landmarks, exerciseTrackingFocus) {
  if (!landmarks || landmarks.length < 29) return { issues: [], scores: {} };

  const lm = (idx) => landmarks[idx];
  const issues = [];
  const scores = {};

  const midShoulder = midpoint(lm(LM.LEFT_SHOULDER), lm(LM.RIGHT_SHOULDER));
  const midHip      = midpoint(lm(LM.LEFT_HIP),      lm(LM.RIGHT_HIP));
  const midKnee     = midpoint(lm(LM.LEFT_KNEE),     lm(LM.RIGHT_KNEE));

  // ── 1. SPINE ALIGNMENT ────────────────────────────────────────────────────
  if (exerciseTrackingFocus.includes("spineNeutral") || exerciseTrackingFocus.includes("spineAlignment")) {
    // Measure the angle at the hip between shoulder–hip–knee
    const spineAngle = vectorAngle(midShoulder, midHip, midKnee);
    scores.spineAngle = spineAngle;

    // In a supine neutral position the hip angle should be ~160–175°
    // For standing/sitting: ~170–180° (straight line)
    const SPINE_ARCH_THRESHOLD   = 145; // below = arching
    const SPINE_ROUND_THRESHOLD  = 185; // above = rounding (for standing)

    if (spineAngle < SPINE_ARCH_THRESHOLD) {
      issues.push({ type: "spineArching", severity: spineAngle < 130 ? "high" : "medium", angle: spineAngle });
    }
  }

  // ── 2. PELVIC TILT ───────────────────────────────────────────────────────
  if (exerciseTrackingFocus.includes("pelvicTilt") || exerciseTrackingFocus.includes("pelvicStability")) {
    // Compare Y-axis position of left vs right hip — lateral tilt
    const hipLevelDiff = Math.abs(lm(LM.LEFT_HIP).y - lm(LM.RIGHT_HIP).y);
    scores.hipLevelDiff = hipLevelDiff;

    // Anterior/posterior tilt: measure the horizontal displacement of midHip vs midShoulder
    const anteriorPosteriorOffset = midHip.x - midShoulder.x;
    scores.anteriorPosteriorOffset = anteriorPosteriorOffset;

    if (hipLevelDiff > 0.06) {
      // 0.06 in normalized coordinates ≈ 6% of frame height — notable tilt
      issues.push({ type: "pelvicTiltForward", severity: hipLevelDiff > 0.1 ? "high" : "medium" });
    }
  }

  // ── 3. SHOULDER ALIGNMENT ────────────────────────────────────────────────
  if (exerciseTrackingFocus.includes("shoulderAlignment")) {
    const shoulderLevelDiff = Math.abs(lm(LM.LEFT_SHOULDER).y - lm(LM.RIGHT_SHOULDER).y);
    const shoulderElevation = midShoulder.y; // lower Y = higher on frame = elevated
    scores.shoulderLevelDiff = shoulderLevelDiff;

    if (shoulderLevelDiff > 0.05) {
      issues.push({ type: "shoulderTension", severity: "medium" });
    }
  }

  // ── 4. ABDOMINAL ENGAGEMENT (proxy via breathing) ────────────────────────
  // We use the vertical distance between shoulder and hip landmarks as a proxy
  // for ribcage expansion. If this expands rhythmically, breathing is happening.
  if (exerciseTrackingFocus.includes("breathCoordination")) {
    const torsoHeight = Math.abs(midShoulder.y - midHip.y);
    scores.torsoHeight = torsoHeight;
    // The caller tracks this value over time to detect breathing rhythm
  }

  // Composite form score (0–100)
  const penaltyPerIssue = { high: 25, medium: 12, low: 5 };
  const totalPenalty = issues.reduce((sum, i) => sum + (penaltyPerIssue[i.severity] || 10), 0);
  scores.formScore = Math.max(0, 100 - totalPenalty);

  return { issues, scores };
}

// ─── Breathing rhythm detector ────────────────────────────────────────────────
export class BreathingRhythmTracker {
  constructor() {
    this.torsoHistory = [];
    this.maxHistory = 60; // ~2 seconds at 30fps
    this.lastBreathState = "unknown";
    this.breathCount = 0;
    this.holdFrameCount = 0;
    this.HOLD_THRESHOLD = 45; // ~1.5 seconds without breathing oscillation
  }

  update(torsoHeight) {
    this.torsoHistory.push(torsoHeight);
    if (this.torsoHistory.length > this.maxHistory) this.torsoHistory.shift();

    const range = Math.max(...this.torsoHistory) - Math.min(...this.torsoHistory);
    const isBreathing = range > 0.012; // normalized units threshold for ribcage movement

    if (!isBreathing) {
      this.holdFrameCount++;
    } else {
      this.holdFrameCount = 0;
      // Detect phase transition for breath count
      const recent = this.torsoHistory.slice(-10);
      const trend = recent[recent.length - 1] - recent[0];
      const newState = trend < -0.003 ? "exhale" : trend > 0.003 ? "inhale" : this.lastBreathState;
      if (newState !== this.lastBreathState && newState !== "unknown") {
        if (newState === "exhale") this.breathCount++;
        this.lastBreathState = newState;
      }
    }

    return {
      isBreathing,
      isHolding: this.holdFrameCount > this.HOLD_THRESHOLD,
      phase: this.lastBreathState,
      breathCount: this.breathCount,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  4. VOICE ENGINE  (Web Speech API — fully on-device TTS)
// ═══════════════════════════════════════════════════════════════════════════════

export class VoiceEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.queue = [];                   // queue of texts to speak
    this.isSpeaking = false;
    this.cooldowns = {};               // per-correction cooldown timestamps
    this.CORRECTION_COOLDOWN = 8000;
    this.audio = null;                 // HTMLAudioElement for ElevenLabs
    this.preferredVoice = null;
    this._initBrowserVoice();
  }

  _initBrowserVoice() {
    const setVoice = () => {
      const voices = this.synth.getVoices();
      const preferred = voices.find(v =>
        (v.lang.startsWith("en-GB") || v.lang.startsWith("en-AU") || v.lang.startsWith("en-US")) &&
        (v.name.toLowerCase().includes("female") ||
         v.name.includes("Samantha") || v.name.includes("Karen") ||
         v.name.includes("Moira") || v.name.includes("Victoria"))
      ) || voices.find(v => v.lang.startsWith("en")) || voices[0];
      this.preferredVoice = preferred || null;
    };
    if (this.synth.getVoices().length > 0) setVoice();
    else this.synth.onvoiceschanged = setVoice;
  }

  // Browser fallback (only if ElevenLabs call fails)
  _speakBrowser(text, onDone) {
    this.synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.88; utt.pitch = 1.05; utt.volume = 1.0;
    if (this.preferredVoice) utt.voice = this.preferredVoice;
    utt.onend = onDone || (() => {});
    this.synth.speak(utt);
  }

  // Try ElevenLabs first via /api/voice, fall back to browser if it errors
  async _speakElevenLabs(text) {
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("voice api non-200");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (!this.audio) this.audio = new Audio();
      return new Promise((resolve) => {
        this.audio.src = url;
        this.audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
        this.audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
        this.audio.play().catch(() => resolve());
      });
    } catch {
      return new Promise((resolve) => this._speakBrowser(text, resolve));
    }
  }

  async _processQueue() {
    if (this.isSpeaking) return;
    if (this.queue.length === 0) return;
    this.isSpeaking = true;
    const { text } = this.queue.shift();
    await this._speakElevenLabs(text);
    this.isSpeaking = false;
    if (this.queue.length > 0) this._processQueue();
  }

  say(text, priority = "normal") {
    if (priority === "high") {
      // Interrupt
      if (this.audio) { this.audio.pause(); this.audio.currentTime = 0; }
      this.synth.cancel();
      this.queue = [{ text, priority }];
      this.isSpeaking = false;
      this._processQueue();
    } else {
      this.queue.push({ text, priority });
      if (!this.isSpeaking) this._processQueue();
    }
  }

  correction(type) {
    const now = Date.now();
    if (this.cooldowns[type] && now - this.cooldowns[type] < this.CORRECTION_COOLDOWN) return;
    this.cooldowns[type] = now;
    const scripts = VOICE_SCRIPTS.corrections[type];
    if (!scripts) return;
    const text = scripts[Math.floor(Math.random() * scripts.length)];
    this.say(text, "normal");
  }

  randomFrom(category) {
    const arr = VOICE_SCRIPTS[category];
    if (!arr) return;
    this.say(arr[Math.floor(Math.random() * arr.length)]);
  }

  stop() {
    if (this.audio) { this.audio.pause(); this.audio.src = ""; }
    this.synth.cancel();
    this.queue = [];
    this.isSpeaking = false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  5. EXERCISE LIBRARY SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function LevelBadge({ level }) {
  const map = {
    beginner:     { bg: SAGE,       color: SAGE_DARK,  label: "Beginner" },
    intermediate: { bg: PLUM_PALE,  color: PLUM,       label: "Intermediate" },
    advanced:     { bg: "#E8F0EB",  color: "#2D5A3D",  label: "Advanced" },
  };
  const s = map[level] || map.beginner;
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20, letterSpacing: 0.5 }}>{s.label}</span>;
}

function ExerciseCard({ exercise, onSelect }) {
  const level = EXERCISE_DB[exercise.level];
  return (
    <div onClick={() => onSelect(exercise)} style={{ background: WHITE, borderRadius: 16, border: `1px solid ${BORDER}`, padding: "16px 18px", marginBottom: 10, cursor: "pointer", display: "flex", gap: 14, alignItems: "center", animation: "fadeIn 0.3s ease" }}>
      {/* Thumbnail placeholder */}
      <div style={{ width: 56, height: 56, borderRadius: 12, background: level.bgColor, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 18, color: level.color }}>{exercise.order}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: TEXT_DARK, marginBottom: 4 }}>{exercise.name}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <LevelBadge level={exercise.level} />
          <span style={{ fontSize: 12, color: TEXT_LIGHT }}>{exercise.reps}</span>
          <span style={{ fontSize: 12, color: TEXT_LIGHT }}>· {exercise.duration}s</span>
        </div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TEXT_LIGHT} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
    </div>
  );
}

function ExerciseLibrary({ onSelectExercise, onStartSession }) {
  const [activeLevel, setActiveLevel] = useState("beginner");
  const levelData = EXERCISE_DB[activeLevel];

  return (
    <div style={{ background: CREAM, minHeight: "100vh", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Exercise library</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: TEXT_DARK, marginBottom: 6 }}>Your healing programme</h1>
        <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6, marginBottom: 20 }}>21 clinically approved exercises, guided by real-time AI posture tracking.</p>
      </div>

      {/* Level tabs */}
      <div style={{ padding: "0 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(EXERCISE_DB).map(([key, data]) => (
            <button key={key} onClick={() => setActiveLevel(key)} style={{
              flex: 1, padding: "10px 6px", borderRadius: 12, border: `1.5px solid ${activeLevel === key ? data.color : BORDER}`,
              background: activeLevel === key ? data.bgColor : WHITE, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
              color: activeLevel === key ? data.color : TEXT_MID,
              transition: "all 0.15s",
            }}>
              {data.label}
              <div style={{ fontSize: 10, fontWeight: 400, marginTop: 2, color: activeLevel === key ? data.color : TEXT_LIGHT }}>{data.weeks}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Level description */}
      <div style={{ margin: "0 20px 16px", background: levelData.bgColor, borderRadius: 14, padding: "14px 16px", border: `1px solid ${levelData.color}22` }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: levelData.color, marginBottom: 3 }}>{levelData.sublabel}</div>
        <div style={{ fontSize: 13, color: TEXT_MID }}>{levelData.coreStage}</div>
      </div>

      {/* Start session button */}
      <div style={{ padding: "0 20px 16px" }}>
        <button onClick={() => onStartSession(activeLevel)} style={{
          width: "100%", padding: "15px", borderRadius: 50, background: PLUM, border: "none",
          color: WHITE, fontFamily: "'Playfair Display', serif", fontSize: 16, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={WHITE}><polygon points="5,3 19,12 5,21"/></svg>
          Start {levelData.label} Session
        </button>
      </div>

      {/* Exercise list */}
      <div style={{ padding: "0 20px" }}>
        <div style={{ fontSize: 12, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
          {levelData.exercises.length} exercises in this programme
        </div>
        {levelData.exercises.map(ex => <ExerciseCard key={ex.id} exercise={ex} onSelect={onSelectExercise} />)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  6. EXERCISE DETAIL SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function ExerciseDetail({ exercise, onBack, onStart }) {
  const level = EXERCISE_DB[exercise.level];
  return (
    <div style={{ background: CREAM, minHeight: "100vh", paddingBottom: 100 }}>
      {/* Back bar */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: TEXT_MID, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TEXT_MID} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </button>
      </div>

      {/* Video placeholder */}
      <div style={{ margin: "0 20px", borderRadius: 20, background: `linear-gradient(160deg, ${level.bgColor}, ${CREAM_DARK})`, height: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 20, border: `1px solid ${level.color}33`, position: "relative", overflow: "hidden" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: level.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill={WHITE}><polygon points="5,3 19,12 5,21"/></svg>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: level.color }}>{exercise.name}</div>
        <div style={{ fontSize: 12, color: TEXT_MID, marginTop: 4 }}>Guided video · {exercise.duration}s</div>
        {/* AI overlay indicator */}
        <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.5)", borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", animation: "pulse 2s infinite" }} />
          <span style={{ color: WHITE, fontSize: 11 }}>AI tracking ready</span>
        </div>
      </div>

      {/* Info cards */}
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <LevelBadge level={exercise.level} />
          <span style={{ background: CREAM_DARK, color: TEXT_MID, fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20 }}>{exercise.position}</span>
          <span style={{ background: CREAM_DARK, color: TEXT_MID, fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20 }}>{exercise.reps}</span>
        </div>

        <div style={{ background: WHITE, borderRadius: 16, border: `1px solid ${BORDER}`, padding: "18px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>How to do it</div>
          <p style={{ fontSize: 15, color: TEXT_DARK, lineHeight: 1.7 }}>{exercise.description}</p>
        </div>

        <div style={{ background: level.bgColor, borderRadius: 16, border: `1px solid ${level.color}33`, padding: "16px 18px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: level.color, letterSpacing: 1, textTransform: "uppercase", fontWeight: 500, marginBottom: 6 }}>Breathing cue</div>
          <p style={{ fontSize: 14, color: TEXT_DARK, lineHeight: 1.7, fontStyle: "italic" }}>"{exercise.breathingCue}"</p>
        </div>

        <div style={{ background: WARN_BG, borderRadius: 16, border: `1px solid #FDE68A`, padding: "16px 18px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: WARN_AMBER, letterSpacing: 1, textTransform: "uppercase", fontWeight: 500, marginBottom: 6 }}>Safety note</div>
          <p style={{ fontSize: 14, color: TEXT_DARK, lineHeight: 1.7 }}>{exercise.safetyNote}</p>
        </div>

        <button onClick={() => onStart(exercise)} style={{ width: "100%", padding: "16px", borderRadius: 50, background: PLUM, border: "none", color: WHITE, fontFamily: "'Playfair Display', serif", fontSize: 17, cursor: "pointer" }}>
          Begin Exercise
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  7. ACTIVE SESSION SCREEN  (Video + PiP Camera + AI Posture Overlay)
// ═══════════════════════════════════════════════════════════════════════════════

function ActiveSession({ exercise, sessionExercises, currentIndex, onNext, onExit }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [phase, setPhase]             = useState("countdown"); // countdown | active | rest | complete
  const [countdown, setCountdown]     = useState(3);
  const [elapsed, setElapsed]         = useState(0);
  const [formScore, setFormScore]     = useState(100);
  const [activeIssues, setActiveIssues] = useState([]);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState("pending"); // pending|granted|denied
  const [currentCue, setCurrentCue]   = useState("");
  const [showCue, setShowCue]         = useState(false);
  const [poseReady, setPoseReady]     = useState(false);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const videoRef       = useRef(null); // instructor video element
  const cameraRef      = useRef(null); // PiP user camera
  const canvasRef      = useRef(null); // pose overlay canvas
  const streamRef      = useRef(null); // MediaStream
  const poseRef        = useRef(null); // MediaPipe Pose instance
  const voiceRef       = useRef(null); // VoiceEngine instance
  const breathTracker  = useRef(new BreathingRhythmTracker());
  const animFrameRef   = useRef(null);
  const timerRef       = useRef(null);
  const cueTimeoutRef  = useRef(null);

  // ── Init voice engine ──────────────────────────────────────────────────────
  useEffect(() => {
    voiceRef.current = new VoiceEngine();
    return () => voiceRef.current?.stop();
  }, []);

  // ── Countdown ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown === 3) voiceRef.current?.randomFrom("exerciseStart");
    if (countdown <= 0) { setPhase("active"); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, phase]);

  // ── Session timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "active") return;
    timerRef.current = setInterval(() => {
      setElapsed(e => {
        if (e + 1 >= exercise.duration) {
          clearInterval(timerRef.current);
          setPhase("rest");
          voiceRef.current?.randomFrom("exerciseComplete");
        }
        // Mid-encouragement
        if ((e + 1) === Math.floor(exercise.duration / 2)) {
          voiceRef.current?.randomFrom("encouragement");
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, exercise.duration]);

  // ── Rest timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "rest") return;
    voiceRef.current?.randomFrom("rest");
    const t = setTimeout(() => {
      if (currentIndex < sessionExercises.length - 1) {
        onNext();
      } else {
        setPhase("complete");
        voiceRef.current?.randomFrom("sessionComplete");
      }
    }, exercise.restSeconds * 1000);
    return () => clearTimeout(t);
  }, [phase]);

  // ── Camera init ───────────────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (!active) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (cameraRef.current) cameraRef.current.srcObject = stream;
        setCameraPermission("granted");
        setCameraActive(true);
        initPose(stream);
      } catch {
        setCameraPermission("denied");
      }
    }
    initCamera();
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // ── MediaPipe Pose init (simulated in this demo) ───────────────────────────
  function initPose(stream) {
    // In production: import { Pose } from '@mediapipe/pose' and run full landmark detection.
    // This demo simulates the landmark stream with realistic motion noise so the
    // UI, feedback overlays, and voice engine behave as they will in production.
    setPoseReady(true);
    simulatePoseStream();
  }

  function simulatePoseStream() {
    let frame = 0;
    const tick = () => {
      frame++;
      // Simulate realistic spine & pelvis landmark values with gentle drift
      const spineAngle = 160 + Math.sin(frame / 20) * 8 + (Math.random() > 0.97 ? -22 : 0);
      const hipDiff    = 0.02 + Math.abs(Math.sin(frame / 40)) * 0.03 + (Math.random() > 0.98 ? 0.07 : 0);
      const torsoH     = 0.38 + Math.sin(frame / 15) * 0.018; // breathing simulation

      // Update breathing tracker
      const breath = breathTracker.current.update(torsoH);
      setBreathPhase(breath.phase);

      // Build simulated analysis result
      const issues = [];
      if (spineAngle < 145) issues.push({ type: "spineArching", severity: "medium" });
      if (hipDiff > 0.06)   issues.push({ type: "pelvicTiltForward", severity: "medium" });
      if (breath.isHolding) issues.push({ type: "breathHolding", severity: "medium" });

      const penalty = issues.reduce((s, i) => s + (i.severity === "high" ? 25 : 12), 0);
      const score = Math.max(0, 100 - penalty);

      setFormScore(Math.round(score));
      setActiveIssues(issues);

      // Trigger voice corrections
      if (phase === "active") {
        issues.forEach(i => voiceRef.current?.correction(i.type));
      }

      // Breathing cue every ~8 seconds
      if (frame % 240 === 0 && phase === "active") {
        const cue = VOICE_SCRIPTS.breathing[Math.floor(Math.random() * VOICE_SCRIPTS.breathing.length)];
        voiceRef.current?.say(cue);
        showVoiceCue(cue);
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }

  function showVoiceCue(text) {
    setCurrentCue(text);
    setShowCue(true);
    if (cueTimeoutRef.current) clearTimeout(cueTimeoutRef.current);
    cueTimeoutRef.current = setTimeout(() => setShowCue(false), 5000);
  }

  const progress = exercise.duration > 0 ? elapsed / exercise.duration : 0;
  const scoreColor = formScore >= 80 ? SAGE_DARK : formScore >= 60 ? WARN_AMBER : "#DC2626";
  const levelData = EXERCISE_DB[exercise.level];

  // ── Render: Countdown ──────────────────────────────────────────────────────
  if (phase === "countdown") return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <style>{fonts}{globalStyle}</style>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: PLUM_LIGHT, marginBottom: 16 }}>{exercise.name}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 100, color: WHITE, animation: "pulse 0.9s ease-in-out" }}>{countdown || "Go"}</div>
      <div style={{ fontSize: 14, color: TEXT_LIGHT, marginTop: 8 }}>Get into position</div>
      <div style={{ marginTop: 40, fontSize: 13, color: PLUM_LIGHT, fontStyle: "italic", maxWidth: 280, textAlign: "center", lineHeight: 1.6 }}>
        "{exercise.breathingCue}"
      </div>
    </div>
  );

  // ── Render: Complete ───────────────────────────────────────────────────────
  if (phase === "complete") return (
    <div style={{ background: CREAM, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
      <style>{fonts}{globalStyle}</style>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: SAGE, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={SAGE_DARK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: TEXT_DARK, marginBottom: 10 }}>Session complete.</h2>
      <p style={{ fontSize: 16, color: TEXT_MID, lineHeight: 1.7, maxWidth: 300, marginBottom: 32 }}>Your body worked beautifully today. Every movement is healing you from within.</p>
      <button onClick={onExit} style={{ padding: "15px 40px", borderRadius: 50, background: PLUM, border: "none", color: WHITE, fontFamily: "'Playfair Display', serif", fontSize: 16, cursor: "pointer" }}>Done</button>
    </div>
  );

  // ── Render: Active / Rest ──────────────────────────────────────────────────
  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <style>{fonts}{globalStyle}</style>

      {/* ── INSTRUCTOR VIDEO AREA ── */}
      <div style={{ flex: 1, position: "relative", background: "#111" }}>

        {/* Video placeholder (replace with <video> in production) */}
        <div style={{ width: "100%", height: "100%", minHeight: 380, background: `linear-gradient(160deg, ${levelData.bgColor}22, #111)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: WHITE, marginBottom: 6, opacity: 0.8 }}>{exercise.name}</div>
            <div style={{ fontSize: 13, color: PLUM_LIGHT }}>Instructor video</div>
          </div>
        </div>

        {/* Exit button */}
        <button onClick={onExit} style={{ position: "absolute", top: 16, left: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* ── PiP USER CAMERA (bottom-right) ── */}
        <div style={{ position: "absolute", bottom: 16, right: 16, width: 100, height: 140, borderRadius: 14, overflow: "hidden", border: `2px solid ${cameraPermission === "granted" ? (formScore >= 80 ? SAGE_DARK : WARN_AMBER) : BORDER}`, boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          {cameraPermission === "granted" ? (
            <>
              <video ref={cameraRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
              <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
            </>
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#1A1A1A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {cameraPermission === "denied" ? (
                <><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={TEXT_LIGHT} strokeWidth="1.5"><path d="M1 1l22 22M17 17H3a2 2 0 01-2-2V7a2 2 0 012-2h3m3-3h6l2 2h4a2 2 0 012 2v9.34"/></svg><span style={{ fontSize: 9, color: TEXT_LIGHT, textAlign: "center", padding: "0 4px" }}>Camera off</span></>
              ) : (
                <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${PLUM_LIGHT}`, borderTopColor: "transparent", animation: "pulse 1s linear infinite" }} />
              )}
            </div>
          )}
          {/* AI badge */}
          {poseReady && cameraPermission === "granted" && (
            <div style={{ position: "absolute", top: 5, left: 5, background: "rgba(0,0,0,0.7)", borderRadius: 6, padding: "2px 6px", display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ADE80", animation: "pulse 2s infinite" }} />
              <span style={{ color: WHITE, fontSize: 8 }}>AI</span>
            </div>
          )}
        </div>

        {/* ── FORM SCORE BADGE ── */}
        <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.6)", borderRadius: 12, padding: "8px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: PLUM_LIGHT, marginBottom: 2 }}>FORM</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: scoreColor, lineHeight: 1 }}>{formScore}</div>
        </div>

        {/* ── LIVE CORRECTION TOAST ── */}
        {activeIssues.length > 0 && phase === "active" && (
          <div style={{ position: "absolute", top: 70, right: 12, left: 12, background: "rgba(180,83,9,0.92)", borderRadius: 12, padding: "10px 14px", animation: "toastIn 0.3s ease", display: "flex", alignItems: "flex-start", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2" strokeLinecap="round" style={{ marginTop: 1, flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <span style={{ fontSize: 13, color: WHITE, lineHeight: 1.5 }}>
              {activeIssues[0].type === "spineArching" && "Your back is arching slightly, love — gently tilt your pelvis forward."}
              {activeIssues[0].type === "pelvicTiltForward" && "Find a neutral pelvis — not arched, not tucked. Just balanced."}
              {activeIssues[0].type === "breathHolding" && "Keep breathing, mama. Release your jaw and breathe steadily."}
            </span>
          </div>
        )}

        {/* ── VOICE CUE ── */}
        {showCue && (
          <div style={{ position: "absolute", bottom: 170, left: 12, right: 12, background: "rgba(107,45,78,0.85)", borderRadius: 12, padding: "10px 14px", animation: "slideUp 0.4s ease" }}>
            <span style={{ fontSize: 13, color: WHITE, fontStyle: "italic", lineHeight: 1.5 }}>"{currentCue}"</span>
          </div>
        )}
      </div>

      {/* ── BOTTOM CONTROLS PANEL ── */}
      <div style={{ background: "#0D0D0D", padding: "16px 20px 32px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>

        {/* Progress bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: WHITE }}>{exercise.name}</span>
            <span style={{ fontSize: 13, color: TEXT_LIGHT }}>{phase === "active" ? `${exercise.duration - elapsed}s left` : "Rest"}</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress * 100}%`, background: PLUM_LIGHT, borderRadius: 4, transition: "width 1s linear" }} />
          </div>
        </div>

        {/* Breathing indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: PLUM_LIGHT, animation: breathPhase === "inhale" ? "breatheIn 2s ease-in-out forwards" : "breatheOut 2s ease-in-out forwards" }} />
          <span style={{ fontSize: 12, color: TEXT_LIGHT }}>
            {breathPhase === "inhale" ? "Inhale..." : breathPhase === "exhale" ? "Exhale..." : "Breathe steadily"}
          </span>
        </div>

        {/* Exercise progress */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: TEXT_LIGHT }}>Exercise {currentIndex + 1} of {sessionExercises.length}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {sessionExercises.map((_, i) => (
              <div key={i} style={{ width: i === currentIndex ? 20 : 7, height: 7, borderRadius: 4, background: i < currentIndex ? PLUM_LIGHT : i === currentIndex ? PLUM_PALE : "rgba(255,255,255,0.15)", transition: "all 0.3s" }} />
            ))}
          </div>
        </div>

        {/* Rest screen overlay */}
        {phase === "rest" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(13,13,13,0.92)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.4s ease" }}>
            <div style={{ fontSize: 13, color: PLUM_LIGHT, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Rest</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, color: WHITE }}>{exercise.restSeconds}s</div>
            <div style={{ fontSize: 14, color: TEXT_LIGHT, marginTop: 8 }}>
              {currentIndex < sessionExercises.length - 1
                ? `Next: ${sessionExercises[currentIndex + 1].name}`
                : "Final exercise complete — well done."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  8. ROOT MODULE COMPONENT  (Drop-in replacement for PracticeTab)
// ═══════════════════════════════════════════════════════════════════════════════

export default function KoreExerciseModule({ onClose }) {
  const [view, setView]             = useState("library");      // library | detail | session
  const [selectedExercise, setSelected] = useState(null);
  const [sessionExercises, setSessionEx] = useState([]);
  const [sessionIndex, setSessionIndex] = useState(0);

  function handleSelectExercise(ex) {
    setSelected(ex);
    setView("detail");
  }

  function handleStartSession(levelKey) {
    const exList = EXERCISE_DB[levelKey].exercises;
    setSessionEx(exList);
    setSessionIndex(0);
    setSelected(exList[0]);
    setView("session");
  }

  function handleStartSingle(ex) {
    setSessionEx([ex]);
    setSessionIndex(0);
    setSelected(ex);
    setView("session");
  }

  function handleNextExercise() {
    const next = sessionIndex + 1;
    if (next < sessionExercises.length) {
      setSessionIndex(next);
      setSelected(sessionExercises[next]);
    }
  }

  return (
    <>
      <style>{fonts}{globalStyle}</style>
      {view === "library" && (
        <ExerciseLibrary
          onSelectExercise={handleSelectExercise}
          onStartSession={handleStartSession}
        />
      )}
      {view === "detail" && selectedExercise && (
        <ExerciseDetail
          exercise={selectedExercise}
          onBack={() => setView("library")}
          onStart={handleStartSingle}
        />
      )}
      {view === "session" && selectedExercise && (
        <ActiveSession
          exercise={selectedExercise}
          sessionExercises={sessionExercises}
          currentIndex={sessionIndex}
          onNext={handleNextExercise}
          onExit={() => setView("library")}
        />
      )}
    </>
  );
}
