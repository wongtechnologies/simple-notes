import { deleteNote, getNote, newNoteId, saveNote } from "@/lib/notes";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";
  const insets = useSafeAreaInsets();

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
          title: isNew ? "New note" : "Edit note",
          headerRight: () => (
            <Pressable onPress={confirmDelete}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          ),
        }}
      />
      <TextInput
        style={styles.title}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        editable={loaded}
      />
      <TextInput
        style={styles.body}
        placeholder="Start writing..."
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "600", paddingVertical: 8 },
  body: { flex: 1, fontSize: 17, lineHeight: 24 },
  deleteText: { fontSize: 16, color: "#dc2626" },
});