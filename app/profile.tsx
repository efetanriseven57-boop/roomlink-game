import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "@/context/GameContext";
import { useLang } from "@/context/LanguageContext";
import { StarsBackground } from "@/components/StarsBackground";
import { NeonButton } from "@/components/NeonButton";
import { useRequireAuth } from "@/components/RequireAuth";

export default function ProfileScreen() {
  const { currentUser, currentUserId, scores, friends, addFriend, removeFriend, searchUsers } = useGame();
  const { ts, ta } = useLang();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [addError, setAddError] = useState("");
  const isAuthorized = useRequireAuth();

  const myScores = scores.filter((s) => s.player_name === currentUser);
  const totalGames = myScores.length;
  const wonGames = myScores.filter((s) => s.won).length;
  const totalScore = myScores.reduce((acc, s) => acc + s.score, 0);
  const bestScore = myScores.reduce((max, s) => Math.max(max, s.score), 0);

  const handleSearch = () => {
    const results = searchUsers(searchQuery);
    setSearchResults(results);
  };

  const handleAdd = (username: string) => {
    const err = addFriend(username);
    if (err) setAddError(ts(err as any));
    else { setSearchResults((prev) => prev.filter((u) => u !== username)); setAddError(""); }
  };

  const achievementLabels = ta("achievementsList");
  const achievements: { icon: string; label: string; earned: boolean }[] = [
    { icon: "🏆", label: achievementLabels[0], earned: wonGames >= 1 },
    { icon: "⚡", label: achievementLabels[1], earned: myScores.some((s) => s.won && s.score > 1000) },
    { icon: "🌟", label: achievementLabels[2], earned: wonGames >= 5 },
    { icon: "💎", label: achievementLabels[3], earned: wonGames >= 10 },
    { icon: "🧠", label: achievementLabels[4], earned: totalScore >= 5000 },
  ];

  if (!isAuthorized) return null;
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StarsBackground />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{ts("profileTitle")}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{ts("profileInfo")}</Text>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>{ts("profileLabelName")}</Text><Text style={styles.infoValue}>{currentUser}</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>{ts("profileLabelId")}</Text><Text style={[styles.infoValue, { fontSize: 11 }]}>{currentUserId?.substring(0, 16)}...</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>{ts("profileLabelTotalGames")}</Text><Text style={styles.infoValue}>{totalGames}</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>{ts("profileLabelWonGames")}</Text><Text style={styles.infoValue}>{wonGames}</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>{ts("profileLabelTotalScore")}</Text><Text style={styles.infoValue}>{totalScore}</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>{ts("profileLabelBestScore")}</Text><Text style={styles.infoValue}>{bestScore}</Text></View>
        </View>

        <View style={[styles.card, { borderColor: "#ff00ff" }]}>
          <Text style={[styles.cardTitle, { color: "#ff00ff" }]}>{ts("achievements")}</Text>
          {achievements.map((a, i) => (
            <View key={i} style={[styles.achieveRow, !a.earned && styles.achieveLocked]}>
              <Text style={styles.achieveIcon}>{a.icon}</Text>
              <Text style={[styles.achieveLabel, !a.earned && { color: "#555" }]}>{a.label}</Text>
              {a.earned && <Text style={styles.achieveBadge}>✓</Text>}
            </View>
          ))}
        </View>

        <View style={[styles.card, { borderColor: "#00ffff" }]}>
          <Text style={[styles.cardTitle, { color: "#00ffff" }]}>{ts("friendAdd")}</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder={ts("searchPh")}
              placeholderTextColor="#00ffcc"
              value={searchQuery}
              onChangeText={setSearchQuery}
              maxLength={20}
              autoCapitalize="none"
              accessibilityLabel={ts("searchPh")}
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} accessibilityRole="button" accessibilityLabel={ts("search")}>
              <Text style={styles.searchBtnText}>🔍</Text>
            </TouchableOpacity>
          </View>
          {!!addError && <Text style={styles.errorText}>{addError}</Text>}
          <View style={styles.resultsList}>
            {searchResults.length === 0 && searchQuery.length > 0 ? (
              <Text style={styles.emptyText}>{ts("notFound")}</Text>
            ) : (
              searchResults.map((u) => (
                <View key={u} style={styles.resultRow}>
                  <Text style={styles.resultName}>{u}</Text>
                  <TouchableOpacity style={styles.addBtn} onPress={() => handleAdd(u)} accessibilityRole="button" accessibilityLabel={`${ts("addBtn")} ${u}`}>
                    <Text style={styles.addBtnText}>{ts("addBtn")}</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={[styles.card, { borderColor: "#ff00ff" }]}>
          <Text style={[styles.cardTitle, { color: "#ff00ff" }]}>{ts("friendsList")}</Text>
          {friends.length === 0 ? (
            <Text style={styles.emptyText}>{ts("noFriends")}</Text>
          ) : (
            friends.map((f) => {
              const fBest = scores.filter((s) => s.player_name === f).reduce((max, s) => Math.max(max, s.score), 0);
              return (
                <View key={f} style={styles.friendRow}>
                  <View>
                    <Text style={styles.friendName}>{f}</Text>
                     <Text style={styles.friendScore}>{ts("profileLabelBestScore")} {fBest}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeFriend(f)} accessibilityRole="button" accessibilityLabel={`${ts("cancel")} ${f}`}>
                    <Text style={styles.removeBtn}>✕</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>

        <NeonButton label={ts("backHome")} onPress={() => router.back()} color="cyan" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0015" },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },
  title: { color: "#00ff00", fontWeight: "bold", fontSize: 24, textAlign: "center", marginBottom: 4 },
  card: {
    backgroundColor: "rgba(20,20,50,0.85)",
    borderWidth: 2,
    borderColor: "#00ff00",
    borderRadius: 10,
    padding: 16,
    gap: 10,
  },
  cardTitle: { color: "#00ff00", fontWeight: "bold", fontSize: 15, marginBottom: 4 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  infoLabel: { color: "#00ffcc", fontSize: 13 },
  infoValue: { color: "#00ff88", fontWeight: "bold", fontSize: 13 },
  achieveRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  achieveLocked: { opacity: 0.35 },
  achieveIcon: { fontSize: 20 },
  achieveLabel: { color: "#00ff00", fontSize: 13, flex: 1 },
  achieveBadge: { color: "#00ff88", fontWeight: "bold" },
  searchRow: { flexDirection: "row", gap: 8 },
  searchInput: {
    flex: 1,
    backgroundColor: "rgba(0,50,100,0.5)",
    borderWidth: 2,
    borderColor: "#00ffff",
    borderRadius: 6,
    padding: 10,
    color: "#00ff00",
    fontSize: 13,
  },
  searchBtn: {
    backgroundColor: "rgba(0,255,255,0.1)",
    borderWidth: 2,
    borderColor: "#00ffff",
    borderRadius: 6,
    padding: 10,
    justifyContent: "center",
  },
  searchBtnText: { fontSize: 18 },
  resultsList: { gap: 8 },
  emptyText: { color: "#555", fontStyle: "italic", textAlign: "center" },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,50,50,0.3)",
    borderRadius: 6,
    padding: 10,
  },
  resultName: { color: "#00ffcc", fontWeight: "bold" },
  addBtn: {
    backgroundColor: "rgba(0,255,0,0.15)",
    borderWidth: 1,
    borderColor: "#00ff00",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addBtnText: { color: "#00ff00", fontWeight: "bold", fontSize: 12 },
  friendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(100,0,150,0.15)",
    borderRadius: 6,
    padding: 10,
  },
  friendName: { color: "#00ff00", fontWeight: "bold" },
  friendScore: { color: "#00ffcc", fontSize: 12 },
  removeBtn: { color: "#ff0044", fontSize: 16, fontWeight: "bold", padding: 4 },
  errorText: { color: "#ff0099", fontSize: 12, textAlign: "center" },
});
