import {Ionicons} from '@expo/vector-icons';
import {StyleSheet, Text, View} from 'react-native';

// Composant EmptyGallery
const EmptyGallery = ({palette, fonts, searchText}: any) => (
  <View style={styles.emptyContainer}>
    <Ionicons name="images-outline" size={64} color={palette.text + '40'} />
    <Text
      style={[
        styles.emptyTitle,
        {color: palette.text, fontFamily: fonts.heading},
      ]}>
      {searchText ? 'Aucun résultat' : 'Galerie vide'}
    </Text>
    <Text
      style={[
        styles.emptySubtitle,
        {color: palette.text + '60', fontFamily: fonts.body},
      ]}>
      {searchText
        ? `Aucune image trouvée pour "${searchText}"`
        : 'Vos créations apparaîtront ici'}
    </Text>
  </View>
);

export default EmptyGallery;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
