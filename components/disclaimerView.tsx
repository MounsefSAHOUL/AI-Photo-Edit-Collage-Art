import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {
  disclaimerSegments,
  handleOpenPrivacy,
  handleOpenTerms,
} from '@/lib/utils';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const DisclaimerView = () => {
  const {locale, fonts} = useLocaleAppearance();
  return (
    <View style={styles.disclaimerView}>
      <Text
        style={[
          styles.disclaimer,
          {textAlign: 'center', fontFamily: fonts.label},
        ]}>
        {disclaimerSegments(locale).map((segment, index) => {
          if (segment.type === 'text') {
            return <Text key={`text-${index}`}>{segment.value}</Text>;
          }
          const onPress =
            segment.type === 'terms' ? handleOpenTerms : handleOpenPrivacy;
          return (
            <Text
              key={`link-${segment.type}-${index}`}
              style={styles.disclaimerLink}
              onPress={onPress}
              suppressHighlighting>
              {segment.value}
            </Text>
          );
        })}
      </Text>
    </View>
  );
};

export default DisclaimerView;

const styles = StyleSheet.create({
  disclaimerView: {
    position: 'absolute',
    bottom: 16,
    left: 12,
    right: 12,
  },
  disclaimer: {
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(235, 235, 255, 0.72)',
  },
  disclaimerLink: {
    color: '#C084FC',
    textDecorationLine: 'underline',
  },
});
