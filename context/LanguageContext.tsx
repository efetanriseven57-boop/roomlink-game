import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { type LangCode, type Translation, translations } from "@/data/translations";

type LanguageContextType = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: keyof Translation) => string | string[];
  ts: (key: keyof Translation) => string;
  ta: (key: keyof Translation) => string[];
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("tr");

  useEffect(() => {
    AsyncStorage.getItem("rlp_lang").then((v) => {
      if (v && translations[v as LangCode]) setLangState(v as LangCode);
    });
  }, []);

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    AsyncStorage.setItem("rlp_lang", l);
  }, []);

  const t = useCallback(
    (key: keyof Translation): string | string[] => {
      const val = translations[lang][key];
      return val as string | string[];
    },
    [lang]
  );

  const ts = useCallback(
    (key: keyof Translation): string => {
      const val = translations[lang][key];
      return typeof val === "string" ? val : String(val);
    },
    [lang]
  );

  const ta = useCallback(
    (key: keyof Translation): string[] => {
      const val = translations[lang][key];
      return Array.isArray(val) ? val : [];
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, ts, ta }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be inside LanguageProvider");
  return ctx;
}
