import React from 'react';
import {StyleSheet, View} from 'react-native';

import ProfileScreen from '@/components/ui/ProfileScreen';

const Profile = () => {
  return (
    <View style={styles.container}>
      <ProfileScreen />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
