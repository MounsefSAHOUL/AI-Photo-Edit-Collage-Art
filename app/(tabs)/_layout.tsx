import {Redirect, Tabs} from 'expo-router';
import React from 'react';

import GalacticTabBar from '@/components/ui/GalacticTabBar';
import {useLocaleAppearance} from '@/hooks/useLocaleAppearance';
import {i18n} from '@/i18n/i18n';
import {useUser} from '@/stores/userStore';

export default function TabLayout() {
  const {locale} = useLocaleAppearance();
  const {user} = useUser();

  if (!user.displayName && !user.lang) {
    return <Redirect href="/(gate)/welcome" />;
  }

  return (
    <Tabs
      tabBar={props => <GalacticTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        animation: 'shift',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t('screens.home', {locale}),
          tabBarAccessibilityLabel: i18n.t('screens.home', {locale}),
        }}
      />
      <Tabs.Screen
        name="edit"
        options={{
          title: i18n.t('screens.explore', {locale}),
          tabBarAccessibilityLabel: i18n.t('screens.explore', {locale}),
        }}
      />
      <Tabs.Screen
        name="AiGenerator"
        options={{
          title: i18n.t('actions.getStarted', {locale}),
          tabBarAccessibilityLabel: i18n.t('actions.getStarted', {locale}),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: i18n.t('screens.history', {locale}),
          tabBarAccessibilityLabel: i18n.t('screens.history', {locale}),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: i18n.t('screens.account', {locale}),
          tabBarAccessibilityLabel: i18n.t('screens.account', {locale}),
        }}
      />
    </Tabs>
  );
}
