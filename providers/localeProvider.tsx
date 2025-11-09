import {STORAGE_KEY} from '@/constants/keys';
import {LocaleContext} from '@/contexts/localContext';
import {i18n} from '@/i18n/i18n';
import type {languageType} from '@/types/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

const FALLBACK_LOCALE: languageType = 'en';

export function LocaleProvider({children}: {children: React.ReactNode}) {
  const [locale, _setLocale] = React.useState<languageType>(FALLBACK_LOCALE);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const saved = (await AsyncStorage.getItem(STORAGE_KEY)) as languageType | null;
      const initial = saved ?? FALLBACK_LOCALE;
      i18n.locale = initial;
      _setLocale(initial);
      setReady(true);
    })();
  }, []);

  const setLocale = React.useCallback(async (lng: languageType) => {
    i18n.locale = lng; // 1) change i18n-js
    await AsyncStorage.setItem(STORAGE_KEY, lng);
    _setLocale(lng); // 2) déclenche le re-render global
  }, []);

  return (
    <LocaleContext.Provider value={{locale, setLocale, ready}}>
      {children}
    </LocaleContext.Provider>
  );
}
