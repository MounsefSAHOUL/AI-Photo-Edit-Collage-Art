import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated from 'react-native-reanimated';

type Props = {
  generatingStyle: any;
  palette: any;
  fonts: any;
};

export default function GeneratingView({
  generatingStyle,
  palette,
  fonts,
}: Props) {
  return (
    <View style={styles.step}>
      <View style={styles.generatingContainer}>
        <Animated.View style={generatingStyle}>
          <Ionicons name="sparkles" size={64} color={palette.tint} />
        </Animated.View>
        <Text
          style={[
            styles.generatingTitle,
            {color: palette.text, fontFamily: fonts.heading},
          ]}>
          Génération en cours...
        </Text>
        <Text
          style={[
            styles.generatingSubtitle,
            {color: palette.text + '80', fontFamily: fonts.body},
          ]}>
          L&apos;IA travaille sur votre création
        </Text>
        <View style={styles.generatingProgress}>
          <View style={[styles.progressDot, {backgroundColor: palette.tint}]} />
          <View style={[styles.progressDot, {backgroundColor: palette.tint}]} />
          <View style={[styles.progressDot, {backgroundColor: palette.tint}]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  step: {paddingBottom: 40},
  generatingContainer: {alignItems: 'center', paddingVertical: 60, gap: 20},
  generatingTitle: {fontSize: 20},
  generatingSubtitle: {fontSize: 14, textAlign: 'center'},
  generatingProgress: {flexDirection: 'row', gap: 8, marginTop: 20},
  progressDot: {width: 8, height: 8, borderRadius: 4},
});
