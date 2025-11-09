import MusicToggleButton from '@/components/ui/MusicToggleButton';
import {useAudioPlayer} from 'expo-audio';
import {Redirect, Stack} from 'expo-router';
import {useCallback, useEffect, useState} from 'react';

import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {useThemeColor} from '@/hooks/useThemeColor';
import {useUser} from '@/stores/userStore';

const backgroundMusic = require('@/assets/sounds/background-music.mp3');

export default function GateLayout() {
  const background = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const {fonts} = useLocaleAppearance();
  const {user} = useUser();
  const [isMuted, setIsMuted] = useState(false);
  const player = useAudioPlayer(backgroundMusic);

  useEffect(() => {
    if (!player.isLoaded) {
      return;
    }

    player.loop = true;
    player.volume = 0.12;

    if (isMuted) {
      if (player.playing && !player.paused) {
        player.pause();
      }
      return;
    }

    if (!player.playing) {
      player.play();
    }
  }, [player, isMuted]);

  useEffect(() => {
    if (user.displayName && user.lang) {
      player.remove();
    }
  }, [player, user.displayName, user.lang]);

  const toggleMusic = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      if (player.isLoaded) {
        if (next) {
          player.pause();
        } else {
          player.play();
        }
      }
      return next;
    });
  }, [player]);

  if (user.displayName && user.lang) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <>
      <Stack
        initialRouteName="welcome"
        screenOptions={{
          animation: 'fade',
          headerShadowVisible: false,
          headerStyle: {backgroundColor: background},
          headerTintColor: tint,
          headerTitleStyle: {fontFamily: fonts.accent, color: textColor},
          contentStyle: {backgroundColor: background},
        }}>
        <Stack.Screen
          name="welcome"
          options={{animation: 'slide_from_left', headerShown: false}}
        />
        <Stack.Screen
          name="onBoarding"
          options={{animation: 'slide_from_right', headerShown: false}}
        />
      </Stack>

      <MusicToggleButton muted={isMuted} onToggle={toggleMusic} />
    </>
  );
}
