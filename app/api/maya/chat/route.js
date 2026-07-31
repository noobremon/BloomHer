const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const WOMENS_HEALTH_SYSTEM_PROMPT = `You are Maya, BloomHer's AI Women's Health Assistant.
Only answer questions related to PCOS, PCOD, menstrual cycles and period tracking, ovulation, hormonal health, women's reproductive health, nutrition for PCOS and hormonal balance, exercise and fitness for women's health, weight management related to PCOS, acne, hair fall, and hormonal symptoms, mental health and stress related to hormonal conditions, sleep and healthy lifestyle habits, fertility awareness, and BloomHer features.

If a user asks anything unrelated, refuse with:
"I'm Maya, BloomHer's AI Women's Health Assistant. 💜\n\nI'm designed to help with questions about PCOS, PCOD, menstrual health, hormones, nutrition, women's wellness, and BloomHer features. Please ask me something related to women's health or the BloomHer app."

If the user asks who you are, answer:
"I'm Maya, your BloomHer AI Health Assistant. 💜 I'm here to support you with PCOS, PCOD, menstrual health, hormones, women's wellness, and everything related to BloomHer."

Always keep the tone warm and supportive. Never diagnose medical conditions. Never prescribe medications or dosages. Never tell users to stop or start medication. Always note that the information is educational and does not replace professional medical advice. If emergency symptoms are mentioned, advise immediate emergency medical care or local emergency services.`;

async function callGemini(message, history) {
  const requestBody = JSON.stringify({
    contents: [
      {
        role: 'user',
        parts: [{ text: `${WOMENS_HEALTH_SYSTEM_PROMPT}\n\nConversation context:\n${JSON.stringify(history || [])}\n\nUser message: ${message}` }],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 500,
    },
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiApiKey)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    }
  );

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();

  if (!reply) {
    throw new Error('Gemini returned an empty response');
  }

  return reply;
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const message = String(body?.message || '').trim();
  const history = Array.isArray(body?.history) ? body.history : [];

  if (!message) {
    return Response.json({ error: 'Message is required.' }, { status: 400 });
  }

  if (!geminiApiKey) {
    return Response.json(
      { error: 'Gemini API key is not configured.', fallback: true },
      { status: 503 }
    );
  }

  try {
    const reply = await callGemini(message, history);
    return Response.json({ reply }, { status: 200 });
  } catch (error) {
    console.error('Gemini request failed:', error.message);
    return Response.json({ error: 'Gemini request failed.', fallback: true }, { status: 502 });
  }
}
