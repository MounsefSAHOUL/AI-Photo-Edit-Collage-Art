import React, {useEffect, useRef, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

export default function FPSOverlay({intervalMs = 500}: {intervalMs?: number}) {
  const frames = useRef(0);
  const rafId = useRef<number | null>(null);
  const last = useRef<number>(Date.now());
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loop = () => {
      frames.current += 1;
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    const ticker = setInterval(() => {
      const now = Date.now();
      const elapsed = now - last.current;
      const current = Math.round((frames.current * 1000) / (elapsed || 1));
      if (mounted) setFps(current);
      frames.current = 0;
      last.current = now;
    }, intervalMs);

    return () => {
      mounted = false;
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
      clearInterval(ticker);
    };
  }, [intervalMs]);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.root,
        Platform.select({ios: {top: 44}, default: {top: 10}}),
      ]}>
      <View style={styles.badge}>
        <Text style={styles.text}>{fps} FPS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    right: 8,
    zIndex: 9999,
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  text: {
    color: '#fff',
    fontSize: 12,
  },
});
