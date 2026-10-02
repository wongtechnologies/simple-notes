import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemePreference = "system" | "light" | "dark";

const THEME_KEY = "themePreference";

export async function loadThemePreference(): Promise<ThemePreference> {
  const value = await AsyncStorage.getItem(THEME_KEY);
  return value === "light" || value === "dark" ? value : "system";
}

export async function saveThemePreference(preference: ThemePreference): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, preference);
}