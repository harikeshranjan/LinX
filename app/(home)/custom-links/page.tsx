"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Scissors, Link as LinkIcon, Check, Cookie, BarChart2, Shield, ArrowRight } from "lucide-react";
import { customLinksTranslations } from "@/languages/custom-links";
import { useLanguage } from "@/hooks/use-language";
import { toast } from "sonner";
import { toastsTranslations } from "@/languages/toasts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LinkCards from "@/components/link-card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CustomLinksProps {
  originalLink: string;
  customLink: string;
}

interface CustomLink {
  _id: string;
  originalLink: string;
  customLink: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export default function CustomLinks() {
  const [formData, setFormData] = useState<CustomLinksProps>({
    originalLink: "",
    customLink: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [topThreeLinks, setTopThreeLinks] = useState<CustomLink[]>([]);
  const [shortenedLink, setShortenedLink] = useState<string | null>(null);
  const { language } = useLanguage();
  const translate = customLinksTranslations[language];
  const tt = toastsTranslations[language];
  const { status } = useSession()
  const router = useRouter()

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://linx.vercel.app/${formData.customLink}`);
    toast(tt.copied, {
      description: tt.linkCopied,
    });
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const fetchAllLinks = async () => {    
    try {
      const response = await fetch("/api/custom-links/get-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast(tt.error, {
          description: tt.failedToShortenLink,
          duration: 3000,
        });
        return;
      }

      const data = await response.json();
      const { customLinks } = data;

      const topThreeLinks = customLinks.slice(0, 3);
      setTopThreeLinks(topThreeLinks);
    } catch (error) {
      console.log(error);
      toast(tt.error, {
        description: tt.failedToFetchLinks,
        duration: 3000,
      });
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      toast(tt.error, {
        description: tt.unauthorized,
        duration: 3000,
      });
      router.push("/login")
    }

    if (status === "authenticated") {
      fetchAllLinks()
    }
  }, [status, setTopThreeLinks])

  const handleShortenLink = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.originalLink || !formData.customLink) {
      toast(tt.error, {
        description: tt.enterAllFields,
        duration: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      let response = await fetch("/api/custom-links/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalLink: formData.originalLink,
          customLink: formData.customLink,
        }),
      })

      if (!response.ok) {
        toast(tt.error, {
          description: tt.failedToShortenLink,
          duration: 3000,
        });
        return;
      }

      const data = await response.json();
      const { customLink } = data;
      setShortenedLink(customLink);
      toast(tt.success, {
        description: tt.linkShortened,
        duration: 3000,
      });
      setFormData({
        originalLink: "",
        customLink: "",
      });
    } catch (error) {
      console.log(error)
      toast(tt.error, {
        description: tt.failedToShortenLink,
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center py-12 md:py-20 px-4 md:px-5">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mt-6 md:mt-10 mb-4 tracking-wide">
        {translate.title}
      </h2>

      <form className="w-full max-w-2xl mx-auto mt-8 mb-10 space-y-4 md:space-y-6" onSubmit={handleShortenLink}>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <LinkIcon size={18} />
          </div>
          <Input
            type="url"
            placeholder={translate.pasteLink}
            className="w-full pl-10 pr-4 py-6 rounded-xl border transition duration-200 ease-in-out font-medium tracking-wide shadow-sm"
            value={formData.originalLink}
            onChange={(e) => setFormData({ ...formData, originalLink: e.target.value })}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Scissors size={18} />
            </div>
            <Input
              type="text"
              placeholder={translate.enterCustomLink}
              className="w-full pl-10 pr-4 py-6 rounded-xl border transition duration-200 ease-in-out font-medium tracking-wide shadow-sm"
              value={formData.customLink}
              onChange={(e) => setFormData({ ...formData, customLink: e.target.value })}
            />
          </div>

          <Button
            disabled={loading}
            className="min-h-12 px-6 py-6 rounded-xl font-medium md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition duration-200 ease-in-out shadow-md hover:shadow-lg"
            type="submit"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Scissors className="w-5 h-5" />
            )}
            <span className="ml-1">{translate.shorten}</span>
          </Button>
        </div>
      </form>

      {shortenedLink && (
        <div className="w-full max-w-lg px-5">
          <Card className="mt-4 border shadow-lg rounded-xl overflow-hidden">
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
              <div className="flex items-center justify-between rounded-lg border">
                <span className="flex items-center gap-4 font-medium truncate">
                  <div className="h-full p-3 bg-gray-100/10 rounded-l-lg">
                    <Cookie
                      size={24}
                    />
                  </div>
                  {`https://linx.vercel.app/${shortenedLink}`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 mr-2 cursor-pointer hover:bg-gray-100 rounded-md transition duration-200 ease-in-out"
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
            </CardContent>
          </Card>
        </div>
      )}

      <div className="w-full max-w-3xl mt-10">
        <h3 className="group flex gap-4 items-center text-2xl font-semibold mb-4">{translate.recentLinks || "Your Recent Links"}<ArrowRight className="mt-1 group-hover:translate-x-1 duration-200 ease-in-out" /></h3>
        {topThreeLinks.length > 0 ? (
          <>
            <div className="space-y-2">
              {topThreeLinks.map((link) => (
                <LinkCards
                  key={link._id}
                  originalLink={link.originalLink}
                  customLink={link.customLink}
                />
              ))}
            </div>
            <Button
              variant="link"
              className="text-blue-600 hover:text-blue-700 mt-4 cursor-pointer"
              onClick={() => router.push("/manage-links")}
            >
              {translate.seeAllLinks || "See All Links"}
            </Button>
          </>
        ) : (
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mt-10" />
        )}
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <Separator className="my-10" />
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center my-10 tracking-wide">{translate.featuresYoullLove}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          {[
            { icon: <Scissors />, title: translate.customLinks || "Custom Links", description: translate.customLinksDesc || "Create branded links that reflect your identity" },
            { icon: <BarChart2 />, title: translate.analytics || "Click Analytics", description: translate.analyticsDesc || "Track performance with detailed click statistics" },
            { icon: <Shield />, title: translate.secure || "Secure & Fast", description: translate.secureDesc || "Enterprise-grade security and blazing fast redirects" }
          ].map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl border shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 transition duration-200 ease-in-out">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}