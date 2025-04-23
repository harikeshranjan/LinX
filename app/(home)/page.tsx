"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Scissors, Lock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { homepageTranslations } from "@/languages/homepage";
import { toast } from "sonner";
import { toastsTranslations } from "@/languages/toasts";

export default function Home() {
  const [originalLink, setOriginalLink] = useState<string>("");
  const [shortenedLink, setShortenedLink] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { language } = useLanguage();
  const translate = homepageTranslations[language];
  const tt = toastsTranslations[language];

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://linx.vercel.app/${shortenedLink}`);
    toast(tt.copied, {
      description: tt.linkCopied,
    });
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const handleShortenLink = async () => {
    if (!originalLink) {
      toast(tt.error, {
        description: tt.pasteUrl,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ originalUrl: originalLink })
      })

      if (!response.ok) {
        throw new Error("Failed to shorten the link");
      }

      const data = await response.json();
      setShortenedLink(data.newLink.shortenedUrl);
    } catch (error) {
      toast(tt.error, {
        description: tt.failedToShortenLink,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex flex-col items-center py-20 px-5">
      <h2 className="text-5xl md:text-6xl font-bold text-center mt-10 mb-4 tracking-wide">
        {translate.title}
      </h2>

      <div className="relative max-w-xl w-full flex my-7">
        <Input
          type="text"
          placeholder={translate.pasteLink}
          className="w-full px-5 h-13 rounded-full border-1 transition duration-200 ease-in-out font-medium tracking-wide"
          value={originalLink}
          onChange={(e) => setOriginalLink(e.target.value)}
        />
        <Button
          disabled={loading}
          className="absolute right-0 w-28 h-13 rounded-full flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 transition duration-200 ease-in-out cursor-pointer"
          onClick={handleShortenLink}
        >
          {loading ? (
            <Loader2 className="animate-spin" />           
          ) : (
            <Scissors />
          )}
          <span>{loading ? translate.shortening : translate.shorten}</span>
        </Button>
      </div>

      {shortenedLink && (
        <div className="w-full max-w-lg px-5">
          <Card className=" mt-4 border shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                {translate.yourLink}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <p className="font-medium truncate">
                  {`https://linx.vercel.app/${shortenedLink}`}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 cursor-pointer hover:bg-gray-100 rounded-md transition duration-200 ease-in-out"
                  onClick={handleCopy}
                >
                  {!copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy mr-1">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  ) : (
                    <Check />
                  )}
                </Button>
              </div>
              <p className="text-xs mt-6 text-center opacity-70">
                {translate.signin}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto mt-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{translate.whyChooseLinx} Lin<span className="text-blue-500">X</span>?</h2>
          <p className="text-lg max-w-2xl mx-auto opacity-80">{translate.whyLinxDescription}</p>
          <Separator className="max-w-xs mx-auto mt-8" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-5">
          {translate.features.map((feature, index) => (
            <Card key={index} className="border-b-4 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 h-full overflow-hidden cursor-pointer">
              <CardHeader className="px-6 flex items-center gap-4">
                <div className="h-14 w-14 rounded-full flex items-center justify-center border-2 shadow-sm">
                  <feature.icon className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-6 text-justify">
                <p className="opacity-80">{feature.description}</p>
              </CardContent>
              <CardFooter className="px-6 flex flex-col items-center">
                {feature.loginRequired && (
                  <Badge variant={"secondary"} className="flex items-center text-xs opacity-70 py-2 px-4 rounded-full border cursor-pointer transition-all duration-200 ease-in-out">
                    <Lock size={12} className="mr-1" />
                    {translate.loginRequired}
                  </Badge>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}