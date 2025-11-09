import {COLORS} from '@/constants/collage';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {i18n} from '@/i18n/i18n';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {router} from 'expo-router';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface CollageHeaderProps {
  isDark?: boolean;
}

export const CollageHeader: React.FC<CollageHeaderProps> = ({isDark}) => {
  const {fonts, textAlign} = useLocaleAppearance();
  return (
    <View
      style={[
        styles.header,
        {borderBottomColor: isDark ? '#a855f7' : '#FFFFFF'},
      ]}>
      <TouchableOpacity
        style={[
          styles.closeBtn,
          {backgroundColor: isDark ? '#a855f7' : '#FFFFFF'},
        ]}
        onPress={() => router.back()}
        activeOpacity={0.8}>
        <MaterialCommunityIcons
          name="close"
          size={24}
          color={isDark ? COLORS.text : '#a855f7'}
        />
      </TouchableOpacity>
      <Text
        style={[
          styles.headerTitle,
          {fontFamily: fonts.heading, textAlign: textAlign},
        ]}>
        {i18n.t('screens.createCollage')}
      </Text>
      <View style={styles.spacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 2,
  },
  headerTitle: {
    fontSize: 20,
    flex: 1,
    textAlign: 'center',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 5,
    marginRight: 12,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.1)',
    elevation: 12,
  },
  spacer: {
    width: 40,
  },
});
