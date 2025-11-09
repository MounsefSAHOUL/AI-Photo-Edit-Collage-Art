import {COLORS, STEP_CONFIG} from '@/constants/collage';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {i18n} from '@/i18n/i18n';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface StepBadgeProps {
  step: number;
  currentStep: number;
  label: string;
  isDark: boolean;
}

const StepBadge: React.FC<StepBadgeProps> = ({
  step,
  currentStep,
  label,
  isDark,
}) => {
  const {fonts} = useLocaleAppearance();
  const isActive = currentStep >= step;
  const isCurrent = currentStep === step;
  const stepColor = STEP_CONFIG[step - 1].color;

  return (
    <View style={styles.stepBadge}>
      <View
        style={[
          styles.stepCircle,
          isActive && [
            styles.stepCircleActive,
            {
              borderColor: stepColor,
            },
          ],
          isCurrent && [
            styles.stepCircleCurrent,
            {
              borderColor: stepColor,
            },
          ],
          isDark && isActive && styles.stepCircleActiveDark,
        ]}>
        {isActive && step < currentStep ? (
          <MaterialCommunityIcons name="check" size={18} color={stepColor} />
        ) : (
          <Text
            style={[
              styles.stepCircleText,
              styles.stepCircleTextColor,
              isCurrent && {color: stepColor, fontFamily: fonts.heading},
            ]}>
            {step}
          </Text>
        )}
      </View>
      <Text
        style={[
          styles.stepLabel,
          styles.stepCircleTextColor,
          isActive && [styles.stepLabelActive, {color: stepColor}],
          isDark && styles.stepLabelDark,
          {fontFamily: isActive ? fonts.heading : fonts.body},
        ]}>
        {label}
      </Text>
    </View>
  );
};

interface StepsIndicatorProps {
  currentStep: number;
  isDark: boolean;
}

export const StepsIndicator: React.FC<StepsIndicatorProps> = ({
  currentStep,
  isDark,
}) => {
  const translations = i18n.t('steps') as {id: number; label: string}[];
  const {rowDirection} = useLocaleAppearance();

  return (
    <View
      style={[
        styles.stepsContainer,
        {
          backgroundColor: isDark
            ? 'rgba(26, 31, 58, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          borderColor: '#a855f7',
          flexDirection: rowDirection,
        },
      ]}>
      {STEP_CONFIG.map((config, index) => {
        const t = translations?.[index];
        const label = t?.label ?? config.label;
        return (
          <React.Fragment key={config.id}>
            {index > 0 && (
              <View
                style={[
                  styles.stepDivider,
                  currentStep >= config.id && styles.stepDividerActive,
                  {
                    backgroundColor: '#a855f7',
                  },
                ]}
              />
            )}
            <StepBadge
              step={config.id}
              currentStep={currentStep}
              label={label}
              isDark={isDark}
            />
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    marginVertical: 16,
    borderRadius: 7,
    borderWidth: 2,
  },
  stepBadge: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 54,
    height: 54,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#a855f7',
  },
  stepCircleActive: {
    backgroundColor: '#eee',
  },
  stepCircleActiveDark: {
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
  },
  stepCircleCurrent: {
    borderWidth: 3.5,
    backgroundColor: 'rgba(255, 0, 110, 0.15)',
  },
  stepCircleTextColor: {
    color: '#a855f7',
  },
  stepCircleText: {
    fontSize: 20,
  },
  stepLabel: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
  stepLabelActive: {
    color: '#FFF',
  },
  stepLabelDark: {
    color: '#a855f7',
  },
  stepDivider: {
    width: 56,
    height: 2.8,
    marginBottom: 16,
  },
  stepDividerActive: {
    backgroundColor: COLORS.cyan,
    height: 3.5,
  },
});
