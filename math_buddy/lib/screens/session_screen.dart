import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../services/app_state.dart';
import '../theme/app_theme.dart';

class SessionScreen extends StatefulWidget {
  const SessionScreen({super.key});

  @override
  State<SessionScreen> createState() => _SessionScreenState();
}

class _SessionScreenState extends State<SessionScreen>
    with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _bounceController;
  late Animation<double> _pulseAnimation;
  late Animation<double> _bounceAnimation;
  late WebViewController _webViewController;
  bool _micActive = false;
  bool _agentReady = false;
  final List<_TranscriptMessage> _transcript = [];

  @override
  void initState() {
    super.initState();

    _pulseController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 1500),
    )..repeat();

    _bounceController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 600),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 0.85, end: 1.3).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeOut),
    );

    _bounceAnimation = Tween<double>(begin: 1.0, end: 1.08).animate(
      CurvedAnimation(parent: _bounceController, curve: Curves.easeInOut),
    );

    _initWebView();

    // Simulate agent becoming ready after a short delay
    Future.delayed(Duration(seconds: 2), () {
      if (mounted) {
        setState(() => _agentReady = true);
      }
    });
  }

  void _initWebView() {
    _webViewController = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..loadHtmlString(_buildElevenLabsHtml());
  }

  String _buildElevenLabsHtml() {
    return '''
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background: transparent; }
    elevenlabs-convai { position: fixed; bottom: 0; right: 0; }
  </style>
</head>
<body>
  <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
  <elevenlabs-convai agent-id="${AppState.elevenLabsAgentId}"></elevenlabs-convai>
</body>
</html>
''';
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _bounceController.dispose();
    super.dispose();
  }

  void _toggleMic() {
    setState(() {
      _micActive = !_micActive;
    });
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final remaining = appState.sessionRemainingSeconds;
    final isLow = remaining < 60;

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [AppColors.blueLight, AppColors.bg],
        ),
      ),
      child: SafeArea(
        child: Column(
          children: [
            _buildHeader(context, appState, remaining, isLow),
            Expanded(child: _buildBody()),
            _buildFooter(),
            // Hidden WebView for ElevenLabs
            SizedBox(
              height: 1,
              child: WebViewWidget(controller: _webViewController),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(
      BuildContext context, AppState appState, int remaining, bool isLow) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Back button
          GestureDetector(
            onTap: () => appState.endSession(),
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.transparent,
              ),
              child: Icon(Icons.arrow_back, color: AppColors.text, size: 24),
            ),
          ),

          // Timer pill
          Container(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(9999),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 10,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _TimerDot(isLow: isLow),
                SizedBox(width: 8),
                Text(
                  formatTime(remaining),
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: AppColors.text,
                    fontFeatures: [FontFeature.tabularFigures()],
                  ),
                ),
              ],
            ),
          ),

          // Child name
          SizedBox(
            width: 80,
            child: Text(
              appState.user?.childName ?? '',
              textAlign: TextAlign.right,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: AppColors.textLight,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    return Center(
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Avatar with pulse ring
            SizedBox(
              width: 144,
              height: 144,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Pulse ring
                  if (_agentReady)
                    AnimatedBuilder(
                      animation: _pulseAnimation,
                      builder: (context, child) {
                        return Transform.scale(
                          scale: _pulseAnimation.value,
                          child: Container(
                            width: 144,
                            height: 144,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: AppColors.blue.withOpacity(
                                    0.6 * (1 - (_pulseAnimation.value - 0.85) / 0.45)),
                                width: 3,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  // Avatar circle
                  AnimatedBuilder(
                    animation: _bounceAnimation,
                    builder: (context, child) {
                      return Transform.scale(
                        scale: _agentReady ? _bounceAnimation.value : 1.0,
                        child: Container(
                          width: 120,
                          height: 120,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [AppColors.blue, AppColors.purple],
                            ),
                          ),
                          child: Center(
                            child: Text(
                              '+',
                              style: TextStyle(
                                fontSize: 56,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),

            SizedBox(height: 16),

            // Status text
            Text(
              _agentReady
                  ? (_micActive ? 'Listening...' : 'Math Buddy is ready! Start talking!')
                  : 'Connecting to Math Buddy...',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.textLight,
              ),
            ),

            SizedBox(height: 20),

            // Transcript area
            if (_transcript.isNotEmpty)
              Container(
                constraints: BoxConstraints(maxHeight: 200, maxWidth: 360),
                child: ListView.builder(
                  reverse: true,
                  padding: EdgeInsets.symmetric(horizontal: 8),
                  itemCount: _transcript.length,
                  itemBuilder: (context, index) {
                    final msg = _transcript[_transcript.length - 1 - index];
                    final isUser = msg.role == 'user';
                    return Align(
                      alignment: isUser
                          ? Alignment.centerRight
                          : Alignment.centerLeft,
                      child: Container(
                        margin: EdgeInsets.only(bottom: 8),
                        padding:
                            EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        constraints: BoxConstraints(
                            maxWidth:
                                MediaQuery.of(context).size.width * 0.75),
                        decoration: BoxDecoration(
                          color: isUser ? AppColors.blue : Colors.white,
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(16),
                            topRight: Radius.circular(16),
                            bottomLeft:
                                Radius.circular(isUser ? 16 : 4),
                            bottomRight:
                                Radius.circular(isUser ? 4 : 16),
                          ),
                          boxShadow: isUser
                              ? null
                              : [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.06),
                                    blurRadius: 8,
                                    offset: Offset(0, 2),
                                  ),
                                ],
                        ),
                        child: Text(
                          msg.text,
                          style: TextStyle(
                            fontSize: 15,
                            color: isUser ? Colors.white : AppColors.text,
                            height: 1.4,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildFooter() {
    return Padding(
      padding: EdgeInsets.only(bottom: 24, top: 16),
      child: Center(
        child: GestureDetector(
          onTap: _toggleMic,
          child: AnimatedContainer(
            duration: Duration(milliseconds: 200),
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: _micActive ? AppColors.red : AppColors.blue,
              boxShadow: [
                BoxShadow(
                  color: (_micActive ? AppColors.red : AppColors.blue)
                      .withOpacity(0.4),
                  blurRadius: 25,
                  offset: Offset(0, 6),
                ),
              ],
            ),
            child: Icon(Icons.mic, color: Colors.white, size: 36),
          ),
        ),
      ),
    );
  }
}

class _TimerDot extends StatefulWidget {
  final bool isLow;
  const _TimerDot({required this.isLow});

  @override
  State<_TimerDot> createState() => _TimerDotState();
}

class _TimerDotState extends State<_TimerDot>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: widget.isLow ? 600 : 1500),
    )..repeat(reverse: true);
  }

  @override
  void didUpdateWidget(covariant _TimerDot oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.isLow != widget.isLow) {
      _controller.duration =
          Duration(milliseconds: widget.isLow ? 600 : 1500);
      _controller.repeat(reverse: true);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: (widget.isLow ? AppColors.red : AppColors.green)
                .withOpacity(0.3 + 0.7 * _controller.value),
          ),
        );
      },
    );
  }
}

class _TranscriptMessage {
  final String role;
  final String text;
  _TranscriptMessage(this.role, this.text);
}
