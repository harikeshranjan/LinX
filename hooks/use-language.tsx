"use client"

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"

const LanguageContext = createContext<{
  language: "en" | "tr";
  setLanguage: Dispatch<SetStateAction<"en" | "tr">>;
}>({
  language: "en",
  setLanguage: () => { },
})

export const useLanguage = () => {
  return useContext(LanguageContext);
}

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<"en" | "tr">(() => {
    if (typeof window !== "undefined") {
      const storedLanguage = localStorage.getItem("userLanguage");
      return (storedLanguage || "en") as "en" | "tr";
    }
    return "en";
  })

  useEffect(() => {
    localStorage.setItem("userLanguage", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}