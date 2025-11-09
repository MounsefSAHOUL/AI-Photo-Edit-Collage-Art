# Guide de démarrage de session - AI Chat App

> Objectif : garder une vision claire du projet Expo Router + React Native et ne plus devoir redemander un diagnostic complet.

## 1. Panorama du projet

| Domaine                 | Détail                                                                                                                                                                                                                                                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack                   | Expo Router 6.0 + React Native 0.81.4 + React 19.1 + TypeScript 5.9 (SDK 54). Expo 54 embarque expo-audio, expo-navigation-bar, Zustand 5 pour l'état persistant.                                                                                                                                              |
| Navigation              | `app/_layout.tsx` charge les polices via `expo-font`, masque la barre logicielle Android, enveloppe `LocaleProvider`, `ThemeProvider` et `ToastProvider`, puis rend `AppStack`. `AppStack` initialise `(gate)` et affiche un `FocusTransition` le temps que la langue et le store utilisateur soient hydratés. |
| Accueil & onboarding    | `app/(gate)` contient `welcome` (ImageBackground animée + `GateButton` sonore) et `onBoarding` (wizard 2 étapes avec `BackgroundCarousel`, saisie prénom, sélection de langue, toasts et liens Terms/Privacy).                                                                                                 |
| Thématisation           | `hooks/useAppTheme`, `hooks/useThemeColor` et `hooks/useThemeForModel` s'appuient sur `constants/theme.ts` (palettes globales et par modèle). Le thème utilisateur est stocké dans `stores/userStore.ts`.                                                                                                      |
| Internationalisation    | `i18n/i18n.ts` + `i18n/locales.ts` couvrent 12 langues, détectent AsyncStorage puis la locale device et appliquent RTL via `I18nManager`. Les disclaimers utilisent des segments `[Terms]/[Privacy]` à conserver.                                                                                              |
| Localisation UI & fonts | `useLocaleAppearance` expose fonts Orbitron/Rajdhani/ElMessiri, alignements `textAlign`/`writingDirection`, direction de row et helper `startSpacing`. Utilisé par `Select`, `GateButton`, toasts et écrans.                                                                                                   |
| Modèles IA & modales    | 20 fiches dans `i18n/models/*` exposent `MODELS` (contenus localisés) et `ALLMODELS` (config UI). Le flux `/(modal)/[id]` lit ces données, gère `expo-image-picker`, déclenche `generating` puis `preview`.                                                                                                    |
| Feedback & toasts       | `providers/ToastProvider.tsx` gère une file FIFO avec timers ; `components/ui/Toast.tsx` affiche les bulles Reanimated. Les hooks `useToast` sont disponibles partout.                                                                                                                                         |
| Audio & immersion       | `app/(gate)/_layout.tsx` joue une boucle d'ambiance via `expo-audio`, libérée quand l'utilisateur est configuré. `GateButton` embarque un clic sonore ; `expo-navigation-bar` cache la barre logicielle.                                                                                                       |
| Persistence             | AsyncStorage via `LocaleProvider` et `stores/userStore` (points mensuels, membership auto, flag `hydrate`). Les resets (`Vider le cache`) repassent par ce store partagé.                                                                                                                                      |

## 2. Carte des répertoires

