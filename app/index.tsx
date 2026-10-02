import { loadNotes, type Note } from "@/lib/notes";
import { Link, Stack, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotesListScreen() {
  const insets = useSafeAreaInsets();
  const [notes, setNotes] = useState<Note[]>([]);

  // Reload notes every time this screen comes into view (e.g. after going back from the editor).
  useFocusEffect(
    useCallback(() => {
      loadNotes().then(setNotes);
    }, [])
  );

  // Newest edits first.
  const sortedNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <View style={[styles.container, { paddingBottom: 16 + insets.bottom }]}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href="/settings" style={styles.headerLink}>
              Settings
            </Link>
          ),
        }}
      />

      <FlatList
        data={sortedNotes}
        keyExtractor={(note) => note.id}
        renderItem={({ item }) => (
          <Link href={{ pathname: "/note/[id]", params: { id: item.id } }} asChild>
            <Pressable style={styles.noteRow}>
              <Text style={styles.noteTitle} numberOfLines={1}>
                {item.title || "Untitled"}
              </Text>
              <Text style={styles.notePreview} numberOfLines={1}>
                {item.body}
              </Text>
            </Pressable>
          </Link>
        )}
      />

      <Link href={{ pathname: "/note/[id]", params: { id: "new" } }} asChild>
        <Pressable style={styles.newButton}>
          <Text style={styles.newButtonText}>+ New note</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerLink: { fontSize: 16, color: "#2563eb" },
  noteRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  noteTitle: { fontSize: 17, fontWeight: "500" },
  notePreview: { fontSize: 14, color: "#888", marginTop: 2 },
  newButton: { backgroundColor: "#2563eb", padding: 14, borderRadius: 10, alignItems: "center" },
  newButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});