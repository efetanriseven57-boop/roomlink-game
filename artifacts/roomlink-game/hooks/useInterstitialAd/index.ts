import { useCallback } from "react";

type Completion = () => void;

/**
 * Google Mobile Ads has no web implementation. The web preview keeps the
 * game flow unblocked and the native implementation is selected by Metro on
 * Android/iOS.
 */
export function initializeAds(): Promise<boolean> {
  return Promise.resolve(false);
}

export function useInterstitialAd() {
  const showInterstitial = useCallback((_onFinished: Completion) => false, []);
  const resetInterstitial = useCallback(() => {}, []);

  return { isLoaded: false, showInterstitial, resetInterstitial };
}