- `app/_layout.tsx` : fonts Orbitron/Rajdhani/ElMessiri, hide Splash quand fonts OK, masque la navigation Android et installe les providers puis `AppStack`.
- `app/appStack.tsx` : stack initialisée sur `(gate)` ; attend `LocaleContext.ready` + hydratation du `userStore` avant de pousser `(tabs)` ou `(modal)` ; loader centré via `FocusTransition`.
- `app/(tabs)/` : `_layout.tsx` enregistre `index` et `explore` (redirige vers `/(gate)/welcome` si `user.displayName` ou `user.lang` manquent). `index` pilote `Select`, `useToast`, reset du store ; `chat.tsx` et `account.tsx` sont présents mais encore hors navigation ; `explore.tsx` est un placeholder.
- `app/(gate)/` : `welcome.tsx` (ImageBackground + animations reanimated + CTA `GateButton` audio) et `onBoarding.tsx` (wizard 2 étapes, `BackgroundCarousel`, `Select` ton gate, toasts, `Linking` Terms/Privacy). `_layout.tsx` joue la musique de fond, s'assure du redirect vers les tabs une fois l'utilisateur renseigné.
- `app/(modal)/` : `_layout.tsx` personnalise le header (typos locales). `history.tsx` placeholder. `[id].tsx` affiche une fiche modèle (gradient `LinearGradient`, sélection variantes, image picker, notes). `generating.tsx` simule la génération puis redirige vers `preview.tsx` (placeholder).
- `components/` : `FocusTransition.tsx` (scroll + fade sur focus) et `BackgroundCarousel.tsx` (carrousel avec drift continu). `components/ui/` contient `Select.tsx`, `GateButton.tsx`, `Toast.tsx`. `components/svg/` expose `Sparkle`.
- `hooks/` : `useAppTheme`, `useLocaleAppearance`, `useThemeColor`, `useThemeForModel`, `useToast`.
- `providers/` : `localeProvider.tsx` (AsyncStorage + ready) et `ToastProvider.tsx`.
- `stores/` : `userStore.ts` (Zustand persisté : points, membership, refill quotidien, flag `hydrate`, helpers `resetUser`, `syncMembership`, `refreshDailyPoints`).
- `i18n/` : `i18n.ts` (init + RTL), `locales.ts` (12 dictionnaires avec disclaimers segmentés) et `models/` (fiches localisées + export `MODELS`/`ALLMODELS`).
- `constants/` : `keys.ts` (clé AsyncStorage, métadata langues, liste RTL) et `theme.ts` (palettes globales + par modèle).
- `contexts/` : `localContext.tsx` (langue) et `toastContext.tsx`.
- `assets/` : polices (`assets/fonts`), images onboarding/welcome (`assets/images`), sons (`assets/sounds`).

## 3. Modules clefs & statut

### Gestion i18n (`i18n/i18n.ts`, `i18n/locales.ts`)

- Dictionnaires pour 12 langues couvrant écrans, CTA et disclaimers (texte entre crochets à conserver pour les liens).
- Initialisation : AsyncStorage > locale device > fallback `en`, puis `applyRTL` force la direction si `ar`.
- **Suivi** : compléter les traductions manquantes (`???` placeholders), vérifier les textes marketing avant mise en prod.

### Modèles IA (`i18n/models/*`, `hooks/useThemeForModel.ts`, `app/(modal)/[id].tsx`)

- 20 fiches TypeScript exposent `MODELS` (contenu localisé) et `ALLMODELS` (config UI) synchronisées avec `types/models.ts`.
- L'écran modal `[id]` applique les palettes (`useThemeForModel`), gère `expo-image-picker`, variantes, notes et navigation vers `generating`/`preview`.
- **Suivi** : brancher `generate()` sur un backend, exposer les `outputs` (actuellement TODO) et ajouter les traductions manquantes hors FR.

### LocaleProvider & useLocaleAppearance (`providers/localeProvider.tsx`, `hooks/useLocaleAppearance.ts`)

- Persistance AsyncStorage (`app_language`), expose `ready` pour bloquer la navigation tant que la langue n'est pas restaurée.
- `useLocaleAppearance` centralise fonts, alignements, direction `row`, spacing conditionnel et booléen `isRTL`.
- **Suivi** : gérer les erreurs AsyncStorage (toast + fallback) et prévoir un loader dédié au lieu de `null` sur font loading.

### Store utilisateur & préférences (`stores/userStore.ts`, `hooks/useAppTheme.ts`)

- Zustand persisté (`user-storage`) : points quotidiens (refill), membership auto (`syncMembership`), flag `hydrate`, helpers `resetUser`, `setUser`, `refreshDailyPoints`.
- `useAppTheme` lit `user.theme` ou le schéma système et expose `toggleTheme`, `setTheme`.
- **Suivi** : connecter l'onboarding (prénom + langue) et les préférences de thème, exposer un refresh côté serveur si points/abonnements deviennent dynamiques.

