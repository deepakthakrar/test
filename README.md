# Math Buddy - AI Math Tutor for Kids

An iPhone app that provides a voice-based AI math tutor for 5-year-olds, powered by ElevenLabs Conversational AI.

## Features

- Voice-based math tutoring via ElevenLabs AI agent
- Registration flow (parent name, email, phone, child name)
- 7 minutes of free tutoring
- $9.99/week subscription for 60 minutes of talk time
- Live session timer with countdown
- Kid-friendly UI with animations

## Setup

### 1. Create your ElevenLabs agent

1. Go to https://elevenlabs.io
2. Create a new Conversational AI agent configured as a math tutor for 5-year-olds
3. Copy the **Agent ID**
4. Open `app.js` and replace `YOUR_AGENT_ID_HERE` with your Agent ID

### 2. Run locally

```bash
python3 -m http.server 8000
```

Open http://localhost:8000 in your browser.

### 3. Build for iOS

See [BUILD_IOS.md](BUILD_IOS.md) for full App Store deployment instructions.

```bash
npm install
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

## Files

- `index.html` - All app screens (registration, dashboard, session, paywall, settings)
- `app.js` - Core logic (registration, usage tracking, timer, ElevenLabs integration)
- `style.css` - Kid-friendly blue/purple theme
- `capacitor.config.ts` - iOS app configuration
- `BUILD_IOS.md` - Full build and deployment guide
