import ModelCard from '@/components/aiGenerator/ModelCard';
import {LocaleFonts} from '@/types/global';
import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Model = {
  id: string;
  name: string;
  description?: string;
  theme?: string;
  icon?: string;
  premium?: boolean;
};

type Props = {
  models: Model[];
  selectedModel: string | null;
  onSelectModel: (id: string) => void;
  selectedImage: string | null;
  onChangeImage: () => void;
  palette: any;
  fonts: LocaleFonts;
  userMembership: string | undefined;
};

export default function ModelChooser({
  models,
  selectedModel,
  onSelectModel,
  selectedImage,
  onChangeImage,
  palette,
  fonts,
  userMembership,
}: Props) {
  // create rows of 2 to match PremiumModels grid
  const rows: any[][] = [];
  for (let i = 0; i < models.length; i += 2) {
    rows.push(models.slice(i, i + 2));
  }

  return (
    <View style={styles.step}>
      <View style={styles.imagePreview}>
        {selectedImage && (
          <Image source={{uri: selectedImage}} style={styles.previewImage} />
        )}
        <TouchableOpacity
          style={styles.changeImageButton}
          onPress={onChangeImage}>
          {/* small icon */}
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.stepTitle,
          {color: palette.text, fontFamily: fonts.heading},
        ]}>
        Choisissez votre style IA
      </Text>

      <View style={styles.gridContainer}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.gridRow}>
            {row.map(model => (
              <View key={model.id} style={styles.gridColumn}>
                <View style={styles.cardWrapper}>
                  {model.image ? (
                    <TouchableOpacity
                      onPress={() => onSelectModel(model.id)}
                      activeOpacity={0.85}
                      style={styles.cardWrapper}
                      accessibilityRole="button"
                      accessibilityLabel={model.name}>
                      {
                        // compute gradient colors fallback
                      }
                      {(() => {
                        const gradientColors = Array.isArray(
                          (model as any).gradient,
                        )
                          ? (model as any).gradient
                          : Array.isArray((model as any).color)
                          ? (model as any).color
                          : ['#6366f1', '#8b5cf6'];

                        return (
                          <LinearGradient
                            colors={gradientColors as any}
                            style={styles.gradientBorder}>
                            <View
                              style={[
                                styles.imageContainer,
                                {backgroundColor: palette.background},
                              ]}>
                              {/* image or loader */}
                              {model.image ? (
                                <Image
                                  source={model.image}
                                  style={styles.modelImage}
                                />
                              ) : (
                                <View style={styles.placeholderContainer}>
                                  <ActivityIndicator
                                    size="small"
                                    color={palette.tint}
                                  />
                                </View>
                              )}

                              <LinearGradient
                                colors={
                                  [...gradientColors, gradientColors[0]] as any
                                }
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 0}}
                                style={styles.titleOverlay}>
                                <Text
                                  numberOfLines={2}
                                  ellipsizeMode="tail"
                                  style={[
                                    styles.modelTitle,
                                    {fontFamily: fonts.body},
                                  ]}>
                                  {typeof model.name === 'string'
                                    ? model.name
                                    : model.name?.en || model.id}
                                </Text>
                              </LinearGradient>
                            </View>
                          </LinearGradient>
                        );
                      })()}
                    </TouchableOpacity>
                  ) : (
                    <ModelCard
                      model={model}
                      isSelected={selectedModel === model.id}
                      onPress={() => onSelectModel(model.id)}
                      palette={palette}
                      fonts={fonts}
                      userMembership={userMembership}
                    />
                  )}
                </View>
              </View>
            ))}
            {row.length === 1 && <View style={styles.gridColumn} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  step: {paddingBottom: 40},
  imagePreview: {position: 'relative', alignSelf: 'center', marginBottom: 24},
  previewImage: {width: 120, height: 120, borderRadius: 12},
  changeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  gridContainer: {gap: 12},
  gridRow: {flexDirection: 'row', gap: 12, marginBottom: 12},
  gridColumn: {flex: 1},
  cardWrapper: {width: '100%', aspectRatio: 1},
  gradientBorder: {flex: 1, padding: 3, borderRadius: 12},
  imageContainer: {flex: 1, borderRadius: 10, overflow: 'hidden'},
  modelImage: {width: '100%', height: '100%'},
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
});
