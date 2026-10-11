import 'package:flutter/material.dart';

import '../../services/auth_service.dart';
import '../../services/storage_service.dart';

import '../../services/firebase_service.dart';
import '../../services/device_service.dart';
import '../../services/mobile_service.dart';

import '../home/home_screen.dart';

class LoginScreen extends StatefulWidget {

  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();

}

class _LoginScreenState extends State<LoginScreen> {

  bool _obscurePassword = true;

  final usernameController = TextEditingController();
  final passwordController = TextEditingController();

  bool loading = false;

  Future<void> login() async {

    setState(() {
      loading = true;
    });

    final auth = AuthService();

    final token = await auth.login(
      usernameController.text.trim(),
      passwordController.text,
    );

    if (!mounted) return;

    setState(() {
      loading = false;
    });

    if (token == null) {

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Usuario o contraseña inválidos"),
        ),
      );

      return;

    }

    final storage = StorageService();

    await storage.saveToken(token);

    try {

      final fcmToken = await FirebaseService.getToken();

      if (fcmToken != null) {

        final device = await DeviceService.getInfo();

        await MobileService.registerDevice(
          fcmToken: fcmToken,
          device: device,
        );

      }

    } catch (e) {

      debugPrint("Error registrando dispositivo: $e");

    }

    if (!mounted) return;

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => const HomeScreen(),
      ),
    );

  }

  @override
  void dispose() {

    usernameController.dispose();
    passwordController.dispose();

    super.dispose();

  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor: const Color(0xFFF4F6F8),

      body: SafeArea(

        child: Center(

          child: SingleChildScrollView(

            padding: const EdgeInsets.all(24),

            child: Column(

              mainAxisAlignment: MainAxisAlignment.center,

              children: [

                const Icon(
                  Icons.notifications_active_outlined,
                  size: 72,
                  color: Color(0xFF0D47A1),
                ),

                const SizedBox(height: 16),

                const Text(
                  "Buttons",
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0D47A1),
                  ),
                ),

                const SizedBox(height: 6),

                const Text(
                  "Ingreso de supervisores",
                  style: TextStyle(
                    fontSize: 15,
                    color: Colors.grey,
                  ),
                ),

                const SizedBox(height: 36),

                Container(

                  padding: const EdgeInsets.all(22),

                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x14000000),
                        blurRadius: 20,
                        offset: Offset(0, 8),
                      ),
                    ],
                  ),

                  child: Column(

                    children: [

                      TextField(

                        controller: usernameController,
                        keyboardType: TextInputType.emailAddress,

                        decoration: InputDecoration(

                          labelText: "Usuario",
                          hintText: "correo@empresa.com",

                          prefixIcon: const Icon(
                            Icons.person_outline,
                          ),

                          filled: true,
                          fillColor: const Color(0xFFF7F9FC),

                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide.none,
                          ),

                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(
                              color: Color(0xFF0D47A1),
                              width: 2,
                            ),
                          ),

                        ),

                      ),

                      const SizedBox(height: 18),

                      TextField(

                        controller: passwordController,
                        obscureText: _obscurePassword,

                        decoration: InputDecoration(

                          labelText: "Contraseña",
                          hintText: "Ingresa tu contraseña",

                          prefixIcon: const Icon(
                            Icons.lock_outline,
                          ),

                          suffixIcon: IconButton(

                            icon: Icon(
                              _obscurePassword
                                  ? Icons.visibility_off_outlined
                                  : Icons.visibility_outlined,
                            ),

                            onPressed: () {

                              setState(() {
                                _obscurePassword = !_obscurePassword;
                              });

                            },

                          ),

                          filled: true,
                          fillColor: const Color(0xFFF7F9FC),

                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide.none,
                          ),

                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(
                              color: Color(0xFF0D47A1),
                              width: 2,
                            ),
                          ),

                        ),

                      ),

                      const SizedBox(height: 26),

                      SizedBox(

                        width: double.infinity,
                        height: 52,

                        child: ElevatedButton(

                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF0D47A1),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),

                          onPressed: loading ? null : login,

                          child: loading

                              ? const SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2.5,
                                    color: Colors.white,
                                  ),
                                )

                              : const Text(
                                  "INGRESAR",
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),

                        ),

                      ),

                    ],

                  ),

                ),

              ],

            ),

          ),

        ),

      ),

    );

  }

}
