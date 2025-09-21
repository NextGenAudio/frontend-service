"use client";

import React, { ReactNode, useContext, useEffect } from "react";
import { useState, createContext } from "react";

type Theme = {
  id: string;
  name: string;
  description: string;
  primary: string;
  accent: string;
  preview: string;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const defaultTheme: Theme = {
    id: "orange",
    name: "Sunset Orange",
    description: "Warm and energetic",
    primary: "orange-500",
    accent: "from-orange-400 to-amber-500",
    preview: "bg-gradient-to-r from-orange-500 to-red-500",
  };

  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);

    try {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        const parsedTheme = JSON.parse(storedTheme);
        setTheme(parsedTheme);
      }
    } catch (error) {
      console.warn("Invalid theme data in localStorage, using default:", error);
      localStorage.removeItem("theme");
    }
  }, []);

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    if (isHydrated) {
      try {
        localStorage.setItem("theme", JSON.stringify(newTheme));
      } catch (error) {
        console.warn("Failed to save theme to localStorage:", error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
};
