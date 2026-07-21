# Buttons Mobile App

Aplicación móvil desarrollada en **Flutter** para la gestión y seguimiento de incidentes de la plataforma **Buttons**.

## Requisitos

Antes de instalar la aplicación, asegúrese de tener instalados:

* Flutter SDK
* Android SDK
* Android Studio o las herramientas de Android SDK
* ADB (Android Debug Bridge)
* Git
* Un dispositivo Android o emulador

Para comprobar que Flutter está correctamente configurado:

```bash
flutter doctor
```

Se recomienda solucionar los errores importantes reportados por `flutter doctor` antes de continuar.

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/ghgv/Buttons.git
```

Ingresar al proyecto:

```bash
cd Buttons
```

---

## 2. Ingresar al proyecto móvil

La aplicación Flutter se encuentra en el directorio `mobile`:

```bash
cd mobile
```

---

## 3. Limpiar compilaciones anteriores

Antes de instalar las dependencias o generar una nueva versión, se recomienda limpiar los archivos generados previamente:

```bash
flutter clean
```

---

## 4. Instalar las dependencias

Ejecutar:

```bash
flutter pub get
```

Este comando descargará las dependencias definidas en:

```text
pubspec.yaml
```

---

## 5. Verificar el dispositivo Android

Conectar el dispositivo Android mediante USB y comprobar que ADB puede detectarlo:

```bash
adb devices
```

Debe aparecer algo similar a:

```text
List of devices attached
XXXXXXXXXXXX    device
```

Si el dispositivo muestra `unauthorized`, desbloquee el teléfono y acepte la autorización de depuración USB.

---

## 6. Ejecutar la aplicación en desarrollo

Con el teléfono conectado o un emulador Android activo:

```bash
flutter run
```

Flutter compilará e instalará automáticamente la aplicación en el dispositivo.

---

# Compilación para producción

## 7. Generar APK Release

Para generar el APK optimizado para producción:

```bash
flutter build apk --release
```

Al finalizar, Flutter generará el archivo:

```text
build/app/outputs/flutter-apk/app-release.apk
```

---

## 8. Instalar el APK mediante ADB

Con el dispositivo conectado:

```bash
adb install -r build/app/outputs/flutter-apk/app-release.apk
```

La opción `-r` permite reemplazar una instalación existente conservando los datos de la aplicación cuando sea posible.

---

# Proceso completo

Para una instalación rápida desde el directorio raíz del repositorio:

```bash
cd mobile

flutter clean
flutter pub get
flutter run
```

Para generar e instalar la versión Release:

```bash
cd mobile

flutter clean
flutter pub get
flutter build apk --release
adb install -r build/app/outputs/flutter-apk/app-release.apk
```

---

# Actualizar el proyecto

Para descargar los últimos cambios del repositorio:

```bash
git pull
```

Después de actualizar el código se recomienda ejecutar:

```bash
cd mobile
flutter clean
flutter pub get
```

Y posteriormente:

```bash
flutter run
```

o generar nuevamente el APK:

```bash
flutter build apk --release
```

---

# Diagnóstico

Si existen problemas durante la compilación, ejecutar:

```bash
flutter doctor -v
```

Para verificar los dispositivos disponibles:

```bash
flutter devices
```

Para verificar específicamente dispositivos Android mediante ADB:

```bash
adb devices
```

Si ADB no detecta correctamente el dispositivo:

```bash
adb kill-server
adb start-server
adb devices
```
