import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {i18n} from '@/i18n/i18n';
import {LinearGradient} from 'expo-linear-gradient';
import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {
  ClipPath,
  Defs,
  Image as SvgImage,
  Path as SvgPath,
  Rect as SvgRect,
} from 'react-native-svg';
import {CollageActionButtons} from './CollageActionButtons';

type Props = {
  previewRef: any;
  selectedId: string | null;
  imagesMap: Record<number, string> | null;
  layout: any;
  regions: any[];
  cellSize: number;
  containerWidth: number;
  containerHeight: number;
  isDark?: boolean;
  exportScale: number;
  setExportScale: (n: number) => void;
  busy: boolean;
  onSave: () => Promise<void> | void;
  onShare: () => Promise<void> | void;
  onDelete: () => void;
  onUndoDelete: () => void;
  lastDeleted: null | {
    images: Record<number, string> | null;
    selectedId: string | null;
  };
  progress: Animated.Value;
};

type RegionPreviewProps = {
  reg: any;
  idx: number;
  cellSize: number;
  layout: any;
  imagesMap: Record<number, string> | null;
  selectedId: string | null;
  isDark?: boolean;
  roundedStyle: 'rounded' | 'square';
};

const RegionPreview: React.FC<RegionPreviewProps> = React.memo(
  ({
    reg,
    idx,
    cellSize,
    layout,
    imagesMap,
    selectedId,
    isDark,
    roundedStyle,
  }) => {
    const left = useMemo(() => reg.c * (cellSize + 8), [reg.c, cellSize]);
    const top = useMemo(() => reg.r * (cellSize + 8), [reg.r, cellSize]);
    const w = useMemo(
      () => reg.colspan * cellSize + (reg.colspan - 1) * 8,
      [reg.colspan, cellSize],
    );
    const h = useMemo(
      () => reg.rowspan * cellSize + (reg.rowspan - 1) * 8,
      [reg.rowspan, cellSize],
    );
    const uri = imagesMap ? imagesMap[reg.id] : undefined;
    const vb = layout?.mask?.viewBoxSize ?? 100;
    const clipId = `pv-clip-${selectedId}-${idx}`;

    const isCircle = layout?.shape === 'circle';
    const radius = useMemo(() => {
      const r = isCircle
        ? Math.min(w, h) / 2
        : Math.round(Math.min(w, h) * 0.08);
      if (!isCircle && roundedStyle === 'square') return 0;
      return r;
    }, [isCircle, w, h, roundedStyle]);

    // If layout has a mask but user asked for square corners, render a plain
    // rectangular preview so all corners become square.
    if (layout?.mask?.path && roundedStyle === 'square') {
      return (
        <View
          key={`pv-${idx}`}
          style={{
            position: 'absolute',
            left,
            top,
            width: w,
            height: h,
            overflow: 'hidden',
            borderRadius: radius,
            backgroundColor: 'rgba(0,0,0,0.03)',
          }}>
          {uri ? (
            <Image
              source={{uri}}
              style={{width: '100%', height: '100%'}}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(0,0,0,0.03)',
              }}
            />
          )}
        </View>
      );
    }

    if (layout?.mask?.path) {
      return (
        <View
          key={`pv-${idx}`}
          style={{
            position: 'absolute',
            left,
            top,
            width: w,
            height: h,
            overflow: 'hidden',
          }}>
          <Svg
            width={w}
            height={h}
            viewBox={`0 0 ${vb} ${vb}`}
            preserveAspectRatio="xMidYMid slice">
            <Defs>
              <ClipPath id={clipId}>
                <SvgPath d={layout.mask!.path} />
              </ClipPath>
            </Defs>
            {uri ? (
              <SvgImage
                href={{uri}}
                x="0"
                y="0"
                width={vb}
                height={vb}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#${clipId})`}
              />
            ) : (
              <SvgRect
                x="0"
                y="0"
                width={vb}
                height={vb}
                fill={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}
                clipPath={`url(#${clipId})`}
              />
            )}
          </Svg>
        </View>
      );
    }

    return (
      <View
        key={`pv-${idx}`}
        style={{
          position: 'absolute',
          left,
          top,
          width: w,
          height: h,
          overflow: 'hidden',
          borderRadius: radius,
          backgroundColor: 'rgba(0,0,0,0.03)',
        }}>
        {uri ? (
          <Image
            source={{uri}}
            style={{width: '100%', height: '100%'}}
            resizeMode="cover"
          />
        ) : null}
      </View>
    );
  },
);

