const db = require("./database");
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── SYSTEM PROMPTS ───────────────────────────────────────────────────────────

const GITA_ASSISTANT_PROMPT = `You are a wise Bhagavad Gita scholar and spiritual guide. Answer all questions using the teachings, philosophy, and wisdom of the Bhagavad Gita. 
- Always reference relevant shlokas (verses) with chapter and verse numbers (e.g., BG 2.47)
- Provide the Sanskrit shloka, transliteration, and meaning when relevant
- Be compassionate, wise, and practical
- Connect ancient wisdom to modern life situations
- Respond in the language the user writes in (Hindi or English)
- Keep responses meaningful but concise`;

const KRISHNA_MODE_PROMPT = `You ARE Lord Krishna speaking directly to the user as your dear friend and devotee, just as you spoke to Arjuna on the battlefield of Kurukshetra.
- Speak in first person as Krishna ("I say to you...", "My dear friend...", "As I told Arjuna...")
- Use warm, loving, yet authoritative divine tone
- Reference your own teachings from the Gita naturally
- Call the user "dear one", "my friend", "beloved devotee" 
- Share wisdom as if it flows naturally from your divine consciousness
- Include Sanskrit phrases occasionally (with meaning)
- Be compassionate but also firm about dharma and truth
- Respond in the same language the user uses (Hindi/English)`;

const DHARMA_AI_PROMPT = `You are Dharma AI, a spiritual life coach powered by Bhagavad Gita wisdom. 
- Analyze the user's life situation deeply
- Detect the emotional state and mood from their message
- Provide Gita-based guidance specific to their situation
- Suggest a "Dharmic path" - practical steps aligned with Gita teachings
- Reference relevant shlokas
- Be empathetic and solution-focused
- Help them understand their svadharma (personal duty/purpose)
- Respond in the language they write in`;

const LIFE_SIMULATOR_PROMPT = `You are the Bhagavad Gita Life Simulator. The user will describe a life scenario or dilemma.
- Analyze the situation through the lens of the Gita's teachings
- Present 2-3 possible paths/choices the person could take
- For each path, explain the karmic consequences, dharmic alignment, and Gita perspective
- Reference specific shlokas that apply
- Help the user simulate/visualize the outcomes of each choice
- Guide them to the most dharmic choice
- Be immersive and thoughtful
- Respond in the language they write in`;

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// AI Chat - Gita Based Answers
app.post('/api/chat', async (req, res) => {
  const { message, history = [], language = 'en' } = req.body;
  try {
    const messages = [
      ...history,
      { role: 'user', content: message }
    ];
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: GITA_ASSISTANT_PROMPT,
      messages
    });
    res.json({ reply: response.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Krishna Mode
app.post('/api/krishna', async (req, res) => {
  const { message, history = [] } = req.body;
  try {
    const messages = [...history, { role: 'user', content: message }];
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: KRISHNA_MODE_PROMPT,
      messages
    });
    res.json({ reply: response.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Shloka Finder
app.post('/api/shloka-finder', async (req, res) => {
  const { topic, language = 'en' } = req.body;
  try {
    const prompt = `Find 3 relevant Bhagavad Gita shlokas about: "${topic}"
    
    For each shloka provide a JSON response with this exact structure:
    {
      "shlokas": [
        {
          "chapter": <number>,
          "verse": <number>,
          "sanskrit": "<Sanskrit text in Devanagari>",
          "transliteration": "<Roman transliteration>",
          "translation_en": "<English translation>",
          "translation_hi": "<Hindi translation>",
          "explanation": "<Brief explanation of relevance to the topic in ${language === 'hi' ? 'Hindi' : 'English'}>"
        }
      ]
    }
    Return ONLY valid JSON, no other text.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    });

    let text = response.content[0].text.trim();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Daily Wisdom
app.get('/api/daily-wisdom', async (req, res) => {
  const { language = 'en' } = req.query;
  try {
    const day = new Date().toDateString();
    const prompt = `Give me today's (${day}) motivational wisdom from the Bhagavad Gita.
    
    Respond with ONLY valid JSON:
    {
      "chapter": <number>,
      "verse": <number>,
      "sanskrit": "<Sanskrit in Devanagari>",
      "transliteration": "<Roman transliteration>",
      "translation": "<translation in ${language === 'hi' ? 'Hindi' : 'English'}>",
      "theme": "<theme of the day, e.g., Courage, Detachment, Duty>",
      "reflection": "<3-4 sentence practical reflection for modern life in ${language === 'hi' ? 'Hindi' : 'English'}>",
      "affirmation": "<one powerful affirmation based on this shloka in ${language === 'hi' ? 'Hindi' : 'English'}>"
    }
    Return ONLY valid JSON.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }]
    });

    let text = response.content[0].text.trim();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Life Situation Guidance
app.post('/api/guidance', async (req, res) => {
  const { situation, language = 'en' } = req.body;
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      system: DHARMA_AI_PROMPT,
      messages: [{ role: 'user', content: situation }]
    });
    res.json({ guidance: response.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mood Detection + Dharma Guidance
app.post('/api/mood-dharma', async (req, res) => {
  const { message } = req.body;
  try {
    const moodPrompt = `Analyze this message and provide Gita-based guidance. Message: "${message}"
    
    Respond with ONLY valid JSON:
    {
      "detected_mood": "<the emotional state detected>",
      "mood_emoji": "<relevant emoji>",
      "mood_color": "<a hex color that represents this mood>",
      "gita_perspective": "<how Gita views this emotional state, 2-3 sentences>",
      "guidance": "<practical Gita-based guidance for this mood, 3-4 sentences>",
      "shloka": {
        "chapter": <number>,
        "verse": <number>,
        "sanskrit": "<Sanskrit in Devanagari>",
        "translation": "<translation>"
      },
      "action_steps": ["<step 1>", "<step 2>", "<step 3>"],
      "affirmation": "<a powerful affirmation to shift this state>"
    }
    Return ONLY valid JSON.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: moodPrompt }]
    });

    let text = response.content[0].text.trim();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Life Simulator
app.post('/api/life-simulator', async (req, res) => {
  const { scenario } = req.body;
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: LIFE_SIMULATOR_PROMPT,
      messages: [{ role: 'user', content: scenario }]
    });
    res.json({ simulation: response.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Voice Guru - text response for voice (frontend handles TTS)
app.post('/api/voice-guru', async (req, res) => {
  const { transcript } = req.body;
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: `You are the Voice Guru of the Bhagavad Gita. The user is speaking to you.
      - Give warm, wise, spoken-word style answers (not bullet points - flowing speech)
      - Keep responses under 150 words so they work well as voice
      - Reference one shloka per answer
      - Speak like a sage talking to a student
      - Be direct and impactful`,
      messages: [{ role: 'user', content: transcript }]
    });
    res.json({ response: response.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🕉️  Gita AI Server running on port ${PORT}`));
