const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const rootDir = __dirname;
const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(rootDir));

const WOMENS_HEALTH_SYSTEM_PROMPT = `You are Maya, BloomHer's AI Women's Health Assistant.
Only answer questions related to PCOS, PCOD, menstrual cycles and period tracking, ovulation, hormonal health, women's reproductive health, nutrition for PCOS and hormonal balance, exercise and fitness for women's health, weight management related to PCOS, acne, hair fall, and hormonal symptoms, mental health and stress related to hormonal conditions, sleep and healthy lifestyle habits, fertility awareness, and BloomHer features.

If a user asks anything unrelated, refuse with:
"I'm Maya, BloomHer's AI Women's Health Assistant. 💜\n\nI'm designed to help with questions about PCOS, PCOD, menstrual health, hormones, nutrition, women's wellness, and BloomHer features. Please ask me something related to women's health or the BloomHer app."

If the user asks who you are, answer:
"I'm Maya, your BloomHer AI Health Assistant. 💜 I'm here to support you with PCOS, PCOD, menstrual health, hormones, women's wellness, and everything related to BloomHer."

Always keep the tone warm and supportive. Never diagnose medical conditions. Never prescribe medications or dosages. Never tell users to stop or start medication. Always note that the information is educational and does not replace professional medical advice. If emergency symptoms are mentioned, advise immediate emergency medical care or local emergency services.`;

function sendJson(res, statusCode, payload) {
    res.status(statusCode).json(payload);
}

function callGemini(message, history) {
    return new Promise((resolve, reject) => {
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

        const request = https.request(
            {
                hostname: 'generativelanguage.googleapis.com',
                path: `/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiApiKey)}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody),
                },
            },
            (response) => {
                let responseBody = '';

                response.on('data', (chunk) => {
                    responseBody += chunk;
                });

                response.on('end', () => {
                    try {
                        const data = JSON.parse(responseBody);
                        const reply = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();

                        if (!reply) {
                            return reject(new Error('Gemini returned an empty response'));
                        }

                        resolve(reply);
                    } catch (error) {
                        reject(error);
                    }
                });
            }
        );

        request.on('error', reject);
        request.write(requestBody);
        request.end();
    });
}

app.post('/api/maya/chat', async (req, res) => {
    const message = String(req.body?.message || '').trim();
    const history = Array.isArray(req.body?.history) ? req.body.history : [];

    if (!message) {
        return sendJson(res, 400, { error: 'Message is required.' });
    }

    if (!geminiApiKey) {
        return sendJson(res, 503, {
            error: 'Gemini API key is not configured.',
            fallback: true,
        });
    }

    try {
        const reply = await callGemini(message, history);
        return sendJson(res, 200, { reply });
    } catch (error) {
        console.error('Gemini request failed:', error.message);
        return sendJson(res, 502, { error: 'Gemini request failed.', fallback: true });
    }
});

app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return next();
    }

    if (req.path === '/' || req.path.endsWith('.html')) {
        const targetPath = req.path === '/' ? 'index.html' : req.path.replace(/^\//, '');
        return res.sendFile(path.join(rootDir, targetPath));
    }

    return next();
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});