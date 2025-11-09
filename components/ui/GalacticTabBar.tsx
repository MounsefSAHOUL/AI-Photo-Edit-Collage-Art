import {Ionicons} from '@expo/vector-icons';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {BlurView} from 'expo-blur';
import {LinearGradient} from 'expo-linear-gradient';
import React, {useMemo} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useAppTheme} from '@/hooks/useAppTheme';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import TabButton from './tab/TabButton';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function useTrackWidth() {
  const {width} = useWindowDimensions();
  return Math.min(width - 32, 420);
}

export default function GalacticTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const {isDark} = useAppTheme();
  const trackWidth = useTrackWidth();
  const {writingDirection} = useLocaleAppearance();

  const fabScale = useSharedValue(1);
  const fabRotation = useSharedValue(0);
  const flexDirectionAliment =
    writingDirection === 'rtl' ? 'row-reverse' : 'row';

  const centerIndex = useMemo(
    () => state.routes.findIndex(route => route.name === 'AiGenerator'),
    [state.routes],
  );

  const {leftRoutes, rightRoutes, centerRoute} = useMemo(() => {
    if (centerIndex >= 0) {
      return {
        leftRoutes: state.routes.slice(0, centerIndex),
        rightRoutes: state.routes.slice(centerIndex + 1),
        centerRoute: state.routes[centerIndex],
      };
    }
    const midpoint = Math.ceil(state.routes.length / 2);
    return {
      leftRoutes: state.routes.slice(0, midpoint),
      rightRoutes: state.routes.slice(midpoint),
      centerRoute: null,
    };
  }, [centerIndex, state.routes]);

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: fabScale.value}, {rotate: `${fabRotation.value}deg`}],
  }));

  const handleFabPress = () => {
    fabScale.value = withSpring(0.9, {damping: 10, stiffness: 400});
    fabRotation.value = withSpring(180, {damping: 12, stiffness: 200});

    setTimeout(() => {
      fabScale.value = withSpring(1, {damping: 15, stiffness: 150});
      fabRotation.value = withSpring(0, {damping: 12, stiffness: 200});
    }, 150);

    if (centerRoute) {
      const event = navigation.emit({
        type: 'tabPress',
        target: centerRoute.key,
        canPreventDefault: true,
      });
      if (state.index !== centerIndex && !event.defaultPrevented) {
        navigation.navigate(centerRoute.name);
      }
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 70) + 8,
        },
      ]}>
      <BlurView
        intensity={80}
        tint={isDark ? 'dark' : 'light'}
        style={[styles.blurContainer, {width: trackWidth}]}>
        <LinearGradient
          colors={
            isDark
              ? ['rgba(18,16,32,0.95)', 'rgba(10,10,18,0.85)']
              : ['rgba(255,255,255,0.95)', 'rgba(245,245,250,0.85)']
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.track}>
          <View style={styles.trackBorder}>
            <LinearGradient
              colors={['rgba(92,108,255, 0.7)', 'rgba(192,132,252, 0.7)']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
          {/* Tab background shine (SVG shimmer) */}

          <View
            style={[styles.trackInner, {flexDirection: flexDirectionAliment}]}>
            <View
              style={[
                styles.sideGroup,
                styles.leftGroup,
                {flexDirection: flexDirectionAliment},
              ]}>
              {leftRoutes.map(route => (
                <TabButton
                  key={route.key}
                  route={route}
                  state={state}
                  navigation={navigation}
                  descriptors={descriptors}
                />
              ))}
            </View>
            {centerRoute ? <View style={styles.centerPlaceholder} /> : null}
            <View
              style={[
                styles.sideGroup,
                styles.rightGroup,
                {flexDirection: flexDirectionAliment},
              ]}>
              {rightRoutes.map((route, index) => (
                <TabButton
                  key={index}
                  route={route}
                  state={state}
                  navigation={navigation}
                  descriptors={descriptors}
                />
              ))}
            </View>
          </View>
        </LinearGradient>
      </BlurView>

      {centerRoute ? (
        <AnimatedTouchable
          accessibilityRole="button"
          accessibilityLabel={
            descriptors[centerRoute.key].options.tabBarAccessibilityLabel ??
            'Ouvrir la creation'
          }
          onPress={handleFabPress}
          style={[styles.fabWrapper, fabAnimatedStyle]}
          activeOpacity={0.85}>
          <LinearGradient
            colors={['#5C6CFF', '#8B5CF6', '#C084FC']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.fab}>
            <View style={styles.fabGlow} />
            <Ionicons name="sparkles" size={34} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.fabRing}>
            <LinearGradient
              colors={['rgba(92,108,255,0.4)', 'rgba(192,132,252,0.4)']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.fabRingGradient}
            />
          </View>
        </AnimatedTouchable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  blurContainer: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  track: {
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  trackBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    padding: 1,
  },
  trackInner: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideGroup: {
    alignItems: 'center',
    gap: 20,
    flexShrink: 0,
  },
  leftGroup: {
    justifyContent: 'flex-start',
  },
  rightGroup: {
    justifyContent: 'flex-end',
  },
  centerPlaceholder: {
    width: 75,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(22, 22, 40, 0.6)',
    overflow: 'hidden',
  },

  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  tabLabel: {
    marginTop: 5,
    fontSize: 11,
    letterSpacing: 0.3,
    color: 'rgba(229, 229, 245, 0.5)',
    textAlign: 'center',
  },
  fabWrapper: {
    position: 'absolute',
    top: -24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C6CFF',
    shadowOpacity: 0.6,
    shadowOffset: {width: 0, height: 16},
    shadowRadius: 32,
    elevation: 24,
  },
  fabGlow: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(92,108,255,0.3)',
    opacity: 1,
  },
  fabRing: {
    position: 'absolute',
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  fabRingGradient: {
    flex: 1,
    borderRadius: 46,
  },
});