### Flux onboarding & gate (`app/(gate)/*`, `components/ui/GateButton.tsx`, `components/BackgroundCarousel.tsx`)

- `welcome` + `onBoarding` forment un parcours 2 étapes avec son, animations, carrousel d'images et toasts guidant l'utilisateur.
- `GateButton` applique un son (`expo-audio`), animations Reanimated (sparkles) et tient compte de la direction RTL pour les textes.
- `GateLayout` joue une musique de fond tant que l'utilisateur n'est pas configuré puis la coupe (cleanup `player.remove()`).
- **Suivi** : brancher la validation sur un backend réel, prévoir gestion d'erreur network et option pour passer l'intro.

### Navigation & modales (`app/appStack.tsx`, `app/(tabs)/_layout.tsx`, `app/(modal)/*`)

- `AppStack` reste sur un spinner tant que `LocaleContext.ready` et `userStore.hydrate` ne sont pas vrais.
- `(tabs)` redirige vers `welcome` si `displayName` ou `lang` sont absents ; tabBar stylisée avec fonts locales.
- Modales `history`, `[id]`, `generating`, `preview` scaffolent le futur flux de génération.
- **Suivi** : enregistrer les onglets `chat`/`account`, brancher `history`/`preview` à de vraies données et affiner les options de header.

### Sélecteur & toasts (`components/ui/Select.tsx`, `hooks/useToast.ts`, `components/ui/Toast.tsx`)

- `Select` ouvre un modal ancré (mesure l'anchor, calcul maxHeight), propose un ton `default` ou `gate`, gère flags et RTL.
- `ToastProvider` maintient une file FIFO, `ToastViewport` applique gradients + actions ; `useToast` rend les hooks ergonomiques.
- **Suivi** : internationaliser les flags/labels (actuellement placeholders) et garantir la fermeture du modal Select lors des navigations.

### Audio & UX système (`app/_layout.tsx`, `app/(gate)/_layout.tsx`, `components/ui/GateButton.tsx`)

- `RootLayout` masque NavigationBar Android, gère SplashScreen et fonts (fallback sur console error).
- `GateButton`/`GateLayout` s'appuient sur `expo-audio`; penser à libérer les players si on quitte l'écran ou si permissions refusées.
- **Suivi** : tester volumes/perfs sur device réel, prévoir fallback silencieux si audio indisponible.

## 4. Workflow fonctionnalité

1. Définir la user-story / acceptance.
2. Cartographier les écrans concernés (`app/(tabs|gate|modal)`) et identifier les hooks/providers utiles.
3. Ajouter les clés i18n (fr + en min) dans `i18n/locales.ts` et les fiches `i18n/models/*` si besoin.
4. Implémenter l'écran ou le composant, mutualiser style/logic dans `constants/theme.ts`, `hooks/` ou `components/`.
5. Brancher l'état (`stores/userStore`, contextes) et persister si nécessaire (AsyncStorage).
6. Prévoir le feedback utilisateur (`useToast`, loaders, redirections modales).
7. Tester sur Expo (device), vérifier RTL/audio et flux de navigation.
8. Noter l'objectif/résultat dans la section session + rédiger un commit clair.

## 5. Checklist i18n rapide

- [ ] Ajouter la clé dans toutes les langues (`i18n/locales.ts` + fiches modèles si concerné).
- [ ] Utiliser `i18n.t('chemin')` (aucun texte inline).
- [ ] Mettre à jour `supportedLanguages` si nouvelle locale ajoutée.
- [ ] Tester RTL (ar) : alignements, fonts, direction `row`/marges.
- [ ] Vérifier les segments `[Terms]`/`[Privacy]` lorsqu'on modifie les disclaimers.

## 6. Notes de session

- Inscrire ici objectifs et résultats :
  - Objectif :
  - État :
  - Points ouverts :
- Mettre à jour cette page dès qu'un module majeur évolue.
