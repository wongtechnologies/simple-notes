import { filterAndSortNotes, loadNotes, togglePin, type Note } from "@/lib/notes";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotesListScreen() {
  const insets = useSafeAreaInsets();
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadNotes().then(setNotes);
    }, [])
  );

  const visibleNotes = filterAndSortNotes(notes, query);

  async function handleTogglePin(id: string) {
    await togglePin(id);
    setNotes(await loadNotes());
  }

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

      <TextInput
        style={styles.search}
        placeholder="Search notes"
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        returnKeyType="search"
      />

      <FlatList
        data={visibleNotes}
        keyExtractor={(note) => note.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Link href={{ pathname: "/note/[id]", params: { id: item.id } }} asChild>
            <Pressable style={styles.noteRow}>
              <View style={styles.noteText}>
                <Text style={styles.noteTitle} numberOfLines={1}>
                  {item.title || "Untitled"}
                </Text>
                <Text style={styles.notePreview} numberOfLines={1}>
                  {item.body}
                </Text>
              </View>

              <Pressable
                onPress={() => handleTogglePin(item.id)}
                hitSlop={12}
                accessibilityLabel={item.pinned ? "Unpin note" : "Pin note"}
              >
                <Ionicons
                  name={item.pinned ? "pin" : "pin-outline"}
                  size={20}
                  color={item.pinned ? "#2563eb" : "#999"}
                />
              </Pressable>
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
  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  noteText: { flex: 1, marginRight: 12 },
  noteTitle: { fontSize: 17, fontWeight: "500" },
  notePreview: { fontSize: 14, color: "#888", marginTop: 2 },
  newButton: { backgroundColor: "#2563eb", padding: 14, borderRadius: 10, alignItems: "center" },
  newButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});