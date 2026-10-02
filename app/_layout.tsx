import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}

function RootStack() {
  const { colors, scheme } = useTheme();

  return (
    <>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="note/[id]" options={{ title: "" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>
    </>
  );
}