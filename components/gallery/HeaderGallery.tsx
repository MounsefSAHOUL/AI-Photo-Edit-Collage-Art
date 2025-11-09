import {i18n} from '@/i18n/i18n';
import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  rowDirection: 'row' | 'row-reverse';
  palette: any;
  fonts: any;
  locale: string;
  filteredImages: any[];
  imagesLabel: string;
  isRTL: boolean;
  isGridView: boolean;
  setIsGridView: (value: boolean) => void;
  show: (options: {
    message: string;
    type: 'info' | 'error' | 'success';
  }) => void;
};

const HeaderGallery = ({
  rowDirection,
  palette,
  fonts,
  locale,
  filteredImages,
  imagesLabel,
  isRTL,
  isGridView,
  setIsGridView,
  show,
}: Props) => {
  return (
    <View style={[styles.header, {flexDirection: rowDirection}]}>
      <View>
        <Text
          style={[
            styles.headerTitle,
            {color: palette.text, fontFamily: fonts.heading},
          ]}>
          {i18n.t('gallery.title', {locale})}
        </Text>
        <Text
          style={[
            styles.headerSubtitle,

            {
              color: palette.text + '80',
              fontFamily: fonts.body,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}>
          {filteredImages.length} {imagesLabel}
        </Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: palette.background}]}
          onPress={() => setIsGridView(!isGridView)}>
          <Ionicons
            name={isGridView ? 'list' : 'grid'}
            size={20}
            color={palette.tint}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: palette.background}]}
          onPress={() =>
            show({
              message: i18n.t('gallery.sortByDate', {locale}),
              type: 'info',
            })
          }>
          <Ionicons name="filter" size={20} color={palette.tint} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderGallery;

const styles = StyleSheet.create({
  header: {
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
