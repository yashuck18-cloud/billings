import 'package:flutter/services.dart';

/// Audio and haptic feedback utility for POS barcode scanner and billing actions
class FlutterBeep {
  /// Play success sound and light haptic feedback
  static Future<void> playSuccess() async {
    await SystemSound.play(SystemSoundType.click);
    await HapticFeedback.lightImpact();
  }

  /// Play error sound and alert haptic feedback
  static Future<void> playError() async {
    await SystemSound.play(SystemSoundType.alert);
    await HapticFeedback.heavyImpact();
  }

  /// Generic beep trigger
  static Future<void> beep([bool success = true]) async {
    if (success) {
      await playSuccess();
    } else {
      await playError();
    }
  }

  static Future<void> playSysSound(int soundId) async {
    await SystemSound.play(SystemSoundType.click);
  }
}
