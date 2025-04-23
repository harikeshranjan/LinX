"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import LanguageToggle from "./language-toggle";
import ModeToggle from "./mode-toggle";
import { useLanguage } from "@/hooks/use-language";
import { navbarTranslation } from "@/languages/navbar";
import { AtSign, LogIn, LogOut, User, UserPlus2 } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const { data, status } = useSession();
  const { language } = useLanguage();
  const translate = navbarTranslation[language];
  const router = useRouter();

  return (
    <nav className="fixed md:top-5 flex w-full md:w-[90vw] lg:w-[80vw] xl:w-[75vw] justify-between left-1/2 transform -translate-x-1/2 md:rounded-full py-2 px-6 md:px-10 bg-primary-foreground/30 shadow-md backdrop-blur-xl z-50 border border-border/90">
      <Link href="/" className="flex items-center">
        <h1 className="text-3xl md:text-3xl font-bold tracking-tight transition-colors duration-200 hover:opacity-80">
          Lin<span className="text-blue-500">X</span>
        </h1>
      </Link>

      <ul className="hidden md:flex gap-8 items-center">
        <li>
          <Link href="/custom-links" className="relative group">
            <span className="font-medium transition-colors duration-200 hover:text-blue-500">
              {translate.customLinks}
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </li>
        <li>
          <Link href="/manage-links" className="relative group">
            <span className="font-medium transition-colors duration-200 hover:text-blue-500">
              {translate.manageLinks}
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </li>
      </ul>

      <div className="hidden md:flex items-center space-x-3 md:space-x-4">
        <div className="flex space-x-3 items-center">
          <LanguageToggle />
          <ModeToggle />
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {status === "authenticated" || status === "loading" ? (
            <>
              <div className="relative group">
                <button className="rounded-full overflow-hidden hover:ring-1 hover:ring-offset-2 hover:ring-primary/5 transition-all duration-200 focus:outline-none cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                    {data?.user?.image ? (
                      <Image
                        src={"https://github.com/shadcn.png"}
                        alt="User avatar"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                        <img
                          src="https://github.com/shadcn.png"
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </button>

                <div className="absolute right-0 mt-2 w-72 origin-top-right invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out scale-95 group-hover:scale-100 z-10">
                  <div className="rounded-md shadow-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
                    <div className="p-4">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-center flex-col">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                            <img
                              src={"https://github.com/shadcn.png"}
                              alt="User avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="mt-2 font-medium text-neutral-900 dark:text-neutral-100">{data?.user?.firstName || "User"}</h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">{data?.user?.email || "email@example.com"}</p>
                        </div>

                        <div className="h-px bg-neutral-200 dark:bg-neutral-700" />

                        <div className="space-y-2">
                          <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{translate.yourInfo}</h4>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-150">
                              <User className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                              <span className="text-sm font-medium">{data?.user?.firstName || "User"}</span>
                            </div>
                            <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition duration-150">
                              <AtSign className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                              <span className="text-sm font-medium truncate">{data?.user?.email || "email@example.com"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-neutral-200 dark:bg-neutral-700" />

                        <div className="space-y-2">
                          <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{translate.actionButtons}</h4>
                          <Link href="/logout" className="flex items-center space-x-3 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-red-500 dark:text-red-400 transition duration-150">
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Logout</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="rounded-full px-4 md:px-6 py-2 text-sm font-medium hover:text-blue-500 transition-all duration-200 cursor-pointer"
                onClick={() => router.push("/login")}
              >
                {translate.login}
                <LogIn className="w-4 h-4" />
              </Button>
              <Button
                variant="default"
                className="rounded-full px-4 md:px-6 py-2 text-sm font-medium shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
                onClick={() => router.push("/register")}
              >
                {translate.register}
                <UserPlus2 />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* hamburger menu */}
      {status === "authenticated" || status === "loading" ? (
        <Drawer>
          <DrawerTrigger className="md:hidden">
            <div className="block md:hidden">
              <Button variant={"outline"} className="flex md:hidden items-center justify-center w-10 h-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </Button>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-center text-3xl">Menu</DrawerTitle>
              <DrawerDescription>
                <ul className="flex flex-col items-center justify-center gap-4 mt-6">
                  <li className="w-[50%] text-center border border-border/90 rounded-full px-5 py-2">
                    <Link href="/custom-links" className="font-medium">
                      {translate.customLinks}
                    </Link>
                  </li>
                  <li className="w-[50%] text-center border border-border/90 rounded-full px-5 py-2">
                    <Link href="/manage-links" className="font-medium">
                      {translate.manageLinks}
                    </Link>
                  </li>
                  <li className="w-[50%] text-center border border-border/90 rounded-full bg-red-500 text-white">
                    <Button variant={"ghost"} onClick={() => signOut()} className="font-medium">
                      {translate.logout}
                    </Button>
                  </li>
                </ul>
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      ) : (
        <div className="md:hidden flex items-center space-x-2">
          <LanguageToggle />
          <ModeToggle />
          <Button
            variant="outline"
            className="rounded-lg px-4 md:px-6 py-2 text-sm font-medium hover:text-blue-500 transition-all duration-200 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            {translate.login}
            <LogIn className="w-4 h-4" />
          </Button>
        </div>
      )}
    </nav>
  )
}