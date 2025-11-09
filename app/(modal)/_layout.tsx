import {Stack} from 'expo-router';

import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {i18n} from '@/i18n/i18n';

export default function ModalLayout() {
  const {locale} = useLocaleAppearance();

  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        animation: 'slide_from_bottom',
        headerShown: false,
      }}>
      <Stack.Screen
        name="history"
        options={{title: i18n.t('screens.history', {locale})}}
      />
      <Stack.Screen name="comingSoon" />
      <Stack.Screen
        name="[id]"
        options={{title: i18n.t('screens.history', {locale})}}
      />
      <Stack.Screen name="collage" />
    </Stack>
  );
}
