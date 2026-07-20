import 'package:flutter/material.dart';

import '../../services/auth_service.dart';
import '../../services/storage_service.dart';

import '../home/home_screen.dart';

class LoginScreen extends StatefulWidget {

  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();

}

class _LoginScreenState extends State<LoginScreen>{

  final usernameController = TextEditingController();

  final passwordController = TextEditingController();

  bool loading = false;

  Future<void> login() async{

    setState(() {
      loading=true;
    });

    final auth = AuthService();

    final token = await auth.login(

      usernameController.text,

      passwordController.text,

    );

    setState(() {
      loading=false;
    });

    if(token==null){

      ScaffoldMessenger.of(context).showSnackBar(

        const SnackBar(

          content: Text("Invalid login"),

        ),

      );

      return;

    }

    final storage = StorageService();

    await storage.saveToken(token);

    Navigator.pushReplacement(

      context,

      MaterialPageRoute(

        builder: (_) => const HomeScreen(),

      ),

    );

  }

  @override
  Widget build(BuildContext context){

    return Scaffold(

      appBar: AppBar(

        title: const Text("Login"),

      ),

      body: Padding(

        padding: const EdgeInsets.all(20),

        child: Column(

          children: [

            TextField(

              controller: usernameController,

              decoration: const InputDecoration(

                labelText: "Username",

              ),

            ),

            const SizedBox(height:20),

            TextField(

              controller: passwordController,

              obscureText: true,

              decoration: const InputDecoration(

                labelText: "Password",

              ),

            ),

            const SizedBox(height:30),

            SizedBox(

              width: double.infinity,

              child: ElevatedButton(

                onPressed: loading ? null : login,

                child: loading

                    ? const CircularProgressIndicator()

                    : const Text("LOGIN"),

              ),

            )

          ],

        ),

      ),

    );

  }

}