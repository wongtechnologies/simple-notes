# Simple Notes — Product Specification (v1)

## 1. Product Overview
**Problem:** Users need a fast, reliable way to jot down quick notes on their mobile devices without relying on an internet connection. 
**Solution:** A lightweight, offline-first mobile application designed for speed and simplicity. 
**Target User:** A single individual storing personal notes directly on their local device. No accounts, no onboarding, no sharing.

## 2. Scope
### In Scope (v1)
*   **Create Note:** Quick entry for a new note with a title and body.
*   **Edit Note:** Modify existing notes with auto-save or explicit save.
*   **Delete Note:** Remove notes permanently from local storage.
*   **Search Notes:** Filter notes by title or body text from the main list.
*   **Pin Notes:** Mark specific notes to remain at the top of the list.
*   **Theme Toggle:** Support for System, Light, and Dark modes.
*   **Offline Storage:** 100% local data persistence using `AsyncStorage`.

### Out of Scope (v1)
*   User accounts and authentication.
*   Cloud synchronization or backups.
*   Rich media (images, voice notes, attachments).
*   Categorization (folders, tags).
*   Reminders and push notifications.

## 3. Design & UI/UX Guidelines
The application will utilize a clean, warm, and minimalistic aesthetic centered around a **Peach/Orange and White** color palette.

*   **Primary Accent (Peach-Orange):** Used for interactive elements like the Floating Action Button (FAB), save buttons, active icons, and pinned note indicators. *(Suggested Hex: `#FFB885` or `#FFA07A`)*
*   **Background (White):** Used for the primary app background and note cards in Light Mode. *(Suggested Hex: `#FFFFFF`)*
*   **Typography:** Dark gray/soft black for primary text to ensure high contrast and readability on white backgrounds.
*   **Dark Mode Adaptation:** Dark charcoal background with slightly muted peach-orange accents to reduce eye strain in low light.

## 4. Screen Breakdown
### 1. Notes List (Home Screen)
*   **Header:** App title ("Simple Notes") and a Settings gear icon.
*   **Search Bar:** Sticky at the top, allows real-time text filtering of the notes list.
*   **Note Feed:** 
    *   Displays notes as clickable cards showing the Title, a preview of the Body, and the `updatedAt` date.
    *   **Pinned Notes** appear at the very top with a distinct peach-colored pin icon or subtle border.
    *   Chronological sorting (newest first) for unpinned notes.
*   **Action:** A prominent, peach-colored Floating Action Button (FAB) in the bottom right corner to create a new note.

### 2. Note Editor
*   **Header:** Back arrow, "Pin" toggle icon, and a "Delete" (trash can) icon.
*   **Title Input:** Large, bold text field.
*   **Body Input:** Multiline, full-screen text area for the main content.
*   **Behavior:** Auto-saves to `AsyncStorage` when the user types or navigates back to the Notes List.

### 3. Settings
*   **Header:** Back arrow and "Settings" title.
*   **Theme Selection:** Radio buttons or a segmented control to select the theme:
    *   `System Default`
    *   `Light Mode` (White/Peach)
    *   `Dark Mode` (Dark/Muted Peach)
*   **About/Data:** A brief label indicating all data is stored locally on the device.

## 5. Technical Architecture & Data Model
**Storage Mechanism:** React Native `AsyncStorage` (or equivalent local key-value store). No external APIs or backend services.

### Data Models

**Note Schema**
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (e.g., UUID v4). |
| `title` | `string` | The header/title of the note. |
| `body` | `string` | The main content of the note. |
| `pinned` | `boolean` | `true` if the user has pinned the note. |
| `createdAt` | `timestamp` | Unix timestamp of initial creation. |
| `updatedAt` | `timestamp` | Unix timestamp of the last modification. |

**Settings Schema**
| Field | Type | Description |
| :--- | :--- | :--- |
| `theme` | `string` | Current app theme. Enum: `"system" | "light" | "dark"` |