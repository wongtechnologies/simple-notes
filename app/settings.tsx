import { useTheme } from "@/context/ThemeContext";
import type { ThemePreference } from "@/lib/settings";
import { Pressable, StyleSheet, Text, View } from "react-native";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export default function SettingsScreen() {
  const { colors, preference, setPreference } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>Appearance</Text>

      <View style={[styles.segment, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {OPTIONS.map((option) => {
          const selected = option.value === preference;
          return (
            <Pressable
              key={option.value}
              onPress={() => setPreference(option.value)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[styles.segmentItem, selected && { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.segmentText, { color: selected ? colors.onPrimary : colors.text }]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.hint, { color: colors.textMuted }]}>
        System follows your phone's light or dark setting.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 10 },
  segment: { flexDirection: "row", borderWidth: 1, borderRadius: 999, padding: 4 },
  segmentItem: { flex: 1, paddingVertical: 10, borderRadius: 999, alignItems: "center" },
  segmentText: { fontSize: 15, fontWeight: "500" },
  hint: { fontSize: 14, marginTop: 10 },
});