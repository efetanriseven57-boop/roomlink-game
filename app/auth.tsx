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

const PASSWORD_MIN_LENGTH = 15;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type AuthMode = "signIn" | "signUp";
type ResetStep = "email" | "code" | "password";

function getClerkErrorDetails(error: unknown): { code: string; message: string } {
  if (!error || typeof error !== "object") return { code: "", message: "" };
  const value = error as {
    code?: string;
    message?: string;
    longMessage?: string;
    errors?: Array<{ code?: string; message?: string; longMessage?: string }>;
  };
  const issue = value.errors?.[0] ?? value;
  return {
    code: issue.code ?? "",
    message: issue.longMessage ?? issue.message ?? "",
  };
}

function translateClerkError(error: unknown, lang: LangCode): string {
  const { code, message } = getClerkErrorDetails(error);
  if (lang !== "tr") return message || "The operation could not be completed. Please try again.";

  const messages: Record<string, string> = {
    form_identifier_not_found: "Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.",
    form_password_incorrect: "E-posta adresi veya parola hatalı.",
    form_password_length_too_short: `Parola en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır.`,
    form_password_length_too_long: "Parola izin verilen uzunluğu aşıyor.",
    form_password_pwned: "Bu parola daha önce veri ihlallerinde görülmüş. Lütfen farklı ve güçlü bir parola seçin.",
    form_identifier_exists: "Bu e-posta adresiyle daha önce hesap oluşturulmuş.",
    form_param_format_invalid: "Girdiğiniz bilgilerin biçimi geçersiz. Lütfen kontrol edin.",
    form_code_incorrect: "Doğrulama kodu yanlış. Lütfen e-postadaki son kodu girin.",
    verification_expired: "Doğrulama kodunun süresi dolmuş. Lütfen yeni kod isteyin.",
    too_many_requests: "Çok fazla deneme yapıldı. Lütfen bir süre bekleyip yeniden deneyin.",
    session_exists: "Bu cihazda zaten açık bir oturum var.",
  };
  if (messages[code]) return messages[code];

  const normalized = message.toLocaleLowerCase("en-US");
  if (normalized.includes("password") && normalized.includes("15")) {
    return `Parola en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır.`;
  }
  if (normalized.includes("password") && (normalized.includes("incorrect") || normalized.includes("invalid"))) {
    return "E-posta adresi veya parola hatalı.";
  }
  if (normalized.includes("code") && (normalized.includes("incorrect") || normalized.includes("invalid"))) {
    return "Doğrulama kodu yanlış. Lütfen e-postadaki son kodu girin.";
  }
  return "İşlem tamamlanamadı. Bilgilerinizi kontrol edip yeniden deneyin.";
}

