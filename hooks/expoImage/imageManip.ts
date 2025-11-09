import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import {useCallback, useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';

export default function useImageManipationHooks() {
  const [error, setError] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const deleteImageFromSystem = useCallback(
    async (src?: string) => {
      if (!src) return;
      setConfirmDelete(false);
      setError('');
      try {
        new FileSystem.File(src).delete();
        setConfirmDelete(true);
        return confirmDelete;
      } catch (e: any) {
        console.warn('failed removing old image', src, e);
        setError('failed removing old image');
        setConfirmDelete(false);
      }
    },
    [confirmDelete],
  );
  const rotate90andFlip = useCallback(
    async (src?: string) => {
      if (!src) return null;
      try {
        const result = await ImageManipulator.manipulateAsync(
          src,
          [
            {rotate: 90},
            // {flip: ImageManipulator.FlipType.Vertical}
          ],
          {compress: 0.9, format: ImageManipulator.SaveFormat.JPEG},
        );
        if (!result?.uri) {
          setError('No URI returned from image manipulation');
          return null;
        }
        await deleteImageFromSystem(src);
        return result.uri;
      } catch (e: any) {
        console.log('error in image manipulation', e);
        setError(String(e?.message ?? e));
        return null;
      }
    },
    [deleteImageFromSystem],
  );
  const cropWithPicker = useCallback(
    async (src?: string) => {
      if (!src) return null;
      setError('');
      try {
        // Modern, futuristic crop picker configuration with advanced options
        const res = await ImagePicker.openCropper({
          // Image path and compression settings
          path: src,
          cropping: true,
          includeExif: false,
          compressImageQuality: 0.92,
          mediaType: 'photo',

          // Futuristic UI/UX enhancements
          freeStyleCropEnabled: true, // Allow custom rectangle cropping with drag/zoom
          showCropGuidelines: true, // Show 3x3 grid for better framing
          showCropFrame: true, // Display the crop frame
          avoidEmptySpaceAroundImage: true, // Image fills the mask space

          // Android-specific futuristic styling (dark/neon theme)
          cropperToolbarColor: '#0a0e27', // Deep navy/dark background
          cropperToolbarWidgetColor: '#00d9ff', // Cyan neon for buttons/text
          cropperActiveWidgetColor: '#00d9ff', // Neon cyan for active elements
          cropperStatusBarLight: false, // Dark status bar for contrast
          cropperNavigationBarLight: false, // Dark navigation bar
          cropperCircleOverlay: true, // Square overlay for precision
          // Custom toolbar title
          cropperToolbarTitle: 'Recadrer Image',
          hideBottomControls: true, // Show advanced controls

          // Rotation support for more flexibility
          enableRotationGesture: true,
        });

        if (res && res.path) {
          await deleteImageFromSystem(src);
          return res.path;
        }
        setError('Aucune image retournée par le recadreur');
        return null;
      } catch (e: any) {
        console.warn('cropWithPicker failed', e);
        setError(String(e?.message ?? e));
        return null;
      }
    },
    [deleteImageFromSystem],
  );
  const cropWithHideBottom = useCallback(
    async (src?: string) => {
      if (!src) return null;
      setError('');
      try {
        const res = await ImagePicker.openCropper({
          // Image path and compression settings
          path: src,
          cropping: true,
          includeExif: false,
          compressImageQuality: 0.92,
          mediaType: 'photo',
          hideBottomControls: true,
        });
        if (res && res.path) {
          await deleteImageFromSystem(src);
          return res.path;
        }
      } catch (e: any) {
        console.warn('cropWithPickerOld failed', e);
        setError(String(e?.message ?? e));
        return null;
      }
    },
    [deleteImageFromSystem],
  );
  return {
    rotate90andFlip,
    cropWithPicker,
    deleteImageFromSystem,
    cropWithHideBottom,
    error,
  };
}
