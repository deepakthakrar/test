# Building Hanuman Chalisa Kids for the App Store

## Prerequisites

You need a **Mac** with:
1. **Xcode** (latest from Mac App Store)
2. **CocoaPods** — `sudo gem install cocoapods`
3. **Node.js** (v18+) — `brew install node`
4. **Apple Developer Account** ($99/year) — https://developer.apple.com

## Step-by-step

### 1. Clone and install

```bash
git clone <your-repo-url>
cd test
npm install
```

### 2. Add the iOS platform

```bash
npx cap add ios
```

This creates the `ios/` folder with a full Xcode project.

### 3. Build web assets and sync to iOS

```bash
npm run build
npx cap sync ios
```

### 4. Open in Xcode

```bash
npx cap open ios
```

### 5. Configure in Xcode

1. **Signing & Capabilities** — Select your Apple Developer team
2. **Bundle Identifier** — Set to `com.hanumanchalisa.kids` (or your own)
3. **Display Name** — "Hanuman Chalisa Kids"
4. **App Icons** — Drag your 1024x1024 icon into the asset catalog
   - Use https://appicon.co to generate all required sizes from the SVG in `icons/icon.svg`
5. **Version** — Set to 1.0.0
6. **Deployment Target** — iOS 15.0 or later

### 6. App icon generation

Convert the SVG icon to all required iOS sizes:
1. Go to https://appicon.co
2. Upload `icons/icon.svg` (or a 1024x1024 PNG version)
3. Select "iPhone" and download
4. Drag the generated icons into Xcode's `Assets.xcassets/AppIcon`

### 7. Test on a device

1. Connect your iPhone via USB
2. Select your device in Xcode's toolbar
3. Press **Cmd + R** to build and run
4. Trust the developer profile on iPhone: Settings > General > VPN & Device Management

### 8. Submit to App Store

1. In Xcode: **Product > Archive**
2. In the Organizer window, click **Distribute App**
3. Choose **App Store Connect**
4. Upload and then go to https://appstoreconnect.apple.com
5. Fill in:
   - App name: "Hanuman Chalisa Kids"
   - Subtitle: "Learn & Sing with Hanuman Ji"
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

## Microphone permission (important)

The app uses the microphone for the "My Turn" recording feature. Capacitor handles the
`NSMicrophoneUsageDescription` plist entry. If it's missing, add this to
`ios/App/App/Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>We need the microphone so you can practice singing the Hanuman Chalisa!</string>
```

## Speech permissions

Speech synthesis and recognition should work out of the box via WKWebView.
If speech recognition prompts are needed, add to `Info.plist`:

```xml
<key>NSSpeechRecognitionUsageDescription</key>
<string>We listen to your singing to help you learn the Hanuman Chalisa!</string>
