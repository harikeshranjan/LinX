"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { User } from "@/lib/types";
import LanguageToggle from "@/components/language-toggle";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/use-language";
import { registerTranslations } from "@/languages/register";
import ModeToggle from "@/components/mode-toggle";
import { toast } from "sonner";
import { toastsTranslations } from "@/languages/toasts";
import { useRouter } from "next/navigation";

export default function Register() {
  const [formData, setFormData] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { language } = useLanguage();
  const tt = toastsTranslations[language];
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast(tt.error, {
        description: tt.passwordDidntMatch,
        duration: 3000,
      })
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 400) {
          toast(tt.error, {
            description: tt.allFieldsRequired,
            duration: 3000,
          })
        } else if (response.status === 409) {
          toast(tt.error, {
            description: tt.userAlreadyExists,
            duration: 3000,
          })
        }
        return;
      }

      toast(tt.success, {
        description: tt.loginToAccount,
        duration: 3000,
      })
      router.push("/login");
    } catch (error) {
      console.error("Error in register:", error);
      toast(tt.error, {
        description: tt.failedToCreateAccount,
        duration: 3000,
      })
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
            {registerTranslations[language].createAccount}
          </CardTitle>
          <CardDescription className="text-center">
            {registerTranslations[language].subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  {registerTranslations[language].firstName}
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  {registerTranslations[language].lastName}
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                {registerTranslations[language].email}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {registerTranslations[language].password}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {registerTranslations[language].confirmPassword}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
              <Button className="w-full mt-3" type="submit">
                {loading === true ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  registerTranslations[language].createButton
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            {registerTranslations[language].alreadyHaveAccount}{" "}
            <Link href="/login" className="font-medium underline underline-offset-4">
              {registerTranslations[language].signIn}
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