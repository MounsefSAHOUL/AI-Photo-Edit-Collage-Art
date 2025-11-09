import CTASection from '@/components/screens/tabs/CTA';
import Features from '@/components/screens/tabs/Features';
import Header from '@/components/screens/tabs/Header';
import PremiumModels from '@/components/screens/tabs/PremiumModels';
import SliderSection from '@/components/screens/tabs/SliderSection';
import FuturisticBackgroundInner from '@/components/ui/FuturisticBackground';
import {useAdMob} from '@/hooks/useAdMob';
import {useAppTheme} from '@/hooks/useAppTheme';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {useToast} from '@/hooks/useToast';
import {i18n} from '@/i18n/i18n';
import {useUser} from '@/stores/userStore';
import {router} from 'expo-router';
import React, {memo, useCallback} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

function HomeScreen() {
  const {isDark} = useAppTheme();
  const {locale, fonts, textAlign, isRTL} = useLocaleAppearance();
  const {user} = useUser();
  const {show} = useToast();
  const {showInterstitial} = useAdMob();

  const handleFreeFeature = useCallback(
    async (feature: string) => {
      show({
        message: i18n.t('actions.opening', {
          feature: i18n.t(`home.${feature}`, {locale}),
        }),
        type: 'info',
      });
      try {
        await showInterstitial();
      } catch {}
      // if (feature === 'retouch') {
      //   router.push(
      //     `/(modal)/freeEdit?featureId=${encodeURIComponent(feature)}`,
      //   );
      // }
      if (feature === 'collage') {
        router.push(`/(modal)/collage`);
      } else {
        router.push(
          `/(modal)/freeEdit?featureId=${encodeURIComponent(feature)}`,
        );
      }
    },

    [show, locale],
  );

  const HeaderProps = React.useMemo(
    () => ({fonts, locale, user, textAlign, isDark}),
    [fonts, locale, user, textAlign, isDark],
  );

  const SliderSectionProps = React.useMemo(
    () => ({fonts, locale, user, textAlign, isDark, isRTL}),
    [fonts, locale, user, textAlign, isDark, isRTL],
  );

  const FeaturesProps = React.useMemo(
    () => ({
      onPressFeature: handleFreeFeature,
      textAlign,
      fonts,
      isRTL,
      locale,
      isDark,
    }),
    [handleFreeFeature, textAlign, fonts, locale, isDark, isRTL],
  );

  const PremiumModelsProps = React.useMemo(
    () => ({
      textAlign,
      fonts,
      locale,
      isDark,
      isRTL,
    }),
    [textAlign, fonts, locale, isDark, isRTL],
  );

  const CTASectionProps = React.useMemo(
    () => ({
      user,
      isUnlocked: user.membership === 'premium',
      textAlign,
      fonts,
      locale,
      isDark,
      isRTL,
    }),
    [user, textAlign, fonts, locale, isDark, isRTL],
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <FuturisticBackgroundInner />

      <Header {...HeaderProps} />

      <SliderSection {...SliderSectionProps} />

      {/* Fonctionnalités Gratuites */}
      <Features {...FeaturesProps} />

      {/* Modèles IA Premium */}
      <PremiumModels {...PremiumModelsProps} />

      {/* CTA Section */}
      <CTASection {...CTASectionProps} />
      <View style={{height: 160}} />
    </ScrollView>
  );
}

export default memo(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
