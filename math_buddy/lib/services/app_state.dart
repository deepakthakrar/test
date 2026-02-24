import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/user_model.dart';
import 'storage_service.dart';

class AppState extends ChangeNotifier {
  final StorageService _storage;

  // Config
  static const String elevenLabsAgentId = 'agent_9401kj56313ve9htt2wyn9revqkv';
  static const int freeTierSeconds = 7 * 60; // 420s
  static const int paidTierSeconds = 60 * 60; // 3600s
  static const double pricePerWeek = 9.99;

  // State
  UserModel? user;
  int usageSeconds = 0;
  bool isSubscribed = false;
  DateTime? subscriptionExpiry;
  bool sessionActive = false;
  DateTime? sessionStartTime;
  Timer? _sessionTimer;

  // Current screen
  String currentScreen = 'register';

  AppState(this._storage);

  Future<void> init() async {
    await _storage.init();
    user = _storage.getUser();
    usageSeconds = _storage.getUsageSeconds();
    isSubscribed = _storage.getIsSubscribed();
    subscriptionExpiry = _storage.getSubscriptionExpiry();

    if (user != null) {
      currentScreen = 'dashboard';
    }
    notifyListeners();
  }

  int get totalAllowedSeconds =>
      isSubscribed ? paidTierSeconds : freeTierSeconds;

  int get remainingSeconds => (totalAllowedSeconds - usageSeconds).clamp(0, totalAllowedSeconds);

  int get sessionRemainingSeconds {
    if (!sessionActive || sessionStartTime == null) return remainingSeconds;
    final elapsed = DateTime.now().difference(sessionStartTime!).inSeconds;
    return (totalAllowedSeconds - usageSeconds - elapsed).clamp(0, totalAllowedSeconds);
  }

  String get planLabel => isSubscribed ? 'Weekly Plan' : 'Free Trial';
  String get planDetail => isSubscribed
      ? '60 minutes of math fun per week'
      : '7 minutes of math fun';

  bool get canStartSession => remainingSeconds > 0;

  // --- Registration ---
  Future<void> register(UserModel newUser) async {
    user = newUser;
    usageSeconds = 0;
    await _storage.saveUser(newUser);
    await _storage.saveUsageSeconds(0);
    currentScreen = 'dashboard';
    notifyListeners();
  }

  // --- Session ---
  void startSession() {
    if (!canStartSession) {
      currentScreen = 'paywall';
      notifyListeners();
      return;
    }

    sessionActive = true;
    sessionStartTime = DateTime.now();
    currentScreen = 'session';
    notifyListeners();

    _sessionTimer = Timer.periodic(Duration(seconds: 1), (_) {
      if (!sessionActive) return;
      final remaining = sessionRemainingSeconds;
      if (remaining <= 0) {
        endSession();
        currentScreen = 'paywall';
      }
      notifyListeners();
    });
  }

  void endSession() {
    if (!sessionActive) return;
    sessionActive = false;

    if (sessionStartTime != null) {
      final elapsed = DateTime.now().difference(sessionStartTime!).inSeconds;
      usageSeconds += elapsed;
      _storage.saveUsageSeconds(usageSeconds);
    }

    _sessionTimer?.cancel();
    _sessionTimer = null;
    sessionStartTime = null;

    if (currentScreen == 'session') {
      currentScreen = 'dashboard';
    }
    notifyListeners();
  }

  // --- Subscription ---
  Future<void> subscribe() async {
    isSubscribed = true;
    subscriptionExpiry = DateTime.now().add(Duration(days: 7));
    usageSeconds = 0;
    await _storage.saveSubscription(isSubscribed, subscriptionExpiry);
    await _storage.saveUsageSeconds(0);
    currentScreen = 'dashboard';
    notifyListeners();
  }

  // --- Navigation ---
  void navigateTo(String screen) {
    currentScreen = screen;
    notifyListeners();
  }

  // --- Logout ---
  Future<void> logout() async {
    if (sessionActive) endSession();
    await _storage.clearAll();
    user = null;
    usageSeconds = 0;
    isSubscribed = false;
    subscriptionExpiry = null;
    currentScreen = 'register';
    notifyListeners();
  }

  @override
  void dispose() {
    _sessionTimer?.cancel();
    super.dispose();
  }
}

String formatTime(int totalSeconds) {
  final minutes = totalSeconds ~/ 60;
  final seconds = totalSeconds % 60;
  return '$minutes:${seconds.toString().padLeft(2, '0')}';
}
