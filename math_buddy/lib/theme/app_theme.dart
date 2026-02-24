import 'package:flutter/material.dart';

class AppColors {
  static const blue = Color(0xFF4A90D9);
  static const blueDark = Color(0xFF3570B0);
  static const blueLight = Color(0xFFE8F2FC);
  static const green = Color(0xFF4CAF50);
  static const greenLight = Color(0xFFE8F5E9);
  static const orange = Color(0xFFFF9800);
  static const orangeLight = Color(0xFFFFF3E0);
  static const red = Color(0xFFFF6B6B);
  static const purple = Color(0xFF9C27B0);
  static const yellow = Color(0xFFFFD600);
  static const pink = Color(0xFFFF69B4);
  static const bg = Color(0xFFF0F7FF);
  static const text = Color(0xFF2C3E50);
  static const textLight = Color(0xFF7F8C9B);
  static const white = Color(0xFFFFFFFF);
}

class AppTheme {
  static ThemeData get theme => ThemeData(
        brightness: Brightness.light,
        primaryColor: AppColors.blue,
        scaffoldBackgroundColor: AppColors.bg,
        fontFamily: '.SF Pro Rounded',
        colorScheme: ColorScheme.light(
          primary: AppColors.blue,
          secondary: AppColors.purple,
          surface: AppColors.white,
          error: AppColors.red,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.blue,
            foregroundColor: AppColors.white,
            elevation: 0,
            padding: EdgeInsets.symmetric(horizontal: 32, vertical: 18),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            textStyle: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.3,
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: AppColors.white,
          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide(color: Color(0xFFE0E8F0), width: 2),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide(color: Color(0xFFE0E8F0), width: 2),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide(color: AppColors.blue, width: 2),
          ),
          hintStyle: TextStyle(color: Color(0xFFB0BEC5)),
          labelStyle: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: AppColors.text,
          ),
        ),
      );
}
