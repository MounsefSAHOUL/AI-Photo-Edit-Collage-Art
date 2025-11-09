import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {i18n} from '@/i18n/i18n';
import {
  GateButtonPalette,
  GateButtonProps,
  GateButtonVariant,
} from '@/types/global';
import {useAudioPlayer} from 'expo-audio';
import * as Haptics from 'expo-haptics';
import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Sparkle from '../svg/Sparkle';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const clickBtn = require('@/assets/sounds/button-click.mp3');

const PALETTE: Record<GateButtonVariant, GateButtonPalette> = {
  primary: {
    backgroundColor: '#6D28D9',
    shadow: '#7C3AED',
  },
  success: {
    backgroundColor: '#22C55E',
    shadow: '#15803D',
  },
  neutral: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
};

const GateButton: React.FC<GateButtonProps> = ({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  backgroundColor,
  shadowColor,
  textColor = '#FFFFFF',
  style,
  contentStyle,
  textStyle,
  leftAccessory,
  rightAccessory,
}) => {
  const scale = useSharedValue(1);
  const {locale, fonts, textAlign, writingDirection} = useLocaleAppearance();
  //const alignment = writingDirection === 'rtl' ? 'flex-end' : 'flex-start';
  const player = useAudioPlayer(clickBtn);

  const palette = PALETTE[variant];
  const resolvedBackground = backgroundColor ?? palette.backgroundColor;
  const resolvedShadow = shadowColor ?? palette.shadow;

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{scale: scale.value}],
      opacity: disabled ? 0.5 : 1,
    }),
    [disabled],
  );

  const handlePressIn = useCallback(() => {
    if (disabled) {
      return;
    }
    scale.value = withTiming(0.97, {duration: 90});
  }, [disabled, scale]);

  const handlePressOut = useCallback(() => {
    if (disabled) {
      return;
    }
    scale.value = withTiming(1, {duration: 140});
  }, [disabled, scale]);

  const handlePress = useCallback(() => {
    if (disabled) {
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    scale.value = withSequence(
      withTiming(0.92, {duration: 140}),
      withTiming(1, {duration: 200}),
    );
    if (player.isLoaded) {
      player.play();
      player.volume = 0.12;
      player.remove();
    }
    onPress?.();
  }, [disabled, onPress, player, scale]);

  const sparkSlide = {
    '0%': {
      transform: [{scale: 0.8}, {rotateX: '-180deg'}],
    },
    '100%': {
      transform: [{scale: 1.2}, {rotateX: '180deg'}],
    },
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.base,
        {backgroundColor: resolvedBackground, shadowColor: resolvedShadow},
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <View style={[styles.content, contentStyle]}>
        <View style={styles.ctaContent}>
          <Text
            style={[
              styles.ctaText,
              textStyle,
              {
                fontFamily: fonts.label,
                color: textColor,
                textAlign,
                writingDirection,
              },
            ]}>
            {i18n.t('actions.startForFree', {locale})}
          </Text>
        </View>

        {leftAccessory ? (
          <Animated.View
            style={[
              styles.sparkleOne,
              styles.sparkleOneLeft,
              {
                animationName: sparkSlide,
                animationDuration: '4s',
                animationIterationCount: 'infinite',
                animationDirection: 'alternate',
                animationTimingFunction: 'linear',
              },
            ]}>
            <Sparkle size={12} color="white" opacity={0.6} />
          </Animated.View>
        ) : null}

        {rightAccessory ? (
          <Animated.View
            style={[
              styles.sparkleOne,
              styles.sparkleOneRight,
              {
                animationName: sparkSlide,
                animationDuration: '4s',
                animationIterationCount: 'infinite',
                animationDirection: 'alternate',
                animationTimingFunction: 'linear',
              },
            ]}>
            <Sparkle size={12} color="white" opacity={0.6} />
          </Animated.View>
        ) : null}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  accessory: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkleOne: {
    position: 'absolute',
    shadowColor: '#FFFFFF',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 8,
    shadowRadius: 20,
    elevation: 6,
  },
  sparkleOneRight: {
    top: 0,
    right: 0,
  },
  sparkleOneLeft: {
    top: 12,
    left: 0,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  ctaText: {
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});

export default GateButton;
