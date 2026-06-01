"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

export function usePrefersDark(): boolean {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark";
}
