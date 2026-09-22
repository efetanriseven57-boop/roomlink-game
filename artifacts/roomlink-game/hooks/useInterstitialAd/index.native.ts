import { Platform } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { getAdIds } from "@/constants/admob";

type Completion = () => void;
type Interstitial = {
  addAdEventListener: (event: string, listener: (...args: unknown[]) => void) => () => void;
  load: () => void;
  show: () => Promise<void>;
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
let adsInitialization: Promise<boolean> | null = null;

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
  if (adsInitialization) return adsInitialization;
  const ads = getAdsModule();
  if (!ads) return false;

  adsInitialization = (async () => {
    const retryDelays = [0, 500, 1_500, 3_000, 5_000];
    for (const delay of retryDelays) {
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      try {
        await ads.default().initialize();
        return true;
      } catch {
        // Retry transient startup failures without requiring an app remount.
      }
    }
    adsInitialization = null;
    return false;
  })();
  return adsInitialization;
}

export function useInterstitialAd() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [generation, setGeneration] = useState(0);
  const adRef = useRef<Interstitial | null>(null);
  const completionRef = useRef<Completion | null>(null);

  useEffect(() => {
    let active = true;
    void initializeAds().then((initialized) => {
      if (active) setIsInitialized(initialized);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
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
  }, [generation, isInitialized]);

  const resetInterstitial = useCallback(() => {
    completionRef.current = null;
    setIsLoaded(false);
    setGeneration((current) => current + 1);
  }, []);

  const showInterstitial = useCallback((onFinished: Completion) => {
    const ad = adRef.current;
    if (!isLoaded || !ad) {
      return false;
    }

    completionRef.current = onFinished;
    setIsLoaded(false);

    try {
      void Promise.resolve(ad.show()).catch(() => {
        const completion = completionRef.current;
        if (!completion) return;
        completionRef.current = null;
        setIsLoaded(false);
        completion?.();
        ad.load();
      });
      return true;
    } catch {
      completionRef.current = null;
      onFinished();
      ad.load();
      return false;
    }
  }, [isLoaded]);

  return { isLoaded, showInterstitial, resetInterstitial };
}