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

    return const Scaffold(

      body: Center(

        child: CircularProgressIndicator(),

      ),

    );

  }

}