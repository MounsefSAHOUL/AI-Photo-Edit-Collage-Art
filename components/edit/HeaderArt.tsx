import * as Asset from 'expo-asset';
import {LinearGradient} from 'expo-linear-gradient';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';

const ITEM_WIDTH = 112; // thumb (112) + marginRight (18)
const THUMB_SIZE = 112;

// Extraire les tableaux d'images en dehors du composant pour éviter recréation à chaque render
const imagesRight = [
  require('../../assets/images/diapo/image-1.jpg'),
  require('../../assets/images/diapo/image-2.jpg'),
  require('../../assets/images/diapo/image-3.jpg'),
  require('../../assets/images/diapo/image-4.jpg'),
  require('../../assets/images/diapo/image-5.jpg'),
];

const imagesMid = [
  require('../../assets/images/diapo/image-6.jpg'),
  require('../../assets/images/diapo/image-7.jpg'),
  require('../../assets/images/diapo/image-8.jpg'),
  require('../../assets/images/diapo/image-9.jpg'),
  require('../../assets/images/diapo/image-10.jpg'),
  require('../../assets/images/diapo/image-11.jpg'),
];

const imagesLeft = [
  require('../../assets/images/diapo/image-12.jpg'),
  require('../../assets/images/diapo/image-13.jpg'),
  require('../../assets/images/diapo/image-14.jpg'),
  require('../../assets/images/diapo/image-15.jpg'),
  require('../../assets/images/diapo/image-16.jpg'),
];

export default function CyberpunkHeader() {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Précharger les images au montage pour éviter jank au scroll
  useEffect(() => {
    const preloadImages = async () => {
      try {
        const allImages = [...imagesRight, ...imagesMid, ...imagesLeft];
        await Asset.Asset.loadAsync(allImages);
        setImagesLoaded(true);
      } catch (error) {
        console.warn('Image preload failed:', error);
        setImagesLoaded(true); // continuer même si preload échoue
      }
    };
    preloadImages();
  }, []);

  const renderItem = useCallback(({item, index}: ListRenderItemInfo<any>) => {
    // Effet de rotation alternée pour créer dynamisme visuel
    const rotate = index % 2 === 0 ? '-2deg' : '2deg';

    return (
      <View style={styles.itemContainer}>
        <LinearGradient
          colors={['#ff006e', '#8338ec', '#3a86ff']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradientBorder}>
          <View style={[styles.imageWrapper, {transform: [{rotate}]}]}>
            <Image source={item} style={styles.thumb} />
          </View>
        </LinearGradient>
        {/* Glow effect overlay */}
        <View style={styles.glowOverlay} />
      </View>
    );
  }, []);

  const renderRow = useCallback(
    (data: any[], rowId: string, reverse?: boolean) => (
      <FlatList
        data={data}
        horizontal
        inverted={reverse}
        keyExtractor={(_, index) => `${rowId}-${index}`}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={6}
        windowSize={4}
        removeClippedSubviews={true}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        contentContainerStyle={styles.rowContent}
      />
    ),
    [renderItem],
  );

  if (!imagesLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {/* Ligne supérieure: scroll vers la droite */}
      {renderRow(imagesRight, 'right', false)}

      {/* Ligne centrale: scroll vers la gauche (inverted) */}
      <View style={styles.midRow}>{renderRow(imagesMid, 'mid', true)}</View>

      {/* Ligne inférieure: scroll vers la droite */}
      {renderRow(imagesLeft, 'left', false)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
    // minHeight: 450,
  },
  rowContent: {
    //paddingHorizontal: 2,
    //paddingVertical: 0,
  },
  midRow: {
    marginVertical: 2,
  },
  itemContainer: {
    marginRight: 2,
    position: 'relative',
  },
  gradientBorder: {
    padding: 3,
    borderRadius: 14,
    shadowColor: '#8338ec',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  imageWrapper: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#111',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    //  backgroundColor: 'rgba(131, 56, 236, 0.15)',
    borderRadius: 14,
    pointerEvents: 'none',
  },
});
