import { useTheme } from "@/context/ThemeContext";
import { filterAndSortNotes, loadNotes, togglePin, type Note } from "@/lib/notes";
import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export default function NotesListScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
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
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top + 12 },
      ]}
    >
      {/* Big title + settings button */}
      <View style={styles.header}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Notes</Text>
        <Link href="/settings" asChild>
          <Pressable
            hitSlop={8}
            accessibilityLabel="Settings"
            // FIX: flatten the style array into one object (Link asChild can't merge arrays)
            style={StyleSheet.flatten([styles.iconButton, { backgroundColor: colors.card }])}
          >
            <Ionicons name="settings-outline" size={20} color={colors.text} />
          </Pressable>
        </Link>
      </View>

      {/* Search pill with clear button */}
      <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search notes"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
        />
        {query !== "" && (
          <Pressable onPress={() => setQuery("")} hitSlop={12} accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Note cards */}
      <FlatList
        data={visibleNotes}
        keyExtractor={(note) => note.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        renderItem={({ item }) => (
          <Link href={{ pathname: "/note/[id]", params: { id: item.id } }} asChild>
            {/* FIX: flattened style */}
            <Pressable style={StyleSheet.flatten([styles.card, { backgroundColor: colors.card }])}>
              <View style={styles.cardTop}>
                <Text style={[styles.cardDate, { color: colors.textMuted }]}>
                  {formatDate(item.updatedAt)}
                </Text>
                <Pressable
                  onPress={() => handleTogglePin(item.id)}
                  hitSlop={12}
                  accessibilityLabel={item.pinned ? "Unpin note" : "Pin note"}
                >
                  <Ionicons
                    name={item.pinned ? "pin" : "pin-outline"}
                    size={18}
                    color={item.pinned ? colors.text : colors.textMuted}
                  />
                </Pressable>
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                {item.title || "Untitled"}
              </Text>
              {item.body !== "" && (
                <Text style={[styles.cardPreview, { color: colors.textMuted }]} numberOfLines={2}>
                  {item.body}
                </Text>
              )}
            </Pressable>
          </Link>
        )}
      />

      {/* Floating + button */}
      <Link href={{ pathname: "/note/[id]", params: { id: "new" } }} asChild>
        <Pressable
          accessibilityLabel="New note"
          // FIX: flattened style
          style={StyleSheet.flatten([
            styles.fab,
            { backgroundColor: colors.primary, bottom: 24 + insets.bottom },
          ])}
        >
          <Ionicons name="add" size={28} color={colors.onPrimary} />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  pageTitle: { fontSize: 40, fontWeight: "700", letterSpacing: -1 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 12 },
  card: { borderRadius: 20, padding: 16, marginBottom: 12 },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardDate: { fontSize: 13 },
  cardTitle: { fontSize: 18, fontWeight: "600" },
  cardPreview: { fontSize: 15, lineHeight: 21, marginTop: 4 },
  fab: {
    position: "absolute",
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});