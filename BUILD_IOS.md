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
```

---

## Automated Build with GitHub Actions

Instead of building manually on a Mac, push to `main` and GitHub Actions will
build, sign, and upload the app to App Store Connect automatically.

### One-time setup: GitHub Secrets

Go to your GitHub repo > **Settings > Secrets and variables > Actions** and add
these 6 secrets:

| Secret name | What it is | How to get it |
|---|---|---|
| `CERTIFICATE_P12` | Base64-encoded distribution certificate | See step 1 below |
| `CERTIFICATE_PASSWORD` | Password you set when exporting the .p12 | You choose it |
| `PROVISIONING_PROFILE` | Base64-encoded provisioning profile | See step 2 below |
| `PROFILE_NAME` | Name of the provisioning profile | Visible in Apple Developer portal |
| `KEYCHAIN_PASSWORD` | Any random password for temp keychain | Make one up (e.g. `gh-actions-kc-2024`) |
| `ASC_KEY_ID` | App Store Connect API Key ID | See step 3 below |
| `ASC_ISSUER_ID` | App Store Connect API Issuer ID | See step 3 below |
| `ASC_PRIVATE_KEY` | App Store Connect API private key (.p8 content) | See step 3 below |

### Step 1: Export your distribution certificate as .p12

1. Open **Keychain Access** on your Mac
2. Find your "Apple Distribution" certificate
3. Right-click > **Export** > save as `.p12` with a password
4. Base64-encode it:
   ```bash
   base64 -i Certificates.p12 | pbcopy
   ```
5. Paste into the `CERTIFICATE_P12` GitHub secret

### Step 2: Create a provisioning profile

1. Go to https://developer.apple.com/account/resources/profiles
2. Click **+** > **App Store Connect** distribution
3. Select your App ID (`com.hanumanchalisa.kids`)
4. Select your distribution certificate
5. Download the `.mobileprovision` file
6. Base64-encode it:
   ```bash
   base64 -i profile.mobileprovision | pbcopy
   ```
7. Paste into the `PROVISIONING_PROFILE` secret
8. Put the profile name into the `PROFILE_NAME` secret

### Step 3: Create an App Store Connect API Key

1. Go to https://appstoreconnect.apple.com/access/integrations/api
2. Click **+** to generate a new key
3. Name: "GitHub Actions", Access: "App Manager"
4. Download the `.p8` file (you can only download it once!)
5. Copy the **Key ID** into `ASC_KEY_ID`
6. Copy the **Issuer ID** (shown at top of page) into `ASC_ISSUER_ID`
7. Paste the contents of the `.p8` file into `ASC_PRIVATE_KEY`

### Triggering a build

- **Automatic**: Push to `main` branch
- **Manual**: Go to Actions tab > "Build & Upload iOS App" > "Run workflow"

After the build uploads, go to https://appstoreconnect.apple.com to add
screenshots, description, and submit for Apple's review.
