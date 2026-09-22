import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AdsProvider } from "@/components/AdsProvider";
import { GameProvider } from "@/context/GameContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { initializeAds } from "@/hooks/useInterstitialAd";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="game" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="leaderboard" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

function MusicController() {
  useBackgroundMusic();
  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    void initializeAds();
  }, []);

  if (!fontsLoaded && !fontError) return null;

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0015",
            padding: 24,
          }}
        >
          <Text
            style={{
              color: "#00ff88",
              fontSize: 20,
              fontWeight: "700",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Uygulama yapılandırması eksik
          </Text>
          <Text style={{ color: "#c0c9ea", fontSize: 15, lineHeight: 22, textAlign: "center" }}>
            Giriş hizmeti şu anda başlatılamıyor. Lütfen uygulamanın güncel sürümünü kontrol edin.
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ClerkProvider
              publishableKey={publishableKey}
              tokenCache={tokenCache}
              proxyUrl={process.env.EXPO_PUBLIC_CLERK_PROXY_URL || undefined}
            >
             <ClerkLoading>
               <View style={{ flex: 1, backgroundColor: "#0a0015" }} />
             </ClerkLoading>
             <ClerkLoaded>
              <LanguageProvider>
                <GameProvider>
                   <AdsProvider>
                     <MusicController />
                     <RootLayoutNav />
                   </AdsProvider>
                </GameProvider>
              </LanguageProvider>
             </ClerkLoaded>
            </ClerkProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
