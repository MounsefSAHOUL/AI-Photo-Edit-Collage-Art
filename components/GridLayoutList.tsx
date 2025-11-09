import {getGridLayouts} from '@/constants/grid';
import {useAppTheme} from '@/hooks/useAppTheme';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {i18n} from '@/i18n/i18n';
import React, {useCallback, useMemo} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Svg, {
  ClipPath,
  Defs,
  Path as SvgPath,
  Rect as SvgRect,
} from 'react-native-svg';
import GradientBg from './collage/GradientBg';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export type GridLayoutListProps = {
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

// --- PreviewCell (memoized) -------------------------------------------------
function PreviewCellComponent({
  layoutId,
  layout,
  shape,
  mask,
  // locale/theme props
  fonts,
  textAlign,
}: {
  layoutId?: string;
  layout: number[][];
  shape?: string;
  mask?: {type: 'svg'; path: string; viewBoxSize?: number} | undefined;
  selected?: boolean;
  fonts?: any;
  textAlign?: any;
  isRTL?: boolean;
  isDark?: boolean;
}) {
  const instanceIdRef = React.useRef<string>(
    Math.random().toString(36).slice(2, 9),
  );
  const gap = 6;

  const rows = layout.length;
  const cols = layout[0]?.length || 0;

  const {
    singleElement,
    cellSize,
    containerWidth,
    containerHeight,
    finalContainerHeight,
    innerPadding,
    regions,
  } = useMemo(() => {
    const _rows = rows;
    const _cols = cols;
    const _single = _rows === 1 && _cols === 1;
    const maxPreviewWidth = _single
      ? Math.min(260, SCREEN_WIDTH * 0.5)
      : Math.min(180, SCREEN_WIDTH * 0.45);
    const maxPreviewHeight = _single ? 200 : 140;

    const cellSizeByWidth = Math.floor(
      (maxPreviewWidth - (_cols - 1) * gap) / _cols,
    );
    const cellSizeByHeight = Math.floor(
      (maxPreviewHeight - (_rows - 1) * gap) / _rows,
    );
    const maxCellSize = _single ? Math.floor(maxPreviewWidth) : 64;
    const _cellSize = Math.max(
      20,
      Math.min(maxCellSize, Math.min(cellSizeByWidth, cellSizeByHeight)),
    );

    const width = _cols * _cellSize + (_cols - 1) * gap;
    const height = _rows * _cellSize + (_rows - 1) * gap;
    const parentItemMax = Math.min(260, SCREEN_WIDTH * 0.85);
    const _containerWidth = _single
      ? Math.min(maxPreviewWidth, Math.max(width, parentItemMax - 16))
      : width;
    const _containerHeight = _single
      ? Math.min(maxPreviewHeight, Math.max(height, _containerWidth))
      : height;

    const titleArea = 24 + 8;
    const availableHeight = Math.max(0, 220 - titleArea - 16);
    const _finalContainerHeight = Math.min(_containerHeight, availableHeight);

    const _covered: boolean[][] = Array.from({length: _rows}, () =>
      Array(_cols).fill(false),
    );
    const _regions: {
      id: number;
      r: number;
      c: number;
      rowspan: number;
      colspan: number;
    }[] = [];

    for (let r = 0; r < _rows; r++) {
      for (let c = 0; c < _cols; c++) {
        if (_covered[r][c]) continue;
        const id = layout[r][c];

        let colspan = 1;
        for (let cc = c + 1; cc < _cols; cc++) {
          if (layout[r][cc] === id) colspan++;
          else break;
        }

        let rowspan = 1;
        for (let rr = r + 1; rr < _rows; rr++) {
          let ok = true;
          for (let cc = c; cc < c + colspan; cc++) {
            if (layout[rr][cc] !== id) {
              ok = false;
              break;
            }
          }
          if (ok) rowspan++;
          else break;
        }

        for (let rr = r; rr < r + rowspan; rr++) {
          for (let cc = c; cc < c + colspan; cc++) _covered[rr][cc] = true;
        }

        _regions.push({id, r, c, rowspan, colspan});
      }
    }

    const _innerPadding = _single
      ? Math.max(2, Math.round(_cellSize * 0.06))
      : 0;

    return {
      singleElement: _single,
      cellSize: _cellSize,
      containerWidth: _containerWidth,
      containerHeight: _containerHeight,
      finalContainerHeight: _finalContainerHeight,
      innerPadding: _innerPadding,
      regions: _regions,
    };
  }, [layout, rows, cols]);

  return (
    <View
      style={useMemo(
        () => ({
          width: containerWidth,
          height: finalContainerHeight,
          position: 'relative',
          maxWidth: '100%',
          maxHeight: '100%',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
        }),
        [containerWidth, finalContainerHeight],
      )}>
      {regions.map((reg, idx) => {
        const left = reg.c * (cellSize + gap);
        const top = reg.r * (cellSize + gap);
        const w = reg.colspan * cellSize + (reg.colspan - 1) * gap;
        const h = reg.rowspan * cellSize + (reg.rowspan - 1) * gap;
        const rCol = (reg.id * 37) % 255;
        const gCol = (reg.id * 89) % 255;
        const bCol = (reg.id * 151) % 255;
        const bg = `rgba(${rCol}, ${gCol}, ${bCol}, 0.22)`;
        const borderCol = `rgba(${rCol}, ${gCol}, ${bCol}, 0.45)`;

        const luminance = 0.299 * rCol + 0.587 * gCol + 0.114 * bCol;
        const textColor = luminance > 160 ? '#111' : '#fff';

        if (mask && mask.type === 'svg' && mask.path) {
          const vb = mask.viewBoxSize ?? 100;
          const safeId = (layoutId || 'layout')
            .toString()
            .replace(/[^a-z0-9_-]/gi, '');
          const clipId = `clip-${safeId}-${instanceIdRef.current}-${idx}`;
          if (singleElement) {
            const outerW = Math.max(0, containerWidth - innerPadding * 2);
            const outerH = Math.max(0, containerHeight - innerPadding * 2);
            const size = Math.min(outerW, outerH);
            return (
              <View
                key={`reg-${idx}`}
                style={{
                  width: size,
                  height: size,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Svg
                  width={size}
                  height={size}
                  viewBox={`0 0 ${vb} ${vb}`}
                  preserveAspectRatio="xMidYMid slice">
                  <Defs>
                    <ClipPath id={clipId}>
                      <SvgPath d={mask.path} />
                    </ClipPath>
                  </Defs>
                  <SvgRect
                    width={vb}
                    height={vb}
                    fill={bg}
                    clipPath={`url(#${clipId})`}
                  />
                </Svg>
              </View>
            );
          }
          return (
            <View
              key={`reg-${idx}`}
              style={{
                position: 'absolute',
                left: left + innerPadding,
                top: top + innerPadding,
                width: Math.max(0, w - innerPadding * 2),
                height: Math.max(0, h - innerPadding * 2),
              }}>
              <Svg
                width={Math.max(0, w - innerPadding * 2)}
                height={Math.max(0, h - innerPadding * 2)}
                viewBox={`0 0 ${vb} ${vb}`}
                preserveAspectRatio="xMidYMid slice">
                <Defs>
                  <ClipPath id={clipId}>
                    <SvgPath d={mask.path} />
                  </ClipPath>
                </Defs>
                <SvgRect
                  width={vb}
                  height={vb}
                  fill={bg}
                  clipPath={`url(#${clipId})`}
                />
              </Svg>
            </View>
          );
        }

        const isCircle = shape === 'circle';

        const adjLeft = left + innerPadding;
        const adjTop = top + innerPadding;
        const adjW = Math.max(0, w - innerPadding * 2);
        const adjH = Math.max(0, h - innerPadding * 2);

        const adjRadius = isCircle
          ? Math.min(adjW, adjH) / 2
          : Math.round(Math.min(adjW, adjH) * 0.08);
        const adjBorder = Math.max(1, Math.round(Math.min(adjW, adjH) / 28));
        const adjFont = Math.max(10, Math.round(Math.min(adjW, adjH) / 5));

        return (
          <View
            key={`reg-${idx}`}
            style={{
              position: 'absolute',
              left: adjLeft,
              top: adjTop,
              width: adjW,
              height: adjH,
              backgroundColor: bg,
              borderWidth: adjBorder,
              borderColor: borderCol,
              borderRadius: adjRadius,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: adjFont,
                color: textColor,
                fontFamily: fonts?.body,
                textAlign: textAlign || 'center',
              }}>
              {reg.id}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const PreviewCell = React.memo(
  PreviewCellComponent,
  (prev, next) =>
    prev.layoutId === next.layoutId &&
    prev.selected === next.selected &&
    prev.shape === next.shape &&
    // quick mask path comparison
    (prev.mask?.path || '') === (next.mask?.path || '') &&
    // assume layout array reference stable; fallback to shallow length compare
    prev.layout === next.layout,
);

const GridLayoutList: React.FC<GridLayoutListProps> = ({
  selectedId,
  onSelect,
}) => {
  const keyExtractor = useCallback((item: any) => item.id, []);

  const {isDark} = useAppTheme();
  const {fonts, textAlign, isRTL} = useLocaleAppearance();

  const renderItem = useCallback(
    ({item}: any) => {
      const selected = selectedId === item.id;
      const titleColor = isDark ? '#E6F0FF' : '#111827';
      const selectedBorderColor = isDark ? '#34D399' : '#4a90e2';
      const fallbackBg = isDark ? '#071024' : 'transparent';

      return (
        <TouchableOpacity
          style={[
            styles.itemWrap,
            {backgroundColor: fallbackBg},
            selected
              ? [styles.itemSelected, {borderColor: selectedBorderColor}]
              : null,
          ]}
          onPress={() => onSelect && onSelect(item.id)}>
          {/* gradient background behind content (clipped to rounded rect) */}
          <View style={styles.bgWrapper}>
            <GradientBg selected={selected} isDark={isDark} />
          </View>
          <Text
            style={[
              styles.itemName,
              {
                fontFamily: fonts?.heading,
                textAlign: textAlign,
                color: titleColor,
              },
            ]}>
            {i18n.t(item.nameKey || '', {locale: i18n.locale}) || item.name}
          </Text>
          <PreviewCell
            layoutId={item.id}
            layout={item.layout}
            shape={item.shape}
            mask={item.mask}
            selected={selected}
            fonts={fonts}
            textAlign={textAlign}
            isRTL={isRTL}
            isDark={isDark}
          />
        </TouchableOpacity>
      );
    },
    [selectedId, onSelect, fonts, textAlign, isRTL, isDark],
  );

  const data = useMemo(() => getGridLayouts(), []);

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      horizontal
      inverted={isRTL}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      renderItem={renderItem}
      // style={{direction: isRTL ? 'rtl' : 'ltr', flexDirection: rowDirection}}
    />
  );
};

export default React.memo(GridLayoutList);

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 6,
    paddingBottom: 20,
  },
  itemWrap: {
    maxWidth: Math.min(260, SCREEN_WIDTH * 0.85),
    padding: 8,
    marginRight: 8,
    height: 220,
    //backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    overflow: 'visible',
    position: 'relative',
    zIndex: 2,
  },
  itemSelected: {
    borderWidth: 2,
    borderColor: '#4a90e2',
    overflow: 'hidden',
    zIndex: 2,
    // elevation: 4,
  },
  itemName: {
    marginBottom: 8,
    fontSize: 12,
  },
  bgWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
