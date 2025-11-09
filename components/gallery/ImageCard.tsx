import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {formatDate} from '@/lib/utils';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import React, {useMemo} from 'react';
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
  withTiming,
} from 'react-native-reanimated';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const ITEM_SIZE = (SCREEN_WIDTH - 60) / 2;
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Composant ImageCard
const ImageCard = ({
  image,
  index,
  isGridView,
  onPress,
  onToggleFavorite,
  palette,
  fonts,
}: any) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, {duration: 300 + index * 100});
  }, [index, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, {damping: 15, stiffness: 400});
    scale.value = withSpring(1, {damping: 15, stiffness: 300});
    onPress();
  };

  const cardWidth = isGridView ? ITEM_SIZE : SCREEN_WIDTH - 40;
  const cardHeight = isGridView ? ITEM_SIZE : 120;

  const {locale} = useLocaleAppearance();

  const formattedDate = useMemo(
    () => formatDate(image.createdAt, locale),
    [image.createdAt, locale],
  );

  return (
    <AnimatedTouchable
      style={[
        styles.imageCard,
        animatedStyle,
        {
          width: cardWidth,
          height: cardHeight,
          marginRight: isGridView ? (index % 2 === 0 ? 20 : 0) : 0,
        },
      ]}
      onPress={handlePress}>
      <Image source={{uri: image.uri}} style={styles.cardImage} />

      {/* Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.cardOverlay}>
        {/* Premium Badge */}
        {image.type === 'premium' && (
          <View style={styles.premiumBadge}>
            <Ionicons name="diamond" size={12} color="#FFD700" />
          </View>
        )}

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={e => {
            e.stopPropagation();
            onToggleFavorite();
          }}>
          <Ionicons
            name={image.favorite ? 'heart' : 'heart-outline'}
            size={16}
            color={image.favorite ? '#FF3C7E' : '#FFFFFF'}
          />
        </TouchableOpacity>

        {/* Title */}
        <Text
          style={[styles.cardTitle, {fontFamily: fonts.body}]}
          numberOfLines={1}>
          {image.title}
        </Text>

        {/* Date */}
        <Text style={[styles.cardDate, {fontFamily: fonts.body}]}>
          {' '}
          {formattedDate}{' '}
        </Text>
      </LinearGradient>
    </AnimatedTouchable>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  imageCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 4,
  },
  cardDate: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
});
