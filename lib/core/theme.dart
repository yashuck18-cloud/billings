import 'package:flutter/material.dart';

class AppTheme {
  // A modern, vibrant premium indigo seed color
  static const Color seedColor = Color(0xFF4F46E5);
  
  // Custom theme colors for alerts/badges
  static const Color successColor = Color(0xFF10B981); // Emerald Green
  static const Color warningColor = Color(0xFFF59E0B); // Amber Gold
  static const Color dangerColor = Color(0xFFEF4444);  // Rose Red
  static const Color infoColor = Color(0xFF3B82F6);    // Sky Blue

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: seedColor,
        primary: seedColor,
        secondary: const Color(0xFF0EA5E9), // Cyan
        brightness: Brightness.light,
      ),
      scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      cardTheme: const CardThemeData(
        elevation: 0,
        color: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(20.0)),
        ),
        clipBehavior: Clip.antiAlias,
      ),
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        iconTheme: IconThemeData(color: Color(0xFF1E293B)),
        titleTextStyle: TextStyle(
          color: Color(0xFF1E293B),
          fontWeight: FontWeight.bold,
          fontSize: 18,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          minimumSize: const Size(0, 52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 0,
          backgroundColor: seedColor,
          foregroundColor: Colors.white,
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size(0, 52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          foregroundColor: const Color(0xFF334155), // Slate 700
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.grey.shade200, width: 1),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.grey.shade200, width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: seedColor, width: 2.0),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: dangerColor, width: 1.5),
        ),
        labelStyle: TextStyle(color: Colors.grey.shade600, fontSize: 14),
        floatingLabelStyle: const TextStyle(color: seedColor, fontWeight: FontWeight.bold),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: seedColor,
        primary: const Color(0xFF6366F1), // Indigo 500
        secondary: const Color(0xFF38BDF8), // Cyan 400
        brightness: Brightness.dark,
      ),
      scaffoldBackgroundColor: const Color(0xFF0F172A),
      cardTheme: const CardThemeData(
        elevation: 0,
        color: Color(0xFF1E293B), // Slate 800
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(20.0)),
        ),
        clipBehavior: Clip.antiAlias,
      ),
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        backgroundColor: Color(0xFF1E293B),
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        iconTheme: IconThemeData(color: Colors.white),
        titleTextStyle: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: 18,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          minimumSize: const Size(0, 52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 0,
          backgroundColor: const Color(0xFF6366F1),
          foregroundColor: Colors.white,
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size(0, 52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          foregroundColor: Colors.white,
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFF1E293B),
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Color(0xFF334155), width: 1),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Color(0xFF334155), width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Color(0xFF818CF8), width: 2.0),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: dangerColor, width: 1.5),
        ),
        labelStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
        floatingLabelStyle: const TextStyle(color: Color(0xFF818CF8), fontWeight: FontWeight.bold),
      ),
    );
  }

  static ThemeData getThemeForFestival(FestivalThemeData festTheme, bool isDark) {
    final seed = festTheme.primaryAccent;
    if (!isDark) {
      return ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: seed,
          primary: seed,
          secondary: festTheme.badgeColor,
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        cardTheme: const CardThemeData(
          elevation: 0,
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(20.0)),
          ),
          clipBehavior: Clip.antiAlias,
        ),
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          backgroundColor: Colors.white,
          elevation: 0,
          surfaceTintColor: Colors.transparent,
          iconTheme: IconThemeData(color: Color(0xFF1E293B)),
          titleTextStyle: TextStyle(
            color: Color(0xFF1E293B),
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            minimumSize: const Size(0, 52),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            elevation: 0,
            backgroundColor: seed,
            foregroundColor: Colors.white,
            textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(0, 52),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            foregroundColor: const Color(0xFF334155),
            textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.grey.shade200, width: 1),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.grey.shade200, width: 1),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: seed, width: 2.0),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: dangerColor, width: 1.5),
          ),
          labelStyle: TextStyle(color: Colors.grey.shade600, fontSize: 14),
          floatingLabelStyle: TextStyle(color: seed, fontWeight: FontWeight.bold),
        ),
      );
    } else {
      return ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: seed,
          primary: seed,
          secondary: festTheme.badgeColor,
          brightness: Brightness.dark,
        ),
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        cardTheme: const CardThemeData(
          elevation: 0,
          color: Color(0xFF1E293B),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(20.0)),
          ),
          clipBehavior: Clip.antiAlias,
        ),
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          backgroundColor: Color(0xFF1E293B),
          elevation: 0,
          surfaceTintColor: Colors.transparent,
          iconTheme: IconThemeData(color: Colors.white),
          titleTextStyle: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            minimumSize: const Size(0, 52),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            elevation: 0,
            backgroundColor: seed,
            foregroundColor: Colors.white,
            textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(0, 52),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            foregroundColor: Colors.white,
            textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFF1E293B),
          contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Color(0xFF334155), width: 1),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Color(0xFF334155), width: 1),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: seed, width: 2.0),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: dangerColor, width: 1.5),
          ),
          labelStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
          floatingLabelStyle: BorderSide(color: seed).color == seed
              ? TextStyle(color: seed, fontWeight: FontWeight.bold)
              : const TextStyle(color: Color(0xFF818CF8), fontWeight: FontWeight.bold),
        ),
      );
    }
  }
}

