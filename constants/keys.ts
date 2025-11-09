import type {languageType} from '@/types/global';
export const STORAGE_KEY = 'app_language';

export const languageMeta: Record<
  languageType,
  {label: string; flag?: string}
> = {
  en: {label: 'English', flag: '🇺🇸'},
  fr: {label: 'Français', flag: '🇫🇷'},
  de: {label: 'Deutsch', flag: '🇩🇪'},
  es: {label: 'Español', flag: '🇪🇸'},
  hi: {label: 'हिन्दी', flag: '🇮🇳'},
  it: {label: 'Italiano', flag: '🇮🇹'},
  ja: {label: '日本語', flag: '🇯🇵'},
  nl: {label: 'Nederlands', flag: '🇳🇱'},
  pt: {label: 'Português', flag: '🇵🇹'},
  ru: {label: 'Русский', flag: '🇷🇺'},
  zh: {label: '中文', flag: '🇨🇳'},
  ar: {label: 'العربية', flag: '🇦🇪'},
};

export const RTL_LANGS: readonly languageType[] = ['ar'];
