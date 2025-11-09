import {i18n} from '@/i18n/i18n';
import {LocaleFonts} from '@/types/global';
import {User} from '@/types/user';
import {LinearGradient} from 'expo-linear-gradient';
import {router} from 'expo-router';
import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  user: User;
  fonts: LocaleFonts;
  textAlign: 'left' | 'right';
  isRTL: boolean;
  locale: string;
  isDark: boolean;
};

function CTASection({user, fonts, textAlign, isRTL, locale, isDark}: Props) {
  if (user.membership === 'premium') return null;

  return (
    <View style={styles.ctaSection}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.ctaCard}>
        <Text style={[styles.ctaTitle, {fontFamily: fonts.heading}]}>
          {i18n.t('home.upgradePremium', {locale})}
        </Text>
        <Text style={[styles.ctaSubtitle, {fontFamily: fonts.body}]}>
          {i18n.t('home.unlockAllModels', {locale})}
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/(modal)/comingSoon')}>
          <Text style={[styles.ctaButtonText, {fontFamily: fonts.accent}]}>
            {i18n.t('home.viewOffers', {locale})}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

export default memo(CTASection);

const styles = StyleSheet.create({
  ctaSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  ctaCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  ctaTitle: {
    fontSize: 21,
    color: '#FFFFFF',
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 8,
    shadowColor: '#373737',
    elevation: 12,
  },
  ctaButtonText: {
    color: '#667eea',
    fontSize: 14,
  },
});
