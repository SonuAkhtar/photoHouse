import { createContext, useContext, useEffect, useState } from "react";

export interface ThemeConfig {
  id: string;
  name: string;
  desc: string;
  swatches: [string, string, string];
}

export const themeList: ThemeConfig[] = [
  {
    id: "noir",
    name: "Noir",
    desc: "Dark · Editorial",
    swatches: ["#0a0908", "#f5f0eb", "#89b4c8"],
  },
  {
    id: "bloom",
    name: "Peach",
    desc: "Warm · Pastel",
    swatches: ["#fdf2ec", "#3c1e10", "#d97b51"],
  },
  {
    id: "coastal",
    name: "Sky",
    desc: "Cool · Airy",
    swatches: ["#eef5f8", "#0f2a38", "#5b9eb5"],
  },
  {
    id: "tokyo",
    name: "Lavender",
    desc: "Soft · Romantic",
    swatches: ["#f4f0fa", "#2a1d4a", "#7c5cbf"],
  },
  {
    id: "film",
    name: "Rose",
    desc: "Blush · Refined",
    swatches: ["#fdf0f3", "#3a0f1e", "#c75478"],
  },
];

interface ThemeCtx {
  theme: string;
  setTheme: (id: string) => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: "noir",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<string>(
    () => localStorage.getItem("ph-theme") ?? "noir",
  );

  const setTheme = (id: string) => {
    setThemeState(id);
    localStorage.setItem("ph-theme", id);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
