import FuturisticBackgroundInner from '@/components/ui/FuturisticBackground';
import {i18n} from '@/i18n/i18n';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import GeneratingView from '@/components/aiGenerator/GeneratingView';
import AGHeader from '@/components/aiGenerator/Header';
import ImageSelector from '@/components/aiGenerator/ImageSelector';
import PreviewModal from '@/components/aiGenerator/PreviewModal';
import ProgressBar from '@/components/aiGenerator/ProgressBar';
import ResultView from '@/components/aiGenerator/ResultView';
import SettingsPanel from '@/components/aiGenerator/SettingsPanel';
import PremiumModels from '@/components/screens/tabs/PremiumModels';
import {Colors} from '@/constants/theme';
import {useAdMob} from '@/hooks/useAdMob';
import {useAppTheme} from '@/hooks/useAppTheme';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {useToast} from '@/hooks/useToast';
import {useUser} from '@/stores/userStore';
import {router} from 'expo-router';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// Modèles IA disponibles
const AI_MODELS = [
  {
    id: 'actionFigure',
    name: 'Action Figure',
    description: "Transforme en figurine d'action",
    theme: 'actionFigure',
    icon: 'game-controller',
    premium: true,
  },
  {
    id: 'funkoPop',
    name: 'Funko Pop',
    description: 'Style Funko Pop coloré',
    theme: 'funkoPop',
    icon: 'happy',
    premium: true,
  },
  {
    id: 'lego',
    name: 'LEGO Style',
    description: 'Rendu style LEGO',
    theme: 'lego',
    icon: 'cube',
    premium: true,
  },
  {
    id: 'barbieDoll',
    name: 'Barbie Doll',
    description: 'Style poupée Barbie',
    theme: 'barbieDoll',
    icon: 'flower',
    premium: true,
  },
  {
    id: 'tradingCard',
    name: 'Trading Card',
    description: 'Carte à collectionner',
    theme: 'tradingCard',
    icon: 'card',
    premium: true,
  },
  {
    id: 'pixelSprite',
    name: 'Pixel Art',
    description: 'Style pixel rétro',
    theme: 'pixelSprite',
    icon: 'grid',
    premium: true,
  },
];

// Étapes du processus
enum GenerationStep {
  SELECT_IMAGE = 'select',
  CHOOSE_MODEL = 'model',
  ADJUST_SETTINGS = 'settings',
  GENERATING = 'generating',
  RESULT = 'result',
}

