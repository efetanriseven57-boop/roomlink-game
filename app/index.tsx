import { Redirect } from "expo-router";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@clerk/expo";

export default function IndexScreen() {
  const { currentUser, hydrated } = useGame();
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  if (!hydrated) return null;
  if (currentUser && isSignedIn) return <Redirect href="/home" />;
  return <Redirect href="/auth" />;
}
