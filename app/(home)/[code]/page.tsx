"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";
import { redirectTranslations } from "@/languages/redirect";
import { toastsTranslations } from "@/languages/toasts";
import { toast } from "sonner";

export default function CodeRedirectPage() {
  const params = useParams();
  const code = params?.code as string;
  const { language } = useLanguage();
  const translate = redirectTranslations[language];
  const tt = toastsTranslations[language];

  useEffect(() => {
    const redirectToLink = async () => {
      try {
        const response = await fetch(`/api/custom-links/${code}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          toast(tt.error, {
            description: tt.failedToFetchLinks,
          });
          return;
        }

        const data = await response.json();
        if (data?.originalLink) {
          window.location.href = data.originalLink;
        }
      } catch (error) {
        console.error("Error fetching the link:", error);
      }
    };

    if (code) {
      redirectToLink();
    }
  }, [code]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">{translate.redirecting}</h1>
      <p className="text-gray-600">{translate.pleaseWait}</p>
    </div>
  );
}
