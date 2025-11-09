import {useCallback, useContext, useMemo} from 'react';

import {RTL_LANGS} from '@/constants/keys';
import {LocaleContext} from '@/contexts/localContext';
import type {
  languageType,
  LocaleAppearance,
  LocaleFonts,
  StartSpacingFn,
} from '@/types/global';

export function useLocaleAppearance(): LocaleAppearance {
  const {locale, setLocale, ready} = useContext(LocaleContext);
  const normalized = locale as languageType;
  const isRTL = RTL_LANGS.includes(normalized);

  const textAlign = isRTL ? 'right' : 'left';
  const writingDirection = isRTL ? 'rtl' : 'ltr';
  const rowDirection = isRTL ? 'row-reverse' : 'row';

  const startSpacing = useCallback<StartSpacingFn>(
    value => (isRTL ? {marginLeft: value} : {marginRight: value}),
    [isRTL],
  );

  const fonts = useMemo<LocaleFonts>(
    () => ({
      heading: isRTL ? 'ElMessiri-Bold' : 'Orbitron-Bold',
      body: isRTL ? 'ElMessiri-Medium' : 'Rajdhani-Regular',
      accent: isRTL ? 'ElMessiri-Bold' : 'Orbitron-Medium',
      label: isRTL ? 'ElMessiri-Medium' : 'Orbitron-Medium',
    }),
    [isRTL],
  );

  return {
    locale,
    setLocale,
    ready,
    isRTL,
    textAlign,
    writingDirection,
    rowDirection,
    startSpacing,
    fonts,
  };
}
