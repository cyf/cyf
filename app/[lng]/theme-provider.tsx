"use client";
import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { cacheThemeKey } from "@/constants";
import { defaultTheme } from "@/theme";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      defaultTheme={defaultTheme}
      storageKey={cacheThemeKey}
      attribute="class"
    >
      {children}
    </NextThemesProvider>
  );
}