export default function AuthScreen() {
  const { currentUser, hydrated, createProfileForIdentity } = useGame();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signIn, errors: signInErrors, fetchStatus: signInStatus } = useSignIn();
  const { signUp, errors: signUpErrors, fetchStatus: signUpStatus } = useSignUp();
  const { ts, lang, setLang } = useLang();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [resetStep, setResetStep] = useState<ResetStep | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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
  const fieldIssue = mode === "signIn"
    ? signInErrors.fields.identifier ?? signInErrors.fields.password
    : signUpErrors.fields.emailAddress ?? signUpErrors.fields.password;
  const fieldError = fieldIssue ? translateClerkError(fieldIssue, lang) : "";

  const validateEmail = (): boolean => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError(lang === "tr"
        ? "Geçerli bir e-posta adresi girin. Örnek: adiniz@example.com"
        : "Enter a valid email address. Example: name@example.com");
      return false;
    }
    return true;
  };

  const validateNewPassword = (): boolean => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(lang === "tr"
        ? `Parola en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır.`
        : `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
      return false;
    }
    if (password !== passwordConfirmation) {
      setError(lang === "tr" ? "Parolalar birbiriyle eşleşmiyor." : "Passwords do not match.");
      return false;
    }
    return true;
  };

  const complete = (result: { error?: unknown }): boolean => {
    if (result.error) {
      setError(translateClerkError(result.error, lang));
      return false;
    }
    setError("");
    return true;
  };

  const submit = async () => {
    setError("");
    setNotice("");
    if (!validateEmail()) return;
    try {
      if (mode === "signIn") {
        const result = await signIn.password({ emailAddress: email.trim(), password });
        if (!complete(result)) return;
        if (signIn.status === "complete") complete(await signIn.finalize());
      } else {
        if (!validateNewPassword()) return;
        const result = await signUp.password({ emailAddress: email.trim(), password });
        if (!complete(result)) return;
        if (!result.error) await signUp.verifications.sendEmailCode();
      }
    } catch (caught) {
      setError(translateClerkError(caught, lang));
    }
  };

  const verify = async () => {
    setError("");
    try {
      const result = await signUp.verifications.verifyEmailCode({ code: code.trim() });
      if (!complete(result)) return;
      if (signUp.status === "complete") complete(await signUp.finalize());
    } catch (caught) {
      setError(translateClerkError(caught, lang));
    }
  };

  const resendSignUpCode = async () => {
    setError("");
    try {
      complete(await signUp.verifications.sendEmailCode());
    } catch (caught) {
      setError(translateClerkError(caught, lang));
    }
  };

  const startPasswordReset = () => {
    setMode("signIn");
    setResetStep("email");
    setPassword("");
    setPasswordConfirmation("");
    setCode("");
    setError("");
    setNotice("");
    signIn.reset();
  };

  const sendResetCode = async () => {
    setError("");
    setNotice("");
    if (!validateEmail()) return;
    try {
      const created = await signIn.create({ identifier: email.trim() });
      if (created.error) {
        const { code: errorCode } = getClerkErrorDetails(created.error);
        if (errorCode === "form_identifier_not_found") {
          setResetStep("code");
          setNotice(lang === "tr"
            ? "Bu e-posta adresiyle bir hesap varsa sıfırlama kodu gönderildi."
            : "If an account exists for this email, a reset code has been sent.");
          return;
        }
        setError(translateClerkError(created.error, lang));
        return;
      }
      const sent = await signIn.resetPasswordEmailCode.sendCode();
      if (sent.error) {
        setError(translateClerkError(sent.error, lang));
        return;
      }
      setResetStep("code");
      setNotice(lang === "tr"
        ? "Bu e-posta adresiyle bir hesap varsa sıfırlama kodu gönderildi."
        : "If an account exists for this email, a reset code has been sent.");
    } catch (caught) {
      setError(translateClerkError(caught, lang));
    }
  };

  const verifyResetCode = async () => {
    setError("");
    try {
      const result = await signIn.resetPasswordEmailCode.verifyCode({ code: code.trim() });
      if (result.error) {
        setError(translateClerkError(result.error, lang));
        return;
      }
      setPassword("");
      setPasswordConfirmation("");
      setNotice("");
      setResetStep("password");
    } catch (caught) {
      setError(translateClerkError(caught, lang));
    }
  };

  const submitNewPassword = async () => {
    setError("");
    if (!validateNewPassword()) return;
    try {
      const result = await signIn.resetPasswordEmailCode.submitPassword({
        password,
        signOutOfOtherSessions: true,
      });
      if (result.error) {
        setError(translateClerkError(result.error, lang));
        return;
      }
      if (signIn.status === "complete") complete(await signIn.finalize());
    } catch (caught) {
      setError(translateClerkError(caught, lang));
    }
  };

  const resendResetCode = async () => {
    setError("");
    try {
      const result = await signIn.resetPasswordEmailCode.sendCode();
      if (!complete(result)) return;
      setNotice(lang === "tr" ? "Yeni sıfırlama kodu gönderildi." : "A new reset code has been sent.");
    } catch (caught) {
      setError(translateClerkError(caught, lang));
    }
  };

  const returnToSignIn = () => {
    setResetStep(null);
    setMode("signIn");
    setPassword("");
    setPasswordConfirmation("");
    setCode("");
    setError("");
    setNotice("");
    signIn.reset();
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
          <Text style={styles.profileNotice}>
            {lang === "tr"
              ? "Hesabınız güvenli biçimde korunur. Parolanız cihazda saklanmaz."
              : "Your account is protected securely. Your password is not stored on the device."}
          </Text>
          <View style={styles.card}>
            <Text style={styles.heading}>
              {resetStep
                ? (lang === "tr" ? "Parolanızı sıfırlayın" : "Reset your password")
                : mode === "signIn"
                  ? (lang === "tr" ? "Hesabınıza giriş yapın" : "Sign in to your account")
                  : (lang === "tr" ? "Yeni hesap oluşturun" : "Create a new account")}
            </Text>
            {resetStep === "email" ? (
              <>
                <Text style={styles.label}>
                  {lang === "tr"
                    ? "Hesabınıza bağlı e-posta adresini girin. Sıfırlama kodunu bu adrese göndereceğiz."
                    : "Enter the email address linked to your account. We will send a reset code."}
                </Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" textContentType="emailAddress" placeholder={lang === "tr" ? "E-posta adresi" : "Email address"} placeholderTextColor="#00ffcc" />
                {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}
                <NeonButton label={lang === "tr" ? "Sıfırlama kodu gönder" : "Send reset code"} onPress={() => void sendResetCode()} color="green" disabled={signInStatus === "fetching" || !email.trim()} />
                <TouchableOpacity onPress={returnToSignIn}><Text style={styles.switch}>{lang === "tr" ? "Giriş ekranına dön" : "Back to sign in"}</Text></TouchableOpacity>
              </>
            ) : resetStep === "code" ? (
              <>
                <Text style={styles.label}>
                  {lang === "tr" ? "E-postanıza gönderilen doğrulama kodunu girin." : "Enter the verification code sent to your email."}
                </Text>
                <TextInput style={styles.input} value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="123456" placeholderTextColor="#00ffcc" />
                {notice ? <View style={styles.noticeBox}><Text style={styles.noticeText}>{notice}</Text></View> : null}
                {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}
                <NeonButton label={lang === "tr" ? "Kodu doğrula" : "Verify code"} onPress={() => void verifyResetCode()} color="green" disabled={signInStatus === "fetching" || !code.trim()} />
                <NeonButton label={lang === "tr" ? "Yeni kod gönder" : "Send a new code"} onPress={() => void resendResetCode()} color="cyan" disabled={signInStatus === "fetching"} />
                <TouchableOpacity onPress={returnToSignIn}><Text style={styles.switch}>{lang === "tr" ? "Giriş ekranına dön" : "Back to sign in"}</Text></TouchableOpacity>
              </>
            ) : resetStep === "password" ? (
              <>
                <Text style={styles.label}>
                  {lang === "tr" ? "Yeni parolanızı oluşturun." : "Create your new password."}
                </Text>
                <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry textContentType="newPassword" placeholder={lang === "tr" ? "Yeni parola" : "New password"} placeholderTextColor="#00ffcc" />
                <TextInput style={styles.input} value={passwordConfirmation} onChangeText={setPasswordConfirmation} secureTextEntry textContentType="newPassword" placeholder={lang === "tr" ? "Yeni parolayı tekrar girin" : "Confirm new password"} placeholderTextColor="#00ffcc" />
                <Text style={styles.passwordRule}>
                  {lang === "tr"
                    ? `• En az ${PASSWORD_MIN_LENGTH} karakter\n• Tahmin edilmesi zor ve daha önce kullanmadığınız bir parola seçin`
                    : `• At least ${PASSWORD_MIN_LENGTH} characters\n• Choose a unique password that is hard to guess`}
                </Text>
                {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}
                <NeonButton label={lang === "tr" ? "Yeni parolayı kaydet" : "Save new password"} onPress={() => void submitNewPassword()} color="green" disabled={signInStatus === "fetching" || !password} />
                <TouchableOpacity onPress={returnToSignIn}><Text style={styles.switch}>{lang === "tr" ? "İptal et" : "Cancel"}</Text></TouchableOpacity>
              </>
            ) : verifying ? (
              <>
                <Text style={styles.label}>{lang === "tr" ? "E-postanıza gelen doğrulama kodu" : "Verification code sent to your email"}</Text>
                <TextInput style={styles.input} value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="123456" placeholderTextColor="#00ffcc" />
                {(error || signUpErrors.fields.code?.message) && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error || translateClerkError(signUpErrors.fields.code, lang)}</Text>
                  </View>
                )}
                <NeonButton label={lang === "tr" ? "E-postayı doğrula" : "Verify email"} onPress={verify} color="green" />
                <NeonButton label={lang === "tr" ? "Kodu yeniden gönder" : "Send code again"} onPress={() => void resendSignUpCode()} color="cyan" />
              </>
            ) : (
              <>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" textContentType="emailAddress" placeholder={lang === "tr" ? "E-posta adresi" : "Email address"} placeholderTextColor="#00ffcc" />
                <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry textContentType={mode === "signUp" ? "newPassword" : "password"} placeholder={lang === "tr" ? "Parola" : "Password"} placeholderTextColor="#00ffcc" />
                {mode === "signUp" && (
                  <>
                    <TextInput style={styles.input} value={passwordConfirmation} onChangeText={setPasswordConfirmation} secureTextEntry textContentType="newPassword" placeholder={lang === "tr" ? "Parolayı tekrar girin" : "Confirm password"} placeholderTextColor="#00ffcc" />
                    <Text style={styles.passwordRule}>
                      {lang === "tr"
                        ? `• En az ${PASSWORD_MIN_LENGTH} karakter\n• Tahmin edilmesi zor ve daha önce kullanmadığınız bir parola seçin`
                        : `• At least ${PASSWORD_MIN_LENGTH} characters\n• Choose a unique password that is hard to guess`}
                    </Text>
                  </>
                )}
                {(error || fieldError) && <View style={styles.errorBox}><Text style={styles.errorText}>{error || fieldError}</Text></View>}
                <NeonButton label={mode === "signIn" ? (lang === "tr" ? "Giriş yap" : "Sign in") : (lang === "tr" ? "Kayıt ol" : "Sign up")} onPress={() => void submit()} color={mode === "signIn" ? "cyan" : "green"} disabled={busy || !email || !password || (mode === "signUp" && !passwordConfirmation)} />
                {mode === "signIn" && (
                  <TouchableOpacity onPress={startPasswordReset}><Text style={styles.switch}>{lang === "tr" ? "Parolamı unuttum" : "Forgot password"}</Text></TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => { setMode(mode === "signIn" ? "signUp" : "signIn"); setPassword(""); setPasswordConfirmation(""); setError(""); setNotice(""); }}>
                  <Text style={styles.switch}>
                    {mode === "signIn"
                      ? (lang === "tr" ? "Yeni hesap oluştur" : "Create a new account")
                      : (lang === "tr" ? "Zaten hesabım var" : "I already have an account")}
                  </Text>
                </TouchableOpacity>
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
  label: { color: "#c0c9ea", fontSize: 13, lineHeight: 19 }, input: { width: "100%", backgroundColor: "rgba(0,50,100,0.5)", borderWidth: 2, borderColor: "#00ffff", borderRadius: 8, padding: 13, color: "#00ff00", fontSize: 14 },
  passwordRule: { color: "#9aa8cf", fontSize: 12, lineHeight: 18 },
  noticeBox: { backgroundColor: "rgba(0,255,136,0.1)", borderWidth: 1, borderColor: "#00ff88", borderRadius: 6, padding: 10 },
  noticeText: { color: "#b8ffd8", textAlign: "center", fontSize: 13, lineHeight: 18 },
  errorBox: { backgroundColor: "rgba(255,0,0,0.15)", borderWidth: 1, borderColor: "#ff0099", borderRadius: 6, padding: 10 },
  errorText: { color: "#ff6688", textAlign: "center", fontSize: 13 }, switch: { color: "#00ffcc", textAlign: "center", padding: 8, textDecorationLine: "underline" },
  langRow: { flexDirection: "row", gap: 8, marginTop: 24 }, langBtn: { borderWidth: 2, borderColor: "#00ff88", borderRadius: 8, padding: 10, backgroundColor: "rgba(0,255,136,0.06)" },
  langBtnActive: { backgroundColor: "rgba(0,255,136,0.25)", borderColor: "#00ff00" }, langFlag: { fontSize: 20 },
});