import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isNew ? "New note" : "Edit note" }} />
      <Text style={styles.text}>
        {isNew ? "Creating a new note" : `Editing note ${id}`}
      </Text>
      <Text style={styles.hint}>The real editor arrives on Day 3.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  text: { fontSize: 18 },
  hint: { marginTop: 8, color: "#888" },
});