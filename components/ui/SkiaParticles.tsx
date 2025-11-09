import {getParticles} from '@/constants/particles';
import {Particle} from '@/types/global';
import {
  Canvas,
  Circle,
  Fill,
  LinearGradient,
  vec,
} from '@shopify/react-native-skia';
import React, {memo, useEffect, useMemo} from 'react';
import {StyleSheet, useColorScheme, useWindowDimensions} from 'react-native';
import {
  Extrapolate,
  Extrapolation,
  interpolate,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface SkiaParticlesProps {
  particles?: Particle[];
}

// Background gradient colors
const lightGradient = ['rgba(255,255,255,0.8)', 'rgba(240,240,255,0.6)'];
const darkGradient = ['rgba(15,15,25,0.9)', 'rgba(25,15,35,0.8)'];

// ---------------- Optimized GPU implementation ----------------
function SkiaParticles({particles: propParticles}: SkiaParticlesProps) {
  const {width, height} = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Use particles from constants if not provided
  const particles = useMemo(() => {
    return propParticles || getParticles(isDark);
  }, [propParticles, isDark]);

  // Global animation clock for all particles
  const clock = useSharedValue(0);

  useEffect(() => {
    clock.value = withRepeat(withTiming(1, {duration: 30000}), -1, false);
  }, [clock]);

  // Background gradient
  const gradientColors = isDark ? darkGradient : lightGradient;

  // Individual particle animations using GPU-based calculations
  const particleElements = useMemo(() => {
    return particles.map((particle, index) => {
      return (
        <ParticleElement
          key={`${particle.left}-${particle.top}-${index}`}
          particle={particle}
          clock={clock}
          index={index}
        />
      );
    });
  }, [particles, clock]);

  return (
    <Canvas style={styles.canvas}>
      <Fill>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, height)}
          colors={gradientColors}
        />
      </Fill>
      {particleElements}
    </Canvas>
  );
}

// Memoized particle component for better performance
const ParticleElement = memo(function ParticleElement({
  particle,
  clock,
  index,
}: {
  particle: Particle;
  clock: any;
  index: number;
}) {
  // Create time offset for each particle to avoid synchronized movement
  const timeOffset = index * 0.1;

  // Compute animated values using Reanimated interpolation
  const animatedX = useDerivedValue(() => {
    const progress = (clock.value + timeOffset) % 1;

    // Create floating motion
    return interpolate(
      progress,
      [0, 0.25, 0.5, 0.75, 1],
      [
        particle.left,
        particle.left + 30,
        particle.left - 20,
        particle.left + 15,
        particle.left,
      ],
      Extrapolation.CLAMP,
    );
  }, [clock, timeOffset, particle.left]);

  const animatedY = useDerivedValue(() => {
    const progress = (clock.value + timeOffset + 0.2) % 1;

    // Create vertical floating motion
    return interpolate(
      progress,
      [0, 0.3, 0.6, 1],
      [particle.top, particle.top - 25, particle.top + 15, particle.top],
      Extrapolate.CLAMP,
    );
  }, [clock, timeOffset, particle.top]);

  const animatedOpacity = useDerivedValue(() => {
    const progress = (clock.value + timeOffset + 0.4) % 1;

    // Create pulsing opacity
    const pulse = Math.sin(progress * Math.PI * 4) * 0.3 + 0.7;
    return particle.opacity * pulse;
  }, [clock, timeOffset, particle.opacity]);

  const animatedSize = useDerivedValue(() => {
    const progress = (clock.value + timeOffset + 0.6) % 1;

    // Create size variation
    const scale = Math.sin(progress * Math.PI * 2) * 0.4 + 1;
    return particle.size * scale;
  }, [clock, timeOffset, particle.size]);

  return (
    <Circle
      cx={animatedX}
      cy={animatedY}
      r={animatedSize}
      color={particle.color}
      opacity={animatedOpacity}
    />
  );
});

export default memo(SkiaParticles);

const styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
