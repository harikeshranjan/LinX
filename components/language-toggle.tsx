import Image from "next/image";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useLanguage } from "@/hooks/use-language";
import { ChevronDown } from "lucide-react"; // Using lucide-react for better icon

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="cursor-pointer bg-primary-foreground/30 shadow-md backdrop-blur-xl h-10 px-3 sm:px-4"
        >
          <Image 
            src={language === "en" ? "/en.png" : "/tr.png"} 
            alt="Language" 
            width={20} 
            height={20} 
            className="sm:mr-2" 
          />
          <p className="hidden sm:block">
            {language === "en" ? "English" : "Türkçe"}
          </p>
          <ChevronDown className="h-4 w-4 ml-0 sm:ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")} className="flex items-center">
          <Image 
            src="/en.png" 
            alt="English" 
            width={20} 
            height={20} 
            className="mr-2" 
          />
          <p>{language === "en" ? "English" : "İngilizce"}</p>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("tr")} className="flex items-center">
          <Image 
            src="/tr.png" 
            alt="Turkish" 
            width={20} 
            height={20} 
            className="mr-2" 
          />
          <p>{language === "tr" ? "Türkçe" : "Turkish"}</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}