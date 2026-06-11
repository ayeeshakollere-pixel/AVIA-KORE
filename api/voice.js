// api/voice.js — ElevenLabs TTS proxy (diagnostic + CORS version)
//
// Env vars (Vercel → Settings → Environment Variables — REDEPLOY after changing):
//   ELEVENLABS_API_KEY   — secret key (sk_...)
//   ELEVENLABS_VOICE_ID  — a voice ID that exists on THIS account
//
// 🔍 Open https://YOUR-APP.vercel.app/api/voice in a browser for a full
//    diagnosis of key / voice / deployment problems.
// 🌐 CORS enabled — the app can call this from ANY domain (local preview,
//    artifact preview, etc.), not just the Vercel site itself.

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);

  // Preflight for cross-origin POSTs
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const apiKey = (process.env.ELEVENLABS_API_KEY || "").trim();
  // Fallback "Rachel" — a default voice that exists on EVERY account.
  const voiceId = (process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM").trim();

  // ── DIAGNOSTIC: visit /api/voice in your browser ───────────────────────
  if (req.method === "GET") {
    if (!apiKey) {
      return res.status(200).json({
        ok: false,
        problem: "ELEVENLABS_API_KEY is missing in this deployment.",
        fix: "The env var exists but this deployment predates it. Vercel → Deployments → ⋯ → Redeploy.",
      });
    }
    try {
      const check = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": apiKey },
      });
      const data = await check.json().catch(() => ({}));
      if (!check.ok) {
        return res.status(200).json({
          ok: false,
          problem: "ElevenLabs rejected the API key.",
          elevenlabs_status: check.status,
          elevenlabs_says: data,
          fix: "401 = wrong key, extra spaces, or account blocked (look for 'detected_unusual_activity' — duplicate free accounts get blocked; the $5 Starter plan unblocks you).",
        });
      }
      const voices = (data.voices || []).map(v => ({ name: v.name, voice_id: v.voice_id }));
      const found = voices.some(v => v.voice_id === voiceId);
      return res.status(200).json({
        ok: found,
        keyWorks: true,
        usingVoiceId: voiceId,
        voiceFoundOnThisAccount: found,
        fix: found
          ? "Backend is healthy. If the app still sounds robotic, the app isn't reaching this endpoint — point its fetch to this full URL and hard-refresh."
          : "This voice ID is not on this account. Copy a voice_id from the list below into ELEVENLABS_VOICE_ID, then Redeploy.",
        voicesOnThisAccount: voices,
      });
    } catch (err) {
      return res.status(200).json({ ok: false, problem: "Could not reach ElevenLabs", detail: String(err) });
    }
  }

  // ── NORMAL TTS PATH (POST) ──────────────────────────────────────────────
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "Missing API key configuration" });
  }

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Missing text in request body" });
    }

    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_flash_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const detail = await ttsResponse.text().catch(() => "");
      console.error("ElevenLabs error:", ttsResponse.status, detail);
      return res.status(502).json({
        error: "Voice generation failed",
        elevenlabs_status: ttsResponse.status,
        detail: detail.slice(0, 500),
      });
    }

    const audioBuffer = await ttsResponse.arrayBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(200).send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error("Voice service error:", err);
    return res.status(500).json({ error: "Voice service error" });
  }
}
