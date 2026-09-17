import { useEffect } from "react";
import { router } from "expo-router";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@clerk/expo";

/** Redirect only after persisted account state has finished hydrating. */
export function useRequireAuth(): boolean {
  const { currentUser, hydrated } = useGame();
  const { isLoaded, isSignedIn } = useAuth();
  useEffect(() => {
    if (hydrated && isLoaded && (!currentUser || !isSignedIn)) router.replace("/auth");
  }, [currentUser, hydrated, isLoaded, isSignedIn]);
  return hydrated && isLoaded && !!currentUser && !!isSignedIn;
}