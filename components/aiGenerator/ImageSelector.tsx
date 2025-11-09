import {LocaleFonts} from '@/types/global';
import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  palette: any;
  fonts: LocaleFonts;
  panHandlers?: any;
  onPick: () => void;
};

export default function ImageSelector({
  palette,
  fonts,
  panHandlers,
  onPick,
}: Props) {
  return (
    <View style={styles.step}>
      <TouchableOpacity
        {...(panHandlers || {})}
        style={[
          styles.uploadArea,
          {
            borderColor: palette.tint + '40',
            backgroundColor: palette.background + '40',
          },
        ]}
        onPress={onPick}>
        <Ionicons name="cloud-upload" size={48} color={palette.tint} />
        <Text
          style={[
            styles.uploadTitle,
            {color: palette.text, fontFamily: fonts.accent},
          ]}>
          Ajoutez votre photo
        </Text>
        <Text
          style={[
            styles.uploadSubtitle,
            {color: palette.text + '60', fontFamily: fonts.body},
          ]}>
          Glissez-déposez ou cliquez pour sélectionner
        </Text>
        <View style={[styles.uploadButton, {backgroundColor: palette.tint}]}>
          <Text style={[styles.uploadButtonText, {fontFamily: fonts.body}]}>
            Choisir une image
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  step: {paddingBottom: 40},
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    gap: 16,
  },
  uploadTitle: {fontSize: 18},
  uploadSubtitle: {fontSize: 14, textAlign: 'center'},
  uploadButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  uploadButtonText: {color: '#FFFFFF', fontSize: 14},
});
