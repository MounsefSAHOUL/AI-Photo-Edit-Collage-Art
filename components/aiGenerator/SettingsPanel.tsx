import SettingItem from '@/components/aiGenerator/SettingItem';
import {LocaleFonts} from '@/types/global';
import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  palette: any;
  fonts: LocaleFonts;
  onGenerate: () => void;
};

export default function SettingsPanel({palette, fonts, onGenerate}: Props) {
  return (
    <View style={styles.step}>
      <Text
        style={[
          styles.stepTitle,
          {color: palette.text, fontFamily: fonts.heading},
        ]}>
        Paramètres de génération
      </Text>

      <View style={styles.settingsContainer}>
        <SettingItem
          title="Intensité du style"
          value="Élevée"
          icon="options"
          palette={palette}
          fonts={fonts}
        />
        <SettingItem
          title="Qualité"
          value="HD"
          icon="diamond"
          palette={palette}
          fonts={fonts}
        />
        <SettingItem
          title="Ratio d'aspect"
          value="1:1"
          icon="crop"
          palette={palette}
          fonts={fonts}
        />
      </View>

      <TouchableOpacity
        style={[styles.generateButton, {backgroundColor: palette.tint}]}
        onPress={onGenerate}>
        <Ionicons name="sparkles" size={20} color="#FFFFFF" />
        <Text style={[styles.generateButtonText, {fontFamily: fonts.accent}]}>
          Générer avec l&apos;IA
        </Text>
      </TouchableOpacity>
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
  settingsContainer: {gap: 16, marginBottom: 24},
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  generateButtonText: {color: '#FFFFFF', fontSize: 16},
});
