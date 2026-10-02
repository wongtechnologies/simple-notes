import { darkColors, lightColors, type ThemeColors } from "@/constants/colors";
import { loadThemePreference, saveThemePreference, type ThemePreference } from "@/lib/settings";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";

type ThemeContextValue = {
  colors: ThemeColors;
  scheme: "light" | "dark";
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  // Load the saved choice once, when the app starts.
  useEffect(() => {
    loadThemePreference().then(setPreferenceState);
  }, []);

  function setPreference(newPreference: ThemePreference) {
    setPreferenceState(newPreference);   // update the screen now
    saveThemePreference(newPreference);  // remember it for next time
  }

  const scheme =
    preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference;
  const colors = scheme === "dark" ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, scheme, preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return value;
}