import {Ctx} from '@/types/global';
import React from 'react';

export const LocaleContext = React.createContext<Ctx>({
  locale: 'en',
  setLocale: async () => {},
  ready: false,
});
