import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "@/context/GameContext";
import { useLang } from "@/context/LanguageContext";
import { StarsBackground } from "@/components/StarsBackground";
import { NeonButton } from "@/components/NeonButton";
import type { LangCode } from "@/data/translations";
import { useRequireAuth } from "@/components/RequireAuth";
import { useClerk } from "@clerk/expo";

const LANGS: { code: LangCode; flag: string; label: string }[] = [
  { code: "tr", flag: "🇹🇷", label: "Türkçe" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "it", flag: "🇮🇹", label: "Italiano" },
  { code: "ar", flag: "🇸🇦", label: "العربية" },
];

export default function HomeScreen() {
  const { currentUser, logout } = useGame();
  const { signOut } = useClerk();
  const { ts, ta, lang, setLang } = useLang();
  const insets = useSafeAreaInsets();
  const isAuthorized = useRequireAuth();

  const handleLogout = async () => {
    logout();
    await signOut();
    router.replace("/auth");
  };

  if (!isAuthorized) return null;
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StarsBackground />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.gameName}>🌌 Room-Link Puzzle</Text>
        <Text style={styles.tagline}>{ts("tagline")}</Text>
        {currentUser && <Text style={styles.userGreeting}>👤 {currentUser}</Text>}

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>{ts("howToPlay")}</Text>
          {ta("inst").map((item, i) => (
            <Text key={i} style={styles.cardItem}>• {item}</Text>
          ))}
          <View style={styles.divider} />
          <Text style={styles.cardTitle}>{ts("scoringTitle")}</Text>
          {ta("scoringList").map((item, i) => (
            <Text key={i} style={styles.cardItem}>{item}</Text>
          ))}
          <View style={styles.divider} />
          <Text style={styles.cardTitle}>{ts("diffTitle")}</Text>
          {ta("diffList").map((item, i) => (
            <Text key={i} style={styles.cardItem}>{item}</Text>
          ))}
        </View>

        <View style={styles.menuButtons}>
          <NeonButton label={ts("startGame")} onPress={() => router.push("/settings")} color="magenta" style={styles.menuBtn} />
          <NeonButton label={ts("profile")} onPress={() => router.push("/profile")} color="green" style={styles.menuBtn} />
          <NeonButton label={ts("leaderboard")} onPress={() => router.push("/leaderboard")} color="cyan" style={styles.menuBtn} />
          <NeonButton label={ts("logout")} onPress={handleLogout} color="red" style={styles.menuBtn} />
        </View>

        <View style={styles.langCard}>
          <Text style={styles.langTitle}>{ts("language")}</Text>
          {LANGS.map((l) => (
            <TouchableOpacity
              key={l.code}
              style={[styles.langBtn, lang === l.code && styles.langBtnActive]}
              onPress={() => setLang(l.code)}
                accessibilityRole="radio"
                accessibilityLabel={l.label}
                accessibilityState={{ selected: lang === l.code }}
            >
              <Text style={styles.langText}>{l.flag} {l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0015" },
  scroll: { padding: 20, gap: 16, paddingBottom: 160 },
  gameName: {
    fontSize: 32,
    fontWeight: "900",
    color: "#00ff88",
    textAlign: "center",
    letterSpacing: 2,
    marginTop: 10,
  },
  tagline: { color: "#00ffcc", fontSize: 15, textAlign: "center", marginBottom: 4 },
  userGreeting: { color: "#00ff00", fontSize: 13, textAlign: "center", opacity: 0.8 },
  infoCard: {
    backgroundColor: "rgba(20,20,50,0.85)",
    borderWidth: 2,
    borderColor: "#00ff88",
    borderRadius: 10,
    padding: 18,
    gap: 6,
  },
  cardTitle: { color: "#00ff00", fontWeight: "bold", fontSize: 14, marginTop: 4 },
  cardItem: { color: "#00ffcc", fontSize: 13, lineHeight: 22 },
  divider: { height: 1, backgroundColor: "#00ffff33", marginVertical: 8 },
  menuButtons: { gap: 12 },
  menuBtn: { width: "100%" },
  langCard: {
    backgroundColor: "rgba(0,50,100,0.3)",
    borderWidth: 2,
    borderColor: "#00ffff",
    borderRadius: 10,
    padding: 18,
    gap: 10,
  },
  langTitle: { color: "#00ff00", fontWeight: "bold", fontSize: 14, marginBottom: 4 },
  langBtn: {
    borderWidth: 2,
    borderColor: "#00ffff",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "rgba(0,100,100,0.25)",
  },
  langBtnActive: { backgroundColor: "rgba(0,255,0,0.18)", borderColor: "#00ff00" },
  langText: { color: "#00ffff", fontSize: 14, fontWeight: "bold" },
});
