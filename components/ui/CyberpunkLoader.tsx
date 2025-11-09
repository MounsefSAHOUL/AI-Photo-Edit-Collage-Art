import {Colors} from '@/constants/theme';
import {useAppTheme} from '@/hooks/useAppTheme';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {useRenderProfiler} from '@/hooks/useRenderProfiler';
import {i18n} from '@/i18n/i18n';
import {LinearGradient} from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import React, {useRef} from 'react';
import {StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function CyberpunkLoader() {
  useRenderProfiler('CyberpunkLoader');
  const animation = useRef<LottieView | null>(null);
  const {theme, isDark} = useAppTheme();
  const {locale, fonts} = useLocaleAppearance();

  const gradientColors = isDark ? ['#fecdfe', '#fafafa'] : ['#fee2fe', '#FFF'];

  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient
        colors={
          gradientColors as unknown as readonly [string, string, ...string[]]
        }
        start={{x: 0.5, y: 1.0}}
        end={{x: 0.5, y: 0.0}}
        style={styles.container}>
        <LottieView
          ref={animation}
          source={require('@/assets/animations/skate_onboarding.json')}
          autoPlay
          loop={true}
          style={styles.animation}
        />
        <Text
          style={[
            styles.text,
            {fontFamily: fonts.accent, color: Colors[theme].text},
          ]}>
          {i18n.t('messages.loadingFunny', {locale})}
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#05050A',
  },
  animation: {
    width: 240,
    height: 240,
  },
  text: {
    paddingHorizontal: 34,
    textAlign: 'center',
    marginTop: 24,
    fontSize: 18,
  },
});
