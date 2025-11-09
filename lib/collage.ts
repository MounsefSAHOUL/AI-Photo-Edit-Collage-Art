import type {GridLayout} from '@/types/global';

export type ContainerRect = {
  // identifiant du container (valeur numérique présente dans grid.layout)
  id: number;
  // index séquentiel du container (0..n-1) — utile pour associer images
  index: number;
  // positions normalisées (0..1) sur la surface de composition
  left: number;
  top: number;
  width: number;
  height: number;
  // version en pixels si canvasSize fourni
  px?: {left: number; top: number; width: number; height: number};
};

/**
 * Calcule les rectangles des containers à partir d'un GridLayout.
 * Retourne des positions normalisées (0..1) et, si canvasSize est fourni,
 * les positions en pixels.
 *
 * Comportement supporté :
 * - shape 'rect' : calcule des bounding boxes qui couvrent les cellules avec
 *   la même valeur (utile pour les layouts 2x2, 3x2, stitch...)
 * - shapes 'heart','clover' (single) : un seul container couvrant toute la zone
 * - shape 'circle' : distribue les éléments horizontalement
 * - shape 'hexagon' : distribue horizontalement (si cols>1) ou single
 */
export function computeContainerRects(
  grid: GridLayout,
  canvasSize?: {width: number; height: number},
): ContainerRect[] {
  if (!grid || !grid.layout || grid.layout.length === 0) return [];

  const rows = grid.rows || grid.layout.length;
  const cols = grid.cols || grid.layout[0].length;

  const rects: ContainerRect[] = [];

  const uniqueIds = Array.from(
    new Set(grid.layout.flat().map(v => Number(v))),
  ).sort((a, b) => a - b);

  const toPx = (r: ContainerRect) => {
    if (!canvasSize) return undefined;
    return {
      left: Math.round(r.left * canvasSize.width),
      top: Math.round(r.top * canvasSize.height),
      width: Math.round(r.width * canvasSize.width),
      height: Math.round(r.height * canvasSize.height),
    };
  };

  if (!grid.shape || grid.shape === 'rect') {
    // pour chaque identifiant unique on calcule la bounding box sur la grille
    uniqueIds.forEach((uid, idx) => {
      let minR = Infinity,
        maxR = -Infinity,
        minC = Infinity,
        maxC = -Infinity;
      grid.layout.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (Number(cell) === uid) {
            minR = Math.min(minR, r);
            maxR = Math.max(maxR, r);
            minC = Math.min(minC, c);
            maxC = Math.max(maxC, c);
          }
        });
      });

      if (minR === Infinity) return;

      const left = minC / cols;
      const top = minR / rows;
      const width = (maxC - minC + 1) / cols;
      const height = (maxR - minR + 1) / rows;

      const r: ContainerRect = {
        id: uid,
        index: idx,
        left,
        top,
        width,
        height,
      };
      r.px = toPx(r);
      rects.push(r);
    });
    return rects;
  }

  // shapes particulières
  switch (grid.shape) {
    case 'heart':
    case 'clover':
      // traité comme single full-area container
      rects.push({
        id: uniqueIds[0] ?? 1,
        index: 0,
        left: 0,
        top: 0,
        width: 1,
        height: 1,
        px: canvasSize
          ? {
              left: 0,
              top: 0,
              width: canvasSize.width,
              height: canvasSize.height,
            }
          : undefined,
      });
      return rects;
    case 'circle': {
      const count = grid.layout[0].length;
      const height = 0.25; // portion verticale par défaut
      const width = 1 / count;
      for (let j = 0; j < count; j++) {
        const left = j * width;
        const top = 0.5 - height / 2;
        const r: ContainerRect = {
          id: grid.layout[0][j],
          index: j,
          left,
          top,
          width,
          height,
        };
        r.px = toPx(r);
        rects.push(r);
      }
      return rects;
    }
    case 'hexagon': {
      if (grid.cols === 1) {
        rects.push({
          id: uniqueIds[0] ?? 1,
          index: 0,
          left: 0,
          top: 0,
          width: 1,
          height: 1,
          px: canvasSize
            ? {
                left: 0,
                top: 0,
                width: canvasSize.width,
                height: canvasSize.height,
              }
            : undefined,
        });
        return rects;
      }
      const count = grid.layout[0].length;
      const height = 0.28;
      const width = 1 / count;
      for (let j = 0; j < count; j++) {
        const left = j * width;
        const top = 0.5 - height / 2;
        const r: ContainerRect = {
          id: grid.layout[0][j],
          index: j,
          left,
          top,
          width,
          height,
        };
        r.px = toPx(r);
        rects.push(r);
      }
      return rects;
    }
    default:
      // fallback -> same as rect
      return computeContainerRects({...grid, shape: 'rect'}, canvasSize);
  }
}
/**
 * Util helper : renvoie le nombre de containers uniques
 */
export function getTotalContainers(grid: GridLayout) {
  return Array.from(new Set(grid.layout.flat())).length;
}
