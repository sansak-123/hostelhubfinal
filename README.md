# 🏛️ HostelHub — React Native (Expo) Scaffold

Hackathon-ready mobile app for a college hostel system.  
Built with clean architecture so **Supabase can be wired in with minimal changes**.

---

## 📁 Project Structure

```
HostelApp/
├── App.js                          # Root entry — add providers here
├── package.json
└── src/
    ├── theme.js                    # Design tokens (colors, spacing, radii)
    ├── data/
    │   └── mockRooms.js            # Mock data + filter constants
    ├── services/
    │   └── api.js                  # ⭐ DATA LAYER — replace with Supabase here
    ├── components/
    │   ├── RoomCard.js             # Room display card
    │   ├── FilterChip.js           # Pill-style filter toggle
    │   └── RatingInput.js          # Tap-to-rate star widget
    ├── navigation/
    │   └── AppNavigator.js         # React Navigation stack
    └── screens/
        ├── HomeScreen.js           # 4-option home menu
        └── RoomFinder/
            ├── SearchScreen.js     # Filterable room list (FlatList)
            └── UploadScreen.js     # Add room review form
```

---

## 🚀 Quick Start

```bash
npx create-expo-app HostelHub --template blank
# Copy all files from this scaffold into the project root
npm install @react-navigation/native @react-navigation/native-stack \
            react-native-screens react-native-safe-area-context
npx expo start
```

---

## 🔌 Connecting Supabase (Step-by-Step)

### 1. Install

```bash
npm install @supabase/supabase-js
```

### 2. Create `src/services/supabaseClient.js`

```js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### 3. Update `src/services/api.js`

Each function has a `// SUPABASE REPLACEMENT` block — swap the mock body  
with the Supabase query already written there.

### 4. Supabase Table Schema (suggested)

```sql
create table rooms (
  id uuid primary key default gen_random_uuid(),
  block text not null,
  block_type text not null,
  room_type text not null,
  beds integer not null,
  wifi_rating numeric(2,1),
  spaciousness_rating numeric(2,1),
  cupboard_rating numeric(2,1),
  overall_rating numeric(2,1),
  rank integer,
  additional_info text,
  photos text[],
  created_at timestamptz default now()
);
```

### 5. Photo Upload

In `UploadScreen.js`, find the comment:

```
// SUPABASE: Wire real upload to supabase.storage here
```

Use `supabase.storage.from('room-photos').upload(path, file)`.

### 6. Auth (optional)

Wrap `<AppNavigator />` in App.js with a `<SessionProvider>` that calls  
`supabase.auth.getSession()` on mount.

---

## 🗺️ Navigation Flow

```
Home
 └── Room Finder (Search) ←─────┐
      └── Upload Room ──────────┘ (navigates back on submit)
```

---

## ✅ Implemented

| Feature                        | Status         |
| ------------------------------ | -------------- |
| Home screen (4 tiles)          | ✅             |
| Room Finder — Search + Filters | ✅             |
| Room Finder — Upload form      | ✅             |
| Mock data + api.js abstraction | ✅             |
| Complaint                      | 🔲 Placeholder |
| Mess                           | 🔲 Placeholder |
| Chatbot                        | 🔲 Placeholder |
