// 🎨 PALETTE FUTURISTE ULTRA-PREMIUM
export const COLORS = {
  cyan: '#00f0ff',
  cyanLight: '#39ffff',
  cyanDark: '#0088cc',
  purple: '#a855f7',
  purpleLite: '#d77fee',
  magenta: '#ff006e',
  magentaLight: '#ff4d94',
  lime: '#39ff14',
  lime2: '#7fff00',
  orange: '#ff6b35',
  orangeLite: '#ff8c57',
  dark: '#0a0e27',
  darkLight: '#1a1f3a',
  surface: '#16213e',
  surfaceLight: '#1f2847',
  border: '#2a3a5a',
  borderLight: '#3a4a7a',
  text: '#ffffff',
  textMuted: '#aaaaaa',
} as const;

// 🎯 Configuration des étapes
export const STEP_CONFIG = [
  {
    id: 1,
    label: 'Choisir',
    title: 'Étape 1 • Choisissez votre layout',
    subtitle: 'Sélectionnez le template parfait pour votre collage',
    color: COLORS.orange,
    colorLight: COLORS.orangeLite,
    iconDefault: 'grid',
    iconComplete: 'check',
  },
  {
    id: 2,
    label: 'Remplir',
    title: 'Étape 2 • Remplissez votre collage',
    subtitle: 'Importez et personnalisez vos photos',
    color: COLORS.purple,
    colorLight: COLORS.purpleLite,
    iconDefault: 'image-multiple',
    iconComplete: 'check',
  },
  {
    id: 3,
    label: 'Partager',
    title: 'Étape 3 • Finalisez votre création',
    subtitle: 'Sauvegardez ou partagez votre chef-d&apos;œuvre',
    color: COLORS.lime,
    colorLight: COLORS.lime2,
    iconDefault: 'check-all',
    iconComplete: 'check-all',
  },
] as const;

// 🎬 Configuration des animations
export const ANIMATION_CONFIG = {
  duration: 500,
  fadeStart: 0,
  fadeEnd: 1,
  scaleStart: 0.95,
  scaleEnd: 1,
  slideStart: 30,
  slideEnd: 0,
} as const;
