import {Particle} from '@/types/global';

// Module-level cache so every consumer gets the same array instance when
// `isDark` is the same. This prevents unnecessary re-creations and helps
// React.memo / Skia hook stability when the same particle set is reused.
const particlesCache = new Map<boolean, readonly Particle[]>();

export function getParticles(isDark: boolean): readonly Particle[] {
  const cached = particlesCache.get(isDark);
  if (cached) return cached;

  const primary = isDark
    ? [
        '#E6B3FF',
        '#B3E5FF',
        '#FFD4B3',
        '#D4FFEB',
        '#FFE6CC',
        '#E6CCFF',
        '#CCFFE6',
      ]
    : [
        '#A366FF',
        '#66B3FF',
        '#FF9966',
        '#66FFCC',
        '#FFCC66',
        '#CC66FF',
        '#66FFA3',
      ];

  const list: Particle[] = [
    {
      size: 2.5,
      duration: 8000,
      opacity: 0.5,
      color: primary[0],
      left: 50,
      top: 100,
    },
    {
      size: 2.5,
      duration: 300,
      opacity: 0.9,
      color: primary[1],
      left: 150,
      top: 200,
    },
    {
      size: 3.2,
      duration: 10000,
      opacity: 0.65,
      color: primary[2],
      left: 280,
      top: 150,
    },
    {
      size: 2.8,
      duration: 15000,
      opacity: 0.7,
      color: primary[3],
      left: 320,
      top: 300,
    },
    {
      size: 3.8,
      duration: 9000,
      opacity: 0.75,
      color: primary[4],
      left: 80,
      top: 400,
    },
    {
      size: 1.5,
      duration: 13000,
      opacity: 0.55,
      color: primary[5],
      left: 200,
      top: 500,
    },
    {
      size: 3.5,
      duration: 11000,
      opacity: 0.68,
      color: primary[6],
      left: 40,
      top: 600,
    },
    {
      size: 2.2,
      duration: 14000,
      opacity: 0.72,
      color: primary[1],
      left: 300,
      top: 80,
    },
  ];

  Object.freeze(list);
  particlesCache.set(isDark, list);
  return list;
}
