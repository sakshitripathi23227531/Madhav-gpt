# 🕉️ Gita AI - Bhagavad Gita Wisdom App

An AI-powered web application that brings the eternal wisdom of the Bhagavad Gita to the modern seeker. Built with Express.js backend and vanilla frontend, powered by Anthropic Claude AI.

![Gita AI Banner](https://img.shields.io/badge/Bhagavad%20Gita-AI%20Assistant-blue?style=for-the-badge)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **💬 AI Gita Chat** | Ask any question and receive Gita-based wisdom |
| **🦚 Krishna Mode** | Experience a direct conversation with Lord Krishna |
| **📖 Shloka Finder** | Search for specific verses by topic or theme |
| **🌅 Daily Wisdom** | Get your daily dose of Gita inspiration |
| **🧭 Life Guidance** | Receive dharmic advice for real-life situations |
| **🌊 Mood Dharma** | AI analyzes your mood and prescribes appropriate wisdom |
| **⚖️ Life Simulator** | Simulate life choices through the Gita's lens |
| **🎙️ Voice Guru** | Speak your questions and receive spoken divine wisdom |

### Supported Languages
- 🇺🇸 **English** (EN)
- 🇮🇳 **Hindi** (HI)

---

## 🏗️ Architecture

```
Madhav-gpt/
├── index.html          # Frontend UI
├── script.js          # Frontend JavaScript
├── style.css          # Styling
├── server.js          # Express.js backend
├── database.js        # SQLite database (shlokas)
├── gita.db           # Database file
├── package.json      # Node dependencies
├── .env.example      # Environment template
├── .gitignore       # Git ignore rules
├── BUGFIXES.md      # Bug documentation
└── shlokas/         # Shloka data directory
```

### Technology Stack
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Backend:** Node.js + Express.js
- **Database:** SQLite (better-sqlite3)
- **AI:** Anthropic Claude API (Claude Sonnet 4)

---

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Anthropic API Key ([Get here](https://console.anthropic.com/))

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd Madhav-gpt
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Anthropic API key
nano .env
```

Your `.env` should look like:
```env
ANTHROPIC_API_KEY=your_actual_api_key_here
PORT=3001
```

4. **Start the server**
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

5. **Open the application**
- Open `index.html` in your browser
- Or serve it via a local server: `npx serve .`

---

## 🔌 API Endpoints

All API endpoints are prefixed with `/api` and run on port 3001.

| Endpoint | Method | Description | Request Body |
|----------|--------|-------------|---------------|
| `/api/chat` | POST | General Gita Q&A | `{ message, history, language }` |
| `/api/krishna` | POST | Krishna mode conversation | `{ message, history }` |
| `/api/shloka-finder` | POST | Search shlokas by topic | `{ topic, language }` |
| `/api/daily-wisdom` | GET | Today's wisdom | `?language=en\|hi` |
| `/api/guidance` | POST | Life situation advice | `{ situation, language }` |
| `/api/mood-dharma` | POST | Mood-based guidance | `{ message }` |
| `/api/life-simulator` | POST | Decision simulation | `{ scenario, language }` |
| `/api/voice-guru` | POST | Voice query response | `{ transcript, language }` |

### Example Request

```javascript
// Chat endpoint
fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "What is dharma?",
    history: [],
    language: "en"
  })
});
```

---

## 🎨 Frontend Structure

### Sections (in index.html)
1. **Home** - Hero section with features grid
2. **AI Chat** - General Gita Q&A interface
3. **Krishna Mode** - Divine conversation experience
4. **Shloka Finder** - Topic-based verse search
5. **Daily Wisdom** - Daily shloka with reflection
6. **Life Guidance** - Situation-based advice
7. **Mood Dharma** - Emotional state analysis
8. **Life Simulator** - Decision consequence exploration
9. **Voice Guru** - Voice-first divine interaction

### Navigation
- Sticky navbar with all section buttons
- Language toggle (EN/HI)
- Click navigation with active state indicators

---

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes | - | Your Anthropic API key |
| `PORT` | No | 3001 | Server port number |

### Getting an Anthropic API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy it to your `.env` file

> ⚠️ **Note:** The API key is used for all AI responses. Ensure you have credits in your Anthropic account.

---

## 🐛 Known Issues & Solutions

See [BUGFIXES.md](BUGFIXES.md) for detailed information about:
- Fixed bugs and their solutions
- Database utilization notes
- Testing recommendations

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is for educational and devotional purposes.

---

## 🙏 Acknowledgments

- Lord Krishna and the divine wisdom of the Bhagavad Gita
- Anthropic for the Claude AI API
- All seekers and contributors

---

**ॐ Tat Sat** 🙏

*"Yoga is the journey of the self, through the self, to the self." - The Bhagavad Gita*
