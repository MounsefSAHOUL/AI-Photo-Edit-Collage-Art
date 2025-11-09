import React, {memo, useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// Ionicons removed — not used in this header
import {Colors} from '@/constants/theme';
import {i18n} from '@/i18n/i18n';
import {languageType, LocaleFonts} from '@/types/global';
import {User} from '@/types/user';
import {AntDesign} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {router} from 'expo-router';
import Animated, {SlideInRight, SlideOutLeft} from 'react-native-reanimated';

type Props = {
  fonts: LocaleFonts;
  locale: languageType;
  user: User;
  textAlign: 'left' | 'right';
  isDark: boolean;
};

function Header({fonts, locale, user, textAlign, isDark}: Props) {
  const ColorsFromTheme = useMemo(
    () => (isDark ? Colors.dark : Colors.light),
    [isDark],
  );

  return (
    <View style={styles.header}>
      <View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/(modal)/buyPoints')}
          style={styles.userInfo}>
          <Animated.Text
            entering={SlideInRight}
            exiting={SlideOutLeft}
            style={[
              styles.membershipText,
              {
                color: ColorsFromTheme.tint,
                fontFamily: fonts.accent,
                textAlign,
              },
            ]}>
            {i18n.t('home.buyPoints', {locale})}
          </Animated.Text>
          <Animated.View
            entering={SlideInRight}
            exiting={SlideOutLeft}
            style={styles.membershipBadge}>
            <LinearGradient
              colors={['rgba(92,108,255,0.4)', 'rgba(192,132,252,0.4)']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={[StyleSheet.absoluteFillObject, {borderRadius: 20}]}
              dither={false}
            />
            <Text
              style={[
                styles.pointsText,
                {
                  color: ColorsFromTheme.tint,
                  fontFamily: fonts.accent,
                },
              ]}>
              {user.points || 0}
            </Text>

            <View style={styles.iconWrapper}>
              <View style={styles.iconShadow}>
                <AntDesign name="star" size={17} color="#FFD700" />
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
        <Animated.Text
          entering={SlideInRight}
          exiting={SlideOutLeft}
          style={[
            styles.welcomeText,
            {
              color: ColorsFromTheme.text,
              fontFamily: fonts.heading,
              textAlign,
            },
          ]}>
          {i18n.t('home.welcome', {locale})}
        </Animated.Text>
        <Animated.Text
          entering={SlideInRight}
          exiting={SlideOutLeft}
          style={[
            styles.subtitleText,
            {
              color: ColorsFromTheme.text,
              fontFamily: fonts.body,
              textAlign,
            },
          ]}>
          {i18n.t('home.subtitle', {locale})}
        </Animated.Text>
      </View>
    </View>
  );
}

export default memo(Header);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    marginTop: 16,
  },
  subtitleText: {
    fontSize: 19,
    marginTop: 9,
  },
  userInfo: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  pointsText: {
    fontSize: 13,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  membershipText: {
    fontSize: 12,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconShadow: {
    shadowColor: '#000',
    elevation: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 0,
  },
});
