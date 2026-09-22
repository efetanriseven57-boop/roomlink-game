import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { itemEmojis, localizedQuestionBanks, roomDefinitions, type BranchId, type Difficulty, type LocalizedQuestion, type QuestionLocale } from "@/data/questions";

const KEYS = {
  PROFILES: "rlp_profiles",
  LEGACY_ACCOUNTS: "rlp_accounts",
  CURRENT_USER: "rlp_currentUser",
  CURRENT_USER_ID: "rlp_currentUserId",
  SCORES: "rlp_scores_v4",
  FRIENDS_PREFIX: "rlp_friends_",
};

function genId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export type Profile = { id: string };
export type Profiles = Record<string, Profile>;

export type ScoreRecord = {
  player_name: string;
  player_id: string;
  score: number;
  level: number;
  rooms_solved: number;
  difficulty: string;
  branch: string;
  branchIds?: BranchId[];
  won: boolean;
  date: string;
};

export type InventoryItem = { emoji: string; roomId: string; index: number };

export type GameSessionState = {
  playerName: string;
  playerId: string;
  difficulty: Difficulty;
  selectedBranches: BranchId[];
  locale: QuestionLocale;
  score: number;
  level: number;
  timeLeft: number;
  totalTime: number;
  roomsSolved: number;
  inventory: InventoryItem[];
  gameActive: boolean;
  usedQuestions: Record<string, Set<number>>;
  consecutiveCorrect: number;
};

type GameContextType = {
  profiles: Profiles;
  currentUser: string | null;
  currentUserId: string | null;
  hydrated: boolean;
  scores: ScoreRecord[];
  friends: string[];
  session: GameSessionState | null;
  questionModal: {
    attemptId: number;
    visible: boolean;
    question: LocalizedQuestion | null;
    shuffledOptions: LocalizedQuestion["options"];
    roomId: string;
    itemIndex: number;
    timeLeft: number;
    penaltyActive: boolean;
    penaltyLeft: number;
    selectedAnswer: string | null;
    answerResult: "correct" | "incorrect" | null;
  };
  gameTimerDisplay: string;
  gameTimerState: "normal" | "warning" | "danger";
  endGameResult: { won: boolean; score: number } | null;

  selectProfile: (username: string) => string | null;
  createProfile: (username: string) => string | null;
  createProfileForIdentity: (username: string, identityId: string) => string | null;
  logout: () => void;
  startGame: (difficulty: Difficulty, branches: BranchId[], playerName: string, locale: QuestionLocale) => void;
  openQuestion: (roomId: string, itemIndex: number) => void;
  selectAnswer: (answer: string) => void;
  submitAnswer: () => void;
  skipPenalty: (attemptId: number) => void;
  pausePenalty: () => void;
  resumePenalty: () => void;
  closeQuestion: () => void;
  endGame: (won: boolean) => void;
  clearEndGame: () => void;
  addFriend: (username: string) => string | null;
  removeFriend: (username: string) => void;
  searchUsers: (query: string) => string[];
};

const GameContext = createContext<GameContextType | null>(null);

const defaultSession = (): GameSessionState => ({
  playerName: "",
  playerId: "",
  difficulty: "easy",
  selectedBranches: [],
  locale: "tr",
  score: 0,
  level: 1,
  timeLeft: 300,
  totalTime: 300,
  roomsSolved: 0,
  inventory: [],
  gameActive: false,
  usedQuestions: {},
  consecutiveCorrect: 0,
});

