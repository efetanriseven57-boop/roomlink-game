import React, { useEffect } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "@/context/GameContext";
import { useLang } from "@/context/LanguageContext";
import { StarsBackground } from "@/components/StarsBackground";
import { NeonButton } from "@/components/NeonButton";
import { QuestionModal } from "@/components/QuestionModal";
import { AdModal } from "@/components/AdModal";
import { roomDefinitions, localizedRoomNames } from "@/data/questions";
import { useRequireAuth } from "@/components/RequireAuth";

const ITEMS_NEEDED = { easy: 2, medium: 3, hard: 6 } as const;

export default function GameScreen() {
  const { session, openQuestion, gameTimerDisplay, gameTimerState, endGameResult, clearEndGame } = useGame();
  const { ts, lang } = useLang();
  const insets = useSafeAreaInsets();
  const [showEndAd, setShowEndAd] = React.useState(false);
  const isAuthorized = useRequireAuth();

  useEffect(() => {
    if (endGameResult) setShowEndAd(true);
  }, [endGameResult]);

  const handleEndAdDismiss = () => {
    setShowEndAd(false);
    clearEndGame();
    router.replace("/leaderboard");
  };

  if (!isAuthorized) return null;
  if (!session) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StarsBackground />
        <View style={styles.center}>
          <NeonButton label={ts("backHome")} onPress={() => router.replace("/home")} color="cyan" />
        </View>
      </View>
    );
  }

  const diff = session.difficulty;
  const itemsNeeded = ITEMS_NEEDED[diff];

  const timerColor = gameTimerState === "danger" ? "#ff0000" : gameTimerState === "warning" ? "#ff6600" : "#00ffff";

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StarsBackground />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌌 Room-Link</Text>
        <Text style={[styles.timer, { color: timerColor }]}>{gameTimerDisplay}</Text>
      </View>

      <View style={styles.statsBar}>
        {[
          { label: ts("player"), value: session.playerName },
          { label: ts("score"), value: String(session.score) },
          { label: ts("level"), value: String(session.level) },
          { label: ts("rooms"), value: `${session.roomsSolved}/4` },
        ].map((s, i) => (
          <View key={i} style={styles.statItem}>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={styles.statValue} numberOfLines={1}>{s.value}</Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{ts("galaxyRooms")}</Text>
          {roomDefinitions.map((room, idx) => {
            const isLocked = idx > session.roomsSolved;
            const isSolved = idx < session.roomsSolved;
            const isCurrent = idx === session.roomsSolved;
            const roomItemCount = session.inventory.filter((inv) => inv.roomId === room.id).length;

            return (
              <View
                key={room.id}
                style={[
                  styles.roomCard,
                  isLocked && styles.roomLocked,
                  isSolved && styles.roomSolved,
                  isCurrent && styles.roomCurrent,
                ]}
              >
                <Text style={[styles.roomName, isSolved && { color: "#00ff00" }, isLocked && { color: "#555" }]}>
                   {localizedRoomNames[lang][room.id]}
                </Text>
                {isSolved && <Text style={styles.solvedBadge}>{ts("solved")}</Text>}
                {isLocked && <Text style={styles.lockedBadge}>{ts("locked")}</Text>}
                {isCurrent && (
                  <View style={styles.puzzleRow}>
                    {Array.from({ length: itemsNeeded }, (_, i) => {
                      const hasItem = session.inventory.some(
                        (inv) => inv.roomId === room.id && inv.index === i
                      );
                      return hasItem ? null : (
                        <TouchableOpacity
                          key={i}
                          style={styles.puzzleBtn}
                          onPress={() => openQuestion(room.id, i)}
                          accessibilityRole="button"
                          accessibilityLabel={`${localizedRoomNames[lang][room.id]} ${i + 1}`}
                        >
                          <Text style={styles.puzzleIcon}>❓</Text>
                        </TouchableOpacity>
                      );
                    })}
                    <Text style={styles.roomProgress}>
                      {roomItemCount}/{itemsNeeded}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{ts("inventory")}</Text>
          {session.inventory.length === 0 ? (
            <Text style={styles.emptyText}>{ts("noItems")}</Text>
          ) : (
            <View style={styles.inventoryGrid}>
              {session.inventory.map((item, i) => (
                <View key={i} style={styles.inventoryItem}>
                  <Text style={styles.inventoryEmoji}>{item.emoji}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <QuestionModal />
      <Modal visible={!!endGameResult} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.completionOverlay}>
          <View style={styles.completionCard}>
            <Text style={styles.completionTitle}>
              {lang === "tr" ? "Oyun tamamlandı" : "Game complete"}
            </Text>
            <Text style={styles.completionText}>
              {lang === "tr" ? "Skorunuz hazırlanıyor..." : "Preparing your score..."}
            </Text>
          </View>
        </View>
      </Modal>
      <AdModal visible={showEndAd} onDismiss={handleEndAdDismiss} skipDelay={5} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0015" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(20,20,50,0.92)",
    borderBottomWidth: 2,
    borderBottomColor: "#00ff88",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { color: "#00ff88", fontWeight: "900", fontSize: 18 },
  timer: { fontWeight: "bold", fontSize: 26 },
  statsBar: {
    flexDirection: "row",
    padding: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#00ff8833",
  },
  statItem: {
    flex: 1,
    backgroundColor: "rgba(0,50,50,0.5)",
    borderWidth: 1,
    borderColor: "#00ff88",
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
  },
  statLabel: { color: "#00ffcc", fontSize: 10, fontWeight: "bold" },
  statValue: { color: "#00ff88", fontSize: 15, fontWeight: "bold", marginTop: 2 },
  scrollArea: { flex: 1 },
  scrollContent: { padding: 14, gap: 16, paddingBottom: 30 },
  section: {
    backgroundColor: "rgba(20,20,50,0.8)",
    borderWidth: 2,
    borderColor: "#00ff88",
    borderRadius: 10,
    padding: 16,
    gap: 10,
  },
  sectionTitle: { color: "#00ff88", fontWeight: "bold", fontSize: 16 },
  roomCard: {
    backgroundColor: "rgba(50,20,80,0.6)",
    borderWidth: 2,
    borderColor: "#00ff88",
    borderRadius: 8,
    padding: 14,
    gap: 6,
  },
  roomCurrent: { borderColor: "#00ffff", backgroundColor: "rgba(0,100,150,0.25)" },
  roomSolved: { borderColor: "#00ff00", backgroundColor: "rgba(0,80,0,0.2)", opacity: 0.85 },
  roomLocked: { opacity: 0.35 },
  roomName: { color: "#00ff00", fontWeight: "bold", fontSize: 15 },
  solvedBadge: { color: "#00ff00", fontWeight: "bold", fontSize: 12 },
  lockedBadge: { color: "#888", fontSize: 12 },
  puzzleRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center", marginTop: 4 },
  puzzleBtn: {
    backgroundColor: "rgba(0,255,255,0.15)",
    borderWidth: 2,
    borderColor: "#00ffff",
    borderRadius: 6,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  puzzleIcon: { fontSize: 20 },
  roomProgress: { color: "#00ffcc", fontSize: 12, fontWeight: "bold", marginLeft: 4 },
  emptyText: { color: "#555", fontStyle: "italic", textAlign: "center", padding: 12 },
  inventoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  inventoryItem: {
    backgroundColor: "rgba(0,100,100,0.4)",
    borderWidth: 2,
    borderColor: "#00ff00",
    borderRadius: 8,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  inventoryEmoji: { fontSize: 24 },
  completionOverlay: {
    flex: 1,
    backgroundColor: "rgba(10,0,21,0.96)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  completionCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#141432",
    borderWidth: 2,
    borderColor: "#00ff88",
    borderRadius: 12,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  completionTitle: { color: "#00ff88", fontSize: 24, fontWeight: "bold", textAlign: "center" },
  completionText: { color: "#00ffff", fontSize: 15, textAlign: "center" },
});
