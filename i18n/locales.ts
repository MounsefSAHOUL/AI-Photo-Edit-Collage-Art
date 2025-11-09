import type {languageType} from '@/types/global';
import ar from './local/ar';
import de from './local/de';
import en from './local/en';
import es from './local/es';
import fr from './local/fr';
import hi from './local/hi';
import it from './local/it';
import ja from './local/ja';
import nl from './local/nl';
import pt from './local/pt';
import ru from './local/ru';
import zh from './local/zh';

export type TranslationValue = string | TranslationDictionary;
export type TranslationDictionary = {
  [key: string]: TranslationValue;
};
export const locales: Record<languageType, TranslationDictionary> = {
  en,
  fr,
  de,
  es,
  hi,
  it,
  ja,
  nl,
  pt,
  ru,
  zh,
  ar,
};

export const supportedLanguages = Object.keys(locales) as languageType[];
