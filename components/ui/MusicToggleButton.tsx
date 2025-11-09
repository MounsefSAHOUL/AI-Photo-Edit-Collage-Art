import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useThemeColor} from '@/hooks/useThemeColor';
import {MusicToggleButtonProps} from '@/types/global';

const MusicToggleButton: React.FC<MusicToggleButtonProps> = ({
  muted,
  onToggle,
  topOffset = 12,
  rightOffset = 16,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const tint = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const accessibilityLabel = muted ? 'Activer la musique' : 'Couper la musique';

  return (
    <Pressable
      onPress={onToggle}
      style={[
        styles.button,
        {
          top: insets.top + topOffset,
          right: rightOffset,
          borderColor: tint,
        },
        style,
      ]}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}>
      <Ionicons
        name={muted ? 'volume-mute' : 'volume-medium'}
        size={18}
        color={textColor}
      />
    </Pressable>
  );
};

export default MusicToggleButton;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
