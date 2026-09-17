import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Redirect, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth, useSignIn, useSignUp, useUser } from "@clerk/expo";
import { useGame } from "@/context/GameContext";
import { useLang } from "@/context/LanguageContext";
import { StarsBackground } from "@/components/StarsBackground";
import { NeonButton } from "@/components/NeonButton";
import type { LangCode } from "@/data/translations";

const LANGS: { code: LangCode; flag: string }[] = [
  { code: "tr", flag: "🇹🇷" }, { code: "en", flag: "🇬🇧" }, { code: "fr", flag: "🇫🇷" },
  { code: "it", flag: "🇮🇹" }, { code: "ar", flag: "🇸🇦" },
];

export default function AuthScreen() {
  const { currentUser, hydrated, createProfileForIdentity } = useGame();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signIn, errors: signInErrors, fetchStatus: signInStatus } = useSignIn();
  const { signUp, errors: signUpErrors, fetchStatus: signUpStatus } = useSignUp();
  const { ts, lang, setLang } = useLang();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isSignedIn && user?.id && hydrated) {
      const identity = user.primaryEmailAddress?.emailAddress ?? email;
      const name = identity.split("@")[0] || "Oyuncu";
      createProfileForIdentity(name, user.id);
      router.replace("/home");
    }
  }, [isSignedIn, user, hydrated, email, createProfileForIdentity]);

  if (!hydrated) return null;
  if (currentUser && isSignedIn) return <Redirect href="/home" />;

  const busy = (mode === "signIn" ? signInStatus : signUpStatus) === "fetching";
  const fieldError = mode === "signIn"
    ? signInErrors.fields.identifier?.message ?? signInErrors.fields.password?.message
    : signUpErrors.fields.emailAddress?.message ?? signUpErrors.fields.password?.message;

  const complete = async (result: { error?: unknown }) => {
    if (result.error) {
      setError(String((result.error as { message?: string }).message ?? "Giriş başarısız. Bilgilerinizi kontrol edin."));
      return;
    }
    setError("");
  };

  const submit = async () => {
    setError("");
    try {
      if (mode === "signIn") {
        const result = await signIn.password({ emailAddress: email.trim(), password });
        await complete(result);
        if (signIn.status === "complete") await signIn.finalize();
      } else {
        const result = await signUp.password({ emailAddress: email.trim(), password });
        await complete(result);
        if (!result.error) await signUp.verifications.sendEmailCode();
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "İşlem tamamlanamadı.");
    }
  };

  const verify = async () => {
    try {
      await signUp.verifications.verifyEmailCode({ code: code.trim() });
      if (signUp.status === "complete") await signUp.finalize();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Doğrulama kodu geçersiz.");
    }
  };

  const verifying = mode === "signUp" && signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") && signUp.missingFields.length === 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StarsBackground />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.gameName}>🌌 Room-Link</Text>
          <Text style={styles.tagline}>{ts("tagline")}</Text>
          <Text style={styles.profileNotice}>Hesabınız güvenli biçimde Clerk ile korunur. Parolanız cihazda saklanmaz.</Text>
          <View style={styles.card}>
            <Text style={styles.heading}>{mode === "signIn" ? "Hesabınıza giriş yapın" : "Yeni hesap oluşturun"}</Text>
            {verifying ? (
              <>
                <Text style={styles.label}>E-postanıza gelen doğrulama kodu</Text>
                <TextInput style={styles.input} value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="123456" placeholderTextColor="#00ffcc" />
                {(error || signUpErrors.fields.code?.message) && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error || signUpErrors.fields.code?.message}</Text>
                  </View>
                )}
                <NeonButton label="E-postayı doğrula" onPress={verify} color="green" />
                <NeonButton label="Kodu yeniden gönder" onPress={() => void signUp.verifications.sendEmailCode()} color="cyan" />
              </>
            ) : (
              <>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" textContentType="emailAddress" placeholder="E-posta adresi" placeholderTextColor="#00ffcc" />
                <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry textContentType="password" placeholder="Parola" placeholderTextColor="#00ffcc" />
                {(error || fieldError) && <View style={styles.errorBox}><Text style={styles.errorText}>{error || fieldError}</Text></View>}
                <NeonButton label={mode === "signIn" ? "Giriş yap" : "Kayıt ol"} onPress={() => void submit()} color={mode === "signIn" ? "cyan" : "green"} disabled={busy || !email || !password} />
                <TouchableOpacity onPress={() => { setMode(mode === "signIn" ? "signUp" : "signIn"); setError(""); }}><Text style={styles.switch}>{mode === "signIn" ? "Yeni hesap oluştur" : "Zaten hesabım var"}</Text></TouchableOpacity>
              </>
            )}
            <View nativeID="clerk-captcha" />
          </View>
          <View style={styles.langRow}>{LANGS.map((l) => <TouchableOpacity key={l.code} style={[styles.langBtn, lang === l.code && styles.langBtnActive]} onPress={() => setLang(l.code)}><Text style={styles.langFlag}>{l.flag}</Text></TouchableOpacity>)}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0015" }, kav: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  gameName: { fontSize: 42, fontWeight: "900", color: "#00ff88", marginBottom: 8, textAlign: "center", letterSpacing: 3 },
  tagline: { color: "#00ffcc", fontSize: 16, marginBottom: 28, textAlign: "center" },
  profileNotice: { color: "#c0c9ea", fontSize: 13, lineHeight: 19, marginBottom: 18, maxWidth: 380, textAlign: "center" },
  card: { width: "100%", maxWidth: 380, backgroundColor: "rgba(20,20,60,0.92)", borderWidth: 2, borderColor: "#00ffff", borderRadius: 12, padding: 24, gap: 12 },
  heading: { color: "#00ff88", fontSize: 19, fontWeight: "700", textAlign: "center", marginBottom: 4 },
  label: { color: "#c0c9ea", fontSize: 13 }, input: { width: "100%", backgroundColor: "rgba(0,50,100,0.5)", borderWidth: 2, borderColor: "#00ffff", borderRadius: 8, padding: 13, color: "#00ff00", fontSize: 14 },
  errorBox: { backgroundColor: "rgba(255,0,0,0.15)", borderWidth: 1, borderColor: "#ff0099", borderRadius: 6, padding: 10 },
  errorText: { color: "#ff6688", textAlign: "center", fontSize: 13 }, switch: { color: "#00ffcc", textAlign: "center", padding: 8, textDecorationLine: "underline" },
  langRow: { flexDirection: "row", gap: 8, marginTop: 24 }, langBtn: { borderWidth: 2, borderColor: "#00ff88", borderRadius: 8, padding: 10, backgroundColor: "rgba(0,255,136,0.06)" },
  langBtnActive: { backgroundColor: "rgba(0,255,136,0.25)", borderColor: "#00ff00" }, langFlag: { fontSize: 20 },
});