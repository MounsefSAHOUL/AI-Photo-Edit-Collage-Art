import {i18n} from '@/i18n/i18n';
import {LocaleFonts} from '@/types/global';
import {LinearGradient} from 'expo-linear-gradient';
import React, {memo, useMemo, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = 280;

type sliderProps = {
  fonts: LocaleFonts;
  textAlign: 'left' | 'right';
  isRTL: boolean;
  locale: string;
  isDark: boolean;
};

const SliderCard = memo(function SliderCard({
  item,
  styles,
  fonts,
  textAlign,
}: any) {
  return (
    <View style={styles.sliderCard}>
      <LinearGradient colors={item.gradient} style={styles.sliderGradient}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={[styles.sliderImage, {resizeMode: 'cover'}]}
          />
          <View style={styles.overlay} />
        </View>

        <View style={styles.sliderContent}>
          <Text
            style={[
              styles.sliderTitle,
              {fontFamily: fonts.heading, textAlign: textAlign},
            ]}>
            {item.title}
          </Text>

          <View>
            <LinearGradient
              colors={item.gradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradientMask}
            />
            <Text
              style={[
                styles.sliderSubtitle,
                {fontFamily: fonts.body, textAlign: textAlign},
              ]}>
              {item.subtitle}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
});

function SliderSection({fonts, textAlign, isRTL, locale, isDark}: sliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Données du slider — recalculées quand la locale change
  const SLIDER_DATA = useMemo(
    () => [
      {
        id: 1,
        title: i18n.t('slider.item1.title', {locale}),
        subtitle: i18n.t('slider.item1.subtitle', {locale}),
        image: require('@/assets/images/sliderImage-1.jpg'),
        gradient: ['#f5576c', '#764ba2'],
      },
      {
        id: 2,
        title: i18n.t('slider.item2.title', {locale}),
        subtitle: i18n.t('slider.item2.subtitle', {locale}),
        image: isRTL
          ? require('@/assets/images/sliderImage-2-ar.jpg')
          : require('@/assets/images/sliderImage-2.jpg'),
        gradient: ['#f093fb', '#667eea'],
      },
      {
        id: 3,
        title: i18n.t('slider.item3.title', {locale}),
        subtitle: i18n.t('slider.item3.subtitle', {locale}),
        image: isRTL
          ? require('@/assets/images/sliderImage-3-ar.jpg')
          : require('@/assets/images/sliderImage-3.jpg'),
        gradient: ['#4facfe', '#00f2fe'],
      },
      {
        id: 4,
        title: i18n.t('slider.item4.title', {locale}),
        subtitle: i18n.t('slider.item4.subtitle', {locale}),
        image: isRTL
          ? require('@/assets/images/sliderImage-4-ar.jpg')
          : require('@/assets/images/sliderImage-4.jpg'),
        gradient: ['#f6d365', '#fda085'],
      },
      {
        id: 5,
        title: i18n.t('slider.item5.title', {locale}),
        subtitle: i18n.t('slider.item5.subtitle', {locale}),
        image: require('@/assets/images/sliderImage-5.jpg'),
        gradient: ['#89f7fe', '#66a6ff'],
      },
    ],
    [locale],
  );

  return (
    <View style={styles.sliderSection}>
      <Carousel
        width={SCREEN_WIDTH}
        height={CARD_HEIGHT}
        data={SLIDER_DATA}
        autoPlay={true}
        autoPlayInterval={4000}
        loop={true}
        fixedDirection={isRTL ? 'positive' : 'negative'}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 70,
          parallaxAdjacentItemScale: 0.8,
        }}
        autoPlayReverse={isRTL ? true : false}
        scrollAnimationDuration={800}
        onSnapToItem={index => setCurrentSlide(index)}
        renderItem={({item}) => (
          <SliderCard
            item={item}
            styles={styles}
            fonts={fonts}
            textAlign={textAlign}
            isDark={isDark}
          />
        )}
      />

      <View style={styles.pagination}>
        {SLIDER_DATA.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor:
                  currentSlide === index ? '#667eea' : '#667eea40',
                width: currentSlide === index ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

export default memo(SliderSection);

const styles = StyleSheet.create({
  sliderSection: {
    marginBottom: 30,
    position: 'relative',
  },
  sliderCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    overflow: 'visible',
  },
  sliderGradient: {
    flex: 1,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1, // Au-dessus de l'ombre
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  sliderContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    zIndex: 10,
  },
  sliderTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: {width: 0, height: 3},
    textShadowRadius: 7,
  },
  sliderSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  gradientMask: {
    flex: 1,
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
});
