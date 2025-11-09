import CyberpunkHeader from '@/components/edit/HeaderArt';
import CTASection from '@/components/screens/tabs/CTA';
import Features from '@/components/screens/tabs/Features';
import FuturisticBackgroundInner from '@/components/ui/FuturisticBackground';
import {useAppTheme} from '@/hooks/useAppTheme';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {useToast} from '@/hooks/useToast';
import {i18n} from '@/i18n/i18n';
import {useUser} from '@/stores/userStore';
import {router} from 'expo-router';
import React, {memo, useCallback} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

function EditEntry() {
  const {isDark} = useAppTheme();
  const {locale, fonts, textAlign, isRTL} = useLocaleAppearance();
  const {user} = useUser();
  const {show} = useToast();

  const handleFreeFeature = useCallback(
    (feature: string) => {
      show({
        message: i18n.t('actions.opening', {
          feature: i18n.t(`home.${feature}`, {locale}),
        }),
        type: 'info',
      });

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

  // const HeaderProps = React.useMemo(
  //   () => ({fonts, locale, user, textAlign, isDark}),
  //   [fonts, locale, user, textAlign, isDark],
  // );

  const FeaturesProps = React.useMemo(
    () => ({
      onPressFeature: handleFreeFeature,
      textAlign,
      fonts,
      isRTL,
      locale,
      isDark,
      limit: 16,
    }),
    [handleFreeFeature, textAlign, fonts, locale, isDark, isRTL],
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
      <FuturisticBackgroundInner
        BorderFrameLeft={false}
        BorderFrameRight={false}
      />
      <CyberpunkHeader />
      {/* <Header {...HeaderProps} /> */}
      <Features {...FeaturesProps} />
      <CTASection {...CTASectionProps} />
      <View style={{height: 160}} />
    </ScrollView>
  );
}

export default memo(EditEntry);

const styles = StyleSheet.create({
  container: {flex: 1},
});
