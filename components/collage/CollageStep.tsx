import {COLORS} from '@/constants/collage';
import {useCollageAnimation} from '@/hooks/useCollageAnimation';
import {i18n} from '@/i18n/i18n';
import {LocaleFonts} from '@/types/global';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';

interface CollageStepProps {
  stepNumber: number;
  title: string;
  subtitle: string;
  color: string;
  colorLight: string;
  icon: string;
  children: React.ReactNode;
  animatedStyle?: any;
  isDark?: boolean;
  fonts?: LocaleFonts;
  textAlign?: 'left' | 'right';
  isRTL?: boolean;
  rowDirection?: 'row' | 'row-reverse';
  selectedId?: any;
}

export const CollageStep: React.FC<CollageStepProps> = ({
  stepNumber,
  color,
  colorLight,
  icon,
  children,
  animatedStyle,
  isDark,
  isRTL,
  textAlign,
  fonts,
  rowDirection,
  selectedId,
}) => {
  const translations = i18n.t('steps') as {
    id: number;
    title: string;
    subtitle: string;
  }[];
  const t = translations?.[stepNumber - 1];
  const resolvedTitle = t?.title;
  const resolvedSubtitle = t?.subtitle;

  const {scaleAnim, slideAnim} = useCollageAnimation(selectedId);

  return (
    <Animated.View
      style={[
        styles.section,
        {
          borderColor: color,
          borderWidth: 2,
          backgroundColor: isDark
            ? 'rgba(26, 31, 58, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
        },
        {
          // opacity: fadeAnim,
          transform: [{scale: scaleAnim}, {translateY: slideAnim}],
        },
      ]}>
      <View style={[styles.sectionHeader, {flexDirection: rowDirection}]}>
        <View
          style={[
            styles.stepNumber,
            {backgroundColor: isDark ? colorLight : color},
          ]}>
          <MaterialCommunityIcons name={icon as any} size={24} color="#fff" />
        </View>
        <View style={{flex: 1}}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colorLight,
                fontFamily: fonts?.heading,
                textAlign: textAlign,
              },
            ]}>
            {resolvedTitle}
          </Text>
          <Text
            style={[
              styles.sectionSubtitle,
              {
                color: COLORS.textMuted,
                fontFamily: fonts?.body,
                textAlign: textAlign,
              },
            ]}>
            {resolvedSubtitle}
          </Text>
        </View>
      </View>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 12,
    paddingTop: 12,
    marginVertical: 12,
    borderRadius: 7,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    gap: 16,
  },
  stepNumber: {
    width: 56,
    height: 56,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
});
