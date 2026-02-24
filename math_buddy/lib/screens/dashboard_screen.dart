import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/app_state.dart';
import '../theme/app_theme.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final childName = appState.user?.childName ?? 'Buddy';

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
                SizedBox(height: 16),
                _buildHeader(context, childName),
                SizedBox(height: 28),
                _buildTimeCard(appState),
                SizedBox(height: 28),
                _buildStartButton(context, appState),
                SizedBox(height: 28),
                _buildTopics(),
                SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, String childName) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Text(
              'Hi',
              style: TextStyle(fontSize: 28),
            ),
            SizedBox(width: 10),
            Text(
              'Hello, $childName!',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: AppColors.text,
              ),
            ),
          ],
        ),
        IconButton(
          onPressed: () {
            context.read<AppState>().navigateTo('settings');
          },
          icon: Icon(Icons.settings, color: AppColors.text, size: 24),
        ),
      ],
    );
  }

  Widget _buildTimeCard(AppState appState) {
    final remaining = appState.remainingSeconds;
    final total = appState.totalAllowedSeconds;
    final fraction = total > 0 ? remaining / total : 0.0;

    return Container(
      padding: EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppColors.blue.withOpacity(0.15),
            blurRadius: 20,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Timer ring
          SizedBox(
            width: 100,
            height: 100,
            child: CustomPaint(
              painter: _TimeRingPainter(
                fraction: fraction,
                isLow: fraction < 0.2,
              ),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      formatTime(remaining),
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: AppColors.text,
                      ),
                    ),
                    Text(
                      'remaining',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textLight,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SizedBox(width: 24),
          // Plan info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  appState.planLabel,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: AppColors.text,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  appState.planDetail,
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textLight,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStartButton(BuildContext context, AppState appState) {
    return SizedBox(
      height: 64,
      child: ElevatedButton.icon(
        onPressed: appState.canStartSession
            ? () => appState.startSession()
            : null,
        icon: Icon(Icons.play_circle_filled, size: 32),
        label: Text(
          'Start Math Session',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.blue,
          foregroundColor: Colors.white,
          disabledBackgroundColor: AppColors.blue.withOpacity(0.5),
          disabledForegroundColor: Colors.white.withOpacity(0.7),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          elevation: 0,
          shadowColor: AppColors.blue.withOpacity(0.2),
        ),
      ),
    );
  }

  Widget _buildTopics() {
    final topics = [
      {'label': 'Counting', 'color': AppColors.blue, 'borderColor': Color(0xFFBBDEFB)},
      {'label': 'Adding', 'color': AppColors.green, 'borderColor': Color(0xFFC8E6C9)},
      {'label': 'Shapes', 'color': AppColors.orange, 'borderColor': Color(0xFFFFE0B2)},
      {'label': 'Patterns', 'color': AppColors.purple, 'borderColor': Color(0xFFE1BEE7)},
    ];

    return Column(
      children: [
        Text(
          "Today's Topics",
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: AppColors.textLight,
          ),
        ),
        SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          alignment: WrapAlignment.center,
          children: topics.map((t) {
            return Container(
              padding: EdgeInsets.symmetric(horizontal: 18, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: t['borderColor'] as Color, width: 2),
                borderRadius: BorderRadius.circular(9999),
              ),
              child: Text(
                t['label'] as String,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: t['color'] as Color,
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}

class _TimeRingPainter extends CustomPainter {
  final double fraction;
  final bool isLow;

  _TimeRingPainter({required this.fraction, required this.isLow});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 4;
    final strokeWidth = 8.0;

    // Background ring
    final bgPaint = Paint()
      ..color = AppColors.blueLight
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;
    canvas.drawCircle(center, radius, bgPaint);

    // Fill ring
    final fillPaint = Paint()
      ..color = isLow ? AppColors.red : AppColors.blue
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    final sweepAngle = 2 * pi * fraction;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2,
      sweepAngle,
      false,
      fillPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _TimeRingPainter old) =>
      old.fraction != fraction || old.isLow != isLow;
}
