import {getGridLayouts} from '@/constants/grid';
import useImageManipationHooks from '@/hooks/expoImage/imageManip';
import {useAppTheme} from '@/hooks/useAppTheme';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {useToast} from '@/hooks/useToast';
import {i18n} from '@/i18n/i18n';
import {EvilIcons, Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
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
import GradientBg from './collage/GradientBg';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const GAP = 8;
const MAX_WIDTH = 380;
const MAX_HEIGHT = 540;
const MIN_HEIGHT = 320;

type Props = {
  layoutId: string;
  onComplete: (images: Record<number, string>) => void;
  onBack?: () => void;
};

export default function CollageImagePicker({
  layoutId,
  onComplete,
  onBack,
}: Props) {
  const {fonts, textAlign} = useLocaleAppearance();
  const {isDark} = useAppTheme();

  const layouts = useMemo(() => getGridLayouts(), []);
  const layout = layouts.find(l => l.id === layoutId);
  const [images, setImages] = useState<Record<number, string>>({});
  const instanceIdRef = useRef<string>(Math.random().toString(36).slice(2, 9));
  const {rotate90andFlip, cropWithPicker, error, deleteImageFromSystem} =
    useImageManipationHooks();
  const {show} = useToast();

  const regions = useMemo(() => {
    if (!layout)
      return [] as {
        id: number;
        r: number;
        c: number;
        rowspan: number;
        colspan: number;
      }[];
    const rows = layout.layout.length;
    const cols = layout.layout[0]?.length || 0;
    const covered: boolean[][] = Array.from({length: rows}, () =>
      Array(cols).fill(false),
    );
    const res: {
      id: number;
      r: number;
      c: number;
      rowspan: number;
      colspan: number;
    }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (covered[r][c]) continue;
        const id = layout.layout[r][c];
        let colspan = 1;
        for (let cc = c + 1; cc < cols; cc++) {
          if (layout.layout[r][cc] === id) colspan++;
          else break;
        }
        let rowspan = 1;
        for (let rr = r + 1; rr < rows; rr++) {
          let ok = true;
          for (let cc = c; cc < c + colspan; cc++) {
            if (layout.layout[rr][cc] !== id) {
              ok = false;
              break;
            }
          }
          if (ok) rowspan++;
          else break;
        }
        for (let rr = r; rr < r + rowspan; rr++)
          for (let cc = c; cc < c + colspan; cc++) covered[rr][cc] = true;
        res.push({id, r, c, rowspan, colspan});
      }
    }
    return res;
  }, [layout]);

  const pickFor = useCallback(async (regionId: number) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      //allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri =
        (result.assets && result.assets[0] && result.assets[0].uri) ||
        undefined;
      if (uri) {
        setImages(prev => ({...prev, [regionId]: uri}));
      }
    }
  }, []);

  const rotateImage = async (regionId: number) => {
    const src = images[regionId];
    if (!src) return;
    const newUri = await rotate90andFlip(src);
    if (newUri) {
      setImages(prev => ({...prev, [regionId]: newUri}));
      console.log('newUri', newUri, error);
    }
    if (error) {
      show({
        message: error,
        type: 'error',
      });
    }
  };

  const cropImage = async (regionId: number) => {
    const src = images[regionId];
    if (!src) return;
    try {
      const newUri = await cropWithPicker(src);
      if (newUri) {
        setImages(prev => ({...prev, [regionId]: newUri}));
        show({
          message: 'Image cropped successfully',
          type: 'success',
        });
      }
      if (error) {
        show({message: error, type: 'error'});
      }
    } catch (e: any) {
      console.warn('cropImage failed', e);
      show({message: String(e?.message ?? e), type: 'error'});
    }
  };

  const deleteImage = useCallback(
    async (regionId: number) => {
      const confirmation = await deleteImageFromSystem(images[regionId]);
      console.log('deleteImage confirmation:', confirmation, error);
      if (confirmation) {
        show({
          message: 'Image deleted successfully',
          type: 'success',
        });
      }
      if (error) {
        show({
          message: error,
          type: 'error',
        });
      }
      setImages(prev => {
        const copy = {...prev};
        delete copy[regionId];
        return copy;
      });
    },
    [deleteImageFromSystem, error, images, show],
  );

  const {cellSize, containerWidth, containerHeight} = useMemo(() => {
    if (!layout)
      return {
        cellSize: 64,
        containerWidth: 240,
        containerHeight: 240,
      };
    const rows = layout.layout.length;
    const cols = layout.layout[0]?.length || 0;
    const maxWidth = Math.min(MAX_WIDTH, SCREEN_WIDTH * 0.8);
    const maxHeight = MAX_HEIGHT;
    const _cellSize = Math.max(
      50,
      Math.min(
        140,
        Math.floor(
          Math.min(
            (maxWidth - (cols - 1) * GAP) / cols,
            (maxHeight - (rows - 1) * GAP) / rows,
          ),
        ),
      ),
    );
    const width = cols * _cellSize + (cols - 1) * GAP;
    const height = rows * _cellSize + (rows - 1) * GAP;
    return {
      cellSize: _cellSize,
      containerWidth: width,
      containerHeight: height,
    };
  }, [layout]);

  // Inform parent whenever images change so the parent can react (show buttons)
  React.useEffect(() => {
    if (onComplete) onComplete(images);
  }, [images, onComplete]);

  if (!layout) {
    return (
      <View style={styles.container}>
        <Text style={{fontFamily: fonts?.body}}>Layout Available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.bgWrapper}>
          <GradientBg selected isDark={isDark} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginBottom: 12,
          }}>
          <Text
            style={[
              styles.title,
              {fontFamily: fonts?.heading, textAlign, marginBottom: 0, flex: 1},
            ]}>
            {i18n.t(layout?.nameKey || '', {locale: i18n.locale}) ||
              layout?.name}
          </Text>
        </View>
        <View
          style={{
            width: containerWidth,
            minHeight: MIN_HEIGHT,
            height: containerHeight,
            position: 'relative',
            alignSelf: 'center',
          }}>
          {regions.map((reg, idx) => {
            const left = reg.c * (cellSize + GAP);
            const top = reg.r * (cellSize + GAP);
            const w = reg.colspan * cellSize + (reg.colspan - 1) * GAP;
            const h = reg.rowspan * cellSize + (reg.rowspan - 1) * GAP;
            const uri = images[reg.id];
            const vb = layout.mask?.viewBoxSize ?? 100;
            const clipId = `clip-${layoutId}-${instanceIdRef.current}-${idx}`;
            const adjRadius =
              layout.shape === 'circle'
                ? Math.min(w, h) / 2
                : Math.round(Math.min(w, h) * 0.12);

            // ✨ Overlay Actions Component
            const renderActions = () => (
              <>
                <TouchableOpacity
                  onPress={() => cropImage(reg.id)}
                  style={[
                    styles.overlayBtn,
                    {right: 75},
                    isDark ? styles.overlayDark : styles.overlayLight,
                  ]}>
                  <MaterialCommunityIcons
                    name="resize"
                    size={16}
                    color={isDark ? '#fff' : '#111'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => rotateImage(reg.id)}
                  style={[
                    styles.overlayBtn,
                    {right: 40},
                    isDark ? styles.overlayDark : styles.overlayLight,
                  ]}>
                  <Feather
                    name="rotate-cw"
                    size={16}
                    color={isDark ? '#fff' : '#111'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteImage(reg.id)}
                  style={[
                    styles.overlayBtn,
                    {right: 6},
                    isDark ? styles.overlayDark : styles.overlayLight,
                  ]}>
                  <EvilIcons
                    name="close"
                    size={16}
                    color={isDark ? '#fff' : '#111'}
                  />
                </TouchableOpacity>
              </>
            );

            // ✨ Empty State Component
            const renderEmptyState = (size: number) => (
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 5,
                }}>
                <MaterialCommunityIcons
                  name="image-plus"
                  size={Math.max(32, size * 0.3)}
                  color={isDark ? '#666' : '#ccc'}
                  style={{marginBottom: 8}}
                />
                {/* <Text
                  style={{
                    fontSize: Math.max(10, size * 0.15),
                    color: isDark ? '#888' : '#999',
                    fontFamily: fonts?.body,
                    textAlign: 'center',
                  }}>
                  Importer 
                </Text> */}
              </View>
            );

            // ✨ Masked SVG Cell
            if (layout.mask?.path) {
              const size = Math.min(w, h);
              // console.log('rendering masked cell', size, w, h);
              return (
                <TouchableOpacity
                  key={`reg-${idx}`}
                  onPress={() => pickFor(reg.id)}
                  style={{
                    position:
                      layout.layout.length === 1 ? 'relative' : 'absolute',
                    left: layout.layout.length > 1 ? left : undefined,
                    top: layout.layout.length > 1 ? top : undefined,
                    width: w,
                    height: h,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf:
                      layout.layout.length === 1 ? 'center' : undefined,
                  }}>
                  <Svg
                    width={size + 160}
                    height={size + 160}
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
                        fill={
                          isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
                        }
                        stroke={isDark ? '#666' : '#ddd'}
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        clipPath={`url(#${clipId})`}
                      />
                    )}
                  </Svg>
                  {!uri && renderEmptyState(size)}
                  {uri && renderActions()}
                </TouchableOpacity>
              );
            }

            // ✨ Plain Rectangular Cell
            return (
              <TouchableOpacity
                key={`reg-${idx}`}
                onPress={() => pickFor(reg.id)}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width: w,
                  height: h,
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.02)',
                  borderRadius: adjRadius,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: uri ? 1 : 2,
                  borderColor: uri
                    ? isDark
                      ? 'rgba(255,255,255,0.15)'
                      : 'rgba(0,0,0,0.1)'
                    : isDark
                    ? '#555'
                    : '#ddd',
                  borderStyle: uri ? 'solid' : 'dashed',
                }}>
                {uri ? (
                  <>
                    <Svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none">
                      <SvgImage
                        href={{uri}}
                        x="0"
                        y="0"
                        width="100"
                        height="100"
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </Svg>
                    {renderActions()}
                  </>
                ) : (
                  renderEmptyState(Math.min(w, h))
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  bgWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  title: {
    fontSize: 14,
    marginBottom: 16,
    zIndex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    width: '100%',
    gap: 12,
  },
  btn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  overlayBtn: {
    position: 'absolute',
    top: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    zIndex: 20,
    elevation: 3,
  },
  overlayDark: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderColor: 'rgba(255,255,255,0.12)',
  },
  overlayLight: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: 'rgba(0,0,0,0.08)',
  },
});
