import {GridLayout} from '@/types/global';

// 21 Grid layouts: mix of rectangular layouts and masked shapes (heart, clover, circle, hexagon)
export const GRID_LAYOUTS: GridLayout[] = [
  {
    id: 'grid-02',
    name: '1x2',
    nameKey: 'grids.grid-02.name',
    shape: 'rect',
    rows: 1,
    cols: 2,
    layout: [[1, 2]],
  },

  {
    id: 'grid-03',
    name: '2x1',
    nameKey: 'grids.grid-03.name',
    shape: 'rect',
    rows: 2,
    cols: 1,
    layout: [[1], [2]],
  },

  {
    id: 'grid-04',
    name: '2x2',
    nameKey: 'grids.grid-04.name',
    shape: 'rect',
    rows: 2,
    cols: 2,
    layout: [
      [1, 2],
      [3, 4],
    ],
  },

  {
    id: 'grid-05',
    name: '3x2',
    nameKey: 'grids.grid-05.name',
    shape: 'rect',
    rows: 3,
    cols: 2,
    layout: [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
  },

  {
    id: 'grid-06',
    name: '2x3',
    nameKey: 'grids.grid-06.name',
    shape: 'rect',
    rows: 2,
    cols: 3,
    layout: [
      [1, 2, 3],
      [4, 5, 6],
    ],
  },

  {
    id: 'grid-07',
    name: 'Big top + 2 small',
    nameKey: 'grids.grid-07.name',
    shape: 'rect',
    rows: 2,
    cols: 2,
    layout: [
      [1, 1],
      [2, 3],
    ],
  },

  {
    id: 'grid-08',
    name: 'Left big + right stack',
    nameKey: 'grids.grid-08.name',
    shape: 'rect',
    rows: 2,
    cols: 2,
    layout: [
      [1, 2],
      [1, 3],
    ],
  },

  {
    id: 'grid-09',
    name: 'Top big + bottom row',
    nameKey: 'grids.grid-09.name',
    shape: 'rect',
    rows: 2,
    cols: 3,
    layout: [
      [1, 1, 1],
      [2, 3, 4],
    ],
  },

  {
    id: 'grid-10',
    name: 'Bottom big + top row',
    nameKey: 'grids.grid-10.name',
    shape: 'rect',
    rows: 2,
    cols: 3,
    layout: [
      [1, 2, 3],
      [4, 4, 4],
    ],
  },

  {
    id: 'grid-11',
    name: '3x3',
    nameKey: 'grids.grid-11.name',
    shape: 'rect',
    rows: 3,
    cols: 3,
    layout: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
  },

  {
    id: 'grid-12',
    name: 'Cross (center focus)',
    nameKey: 'grids.grid-12.name',
    shape: 'rect',
    rows: 3,
    cols: 3,
    layout: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 5],
    ],
  },

  {
    id: 'grid-13',
    name: 'Columns 3',
    nameKey: 'grids.grid-13.name',
    shape: 'rect',
    rows: 1,
    cols: 3,
    layout: [[1, 2, 3]],
  },

  {
    id: 'grid-14',
    name: 'Circles 3',
    nameKey: 'grids.grid-14.name',
    shape: 'circle',
    rows: 1,
    cols: 3,
    layout: [[1, 2, 3]],
    mask: {
      type: 'svg',
      path: 'M50 0 A50 50 0 1 0 50 100 A50 50 0 1 0 50 0 Z',
      viewBoxSize: 100,
    },
  },

  {
    id: 'grid-15',
    name: 'Circle single',
    nameKey: 'grids.grid-15.name',
    shape: 'circle',
    rows: 1,
    cols: 1,
    layout: [[1]],
    mask: {
      type: 'svg',
      path: 'M50 0 A50 50 0 1 0 50 100 A50 50 0 1 0 50 0 Z',
      viewBoxSize: 100,
    },
  },

  // `1x1`, `Heart single` and `Clover single` were removed per user request

  // Added polygon shapes (max 3 images each)
  {
    id: 'grid-22',
    name: 'Pentagon 3',
    nameKey: 'grids.grid-22.name',
    shape: 'pentagon',
    rows: 1,
    cols: 1,
    layout: [[1]],
    mask: {
      type: 'svg',
      // regular pentagon approx centered in viewBox 100
      path: 'M50 10 L78 32 L64 74 L36 74 L22 32 Z',
      viewBoxSize: 100,
    },
  },

  {
    id: 'grid-23',
    name: 'Heptagon 3',
    nameKey: 'grids.grid-23.name',
    shape: 'heptagon',
    rows: 1,
    cols: 1,
    layout: [[1]],
    mask: {
      type: 'svg',
      // regular heptagon (center 50,50 r=40)
      path: 'M50 10 L81.28 25.08 L88.996 58.90 L67.36 86.04 L32.64 86.04 L11.00 58.90 L18.72 25.08 Z',
      viewBoxSize: 100,
    },
  },

  {
    id: 'grid-24',
    name: 'Octagon 3',
    nameKey: 'grids.grid-24.name',
    shape: 'octagon',
    rows: 1,
    cols: 1,
    layout: [[1]],
    mask: {
      type: 'svg',
      path: 'M30 10 L70 10 L90 30 L90 70 L70 90 L30 90 L10 70 L10 30 Z',
      viewBoxSize: 100,
    },
  },

  {
    id: 'grid-25',
    name: 'Nonagon 3',
    nameKey: 'grids.grid-25.name',
    shape: 'nonagon',
    rows: 1,
    cols: 1,
    layout: [[1]],
    mask: {
      type: 'svg',
      // regular nonagon (center 50,50 r=40)
      path: 'M50 10 L75.71 19.36 L89.39 43.05 L84.64 70.00 L63.68 87.59 L36.32 87.59 L15.36 70.00 L10.61 43.05 L24.29 19.36 Z',
      viewBoxSize: 100,
    },
  },

  {
    id: 'grid-26',
    name: 'Decagon 3',
    nameKey: 'grids.grid-26.name',
    shape: 'decagon',
    rows: 1,
    cols: 1,
    layout: [[1]],
    mask: {
      type: 'svg',
      // regular decagon (center 50,50 r=40)
      path: 'M50 10 L73.51 17.64 L88.04 37.64 L88.04 62.36 L73.51 82.36 L50 90 L26.49 82.36 L11.96 62.36 L11.96 37.64 L26.49 17.64 Z',
      viewBoxSize: 100,
    },
  },

  {
    id: 'grid-18',
    name: 'Hexagon',
    nameKey: 'grids.grid-18.name',
    shape: 'hexagon',
    rows: 1,
    cols: 3,
    layout: [[1]],
    mask: {
      type: 'svg',
      path: 'M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z',
      viewBoxSize: 100,
    },
  },

  {
    id: 'grid-20',
    name: 'Mosaic 3x3',
    nameKey: 'grids.grid-20.name',
    shape: 'rect',
    rows: 3,
    cols: 3,
    layout: [
      [1, 1, 2],
      [3, 4, 2],
      [5, 6, 6],
    ],
  },

  {
    id: 'grid-21',
    name: 'Asymmetric 5',
    nameKey: 'grids.grid-21.name',
    shape: 'rect',
    rows: 3,
    cols: 3,
    layout: [
      [1, 2, 2],
      [3, 4, 5],
      [3, 6, 5],
    ],
  },
];

// Freeze the grid definitions deeply so references stay stable at runtime.
// This prevents accidental mutation and improves memoization reliability.
function deepFreeze<T>(obj: T): T {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    // Freeze self first
    Object.freeze(obj as any);

    // Recurse into properties / array items
    if (Array.isArray(obj)) {
      (obj as any[]).forEach(item => {
        if (item && typeof item === 'object') deepFreeze(item);
      });
    } else {
      Object.getOwnPropertyNames(obj).forEach(prop => {
        try {
          const val = (obj as any)[prop];
          if (val && typeof val === 'object') deepFreeze(val);
        } catch {
          // ignore accessors
        }
      });
    }
  }
  return obj;
}

deepFreeze(GRID_LAYOUTS);

/**
 * Getter for grid layouts. Returns the frozen GRID_LAYOUTS array.
 * Kept as a function so callers can opt into a lazy/memoized access pattern.
 */
export function getGridLayouts(): GridLayout[] {
  return GRID_LAYOUTS;
}
