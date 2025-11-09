const tintColorLight = '#6D28D9';
const tintColorDark = '#3e049aff';

export const Colors: any = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#6D28D9',
    tabIconDefault: '#dbdbdbff',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#ECEDEE',
    tabIconSelected: tintColorDark,
  },

  // === Custom Feature Themes ===
  // fallback
  default: {
    text: '#fff',
    background: '#0A0A0A',
    gradient: ['#0A0A0A', '#1F1F1F'],
    accent: tintColorLight,
  },
};
