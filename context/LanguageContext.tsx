"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "np" | "en";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (np: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "np",
  setLang: () => {},
  t: (np) => np,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("np");
  const t = (np: string, en: string) => (lang === "np" ? np : en);
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
