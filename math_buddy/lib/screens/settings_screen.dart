import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/app_state.dart';
import '../theme/app_theme.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final user = appState.user;

    return Container(
      color: AppColors.bg,
      child: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: 24),
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: 400),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                SizedBox(height: 8),
                _buildHeader(context),
                SizedBox(height: 28),

                // Account section
                _buildSection('ACCOUNT', [
                  _buildField('Name', user?.name ?? '-'),
                  _buildField('Email', user?.email ?? '-'),
                  _buildField('Phone', user?.phone ?? '-'),
                  _buildField("Child's Name", user?.childName ?? '-'),
                ]),

                SizedBox(height: 20),

                // Subscription section
                _buildSection('SUBSCRIPTION', [
                  _buildField(
                    'Plan',
                    appState.isSubscribed ? 'Weekly (\$9.99/wk)' : 'Free Trial',
                  ),
                  _buildField(
                    'Time Used',
                    formatTime(appState.usageSeconds),
                  ),
                  _buildField(
                    'Time Remaining',
                    formatTime(appState.remainingSeconds),
                  ),
                ]),

                SizedBox(height: 24),

                // Upgrade button
                if (!appState.isSubscribed)
                  SizedBox(
                    height: 56,
                    child: ElevatedButton(
                      onPressed: () => appState.navigateTo('paywall'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.blue,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 0,
                      ),
                      child: Text(
                        'Upgrade Plan',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),

                if (!appState.isSubscribed) SizedBox(height: 12),

                // Sign out button
                SizedBox(
                  height: 52,
                  child: OutlinedButton(
                    onPressed: () => _showLogoutConfirmation(context, appState),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.red,
                      side: BorderSide(color: AppColors.red, width: 2),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: Text(
                      'Sign Out',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),

                SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Row(
      children: [
        GestureDetector(
          onTap: () => context.read<AppState>().navigateTo('dashboard'),
          child: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(shape: BoxShape.circle),
            child: Icon(Icons.arrow_back, color: AppColors.text, size: 24),
          ),
        ),
        SizedBox(width: 12),
        Text(
          'Settings',
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w800,
            color: AppColors.text,
          ),
        ),
      ],
    );
  }

  Widget _buildSection(String title, List<Widget> fields) {
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: AppColors.textLight,
              letterSpacing: 0.8,
            ),
          ),
          SizedBox(height: 14),
          ...fields,
        ],
      ),
    );
  }

  Widget _buildField(String label, String value) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: Color(0xFFF0F0F0), width: 1),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: AppColors.text,
            ),
          ),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.right,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 15,
                color: AppColors.textLight,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showLogoutConfirmation(BuildContext context, AppState appState) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text('Sign Out?'),
        content: Text('Your usage data will be cleared.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              appState.logout();
            },
            style: TextButton.styleFrom(foregroundColor: AppColors.red),
            child: Text('Sign Out'),
          ),
        ],
      ),
    );
  }
}
