import {ICON_MAP} from '@/constants/tab';
import {Colors} from '@/constants/theme';
import {useAppTheme} from '@/hooks/useAppTheme';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {Ionicons} from '@expo/vector-icons';
import {BottomTabNavigationEventMap} from '@react-navigation/bottom-tabs';
import {
  NavigationHelpers,
  NavigationRoute,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const DEFAULT_ICON = {active: 'ellipse', inactive: 'ellipse-outline'} as const;
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type tabButtonType = {
  state: TabNavigationState<ParamListBase>;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
  route: NavigationRoute<ParamListBase, string>;
  descriptors: any;
};

const TabButton = ({state, navigation, route, descriptors}: tabButtonType) => {
  const {fonts} = useLocaleAppearance();
  const {theme, isDark} = useAppTheme();
  const palette = Colors[theme];

  const routeIndex = state.routes.indexOf(route);
  const isFocused = state.index === routeIndex;
  const normalized = route.name.toLowerCase();
  const icons =
    (ICON_MAP as unknown as Record<string, typeof DEFAULT_ICON>)[normalized] ??
    DEFAULT_ICON;
  const iconName = isFocused ? icons.active : icons.inactive;

  const scale = useSharedValue(isFocused ? 1 : 0.97);
  const opacity = useSharedValue(isFocused ? 1 : 0.9);

  React.useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0.9, {
      damping: 120,
      stiffness: 900,
    });
    opacity.value = withTiming(isFocused ? 1 : 0.8, {duration: 400});
  }, [isFocused, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  const onPress = () => {
    scale.value = withSpring(0.85, {damping: 120, stiffness: 900});
    //scale.value = withSpring(1, {damping: 120, stiffness: 900});

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  const label = descriptors[route.key]?.options?.title ?? route.name;

  return (
    <AnimatedTouchable
      accessibilityRole="button"
      accessibilityState={isFocused ? {selected: true} : {}}
      accessibilityLabel={
        descriptors[route.key].options.tabBarAccessibilityLabel
      }
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.tabButton, animatedStyle]}
      activeOpacity={0.7}>
      <View style={[styles.iconWrapper, isFocused && styles.iconWrapperActive]}>
        {isFocused && (
          <LinearGradient
            colors={['rgba(92,108,255,0.3)', 'rgba(192,132,252,0.25)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[StyleSheet.absoluteFillObject, {borderRadius: 20}]}
          />
        )}
        <Ionicons
          name={iconName as any}
          size={21}
          color={
            isFocused
              ? '#FFFFFF'
              : isDark
              ? '#E5E5F54D'
              : palette.tabIconDefault
          }
        />
        {isFocused && (
          <View style={styles.activeIndicator}>
            <LinearGradient
              colors={['#5C6CFF', '#C084FC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.activeIndicatorGradient}
            />
          </View>
        )}
      </View>
      {route.name !== 'AiGenerator' ? (
        <Text
          style={[
            styles.tabLabel,
            isFocused && styles.tabLabelActive,
            {fontFamily: fonts.body},
          ]}>
          {label}
        </Text>
      ) : null}
    </AnimatedTouchable>
  );
};

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
    borderRadius: 34,
    overflow: 'hidden',
  },
  track: {
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#5C6CFF',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 20},
    shadowRadius: 50,
    elevation: 20,
  },
  trackBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    padding: 1,
    opacity: 0.6,
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
  iconWrapperActive: {
    borderColor: 'rgba(192,132,252,0.7)',
    borderWidth: 1.5,
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
  activeIndicatorGradient: {
    flex: 1,
    borderRadius: 2,
  },
  tabLabel: {
    marginTop: 5,
    fontSize: 12,
    letterSpacing: 0.3,
    color: '#e8e8e8',
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#FFFFFF',
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
    opacity: 0.8,
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

export default TabButton;
