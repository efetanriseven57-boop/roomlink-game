import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { getAdIds } from "@/constants/admob";

type Reward = () => void;
type Completion = (rewardEarned: boolean) => void;
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
  const completionRef = useRef<Completion | null>(null);
  const rewardEarnedRef = useRef(false);

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
      rewardEarnedRef.current = true;
    });
    const unsubscribeClosed = ad.addAdEventListener(ads.AdEventType.CLOSED, () => {
      const grantReward = rewardRef.current;
      const complete = completionRef.current;
      const rewardEarned = rewardEarnedRef.current;
      setIsLoaded(false);
      rewardRef.current = null;
      completionRef.current = null;
      rewardEarnedRef.current = false;
      if (rewardEarned) grantReward?.();
      complete?.(rewardEarned);
      ad.load();
    });
    const unsubscribeError = ad.addAdEventListener(ads.AdEventType.ERROR, () => {
      const grantReward = rewardRef.current;
      const complete = completionRef.current;
      const rewardEarned = rewardEarnedRef.current;
      setIsLoaded(false);
      rewardRef.current = null;
      completionRef.current = null;
      rewardEarnedRef.current = false;
      if (rewardEarned) grantReward?.();
      complete?.(rewardEarned);
      ad.load();
    });

    ad.load();
    return () => {
      unsubscribeLoaded();
      unsubscribeReward();
      unsubscribeClosed();
      unsubscribeError();
      rewardRef.current = null;
      completionRef.current = null;
      rewardEarnedRef.current = false;
      adRef.current = null;
    };
  }, []);

  const showRewarded = useCallback((onRewarded: Reward, onFinished?: Completion) => {
    const ad = adRef.current;
    if (!ad || !isLoaded) return false;
    rewardRef.current = onRewarded;
    completionRef.current = onFinished ?? null;
    rewardEarnedRef.current = false;
    setIsLoaded(false);
    try {
      ad.show();
      return true;
    } catch {
      rewardRef.current = null;
      const complete = completionRef.current;
      completionRef.current = null;
      rewardEarnedRef.current = false;
      complete?.(false);
      ad.load();
      return false;
    }
  }, [isLoaded]);

  return { isLoaded, showRewarded };
}