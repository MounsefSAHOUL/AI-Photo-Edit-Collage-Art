import {STORAGE_KEY} from '@/constants/keys';
import type {languageType} from '@/types/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import {I18n} from 'i18n-js';
import {I18nManager} from 'react-native';

import {locales, supportedLanguages} from './locales';

const isSupportedLocale = (lng: string | null): lng is languageType =>
  !!lng && supportedLanguages.includes(lng as languageType);

const applyRTL = (lng: languageType) => {
  const shouldUseRTL = lng === 'ar';
  if (I18nManager.isRTL !== shouldUseRTL) {
    I18nManager.allowRTL(shouldUseRTL);
    I18nManager.forceRTL(shouldUseRTL);
  }
};

export const i18n = new I18n(locales, {
  enableFallback: true,
  defaultLocale: 'en',
});

i18n.locale = 'en';

export async function initI18n() {
  // 1) saved language?
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (isSupportedLocale(saved)) {
    i18n.locale = saved;
    applyRTL(saved);
    return;
  }

  // 2) device language (e.g., fr-FR -> fr)
  const deviceLocales = Localization.getLocales();
  const device = deviceLocales?.[0]?.languageCode ?? 'en';
  const resolved = isSupportedLocale(device) ? device : 'en';
  i18n.locale = resolved;
  applyRTL(resolved);
}

export async function setAppLanguage(lng: languageType) {
  if (!supportedLanguages.includes(lng)) {
    return;
  }
  i18n.locale = lng;
  applyRTL(lng);
  await AsyncStorage.setItem(STORAGE_KEY, lng);
}
