import {Ionicons} from '@expo/vector-icons';
import {BlurView} from 'expo-blur';
import React from 'react';
import {Image, Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
type Props = {
  visible: boolean;
  onClose: () => void;
  imageUri?: string | null;
};

export default function PreviewModal({visible, onClose, imageUri}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={20} style={StyleSheet.absoluteFillObject}>
        <View style={styles.previewModalContainer}>
          <TouchableOpacity style={styles.closePreviewButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          {imageUri && (
            <Image source={{uri: imageUri}} style={styles.fullPreviewImage} />
          )}
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  fullPreviewImage: {width: '100%', height: '80%', borderRadius: 16},
});
