import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import Animated, {FadeIn, FadeInDown, FadeInUp} from 'react-native-reanimated';

import GateButton from '@/components/ui/GateButton';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {i18n} from '@/i18n/i18n';
import {router} from 'expo-router';

const backgroundImage = require('@/assets/images/welcome-image-28.jpg');
const backgroundImageLTR = require('@/assets/images/welcome-image-30.jpg');

const Welcome = () => {
  const {locale, fonts, textAlign, writingDirection} = useLocaleAppearance();
  const alignment = writingDirection === 'rtl' ? 'flex-end' : 'flex-start';

  return (
    <ImageBackground
      source={writingDirection === 'rtl' ? backgroundImageLTR : backgroundImage}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.overlay} />
      <View style={[styles.content, {alignItems: alignment}]}>
        <Animated.Text
          entering={FadeInUp.delay(120).duration(600)}
          style={[
            styles.title,
            {fontFamily: fonts.heading, textAlign, writingDirection},
          ]}>
          {i18n.t('messages.welcomeHeroTitle', {locale})}
        </Animated.Text>

        <Animated.Text
          entering={FadeIn.delay(220).duration(600)}
          style={[
            styles.subtitle,
            {fontFamily: fonts.body, textAlign, writingDirection},
          ]}>
          {i18n.t('messages.welcomeHeroSubtitle', {locale})}
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(360).duration(300)}
          style={styles.ctaWrapper}>
          <GateButton
            label={i18n.t('actions.startForFree', {locale})}
            onPress={() => {
              router.push('/(gate)/onBoarding');
            }}
            variant="neutral"
            rightAccessory={true}
            leftAccessory={true}
            style={{marginTop: 40}}
          />
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  background: {flex: 1},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    gap: 20,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: '#F2F4F7',
  },
  ctaWrapper: {
    alignSelf: 'stretch',
  },
});
