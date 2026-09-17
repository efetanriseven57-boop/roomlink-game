import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

let globalSound: Audio.Sound | null = null;
let isLoaded = false;

export function useBackgroundMusic() {
  const [isMuted, setIsMuted] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    void loadAndPlay();
    const subscription = AppState.addEventListener("change", (state) => {
      if (!globalSound || !isLoaded) return;
      if (state === "active") {
        void globalSound.playAsync().catch(() => undefined);
      } else {
        void globalSound.pauseAsync().catch(() => undefined);
      }
    });
    return () => {
      mountedRef.current = false;
      subscription.remove();
    };
  }, []);

  async function loadAndPlay() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      if (!isLoaded && mountedRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/background_music.mp3"),
          {
            isLooping: true,
            volume: 0.4,
            shouldPlay: true,
          }
        );
        globalSound = sound;
        isLoaded = true;
      } else if (globalSound) {
        await globalSound.playAsync();
      }
    } catch {
      isLoaded = false;
      globalSound = null;
    }
  }

  async function toggleMute() {
    if (!globalSound) return;
    const muted = !isMuted;
    setIsMuted(muted);
    await globalSound.setVolumeAsync(muted ? 0 : 0.4).catch(() => undefined);
  }

  return { isMuted, toggleMute };
}
