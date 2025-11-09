import {AdMobIds} from '@/constants/admob';
import {useUser} from '@/stores/userStore';
import React from 'react';
import {Platform} from 'react-native';
import mobileAds, {
  AdEventType,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

type Options = {
  rewardedUnitId?: string;
  bannerUnitId?: string;
  rewardPoints?: number; // how many points to grant on reward
};

export function useAdMob(opts: Options = {}) {
  const interstitialUnitId = __DEV__ ? TestIds.INTERSTITIAL : AdMobIds.rewarded;

  const [initialized, setInitialized] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const adRef = React.useRef<InterstitialAd | null>(null);
  const {user} = useUser();

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (Platform.OS !== 'android') return; // Android only
        await mobileAds().initialize();
        if (!mounted) return;
        setInitialized(true);

        const ad = InterstitialAd.createForAdRequest(interstitialUnitId, {
          // keywords: ['fashion', 'clothing'],
          requestNonPersonalizedAdsOnly: true,
        });
        adRef.current = ad;

        const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
          setLoaded(true);
        });

        const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
          setLoaded(false);
        });

        const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
          setLoaded(false);
          try {
            ad.load();
          } catch {}
        });

        // kick off initial load
        try {
          ad.load();
        } catch {}

        return () => {
          try {
            unsubLoaded();
            unsubError();
            unsubClosed();
          } catch {}
        };
      } catch {
        if (mounted) setInitialized(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [interstitialUnitId]);

  // Shows a rewarded interstitial, resolves true if reward was earned
  const showInterstitial = React.useCallback(async (): Promise<boolean> => {
    //console.log('Showing interstitial ad');
    if (loading || Platform.OS !== 'android') return false;
    //console.log('Interstitial ad loaded:', loaded);
    if (!adRef.current || !loaded) {
      try {
        adRef.current?.load();
        //console.log('Interstitial ready, loading...');
      } catch {}
      return false;
    }
    setLoading(true);
    try {
      adRef.current?.show();
      //console.log('Interstitial ad shown');
      return true;
    } catch (e) {
      console.error('Failed to show interstitial', e);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loaded, loading]);

  // Consider user premium status for ad visibility
  const shouldShowAds = (user.membership ?? 'freemium') !== 'premium';

  const showIfFreemium = React.useCallback(async () => {
    if (!shouldShowAds) return false;
    const ok = await showInterstitial();
    return ok;
  }, [shouldShowAds, showInterstitial]);

  return {
    initialized,
    loading,
    loaded,
    showInterstitial,
    showIfFreemium,
    shouldShowAds,
  };
}
