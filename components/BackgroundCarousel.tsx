import {BackgroundCarouselProps, CarouselImageProps} from '@/types/global';
import React, {useEffect, useMemo} from 'react';
import {
  Image,
  StyleSheet,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const DEFAULT_IMAGES: ImageSourcePropType[] = [
  require('../assets/images/onboard-image-1.jpg'),
  require('../assets/images/onboard-image-9.jpg'),
  require('../assets/images/onboard-image-12.jpg'),
  require('../assets/images/onboard-image-13.jpg'),
  require('../assets/images/onboard-image-8.jpg'),
  require('../assets/images/onboard-image-final.jpg'),
];

const CAROUSEL_INTERVAL = 5200;
const TRANSITION_DURATION = 1200;
const DRIFT_DISTANCE = 32;

const BackgroundCarousel = ({
  images = DEFAULT_IMAGES,
  interval = CAROUSEL_INTERVAL,
  transitionDuration = TRANSITION_DURATION,
  driftDistance = DRIFT_DISTANCE,
}: BackgroundCarouselProps) => {
  const sources = useMemo(
    () => (images.length ? images : DEFAULT_IMAGES),
    [images],
  );
  const totalImages = sources.length;
  const {width, height} = useWindowDimensions();
  const overscanX = driftDistance * 4 + 48;
  const overscanY = driftDistance * 2 + 90;
  const stageWidth = width + overscanX;
  const stageHeight = height + overscanY;

  const currentIndex = useSharedValue(0);
  const previousIndex = useSharedValue(totalImages - 1);
  const transition = useSharedValue(1);
  const drift = useSharedValue(0);

  useEffect(() => {
    if (!totalImages) {
      return;
    }

    currentIndex.value = 0;
    previousIndex.value = totalImages - 1;
    transition.value = 1;

    drift.value = withRepeat(
      withSequence(
        withTiming(-driftDistance, {
          duration: 6000,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(driftDistance, {
          duration: 6000,
          easing: Easing.inOut(Easing.quad),
        }),
      ),
      -1,
      true,
    );

    const cycle = setInterval(() => {
      transition.value = 0;
      previousIndex.value = currentIndex.value;
      currentIndex.value = (currentIndex.value + 1) % totalImages;
      transition.value = withTiming(1, {
        duration: transitionDuration,
        easing: Easing.out(Easing.cubic),
      });
    }, interval);

    return () => {
      clearInterval(cycle);
      cancelAnimation(drift);
      cancelAnimation(transition);
    };
  }, [
    currentIndex,
    drift,
    driftDistance,
    interval,
    previousIndex,
    totalImages,
    transition,
    transitionDuration,
  ]);

  if (!totalImages) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.container}>
      {sources.map((source, index) => (
        <CarouselImage
          key={index}
          source={source}
          index={index}
          width={stageWidth}
          height={stageHeight}
          viewportWidth={width}
          viewportHeight={height}
          currentIndex={currentIndex}
          previousIndex={previousIndex}
          transition={transition}
          drift={drift}
        />
      ))}
    </View>
  );
};

export default BackgroundCarousel;

const CarouselImage = ({
  source,
  index,
  width,
  height,
  viewportWidth,
  viewportHeight,
  currentIndex,
  previousIndex,
  transition,
  drift,
}: CarouselImageProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    if (index === currentIndex.value) {
      return {
        opacity: transition.value,
        transform: [
          {translateX: drift.value},
          {translateY: drift.value * 0.12},
          {scale: interpolate(transition.value, [0, 1], [1.06, 1])},
        ],
      };
    }

    if (index === previousIndex.value) {
      return {
        opacity: 1 - transition.value,
        transform: [
          {translateX: drift.value * 0.55},
          {translateY: drift.value * -0.1},
          {scale: interpolate(transition.value, [0, 1], [1, 1.03])},
        ],
      };
    }

    return {opacity: 0};
  });

  return (
    <AnimatedImage
      source={source}
      resizeMode="cover"
      style={[
        styles.image,
        {
          width,
          height,
          top: -(height - viewportHeight) / 2,
          left: -(width - viewportWidth) / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    position: 'absolute',
    opacity: 0,
    bottom: 0,
  },
});
