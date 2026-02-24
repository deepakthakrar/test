# Math Buddy - Flutter Native App

## Prerequisites

- [Flutter SDK](https://docs.flutter.dev/get-started/install) (3.2+)
- Xcode 15+ (for iOS builds)
- CocoaPods (`sudo gem install cocoapods`)

## Quick Start

```bash
cd math_buddy

# Create the Flutter project scaffolding (generates ios/, android/, etc.)
flutter create . --org com.mathbuddy --project-name math_buddy

# Get dependencies
flutter pub get

# Run on iOS simulator
flutter run -d ios

# Or run on a connected iPhone
flutter run
```

## iOS Setup

After running `flutter create .`, add these to `ios/Runner/Info.plist` inside the `<dict>` tag:

```xml
<!-- Microphone permission for voice interaction -->
<key>NSMicrophoneUsageDescription</key>
<string>Math Buddy needs microphone access so your child can talk to the AI tutor.</string>

<!-- Speech recognition -->
<key>NSSpeechRecognitionUsageDescription</key>
<string>Math Buddy uses speech recognition to understand your child's answers.</string>
```

## Architecture

```
lib/
  main.dart                  - App entry point, routing
  theme/app_theme.dart       - Colors, typography, theme data
  models/user_model.dart     - User data model
  services/
    storage_service.dart     - SharedPreferences persistence
    app_state.dart           - ChangeNotifier state management
  screens/
    registration_screen.dart - Welcome & signup form
    dashboard_screen.dart    - Home with timer ring & start button
    session_screen.dart      - Active tutoring (ElevenLabs WebView)
    paywall_screen.dart      - Subscription upsell
    settings_screen.dart     - Account & subscription management
```

## ElevenLabs Integration

The session screen embeds the ElevenLabs Conversational AI widget via a WebView.
The agent ID is configured in `lib/services/app_state.dart`:

```dart
static const String elevenLabsAgentId = 'agent_9401kj56313ve9htt2wyn9revqkv';
```

## Build for App Store

```bash
# Build release IPA
flutter build ipa

# The IPA will be at build/ios/ipa/math_buddy.ipa
# Upload to App Store Connect via Transporter or Xcode
```
