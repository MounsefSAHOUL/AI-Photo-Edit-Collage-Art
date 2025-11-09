import {Colors} from '@/constants/theme';
import {i18n} from '@/i18n/i18n';
import {MODELS} from '@/i18n/models';
import {LocaleFonts} from '@/types/global';
import {Ionicons} from '@expo/vector-icons';
import {Asset} from 'expo-asset';
import {LinearGradient} from 'expo-linear-gradient';
import {router} from 'expo-router';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

type Props = {
  fonts: LocaleFonts;
  textAlign: 'left' | 'right';
  isRTL: boolean;
  locale: string;
  isDark: boolean;
  onSelectModel?: (id: string) => void;
  numberOfModelsToShow?: number;
};

type ModelCardProps = {
  model: any;
  gradientColors: string[];
  fonts: LocaleFonts;
  locale: string;
  textAlign: 'left' | 'right';
  isDark: boolean;
  isImageLoaded: boolean;
  onSelectModel?: (id: string) => void;
};

const ModelCard = memo<ModelCardProps>(
  ({
    model,
    gradientColors,
    fonts,
    locale,
    textAlign,
    isDark,
    isImageLoaded,
    onSelectModel,
  }) => {
    const modelName = useMemo(() => {
      return model.name
        ? model.name[locale] || model.name.en
        : i18n.t(`home.${model.id}`, {locale});
    }, [model.name, model.id, locale]);

    const titleStyle = useMemo(
      () => [
        styles.modelTitle,
        {fontFamily: fonts.body, textAlign, color: '#ffffff'},
      ],
      [fonts.body, textAlign],
    );

    const handlePress = () => {
      if (typeof onSelectModel === 'function') {
        onSelectModel(model.id);
        return;
      }
      // Fallback : navigation vers l'écran AiGenerator avec modelId en query
      router.push('/(modal)/comingSoon');
      // router.push(
      //   `/(tabs)/AiGenerator?modelId=${encodeURIComponent(model.id)}`,
      // );
    };

    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={styles.cardWrapper}
        accessibilityRole="button"
        accessibilityLabel={modelName}>
        <LinearGradient
          colors={gradientColors as any}
          style={styles.gradientBorder}>
          <View
            style={[
              styles.imageContainer,
              {backgroundColor: isDark ? '#0f172a' : '#f8fafc'},
            ]}>
            {isImageLoaded ? (
              <Image source={model.image} style={styles.modelImage} />
            ) : (
              <View style={styles.placeholderContainer}>
                <ActivityIndicator
                  size="small"
                  color={isDark ? '#64748b' : '#94a3b8'}
                />
              </View>
            )}

            <LinearGradient
              colors={[...gradientColors, gradientColors[0]] as any}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.titleOverlay}>
              <Text numberOfLines={2} ellipsizeMode="tail" style={titleStyle}>
                {modelName}
              </Text>
            </LinearGradient>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  },
);
ModelCard.displayName = 'ModelCard';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PremiumModels = memo<Props>(
  ({
    fonts,
    locale,
    textAlign,
    isRTL,
    isDark,
    onSelectModel,
    numberOfModelsToShow,
  }) => {
    const ColorsFromTheme = useMemo(
      () => (isDark ? Colors.dark : Colors.default),
      [isDark],
    );
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const DISPLAYED_MODELS = Object.values(MODELS)
      .slice(0, numberOfModelsToShow || 4)
      .map((m: any) => ({
        ...m,
        gradientColors: Array.isArray(m.gradient)
          ? m.gradient
          : Array.isArray(m.color)
          ? m.color
          : ['#6366f1', '#8b5cf6'],
      }));

    useEffect(() => {
      let mounted = true;
      (async () => {
        try {
          const imageAssets = DISPLAYED_MODELS.map(m => m.image).filter(
            Boolean,
          );
          if (imageAssets.length > 0) {
            await Asset.loadAsync(imageAssets as any);
          }
        } catch {
          // Les images se chargeront de manière lazy
        } finally {
          if (mounted) setImagesLoaded(true);
        }
      })();

      return () => {
        mounted = false;
      };
    }, [DISPLAYED_MODELS]);

    const handleSeeMore = () => {
      router.push('/(modal)/comingSoon');
      //router.push('/(tabs)/AiGenerator');
    };

    const renderGrid = useMemo(() => {
      const rows: any[][] = [];
      for (let i = 0; i < DISPLAYED_MODELS.length; i += 2) {
        rows.push(DISPLAYED_MODELS.slice(i, i + 2));
      }

      return rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.gridRow}>
          {row.map(model => (
            <View key={model.id} style={styles.gridColumn}>
              <ModelCard
                model={model}
                gradientColors={model.gradientColors}
                fonts={fonts}
                locale={locale}
                textAlign={textAlign}
                isDark={isDark}
                isImageLoaded={imagesLoaded}
                onSelectModel={onSelectModel}
              />
            </View>
          ))}
          {row.length === 1 && <View style={styles.gridColumn} />}
        </View>
      ));
    }, [
      DISPLAYED_MODELS,
      fonts,
      locale,
      textAlign,
      isDark,
      imagesLoaded,
      onSelectModel,
    ]);

    return (
      <View
        style={[
          styles.section,
          {
            paddingHorizontal:
              numberOfModelsToShow && numberOfModelsToShow < 21 ? 0 : 20,
          },
        ]}>
        <View
          style={[
            styles.header,
            {flexDirection: isRTL ? 'row-reverse' : 'row'},
          ]}>
          <Text
            style={[
              styles.sectionTitle,
              {color: ColorsFromTheme.text, fontFamily: fonts.heading},
            ]}>
            {i18n.t('home.premiumFeatures', {locale})}
          </Text>
          <View style={styles.premiumBadge}>
            <Ionicons name="diamond" size={16} color="#ffffff" />
            <Text style={[styles.badgeText, {fontFamily: fonts.accent}]}>
              {i18n.t('home.premiumBadge', {locale})}
            </Text>
          </View>
        </View>

        <View style={styles.gridContainer}>{renderGrid}</View>

        {numberOfModelsToShow && numberOfModelsToShow < 20 && (
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
  },
);
PremiumModels.displayName = 'PremiumModels';

export default PremiumModels;

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  section: {
    marginTop: 40,
    //paddingHorizontal: 20,
    marginBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 22,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFD700',
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 13,
    color: '#000',
  },
  gridContainer: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  gridColumn: {
    flex: 1,
  },
  cardWrapper: {
    width: '100%',
    aspectRatio: 1,
  },
  gradientBorder: {
    flex: 1,
    padding: 3,
    borderRadius: 12,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  modelImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  titleOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  modelTitle: {
    fontSize: 13,
    textAlign: 'center',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
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
