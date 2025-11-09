import Entypo from '@expo/vector-icons/Entypo';
import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {useThemeColor} from '@/hooks/useThemeColor';
import {Props} from '@/types/global';

export default function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  onOpen,
  onClose,
  tone = 'default',
}: Props<T>) {
  const [open, setOpen] = React.useState(false);
  const isGateTone = tone === 'gate';

  const selectorBackground = useThemeColor(
    isGateTone
      ? {light: 'rgba(8, 8, 16, 0.78)', dark: 'rgba(8, 8, 16, 0.78)'}
      : {light: 'rgba(255, 255, 255, 0.95)', dark: 'rgba(18, 16, 32, 0.82)'},
    'background',
  );
  const dropdownBackground = useThemeColor(
    isGateTone
      ? {light: 'rgba(6, 6, 14, 0.88)', dark: 'rgba(6, 6, 14, 0.88)'}
      : {light: '#FFFFFF', dark: 'rgba(6, 6, 14, 0.82)'},
    'background',
  );
  const selectorBorder = useThemeColor(
    isGateTone
      ? {light: '#8B5CF6', dark: '#8B5CF6'}
      : {light: 'rgba(109, 40, 217, 0.28)', dark: 'rgba(192, 132, 252, 0.32)'},
    'tint',
  );
  const dropdownBorder = useThemeColor(
    isGateTone
      ? {light: '#7C3AED', dark: '#7C3AED'}
      : {light: 'rgba(109, 40, 217, 0.2)', dark: 'rgba(192, 132, 252, 0.26)'},
    'tint',
  );
  const selectorGlow = useThemeColor(
    isGateTone
      ? {light: 'rgba(255, 255, 255, 0.72)', dark: 'rgba(255, 255, 255, 0.78)'}
      : {light: 'rgba(109, 40, 217, 0.18)', dark: 'rgba(192, 132, 252, 0.24)'},
    isGateTone ? 'text' : 'tint',
  );
  const optionHighlight = useThemeColor(
    isGateTone
      ? {light: 'rgba(139, 92, 246, 0.2)', dark: 'rgba(139, 92, 246, 0.24)'}
      : {light: 'rgba(109, 40, 217, 0.08)', dark: 'rgba(192, 132, 252, 0.08)'},
    'tint',
  );
  const textColor = useThemeColor(
    isGateTone ? {light: '#F5F7FF', dark: '#F5F7FF'} : {dark: '#E9D5FF'},
    'text',
  );
  const iconColor = useThemeColor(
    isGateTone ? {light: '#F5F7FF', dark: '#F5F7FF'} : {dark: '#E9D5FF'},
    'icon',
  );
  const accent = useThemeColor({}, 'tint');

  const {textAlign, writingDirection, rowDirection, startSpacing, fonts} =
    useLocaleAppearance();

  const selected = options.find(option => option.value === value);
  const anchorRef = React.useRef<View>(null);
  const {width: screenW, height: screenH} = useWindowDimensions();
  const [anchor, setAnchor] = React.useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    maxHeight: 280,
  });

  const closeDropdown = () => {
    setOpen(false);
    onClose?.();
  };

  const openDropdown = () => {
    requestAnimationFrame(() => {
      anchorRef.current?.measureInWindow((x, y, w, h) => {
        const left = Math.max(8, Math.min(x, screenW - w - 8));
        const estimatedHeight = Math.min(options.length * 44, 260);
        const spaceBelow = screenH - (y + h) - 8;
        const spaceAbove = y - 8;

        const shouldOpenUpwards =
          spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

        const maxHeight = shouldOpenUpwards
          ? Math.min(estimatedHeight, spaceAbove)
          : Math.min(estimatedHeight, Math.max(spaceBelow, 120));

        const top = shouldOpenUpwards
          ? Math.max(8, y - maxHeight - 6)
          : Math.min(y + h + 6, screenH - maxHeight - 8);

        setAnchor({x: left, y: top, w, h, maxHeight});
        onOpen?.();
        setOpen(true);
      });
    });
  };

  return (
    <View style={styles.container}>
      {label ? (
        <Text
          style={[
            styles.label,
            {
              color: iconColor,
              textAlign,
              writingDirection,
              fontFamily: fonts.label,
            },
          ]}
          numberOfLines={1}>
          {label}
        </Text>
      ) : null}
      <View ref={anchorRef} collapsable={false}>
        <Pressable onPress={openDropdown} accessibilityRole="button">
          {({pressed}) => {
            const iosShadowStyle =
              Platform.OS === 'ios'
                ? {
                    shadowColor: selectorGlow,
                    shadowOpacity: open
                      ? isGateTone
                        ? 0.82
                        : 0.32
                      : isGateTone
                      ? 0.45
                      : 0,
                    shadowRadius: open
                      ? isGateTone
                        ? 40
                        : 26
                      : isGateTone
                      ? 28
                      : 18,
                    shadowOffset: {
                      width: 0,
                      height: open ? (isGateTone ? 9 : 12) : isGateTone ? 8 : 0,
                    },
                  }
                : {};
            const androidShadowReset =
              Platform.OS === 'android'
                ? {elevation: 0, shadowColor: 'transparent'}
                : {};
            const glowVisible = isGateTone && (open || pressed);
            const glowScale = glowVisible ? 1 : 0.96;

            return (
              <View
                style={[
                  styles.selector,
                  {
                    backgroundColor: selectorBackground,
                    borderColor: open ? accent : selectorBorder,
                  },
                  iosShadowStyle,
                  androidShadowReset,
                  pressed && {opacity: isGateTone ? 0.92 : 0.94},
                ]}>
                {isGateTone ? (
                  <LinearGradient
                    pointerEvents="none"
                    colors={[
                      'rgba(139, 92, 246, 0.55)',
                      'rgba(139, 92, 246, 0.25)',
                      'rgba(139, 92, 246, 0.05)',
                    ]}
                    locations={[0, 0.55, 1]}
                    start={{x: 0.25, y: 0}}
                    end={{x: 0.75, y: 1}}
                    style={[
                      styles.neonGlow,
                      {
                        opacity: glowVisible ? 1 : 0,
                        transform: [{scale: glowScale}],
                      },
                    ]}
                  />
                ) : null}

                <View style={[styles.row, {flexDirection: rowDirection}]}>
                  {selected?.flag ? (
                    <Text style={[styles.flag, startSpacing(8)]}>
                      {selected.flag}
                    </Text>
                  ) : null}
                  <Text
                    style={[
                      styles.selectorText,
                      {
                        color: textColor,
                        textAlign,
                        writingDirection,
                        fontFamily: fonts.body,
                      },
                    ]}
                    numberOfLines={1}>
                    {selected?.label ?? '-'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.chevron,
                    {
                      color: iconColor,
                      writingDirection,
                      fontFamily: fonts.accent,
                      textAlign,
                    },
                    startSpacing(8),
                  ]}>
                  {open ? (
                    <Entypo
                      name="chevron-small-up"
                      size={24}
                      color={iconColor}
                    />
                  ) : (
                    <Entypo
                      name="chevron-small-down"
                      size={24}
                      color={iconColor}
                    />
                  )}
                </Text>
              </View>
            );
          }}
        </Pressable>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={closeDropdown}>
        <Pressable style={styles.backdrop} onPress={closeDropdown} />
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={{
            position: 'absolute',
            left: anchor.x,
            top: anchor.y,
            width: anchor.w,
            maxHeight: anchor.maxHeight,
          }}>
          <View
            style={[
              styles.dropdown,
              {
                backgroundColor: dropdownBackground,
                borderColor: dropdownBorder,
                shadowColor: selectorGlow,
                shadowOpacity: isGateTone ? 0.72 : 0.24,
                shadowRadius: isGateTone ? 36 : 28,
                shadowOffset: {width: 0, height: isGateTone ? 20 : 18},
                elevation: Platform.OS === 'android' ? 0 : isGateTone ? 14 : 8,
                maxHeight: anchor.maxHeight,
              },
            ]}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
              persistentScrollbar>
              {options.map(option => (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    closeDropdown();
                    onChange(option.value);
                  }}
                  style={({pressed}) => [
                    styles.option,
                    pressed && {backgroundColor: optionHighlight},
                  ]}>
                  <View style={[styles.row, {flexDirection: rowDirection}]}>
                    {option.flag ? (
                      <Text style={[styles.flag, startSpacing(8)]}>
                        {option.flag}
                      </Text>
                    ) : null}
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: textColor,
                          textAlign,
                          writingDirection,
                          fontFamily: fonts.body,
                        },
                      ]}
                      numberOfLines={1}>
                      {option.label}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {width: '100%'},
  label: {marginBottom: 8},
  selector: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'visible',
    backgroundColor: 'rgba(31, 9, 70, 0.78)',
    borderWidth: 2,
    borderColor: 'rgba(167, 139, 250, 0.95)',
    textShadowColor: 'rgba(192, 132, 252, 0.65)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 14,
  },
  row: {alignItems: 'center', gap: 8, flex: 1, minHeight: 20},
  selectorText: {
    fontSize: 16,
    flex: 1,
  },
  dropdown: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: 260,
  },
  backdrop: {position: 'absolute', top: 0, bottom: 0, left: 0, right: 0},
  option: {paddingVertical: 10, paddingHorizontal: 12},
  optionText: {fontSize: 16},
  flag: {fontSize: 18},
  chevron: {fontSize: 16},
  neonGlow: {
    ...StyleSheet.absoluteFillObject,
    top: -10,
    bottom: -10,
    left: -10,
    right: -10,
    borderRadius: 24,
    zIndex: -1,
  },
});
