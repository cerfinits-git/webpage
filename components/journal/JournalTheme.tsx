"use client";

import { createContext, useContext, useEffect, useState } from "react";
import JournalIcon from "./JournalIcon";
import { useLang } from "@/components/site/LangContext";

export type JournalTheme = "dark" | "light";

export const JOURNAL_THEME_STORAGE_KEY = "cerfinits-journal-theme";

const ThemeContext = createContext<{ theme: JournalTheme; toggleTheme: () => void }>({
  theme: "dark",
  toggleTheme: () => {},
});

/**
 * Renders the .journal-app root with data-theme. Dark is the product default
 * (S7 — "trading screen" register); light is a persisted preference. An inline
 * script applies the stored choice before hydration so light users don't get
 * a dark flash.
 */
export function JournalThemeShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<JournalTheme>("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(JOURNAL_THEME_STORAGE_KEY);
      if (stored === "light" || stored === "dark") setTheme(stored);
    } catch {}
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(JOURNAL_THEME_STORAGE_KEY, next);
      } catch {}
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="journal-app" data-theme={theme} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem(${JSON.stringify(JOURNAL_THEME_STORAGE_KEY)});if(t==="light"||t==="dark"){document.currentScript.parentElement.setAttribute("data-theme",t)}}catch(e){}`,
          }}
        />
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useJournalTheme() {
  return useContext(ThemeContext);
}

export function JournalThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useJournalTheme();
  const { lang } = useLang();
  return (
    <button
      type="button"
      className={`j-theme-toggle ${className}`.trim()}
      onClick={toggleTheme}
      aria-label={
        lang === "en"
          ? theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
          : theme === "dark" ? "สลับเป็นธีมสว่าง" : "สลับเป็นธีมมืด"
      }
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      <JournalIcon name={theme === "dark" ? "sun" : "moon"} size={16} />
    </button>
  );
}