RegionPreview.displayName = 'RegionPreview';

const CollageExport: React.FC<Props> = ({
  previewRef,
  selectedId,
  imagesMap,
  layout,
  regions,
  cellSize,
  containerWidth,
  containerHeight,
  isDark,
  exportScale,
  setExportScale,
  busy,
  onSave,
  onShare,
  onDelete,
  onUndoDelete,
  lastDeleted,
  progress,
}) => {
  const [roundedStyle, setRoundedStyle] = useState<'rounded' | 'square'>(
    'rounded',
  );
  const {rowDirection, fonts, textAlign} = useLocaleAppearance();
  // memoized helpers
  const scales = useMemo(() => [1, 2, 4], []);
  const handleSetExportScale = useCallback(
    (s: number) => () => setExportScale(s),
    [setExportScale],
  );
  const handleSetRounded = useCallback(() => setRoundedStyle('rounded'), []);
  const handleSetSquare = useCallback(() => setRoundedStyle('square'), []);
  return (
    <>
      <View style={styles.previewContainer}>
        <View
          ref={previewRef}
          collapsable={false}
          style={{
            width: containerWidth,
            height: containerHeight,
            position: 'relative',
            backgroundColor: 'transparent',
            // Make the overall preview container square when user requests square
            borderRadius: roundedStyle === 'square' ? 0 : 16,
            overflow: 'hidden',
            ...styles.previewShadow,
          }}>
          {regions.map((reg, idx) => (
            <RegionPreview
              key={`pv-${idx}`}
              reg={reg}
              idx={idx}
              cellSize={cellSize}
              layout={layout}
              imagesMap={imagesMap}
              selectedId={selectedId}
              isDark={isDark}
              roundedStyle={roundedStyle}
            />
          ))}
        </View>
      </View>

      {/* Controls Section */}
      <View style={styles.controlsWrapper}>
        {/* Resolution Control */}
        <View style={styles.controlGroup}>
          <Text
            style={[
              styles.controlLabel,
              {fontFamily: fonts.heading, textAlign},
            ]}>
            {i18n.t('collage.resolution.label')}
          </Text>
          <View style={[styles.buttonRow, {flexDirection: rowDirection}]}>
            {scales.map(s => (
              <TouchableOpacity
                key={`scale-${s}`}
                onPress={handleSetExportScale(s)}
                activeOpacity={0.7}
                style={[
                  styles.optionButton,
                  exportScale === s && styles.optionButtonActive,
                ]}>
                <LinearGradient
                  colors={
                    exportScale === s
                      ? ['#4a90e2', '#357abd']
                      : ['transparent', 'transparent']
                  }
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.buttonGradient}>
                  <Text
                    style={[
                      styles.optionButtonText,
                      exportScale === s && styles.optionButtonTextActive,
                      {fontFamily: fonts.body, textAlign},
                    ]}>
                    {s}x
                  </Text>
                  <Text
                    style={[
                      styles.optionButtonSubtext,
                      exportScale === s && styles.optionButtonSubtextActive,
                      {fontFamily: fonts.label, textAlign},
                    ]}>
                    {i18n.t(`collage.resolution.${s}`)}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Border Style Control */}
        <View style={styles.controlGroup}>
          <Text
            style={[
              styles.controlLabel,
              {fontFamily: fonts.heading, textAlign},
            ]}>
            {i18n.t('collage.borderStyle')}
          </Text>
          <View style={[styles.buttonRow, {flexDirection: rowDirection}]}>
            <TouchableOpacity
              onPress={handleSetRounded}
              activeOpacity={0.7}
              style={[
                styles.optionButton,
                roundedStyle === 'rounded' && styles.optionButtonActive,
              ]}>
              <LinearGradient
                colors={
                  roundedStyle === 'rounded'
                    ? ['#667eea', '#764ba2']
                    : ['transparent', 'transparent']
                }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.buttonGradient}>
                <Text
                  style={[
                    styles.optionButtonText,
                    roundedStyle === 'rounded' && styles.optionButtonTextActive,
                    {fontFamily: fonts.accent, textAlign},
                  ]}>
                  ⬭
                </Text>
                <Text
                  style={[
                    styles.optionButtonSubtext,
                    roundedStyle === 'rounded' &&
                      styles.optionButtonSubtextActive,
                    {fontFamily: fonts.label, textAlign},
                  ]}>
                  {i18n.t('collage.border.rounded')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSetSquare}
              activeOpacity={0.7}
              style={[
                styles.optionButton,
                roundedStyle === 'square' && styles.optionButtonActive,
              ]}>
              <LinearGradient
                colors={
                  roundedStyle === 'square'
                    ? ['#667eea', '#764ba2']
                    : ['transparent', 'transparent']
                }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.buttonGradient}>
                <Text
                  style={[
                    styles.optionButtonText,
                    roundedStyle === 'square' && styles.optionButtonTextActive,
                    {fontFamily: fonts.accent, textAlign},
                  ]}>
                  ▢
                </Text>
                <Text
                  style={[
                    styles.optionButtonSubtext,
                    roundedStyle === 'square' &&
                      styles.optionButtonSubtextActive,
                    {fontFamily: fonts.label, textAlign},
                  ]}>
                  {i18n.t('collage.border.square')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <CollageActionButtons
        onDelete={onDelete}
        onSave={onSave}
        onShare={onShare}
        disabled={busy}
      />

      {busy && (
        <View style={{marginTop: 10, alignItems: 'center'}}>
          <ActivityIndicator size="small" />
        </View>
      )}

      {lastDeleted && (
        <Animated.View style={styles.undoContainer}>
          <LinearGradient
            colors={['#1a1a2e', '#16213e']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.undoGradient}>
            <Text
              style={[styles.undoText, {fontFamily: fonts.heading, textAlign}]}>
              {i18n.t('collage.deleted')}
            </Text>
            <TouchableOpacity onPress={onUndoDelete} style={styles.undoButton}>
              <LinearGradient
                colors={['#fff', '#f0f0f0']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={styles.undoButtonGradient}>
                <Text
                  style={[
                    styles.undoButtonText,
                    {fontFamily: fonts.label, textAlign},
                  ]}>
                  {i18n.t('collage.undo')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      )}

      {busy && (
        <View style={styles.exportOverlay}>
          <LinearGradient
            colors={['rgba(10,10,30,0.85)', 'rgba(20,20,50,0.90)']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.exportOverlayGradient}>
            <Animated.View
              style={{
                transform: [
                  {
                    scale: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1.05],
                    }),
                  },
                ],
              }}>
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            </Animated.View>
            <Text
              style={[
                styles.exportText,
                {fontFamily: fonts.heading, textAlign},
              ]}>
              {i18n.t('collage.exporting')}
            </Text>
            <Text
              style={[
                styles.exportSubtext,
                {fontFamily: fonts.body, textAlign},
              ]}>
              {i18n.t('collage.exportingSubtitle')}
            </Text>
          </LinearGradient>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  previewShadow: {},
  controlsWrapper: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 20,
  },
  controlGroup: {
    gap: 12,
  },
  controlLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  buttonRow: {
    gap: 12,
    justifyContent: 'center',
  },
  optionButton: {
    minWidth: 80,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  optionButtonActive: {
    borderColor: 'transparent',
    shadowColor: '#4a90e2',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  optionButtonText: {
    fontSize: 18,
    color: '#333',
  },
  optionButtonTextActive: {
    color: '#fff',
  },
  optionButtonSubtext: {
    fontSize: 11,
    color: '#888',
    letterSpacing: 0.5,
  },
  optionButtonSubtextActive: {
    color: 'rgba(255,255,255,0.9)',
  },
  undoContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
    borderRadius: 12,
  },
  undoGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 12,
  },
  undoText: {
    color: '#fff',
    fontSize: 14,
  },
  undoButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  undoButtonGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  undoButtonText: {
    color: '#1a1a2e',
    fontSize: 13,
  },
  exportOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  exportOverlayGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16,
  },
  exportText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  exportSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 4,
  },
});

export default CollageExport;
