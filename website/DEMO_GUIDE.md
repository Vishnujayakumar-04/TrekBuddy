# TrekBuddy - Official Demo Guide (RC-1)

**Status:** Release Candidate
**Date:** 2026-02-08

---

## 🟢 The "Safe Path" (Recommended Demo Flow)

Follow this script exactly to ensure a smooth, error-free presentation.

### 1. The Welcome (Homepage)
*   **Action:** Load `http://localhost:3000/`.
*   **Observe:**
    *   Transparent Navbar with White Text (Hero Mode).
    *   Scroll down to see the Navbar transform to solid/blurred (Scrolled Mode).
    *   Show "Popular Destinations" cards.

### 2. Authentication (Sign Up/Login)
*   **Action:** Click "Sign Up" or "Log In" from the Navbar.
*   **Context:** Use a fresh email or a known test account (`demo@trekbuddy.com` / `password123`).
*   **Observe:** Redirect to Dashboard upon success.

### 3. Dashboard Landing
*   **Action:** Land on `/dashboard/planner`.
*   **Observe:**
    *   "My Itineraries" header.
    *   Empty state (if new user) or list of Trips.
    *   **Navbar:** Now solid background for visibility.

### 4. Trip Planning (Core Feature)
*   **Action:** Click **"Create New Trip"**.
*   **Input:** "Puducherry Weekend 2026".
*   **Action:** Click "Create Trip".
*   **Observe:**
    *   Toast notification: "Trip created successfully!".
    *   New card appears in the grid with an Unsplash image.
    *   Click "View Itinerary" to enter the trip details.

### 5. AI Travel Guide (The "Wow" Factor)
*   **Action:** Click the **Floating Chat Button** (bottom-right).
*   **Input:** "What are the best beaches in Puducherry?"
*   **Observe:**
    *   Typing indicator.
    *   Real-time response mentioning Promenade, Paradise, etc. (Verified RAG content).
    *   **Follow-up:** "Tell me about French food here."
    *   **Observe:** Context-aware response.

### 6. Local Transit (Utility)
*   **Action:** Navigate to **"Explore"** -> **"Transit Hub"** (or `/dashboard/transit`).
*   **Action:** Click on **"Bus Services"**.
*   **Observe:**
    *   Tabs for "Town Bus (Local)" vs "Inter-city".
    *   List of available routes (Seeded data).

---

## 🚫 Danger Zones (Do Not Demo)

1.  **Complex Error Scenarios:**
    *   Do not disconnect the internet while the AI is typing (Graceful handling exists, but it breaks the flow).
2.  **Profile Settings:**
    *   The `/dashboard/profile` page is functional but less polished than the Planner. Stick to the core value props.
3.  **Edge Case Transit Routes:**
    *   Some transit categories (e.g., specific Train schedules) might be empty if not seeded. Stick to **Bus** or **Rentals**.

---

## ✅ Pre-Demo Checklist

*   [ ] Local server running (`npm run dev`).
*   [ ] Firestore rules deployed (or emulator running).
*   [ ] Transit data seeded (Visit `/dashboard/transit` once to auto-seed).
*   [ ] Browser console clear of errors.
