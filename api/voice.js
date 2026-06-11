// /api/voice.js — Vercel Serverless Function
// ─────────────────────────────────────────────────────────────────────────────
// Proxies text-to-speech requests to ElevenLabs using a custom voice.
// The API key is read from Vercel Environment Variables — it is NEVER
// exposed to the browser or committed to GitHub.
//
// Environment variables required (set in Vercel dashboard):
//   ELEVENLABS_API_KEY  — your secret key (sk_...)
//   ELEVENLABS_VOICE_ID — bBgEsqh31Yb4Bbuj4v30 (Tolani.kore)

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey  = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "POFIFgcE9v8bYUnEBJ10";

  if (!apiKey) {
    return res.status(500).json({ error: "Voice service unavailable" });
  }

  const { text } = req.body || {};
  if (!text || typeof text !== "string" || text.length > 600) {
    return res.status(400).json({ error: "Invalid text payload" });
  }

  try {
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_flash_v2",
          voice_settings: {
            stability: 0.55,         // warmth + consistency balance
            similarity_boost: 0.85,  // stays close to your custom Tolani voice
            style: 0.35,             // natural, kind delivery
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      return res.status(502).json({ error: "Voice generation failed" });
    }

    // Stream the audio back to the browser
    const audioBuffer = await ttsResponse.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(Buffer.from(audioBuffer));
  } catch (err) {
    return res.status(500).json({ error: "Voice service error" });
  }
}
