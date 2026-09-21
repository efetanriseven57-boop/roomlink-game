import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "@/context/GameContext";
import { useLang } from "@/context/LanguageContext";
import { StarsBackground } from "@/components/StarsBackground";
import { NeonButton } from "@/components/NeonButton";
import { AdModal } from "@/components/AdModal";
import type { BranchId, QuestionLocale } from "@/data/questions";
import { useRequireAuth } from "@/components/RequireAuth";

type Diff = "easy" | "medium" | "hard";
type PendingStart = {
  difficulty: Diff;
  branches: BranchId[];
  playerName: string;
  locale: QuestionLocale;
};

const DIFF_CONFIG = [
  { key: "easy" as Diff, color: "#2196f3", bg: "rgba(0,50,150,0.4)", label: "🟦 KOLAY\n5 Dakika" },
  { key: "medium" as Diff, color: "#9c27b0", bg: "rgba(75,0,150,0.4)", label: "🟪 ORTA\n10 Dakika" },
  { key: "hard" as Diff, color: "#f44336", bg: "rgba(150,0,50,0.4)", label: "🟥 ZOR\n15 Dakika" },
];

export default function SettingsScreen() {
  const { currentUser, startGame } = useGame();
  const { ts, ta, lang } = useLang();
  const insets = useSafeAreaInsets();
  const [difficulty, setDifficulty] = useState<Diff | null>(null);
  const [branches, setBranches] = useState<BranchId[]>([]);
  const [error, setError] = useState("");
  const [showAd, setShowAd] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const pendingStartRef = useRef<PendingStart | null>(null);
  const isAuthorized = useRequireAuth();

  const branchNames = ta("branches");

  const toggleBranch = (idx: BranchId) => {
    setBranches((prev) =>
      prev.includes(idx) ? prev.filter((b) => b !== idx) : [...prev, idx]
    );
  };

  const handleStart = () => {
    if (isStarting) return;
    setError("");
    if (!difficulty) { setError(ts("err2")); return; }
    if (branches.length === 0) { setError(ts("err3")); return; }
    pendingStartRef.current = {
      difficulty,
      branches: [...branches],
      playerName: currentUser ?? ts("player"),
      locale: lang,
    };
    setIsStarting(true);
    setShowAd(true);
  };

  const onAdDismiss = () => {
    setShowAd(false);
    const pendingStart = pendingStartRef.current;
    pendingStartRef.current = null;
    if (!pendingStart) {
      setIsStarting(false);
      return;
    }
    startGame(pendingStart.difficulty, pendingStart.branches, pendingStart.playerName, pendingStart.locale);
    router.replace("/game");
  };

  if (!isAuthorized) return null;
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StarsBackground />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{ts("settings")}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>{ts("diffLabel")}</Text>
          <View style={styles.diffRow}>
            {DIFF_CONFIG.map((d) => (
              <TouchableOpacity
                key={d.key}
                style={[
                  styles.diffBtn,
                  { borderColor: d.color, backgroundColor: d.bg },
                  difficulty === d.key && { backgroundColor: d.color + "44", borderWidth: 3 },
                ]}
                onPress={() => setDifficulty(d.key)}
                disabled={isStarting}
                accessibilityRole="radio"
                accessibilityLabel={d.key === "easy" ? ts("easyBtn") : d.key === "medium" ? ts("medBtn") : ts("hardBtn")}
                accessibilityState={{ selected: difficulty === d.key }}
              >
                <Text style={[styles.diffText, { color: d.color }]}>{d.key === "easy" ? `${ts("easyBtn")}\n5 ${ts("min")}` : d.key === "medium" ? `${ts("medBtn")}\n10 ${ts("min")}` : `${ts("hardBtn")}\n15 ${ts("min")}`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>{ts("branchLabel")}</Text>
          <View style={styles.branchGrid}>
            {branchNames.map((name, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.branchBtn, branches.includes(idx as BranchId) && styles.branchBtnActive]}
                onPress={() => toggleBranch(idx as BranchId)}
                disabled={isStarting}
                accessibilityRole="checkbox"
                accessibilityLabel={name}
                accessibilityState={{ checked: branches.includes(idx as BranchId) }}
              >
                  <Text style={[styles.branchText, branches.includes(idx as BranchId) && styles.branchTextActive]}>
                  {name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.btnRow}>
          <NeonButton label={ts("startBtn")} onPress={handleStart} color="green" disabled={isStarting} style={{ flex: 1 }} />
          <NeonButton label={ts("backBtn")} onPress={() => router.back()} color="cyan" disabled={isStarting} style={{ flex: 1 }} />
        </View>
      </ScrollView>

      <AdModal visible={showAd} onDismiss={onAdDismiss} skipDelay={5} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0015" },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },
  title: { color: "#00ff00", fontWeight: "bold", fontSize: 24, textAlign: "center", marginVertical: 8 },
  card: {
    backgroundColor: "rgba(20,20,50,0.85)",
    borderWidth: 2,
    borderColor: "#00ffff",
    borderRadius: 10,
    padding: 18,
    gap: 14,
  },
  sectionLabel: { color: "#00ff00", fontWeight: "bold", fontSize: 15 },
  diffRow: { flexDirection: "row", gap: 10 },
  diffBtn: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  diffText: { fontWeight: "bold", fontSize: 12, textAlign: "center", lineHeight: 18 },
  branchGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  branchBtn: {
    backgroundColor: "rgba(0,100,100,0.35)",
    borderWidth: 2,
    borderColor: "#00ffff",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  branchBtnActive: { backgroundColor: "rgba(0,255,0,0.22)", borderColor: "#00ff00" },
  branchText: { color: "#00ffff", fontWeight: "bold", fontSize: 13 },
  branchTextActive: { color: "#00ff00" },
  errorBox: {
    backgroundColor: "rgba(255,0,0,0.12)",
    borderWidth: 1,
    borderColor: "#ff0099",
    borderRadius: 6,
    padding: 12,
  },
  errorText: { color: "#ff0099", textAlign: "center", fontSize: 13 },
  btnRow: { flexDirection: "row", gap: 12 },
});
