import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "@/context/GameContext";
import { useLang } from "@/context/LanguageContext";
import { StarsBackground } from "@/components/StarsBackground";
import { NeonButton } from "@/components/NeonButton";
import type { BranchId } from "@/data/questions";
import { useRequireAuth } from "@/components/RequireAuth";

const DIFF_OPTIONS = ["", "easy", "medium", "hard"] as const;

export default function LeaderboardScreen() {
  const { scores } = useGame();
  const { ts, ta } = useLang();
  const insets = useSafeAreaInsets();
  const [filterDiff, setFilterDiff] = useState("");
  const [filterBranch, setFilterBranch] = useState<BranchId | null>(null);
  const isAuthorized = useRequireAuth();

  const branches = ta("branches");

  const filtered = useMemo(() => {
    return scores.filter((s) => {
      if (filterDiff && s.difficulty !== filterDiff) return false;
      if (filterBranch !== null && !(s.branchIds ?? s.branch.split(",").map(Number)).includes(filterBranch)) return false;
      return true;
    });
  }, [scores, filterDiff, filterBranch]);

  const rankColor = (rank: number) => {
    if (rank === 0) return "#ffd700";
    if (rank === 1) return "#c0c0c0";
    if (rank === 2) return "#cd7f32";
    return "#00ff00";
  };

  if (!isAuthorized) return null;
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StarsBackground />
      <Text style={styles.title}>{ts("lbTitle")}</Text>

      <View style={styles.filterCard}>
        <Text style={styles.filterLabel}>{ts("filter")}</Text>
        <View style={styles.filterRow}>
          {DIFF_OPTIONS.map((d) => (
            <TouchableOpacity
              key={d || "all"}
              style={[styles.filterChip, filterDiff === d && styles.filterChipActive]}
              onPress={() => setFilterDiff(d)}
              accessibilityRole="radio"
              accessibilityState={{ selected: filterDiff === d }}
            >
              <Text style={[styles.filterChipText, filterDiff === d && styles.filterChipTextActive]}>
                {d === "" ? ts("allFilter") : d === "easy" ? ts("easyBtn") : d === "medium" ? ts("medBtn") : ts("hardBtn")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, filterBranch === null && styles.filterChipActive]}
            onPress={() => setFilterBranch(null)}
            accessibilityRole="radio"
            accessibilityState={{ selected: filterBranch === null }}
          >
              <Text style={[styles.filterChipText, filterBranch === null && styles.filterChipTextActive]}>
              {ts("allFilter")}
            </Text>
          </TouchableOpacity>
          {branches.map((b, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.filterChip, filterBranch === i && styles.filterChipActive]}
              onPress={() => setFilterBranch(i as BranchId)}
              accessibilityRole="radio"
              accessibilityState={{ selected: filterBranch === i }}
            >
              <Text style={[styles.filterChipText, filterBranch === i && styles.filterChipTextActive]}>
                {b}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🏆</Text>
          <Text style={styles.emptyText}>{ts("noScores")}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={styles.entry}>
              <Text style={[styles.rank, { color: rankColor(index) }]}>
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`}
              </Text>
              <View style={styles.entryInfo}>
                <Text style={styles.entryName}>{item.player_name}</Text>
                <Text style={styles.entryDetail}>
                   {item.difficulty === "easy" ? ts("easyBtn") : item.difficulty === "medium" ? ts("medBtn") : ts("hardBtn")} • {(item.branchIds ?? item.branch.split(",").map(Number)).map((id) => branches[id] ?? String(id)).join(", ")} {item.won ? "✓" : "✗"}
                </Text>
              </View>
              <Text style={[styles.entryScore, { color: rankColor(index) }]}>{item.score}</Text>
            </View>
          )}
        />
      )}

      <View style={[styles.backBtn, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <NeonButton label={ts("backHome")} onPress={() => router.replace("/home")} color="cyan" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0015" },
  title: { color: "#00ff00", fontWeight: "bold", fontSize: 22, textAlign: "center", margin: 16 },
  filterCard: {
    backgroundColor: "rgba(20,20,50,0.85)",
    borderWidth: 1,
    borderColor: "#00ffff33",
    marginHorizontal: 14,
    borderRadius: 10,
    padding: 12,
    gap: 8,
    marginBottom: 8,
  },
  filterLabel: { color: "#00ff00", fontWeight: "bold", fontSize: 13 },
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  filterChip: {
    borderWidth: 1,
    borderColor: "#00ffff",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(0,50,50,0.3)",
  },
  filterChipActive: { backgroundColor: "rgba(0,255,0,0.2)", borderColor: "#00ff00" },
  filterChipText: { color: "#00ffcc", fontSize: 11, fontWeight: "bold" },
  filterChipTextActive: { color: "#00ff00" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: "#555", fontStyle: "italic" },
  listContent: { paddingHorizontal: 14, paddingBottom: 10, gap: 10 },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(20,30,60,0.7)",
    borderWidth: 2,
    borderColor: "#00ffcc",
    borderRadius: 8,
    padding: 14,
    gap: 14,
  },
  rank: { fontSize: 24, fontWeight: "bold", width: 38, textAlign: "center" },
  entryInfo: { flex: 1 },
  entryName: { color: "#00ff00", fontWeight: "bold", fontSize: 15 },
  entryDetail: { color: "#00ffcc", fontSize: 11, marginTop: 2 },
  entryScore: { fontWeight: "bold", fontSize: 22 },
  backBtn: { padding: 14 },
});
