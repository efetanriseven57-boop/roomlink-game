import React, { useEffect, useRef } from "react";
import { AppState } from "react-native";
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
    // Native SDK callbacks are the normal completion path. A long watchdog and
    // an interruption recovery path prevent SDK failures from blocking play
    // without navigating under a normally displayed interstitial.
    let watchdog: ReturnType<typeof setTimeout> | undefined;
    let interruptionFallback: ReturnType<typeof setTimeout> | undefined;
    let wasInterrupted = false;
    const completeOnce = () => {
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;
      if (watchdog) clearTimeout(watchdog);
      if (interruptionFallback) clearTimeout(interruptionFallback);
      dismissRef.current();
    };
    const wasPresented = showInterstitialRef.current(completeOnce);
    const appStateSubscription = wasPresented
      ? AppState.addEventListener("change", (state) => {
          if (state !== "active") {
            wasInterrupted = true;
            return;
          }
          if (wasInterrupted && !hasCompletedRef.current) {
            if (interruptionFallback) clearTimeout(interruptionFallback);
            interruptionFallback = setTimeout(completeOnce, 2000);
          }
        })
      : null;
    if (wasPresented) {
      watchdog = setTimeout(completeOnce, 120000);
    }
    return () => {
      if (watchdog) clearTimeout(watchdog);
      if (interruptionFallback) clearTimeout(interruptionFallback);
      appStateSubscription?.remove();
      hasCompletedRef.current = true;
    };
  }, [visible]);

  return null;
}
