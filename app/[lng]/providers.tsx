"use client";

import { ThemeProvider } from "next-themes";
import { cacheThemeKey } from "@/constants";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey={cacheThemeKey}
      attribute="class"
    >
      {children}
    </ThemeProvider>
  );
}
