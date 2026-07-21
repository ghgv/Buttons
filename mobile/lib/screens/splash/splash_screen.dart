import 'package:flutter/material.dart';

import '../../services/storage_service.dart';

import '../home/home_screen.dart';
import '../login/login_screen.dart';

class SplashScreen extends StatefulWidget {

  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();

}

class _SplashScreenState extends State<SplashScreen>{

  @override
  void initState(){

    super.initState();

    check();

  }

  Future<void> check() async{

    final storage = StorageService();

    final token = await storage.getToken();

    await Future.delayed(
      const Duration(seconds: 2),
    );

    if(!mounted) return;

    Navigator.pushReplacement(

      context,

      MaterialPageRoute(

        builder: (_) =>

          token==null

            ? const LoginScreen()

            : const HomeScreen(),

      ),

    );

  }

  @override
  Widget build(BuildContext context){

      return Scaffold(
  backgroundColor: const Color.fromARGB(255, 21, 69, 141),

  body: Center(
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [

        Image.asset(
          'assets/images/logo.png',
          width: 180,
          height: 180,
        ),

        const SizedBox(height: 24),

        const Text(
          'Nubeware.ai',
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),

        const SizedBox(height: 8),

        const Text(
          'Smart IoT Facilities',
          style: TextStyle(
            fontSize: 16,
            color: Colors.white70,
          ),
        ),

      ],
    ),
  ),
);

  }

}