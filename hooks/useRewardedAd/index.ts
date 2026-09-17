import { useCallback } from "react";

type Reward = () => void;

/**
 * AdMob rewarded ads are native-only. Web and Expo Go never grant a simulated
 * reward because the player must actually earn it from the ad provider.
 */
export function useRewardedAd() {
  const showRewarded = useCallback((_onRewarded: Reward) => false, []);
  return { isLoaded: false, showRewarded };
}