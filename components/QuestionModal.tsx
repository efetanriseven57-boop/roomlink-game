import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "@/context/GameContext";
import { useLang } from "@/context/LanguageContext";
import { NeonButton } from "@/components/NeonButton";
import { useRewardedAd } from "@/hooks/useRewardedAd";

export function QuestionModal() {
  const { questionModal, selectAnswer, submitAnswer, skipPenalty, pausePenalty, resumePenalty } = useGame();
  const { ts } = useLang();
  const insets = useSafeAreaInsets();
  const { isLoaded: isRewardedAdLoaded, showRewarded } = useRewardedAd();

  const { visible, question, shuffledOptions, timeLeft, penaltyActive, penaltyLeft, selectedAnswer, answerResult } = questionModal;

  const timerColor = timeLeft <= 5 ? "#ff0000" : timeLeft <= 10 ? "#ffff00" : "#00ffff";

  const handleRewardedAd = () => {
    pausePenalty();
    const wasPresented = showRewarded(
      skipPenalty,
      (rewardEarned) => {
        if (!rewardEarned) resumePenalty();
      },
    );
    if (!wasPresented) resumePenalty();
  };

  const getOptionStyle = (optionId: string) => {
    if (answerResult === "correct" && optionId === question?.correctOptionId) return styles.optCorrect;
    if (answerResult === "incorrect") {
      if (optionId === selectedAnswer) return styles.optIncorrect;
      if (optionId === question?.correctOptionId) return styles.optCorrect;
    }
    if (selectedAnswer === optionId && !answerResult) return styles.optSelected;
    return styles.opt;
  };

  const getOptionTextColor = (optionId: string) => {
    if (answerResult === "correct" && optionId === question?.correctOptionId) return "#00ff00";
    if (answerResult === "incorrect") {
      if (optionId === selectedAnswer) return "#ff0000";
      if (optionId === question?.correctOptionId) return "#00ff00";
    }
    if (selectedAnswer === optionId && !answerResult) return "#00ff00";
    return "#00ffff";
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View accessibilityViewIsModal accessibilityLabel={ts("answer")} style={[styles.container, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          {penaltyActive ? (
            <View style={styles.penaltyBox}>
              <Text style={styles.penaltyTitle}>{timeLeft === 0 ? ts("timeoutAnswer") : ts("wrongAnswer")}</Text>
              <Text style={styles.penaltyTimer}>{penaltyLeft}s</Text>
              <Text style={styles.penaltyText}>{ts("retrying")}</Text>
              {Platform.OS === "web" ? (
                <Text style={styles.rewardStatus}>{ts("rewardedAdMobileOnly")}</Text>
              ) : (
                <>
                  <NeonButton
                    label={isRewardedAdLoaded ? ts("skipPenaltyWithAd") : ts("rewardedAdLoading")}
                    onPress={handleRewardedAd}
                    color="orange"
                    disabled={!isRewardedAdLoaded}
                    style={styles.rewardButton}
                  />
                  <Text style={styles.rewardNote}>
                    {ts("rewardedAdDisclaimer")}
                  </Text>
                </>
              )}
            </View>
          ) : (
            <>
              <View style={styles.timerRow}>
                <Text style={[styles.timerText, { color: timerColor }]}>
                  {ts("questionTimer")} {timeLeft}s
                </Text>
              </View>
              <Text style={styles.title}>{ts("answer")}</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {question && (
                  <Text style={styles.questionText}>{question.question}</Text>
                )}
                <View style={styles.optionsContainer}>
                  {shuffledOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt.id}
                      style={getOptionStyle(opt.id)}
                      onPress={() => !answerResult && selectAnswer(opt.id)}
                      activeOpacity={0.75}
                      disabled={!!answerResult}
                      accessibilityRole="radio"
                      accessibilityLabel={opt.label}
                      accessibilityState={{ selected: selectedAnswer === opt.id, disabled: !!answerResult }}
                    >
                      <Text style={[styles.optText, { color: getOptionTextColor(opt.id) }]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <View style={styles.buttonRow}>
                <NeonButton
                  label={ts("submit")}
                  onPress={submitAnswer}
                  color="green"
                  disabled={!selectedAnswer || !!answerResult}
                  style={{ flex: 1 }}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#1a1a3e",
    borderWidth: 2,
    borderColor: "#00ffff",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
  },
  timerRow: { alignItems: "center", marginBottom: 8 },
  timerText: { fontWeight: "bold", fontSize: 18 },
  title: {
    color: "#00ff00",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
  },
  questionText: {
    color: "#00ffcc",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: { gap: 12, marginBottom: 16 },
  opt: {
    backgroundColor: "rgba(0,50,100,0.5)",
    borderWidth: 2,
    borderColor: "#00ffff",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  optSelected: {
    backgroundColor: "rgba(0,255,0,0.2)",
    borderWidth: 2,
    borderColor: "#00ff00",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  optCorrect: {
    backgroundColor: "rgba(0,255,0,0.3)",
    borderWidth: 2,
    borderColor: "#00ff00",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  optIncorrect: {
    backgroundColor: "rgba(255,0,0,0.3)",
    borderWidth: 2,
    borderColor: "#ff0000",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  optText: { fontWeight: "bold", fontSize: 14, textAlign: "center" },
  buttonRow: { marginTop: 8 },
  penaltyBox: { alignItems: "center", paddingVertical: 20 },
  penaltyTitle: { color: "#ff0044", fontWeight: "bold", fontSize: 20, marginBottom: 12 },
  penaltyTimer: { color: "#ff0000", fontSize: 48, fontWeight: "bold", marginBottom: 8 },
  penaltyText: { color: "#00ffcc", fontSize: 14 },
  rewardButton: { width: "100%", marginTop: 20 },
  rewardStatus: { color: "#9aa6b2", fontSize: 13, textAlign: "center", marginTop: 18 },
  rewardNote: { color: "#9aa6b2", fontSize: 12, lineHeight: 17, textAlign: "center", marginTop: 8 },
});
