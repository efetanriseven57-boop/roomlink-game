import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { getAdIds } from "@/constants/admob";

type Reward = () => void;
type Rewarded = {
  addAdEventListener: (event: string, listener: (...args: unknown[]) => void) => () => void;
  load: () => void;
  show: () => void;
};
type AdsModule = {
  AdEventType: { CLOSED: string; ERROR: string };
  RewardedAdEventType: { LOADED: string; EARNED_REWARD: string };
  RewardedAd: {
    createForAdRequest: (
      adUnitId: string,
      options: { requestNonPersonalizedAdsOnly: boolean },
    ) => Rewarded;
  };
};

let adsModule: AdsModule | null | undefined;

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

export function useRewardedAd() {
  const [isLoaded, setIsLoaded] = useState(false);
  const adRef = useRef<Rewarded | null>(null);
  const rewardRef = useRef<Reward | null>(null);

  useEffect(() => {
    const ads = getAdsModule();
    if (!ads) return;

    let ad: Rewarded;
    try {
      ad = ads.RewardedAd.createForAdRequest(getAdIds().REWARDED, {
        requestNonPersonalizedAdsOnly: true,
      });
      adRef.current = ad;
    } catch {
      return;
    }

    const unsubscribeLoaded = ad.addAdEventListener(ads.RewardedAdEventType.LOADED, () => {
      setIsLoaded(true);
    });
    const unsubscribeReward = ad.addAdEventListener(ads.RewardedAdEventType.EARNED_REWARD, () => {
      const grantReward = rewardRef.current;
      rewardRef.current = null;
      grantReward?.();
    });
    const unsubscribeClosed = ad.addAdEventListener(ads.AdEventType.CLOSED, () => {
      setIsLoaded(false);
      rewardRef.current = null;
      ad.load();
    });
    const unsubscribeError = ad.addAdEventListener(ads.AdEventType.ERROR, () => {
      setIsLoaded(false);
      rewardRef.current = null;
      ad.load();
    });

    ad.load();
    return () => {
      unsubscribeLoaded();
      unsubscribeReward();
      unsubscribeClosed();
      unsubscribeError();
      rewardRef.current = null;
      adRef.current = null;
    };
  }, []);

  const showRewarded = useCallback((onRewarded: Reward) => {
    const ad = adRef.current;
    if (!ad || !isLoaded) return false;
    rewardRef.current = onRewarded;
    setIsLoaded(false);
    try {
      ad.show();
      return true;
    } catch {
      rewardRef.current = null;
      ad.load();
      return false;
    }
  }, [isLoaded]);

  return { isLoaded, showRewarded };
}