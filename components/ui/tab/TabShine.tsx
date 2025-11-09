import {TabShineProps} from '@/types/global';
import MaskedView from '@react-native-masked-view/masked-view';
import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Sparkle from '../../svg/Sparkle';

export default function TabShine({
  width = 320,
  height = 32,
  duration = 1400,
  colors = [
    'rgba(255,255,255,0)',
    'rgba(255,255,255,0.35)',
    'rgba(255,255,255,0)',
  ],
  style,
}: TabShineProps) {
  const translate = useSharedValue(-width * 0.6);

  // Sparkles configuration (explicit shared values to satisfy hooks rules)
  const s0 = useSharedValue(0);
  const s1 = useSharedValue(0);
  const s2 = useSharedValue(0);
  const s3 = useSharedValue(0);
  const s4 = useSharedValue(0);
  const s5 = useSharedValue(0);
  const sparkleVals = [s0, s1, s2, s3, s4, s5];
  const timersRef = React.useRef<number[]>([]);

  const sStyles = [
    useAnimatedStyle(() => ({
      opacity: s0.value,
      transform: [{scale: 0.6 + s0.value * 0.8}],
    })),
    useAnimatedStyle(() => ({
      opacity: s1.value,
      transform: [{scale: 0.6 + s1.value * 0.8}],
    })),
    useAnimatedStyle(() => ({
      opacity: s2.value,
      transform: [{scale: 0.6 + s2.value * 0.8}],
    })),
    useAnimatedStyle(() => ({
      opacity: s3.value,
      transform: [{scale: 0.6 + s3.value * 0.8}],
    })),
    useAnimatedStyle(() => ({
      opacity: s4.value,
      transform: [{scale: 0.6 + s4.value * 0.8}],
    })),
    useAnimatedStyle(() => ({
      opacity: s5.value,
      transform: [{scale: 0.6 + s5.value * 0.8}],
    })),
  ];

  React.useEffect(() => {
    translate.value = withRepeat(
      withTiming(width, {duration, easing: Easing.linear}),
      -1,
      false,
    );
  }, [translate, width, duration]);

  // Start sparkle animations with staggered delays
  React.useEffect(() => {
    sparkleVals.forEach((sv, idx) => {
      const delay = Math.round(
        (idx / sparkleVals.length) * duration * 0.9 + Math.random() * 400,
      );
      const t = setTimeout(() => {
        sv.value = withRepeat(
          withSequence(
            withTiming(1, {duration: 220}),
            withTiming(0, {duration: 600}),
          ),
          -1,
          false,
        );
      }, delay);
      timersRef.current.push(t as unknown as number);
    });

    return () => {
      timersRef.current.forEach(id => clearTimeout(id));
      timersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translate.value}],
  }));

  const maskElement = (
    <View
      style={{width, height, alignItems: 'center', justifyContent: 'center'}}>
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          borderRadius: height / 2,
        }}
      />
    </View>
  );

  return (
    <View style={[styles.wrapper, {width, height}, style]} pointerEvents="none">
      <MaskedView style={{width, height}} maskElement={maskElement}>
        <View style={{flex: 1, overflow: 'hidden'}}>
          <Animated.View
            style={[
              {position: 'absolute', left: 0, top: 0, bottom: 0, right: 0},
              animatedStyle,
            ]}>
            <LinearGradient
              colors={colors as any}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{width: width * 0.6, height}}
            />
          </Animated.View>
          {/* Sparkles layered on top of the gradient, inside the masked area */}
          {sStyles.map((styleAnim, i) => {
            const left = Math.round(
              ((i + 1) / (sStyles.length + 1)) * width +
                (Math.random() - 0.5) * 24,
            );
            const top = Math.round(
              Math.max(0, Math.min(height - 6, Math.random() * (height - 6))),
            );
            return (
              <Animated.View
                key={`spark-${i}`}
                style={[
                  {position: 'absolute', left, top, width: 12, height: 12},
                  styleAnim,
                ]}>
                <Sparkle
                  size={9}
                  color="rgba(255,255,255,0.8)"
                  opacity={0.95}
                />
              </Animated.View>
            );
          })}
        </View>
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    overflow: 'hidden',
  },
});
