import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import {StyleSheet} from 'react-native';

type GradientBgProps = {
  selected?: boolean;
  style?: any;
  isDark?: boolean;
  children?: React.ReactNode;
};

const GradientBg: React.FC<GradientBgProps> = ({
  selected,
  isDark,
  style,
  children,
}) => {
  // choose colors depending on dark mode and selection
  const [c1, c2] = selected
    ? isDark
      ? ['#05263a', '#043f9e']
      : ['#6EE7B7', '#3B82F6']
    : isDark
    ? ['#071022', '#0b2540']
    : ['#f3f4f6', '#e9d5ff'];

  // Ensure the gradient fills its container by default. Allow override via `style` prop.
  return (
    <LinearGradient
      colors={[c1, c2]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[StyleSheet.absoluteFill, style]}>
      {children}
    </LinearGradient>
  );
};

export default GradientBg;
