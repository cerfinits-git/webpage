"use client";

import { useLang } from "./LangContext";

// Small TH/EN switch that reads the shared LanguageProvider. Styling is left to
// the wrapping context via `className` so it can sit inside the journal (j-*)
// or the plan nav without importing either theme's rules.
export default function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`lang-toggle ${className}`.trim()} role="group" aria-label="Language">
      <button
        type="button"
        className={lang === "th" ? "active" : ""}
        aria-pressed={lang === "th"}
        onClick={() => setLang("th")}
      >
        TH
      </button>
      <button
        type="button"
        className={lang === "en" ? "active" : ""}
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </div>
  );
}
