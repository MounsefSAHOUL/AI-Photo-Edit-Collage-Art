import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {i18n} from '@/i18n/i18n';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface CollageActionButtonsProps {
  onDelete: () => void;
  onSave: () => void;
  onShare: () => void;
  disabled?: boolean;
}

export const CollageActionButtons: React.FC<CollageActionButtonsProps> = ({
  onDelete,
  onSave,
  onShare,
  disabled,
}) => {
  const {fonts, textAlign} = useLocaleAppearance();

  return (
    <View style={styles.container}>
      {/* Primary Action - Save (most important) */}
      <TouchableOpacity
        style={styles.primaryButtonWrapper}
        onPress={onSave}
        activeOpacity={0.8}
        disabled={disabled}>
        <LinearGradient
          colors={['#10b981', '#059669', '#047857']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.primaryButton}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="content-save"
              size={24}
              color="#fff"
            />
          </View>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.primaryButtonText,
                {fontFamily: fonts.heading, textAlign},
              ]}>
              {i18n.t('actions.save')}
            </Text>
            <Text
              style={[
                styles.primaryButtonSubtext,
                {fontFamily: fonts.body, textAlign},
              ]}>
              {i18n.t('collage.saveHD')}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Secondary Actions */}
      <View style={styles.secondaryActions}>
        {/* Share button */}
        <TouchableOpacity
          style={styles.secondaryButtonWrapper}
          onPress={onShare}
          activeOpacity={0.8}
          disabled={disabled}>
          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.secondaryButton}>
            <MaterialCommunityIcons
              name="share-variant"
              size={22}
              color="#fff"
            />
            <Text
              style={[
                styles.secondaryButtonText,
                {fontFamily: fonts.label, textAlign},
              ]}>
              {i18n.t('actions.share')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Delete button */}
        <TouchableOpacity
          style={styles.secondaryButtonWrapper}
          onPress={onDelete}
          activeOpacity={0.8}
          disabled={disabled}>
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.secondaryButton}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={22}
              color="#fff"
            />
            <Text
              style={[
                styles.secondaryButtonText,
                {fontFamily: fonts.label, textAlign},
              ]}>
              {i18n.t('actions.delete')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 34,
    gap: 12,
  },
  // Primary action button (Save)
  primaryButtonWrapper: {
    marginBottom: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 16,
    shadowColor: '#10b981',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  primaryButtonText: {
    fontSize: 17,
    color: '#fff',
    letterSpacing: 0.3,
  },
  primaryButtonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.2,
  },
  // Secondary actions (Share, Delete)
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButtonWrapper: {
    flex: 1,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#fff',
    letterSpacing: 0.3,
  },
});
