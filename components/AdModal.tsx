import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useInterstitialAd } from "@/hooks/useInterstitialAd";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  skipDelay?: number;
};

/**
 * Keeps the existing game flow API while presenting a real AdMob
 * interstitial on native builds. When an ad is not ready (or the app is
 * running in Expo Go/web), the game continues immediately.
 */
export function AdModal({ visible, onDismiss }: Props) {
  const { showInterstitial } = useInterstitialAd();
  const showInterstitialRef = useRef(showInterstitial);
  const hasPresentedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const dismissRef = useRef(onDismiss);
  showInterstitialRef.current = showInterstitial;
  dismissRef.current = onDismiss;

  useEffect(() => {
    if (!visible) {
      hasPresentedRef.current = false;
      hasCompletedRef.current = false;
      return;
    }
    if (hasPresentedRef.current) return;

    hasPresentedRef.current = true;
    hasCompletedRef.current = false;
    // Give the native SDK a short window to finish loading. Previously a
    // not-yet-loaded ad was skipped immediately, which made both game-boundary
    // placements disappear on faster devices and fresh app launches.
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const completeOnce = () => {
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;
      if (retryTimer) clearTimeout(retryTimer);
      dismissRef.current();
    };

    if (Platform.OS === "web") {
      completeOnce();
      return;
    }

    const loadDeadline = Date.now() + 6000;
    const tryPresent = () => {
      if (hasCompletedRef.current) return;
      const wasPresented = showInterstitialRef.current(completeOnce);
      if (!wasPresented) {
        if (hasCompletedRef.current) return;
        if (Date.now() < loadDeadline) {
          retryTimer = setTimeout(tryPresent, 250);
        } else {
          completeOnce();
        }
        return;
      }

    };

    tryPresent();
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      hasCompletedRef.current = true;
    };
  }, [visible]);

  return null;
}
