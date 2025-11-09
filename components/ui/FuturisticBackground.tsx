//import {getParticles} from '@/constants/particles';
//import {Particle} from '@/types/global';
import {useAppTheme} from '@/hooks/useAppTheme';
import {LinearGradient} from 'expo-linear-gradient';
import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

// --- Helpers ---
function getGradientColors(isDark: boolean) {
  return isDark
    ? ['#000011', '#0A0A2E', '#1A0B3D', '#2D1B69', '#0F001A', '#000000']
    : ['#E6F3FF', '#B8E0FF', '#85C7FF', '#5BA3E0', '#3D7AB8', '#1F4A7A'];
}

function getOverlayColors(isDark: boolean) {
  return isDark
    ? ['rgba(255,0,150,0.15)', 'rgba(0,255,255,0.05)', 'rgba(138,43,226,0.12)']
    : [
        'rgba(0,150,255,0.1)',
        'rgba(255,100,200,0.08)',
        'rgba(100,200,255,0.1)',
      ];
}

// Module-level cache so every consumer gets the same array instance when
// `isDark` is the same. This prevents unnecessary re-creations and helps
// React.memo / Skia hook stability when the same particle set is reused.

// View-based particle was removed in favor of Skia canvas implementation

type FuturisticBackgroundInnerProps = {
  BorderFrameLeft?: boolean;
  BorderFrameRight?: boolean;
};

function FuturisticBackgroundInner({
  BorderFrameLeft = true,
  BorderFrameRight = true,
}: FuturisticBackgroundInnerProps) {
  const {isDark} = useAppTheme();
  const gradientColors = useMemo(() => getGradientColors(isDark), [isDark]);
  const overlayColors = useMemo(() => getOverlayColors(isDark), [isDark]);
  // const particles: Particle[] = useMemo(
  //   () => getParticles(isDark) as Particle[],
  //   [isDark],
  // );

  // particle rendering is handled by SkiaParticles (high-performance canvas)

  return (
    <View style={styles.container} pointerEvents="none">
      <LinearGradient
        colors={
          gradientColors as unknown as readonly [string, string, ...string[]]
        }
        style={styles.background}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      />

      <LinearGradient
        colors={
          overlayColors as unknown as readonly [string, string, ...string[]]
        }
        style={styles.overlayGradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      />

      {/* Skia-based particles for high performance */}
      {/* <SkiaParticles particles={particles} /> */}

      {/* Neon Grid Lines */}
      <View style={styles.gridContainer}>
        {/* Vertical lines */}
        {Array.from({length: 8}).map((_, i) => (
          <View
            key={`v-${i}`}
            style={[
              styles.gridLine,
              styles.verticalLine,
              {
                left: `${(i + 1) * 12}%`,
                backgroundColor: isDark
                  ? 'rgba(0,255,255,0.20)'
                  : 'rgba(0,100,200,0.15)',
                // subtle shadow for supported platforms
                shadowColor: isDark
                  ? 'rgba(0,255,255,0.25)'
                  : 'rgba(0,100,200,0.18)',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.6,
                shadowRadius: 6,
              },
            ]}
          />
        ))}
        {/* Horizontal lines */}
        {Array.from({length: 6}).map((_, i) => (
          <View
            key={`h-${i}`}
            style={[
              styles.gridLine,
              styles.horizontalLine,
              {
                top: `${(i + 1) * 15}%`,
                backgroundColor: isDark
                  ? 'rgba(255,0,150,0.08)'
                  : 'rgba(200,0,100,0.12)',
                shadowColor: isDark
                  ? 'rgba(255,0,150,0.25)'
                  : 'rgba(200,0,100,0.18)',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.6,
                shadowRadius: 6,
              },
            ]}
          />
        ))}
      </View>

      {/* Glowing Border Frame */}
      {BorderFrameLeft && (
        <View style={styles.glowingFrame} pointerEvents="none">
          <View
            style={[
              styles.frameEdge,
              styles.topEdge,
              {
                backgroundColor: isDark
                  ? 'rgba(0,255,255,0.4)'
                  : 'rgba(0,150,255,0.3)',
                shadowColor: isDark
                  ? 'rgba(0,255,255,0.6)'
                  : 'rgba(0,150,255,0.4)',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.8,
                shadowRadius: 12,
              },
            ]}
          />
          <View
            style={[
              styles.frameEdge,
              styles.bottomEdge,
              {
                backgroundColor: isDark
                  ? 'rgba(255,0,150,0.4)'
                  : 'rgba(255,100,200,0.3)',
                shadowColor: isDark
                  ? 'rgba(255,0,150,0.6)'
                  : 'rgba(255,100,200,0.4)',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.8,
                shadowRadius: 12,
              },
            ]}
          />
        </View>
      )}
      {BorderFrameRight && (
        <View style={styles.geometricOverlay}>
          <View
            style={[
              styles.geometricShape,
              styles.shape1,
              {
                backgroundColor: isDark
                  ? 'rgba(255,0,150,0.12)'
                  : 'rgba(0,150,255,0.1)',
                borderWidth: 1,
                borderColor: isDark
                  ? 'rgba(255,0,150,0.3)'
                  : 'rgba(0,150,255,0.25)',
              },
            ]}
          />
          <View
            style={[
              styles.geometricShape,
              styles.shape2,
              {
                backgroundColor: isDark
                  ? 'rgba(0,255,255,0.1)'
                  : 'rgba(255,100,200,0.08)',
                borderWidth: 1,
                borderColor: isDark
                  ? 'rgba(0,255,255,0.25)'
                  : 'rgba(255,100,200,0.2)',
              },
            ]}
          />
          <View
            style={[
              styles.geometricShape,
              styles.shape3,
              {
                backgroundColor: isDark
                  ? 'rgba(153,0,255,0.08)'
                  : 'rgba(0,255,153,0.06)',
                borderWidth: 1,
                borderColor: isDark
                  ? 'rgba(153,0,255,0.2)'
                  : 'rgba(0,255,153,0.15)',
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  background: {flex: 1, width: '100%', height: '100%'},
  overlayGradient: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0},
  geometricOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  geometricShape: {position: 'absolute', borderRadius: 100},
  shape1: {
    width: 300,
    height: 300,
    top: -150,
    right: -150,
    transform: [{rotate: '45deg'}],
  },
  shape2: {
    width: 250,
    height: 250,
    bottom: -125,
    left: -125,
    transform: [{rotate: '-30deg'}],
  },
  shape3: {
    width: 200,
    height: 200,
    top: '40%',
    right: -100,
    transform: [{rotate: '60deg'}],
  },
  // Neon Grid Styles
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  gridLine: {
    position: 'absolute',
    opacity: 0.6,
  },
  verticalLine: {
    width: 1,
    height: '100%',
    top: 0,
  },
  horizontalLine: {
    height: 1,
    width: '100%',
    left: 0,
  },
  // Glowing Frame Styles
  glowingFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  frameEdge: {
    position: 'absolute',
    opacity: 0.8,
  },
  topEdge: {
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  bottomEdge: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
});

export default memo(FuturisticBackgroundInner);
