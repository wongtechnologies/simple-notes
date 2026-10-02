import { Link, Stack } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // NEW

// Temporary fake data so we can test navigation. Replaced with real notes on Day 3.
const SAMPLE_NOTES = [
  { id: "1", title: "Shopping list" },
  { id: "2", title: "Ideas for App 2" },
];

export default function NotesListScreen() {
  const insets = useSafeAreaInsets(); // NEW: how much space the phone's system bars take

  return (
    // NEW: extra bottom padding so the button sits above Android's navigation bar
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
        data={SAMPLE_NOTES}
        keyExtractor={(note) => note.id}
        renderItem={({ item }) => (
          <Link href={{ pathname: "/note/[id]", params: { id: item.id } }} asChild>
            <Pressable style={styles.noteRow}>
              <Text style={styles.noteTitle}>{item.title}</Text>
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
  noteRow: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  noteTitle: { fontSize: 17 },
  newButton: { backgroundColor: "#2563eb", padding: 14, borderRadius: 10, alignItems: "center" },
  newButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});