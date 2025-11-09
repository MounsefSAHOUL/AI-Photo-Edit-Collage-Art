# AI Image — README

This README is based on the project session notes (`SESSION_START.md`). It summarizes the project, how to run it locally, and steps to prepare the repository for sharing on GitHub.

## Overview

AI Image is a React Native app (Expo Router) offering AI-assisted photo editing tools, playful asset generation (figures, cards, avatars), a persistent gallery, and a short onboarding flow.

Key technologies

- Expo Router (SDK 54)
- React Native 0.81.x + React 19
- TypeScript
- Zustand (persisted stores)
- Lottie, Reanimated, and several Expo modules (image, file-system, media-library, etc.)

Note: AdMob has been added for monetization (see AdMob section).

## Important structure

- `app/` - pages, layouts, and modals (Expo Router)
- `components/` - reusable UI components and feature components
- `hooks/` - shared hooks (theme, locale, ads, ...)
- `stores/` - Zustand persisted stores (user, images)
- `i18n/local/` - translation files (12 languages)
- `assets/` - images, Lottie animations, fonts
- `android/` - native Android code (if prebuilt/bare)

See `SESSION_START.md` for a more detailed project map.

## Requirements

- Node.js (16+ recommended)
- npm or yarn
- Expo CLI (`npm i -g expo-cli`) or use `npx expo` locally
- Android SDK + Java JDK if building Android locally

## Local installation

Open PowerShell (pwsh) at the project root and run:

```powershell
# install dependencies
npm install

# start Metro / Expo
npm start

# or (for a connected Android device / emulator)
npx expo run:android
```

If you prefer `yarn`:

```powershell
yarn install
yarn start
```

## AdMob configuration (Android / iOS)

You've mentioned AdMob is included. To ensure native SDKs work properly, configure your AdMob IDs:

- Option A (Expo config plugin): add the configuration in `app.json` (or `app.config.js`) under the `react-native-google-mobile-ads` plugin. Example:

```jsonc
"plugins": [
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "ca-app-pub-XXXXXXXXXXXX~YYYYYYYYYY",
      "iosAppId": "ca-app-pub-XXXXXXXXXXXX~ZZZZZZZZZZ"
    }
  ]
]
```

- Option B (native manifests): add the meta-data in `android/app/src/main/AndroidManifest.xml` (already present in this repo):

```xml
<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="ca-app-pub-XXXXXXXXXXXX~YYYYYYYYYY" />
```

Important: do not commit real AdMob app IDs, keystores, or other secrets to a public repo. Use placeholders and document where to add real values, or use environment variables with a local `.env` (excluded from Git).

## Preparing the repo for GitHub

1. Check `.gitignore` (already present). Ensure you do not commit `node_modules/`, `*.jks`, `*.keystore`, local `.env` files, or other secrets.
2. Remove any local secrets (keystores, `*.p12`, `deploy.keystore`, `debug.keystore`). If already committed, consider using `git filter-repo` to purge them from history.
3. Add a `LICENSE` (if desired).
4. Optionally configure GitHub Actions for CI (EAS / lint / tests).

Commands to initialize the repo and push to GitHub (PowerShell):

```powershell
git init
git add .
git commit -m "Initial commit - AI Image"
# create a remote repo on GitHub manually, then
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Checklist before sharing

- Remove or replace sensitive files (keystores, dev certs). If secrets were committed in the past, purge them from history.
- Ensure `package.json` and other config files do not leak secrets.
- Add a `LICENSE` file (MIT / Apache / other) as appropriate.

## Quick run & build (Android release)

```powershell
# debug / dev
npx expo start

# run on Android device/emulator (prebuild or bare)
npx expo run:android

# production build (recommended with EAS)
npx eas build -p android --profile production
```

## Internationalization

Translations live in `i18n/local/` (12 languages). Add new keys in all language files and use `i18n.t('path', {locale})`.

## Notes & open items

- `SESSION_START.md` contains a detailed map of the project and developer notes — keep it for onboarding contributors.
- AdMob integration is present; verify IDs and configuration before publishing to production.

## Contributing

1. Fork & clone
2. Create a branch `feat/xxx` or `fix/xxx`
3. Commit & open a Pull Request

---

If you want, I can also:

- add a `LICENSE` file (MIT by default)
- add a minimal `.github/workflows/ci.yml` for lint/tests
- create a `CONTRIBUTING.md`

Tell me which of those you want and I'll add them.

Dis-moi ce que tu préfères et j'ajoute les fichiers.

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
