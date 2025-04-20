"use client";

import { useLanguage } from "@/hooks/use-language";
import { footerTranslation } from "@/languages/footer";

export default function Footer() {
  const { language } = useLanguage();
  const translations = footerTranslation[language];
  
  return (
    <footer className="border-t py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">          
          <div className="flex items-center text-sm opacity-80">
            {translations.title}
          </div>
          
          <p className="text-xs opacity-60 mt-3">
            {translations.allRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
}