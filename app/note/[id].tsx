import { useTheme } from "@/context/ThemeContext"; // NEW
import { deleteNote, getNote, newNoteId, saveNote } from "@/lib/notes";
import { Ionicons } from "@expo/vector-icons"; // NEW
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";
  const insets = useSafeAreaInsets();
  const { colors } = useTheme(); // NEW

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loaded, setLoaded] = useState(isNew);

  const noteIdRef = useRef<string | null>(isNew ? null : id);
  const lastSavedRef = useRef({ title: "", body: "" });

  // 1. When editing an existing note, load it from storage once.
  useEffect(() => {
    if (isNew) return;
    getNote(id).then((note) => {
      if (note) {
        setTitle(note.title);
        setBody(note.body);
        lastSavedRef.current = { title: note.title, body: note.body };
      }
      setLoaded(true);
    });
  }, [id, isNew]);

  // 2. Autosave: 500 ms after the user stops typing.
  useEffect(() => {
    if (!loaded) return;
    const unchanged =
      title === lastSavedRef.current.title && body === lastSavedRef.current.body;
    if (unchanged) return;

    const timer = setTimeout(async () => {
      if (noteIdRef.current === null) {
        noteIdRef.current = newNoteId();
      }
      await saveNote(noteIdRef.current, title, body);
      lastSavedRef.current = { title, body };
    }, 500);

    return () => clearTimeout(timer);
  }, [title, body, loaded]);

  function confirmDelete() {
    Alert.alert("Delete note?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (noteIdRef.current !== null) {
            await deleteNote(noteIdRef.current);
          }
          router.back();
        },
      },
    ]);
  }

  return (
    <View style={[styles.container, { paddingBottom: 16 + insets.bottom }]}>
      <Stack.Screen
        options={{
          title: "",
          headerRight: () => (
            // NEW: trash icon instead of the word "Delete"
            <Pressable onPress={confirmDelete} hitSlop={12} accessibilityLabel="Delete note">
              <Ionicons name="trash-outline" size={22} color={colors.danger} />
            </Pressable>
          ),
        }}
      />
      <TextInput
        style={[styles.title, { color: colors.text }]} // NEW: themed colour
        placeholder="Title"
        placeholderTextColor={colors.textMuted} // NEW
        value={title}
        onChangeText={setTitle}
        editable={loaded}
      />
      <TextInput
        style={[styles.body, { color: colors.text }]} // NEW
        placeholder="Start writing..."
        placeholderTextColor={colors.textMuted} // NEW
        value={body}
        onChangeText={setBody}
        editable={loaded}
        multiline
        textAlignVertical="top"
        autoFocus={isNew}
      />
    </View>
  );
}

// NEW: bigger, cleaner title like your reference designs
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  title: { fontSize: 30, fontWeight: "700", letterSpacing: -0.5, paddingVertical: 8 },
  body: { flex: 1, fontSize: 17, lineHeight: 26 },
});