import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {i18n} from '@/i18n/i18n';

const History = () => {
  const {locale, fonts, textAlign, writingDirection} = useLocaleAppearance();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          {fontFamily: fonts.heading, textAlign, writingDirection},
        ]}>
        {i18n.t('screens.history', {locale})}
      </Text>
      <Text
        style={[
          styles.body,
          {fontFamily: fonts.body, textAlign, writingDirection},
        ]}>
        {i18n.t('messages.onboardingLead', {locale})}
      </Text>
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {fontSize: 24},
  body: {fontSize: 16},
});
