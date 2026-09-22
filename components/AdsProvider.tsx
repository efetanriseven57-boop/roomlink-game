import React, { createContext, useContext } from "react";
import { useInterstitialAd } from "@/hooks/useInterstitialAd";
import { useRewardedAd } from "@/hooks/useRewardedAd";

type AdsContextValue = {
  isInterstitialLoaded: boolean;
  showInterstitial: ReturnType<typeof useInterstitialAd>["showInterstitial"];
  resetInterstitial: ReturnType<typeof useInterstitialAd>["resetInterstitial"];
  isRewardedLoaded: boolean;
  showRewarded: ReturnType<typeof useRewardedAd>["showRewarded"];
};

const AdsContext = createContext<AdsContextValue | null>(null);

/**
 * Keeps both native ad objects mounted for the lifetime of the signed-in app.
 * This lets boundary and reward placements preload before the player needs
 * them instead of creating a fresh ad at the moment it should be shown.
 */
export function AdsProvider({ children }: { children: React.ReactNode }) {
  const interstitial = useInterstitialAd();
  const rewarded = useRewardedAd();

  return (
    <AdsContext.Provider
      value={{
        isInterstitialLoaded: interstitial.isLoaded,
        showInterstitial: interstitial.showInterstitial,
        resetInterstitial: interstitial.resetInterstitial,
        isRewardedLoaded: rewarded.isLoaded,
        showRewarded: rewarded.showRewarded,
      }}
    >
      {children}
    </AdsContext.Provider>
  );
}

export function useAds(): AdsContextValue {
  const value = useContext(AdsContext);
  if (!value) throw new Error("useAds must be used inside AdsProvider");
  return value;
}