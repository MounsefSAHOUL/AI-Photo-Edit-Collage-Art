import {Colors} from '@/constants/theme';
import {i18n} from '@/i18n/i18n';
import {LocaleFonts} from '@/types/global';
import {FontAwesome6, Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import React, {memo, useMemo} from 'react';
import {
  //  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

//const {width: SCREEN_WIDTH} = Dimensions.get('window');

type Props = {
  onPressFeature: (key: string) => void;
  fonts: LocaleFonts;
  textAlign: 'left' | 'right';
  isRTL: boolean;
  locale: string;
  isDark: boolean;
  limit?: number;
};

function Features({
  onPressFeature,
  textAlign,
  fonts,
  locale,
  isDark,
  isRTL,
  limit = 4,
}: Props) {
  const FREE_FEATURES = useMemo(
    () => [
      {id: 'collage', icon: 'images', key: 'collage'},
      {id: 'retouch', icon: 'brush', key: 'retouch'},
      {id: 'scale', icon: 'resize', key: 'scale'},
      {id: 'crop', icon: 'crop', key: 'crop'},
      {id: 'filters', icon: 'color-filter', key: 'filters'},
      {id: 'rotate', icon: 'reload', key: 'rotate'},
      {id: 'flip', icon: 'swap-horizontal', key: 'flip'},
      {id: 'brightness', icon: 'sunny', key: 'brightness'},
      {id: 'contrast', icon: 'contrast', key: 'contrast'},
      {id: 'saturation', icon: 'color-palette', key: 'saturation'},
      {id: 'sharpen', icon: 'sparkles', key: 'sharpen'},
      {id: 'removeBg', icon: 'cut', key: 'removeBackground'},
      {id: 'stickers', icon: 'heart', key: 'stickers'},
      {id: 'text', icon: 'text', key: 'text'},
      {id: 'frames', icon: 'layers', key: 'frames'},
    ],
    [],
  );

  const handleSeeMore = () => {
    // push route with query param modelId
    router.push('/(tabs)/edit');
  };

  const ColorsFromTheme = useMemo(
    () => (isDark ? Colors.dark : Colors.light),
    [isDark],
  );

  return (
    <View style={styles.section}>
      <View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          gap: 12,
          marginTop: 16,
          marginBottom: 9,
          marginVertical: 8,
        }}>
        <FontAwesome6
          name="free-code-camp"
          size={24}
          color={ColorsFromTheme.tint}
        />
        <Text
          style={[
            styles.sectionTitle,
            {
              color: ColorsFromTheme.text,
              fontFamily: fonts.heading,
              textAlign,
            },
          ]}>
          {i18n.t('home.freeFeatures', {locale})}
        </Text>
      </View>

      <View
        style={[
          styles.featuresGrid,
          {flexDirection: isRTL ? 'row-reverse' : 'row'},
        ]}>
        {FREE_FEATURES.slice(0, limit).map(feature => (
          <View key={feature.id} style={styles.featureCard}>
            <TouchableOpacity
              style={[
                styles.featureCardBtn,
                {
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                },
              ]}
              onPress={() => onPressFeature(feature.key)}>
              <View
                style={[
                  styles.featureIcon,
                  {
                    backgroundColor: ColorsFromTheme.tint,
                    borderWidth: 2,
                    borderColor: ColorsFromTheme.tabIconDefault,
                  },
                ]}>
                <Ionicons
                  name={feature.icon as any}
                  size={24}
                  color={isDark ? '#ffffff' : '#FFFFFF'}
                />
              </View>
              <Text
                style={[
                  styles.featureTitle,
                  {
                    color: isDark ? '#e2e8f0' : '#334155',
                    fontFamily: fonts.body,
                  },
                ]}>
                {i18n.t(`home.${feature.key}`, {locale})}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {limit < 16 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleSeeMore}
            style={[
              styles.seeMoreButton,
              {
                backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
                borderColor: isDark ? '#334155' : '#e2e8f0',
              },
            ]}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.seeMoreText,
                {
                  color: isDark ? '#e2e8f0' : '#475569',
                  fontFamily: fonts.body,
                },
              ]}>
              {i18n.t('home.seeMoreModels', {locale})}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={isDark ? '#e2e8f0' : '#475569'}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default memo(Features);

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 12,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 21,
    marginBottom: 16,
  },
  featuresGrid: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureCard: {
    width: '50%',
  },
  featureCardBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#373737',
    elevation: 12,
    margin: 8,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  seeMoreText: {
    fontSize: 15,
  },
});
