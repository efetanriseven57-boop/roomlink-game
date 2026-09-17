// =============================================
// GOOGLE ADMOB YAPILANDIRMASI
// =============================================
// Gerçek mobil reklamlar, Google Mobile Ads native modülü içeren
// Android/iOS build'lerinde çalışır. Expo Go ve web'de oyun akışı
// reklamsız ve güvenli bir geri dönüşle devam eder.

export const ADMOB_IDS = {
  // Uygulama ID (app.json'a da eklendi)
  APP_ID: "ca-app-pub-8243323417740323~4778084886",

  // Geçiş Reklamı (Interstitial) - Oyun başı ve sonu
  INTERSTITIAL: "ca-app-pub-8243323417740323/7915885572",

  // Ödüllü Reklam (Rewarded) - "Cezadan kurtar" özelliği için
  REWARDED: "ca-app-pub-8243323417740323/6829533150",
};

// Test ID'leri (geliştirme sırasında bunları kullan)
export const TEST_IDS = {
  INTERSTITIAL: "ca-app-pub-3940256099942544/1033173712",
  REWARDED: "ca-app-pub-3940256099942544/5224354917",
};

// Üretim mi test mi?
// EAS build'de: __DEV__ = false → gerçek ID'ler kullanılır
// Expo Go'da: __DEV__ = true → test ID'leri kullanılır (ama native olmadığı için yine de çalışmaz)
export const getAdIds = () => {
  if (__DEV__) return TEST_IDS;
  return ADMOB_IDS;
};
