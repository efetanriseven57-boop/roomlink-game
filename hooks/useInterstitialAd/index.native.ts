import { Platform } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { getAdIds } from "@/constants/admob";

type Completion = () => void;
type Interstitial = {
  addAdEventListener: (event: string, listener: (...args: unknown[]) => void) => () => void;
  load: () => void;
  show: () => void;
};
type AdsModule = {
  default: () => { initialize: () => Promise<unknown> };
  AdEventType: { LOADED: string; CLOSED: string; ERROR: string };
  InterstitialAd: {
    createForAdRequest: (
      adUnitId: string,
      options: { requestNonPersonalizedAdsOnly: boolean },
    ) => Interstitial;
  };
};

let adsModule: AdsModule | null | undefined;

/**
 * Expo Go does not contain the native Google Mobile Ads modules. Loading the
 * package lazily lets Expo Go continue without crashing while native builds
 * use the real SDK.
 */
function getAdsModule(): AdsModule | null {
  if (Platform.OS === "web") return null;
  if (adsModule !== undefined) return adsModule;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    adsModule = require("react-native-google-mobile-ads") as AdsModule;
  } catch {
    adsModule = null;
  }

  return adsModule;
}

export async function initializeAds(): Promise<boolean> {
  const ads = getAdsModule();
  if (!ads) return false;

  try {
    await ads.default().initialize();
    return true;
  } catch {
    return false;
  }
}

export function useInterstitialAd() {
  const [isLoaded, setIsLoaded] = useState(false);
  const adRef = useRef<Interstitial | null>(null);
  const completionRef = useRef<Completion | null>(null);

  useEffect(() => {
    const ads = getAdsModule();
    if (!ads) return;

    let ad: Interstitial;
    try {
      ad = ads.InterstitialAd.createForAdRequest(getAdIds().INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: true,
      });
      adRef.current = ad;
    } catch {
      return;
    }

    const finishPending = () => {
      const completion = completionRef.current;
      completionRef.current = null;
      completion?.();
    };

    const unsubscribeLoaded = ad.addAdEventListener(ads.AdEventType.LOADED, () => {
      setIsLoaded(true);
    });
    const unsubscribeClosed = ad.addAdEventListener(ads.AdEventType.CLOSED, () => {
      setIsLoaded(false);
      finishPending();
      ad.load();
    });
    const unsubscribeError = ad.addAdEventListener(ads.AdEventType.ERROR, () => {
      setIsLoaded(false);
      finishPending();
      ad.load();
    });

    ad.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
      adRef.current = null;
      completionRef.current = null;
    };
  }, []);

  const showInterstitial = useCallback((onFinished: Completion) => {
    const ad = adRef.current;
    if (!isLoaded || !ad) {
      onFinished();
      return false;
    }

    completionRef.current = onFinished;
    setIsLoaded(false);

    try {
      ad.show();
      return true;
    } catch {
      completionRef.current = null;
      onFinished();
      ad.load();
      return false;
    }
  }, [isLoaded]);

  return { isLoaded, showInterstitial };
}