const defaultQModal = () => ({
  attemptId: 0,
  visible: false,
  question: null as LocalizedQuestion | null,
  shuffledOptions: [] as LocalizedQuestion["options"],
  roomId: "",
  itemIndex: 0,
  timeLeft: 30,
  penaltyActive: false,
  penaltyLeft: 0,
  selectedAnswer: null as string | null,
  answerResult: null as "correct" | "incorrect" | null,
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profiles>({});
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [session, setSession] = useState<GameSessionState | null>(null);
  const [qModal, setQModal] = useState(defaultQModal());
  const [gameTimerDisplay, setGameTimerDisplay] = useState("-");
  const [gameTimerState, setGameTimerState] = useState<"normal" | "warning" | "danger">("normal");
  const [endGameResult, setEndGameResult] = useState<{ won: boolean; score: number } | null>(null);

  const gameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const qTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const penaltyTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRef = useRef<GameSessionState | null>(null);
  const gameEndedRef = useRef(false);
  const resultRecordedRef = useRef(false);
  const questionAttemptRef = useRef(0);
  const questionResolvedRef = useRef(false);
  const penaltyPausedRef = useRef(false);
  const lastQuestionIdRef = useRef<string | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [storedProfiles, legacyAccounts, raw2, cu, cuid] = await Promise.all([
          AsyncStorage.getItem(KEYS.PROFILES),
          AsyncStorage.getItem(KEYS.LEGACY_ACCOUNTS),
          AsyncStorage.getItem(KEYS.SCORES),
          AsyncStorage.getItem(KEYS.CURRENT_USER),
          AsyncStorage.getItem(KEYS.CURRENT_USER_ID),
        ]);

        let profileData = storedProfiles;
        if (!storedProfiles && legacyAccounts) {
          try {
            const legacy = JSON.parse(legacyAccounts) as Record<string, { id?: unknown }>;
            const migratedProfiles: Profiles = {};
            if (legacy && typeof legacy === "object" && !Array.isArray(legacy)) {
              for (const [username, legacyProfile] of Object.entries(legacy)) {
                if (legacyProfile && typeof legacyProfile.id === "string" && legacyProfile.id) {
                  migratedProfiles[username] = { id: legacyProfile.id };
                }
              }
            }
            profileData = JSON.stringify(migratedProfiles);
            await AsyncStorage.setItem(KEYS.PROFILES, profileData);
          } catch {
            profileData = null;
          } finally {
            await AsyncStorage.removeItem(KEYS.LEGACY_ACCOUNTS);
          }
        } else if (legacyAccounts) {
          await AsyncStorage.removeItem(KEYS.LEGACY_ACCOUNTS);
        }

        if (profileData) {
          try {
            const parsed = JSON.parse(profileData);
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) setProfiles(parsed);
          } catch {
            await AsyncStorage.removeItem(KEYS.PROFILES);
          }
        }
        if (raw2) {
          try {
            const parsed = JSON.parse(raw2);
            if (Array.isArray(parsed)) {
              setScores(parsed.map((score: ScoreRecord) => ({
                ...score,
                branchIds: score.branchIds ?? score.branch.split(",").map(Number).filter((id): id is BranchId => Number.isInteger(id) && id >= 0 && id <= 5),
              })).sort((a: ScoreRecord, b: ScoreRecord) => b.score - a.score));
            }
          } catch {
            await AsyncStorage.removeItem(KEYS.SCORES);
          }
        }
        if (cu && cuid) {
          setCurrentUser(cu);
          setCurrentUserId(cuid);
          const friendsRaw = await AsyncStorage.getItem(KEYS.FRIENDS_PREFIX + cuid);
          if (friendsRaw) {
            try {
              const parsedFriends = JSON.parse(friendsRaw);
              setFriends(Array.isArray(parsedFriends) ? parsedFriends.filter((friend): friend is string => typeof friend === "string") : []);
            } catch {
              setFriends([]);
              await AsyncStorage.removeItem(KEYS.FRIENDS_PREFIX + cuid);
            }
          }
        }
      } catch {
        // Corrupt storage must not block the local profile flow.
      } finally {
        setHydrated(true);
      }
    })();
    return () => {
      clearTimers();
    };
  }, []);

  const clearTimers = () => {
    if (gameTimerRef.current) { clearInterval(gameTimerRef.current); gameTimerRef.current = null; }
    if (qTimerRef.current) { clearInterval(qTimerRef.current); qTimerRef.current = null; }
    if (penaltyTimerRef.current) { clearInterval(penaltyTimerRef.current); penaltyTimerRef.current = null; }
  };

  const selectProfile = useCallback((username: string): string | null => {
    if (!username) return "errUserEmpty";
    if (!profiles[username]) return "errNotFound";
    const uid = profiles[username].id;
    setCurrentUser(username);
    setCurrentUserId(uid);
    AsyncStorage.setItem(KEYS.CURRENT_USER, username);
    AsyncStorage.setItem(KEYS.CURRENT_USER_ID, uid);
    AsyncStorage.getItem(KEYS.FRIENDS_PREFIX + uid).then((v) => {
      setFriends(v ? JSON.parse(v) : []);
    });
    return null;
  }, [profiles]);

  const createProfile = useCallback((username: string): string | null => {
    if (!username) return "errUserEmpty";
    if (username.length < 3) return "errUserShort";
    if (profiles[username]) return "errUserExists";
    const newId = genId();
    const newProfiles = { ...profiles, [username]: { id: newId } };
    setProfiles(newProfiles);
    AsyncStorage.setItem(KEYS.PROFILES, JSON.stringify(newProfiles));
    setCurrentUser(username);
    setCurrentUserId(newId);
    setFriends([]);
    AsyncStorage.setItem(KEYS.CURRENT_USER, username);
    AsyncStorage.setItem(KEYS.CURRENT_USER_ID, newId);
    AsyncStorage.setItem(KEYS.FRIENDS_PREFIX + newId, "[]");
    return null;
  }, [profiles]);

  const createProfileForIdentity = useCallback((username: string, identityId: string): string | null => {
    const normalized = username.trim();
    if (!normalized || !identityId) return "errUserEmpty";
    const existing = profiles[normalized];
    const newProfiles = existing
      ? profiles
      : { ...profiles, [normalized]: { id: identityId } };
    if (!existing) {
      setProfiles(newProfiles);
      AsyncStorage.setItem(KEYS.PROFILES, JSON.stringify(newProfiles));
    }
    setCurrentUser(normalized);
    setCurrentUserId(existing?.id ?? identityId);
    setFriends([]);
    AsyncStorage.setItem(KEYS.CURRENT_USER, normalized);
    AsyncStorage.setItem(KEYS.CURRENT_USER_ID, existing?.id ?? identityId);
    AsyncStorage.setItem(KEYS.FRIENDS_PREFIX + (existing?.id ?? identityId), "[]");
    return null;
  }, [profiles]);

  const logout = useCallback(() => {
    clearTimers();
    setCurrentUser(null);
    setCurrentUserId(null);
    setSession(null);
    setFriends([]);
    setEndGameResult(null);
    setQModal(defaultQModal());
    setGameTimerDisplay("-");
    setGameTimerState("normal");
    AsyncStorage.removeItem(KEYS.CURRENT_USER);
    AsyncStorage.removeItem(KEYS.CURRENT_USER_ID);
  }, []);

  const startGameTimer = useCallback((initialTime: number) => {
    clearTimers();
    const tick = () => {
      if (appStateRef.current !== "active") return;
      setSession((prev) => {
        if (!prev || !prev.gameActive) return prev;
        const newTime = prev.timeLeft - 1;
        const m = Math.floor(newTime / 60);
        const s = newTime % 60;
        setGameTimerDisplay(String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0"));
        setGameTimerState(newTime <= 60 ? "danger" : newTime <= 180 ? "warning" : "normal");
        if (newTime <= 0) {
          clearInterval(gameTimerRef.current!);
          gameTimerRef.current = null;
          const updated = { ...prev, timeLeft: 0, gameActive: false };
          sessionRef.current = updated;
          setTimeout(() => endGameInternal(false, updated), 0);
          return updated;
        }
        return { ...prev, timeLeft: newTime };
      });
    };
    gameTimerRef.current = setInterval(tick, 1000);
  }, []);

  const endGameInternal = useCallback((won: boolean, sess: GameSessionState, alreadyClaimed = false) => {
    if (gameEndedRef.current && !alreadyClaimed) return;
    gameEndedRef.current = true;
    if (resultRecordedRef.current) return;
    resultRecordedRef.current = true;
    clearTimers();
    questionAttemptRef.current += 1;
    questionResolvedRef.current = true;
    setQModal(defaultQModal());
    let finalScore = sess.score;
    if (won) finalScore += sess.timeLeft * 10;

    const record: ScoreRecord = {
      player_name: sess.playerName,
      player_id: sess.playerId,
      score: finalScore,
      level: sess.level,
      rooms_solved: sess.roomsSolved,
      difficulty: sess.difficulty,
      branch: String(sess.selectedBranches.join(",")),
      branchIds: sess.selectedBranches,
      won,
      date: new Date().toISOString(),
    };
    setScores((prev) => {
      const updated = [record, ...prev].sort((a, b) => b.score - a.score).slice(0, 100);
      AsyncStorage.setItem(KEYS.SCORES, JSON.stringify(updated));
      return updated;
    });
    setSession((prev) => prev ? { ...prev, score: finalScore, gameActive: false } : prev);
    setEndGameResult({ won, score: finalScore });
  }, []);

  const startGame = useCallback((difficulty: Difficulty, branches: BranchId[], playerName: string, locale: QuestionLocale) => {
    const timeMap = { easy: 300, medium: 600, hard: 900 };
    const totalTime = timeMap[difficulty];
    const m = Math.floor(totalTime / 60);
    const s = totalTime % 60;
    setGameTimerDisplay(String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0"));
    setGameTimerState("normal");
    const newSession: GameSessionState = {
      ...defaultSession(),
      playerName,
      playerId: currentUserId ?? "",
      difficulty,
      selectedBranches: branches,
      locale,
      totalTime,
      timeLeft: totalTime,
      gameActive: true,
    };
    setSession(newSession);
    sessionRef.current = newSession;
    gameEndedRef.current = false;
    resultRecordedRef.current = false;
    questionAttemptRef.current += 1;
    questionResolvedRef.current = false;
    lastQuestionIdRef.current = null;
    setEndGameResult(null);
    setQModal(defaultQModal());
    startGameTimer(totalTime);
  }, [currentUserId, startGameTimer]);

  const openQuestion = useCallback((roomId: string, itemIndex: number) => {
    const sess = sessionRef.current;
    if (!sess || !sess.gameActive || gameEndedRef.current) return;
    type Candidate = { branchIdx: BranchId; questionIndex: number; question: LocalizedQuestion };
    const candidatesFor = (usedQuestions: Record<string, Set<number>>): Candidate[] =>
      sess.selectedBranches.flatMap((branchIdx) => {
        const questions = localizedQuestionBanks[sess.locale][branchIdx]?.[sess.difficulty] ?? [];
        const key = branchIdx + "_" + sess.difficulty;
        const used = usedQuestions[key] ?? new Set<number>();
        return questions.flatMap((question, questionIndex) =>
          used.has(questionIndex) ? [] : [{ branchIdx, questionIndex, question }],
        );
      });

    let nextUsedQuestions = { ...sess.usedQuestions };
    let available = candidatesFor(nextUsedQuestions);
    if (available.length === 0) {
      nextUsedQuestions = { ...nextUsedQuestions };
      sess.selectedBranches.forEach((branchIdx) => {
        nextUsedQuestions[branchIdx + "_" + sess.difficulty] = new Set<number>();
      });
      available = candidatesFor(nextUsedQuestions);
    }
    if (available.length === 0) return;
    const candidatesWithoutImmediateRepeat = available.filter(
      ({ question }) => question.id !== lastQuestionIdRef.current,
    );
    if (candidatesWithoutImmediateRepeat.length > 0) {
      available = candidatesWithoutImmediateRepeat;
    }

    const selected = available[Math.floor(Math.random() * available.length)];
    const { branchIdx, questionIndex: origIdx, question } = selected;
    lastQuestionIdRef.current = question.id;
    const key = branchIdx + "_" + sess.difficulty;
    const usedForKey = new Set(nextUsedQuestions[key] ?? []);
    usedForKey.add(origIdx);
    const updatedSession = {
      ...sess,
      usedQuestions: { ...nextUsedQuestions, [key]: usedForKey },
    };
    sessionRef.current = updatedSession;
    setSession(updatedSession);

    const shuffled = [...question.options].sort(() => Math.random() - 0.5);

    if (qTimerRef.current) { clearInterval(qTimerRef.current); qTimerRef.current = null; }

    const attemptId = ++questionAttemptRef.current;
    questionResolvedRef.current = false;
    setQModal({
      attemptId,
      visible: true,
      question,
      shuffledOptions: shuffled,
      roomId,
      itemIndex,
      timeLeft: 30,
      penaltyActive: false,
      penaltyLeft: 0,
      selectedAnswer: null,
      answerResult: null,
    });

    let qTimeLeft = 30;
    qTimerRef.current = setInterval(() => {
      if (appStateRef.current !== "active" || attemptId !== questionAttemptRef.current || questionResolvedRef.current) return;
      if (!sessionRef.current?.gameActive || gameEndedRef.current) {
        if (qTimerRef.current) clearInterval(qTimerRef.current);
        qTimerRef.current = null;
        return;
      }
      qTimeLeft--;
      setQModal((prev) => {
        if (!prev.visible) { clearInterval(qTimerRef.current!); return prev; }
        if (qTimeLeft <= 0) {
          questionResolvedRef.current = true;
          clearInterval(qTimerRef.current!);
          qTimerRef.current = null;
          setSession((active) => {
            if (!active) return active;
            const updated = { ...active, score: Math.max(0, active.score - 10), consecutiveCorrect: 0 };
            sessionRef.current = updated;
            return updated;
          });
          const penaltyDeadline = Date.now() + 20_000;
          penaltyTimerRef.current = setInterval(() => {
            if (attemptId !== questionAttemptRef.current) {
              if (penaltyTimerRef.current) clearInterval(penaltyTimerRef.current);
              penaltyTimerRef.current = null;
              return;
            }
            if (penaltyPausedRef.current) return;
            if (!sessionRef.current?.gameActive || gameEndedRef.current) {
              if (penaltyTimerRef.current) clearInterval(penaltyTimerRef.current);
              penaltyTimerRef.current = null;
              return;
            }
            const penaltyLeft = Math.max(0, Math.ceil((penaltyDeadline - Date.now()) / 1000));
            setQModal((modal) => {
              if (penaltyLeft <= 0) {
                clearInterval(penaltyTimerRef.current!);
                penaltyTimerRef.current = null;
                questionAttemptRef.current += 1;
                setTimeout(() => openQuestion(prev.roomId, prev.itemIndex), 200);
                return { ...modal, penaltyActive: false, penaltyLeft: 0, visible: false };
              }
              return { ...modal, penaltyLeft };
            });
          }, 250);
          return { ...prev, timeLeft: 0, answerResult: "incorrect", penaltyActive: true, penaltyLeft: 20 };
        }
        return { ...prev, timeLeft: qTimeLeft };
      });
    }, 1000);
  }, []);

  const selectAnswer = useCallback((answer: string) => {
    setQModal((prev) => {
      if (!prev.visible || prev.penaltyActive || prev.answerResult || questionResolvedRef.current) return prev;
      return { ...prev, selectedAnswer: answer };
    });
  }, []);

  const submitAnswer = useCallback(() => {
    if (questionResolvedRef.current || !sessionRef.current?.gameActive || gameEndedRef.current) return;
    questionResolvedRef.current = true;
    setQModal((prev) => {
      if (!prev.selectedAnswer || !prev.question || prev.penaltyActive || prev.answerResult) {
        questionResolvedRef.current = false;
        return prev;
      }
      if (qTimerRef.current) { clearInterval(qTimerRef.current); qTimerRef.current = null; }
      const isCorrect = prev.selectedAnswer === prev.question.correctOptionId;

      if (isCorrect) {
        setSession((sess) => {
          if (!sess) return sess;
          const newScore = sess.score + 20;
          const emoji = itemEmojis[prev.itemIndex % itemEmojis.length];
          const newInventory = [...sess.inventory, { emoji, roomId: prev.roomId, index: prev.itemIndex }];
          const itemsNeeded = sess.difficulty === "easy" ? 2 : sess.difficulty === "medium" ? 3 : 6;
          const roomIdx = roomDefinitions.findIndex((r) => r.id === prev.roomId);
          const roomItemCount = newInventory.filter((inv) => inv.roomId === prev.roomId).length;
          let newRoomsSolved = sess.roomsSolved;
          let newLevel = sess.level;
          if (roomItemCount >= itemsNeeded && roomIdx === sess.roomsSolved) {
            newRoomsSolved++;
            newLevel = Math.min(5, newRoomsSolved + 1);
            if (newRoomsSolved === 4) {
              const updated = { ...sess, score: newScore, inventory: newInventory, roomsSolved: newRoomsSolved, level: newLevel, gameActive: false };
              sessionRef.current = updated;
              // Claim the result and stop every timer before yielding. Otherwise
              // the final game tick can record a loss before the win is shown.
              gameEndedRef.current = true;
              clearTimers();
              setTimeout(() => endGameInternal(true, updated, true), 0);
              return updated;
            }
          }
          const updated = { ...sess, score: newScore, inventory: newInventory, roomsSolved: newRoomsSolved, level: newLevel, consecutiveCorrect: sess.consecutiveCorrect + 1 };
          sessionRef.current = updated;
          return updated;
        });
        return { ...prev, answerResult: "correct", visible: false };
      } else {
        setSession((sess) => {
          if (!sess) return sess;
          const updated = { ...sess, score: Math.max(0, sess.score - 10), consecutiveCorrect: 0 };
          sessionRef.current = updated;
          return updated;
        });
        const penaltyDeadline = Date.now() + 20_000;
        const penaltyAttemptId = questionAttemptRef.current;
        penaltyTimerRef.current = setInterval(() => {
          if (penaltyAttemptId !== questionAttemptRef.current) {
            if (penaltyTimerRef.current) clearInterval(penaltyTimerRef.current);
            penaltyTimerRef.current = null;
            return;
          }
          if (penaltyPausedRef.current) return;
          if (!sessionRef.current?.gameActive || gameEndedRef.current) {
            if (penaltyTimerRef.current) clearInterval(penaltyTimerRef.current);
            penaltyTimerRef.current = null;
            return;
          }
          const penaltyLeft = Math.max(0, Math.ceil((penaltyDeadline - Date.now()) / 1000));
          setQModal((p) => {
            if (penaltyLeft <= 0) {
              clearInterval(penaltyTimerRef.current!);
              penaltyTimerRef.current = null;
              questionAttemptRef.current += 1;
              setTimeout(() => openQuestion(prev.roomId, prev.itemIndex), 200);
              return { ...p, penaltyActive: false, penaltyLeft: 0, visible: false };
            }
            return { ...p, penaltyLeft };
          });
        }, 250);
        return { ...prev, answerResult: "incorrect", penaltyActive: true, penaltyLeft: 20 };
      }
    });
  }, [endGameInternal, openQuestion]);

  const skipPenalty = useCallback((attemptId: number) => {
    if (attemptId !== questionAttemptRef.current || !qModal.visible || !qModal.penaltyActive) return;
    questionAttemptRef.current += 1;
    penaltyPausedRef.current = false;
    if (penaltyTimerRef.current) {
      clearInterval(penaltyTimerRef.current);
      penaltyTimerRef.current = null;
    }
    const { roomId, itemIndex } = qModal;
    setQModal((prev) => ({ ...prev, penaltyActive: false, penaltyLeft: 0, visible: false }));
    setTimeout(() => openQuestion(roomId, itemIndex), 200);
  }, [openQuestion, qModal]);

  const pausePenalty = useCallback(() => {
    penaltyPausedRef.current = true;
  }, []);

  const resumePenalty = useCallback(() => {
    penaltyPausedRef.current = false;
  }, []);

  const closeQuestion = useCallback(() => {
    questionAttemptRef.current += 1;
    questionResolvedRef.current = false;
    if (qTimerRef.current) { clearInterval(qTimerRef.current); qTimerRef.current = null; }
    setQModal(defaultQModal());
  }, []);

  const endGame = useCallback((won: boolean) => {
    const sess = sessionRef.current;
    if (sess) endGameInternal(won, sess);
  }, [endGameInternal]);

  const clearEndGame = useCallback(() => {
    setEndGameResult(null);
    setSession(null);
    sessionRef.current = null;
  }, []);

  const addFriend = useCallback((username: string): string | null => {
    if (!profiles[username]) return "notFound";
    if (username === currentUser) return "notFound";
    if (friends.includes(username)) return null;
    const updated = [...friends, username];
    setFriends(updated);
    if (currentUserId) AsyncStorage.setItem(KEYS.FRIENDS_PREFIX + currentUserId, JSON.stringify(updated));
    return null;
  }, [profiles, currentUser, currentUserId, friends]);

  const removeFriend = useCallback((username: string) => {
    const updated = friends.filter((f) => f !== username);
    setFriends(updated);
    if (currentUserId) AsyncStorage.setItem(KEYS.FRIENDS_PREFIX + currentUserId, JSON.stringify(updated));
  }, [currentUserId, friends]);

  const searchUsers = useCallback((query: string): string[] => {
    if (!query.trim()) return [];
    return Object.keys(profiles).filter((u) => u.toLowerCase().includes(query.toLowerCase()) && u !== currentUser);
  }, [profiles, currentUser]);

  return (
    <GameContext.Provider value={{
      profiles, currentUser, currentUserId, hydrated, scores, friends, session,
      questionModal: qModal, gameTimerDisplay, gameTimerState, endGameResult,
      selectProfile, createProfile, createProfileForIdentity, logout, startGame, openQuestion, selectAnswer, submitAnswer, skipPenalty, pausePenalty, resumePenalty,
      closeQuestion, endGame, clearEndGame, addFriend, removeFriend, searchUsers,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
}
