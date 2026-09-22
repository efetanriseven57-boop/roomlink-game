import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useAds } from "@/components/AdsProvider";

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
  const { showInterstitial, resetInterstitial } = useAds();
  const showInterstitialRef = useRef(showInterstitial);
  const resetInterstitialRef = useRef(resetInterstitial);
  const hasPresentedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const dismissRef = useRef(onDismiss);
  showInterstitialRef.current = showInterstitial;
  resetInterstitialRef.current = resetInterstitial;
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
    // AdsProvider starts loading at app startup. Keep a short retry window for
    // slow networks without blocking the game indefinitely when AdMob has no
    // fill or the device is offline.
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let presentationTimer: ReturnType<typeof setTimeout> | undefined;
    const completeOnce = () => {
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;
      if (retryTimer) clearTimeout(retryTimer);
      if (presentationTimer) clearTimeout(presentationTimer);
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
      // Native CLOSED/ERROR should complete the placement. This watchdog keeps
      // navigation recoverable if the SDK fails to emit either terminal event.
      presentationTimer = setTimeout(() => {
        resetInterstitialRef.current();
        completeOnce();
      }, 90_000);
    };

    tryPresent();
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      if (presentationTimer) clearTimeout(presentationTimer);
      hasCompletedRef.current = true;
    };
  }, [visible]);

  return null;
}
