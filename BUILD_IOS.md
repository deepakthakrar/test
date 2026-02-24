# Building Math Buddy for the App Store

## Prerequisites

You need a **Mac** with:
1. **Xcode** (latest from Mac App Store)
2. **CocoaPods** — `sudo gem install cocoapods`
3. **Node.js** (v18+) — `brew install node`
4. **Apple Developer Account** ($99/year) — https://developer.apple.com

## Setup

### 1. Configure your ElevenLabs Agent

1. Go to https://elevenlabs.io and create a Conversational AI agent
2. Configure the agent as a math tutor for 5-year-olds
3. Set the agent to **public** (authentication disabled) for the widget
4. Copy your **Agent ID** from the dashboard
5. Open `app.js` and replace `YOUR_AGENT_ID_HERE` with your Agent ID:
   ```javascript
   ELEVENLABS_AGENT_ID: "your-actual-agent-id",
   ```

### 2. Clone and install

```bash
git clone <your-repo-url>
cd test
npm install
```

### 3. Add the iOS platform

```bash
npx cap add ios
```

This creates the `ios/` folder with a full Xcode project.

### 4. Build web assets and sync to iOS

```bash
npm run build
npx cap sync ios
```

### 5. Open in Xcode

```bash
npx cap open ios
```

### 6. Configure in Xcode

1. **Signing & Capabilities** — Select your Apple Developer team
2. **Bundle Identifier** — Set to `com.mathbuddy.tutor` (or your own)
3. **Display Name** — "Math Buddy"
4. **App Icons** — Drag your 1024x1024 icon into the asset catalog
   - Use https://appicon.co to generate all required sizes
5. **Version** — Set to 1.0.0
6. **Deployment Target** — iOS 15.0 or later

### 7. Required permissions in Info.plist

The app needs microphone access for voice conversations with the AI tutor.
Add these to `ios/App/App/Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Math Buddy needs the microphone so your child can talk to the math tutor.</string>
```

### 8. In-App Purchases (Subscription)

To enable the $9.99/week subscription:

1. In App Store Connect, create a new auto-renewable subscription
2. Set up a subscription group (e.g., "Math Buddy Premium")
3. Configure the $9.99/week pricing
4. Install the Capacitor In-App Purchase plugin:
   ```bash
   npm install @capgo/capacitor-purchases
   npx cap sync ios
   ```
5. Integrate RevenueCat or StoreKit 2 for subscription management
6. Replace the simulated `handleSubscribe()` function in `app.js` with real IAP logic

### 9. Test on a device

1. Connect your iPhone via USB
2. Select your device in Xcode's toolbar
3. Press **Cmd + R** to build and run
4. Trust the developer profile on iPhone: Settings > General > VPN & Device Management

### 10. Submit to App Store

1. In Xcode: **Product > Archive**
2. In the Organizer window, click **Distribute App**
3. Choose **App Store Connect**
4. Upload and then go to https://appstoreconnect.apple.com
5. Fill in:
   - App name: "Math Buddy"
   - Subtitle: "AI Math Tutor for Kids"
   - Category: Education > Kids
   - Age Rating: 4+
   - Screenshots (required): Run on simulator, take screenshots with Cmd+S
   - Description, keywords, etc.
6. Submit for review

## Updating the app

After making code changes:

```bash
npm run build
npx cap sync ios
npx cap open ios
```

Then archive and submit again in Xcode.

## App Architecture

```
index.html    - All 5 screens (register, dashboard, session, paywall, settings)
style.css     - Kid-friendly blue/purple theme with animations
app.js        - App logic: registration, timer, usage tracking, ElevenLabs integration
manifest.json - PWA manifest
sw.js         - Service worker for offline support
```

### Screen Flow

1. **Registration** → Collects parent name, email, phone, child's name
2. **Dashboard** → Shows remaining time, start session button
3. **Session** → Live conversation with ElevenLabs AI math tutor + countdown timer
4. **Paywall** → Shown when free 7 minutes are used up ($9.99/week for 60 min)
5. **Settings** → Account info, subscription status, sign out

### Usage Tracking

- Free tier: 7 minutes total
- Paid tier: 60 minutes per week (resets weekly)
- Time tracked per second during active sessions
- Data persisted in localStorage
