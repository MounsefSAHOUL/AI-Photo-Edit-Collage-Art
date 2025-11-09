import {Colors} from '@/constants/theme';
import useImageManipationHooks from '@/hooks/expoImage/imageManip';
import {useAppTheme} from '@/hooks/useAppTheme';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {useToast} from '@/hooks/useToast';
import {i18n} from '@/i18n/i18n';
import {useImageStore} from '@/stores/imagesStore';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {LinearGradient} from 'expo-linear-gradient';
import {router, useGlobalSearchParams} from 'expo-router';
import React, {useCallback, useMemo, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
// Removed AnimatedTouchable as it is unused.

const Edit = () => {
  const {featureId} = useGlobalSearchParams(); // featureId?: string
  console.log('Feature ID:', featureId);
  const {isDark} = useAppTheme();
  const {fonts, locale} = useLocaleAppearance();
  const {show} = useToast();
  const {cropWithPicker} = useImageManipationHooks();
  const {addImage, setImage, img, allImages} = useImageStore();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Animation values
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const palette = useMemo(
    () => (isDark ? Colors.dark : Colors.light),
    [isDark],
  );

  const handleImagePicker = useCallback(async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      show({message: i18n.t('collage.save_permission_denied'), type: 'error'});
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      show({message: 'Image chargée', type: 'success'});
      const res = await cropWithPicker(result.assets[0].uri);

      if (res) {
        // Build image object from component/context values
        const imageName = featureId
          ? i18n.t(`home.${featureId}`, {locale})
          : 'Edited image';
        const newImage = {
          name: imageName,
          type: 'free',
          uri: res,
          createdAt: new Date().toISOString(),
          favorite: false,
          tags: [],
        };

        // Store the current image and append to the allImages array
        setImage(newImage as any);
        addImage?.(newImage as any);
        show({message: 'Image ajoutée', type: 'success'});
      }

      console.log('All images, img', img, allImages);
      console.log('Cropped image URI:', res);
    }
  }, [show, cropWithPicker, addImage, setImage, featureId, locale]);

  // tool panels and mode switching removed to simplify the editor

  const handleReset = useCallback(() => {
    scale.value = withSpring(1);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    show({message: 'Réinitialisé', type: 'success'});
  }, [scale, translateX, translateY, show]);

  const handleSave = useCallback(() => {
    if (!selectedImage) return;
    show({message: 'Image sauvegardée', type: 'success'});
  }, [selectedImage, show]);

  // Style animé pour l'image
  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {translateX: translateX.value},
      {translateY: translateY.value},
    ],
  }));

  // tool panel animation removed (no tool panel in simplified editor)

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#0D0F1A', '#1A1F3B'] : ['#F8F9FA', '#E9ECEF']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={palette.text} />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {color: palette.text, fontFamily: fonts.heading},
          ]}>
          {i18n.t(`home.${featureId}`, {locale})}
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerButton, {marginRight: 8}]}
            onPress={handleReset}>
            <Ionicons name="refresh" size={20} color={palette.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, {backgroundColor: palette.tint}]}
            onPress={handleSave}>
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Zone d'image */}
      <View style={styles.imageContainer}>
        {selectedImage ? (
          <Animated.View style={styles.imageWrapper}>
            <Animated.View style={imageStyle}>
              <Image
                source={{uri: selectedImage}}
                style={[styles.editImage, {opacity: 1}]}
                resizeMode="contain"
              />
              {/* (filters removed in simplified editor) */}
            </Animated.View>
          </Animated.View>
        ) : (
          <TouchableOpacity
            style={[
              styles.placeholderContainer,
              {borderColor: palette.tint + '40'},
            ]}
            onPress={handleImagePicker}>
            <Ionicons name="image" size={48} color={palette.tint} />
            <Text
              style={[
                styles.placeholderText,
                {color: palette.text, fontFamily: fonts.body},
              ]}>
              {i18n.t('actions.select', {locale})}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {fontSize: 18},
  headerActions: {flexDirection: 'row', alignItems: 'center'},
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImage: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT * 0.5,
    borderRadius: 12,
  },
  placeholderContainer: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT * 0.4,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {fontSize: 16},
});

export default Edit;
