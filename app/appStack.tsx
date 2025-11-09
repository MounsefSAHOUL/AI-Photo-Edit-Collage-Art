import FocusTransition from '@/components/FocusTransition';
import CyberpunkLoader from '@/components/ui/CyberpunkLoader';

import {LocaleContext} from '@/contexts/localContext';
import {useUser} from '@/stores/userStore';
import {Stack} from 'expo-router';
import {useContext} from 'react';

function AppStack() {
  const {ready} = useContext(LocaleContext);
  const {hydrate} = useUser();

  if (!ready || !hydrate) {
    setTimeout(() => {}, 2600);
    return (
      <FocusTransition>
        <CyberpunkLoader />
      </FocusTransition>
    );
  }
  return (
    <Stack initialRouteName="(gate)">
      <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      <Stack.Screen
        name="(modal)"
        options={{presentation: 'fullScreenModal', headerShown: false}}
      />
      <Stack.Screen name="(gate)" options={{headerShown: false}} />
    </Stack>
  );
}

export default AppStack;