class Slate {
  static const Color shade100 = Color(0xFFF1F5F9);
  static const Color shade200 = Color(0xFFE2E8F0);
  static const Color shade300 = Color(0xFFCBD5E1);
  static const Color shade400 = Color(0xFF94A3B8);
  static const Color shade500 = Color(0xFF64748B);
  static const Color shade600 = Color(0xFF475569);
  static const Color shade700 = Color(0xFF334155);
  static const Color shade800 = Color(0xFF1E293B);
  static const Color shade850 = Color(0xFF151E2E);
  static const Color shade900 = Color(0xFF0F172A);
}

class FestivalThemeData {
  final String key;
  final String title;
  final String greeting;
  final List<Color> bannerGradient;
  final Color primaryAccent;
  final Color badgeColor;
  final IconData icon;

  const FestivalThemeData({
    required this.key,
    required this.title,
    required this.greeting,
    required this.bannerGradient,
    required this.primaryAccent,
    required this.badgeColor,
    required this.icon,
  });
}

class FestivalThemes {
  static const standard = FestivalThemeData(
    key: 'standard',
    title: 'Standard Apex',
    greeting: 'Welcome back to your POS Dashboard',
    bannerGradient: [Color(0xFF1E1B4B), Color(0xFF312E81), Color(0xFF4338CA)],
    primaryAccent: Color(0xFF4F46E5),
    badgeColor: Color(0xFFF59E0B),
    icon: Icons.storefront,
  );

  static const ugadi = FestivalThemeData(
    key: 'ugadi',
    title: 'Ugadi Festival 🌿',
    greeting: ' Happy Ugadi! May this New Year bring joy, health & prosperity.',
    bannerGradient: [Color(0xFF064E3B), Color(0xFF047857), Color(0xFFD97706)],
    primaryAccent: Color(0xFF10B981),
    badgeColor: Color(0xFFF59E0B),
    icon: Icons.eco,
  );

  static const diwali = FestivalThemeData(
    key: 'diwali',
    title: 'Diwali Festival 🪔',
    greeting: ' Happy Diwali! May the festival of lights bring success & warmth.',
    bannerGradient: [Color(0xFF4C0519), Color(0xFF881337), Color(0xFFD97706)],
    primaryAccent: Color(0xFFF43F5E),
    badgeColor: Color(0xFFFBBF24),
    icon: Icons.wb_sunny,
  );

  static const holi = FestivalThemeData(
    key: 'holi',
    title: 'Holi Colors 🎨',
    greeting: ' Happy Holi! Wishing you a vibrant year filled with bright colors.',
    bannerGradient: [Color(0xFF581C87), Color(0xFFC026D3), Color(0xFF06B6D4)],
    primaryAccent: Color(0xFFEC4899),
    badgeColor: Color(0xFF22C55E),
    icon: Icons.palette,
  );

  static const christmas = FestivalThemeData(
    key: 'christmas',
    title: 'Christmas & New Year ❄️',
    greeting: ' Merry Christmas & Happy New Year! Season\'s greetings.',
    bannerGradient: [Color(0xFF0F172A), Color(0xFF1E3A8A), Color(0xFF991B1B)],
    primaryAccent: Color(0xFFEF4444),
    badgeColor: Color(0xFFF59E0B),
    icon: Icons.ac_unit,
  );

  static FestivalThemeData getTheme(String key) {
    switch (key.toLowerCase()) {
      case 'ugadi':
        return ugadi;
      case 'diwali':
        return diwali;
      case 'holi':
        return holi;
      case 'christmas':
        return christmas;
      default:
        return standard;
    }
  }
}

