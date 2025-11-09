import {useIsFocused} from '@react-navigation/native';
import React, {memo, useEffect, useMemo, useRef} from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  duration?: number; // ms
  slide?: number; // px
  style?: StyleProp<ViewStyle>;
  fill?: boolean; // whether to occupy full space
};

function FocusTransition({
  children,
  duration = 220,
  slide = 12,
  style,
  fill = true,
}: Props) {
  const focused = useIsFocused();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(slide);
  const scrollRef = useRef<any>(null);
  const {height} = useWindowDimensions();

  const enterCfg = useMemo(
    () => ({duration, easing: Easing.out(Easing.cubic)}),
    [duration],
  );
  const exitCfg = useMemo(
    () => ({duration: Math.max(60, Math.round(duration / 2))}),
    [duration],
  );

  useEffect(() => {
    if (focused) {
      opacity.value = withTiming(1, enterCfg);
      translateY.value = withTiming(0, enterCfg);
    } else {
      opacity.value = withTiming(0, exitCfg);
      translateY.value = withTiming(slide, exitCfg);
    }
  }, [focused, slide, enterCfg, exitCfg]);

  const animated = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateY: translateY.value}],
  }));

  return (
    <ScrollView
      ref={scrollRef}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
        minHeight: height,
      }}>
      <Animated.View style={[fill && styles.fill, animated, style]}>
        {children}
      </Animated.View>
    </ScrollView>
  );
}

export default memo(FocusTransition);

const styles = StyleSheet.create({
  fill: {flex: 1},
});
