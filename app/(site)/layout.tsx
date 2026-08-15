import { LanguageProvider } from "@/components/site/LangContext";
import { ThemeProvider } from "@/components/site/ThemeContext";
import ScrollFx from "@/components/site/ScrollFx";
import "./site.css";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="site">
          {children}
          <ScrollFx />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
