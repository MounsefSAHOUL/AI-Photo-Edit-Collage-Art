import BackgroundCarousel from '@/components/BackgroundCarousel';
import DisclaimerView from '@/components/disclaimerView';
import GateButton from '@/components/ui/GateButton';
import Select from '@/components/ui/Select';
import {languageMeta} from '@/constants/keys';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {useToast} from '@/hooks/useToast';
import {i18n} from '@/i18n/i18n';
import {supportedLanguages} from '@/i18n/locales';
import {useUser} from '@/stores/userStore';
import type {languageType, Option} from '@/types/global';
import {Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import React, {useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import Animated, {
  FadeInUp,
  FadeOutDown,
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);
const AnimatedView = Animated.createAnimatedComponent(View);

const OnBoarding = () => {
  const {locale, setLocale, fonts, textAlign, writingDirection} =
    useLocaleAppearance();
  const {setUser} = useUser();
  const toast = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<languageType>(
    locale as languageType,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const trimmedName = name.trim();

  const languageOptions = useMemo<Option<languageType>[]>(
    () =>
      supportedLanguages.map(lng => ({
        value: lng,
        label: languageMeta[lng]?.label ?? lng.toUpperCase(),
        flag: languageMeta[lng]?.flag ?? '🏳️',
      })),
    [],
  );

  const handleLanguageChange = async (lang: languageType) => {
    if (lang === selectedLanguage) {
      return;
    }
    setSelectedLanguage(lang);
    try {
      await setLocale(lang);
    } catch (error) {
      console.warn('Failed to switch locale', error);
    }
  };

  const keyboard = useAnimatedKeyboard();
  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: -keyboard.height.value}],
    };
  });

  const handleContinue = () => {
    if (!trimmedName) {
      toast.show({
        type: 'info',
        message: i18n.t('messages.onboardingNamePlaceholder', {locale}),
      });
      return;
    }
    setStep(2);
  };

  const handleConfirm = async () => {
    if (isSubmitting) {
      return;
    }
    try {
      setIsSubmitting(true);
      setUser({displayName: trimmedName, lang: selectedLanguage});
      await setLocale(selectedLanguage);
      router.replace('/(tabs)');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackgroundCarousel />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <Animated.View style={translateStyle}>
          <AnimatedView
            key={step}
            entering={FadeInUp.duration(420)}
            exiting={FadeOutDown.duration(320)}
            style={[styles.card]}>
            {step === 1 ? (
              <View style={styles.stepContainer}>
                <Text
                  style={[
                    styles.title,
                    {
                      fontFamily: fonts.heading,
                      writingDirection,
                      textAlign,
                    },
                  ]}>
                  {i18n.t('messages.onboardingNameTitle', {locale})}
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                    placeholder={i18n.t('messages.onboardingNamePlaceholder', {
                      locale,
                    })}
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    style={[
                      styles.input,
                      {
                        fontFamily: fonts.body,
                        textAlign,
                        writingDirection,
                      },
                    ]}
                  />
                  {isInputFocused ? (
                    <AnimatedIcon
                      entering={FadeInUp.duration(220)}
                      exiting={FadeOutDown.duration(180)}
                      name="sparkles-sharp"
                      size={21}
                      color="#C084FC"
                      style={[
                        styles.inputIcon,
                        writingDirection === 'rtl' ? {left: 18} : {right: 18},
                      ]}
                    />
                  ) : null}
                </View>

                <GateButton
                  label={i18n.t('actions.continue', {locale})}
                  onPress={handleContinue}
                  disabled={!trimmedName}
                  style={styles.gateButtonSpacing}
                />
              </View>
            ) : (
              <View style={styles.stepContainer}>
                <Text
                  style={[
                    styles.title,
                    {fontFamily: fonts.heading, textAlign, writingDirection},
                  ]}>
                  {i18n.t('messages.onboardingLanguageTitle', {locale})}
                </Text>

                <View style={styles.languageSelect}>
                  <Select<languageType>
                    value={selectedLanguage}
                    options={languageOptions}
                    onChange={lang => void handleLanguageChange(lang)}
                    tone="gate"
                  />
                </View>

                <GateButton
                  label={i18n.t('actions.confirmAndStart', {locale})}
                  onPress={handleConfirm}
                  disabled={isSubmitting}
                  variant="success"
                  style={styles.gateButtonSpacing}
                />
              </View>
            )}
          </AnimatedView>
        </Animated.View>
      </ScrollView>
      <DisclaimerView />
    </SafeAreaView>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#090713', position: 'relative'},
  flex: {flex: 1},
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 160,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(18, 16, 32, 0.8)',
    borderRadius: 24,
    padding: 24,
    gap: 24,
    shadowColor: '#120E2D',
    shadowOffset: {width: 0, height: 18},
  },
  stepContainer: {gap: 20},
  title: {
    fontSize: 28,
    lineHeight: 34,
    color: '#FFFFFF',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 22,
    fontSize: 18,
    color: '#FFFFFF',
    backgroundColor: 'rgba(31, 9, 70, 0.78)',
    borderWidth: 2,
    borderColor: 'rgba(167, 139, 250, 0.95)',
    textShadowColor: 'rgba(192, 132, 252, 0.65)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 14,
  },
  gateButtonSpacing: {
    marginTop: 8,
  },
  inputIcon: {
    position: 'absolute',
    transform: [{translateY: -16}],
    pointerEvents: 'none',
  },
  languageSelect: {marginTop: 16, alignSelf: 'stretch'},
});
