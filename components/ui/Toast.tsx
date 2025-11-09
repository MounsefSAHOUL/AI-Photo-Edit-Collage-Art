import {useAppTheme} from '@/hooks/useAppTheme';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {useThemeColor} from '@/hooks/useThemeColor';
import {ToastItem, ToastOptions} from '@/types/global';
import {LinearGradient} from 'expo-linear-gradient';
import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {FadeInDown, FadeOutUp} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export function ToastViewport({
  items,
  onClose,
}: {
  items: ToastItem[];
  onClose: (id: string) => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={[styles.viewport, {paddingTop: insets.top + 10}]}>
      {items.map(({id, opts}) => (
        <ToastBubble key={id} id={id} opts={opts} onClose={onClose} />
      ))}
    </View>
  );
}

function ToastBubble({
  id,
  opts,
  onClose,
}: {
  id: string;
  opts: ToastOptions;
  onClose: (id: string) => void;
}) {
  const tint = useThemeColor({}, 'tint');
  const {isDark} = useAppTheme();
  const {fonts, textAlign, rowDirection, isRTL} = useLocaleAppearance();
  const type = opts.type ?? 'info';

  const palette = useMemo(() => {
    if (type === 'success')
      return {fg: '#fff', gradient: [`${tint}FF`, `${tint}CC`]};
    if (type === 'error')
      return {
        fg: '#fff',
        gradient: [
          'rgba(220,38,38,0.98)',
          'rgba(220,38,38,0.85)',
        ] as readonly string[],
      };
    return {
      fg: '#fff',
      gradient: isDark
        ? (['rgba(22,22,24,0.95)', 'rgba(22,22,24,0.75)'] as readonly string[])
        : (['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.7)'] as readonly string[]),
    };
  }, [type, tint, isDark]);

  return (
    <Animated.View
      entering={FadeInDown.duration(180)}
      exiting={FadeOutUp.duration(180)}
      style={[
        styles.toast,
        // allow locale hook to control row direction; fallback to row
        {flexDirection: rowDirection || (isRTL ? 'row-reverse' : 'row')},
      ]}>
      <LinearGradient
        colors={[palette.gradient[0], palette.gradient[1]]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}
      />
      <Text
        style={[
          styles.msg,
          {color: palette.fg, fontFamily: fonts?.body, textAlign},
          // adjust padding side for RTL
          isRTL ? {paddingLeft: 8} : {paddingRight: 8},
        ]}
        numberOfLines={3}>
        {opts.message}
      </Text>
      {opts.actionLabel ? (
        <Pressable
          onPress={() => {
            onClose(id);
            opts.onAction?.();
          }}
          hitSlop={6}
          style={[styles.action, isRTL ? styles.actionRtl : null]}>
          <Text style={[styles.actionText, {color: palette.fg}]}>
            {opts.actionLabel}
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => onClose(id)}
          hitSlop={6}
          style={[styles.action, isRTL ? styles.actionRtl : null]}>
          <Text style={[styles.actionText, {color: palette.fg}]}>x</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 8,
  },
  toast: {
    minWidth: '70%',
    maxWidth: '92%',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#000',
  },
  msg: {fontSize: 14, flex: 1},
  action: {marginLeft: 8},
  actionRtl: {marginRight: 8, marginLeft: 0},
  actionText: {fontSize: 16},
});

export default ToastViewport;
