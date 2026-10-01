import { StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Theme</Text>
      <Text style={styles.hint}>Follows your phone for now. Options come on Day 5.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 18, fontWeight: "600" },
  hint: { marginTop: 8, color: "#888" },
});