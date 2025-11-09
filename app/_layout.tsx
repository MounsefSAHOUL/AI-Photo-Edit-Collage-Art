import {AdMobIds} from '@/constants/admob';
import {useAppTheme} from '@/hooks/useAppTheme';
import {LocaleProvider} from '@/providers/localeProvider';
import ToastProvider from '@/providers/ToastProvider';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import 'react-native-reanimated';
import AppStack from './appStack';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const {theme} = useAppTheme();
  const [fontsLoaded, fontsError] = useFonts({
    'Orbitron-Regular': require('@/assets/fonts/Orbitron-Regular.ttf'),
    'Orbitron-Medium': require('@/assets/fonts/Orbitron-Medium.ttf'),
    'Orbitron-Bold': require('@/assets/fonts/Orbitron-Bold.ttf'),
    'Rajdhani-Light': require('@/assets/fonts/Rajdhani-Light.ttf'),
    'Rajdhani-Regular': require('@/assets/fonts/Rajdhani-Regular.ttf'),
    'Rajdhani-Medium': require('@/assets/fonts/Rajdhani-Medium.ttf'),
    'Rajdhani-Bold': require('@/assets/fonts/Rajdhani-Bold.ttf'),
    'ElMessiri-Medium': require('@/assets/fonts/ElMessiri-Medium.ttf'),
    'ElMessiri-Bold': require('@/assets/fonts/ElMessiri-Bold.ttf'),
  });

  const AndroidSoftwareNavHidden = async () => {
    await NavigationBar.setPositionAsync('absolute');
    await NavigationBar.setVisibilityAsync('hidden');
    await NavigationBar.setBehaviorAsync('overlay-swipe');
  };
  useEffect(() => {
    AndroidSoftwareNavHidden();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
    if (fontsError) {
      console.error('Error loading fonts', fontsError);
    }
  }, [fontsLoaded, fontsError]);

  // const visibility = NavigationBar.useVisibility();
  // console.log('visible', visibility);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <LocaleProvider>
        <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
          <ToastProvider>
            <AppStack />
          </ToastProvider>
        </ThemeProvider>
      </LocaleProvider>
      {/* Global FPS overlay for quick perf checks in dev
      <FPSOverlay /> */}
      {Platform.OS !== 'web' ? (
        <View style={styles.bannerWrap}>
          <BannerAd
            //unitId={__DEV__ ? TestIds.BANNER : AdMobIds.banner}
            unitId={AdMobIds.banner}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          />
        </View>
      ) : null}
      <StatusBar animated hidden />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  bannerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
});
