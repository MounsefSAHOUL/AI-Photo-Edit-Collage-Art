import {Colors} from '@/constants/theme';
import {formatDate} from '@/lib/utils';
import {Ionicons} from '@expo/vector-icons';
import {useMemo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type ImageDetailModalProps = {
  image: any;
  onClose: () => void;
  onShare: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  palette: any;
  fonts: any;
  locale: string;
};

const ImageDetailModal = ({
  image,
  onClose,
  onShare,
  onDelete,
  onToggleFavorite,
  palette,
  fonts,
  locale,
}: ImageDetailModalProps) => {
  const modelTheme = image.model
    ? (Colors[image.model as keyof typeof Colors] as any)
    : null;

  const formattedDate = useMemo(
    () => formatDate(image.createdAt, locale),
    [image.createdAt, locale],
  );

  console.log('image in modal', image);

  return (
    <View style={[styles.modalContent, {backgroundColor: palette.background}]}>
      {/* Header Modal */}
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={palette.text} />
        </TouchableOpacity>
        <Text
          style={[
            styles.modalTitle,
            {color: palette.text, fontFamily: fonts.heading},
          ]}>
          Détails
        </Text>
        <View style={{width: 24}} />
      </View>

      {/* Image */}
      <Image source={{uri: image.uri}} style={styles.modalImage} />

      {/* Info */}
      <View style={styles.modalInfo}>
        <Text
          style={[
            styles.modalImageTitle,
            {color: palette.text, fontFamily: fonts.accent},
          ]}>
          {image.title}
        </Text>

        <View style={styles.infoRow}>
          <Text
            style={[
              styles.infoLabel,
              {color: palette.text + '80', fontFamily: fonts.body},
            ]}>
            Type:
          </Text>
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor:
                  image.type === 'premium' ? '#FFD700' : palette.tint + '20',
              },
            ]}>
            <Text
              style={[
                styles.typeText,
                {
                  color: image.type === 'premium' ? '#000' : palette.tint,
                  fontFamily: fonts.body,
                },
              ]}>
              {image.type === 'premium' ? 'Premium' : 'Gratuit'}
            </Text>
          </View>
        </View>

        {image.model && modelTheme && (
          <View style={styles.infoRow}>
            <Text
              style={[
                styles.infoLabel,
                {color: palette.text + '80', fontFamily: fonts.body},
              ]}>
              Modèle:
            </Text>
            <View
              style={[
                styles.modelBadge,
                {backgroundColor: modelTheme.accent + '20'},
              ]}>
              <Text
                style={[
                  styles.modelText,
                  {color: modelTheme.accent, fontFamily: fonts.body},
                ]}>
                {image.model}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text
            style={[
              styles.infoLabel,
              {color: palette.text + '80', fontFamily: fonts.body},
            ]}>
            Créé le:
          </Text>
          <Text
            style={[
              styles.infoValue,
              {color: palette.text, fontFamily: fonts.body},
            ]}>
            {' '}
            {formattedDate}{' '}
          </Text>
        </View>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {image.tags.map((tag: string, index: number) => (
            <View
              key={index}
              style={[styles.tag, {backgroundColor: palette.tint + '20'}]}>
              <Text
                style={[
                  styles.tagText,
                  {color: palette.tint, fontFamily: fonts.body},
                ]}>
                #{tag}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.modalActions}>
        <TouchableOpacity
          style={[styles.actionBtn, {backgroundColor: palette.tint + '20'}]}
          onPress={onToggleFavorite}>
          <Ionicons
            name={image.favorite ? 'heart' : 'heart-outline'}
            size={20}
            color={palette.tint}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, {backgroundColor: palette.tint + '20'}]}
          onPress={onShare}>
          <Ionicons name="share-outline" size={20} color={palette.tint} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, {backgroundColor: '#FF3C7E20'}]}
          onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="#FF3C7E" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImageDetailModal;

const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 18,
  },
  modalImage: {
    width: '100%',
    height: 250,
  },
  modalInfo: {
    padding: 20,
  },
  modalImageTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,

    textTransform: 'uppercase',
  },
  modelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modelText: {
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
