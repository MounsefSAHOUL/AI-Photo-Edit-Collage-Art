import {ANIMATION_CONFIG} from '@/constants/collage';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Easing} from 'react-native';

/**
 * Hook personnalisé pour gérer les animations du collage
 */
export const useCollageAnimation = (selectedId: string | null) => {
  const fadeAnim = useRef(
    new Animated.Value(ANIMATION_CONFIG.fadeStart),
  ).current;
  const scaleAnim = useRef(
    new Animated.Value(ANIMATION_CONFIG.scaleStart),
  ).current;
  const slideAnim = useRef(
    new Animated.Value(ANIMATION_CONFIG.slideStart),
  ).current;

  const [showPicker, setShowPicker] = useState(false);
  const prevSelectedId = useRef<string | null>(null);

  // Animation sophistiquée avec Easing
  const animateStepTransition = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: ANIMATION_CONFIG.fadeEnd,
        duration: ANIMATION_CONFIG.duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: ANIMATION_CONFIG.scaleEnd,
        duration: ANIMATION_CONFIG.duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: ANIMATION_CONFIG.slideEnd,
        duration: ANIMATION_CONFIG.duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  useEffect(() => {
    if (selectedId) {
      if (prevSelectedId.current && prevSelectedId.current !== selectedId) {
        // Changement de layout - fade out puis in
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start(() => {
          animateStepTransition();
        });
      } else {
        // Premier affichage
        setShowPicker(true);
        fadeAnim.setValue(ANIMATION_CONFIG.fadeStart);
        scaleAnim.setValue(ANIMATION_CONFIG.scaleStart);
        slideAnim.setValue(ANIMATION_CONFIG.slideStart);
        requestAnimationFrame(() => {
          animateStepTransition();
        });
      }
      prevSelectedId.current = selectedId;
    } else {
      // Désélection
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setShowPicker(false);
        prevSelectedId.current = null;
      });
    }
  }, [selectedId, fadeAnim, scaleAnim, slideAnim, animateStepTransition]);

  return {
    fadeAnim,
    scaleAnim,
    slideAnim,
    showPicker,
  };
};
