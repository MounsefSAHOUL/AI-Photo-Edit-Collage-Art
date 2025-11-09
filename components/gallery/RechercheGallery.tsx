import {i18n} from '@/i18n/i18n';
import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';

type Props = {
  searchText: string;
  setSearchText: (text: string) => void;
  palette: any;
  fonts: any;
  locale: string;
};

const RechercheGallery = ({
  searchText,
  setSearchText,
  palette,
  fonts,
  locale,
}: Props) => {
  return (
    <View style={styles.searchSection}>
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: palette.background + '80',
            borderColor: palette.tint + '20',
          },
        ]}>
        <Ionicons name="search" size={20} color={palette.text + '60'} />
        <TextInput
          style={[
            styles.searchInput,
            {color: palette.text, fontFamily: fonts.body},
          ]}
          placeholder={i18n.t('gallery.searchPlaceholder', {locale})}
          placeholderTextColor={palette.text + '60'}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons
              name="close-circle"
              size={20}
              color={palette.text + '60'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default RechercheGallery;

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
});
