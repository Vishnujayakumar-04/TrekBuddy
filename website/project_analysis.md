# TrekBuddy - Project Architecture & Status Analysis

## 1. Executive Summary
**Project Name:** TrekBuddy
**Core Purpose:** An intelligent, AI-powered tourism companion application for Puducherry (Pondicherry), India.
**Current State:** Production-ready MVP with robust authentication, data persistence, and AI integration.
**Tech Stack:** Next.js 16 (App Router), Firebase (Auth & Firestore), Google Gemini AI, Tailwind CSS v4, Framer Motion.

---

## 2. Technical Architecture

### 2.1. Frontend Information
*   **Framework:** Next.js 16.1.1 (App Router Architecture).
*   **Styling:** Tailwind CSS v4 (with `clsx`, `tailwind-merge` for robust class handling).
*   **UI Components:** Radix UI primitives (Dialog, Dropdown, etc.) accessible via `@/components/ui`.
*   **Animations:** `framer-motion` (v12) used extensively for page transitions, card hover effects, and loaders.
*   **Icons:** `lucide-react`.

### 2.2. Backend & Database
*   **Platform:** Firebase (Client SDK).
*   **Authentication:** Firebase Auth (Google Provider & Email/Password).
    *   **State Management:** `AuthContext.tsx` provides global user state.
    *   **Protection:** Client-side route protection via `AppLoader.tsx` and custom hooks (`useAuth`). Middleware (`middleware.ts`) is currently a placeholder.
*   **Database:** Cloud Firestore (NoSQL).
    *   **Connection:** `src/lib/firebase.ts`.
    *   **Security:** Strict Row-Level Security (RLS) defined in `firestore.rules`.

### 2.3. AI Integration
*   **Service:** Google Gemini Pro (`@google/generative-ai`).
*   **Implementation:** `src/utils/gemini.ts`.
*   **Pattern:** Context-aware Chat.
    *   **System Prompt:** Defines persona ("Official AI Guide for Puducherry") and strict knowledge boundaries.
    *   **RAG (Retrieval-Augmented Generation):** Uses local JSON data (`puducherry_knowledge.json`) and specific rules to answer questions about Culture, History, and Tourism accurately.
    *   **Caching:** AI responses are cached in Firestore (`ai_cache`) to optimize costs and latency.

---

## 3. Key Modules & Features

### 3.1. Dashboard (`/src/app/dashboard`)
The core application area, protected by authentication.

*   **Trip Planner (`/planner`)**
    *   **Functionality:** Create, view, delete, and manage extensive travel itineraries.
    *   **Data Model:** `trips` collection.
    *   **Security:** Users can only read/write their own trips (`resource.data.userId == request.auth.uid`).
    *   **Recent Fixes:** Corrected `userId` payload association and implemented robust error handling for permissions.

*   **Local Transit (`/transit`)**
    *   **Functionality:** View schedules/details for Buses, Cabs, Bike Rentals, and Trains.
    *   **Sub-modules:**
        *   `Bus`: Local & Inter-state routes.
        *   `Cabs`: Taxi services & operators.
        *   `Rentals`: Bike/Scooter analytics.
        *   `Train`: Station info & Express routes.
    *   **Data Source:** Firestore `transit` collection. Seeding utility (`seedTransitData.ts`) allows admins/devs to populate initial data.

*   **AI Guide (`/chat`)**
    *   **Functionality:** Interactive chat widget (`AIChatWidget.tsx`) accessible globally or via dedicated page.
    *   **Features:**
        *   Streaming-like typing indicators.
        *   Context-aware history (last 6 messages).
        *   Local Knowledge integration (dynamic language stats, climate data).
        *   Fallback mechanisms for API failures.

*   **Explore (`/categories`, `/places`)**
    *   **Functionality:** Browse curated lists of tourist destinations (Beaches, Heritage, Spiritual).
    *   **UI:** Grid layouts with rich imagery and "Save" functionality.

### 3.2. Layout & Global UI
*   **Navbar:** Dynamic intelligent header.
    *   **Hero Mode:** Transparent + White Text (Homepage).
    *   **App Mode:** Solid + Readable Text (Dashboard/Internal pages).
    *   **Scroll Aware:** Blurs background on scroll.
*   **Footer:** Interactive Newsletter subscription (Client Component) and accessible social links.
*   **AppLoader:** Handles initial Auth check and shows a splash screen preventing content flash.

---

## 4. Data Model (Firestore Schema)

| Collection | Role | Security Level |
| :--- | :--- | :--- |
| **`users`** | User Profiles | **Private:** Owner Only (`auth.uid == userId`) |
| **`trips`** | User Itineraries | **Private:** Owner Only |
| **`transit`** | Public Transport Data | **Public Read:** Everyone |
| **`places`** | Tourist Spots | **Public Read:** Everyone |
| **`knowledge`** | Static App Content | **Public Read:** Everyone |
| **`ai_cache`** | Cached AI Responses | **Public Read**, Auth Create |
| **`chats`** | User Chat Histories | **Private:** Owner Only |

---

## 5. Security Posture

### 5.1. Authentication
*   **Method:** Client-side enforcement.
*   **Gaps:** No server-side session cookies (Middleware is pass-through).
*   **Mitigation:** Critical write operations (Trip Creation) explicitly check `user.uid` before execution, and Firestore Rules reject unauthorized writes at the database layer.

### 5.2. Database Rules (`firestore.rules`)
*   **Default:** Deny all.
*   **User Data:** Strictly scoped to `request.auth.uid`.
*   **Public Data:** Read-only for unauthenticated users (Transit, Places).
*   **Integrity:** Trip creation logic enforces that the document `userId` matches the token `uid`.

---

## 6. Recent Improvements (Change Log)

1.  **Trip Planner Security:** Fixed "Permission Denied" errors by aligning client-side payload (`userId`) with Firestore security rules.
2.  **Transit Data Seeding:** Enabled authenticated writes to `transit` collection to allow data population.
3.  **UI Visibility:** Fixed "Invisible Header" issue on internal pages by implementing route-aware styling in `Navbar.tsx`.
4.  **Runtime Stability:** Fixed "Event Handler in Server Component" error in `Footer.tsx` by adding `'use client'`.
5.  **AI Capabilities:** Enhanced `Gemini` integration with local knowledge injection for more accurate Puducherry-specific answers.

---

## 7. Configuration Files
*   **`next.config.ts`**: Standard Next.js config.
*   **`tailwind.config`**: v4 native (CSS-based config).
*   **`package.json`**: Defines scripts (`dev`, `build`, `lint`) and dependencies.

## 8. Conclusion
TrekBuddy is a well-structured, modern web application. It effectively leverages the "App Router" for layout management and "Firebase" for a serverless backend. The separation of concerns (UI Components vs. Data Services vs. Utility Logic) is clean, making the codebase maintainable and scalable.
