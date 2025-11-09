import {LocaleFonts} from '@/types/global';
import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  generatedImage: string | null;
  selectedImage: string | null;
  onPreview: () => void;
  onReset: () => void;
  onSave: () => void;
  palette: any;
  fonts: LocaleFonts;
};

export default function ResultView({
  generatedImage,
  selectedImage,
  onPreview,
  onReset,
  onSave,
  palette,
  fonts,
}: Props) {
  return (
    <View style={styles.step}>
      <Text
        style={[
          styles.stepTitle,
          {color: palette.text, fontFamily: fonts.heading},
        ]}>
        Votre création
      </Text>

      <View style={styles.resultContainer}>
        <View style={styles.comparisonView}>
          <View style={styles.comparisonItem}>
            <Text
              style={[
                styles.comparisonLabel,
                {color: palette.text + '80', fontFamily: fonts.body},
              ]}>
              Original
            </Text>
            <Image
              source={{uri: selectedImage!}}
              style={styles.comparisonImage}
            />
          </View>

          <View style={styles.arrow}>
            <Ionicons name="arrow-forward" size={24} color={palette.tint} />
          </View>

          <View style={styles.comparisonItem}>
            <Text
              style={[
                styles.comparisonLabel,
                {color: palette.text + '80', fontFamily: fonts.body},
              ]}>
              IA Générée
            </Text>
            <TouchableOpacity onPress={onPreview}>
              <Image
                source={{uri: generatedImage!}}
                style={styles.comparisonImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.resultActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {backgroundColor: palette.background, borderColor: palette.tint},
          ]}
          onPress={onReset}>
          <Ionicons name="refresh" size={20} color={palette.tint} />
          <Text
            style={[
              styles.actionButtonText,
              {color: palette.tint, fontFamily: fonts.body},
            ]}>
            Recommencer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: palette.tint}]}
          onPress={onSave}>
          <Ionicons name="download" size={20} color="#FFFFFF" />
          <Text
            style={[
              styles.actionButtonText,
              {color: '#FFFFFF', fontFamily: fonts.body},
            ]}>
            Sauvegarder
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  step: {paddingBottom: 40},
  stepTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  resultContainer: {marginBottom: 24},
  comparisonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  comparisonItem: {flex: 1, alignItems: 'center'},
  comparisonLabel: {
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  comparisonImage: {width: 140, height: 140, borderRadius: 12},
  arrow: {marginHorizontal: 16},
  resultActions: {flexDirection: 'row', gap: 12},
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
  actionButtonText: {fontSize: 14},
});
