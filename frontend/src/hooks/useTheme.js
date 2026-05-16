import { useState, useEffect } from "react";

export function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("vitacare-theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("vitacare-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("vitacare-theme", "light");
    }
  }, [darkMode]);

  const toggle = () => setDarkMode((prev) => !prev);
  return { darkMode, toggle };
}