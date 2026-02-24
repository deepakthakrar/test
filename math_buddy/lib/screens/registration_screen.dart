import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/user_model.dart';
import '../services/app_state.dart';
import '../theme/app_theme.dart';

class RegistrationScreen extends StatefulWidget {
  const RegistrationScreen({super.key});

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen>
    with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _childNameController = TextEditingController();

  late List<AnimationController> _floatControllers;

  @override
  void initState() {
    super.initState();
    _floatControllers = List.generate(
      8,
      (i) => AnimationController(
        vsync: this,
        duration: Duration(seconds: 10 + i * 2),
      )..repeat(reverse: true),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _childNameController.dispose();
    for (final c in _floatControllers) {
      c.dispose();
    }
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    final appState = context.read<AppState>();
    appState.register(UserModel(
      name: _nameController.text.trim(),
      email: _emailController.text.trim(),
      phone: _phoneController.text.trim(),
      childName: _childNameController.text.trim(),
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment(-0.3, -1),
          end: Alignment(0.3, 1),
          colors: [
            AppColors.blueLight,
            AppColors.bg,
            Colors.white,
          ],
        ),
      ),
      child: SafeArea(
        child: Stack(
          children: [
            // Floating numbers background
            ..._buildFloatingNumbers(),

            // Content
            Center(
              child: SingleChildScrollView(
                padding: EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                child: ConstrainedBox(
                  constraints: BoxConstraints(maxWidth: 400),
                  child: Column(
                    children: [
                      _buildLogo(),
                      SizedBox(height: 32),
                      _buildForm(),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildFloatingNumbers() {
    final items = ['1', '2', '3', '+', '5', '=', '7', '4'];
    final positions = [
      [0.08, 0.10],
      [0.15, 0.75],
      [0.35, 0.05],
      [0.50, 0.82],
      [0.65, 0.15],
      [0.75, 0.70],
      [0.85, 0.08],
      [0.25, 0.50],
    ];
    final sizes = [48.0, 36.0, 56.0, 42.0, 52.0, 38.0, 48.0, 44.0];
    final colors = [
      AppColors.blue,
      AppColors.blue,
      AppColors.blue,
      AppColors.orange,
      AppColors.blue,
      AppColors.green,
      AppColors.blue,
      AppColors.blue,
    ];

    return List.generate(items.length, (i) {
      return AnimatedBuilder(
        animation: _floatControllers[i],
        builder: (context, child) {
          final dy = sin(_floatControllers[i].value * pi * 2) * 15;
          final rotation = sin(_floatControllers[i].value * pi * 2) * 0.08;
          return Positioned(
            top: MediaQuery.of(context).size.height * positions[i][0] + dy,
            left: MediaQuery.of(context).size.width * positions[i][1],
            child: Transform.rotate(
              angle: rotation,
              child: Text(
                items[i],
                style: TextStyle(
                  fontSize: sizes[i],
                  fontWeight: FontWeight.w800,
                  color: colors[i].withOpacity(0.06),
                ),
              ),
            ),
          );
        },
      );
    });
  }

  Widget _buildLogo() {
    return Column(
      children: [
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [AppColors.blue, AppColors.purple],
            ),
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: AppColors.blue.withOpacity(0.3),
                blurRadius: 25,
                offset: Offset(0, 8),
              ),
            ],
          ),
          child: Center(
            child: Text(
              '+',
              style: TextStyle(
                fontSize: 40,
                fontWeight: FontWeight.w900,
                color: Colors.white,
              ),
            ),
          ),
        ),
        SizedBox(height: 16),
        Text(
          'Math Buddy',
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.w800,
            color: AppColors.text,
            letterSpacing: -0.5,
          ),
        ),
        SizedBox(height: 4),
        Text(
          'Fun math lessons for little learners!',
          style: TextStyle(
            fontSize: 16,
            color: AppColors.textLight,
          ),
        ),
      ],
    );
  }

  Widget _buildForm() {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _buildField('Your Name', 'e.g. Sarah', _nameController),
          SizedBox(height: 16),
          _buildField('Email', 'parent@email.com', _emailController,
              keyboardType: TextInputType.emailAddress),
          SizedBox(height: 16),
          _buildField('Phone Number', '(555) 123-4567', _phoneController,
              keyboardType: TextInputType.phone),
          SizedBox(height: 16),
          _buildField("Child's Name", 'e.g. Emma', _childNameController),
          SizedBox(height: 24),
          SizedBox(
            height: 56,
            child: ElevatedButton(
              onPressed: _submit,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.blue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 0,
                shadowColor: AppColors.blue.withOpacity(0.35),
              ),
              child: Text(
                "Get Started - It's Free!",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
          SizedBox(height: 12),
          Text(
            '7 minutes of free tutoring included',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13,
              color: AppColors.textLight,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildField(
    String label,
    String hint,
    TextEditingController controller, {
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.only(left: 4, bottom: 6),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: AppColors.text,
            ),
          ),
        ),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
          decoration: InputDecoration(hintText: hint),
        ),
      ],
    );
  }
}
