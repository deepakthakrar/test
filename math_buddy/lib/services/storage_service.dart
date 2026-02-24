import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';

class StorageService {
  static const _keyUser = 'mathbuddy_user';
  static const _keyUsage = 'mathbuddy_usage';
  static const _keySubscription = 'mathbuddy_subscription';

  late SharedPreferences _prefs;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // --- User ---
  UserModel? getUser() {
    final data = _prefs.getString(_keyUser);
    if (data == null) return null;
    return UserModel.fromJson(jsonDecode(data));
  }

  Future<void> saveUser(UserModel user) async {
    await _prefs.setString(_keyUser, jsonEncode(user.toJson()));
  }

  Future<void> clearUser() async {
    await _prefs.remove(_keyUser);
  }

  // --- Usage ---
  int getUsageSeconds() {
    final data = _prefs.getString(_keyUsage);
    if (data == null) return 0;
    final usage = jsonDecode(data);

    // Reset weekly usage if a new week has started
    if (usage['weekStart'] != null) {
      final weekStart = DateTime.parse(usage['weekStart']);
      final now = DateTime.now();
      if (now.difference(weekStart).inDays >= 7) {
        saveUsageSeconds(0);
        return 0;
      }
    }

    return usage['seconds'] ?? 0;
  }

  Future<void> saveUsageSeconds(int seconds) async {
    final data = _prefs.getString(_keyUsage);
    String weekStart;
    if (data != null) {
      final parsed = jsonDecode(data);
      weekStart = parsed['weekStart'] ?? DateTime.now().toIso8601String();
    } else {
      weekStart = DateTime.now().toIso8601String();
    }

    await _prefs.setString(
      _keyUsage,
      jsonEncode({'seconds': seconds, 'weekStart': weekStart}),
    );
  }

  // --- Subscription ---
  bool getIsSubscribed() {
    final data = _prefs.getString(_keySubscription);
    if (data == null) return false;
    final sub = jsonDecode(data);

    if (sub['expiry'] != null) {
      final expiry = DateTime.parse(sub['expiry']);
      if (DateTime.now().isAfter(expiry)) {
        saveSubscription(false, null);
        return false;
      }
    }

    return sub['active'] ?? false;
  }

  DateTime? getSubscriptionExpiry() {
    final data = _prefs.getString(_keySubscription);
    if (data == null) return null;
    final sub = jsonDecode(data);
    if (sub['expiry'] != null) return DateTime.parse(sub['expiry']);
    return null;
  }

  Future<void> saveSubscription(bool active, DateTime? expiry) async {
    await _prefs.setString(
      _keySubscription,
      jsonEncode({
        'active': active,
        'expiry': expiry?.toIso8601String(),
      }),
    );
  }

  // --- Clear All ---
  Future<void> clearAll() async {
    await _prefs.remove(_keyUser);
    await _prefs.remove(_keyUsage);
    await _prefs.remove(_keySubscription);
  }
}
