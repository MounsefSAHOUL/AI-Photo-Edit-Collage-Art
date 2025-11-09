import {Ionicons} from '@expo/vector-icons';
import {BlurView} from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import {LinearGradient} from 'expo-linear-gradient';
import React, {useCallback, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import {Colors} from '@/constants/theme';
import {useAppTheme} from '@/hooks/useAppTheme';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {useToast} from '@/hooks/useToast';
import {i18n} from '@/i18n/i18n';
import {useUser} from '@/stores/userStore';
import {languageType} from '@/types/global';
import FuturisticBackground from './FuturisticBackground';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Languages available
const LANGUAGES: {code: languageType; name: string; flag: string}[] = [
  {code: 'fr', name: 'Français', flag: '🇫🇷'},
  {code: 'en', name: 'English', flag: '🇺🇸'},
  {code: 'es', name: 'Español', flag: '🇪🇸'},
  {code: 'de', name: 'Deutsch', flag: '🇩🇪'},
  {code: 'it', name: 'Italiano', flag: '🇮🇹'},
  {code: 'pt', name: 'Português', flag: '🇵🇹'},
  {code: 'ar', name: 'العربية', flag: '🇸🇦'},
  {code: 'zh', name: '中文', flag: '🇨🇳'},
  {code: 'ja', name: '日本語', flag: '🇯🇵'},
  {code: 'ru', name: 'Русский', flag: '🇷🇺'},
];

// Available themes
const THEMES = ['light', 'dark'];

interface ProfileScreenProps {
  onClose?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({onClose}) => {
  const {user, setUser} = useUser();
  const {theme, isDark, setTheme} = useAppTheme();
  const {locale, setLocale, fonts} = useLocaleAppearance();
  const {show} = useToast();

  console.log('user profile:', user);

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [isEditingName, setIsEditingName] = useState(false);

  const palette = Colors[theme] || Colors.light;
  const accentColor = palette.tint || '#6D28D9';
  const containerScale = useSharedValue(1);

  // Animations
  const containerStyle = useAnimatedStyle(
    () => ({
      transform: [{scale: containerScale.value}],
    }),
    [],
  );

  const handleImagePicker = useCallback(async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission requise',
        'Nous avons besoin de la permission pour accéder à vos photos.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setUser({avatar: result.assets[0].uri});
      show({message: 'Photo de profil mise à jour', type: 'success'});
    }
  }, [setUser, show]);

  const handleLanguageSelect = useCallback(
    async (lang: languageType) => {
      try {
        await setLocale(lang);
        setUser({lang});
        setShowLanguageModal(false);
        show({
          message: i18n.t('actions.save', {locale: lang}),
          type: 'success',
        });
      } catch {
        show({message: 'Erreur lors du changement de langue', type: 'error'});
      }
    },
    [setLocale, setUser, show],
  );

  const handleThemeSelect = useCallback(
    (selectedTheme: string) => {
      // Set theme directly for light/dark modes
      setTheme(selectedTheme as 'light' | 'dark');
      setUser({theme: selectedTheme});
      setShowThemeModal(false);
      show({message: 'Mode mis à jour', type: 'success'});
    },
    [setTheme, setUser, show],
  );

  const handleSaveName = useCallback(() => {
    if (displayName.trim()) {
      setUser({displayName: displayName.trim()});
      setIsEditingName(false);
      show({message: 'Nom mis à jour', type: 'success'});
    }
  }, [displayName, setUser, show]);

  const toggleSetting = useCallback(
    (setting: 'notification' | 'vibration' | 'sound') => {
      const currentValue = user[setting] ?? true;
      setUser({[setting]: !currentValue});
    },
    [user, setUser],
  );

  const renderSettingItem = useCallback(
    (
      title: string,
      value: string | boolean,
      onPress: () => void,
      icon: string,
      isSwitch = false,
    ) => (
      <AnimatedTouchable
        style={[styles.settingItem, {borderColor: accentColor + '20'}]}
        onPress={isSwitch ? undefined : onPress}
        activeOpacity={0.7}>
        <View style={styles.settingContent}>
          <View style={styles.settingLeft}>
            <View
              style={[
                styles.iconContainer,
                {backgroundColor: accentColor + '20'},
              ]}>
              <Ionicons name={icon as any} size={20} color={accentColor} />
            </View>
            <Text
              style={[
                styles.settingTitle,
                {color: palette.text, fontFamily: fonts.body},
              ]}>
              {title}
            </Text>
          </View>
          {isSwitch ? (
            <Switch
              value={value as boolean}
              onValueChange={onPress}
              trackColor={{false: accentColor + '40', true: accentColor}}
              thumbColor={value ? '#FFFFFF' : '#F4F3F4'}
            />
          ) : (
            <View style={styles.settingRight}>
              <Text
                style={[
                  styles.settingValue,
                  {color: accentColor, fontFamily: fonts.body},
                ]}>
                {value as string}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={accentColor} />
            </View>
          )}
        </View>
      </AnimatedTouchable>
    ),
    [palette, fonts, accentColor],
  );

  return (
    <View style={styles.container}>
      <FuturisticBackground />

      {/* Header */}
      <View style={[styles.header, {borderBottomColor: accentColor + '20'}]}>
        <Text
          style={[
            styles.headerTitle,
            {color: palette.text, fontFamily: fonts.heading},
          ]}>
          {i18n.t('profile.title', {locale})}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, containerStyle]}>
          {/* Profile Picture Section */}
          <View
            style={[
              styles.section,
              {backgroundColor: palette.background + '40'},
            ]}>
            <Text
              style={[
                styles.sectionTitle,
                {color: palette.text, fontFamily: fonts.accent},
              ]}>
              {i18n.t('profile.personalInfo', {locale})}
            </Text>

            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={handleImagePicker}>
              <View style={[styles.avatarWrapper, {borderColor: accentColor}]}>
                {user.avatar ? (
                  <Image source={{uri: user.avatar}} style={styles.avatar} />
                ) : (
                  <LinearGradient
                    colors={[accentColor + '40', accentColor + '20']}
                    style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={40} color={accentColor} />
                  </LinearGradient>
                )}
                <View
                  style={[styles.avatarBadge, {backgroundColor: accentColor}]}>
                  <Ionicons name="camera" size={12} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Display Name */}
            <View style={styles.nameContainer}>
              {isEditingName ? (
                <View style={styles.nameEditContainer}>
                  <TextInput
                    style={[
                      styles.nameInput,
                      {color: palette.text, borderColor: accentColor},
                    ]}
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder={i18n.t('profile.displayName', {locale})}
                    placeholderTextColor={palette.text + '60'}
                    autoFocus
                  />
                  <TouchableOpacity
                    onPress={handleSaveName}
                    style={[styles.saveButton, {backgroundColor: accentColor}]}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsEditingName(true)}
                  style={styles.nameDisplay}>
                  <Text
                    style={[
                      styles.displayName,
                      {color: palette.text, fontFamily: fonts.accent},
                    ]}>
                    {user.displayName || 'Utilisateur'}
                  </Text>
                  <Ionicons name="pencil" size={16} color={accentColor} />
                </TouchableOpacity>
              )}
            </View>

            {/* Membership & Points */}
            <View style={styles.membershipContainer}>
              <View
                style={[
                  styles.membershipBadge,
                  {
                    backgroundColor:
                      user.membership === 'premium'
                        ? '#FFD700'
                        : accentColor + '20',
                  },
                ]}>
                <Text
                  style={[
                    styles.membershipText,
                    {
                      color:
                        user.membership === 'premium' ? '#000' : accentColor,
                    },
                  ]}>
                  {i18n.t(`profile.${user.membership || 'freemium'}`, {locale})}
                </Text>
              </View>
              <Text
                style={[
                  styles.pointsText,
                  {color: palette.text + '80', fontFamily: fonts.body},
                ]}>
                {user.points || 0} {i18n.t('profile.points', {locale})}
              </Text>
            </View>
          </View>

          {/* Preferences Section */}
          <View
            style={[
              styles.section,
              {backgroundColor: palette.background + '40'},
            ]}>
            <Text
              style={[
                styles.sectionTitle,
                {color: palette.text, fontFamily: fonts.accent},
              ]}>
              {i18n.t('profile.preferences', {locale})}
            </Text>

            {renderSettingItem(
              i18n.t('profile.language', {locale}),
              LANGUAGES.find(l => l.code === locale)?.name || 'Français',
              () => setShowLanguageModal(true),
              'language',
            )}

            {renderSettingItem(
              i18n.t('profile.theme', {locale}),
              theme.charAt(0).toUpperCase() + theme.slice(1),
              () => setShowThemeModal(true),
              'color-palette',
            )}

            {renderSettingItem(
              i18n.t('profile.notifications', {locale}),
              user.notification ?? true,
              () => toggleSetting('notification'),
              'notifications',
              true,
            )}

            {renderSettingItem(
              i18n.t('profile.vibration', {locale}),
              user.vibration ?? true,
              () => toggleSetting('vibration'),
              'phone-portrait',
              true,
            )}

            {renderSettingItem(
              i18n.t('profile.sound', {locale}),
              user.sound ?? true,
              () => toggleSetting('sound'),
              'volume-high',
              true,
            )}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Language Modal */}
      <Modal visible={showLanguageModal} transparent animationType="fade">
        <BlurView intensity={20} style={StyleSheet.absoluteFillObject}>
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalContent,
                {backgroundColor: palette.background},
              ]}>
              <Text
                style={[
                  styles.modalTitle,
                  {color: palette.text, fontFamily: fonts.heading},
                ]}>
                {i18n.t('actions.selectLanguage', {locale})}
              </Text>
              <FlatList
                data={LANGUAGES}
                keyExtractor={item => item.code}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      locale === item.code && {
                        backgroundColor: accentColor + '20',
                      },
                    ]}
                    onPress={() => handleLanguageSelect(item.code)}>
                    <Text style={[styles.modalItemText, {color: palette.text}]}>
                      {item.flag} {item.name}
                    </Text>
                    {locale === item.code && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={accentColor}
                      />
                    )}
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={[
                  styles.modalCloseButton,
                  {backgroundColor: accentColor},
                ]}
                onPress={() => setShowLanguageModal(false)}>
                <Text style={[styles.modalCloseText, {fontFamily: fonts.body}]}>
                  {i18n.t('actions.close', {locale})}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Theme Modal */}
      <Modal visible={showThemeModal} transparent animationType="fade">
        <BlurView intensity={20} style={StyleSheet.absoluteFillObject}>
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalContent,
                {backgroundColor: palette.background},
              ]}>
              <Text
                style={[
                  styles.modalTitle,
                  {color: palette.text, fontFamily: fonts.heading},
                ]}>
                {i18n.t('actions.selectTheme', {locale})}
              </Text>
              <FlatList
                data={THEMES}
                keyExtractor={item => item}
                numColumns={2}
                renderItem={({item}) => {
                  const isSelected = theme === item;
                  const isDarkTheme = item === 'dark';
                  const themeLabel = isDarkTheme
                    ? i18n.t('profile.darkMode', {locale})
                    : i18n.t('profile.lightMode', {locale});
                  const themeIcon = isDarkTheme ? 'moon' : 'sunny';
                  const previewColor = isDarkTheme ? '#1A1F3B' : '#E9ECEF';

                  return (
                    <TouchableOpacity
                      style={[
                        styles.themeItem,
                        {
                          backgroundColor: isDarkTheme ? '#1A1A1A' : '#FFFFFF',
                          borderColor: isSelected ? accentColor : 'transparent',
                          borderWidth: isSelected ? 2 : 1,
                        },
                      ]}
                      onPress={() => handleThemeSelect(item)}>
                      {/* Preview du mode */}
                      <View style={styles.themePreviewContainer}>
                        <View
                          style={[
                            styles.themePreview,
                            {
                              backgroundColor: previewColor,
                            },
                          ]}>
                          <Ionicons
                            name={themeIcon as any}
                            size={16}
                            color={isDarkTheme ? '#FFFFFF' : '#333333'}
                          />
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.themeItemText,
                          {
                            color: isDarkTheme ? '#FFFFFF' : '#333333',
                          },
                        ]}>
                        {themeLabel}
                      </Text>
                      {isSelected && (
                        <View style={styles.selectedIndicator}>
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color={accentColor}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
              <TouchableOpacity
                style={[
                  styles.modalCloseButton,
                  {backgroundColor: accentColor},
                ]}
                onPress={() => setShowThemeModal(false)}>
                <Text style={[styles.modalCloseText, {fontFamily: fonts.body}]}>
                  {i18n.t('actions.close', {locale})}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    marginBottom: 160,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    borderWidth: 3,
    borderRadius: 50,
    padding: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContainer: {
    alignItems: 'center',
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  saveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  displayName: {
    fontSize: 18,
  },
  membershipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  membershipBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  membershipText: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  pointsText: {
    fontSize: 14,
  },
  settingItem: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalItemText: {
    fontSize: 16,
  },
  themeItem: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  themePreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themePreviewContainer: {
    marginBottom: 8,
  },
  themeItemText: {
    fontSize: 12,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ProfileScreen;
