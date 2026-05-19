# Talleres Enrique — Panel Admin

App de escritorio y móvil para gestionar el catálogo de piezas.

---

## Requisitos previos

### Para la app web / .EXE (Windows):
1. [Node.js 18+](https://nodejs.org)
2. [Rust](https://rustup.rs) — ejecuta en terminal: `rustup-init.exe`
3. [Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) — necesario para Rust en Windows

### Para la .APK (Android):
4. [Android Studio](https://developer.android.com/studio)
5. En Android Studio: SDK Manager → instala Android SDK 33+
6. Configura la variable de entorno `ANDROID_HOME`

---

## Instalación

```bash
cd talleres-admin
npm install
```

---

## Modo desarrollo (navegador)

```bash
npm run dev
```
Abre http://localhost:1420

---

## Compilar .EXE de Windows

```bash
npm run tauri build
```
El .exe instalable estará en: `src-tauri/target/release/bundle/msi/`

---

## Compilar .APK Android

```bash
# Inicializar Android (solo la primera vez)
npm run tauri android init

# Compilar APK
npm run tauri android build
```
El .apk estará en: `src-tauri/gen/android/app/build/outputs/apk/`

---

## Credenciales

- Contraseña del panel: **taller2024**
- Cámbiala en: `src/stores/auth.js`

---

## Notas

- Los datos se leen y escriben en Supabase en tiempo real
- Las fotos se suben a Supabase Storage (bucket: parts-images)
- La web pública (talleres-joseluis) se actualiza automáticamente al guardar cambios aquí
