import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'services/app_state.dart';
import 'services/storage_service.dart';
import 'theme/app_theme.dart';
import 'screens/registration_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/session_screen.dart';
import 'screens/paywall_screen.dart';
import 'screens/settings_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Lock to portrait mode for phone-first experience
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Status bar style
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.dark,
    statusBarBrightness: Brightness.light,
  ));

  final storage = StorageService();
  final appState = AppState(storage);
  await appState.init();

  runApp(MathBuddyApp(appState: appState));
}

class MathBuddyApp extends StatelessWidget {
  final AppState appState;

  const MathBuddyApp({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider.value(
      value: appState,
      child: MaterialApp(
        title: 'Math Buddy',
        theme: AppTheme.theme,
        debugShowCheckedModeBanner: false,
        home: const AppShell(),
      ),
    );
  }
}

class AppShell extends StatelessWidget {
  const AppShell({super.key});

  @override
  Widget build(BuildContext context) {
    final currentScreen = context.select<AppState, String>(
      (state) => state.currentScreen,
    );

    return Scaffold(
      body: AnimatedSwitcher(
        duration: Duration(milliseconds: 350),
        transitionBuilder: (child, animation) {
          return FadeTransition(opacity: animation, child: child);
        },
        child: _buildScreen(currentScreen),
      ),
    );
  }

  Widget _buildScreen(String screen) {
    switch (screen) {
      case 'register':
        return RegistrationScreen(key: ValueKey('register'));
      case 'dashboard':
        return DashboardScreen(key: ValueKey('dashboard'));
      case 'session':
        return SessionScreen(key: ValueKey('session'));
      case 'paywall':
        return PaywallScreen(key: ValueKey('paywall'));
      case 'settings':
        return SettingsScreen(key: ValueKey('settings'));
      default:
        return RegistrationScreen(key: ValueKey('register'));
    }
  }
}
