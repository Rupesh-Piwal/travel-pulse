"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Immediately applies the resolved theme class to <html>.
 * This MUST be synchronous so flushSync + startViewTransition
 * can snapshot the DOM in the correct state.
 */
function applyThemeToDOM(theme: Theme): "dark" | "light" {
  const root = document.documentElement;
  let resolved: "dark" | "light";

  if (theme === "system") {
    resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } else {
    resolved = theme;
  }

  root.classList.remove("light", "dark");
  root.classList.add(resolved);

  // Persist
  if (theme === "system") {
    localStorage.removeItem("theme");
  } else {
    localStorage.setItem("theme", theme);
  }

  return resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");
  const [mounted, setMounted] = useState(false);

  // On mount: read from localStorage and apply immediately
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial = saved ?? "system";
    const resolved = applyThemeToDOM(initial);
    setThemeState(initial);
    setResolvedTheme(resolved);
    setMounted(true);
  }, []);

  // Listen for OS-level preference changes when in "system" mode
  useEffect(() => {
    if (!mounted || theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const resolved = applyThemeToDOM("system");
      setResolvedTheme(resolved);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme, mounted]);

  // Synchronous setter — applies DOM class IMMEDIATELY so view transitions work
  const setTheme = useCallback((newTheme: Theme) => {
    const resolved = applyThemeToDOM(newTheme);
    setThemeState(newTheme);
    setResolvedTheme(resolved);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
