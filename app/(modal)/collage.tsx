import CollageExport from '@/components/collage/CollageExport';
import {CollageHeader} from '@/components/collage/CollageHeader';
import {CollageStep} from '@/components/collage/CollageStep';
import {StepsIndicator} from '@/components/collage/StepsIndicator';
import CollageImagePicker from '@/components/CollageImagePicker';
import GridLayoutList from '@/components/GridLayoutList';
import FuturisticBackgroundInner from '@/components/ui/FuturisticBackground';
import {STEP_CONFIG} from '@/constants/collage';
import {getGridLayouts} from '@/constants/grid';
import {useAdMob} from '@/hooks/useAdMob';
import {useAppTheme} from '@/hooks/useAppTheme';
import {useCollageAnimation} from '@/hooks/useCollageAnimation';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {useToast} from '@/hooks/useToast';
import {i18n} from '@/i18n/i18n';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {captureRef} from 'react-native-view-shot';

const Collage = () => {
  const {showInterstitial} = useAdMob();
  const {isDark} = useAppTheme();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [imagesMap, setImagesMap] = useState<Record<number, string> | null>(
    null,
  );
  const previewRef = useRef<any>(null);
  const {show} = useToast();
  const [busy, setBusy] = useState(false);
  const [exportScale, setExportScale] = useState<number>(2);
  const [lastDeleted, setLastDeleted] = useState<null | {
    images: any | null;
    selectedId: string | null;
  }>(null);
  const undoTimerRef = useRef<number | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const {fonts, textAlign, rowDirection, isRTL} = useLocaleAppearance();

  const layouts = useMemo(() => getGridLayouts(), []);
  const layout = useMemo(
    () => layouts.find(l => l.id === selectedId),
    [layouts, selectedId],
  );

  const SCREEN_WIDTH = Dimensions.get('window').width;

  // compute preview geometry (similar to CollageImagePicker)
  const {cellSize, containerWidth, containerHeight, regions} = useMemo(() => {
    if (!layout)
      return {
        cellSize: 64,
        containerWidth: 240,
        containerHeight: 240,
        regions: [] as any[],
      };
    const GAP = 8;
    const rows = layout.layout.length;
    const cols = layout.layout[0]?.length || 0;
    const maxWidth = Math.min(520, SCREEN_WIDTH * 0.9);
    const maxHeight = 600;
    const _cellSize = Math.max(
      60,
      Math.min(
        220,
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

    const _covered: boolean[][] = Array.from({length: rows}, () =>
      Array(cols).fill(false),
    );
    const _regions: {
      id: number;
      r: number;
      c: number;
      rowspan: number;
      colspan: number;
    }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (_covered[r][c]) continue;
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
          for (let cc = c; cc < c + colspan; cc++) _covered[rr][cc] = true;
        _regions.push({id, r, c, rowspan, colspan});
      }
    }

    return {
      cellSize: _cellSize,
      containerWidth: width,
      containerHeight: height,
      regions: _regions,
    };
  }, [layout, SCREEN_WIDTH]);

  // Hook personnalisé pour les animations
  const {showPicker} = useCollageAnimation(selectedId);

  // Déterminer l'étape actuelle
  const currentStep = !selectedId ? 1 : !imagesMap ? 2 : 3;

  // Handlers pour les boutons d'action
  const captureAndGetFile = async (scale = 3) => {
    if (!previewRef.current) throw new Error('Aucune preview disponible');
    // capture at higher resolution
    const opts = {
      format: 'png' as const,
      quality: 1,
      result: 'tmpfile' as const,
      width: Math.round(containerWidth * scale),
      height: Math.round(containerHeight * scale),
    };
    return await captureRef(previewRef.current, opts);
  };

  const handleSave = async () => {
    try {
      await showInterstitial();
    } catch {}
    try {
      setBusy(true);
      // animate progress (indeterminate feel)
      progress.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(progress, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(progress, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
      const perm = await MediaLibrary.requestPermissionsAsync();
      if (!perm.granted) {
        show({
          message: i18n.t('collage.save_permission_denied'),
          type: 'error',
        });
        return;
      }
      const uri = await captureAndGetFile(exportScale);
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('AI Collages', asset, false).catch(
        () => {},
      );
      show({message: i18n.t('collage.saved_to_library'), type: 'success'});
    } catch (e: any) {
      console.warn('save failed', e);
      show({message: String(e?.message ?? e), type: 'error'});
    } finally {
      setBusy(false);
      progress.stopAnimation();
    }
  };

  const handleShare = async () => {
    try {
      await showInterstitial();
    } catch {}
    try {
      setBusy(true);
      progress.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(progress, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(progress, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
      const uri = await captureAndGetFile(2);
      if (!(await Sharing.isAvailableAsync())) {
        show({message: i18n.t('collage.share_unavailable'), type: 'error'});
        return;
      }
      await Sharing.shareAsync(uri);
    } catch (e: any) {
      console.warn('share failed', e);
      show({message: String(e?.message ?? e), type: 'error'});
    } finally {
      setBusy(false);
      progress.stopAnimation();
    }
  };

  // delete with undo: keep lastDeleted for 6s
  const handleDelete = () => {
    if (!imagesMap && !selectedId) return;
    setLastDeleted({images: imagesMap, selectedId});
    setImagesMap(null);
    setSelectedId(null);
    show({message: i18n.t('collage.deleted_to_trash'), type: 'info'});
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => {
      setLastDeleted(null);
      undoTimerRef.current = null;
    }, 6000) as unknown as number;
  };

  const handleUndoDelete = () => {
    if (!lastDeleted) return;
    setImagesMap(lastDeleted.images);
    setSelectedId(lastDeleted.selectedId);
    setLastDeleted(null);
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
    show({message: i18n.t('collage.delete_undone'), type: 'success'});
  };

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  const CollageStepOneProps = useMemo(
    () => ({
      stepNumber: 1,
      isDark,
      title: STEP_CONFIG[0].title,
      subtitle: STEP_CONFIG[0].subtitle,
      color: STEP_CONFIG[0].color,
      colorLight: STEP_CONFIG[0].colorLight,
      icon: selectedId
        ? STEP_CONFIG[0].iconComplete
        : STEP_CONFIG[0].iconDefault,

      fonts,
      isRTL,
      textAlign,
      rowDirection,
      selectedId: selectedId,
    }),
    [isDark, selectedId, fonts, isRTL, textAlign, rowDirection],
  );

  const CollageStepTwoProps = useMemo(
    () => ({
      stepNumber: 2,
      isDark,
      title: STEP_CONFIG[1].title,
      subtitle: STEP_CONFIG[1].subtitle,
      color: STEP_CONFIG[1].color,
      colorLight: STEP_CONFIG[1].colorLight,
      icon: selectedId
        ? STEP_CONFIG[1].iconComplete
        : STEP_CONFIG[1].iconDefault,
      fonts,
      isRTL,
      textAlign,
      rowDirection,
      selectedId: selectedId,
    }),
    [isDark, selectedId, fonts, isRTL, textAlign, rowDirection],
  );

  const CollageStepThreeProps = useMemo(
    () => ({
      stepNumber: 3,
      isDark,
      title: STEP_CONFIG[2].title,
      subtitle: STEP_CONFIG[2].subtitle,
      color: STEP_CONFIG[2].color,
      colorLight: STEP_CONFIG[2].colorLight,
      icon: selectedId
        ? STEP_CONFIG[2].iconComplete
        : STEP_CONFIG[2].iconDefault,
      fonts,
      isRTL,
      textAlign,
      rowDirection,
      selectedId: selectedId,
    }),
    [isDark, selectedId, fonts, isRTL, textAlign, rowDirection],
  );

  return (
    <View style={styles.rootContainer}>
      <FuturisticBackgroundInner />

      <CollageHeader isDark={isDark} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{minHeight: '100%'}}
        showsVerticalScrollIndicator={false}>
        <StepsIndicator currentStep={currentStep} isDark={isDark} />

        {/* Étape 1: Choisir Layout */}
        <CollageStep {...CollageStepOneProps}>
          <GridLayoutList
            selectedId={selectedId}
            onSelect={id => setSelectedId(prev => (prev === id ? null : id))}
          />
        </CollageStep>

        {/* Étape 2: Remplir les Images */}
        {showPicker && selectedId && (
          <CollageStep {...CollageStepTwoProps}>
            <CollageImagePicker
              layoutId={selectedId}
              onBack={() => setSelectedId(null)}
              onComplete={images => setImagesMap(images)}
            />
          </CollageStep>
        )}

        {/* Étape 3: Sauvegarder/Partager */}
        {selectedId && imagesMap && Object.keys(imagesMap).length > 0 && (
          <CollageStep {...CollageStepThreeProps}>
            <CollageExport
              previewRef={previewRef}
              selectedId={selectedId}
              imagesMap={imagesMap}
              layout={layout}
              regions={regions}
              cellSize={cellSize}
              containerWidth={containerWidth}
              containerHeight={containerHeight}
              isDark={isDark}
              exportScale={exportScale}
              setExportScale={setExportScale}
              busy={busy}
              onSave={handleSave}
              onShare={handleShare}
              onDelete={handleDelete}
              onUndoDelete={handleUndoDelete}
              lastDeleted={lastDeleted}
              progress={progress}
            />
          </CollageStep>
        )}

        <View style={styles.spacerBottom} />
      </ScrollView>
    </View>
  );
};

export default Collage;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    minHeight: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  spacerBottom: {
    height: 40,
  },
});
