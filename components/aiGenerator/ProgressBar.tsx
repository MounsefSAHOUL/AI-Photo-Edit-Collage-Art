import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated from 'react-native-reanimated';

type Props = {
  progressStyle: any;
  backgroundColor: string;
  fillColor: string;
  text: string;
  fontFamily?: string;
  textColor?: string;
};

export default function ProgressBar({progressStyle, backgroundColor, fillColor, text, fontFamily, textColor}: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, {backgroundColor}]}>
        <Animated.View style={[styles.progressFill, {backgroundColor: fillColor}, progressStyle]} />
      </View>
      <Text style={[styles.progressText, {fontFamily, color: textColor}]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {paddingHorizontal: 20, marginBottom: 20},
  progressBar: {height: 4, borderRadius: 2, overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: 2},
  progressText: {fontSize: 12, marginTop: 8, textAlign: 'center'},
});
