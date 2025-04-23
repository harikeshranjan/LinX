"use client";

import { Check, Copy, QrCode, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useLanguage } from "@/hooks/use-language";
import { customLinksTranslations } from "@/languages/custom-links";

export default function LinkCards({
  originalLink,
  customLink,
}: {
  originalLink: string;
  customLink: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const { language } = useLanguage();
  const translate = customLinksTranslations[language];
  const shortUrl = `linx.vercel.app/${customLink}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${shortUrl}`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleVisit = () => {
    window.open(`https://${shortUrl}`, "_blank");
  };

  const textTruncate = (text: string, length: number) => {
    if (text.length > length) {
      return text.slice(0, length) + "...";
    }
    return text;
  }

  return (
    <div className="group relative rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-md bg-neutral-50 dark:bg-neutral-900">
      <div className="flex flex-col sm:flex-row sm:items-center w-full">
        {/* Original link display */}
        <div className="p-4 sm:p-5 border-b sm:border-b-0 sm:border-r flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <ExternalLink className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{translate.original}</span>
          </div>
          <p className="truncate text-sm text-gray-700 dark:text-gray-300">{textTruncate(originalLink, 35)}</p>
        </div>

        {/* Shortened link display */}
        <div className="p-4 sm:p-5 flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{translate.shortened}</span>
          </div>
          <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">
            {textTruncate(shortUrl, 40)}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex border-t sm:border-t-0 sm:border-l">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none border-r last:border-r-0"
                  onClick={handleCopy}
                  aria-label="Copy link"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isCopied ? translate.copied : translate.copyToClipboard}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none border-r last:border-r-0"
                  aria-label="Generate QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{translate.generateQrCode}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none border-r last:border-r-0"
                  onClick={handleVisit}
                  aria-label="Visit link"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{translate.visitLink}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Success indicator - appears when copied */}
      {isCopied && (
        <div className="absolute top-0 inset-x-0 h-1 bg-green-500 transition-all"></div>
      )}
    </div>
  );
}