const AiGenerator = () => {
  const {isDark} = useAppTheme();
  const {showInterstitial} = useAdMob();
  const {fonts, rowDirection, textAlign, locale, isRTL} = useLocaleAppearance();
  const {user, setUser} = useUser();
  const {show} = useToast();

  const [currentStep, setCurrentStep] = useState<GenerationStep>(
    GenerationStep.SELECT_IMAGE,
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Animation values
  const progressValue = useSharedValue(0);
  const generatingRotation = useSharedValue(0);

  const palette = isDark ? Colors.dark : Colors.light;

  // Gestion du drag and drop (simulation)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: () => {},
      onPanResponderRelease: () => {
        if (currentStep === GenerationStep.SELECT_IMAGE) {
          handleImagePicker();
        }
      },
    }),
  ).current;

  const handleImagePicker = useCallback(async () => {
    //comming soon
    router.push('/(modal)/comingSoon');
    return;
  }, [progressValue, show]);

  const handleModelSelect = useCallback(
    (modelId: string) => {
      if (user.membership === 'premium') {
        show({
          message: 'Modèle Premium - Abonnement requis',
          type: 'error',
        });
        return;
      }
      setSelectedModel(modelId);
      setCurrentStep(GenerationStep.ADJUST_SETTINGS);
      progressValue.value = withTiming(0.66);
      show({message: 'Modèle sélectionné', type: 'success'});
    },
    [user.membership, progressValue, show],
  );

  const handleGenerate = useCallback(async () => {
    try {
      await showInterstitial();
    } catch {}
    if (!selectedImage || !selectedModel) return;

    if ((user.points || 0) < 1) {
      show({message: 'Points insuffisants', type: 'error'});
      return;
    }

    setCurrentStep(GenerationStep.GENERATING);
    progressValue.value = withTiming(1);

    // Animation de rotation pendant la génération
    generatingRotation.value = withRepeat(
      withTiming(360, {duration: 2000}),
      -1,
      false,
    );

    // Simulation de génération
    setTimeout(() => {
      setGeneratedImage(`https://picsum.photos/400/400?random=${Date.now()}`);
      setCurrentStep(GenerationStep.RESULT);
      generatingRotation.value = 0;

      // Déduction des points
      setUser({points: (user.points || 0) - 1});
      show({message: 'Génération terminée!', type: 'success'});
    }, 3000);
  }, [
    selectedImage,
    selectedModel,
    user.points,
    progressValue,
    generatingRotation,
    setUser,
    show,
  ]);

  const handleReset = useCallback(() => {
    setCurrentStep(GenerationStep.SELECT_IMAGE);
    setSelectedImage(null);
    setSelectedModel(null);
    setGeneratedImage(null);
    progressValue.value = withTiming(0);
  }, [progressValue]);

  const handleSaveResult = useCallback(() => {
    show({message: 'Image sauvegardée dans la galerie', type: 'success'});
    handleReset();
  }, [show, handleReset]);

  // Animation du progress
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  // Animation de rotation pour la génération
  const generatingStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${generatingRotation.value}deg`}],
  }));

  const progressText =
    currentStep === GenerationStep.SELECT_IMAGE
      ? i18n.t('aiGenerator.progress.selectImage')
      : currentStep === GenerationStep.CHOOSE_MODEL
      ? i18n.t('aiGenerator.progress.chooseModel')
      : currentStep === GenerationStep.ADJUST_SETTINGS
      ? i18n.t('aiGenerator.progress.adjustSettings')
      : currentStep === GenerationStep.GENERATING
      ? i18n.t('aiGenerator.progress.generating')
      : i18n.t('aiGenerator.progress.resultReady');

  const FuturisticBackgroundInnerProps = useMemo(
    () => ({
      BorderFrameLeft: false,
      BorderFrameRight: true,
    }),
    [],
  );
  const AGHeaderPrpos = useMemo(
    () => ({
      rowDirection,
      palette,
      points: user.points || 0,
      fonts,
    }),
    [rowDirection, palette, user.points, fonts],
  );
  const ProgressBarProps = useMemo(
    () => ({
      progressStyle,
      backgroundColor: palette.background,
      fillColor: palette.tint,
      text: progressText,
      fontFamily: fonts.body,
      textColor: palette.text + '80',
    }),
    [progressStyle, palette, progressText, fonts],
  );
  const ImageSelectorProps = useMemo(
    () => ({
      palette,
      fonts,
      panHandlers: panResponder.panHandlers,
      onPick: handleImagePicker,
    }),
    [palette, fonts, panResponder, handleImagePicker],
  );

  const SettingsPanelProps = useMemo(
    () => ({
      palette,
      fonts,
      onGenerate: handleGenerate,
      generatingStyle,
    }),
    [palette, fonts, handleGenerate, generatingStyle],
  );
  const ResultViewProps = useMemo(
    () => ({
      generatedImage,
      selectedImage,
      onPreview: () => setShowPreview(true),
      onReset: handleReset,
      onSave: handleSaveResult,
      palette,
      fonts,
    }),
    [
      generatedImage,
      selectedImage,
      handleReset,
      handleSaveResult,
      palette,
      fonts,
    ],
  );
  const PreviewModalProps = useMemo(
    () => ({
      visible: showPreview,
      onClose: () => setShowPreview(false),
      imageUri: generatedImage,
    }),
    [showPreview, generatedImage],
  );

  const PremiumModelsProps = React.useMemo(
    () => ({
      textAlign,
      fonts,
      locale,
      isDark,
      isRTL,
      onSelectModel: handleModelSelect,
      numberOfModelsToShow: 20,
    }),
    [textAlign, fonts, locale, isDark, isRTL, handleModelSelect],
  );

  return (
    <View style={styles.container}>
      <FuturisticBackgroundInner {...FuturisticBackgroundInnerProps} />
      <AGHeader {...AGHeaderPrpos} />
      <ProgressBar {...ProgressBarProps} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Étape 1: Sélection d'image */}
        {currentStep === GenerationStep.SELECT_IMAGE && (
          <ImageSelector {...ImageSelectorProps} />
        )}

        {/* Étape 2: Choix du modèle */}
        {currentStep === GenerationStep.CHOOSE_MODEL && selectedImage && (
          <PremiumModels {...PremiumModelsProps} />
        )}

        {/* Étape 3: Paramètres */}
        {currentStep === GenerationStep.ADJUST_SETTINGS && selectedModel && (
          <SettingsPanel {...SettingsPanelProps} />
        )}

        {/* Étape 4: Génération */}
        {currentStep === GenerationStep.GENERATING && (
          <GeneratingView {...SettingsPanelProps} />
        )}

        {/* Étape 5: Résultat */}
        {currentStep === GenerationStep.RESULT && generatedImage && (
          <ResultView {...ResultViewProps} />
        )}
        <View style={{height: 160}} />
      </ScrollView>
      {/* Modal de prévisualisation */}
      <PreviewModal {...PreviewModalProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: 16,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  step: {
    paddingBottom: 40,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    gap: 16,
  },
  uploadTitle: {
    fontSize: 18,
  },
  uploadSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  uploadButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  imagePreview: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 24,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  changeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  modelsGrid: {
    gap: 16,
  },

  settingsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  generatingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 20,
  },
  generatingTitle: {
    fontSize: 20,
  },
  generatingSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  generatingProgress: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resultContainer: {
    marginBottom: 24,
  },
  comparisonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  comparisonItem: {
    flex: 1,
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  comparisonImage: {
    width: (SCREEN_WIDTH - 80) / 2.5,
    height: (SCREEN_WIDTH - 80) / 2.5,
    borderRadius: 12,
  },
  arrow: {
    marginHorizontal: 16,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
  },
  previewModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closePreviewButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  fullPreviewImage: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_WIDTH - 40,
    borderRadius: 16,
  },
});

export default AiGenerator;
