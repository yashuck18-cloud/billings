import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'firebase_options.dart';
import 'services/notification_service.dart';
import 'core/storage.dart';
import 'core/theme.dart';
import 'providers/auth_provider.dart';
import 'providers/db_provider.dart';
import 'providers/billing_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/home_screen.dart';

void main() async {
  // Ensure Flutter engine binding is initialized
  WidgetsFlutterBinding.ensureInitialized();
  
  // Configure production error handler
  FlutterError.onError = (FlutterErrorDetails details) {
    FlutterError.presentError(details);
    debugPrint('Uncaught Flutter Error: ${details.exception}');
  };

  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // Initialize Local Notifications & FCM Listeners
  await NotificationService().init();

  // Request notification permission
  NotificationSettings settings =
      await FirebaseMessaging.instance.requestPermission();
  debugPrint('User granted permission status: ${settings.authorizationStatus}');

  // Get the device token
  String? token = await FirebaseMessaging.instance.getToken();
  debugPrint('FCM Token initialized: ${token != null ? "Active" : "None"}');

  // Initialize Shared Preferences Local Storage Simulator
  await StorageService.init();

  // Restore user-scoped storage from cached login (if any)
  final cachedUser = StorageService.getUser();
  if (cachedUser != null) {
    StorageService.setCurrentUserId(cachedUser['id']?.toString());
    final userMobile = (cachedUser['mobile'] ?? cachedUser['phone'] ?? cachedUser['email'] ?? '').toString();
    if (userMobile.isNotEmpty) {
      NotificationService().bindUserMobile(userMobile);
    }
    NotificationService().saveUserTokenToFirestore(
      userId: cachedUser['id']?.toString() ?? '1',
      name: (cachedUser['businessName'] ?? cachedUser['name'] ?? 'Store Owner').toString(),
      email: (cachedUser['email'] ?? 'owner@example.com').toString(),
      role: 'owner',
    );
  }

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => DbProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => BillingProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class AppCustomScrollBehavior extends MaterialScrollBehavior {
  @override
  Set<PointerDeviceKind> get dragDevices => {
        PointerDeviceKind.touch,
        PointerDeviceKind.mouse,
        PointerDeviceKind.trackpad,
        PointerDeviceKind.stylus,
        PointerDeviceKind.unknown,
      };
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  bool _wired = false;

  @override
  Widget build(BuildContext context) {
    final dbProvider = Provider.of<DbProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);

    // Wire AuthProvider to DbProvider bidirectionally once
    if (!_wired) {
      authProvider.attachDbProvider(dbProvider);
      dbProvider.attachAuthProvider(authProvider);
      _wired = true;
    }

    WidgetsBinding.instance.addPostFrameCallback((_) {
      NotificationService.checkPendingNotification();
    });

    return MaterialApp(
      navigatorKey: NotificationService.navigatorKey,
      title: 'Crafzio Billing POS - Inventory & Billing',
      debugShowCheckedModeBanner: false,
      scrollBehavior: AppCustomScrollBehavior(),
      theme: AppTheme.getThemeForFestival(dbProvider.festivalTheme, false),
      darkTheme: AppTheme.getThemeForFestival(dbProvider.festivalTheme, true),
      builder: (context, child) {
        return GestureDetector(
          onTap: () {
            ScaffoldMessenger.of(context).hideCurrentSnackBar();
          },
          behavior: HitTestBehavior.translucent,
          child: child ?? const SizedBox(),
        );
      },
      home: authProvider.isAuthenticated ? const HomeScreen() : const LoginScreen(),
    );
  }
}
