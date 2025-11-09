import FuturisticBackgroundInner from '@/components/ui/FuturisticBackground';
import {BlurView} from 'expo-blur';
import React, {useCallback, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';

import EmptyGallery from '@/components/gallery/EmptyGallery';
import FilterChip from '@/components/gallery/FilterChip';
import HeaderGallery from '@/components/gallery/HeaderGallery';
import ImageCard from '@/components/gallery/ImageCard';
import ImageDetailModal from '@/components/gallery/ImageDetailModal';
import RechercheGallery from '@/components/gallery/RechercheGallery';
import {Colors} from '@/constants/theme';
import {useAppTheme} from '@/hooks/useAppTheme';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {useToast} from '@/hooks/useToast';
import {i18n} from '@/i18n/i18n';
import {useImageStore} from '@/stores/imagesStore';
import {ImageItem} from '@/types/user';

// Filtres disponibles (labels traduit dans le rendu)
const FILTER_OPTIONS = [
  {key: 'all', icon: 'apps'},
  {key: 'free', icon: 'heart'},
  {key: 'premium', icon: 'diamond'},
  {key: 'favorites', icon: 'star'},
  {key: 'recent', icon: 'time'},
];

export default function Gallery() {
  const {isDark} = useAppTheme();
  const {fonts, locale, rowDirection, isRTL} = useLocaleAppearance();
  const {show} = useToast();
  const {allImages, toggleFavorite, deleteImage} = useImageStore();

  console.log('All images, img', allImages);

  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isGridView, setIsGridView] = useState(true);

  const palette = useMemo(
    () => (isDark ? Colors.dark : Colors.light),
    [isDark],
  );

  const FuturisticBackgroundInnerProps = useMemo(
    () => ({
      BorderFrameLeft: false,
      BorderFrameRight: false,
    }),
    [],
  );

  // Images filtrées
  const filteredImages = useMemo(() => {
    let filtered = allImages;

    // Filtre par type
    if (selectedFilter === 'free') {
      filtered = filtered.filter(img => img.type === 'free');
    } else if (selectedFilter === 'premium') {
      filtered = filtered.filter(img => img.type === 'premium');
    } else if (selectedFilter === 'favorites') {
      filtered = filtered.filter(img => img.favorite);
    } else if (selectedFilter === 'recent') {
      // avoid mutating original array and handle createdAt as string or Date
      const getTime = (d: Date | string | undefined) => {
        if (!d) return 0;
        if (typeof d === 'string') return new Date(d).getTime();
        return (d as Date).getTime ? (d as Date).getTime() : 0;
      };

      filtered = [...filtered].sort(
        (a, b) => getTime(b.createdAt) - getTime(a.createdAt),
      );
    }

    // Filtre par recherche
    if (searchText.trim()) {
      filtered = filtered.filter(
        img =>
          img.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          img.tags?.some(tag =>
            tag.toLowerCase().includes(searchText.toLowerCase()),
          ),
      );
    }

    return filtered;
  }, [selectedFilter, searchText, allImages]);

  const handleImagePress = useCallback((image: ImageItem) => {
    setSelectedImage(image);
    setShowModal(true);
  }, []);

  const handleToggleFavorite = useCallback(
    (imageId: string) => {
      show({
        message: i18n.t(`gallery.favoriteUpdated`, {locale}),
        type: 'success',
      });
      console.log('id image', imageId);
      toggleFavorite(imageId);
      setSelectedImage(prev => {
        if (prev && prev.id === imageId) {
          return {...prev, favorite: !prev.favorite};
        }
        return prev;
      });
    },
    [locale, show, toggleFavorite],
  );

  const handleShareImage = useCallback(
    async (image: ImageItem) => {
      try {
        // Use React Native Share to open the native share sheet
        await Share.share({
          title: image.name,
          message: image.name ? `${image.name}\n${image.uri}` : image.uri,
          url: image.uri,
        });

        show({
          message: i18n.t(`gallery.share`, {title: image.name}),
          type: 'info',
        });
      } catch (e) {
        console.error('Share failed', e);
        show({
          message: i18n.t('errors.shareFailed', {locale}) || 'Partage annulé',
          type: 'error',
        });
      }
    },
    [show, locale],
  );

  const handleDeleteImage = useCallback(
    (image: ImageItem) => {
      Alert.alert(
        i18n.t(`gallery.deleteTitle`, {locale}),
        i18n.t(`gallery.deleteConfirm`, {title: image.name}),
        [
          {text: i18n.t(`actions.cancel`, {locale}), style: 'cancel'},
          {
            text: i18n.t(`actions.delete`, {locale}),
            style: 'destructive',
            onPress: () => {
              deleteImage(image.id as string);

              show({
                message: i18n.t(`gallery.imageDeleted`, {locale}),
                type: 'success',
              });

              setShowModal(false);
            },
          },
        ],
      );
    },
    [deleteImage, locale, show],
  );

  const filtersWithLabels = useMemo(
    () =>
      FILTER_OPTIONS.map(f => ({
        ...f,
        label: i18n.t(`gallery.filters.${f.key}`, {locale}),
      })),
    [locale],
  );

  const imagesLabel = useMemo(() => {
    return filteredImages.length > 1
      ? i18n.t('gallery.images_plural', {locale})
      : i18n.t('gallery.images_singular', {locale});
  }, [filteredImages.length, locale]);

  const headerGalleryProps = useMemo(
    () => ({
      rowDirection,
      palette,
      fonts,
      locale,
      filteredImages,
      imagesLabel,
      isRTL,
      isGridView,
      setIsGridView,
      show,
    }),
    [
      rowDirection,
      palette,
      fonts,
      locale,
      filteredImages,
      imagesLabel,
      isRTL,
      isGridView,
      setIsGridView,
      show,
    ],
  );

  const rechercheGalleryProps = useMemo(
    () => ({
      searchText,
      setSearchText,
      palette,
      fonts,
      locale,
    }),
    [searchText, setSearchText, palette, fonts, locale],
  );

  return (
    <View style={styles.container}>
      <FuturisticBackgroundInner {...FuturisticBackgroundInnerProps} />

      {/* En-tête de la galerie */}
      <HeaderGallery {...headerGalleryProps} />

      {/* Barre de recherche */}
      <RechercheGallery {...rechercheGalleryProps} />

      {/* Filtres */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersSection}
        contentContainerStyle={[
          styles.filtersContent,
          {flexDirection: isRTL ? 'row-reverse' : 'row'},
        ]}>
        {filtersWithLabels.map(filter => (
          <FilterChip
            key={filter.key}
            filter={filter}
            isSelected={selectedFilter === filter.key}
            onPress={() => setSelectedFilter(filter.key)}
            palette={palette}
            fonts={fonts}
            isRTL={isRTL}
          />
        ))}
      </ScrollView>

      {/* Galerie */}
      <FlatList
        data={filteredImages}
        keyExtractor={item => item.id as string}
        numColumns={isGridView ? 2 : 1}
        key={isGridView ? 'grid' : 'list'}
        contentContainerStyle={styles.galleryContent}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <ImageCard
            image={item}
            index={index}
            isGridView={isGridView}
            onPress={() => handleImagePress(item)}
            onToggleFavorite={() => handleToggleFavorite(item.id as string)}
            palette={palette}
            fonts={fonts}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyGallery
            palette={palette}
            fonts={fonts}
            searchText={searchText}
          />
        )}
      />

      {/* Modal Image */}
      <Modal visible={showModal} transparent animationType="fade">
        <BlurView intensity={20} style={StyleSheet.absoluteFillObject}>
          <View style={styles.modalContainer}>
            {selectedImage && (
              <ImageDetailModal
                image={selectedImage}
                onClose={() => setShowModal(false)}
                onShare={() => handleShareImage(selectedImage)}
                onDelete={() => handleDeleteImage(selectedImage)}
                onToggleFavorite={() =>
                  handleToggleFavorite(selectedImage.id as string)
                }
                palette={palette}
                fonts={fonts}
                locale={locale}
              />
            )}
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

// Composant ImageDetailModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  filtersSection: {
    maxHeight: 50,
    marginBottom: 20,
  },
  filtersContent: {
    paddingHorizontal: 20,
    // gap is not supported consistently across RN versions; use chip margins instead
    // gap: 12,
  },
  galleryContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
