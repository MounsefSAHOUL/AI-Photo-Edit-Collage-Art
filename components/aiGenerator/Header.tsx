import {i18n} from '@/i18n/i18n';
import {LocaleFonts} from '@/types/global';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type Props = {
  rowDirection: 'row' | 'row-reverse';
  fonts: LocaleFonts;
  palette: any;
  points: number;
};

export default function AGHeader({fonts, palette, points}: Props) {
  return (
    <View style={styles.header}>
      <View>
        <Text
          style={[
            styles.headerTitle,
            {color: palette.text, fontFamily: fonts.heading},
          ]}>
          {i18n.t('aiGenerator.title')}
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            {color: palette.text + '80', fontFamily: fonts.body},
          ]}>
          {i18n.t('aiGenerator.subtitle')}
        </Text>
      </View>

      <View style={styles.userInfo}>
        <Text
          style={[
            styles.pointsText,
            {color: palette.tint, fontFamily: fonts.accent},
          ]}>
          {points || 0} {i18n.t('profile.points')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {fontSize: 24},
  headerSubtitle: {fontSize: 14, marginTop: 4},
  userInfo: {alignItems: 'flex-end'},
  pointsText: {fontSize: 16},
});
