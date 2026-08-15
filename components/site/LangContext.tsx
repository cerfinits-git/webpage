"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "th" | "en";

// Replaces the old data-th/data-en innerHTML swap. Every bilingual string
// lives as an adjacent th/en pair at its point of use via <T> — editing one
// language always puts the other in front of you.
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "th",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("th");

  useEffect(() => {
    // Same localStorage key as the old static site — visitors keep their choice.
    try {
      if (localStorage.getItem("cf-lang") === "en") setLangState("en");
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("cf-lang", l);
    } catch {}
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function T({ th, en }: { th: React.ReactNode; en: React.ReactNode }) {
  const { lang } = useLang();
  return <>{lang === "en" ? en : th}</>;
}
