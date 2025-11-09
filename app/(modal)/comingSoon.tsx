import FuturisticBackgroundInner from '@/components/ui/FuturisticBackground';
import {useAppTheme} from '@/hooks/useAppTheme';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {i18n} from '@/i18n/i18n';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function ComingSoonModal() {
  const {fonts, locale} = useLocaleAppearance();
  const {isDark} = useAppTheme();
  const router = useRouter();

  const circleBg = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
  const iconColor = isDark ? '#000' : '#FFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <View style={styles.container}>
      <FuturisticBackgroundInner />
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.8}
        style={[
          styles.topBack,
          {
            backgroundColor: circleBg,
            borderColor,
            shadowColor: borderColor,
            elevation: 4,
          },
        ]}
        accessibilityLabel="Retour">
        <Ionicons name="chevron-back" size={22} color={iconColor} />
      </TouchableOpacity>
      <View style={styles.content}>
        <LottieView
          source={require('@/assets/animations/skate_onboarding.json')}
          autoPlay
          loop
          style={styles.animation}
        />

        <Text style={[styles.title, {fontFamily: fonts.accent}]}>
          {' '}
          {i18n.t('comingSoon.title', {locale})}{' '}
        </Text>
        <Text style={[styles.message, {fontFamily: fonts.body}]}>
          {' '}
          {i18n.t('comingSoon.message', {locale})}{' '}
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          style={styles.closeButton}>
          <Text style={[styles.closeText, {fontFamily: fonts.body}]}>
            {' '}
            {i18n.t('actions.close', {locale})}{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  animation: {
    width: 280,
    height: 280,
  },
  title: {
    fontSize: 26,
    color: '#FFF',
    marginTop: 12,
  },
  message: {
    color: '#DDD',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
  },
  closeText: {
    color: '#FFF',
    fontSize: 17,
  },
  topBack: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    zIndex: 10,
  },
});
