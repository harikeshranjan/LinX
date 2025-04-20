"use client"
 
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
 
import { Button } from "@/components/ui/button"

export default function ModeToggle() {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else if (theme === "light") {
      setTheme("dark")
    }
  }

  return (
    <Button
      variant={"outline"}
      size={"icon"}
      className="w-9 h-9 p-0 rounded-lg cursor-pointer"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" onClick={toggleTheme} />
      ) : (
        <Moon className="w-5 h-5" onClick={toggleTheme} />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}