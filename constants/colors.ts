export const lightColors = {
  background: "#F5F3EF", // warm off-white page
  card: "#FFFFFF",       // note cards, search box
  text: "#1A1A1A",       // main text
  textMuted: "#8A8680",  // dates, previews, placeholders
  border: "#E6E2DC",     // thin outlines
  primary: "#1A1A1A",    // black "+" button, selected pill
  onPrimary: "#FFFFFF",  // text/icons ON a primary-coloured thing
  danger: "#DC2626",     // delete
};

export type ThemeColors = typeof lightColors;

export const darkColors: ThemeColors = {
  background: "#161616", // charcoal page
  card: "#232323",
  text: "#F2F0EC",
  textMuted: "#9A968F",
  border: "#2E2E2E",
  primary: "#F2F0EC",    // the button turns light in dark mode
  onPrimary: "#161616",
  danger: "#F87171",
};