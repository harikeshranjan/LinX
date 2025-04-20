"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { loginTranaslations } from "@/languages/login";
import { Separator } from "@/components/ui/separator";
import LanguageToggle from "@/components/language-toggle";
import ModeToggle from "@/components/mode-toggle";
import { toastsTranslations } from "@/languages/toasts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const { language } = useLanguage();
  const translations = loginTranaslations[language];
  const tt = toastsTranslations[language];
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      let response = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (response?.error) {
        toast(tt.error, {
          description: tt.invalidCredentials,
          duration: 3000,
        });
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast(tt.error, {
        description: tt.failedToLogin,
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <Link href="/">
              <h1 className="text-4xl font-bold tracking-tight">
                Lin<span className="text-blue-500">X</span>
              </h1>
            </Link>
          </div>
          <CardTitle className="text-2xl text-center">
            {translations.title}
          </CardTitle>
          <CardDescription className="text-center">
            {translations.subtitles}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">
                {translations.email}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {translations.password}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
              <Button className="w-full mt-3" type="submit">
                {loading == true ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : translations.login
                }
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            {translations.dontHaveAccount}{" "}
            <Link href="/register" className="font-medium underline underline-offset-4">
              {translations.signUp}
            </Link>
          </div>

          <Separator />

          <div className="flex items-center justify-center space-x-2">
            <LanguageToggle />
            <ModeToggle />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}