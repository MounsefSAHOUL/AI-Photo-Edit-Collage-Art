import {Ionicons} from '@expo/vector-icons';
import {StyleSheet, Text, View} from 'react-native';

// Composant SettingItem
type SettingItemProps = {
  title: string;
  value: string;
  icon: any;
  palette: any;
  fonts: any;
};

function SettingItem({title, value, icon, palette, fonts}: SettingItemProps) {
  return (
    <View style={[styles.settingItem, {borderColor: palette.tint + '20'}]}>
      <View style={styles.settingLeft}>
        <View
          style={[styles.settingIcon, {backgroundColor: palette.tint + '20'}]}>
          <Ionicons name={icon as any} size={20} color={palette.tint} />
        </View>
        <Text
          style={[
            styles.settingTitle,
            {color: palette.text, fontFamily: fonts.body},
          ]}>
          {title}
        </Text>
      </View>
      <Text
        style={[
          styles.settingValue,
          {color: palette.tint, fontFamily: fonts.accent},
        ]}>
        {value}
      </Text>
    </View>
  );
}

export default SettingItem;

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
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
  settingValue: {
    fontSize: 14,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
});
