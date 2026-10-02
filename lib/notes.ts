import AsyncStorage from "@react-native-async-storage/async-storage";

export type Note = {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "notes";

export async function loadNotes(): Promise<Note[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

async function saveNotes(notes: Note[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export async function getNote(id: string): Promise<Note | undefined> {
  const notes = await loadNotes();
  return notes.find((note) => note.id === id);
}

export async function saveNote(id: string, title: string, body: string): Promise<void> {
  const notes = await loadNotes();
  const now = Date.now();
  const existing = notes.find((note) => note.id === id);

  if (existing) {
    existing.title = title;
    existing.body = body;
    existing.updatedAt = now;
  } else {
    notes.push({ id, title, body, pinned: false, createdAt: now, updatedAt: now });
  }

  await saveNotes(notes);
}

export async function deleteNote(id: string): Promise<void> {
  const notes = await loadNotes();
  await saveNotes(notes.filter((note) => note.id !== id));
}

export function newNoteId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
export async function togglePin(id: string): Promise<void> {
  const notes = await loadNotes();
  const note = notes.find((n) => n.id === id);
  if (!note) return;
  note.pinned = !note.pinned;
  await saveNotes(notes);
}

export function filterAndSortNotes(notes: Note[], query: string): Note[] {
  const q = query.trim().toLowerCase();

  const matches =
    q === ""
      ? notes
      : notes.filter(
          (note) =>
            note.title.toLowerCase().includes(q) ||
            note.body.toLowerCase().includes(q)
        );

  return [...matches].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });
}