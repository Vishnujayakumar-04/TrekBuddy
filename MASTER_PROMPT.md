# TrekBuddy - Complete Master Documentation

**A Comprehensive AI-Powered Tourism Guide Application for Pondicherry (Puducherry), India**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [UI/UX Design System](#uiux-design-system)
5. [Architecture](#architecture)
6. [Screens & Navigation](#screens--navigation)
7. [Components](#components)
8. [Features](#features)
9. [Firebase Integration](#firebase-integration)
10. [Setup & Installation](#setup--installation)
11. [Development Guide](#development-guide)
12. [Build & Deployment](#build--deployment)

---

## 🎯 Project Overview

**TrekBuddy** is a dual-platform tourism application (Mobile + Web) designed to help travelers explore Pondicherry, India. The application provides comprehensive information about places, trip planning, transportation, emergency services, and AI-powered recommendations.

### Key Highlights
- **Dual Platform**: React Native mobile app + React web application
- **AI-Powered**: Google Gemini API integration for intelligent recommendations
- **Real-time Data**: Firebase Firestore for data synchronization
- **Offline Support**: Local storage with AsyncStorage
- **Modern UI**: Smooth animations, gradient designs, and responsive layouts
- **Multi-language**: Language switching support (English/Tamil)
- **Theme Support**: Light/Dark theme toggle

---

## 🛠 Tech Stack

### Mobile Application (React Native + Expo)

#### Core Framework
- **React Native**: `0.81.5`
- **React**: `19.1.0`
- **Expo SDK**: `~54.0.30`
- **TypeScript**: `5.9.2`

#### Navigation
- **@react-navigation/native**: `^7.1.25`
- **@react-navigation/stack**: `^7.6.12`
- **@react-navigation/bottom-tabs**: `^7.8.12`

#### UI & Styling
- **React Native Reanimated**: `~4.1.1` - Advanced animations
- **React Native Gesture Handler**: `~2.28.0` - Touch gestures
- **React Native Safe Area Context**: `^5.6.2` - Safe area handling
- **React Native SVG**: `15.12.1` - SVG icons
- **Expo Linear Gradient**: `^15.0.8` - Gradient backgrounds
- **Lottie React Native**: `^7.3.4` - Lottie animations

#### Backend & Storage
- **Firebase**: `^12.7.0`
  - Authentication (Email/Password, Google, Anonymous)
  - Firestore (Database)
  - Storage (Profile photos)
- **@react-native-async-storage/async-storage**: `^2.2.0` - Local storage

#### Media & Picker
- **Expo Image Picker**: `~17.0.10` - Image selection
- **Expo Status Bar**: `~3.0.9` - Status bar control

#### Other
- **Expo Updates**: `~29.0.15` - OTA updates (disabled)
- **Expo Auth Session**: `~7.0.10` - OAuth
- **Expo Web Browser**: `~15.0.10` - In-app browser
- **React Native Worklets**: `0.5.1` - Worklet support

### Web Application (React + Vite)

#### Core Framework
- **React**: `^19.2.0`
- **React DOM**: `^19.2.0`
- **Vite**: `^7.2.4` - Build tool

#### Routing
- **React Router DOM**: `^7.11.0` - Client-side routing

#### Styling
- **TailwindCSS**: `^3.4.19` - Utility-first CSS
- **PostCSS**: `^8.5.6` - CSS processing
- **Autoprefixer**: `^10.4.23` - CSS vendor prefixes

#### 3D & Animations
- **Three.js**: `^0.182.0` - 3D graphics
- **@react-three/fiber**: `^9.4.2` - React renderer for Three.js
- **@react-three/drei**: `^10.7.7` - Useful helpers for react-three/fiber
- **Framer Motion**: `^12.23.26` - Animation library

#### Backend
- **Firebase**: `^12.7.0` - Same as mobile

#### Utilities
- **Axios**: `^1.13.2` - HTTP client

#### Development Tools
- **ESLint**: `^9.39.1` - Code linting
- **TypeScript Types**: `@types/react`, `@types/react-dom`

---

## 📁 Project Structure

```
TrekBuddy/
│
├── 📱 Mobile App (Root)
│   ├── App.tsx                    # Root component with providers
│   ├── index.ts                    # Entry point with error handlers
│   ├── app.json                    # Expo configuration
│   ├── babel.config.js             # Babel configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── package.json                # Mobile dependencies
│   │
│   ├── assets/                     # Static assets
│   │   ├── icon.png                # App icon
│   │   ├── adaptive-icon.png       # Android adaptive icon
│   │   ├── splash-icon.png         # Splash screen
│   │   ├── favicon.png             # Web favicon
│   │   ├── logo-bg.png             # Logo background
│   │   └── tb-logo.png             # TrekBuddy logo
│   │
│   └── src/                        # Source code
│       ├── assets/                 # App assets
│       │   └── lottie/             # Lottie animation files
│       │       ├── ai-loading.json
│       │       ├── bus.json
│       │       ├── emergency.json
│       │       ├── success.json
│       │       └── animations.ts   # Animation exports
│       │
│       ├── components/             # Reusable components
│       │   ├── AIRecommendationCard.tsx
│       │   ├── AnimatedTabIcon.tsx
│       │   ├── CategoryCard.tsx
│       │   ├── ErrorBoundary.tsx
│       │   ├── ExpandableDayCard.tsx
│       │   ├── LottieAnimation.tsx
│       │   ├── ScreenTransition.tsx
│       │   ├── SearchBar.tsx
│       │   │
│       │   ├── animations/         # Animation components
│       │   │   └── FadeInView.tsx
│       │   │
│       │   ├── icons/              # Icon components
│       │   │   ├── BaseIcon.tsx
│       │   │   ├── CommonIcons.tsx
│       │   │   ├── DashboardIcons.tsx
│       │   │   ├── EmergencyIcons.tsx
│       │   │   ├── LoginIcons.tsx
│       │   │   ├── NavigationIcons.tsx
│       │   │   ├── TransportIcons.tsx
│       │   │   ├── TripPlannerIcons.tsx
│       │   │   └── index.ts        # Icon exports
│       │   │
│       │   └── ui/                  # UI primitives
│       │       ├── Button.tsx
│       │       ├── Card.tsx
│       │       ├── GradientHeader.tsx
│       │       ├── IconButton.tsx
│       │       ├── SectionTitle.tsx
│       │       └── index.ts
│       │
│       ├── context/                 # React Context providers
│       │   ├── AuthContext.tsx     # Authentication state
│       │   ├── LanguageContext.tsx  # Language switching
│       │   └── ThemeContext.tsx     # Theme (light/dark)
│       │
│       ├── data/                    # Static JSON data
│       │   ├── accommodation.json
│       │   ├── adventure.json
│       │   ├── auto-fare.json
│       │   ├── beaches.json
│       │   ├── boating.json
│       │   ├── busRoutes.json
│       │   ├── cabServices.json
│       │   ├── categories.ts        # Category definitions
│       │   ├── cycling.json
│       │   ├── emergency.json
│       │   ├── famous-places.json
│       │   ├── fire.json
│       │   ├── hospitals.json
│       │   ├── hotels.json
│       │   ├── kayaking.json
│       │   ├── nature.json
│       │   ├── nightlife.json
│       │   ├── parks.json
│       │   ├── pharmacies.json
│       │   ├── photoshoot.json
│       │   ├── police.json
│       │   ├── pubs.json
│       │   ├── rentals.json
│       │   ├── restaurants.json
│       │   ├── shareAuto.json
│       │   ├── shopping.json
│       │   ├── surfing.json
│       │   ├── temples.json
│       │   ├── theatres.json
│       │   ├── transport.json
│       │   ├── trekking.json
│       │   │
│       │   └── religion/            # Religious places
│       │       ├── buddhist-temples.json
│       │       ├── christian-churches.json
│       │       ├── hindu-temples.json
│       │       ├── jain-temples.json
│       │       ├── muslim-mosques.json
│       │       └── religionDataFetcher.ts
│       │
│       ├── firebase/                # Firebase configuration
│       │   ├── auth.ts              # Auth utilities
│       │   ├── firebaseConfig.ts    # Firebase config
│       │   ├── firestore.ts         # Firestore utilities
│       │   ├── firestoreStructure.ts # Data structure
│       │   ├── index.ts             # Firebase exports
│       │   └── storage.ts          # Storage utilities
│       │
│       ├── hooks/                   # Custom React hooks
│       │   ├── useFadeInAnimation.ts
│       │   ├── usePressAnimation.ts
│       │   ├── usePulseAnimation.ts
│       │   └── useStaggeredCardAnimation.ts
│       │
│       ├── navigation/              # Navigation setup
│       │   ├── StackNavigator.tsx  # Stack navigation
│       │   └── TabNavigator.tsx     # Bottom tab navigation
│       │
│       ├── screens/                 # Screen components
│       │   ├── WelcomeScreen.tsx
│       │   ├── LoginScreen.tsx
│       │   ├── HomeScreen.tsx
│       │   ├── ProfileScreen.tsx
│       │   ├── CategoryScreen.tsx
│       │   ├── PlaceDetailsScreen.tsx
│       │   ├── TripPlannerScreen.tsx
│       │   ├── TripPlannerInput.tsx
│       │   ├── TripPlannerOutput.tsx
│       │   ├── TransportScreen.tsx
│       │   ├── EmergencyScreenTab.tsx
│       │   ├── ExploreScreen.tsx
│       │   ├── AIChatbotScreen.tsx
│       │   ├── AIDetailScreen.tsx
│       │   ├── SettingsScreen.tsx
│       │   ├── HistoryScreen.tsx
│       │   │
│       │   ├── Category Screens:
│       │   ├── BeachesScreen.tsx
│       │   ├── ParksScreen.tsx
│       │   ├── NatureScreen.tsx
│       │   ├── NightlifeScreen.tsx
│       │   ├── AdventureScreen.tsx
│       │   ├── TheatresScreen.tsx
│       │   ├── PhotoshootScreen.tsx
│       │   ├── ShoppingScreen.tsx
│       │   ├── PubsScreen.tsx
│       │   ├── AccommodationScreen.tsx
│       │   ├── RestaurantsScreen.tsx
│       │   └── ReligiousPlacesScreen.tsx
│       │
│       ├── theme/                   # Design system
│       │   ├── colors.ts            # Color palette
│       │   ├── spacing.ts           # Spacing & radius
│       │   ├── typography.ts        # Font styles
│       │   ├── shadows.ts           # Shadow styles
│       │   └── icons.ts             # Icon mappings
│       │
│       └── utils/                   # Utility functions
│           ├── api.ts               # API calls
│           ├── auth.ts              # Auth helpers
│           ├── config.ts            # App configuration
│           ├── firestore.ts         # Firestore helpers
│           ├── gemini.ts            # Gemini AI integration
│           ├── geminiChat.ts        # Chat functionality
│           ├── storage.ts           # Local storage
│           ├── storageService.ts    # Storage service
│           └── tripPlanner.ts      # Trip planning logic
│
├── 🌐 Web Application (/web)
│   ├── package.json                 # Web dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # TailwindCSS config
│   ├── postcss.config.js            # PostCSS config
│   ├── eslint.config.js             # ESLint config
│   ├── index.html                   # HTML entry
│   │
│   ├── public/                      # Public assets
│   │   └── vite.svg
│   │
│   ├── dist/                        # Build output
│   │
│   └── src/                         # Web source code
│       ├── main.jsx                 # Entry point
│       ├── App.jsx                  # Root component
│       ├── App.css                  # Global styles
│       ├── index.css                # Tailwind imports
│       │
│       ├── components/              # Web components
│       │   ├── Navbar.jsx           # Navigation bar
│       │   ├── Footer.jsx           # Footer
│       │   ├── Card.jsx             # Place card
│       │   ├── HeroSection.jsx      # Hero section
│       │   ├── PageTransition.jsx  # Page animations
│       │   ├── ResponsiveLayout.jsx # Layout wrapper
│       │   ├── ThreeScene.jsx       # 3D scene
│       │   └── ModelViewer.jsx      # 3D model viewer
│       │
│       ├── pages/                   # Page components
│       │   ├── Home.jsx
│       │   ├── Beaches.jsx
│       │   ├── Parks.jsx
│       │   ├── Temples.jsx
│       │   ├── Nature.jsx
│       │   ├── Photoshoot.jsx
│       │   ├── Pubs.jsx
│       │   ├── Restaurants.jsx
│       │   ├── Transport.jsx
│       │   ├── Emergency.jsx
│       │   ├── AIChat.jsx
│       │   ├── CategoryPage.jsx
│       │   └── PlaceDetails.jsx
│       │
│       ├── context/                 # React Context
│       │   └── AuthContext.jsx     # Auth state
│       │
│       ├── data/                    # Static data (same as mobile)
│       │   └── [same structure as mobile/src/data]
│       │
│       ├── firebase.js              # Firebase config
│       │
│       ├── utils/                   # Utilities
│       │   └── dataLoader.js       # Data loading
│       │
│       └── models/                  # 3D models (future)
│
├── 📄 Documentation
│   ├── README.md                    # Main readme
│   ├── MASTER_PROMPT.md             # This file
│   ├── FIRESTORE_STRUCTURE.md       # Database structure
│   └── IMPLEMENTATION_SUMMARY.md    # Implementation notes
│
└── 📦 Configuration Files
    ├── .gitignore                   # Git ignore rules
    └── Datass/                      # Data sources
```

---

## 🎨 UI/UX Design System

### Color Palette

#### Primary Colors
```typescript
teal: '#0E7C86'        // Primary brand color
yellow: '#F4C430'      // Secondary/accent
red: '#E84A4A'        // Emergency/error
blue: '#2176FF'        // Info/links
```

#### Gradients
```typescript
gradientTeal: ['#0E7C86', '#4ECDC4']      // Teal → Light teal
gradientOrange: ['#FF6B6B', '#F4C430']    // Orange → Yellow
gradientRed: ['#E84A4A', '#FF8A8A']       // Red → Light red
gradientBlue: ['#2176FF', '#6BA3FF']      // Blue → Light blue
```

#### Light Theme
```typescript
background: '#FFFFFF'
cardBackground: '#FFFFFF'
textPrimary: '#1A202C'
textSecondary: '#666666'
textLight: '#FFFFFF'
border: '#E2E8F0'
```

#### Dark Theme
```typescript
background: '#121212'
cardBackground: '#1E1E1E'
textPrimary: '#FFFFFF'
textSecondary: '#B0B0B0'
textLight: '#FFFFFF'
border: '#333333'
```

#### Status Colors
```typescript
success: '#48BB78'
warning: '#ED8936'
error: '#E84A4A'
info: '#2176FF'
```

### Typography

```typescript
// Headings
h1: { fontSize: 28, fontWeight: '700', lineHeight: 36 }
h2: { fontSize: 24, fontWeight: '700', lineHeight: 32 }
h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 }
h4: { fontSize: 18, fontWeight: '600', lineHeight: 24 }

// Subtitles
subtitle: { fontSize: 16, fontWeight: '400', lineHeight: 24, color: '#777777' }

// Body Text
bodyLarge: { fontSize: 16, fontWeight: '400', lineHeight: 24 }
bodyMedium: { fontSize: 14, fontWeight: '400', lineHeight: 20 }
bodySmall: { fontSize: 12, fontWeight: '400', lineHeight: 16 }

// Card Text
cardLabel: { fontSize: 18, fontWeight: '700', lineHeight: 24 }
cardText: { fontSize: 14, fontWeight: '400', lineHeight: 20, color: '#666666' }

// Buttons
buttonText: { fontSize: 16, fontWeight: '700', lineHeight: 24, color: '#FFFFFF' }

// Labels
labelLarge: { fontSize: 14, fontWeight: '600', lineHeight: 20 }
labelMedium: { fontSize: 12, fontWeight: '600', lineHeight: 16 }
labelSmall: { fontSize: 10, fontWeight: '600', lineHeight: 14 }
```

### Spacing System

```typescript
spacing: {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,    // Standard card padding
  xl: 24,    // Standard card padding
  xxl: 32,
  xxxl: 48,
}

radius: {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,  // Circular
}
```

### Card Design
- **Border Radius**: 20-24px (xl)
- **Padding**: 20-24px (lg-xl)
- **Shadow**: Soft elevation shadows
- **Background**: White (light) / Dark gray (dark)

### Button Design
- **Border Radius**: 8-12px (md-lg)
- **Padding**: Vertical 12-16px, Horizontal 24-32px
- **Font**: Bold, 16px
- **Colors**: Gradient backgrounds (teal, yellow, red)

### Icon Sizes
- **Tab Icons**: 28px
- **Header Icons**: 24px
- **Card Icons**: 20px
- **Small Icons**: 16px

---

## 🏗 Architecture

### Mobile App Architecture

```
App.tsx (Root)
├── ErrorBoundary
├── ThemeProvider
├── LanguageProvider
└── AuthProvider
    └── AppContent
        └── NavigationContainer
            └── StackNavigator
                ├── WelcomeScreen (if !user)
                ├── LoginScreen (if !user)
                └── TabNavigator (if user)
                    ├── HomeScreen
                    ├── TripPlannerScreen
                    ├── TransportScreen
                    ├── EmergencyScreenTab
                    └── ProfileScreen
```

### Navigation Flow

**Unauthenticated Flow:**
```
WelcomeScreen → LoginScreen
```

**Authenticated Flow:**
```
TabNavigator (Bottom Tabs)
├── Home → CategoryScreen → PlaceDetailsScreen
├── Trip → TripPlannerInput → TripPlannerOutput
├── Transport → (Various transport options)
├── SOS → EmergencyScreenTab
└── Profile → SettingsScreen / HistoryScreen
```

### State Management

- **React Context**: Auth, Theme, Language
- **Local State**: useState, useReducer
- **AsyncStorage**: Offline data persistence
- **Firebase Firestore**: Cloud data synchronization

### Data Flow

1. **Static Data**: JSON files in `/src/data`
2. **Local Storage**: AsyncStorage for favorites, trips, history
3. **Cloud Storage**: Firebase Firestore for user profiles, synced data
4. **API Calls**: Gemini AI for recommendations

---

## 📱 Screens & Navigation

### Authentication Screens

#### WelcomeScreen
- **Purpose**: First screen users see
- **Features**:
  - Animated logo (fade + scale)
  - App name and tagline
  - "Explore TrekBuddy" button
  - Smooth entrance animations
- **Navigation**: → LoginScreen

#### LoginScreen
- **Purpose**: User authentication
- **Features**:
  - Email/Password login
  - Sign up form
  - Guest login
  - Phone OTP login
  - Profile photo upload
  - Side menu (Theme, Language, History, Logout)
- **Navigation**: → HomeScreen (after login)

### Main Screens (Tab Navigator)

#### HomeScreen
- **Purpose**: Main landing page
- **Features**:
  - Category grid (12 categories)
  - Famous places section
  - Search functionality
  - Staggered card animations
- **Categories**:
  1. Beaches
  2. Parks
  3. Temples
  4. Nature
  5. Nightlife
  6. Adventure
  7. Theatres
  8. Photoshoot
  9. Shopping
  10. Pubs
  11. Accommodation
  12. Restaurants

#### TripPlannerScreen
- **Purpose**: Trip planning hub
- **Features**:
  - Quick trip generation
  - Saved trips list
  - Trip history
- **Navigation**: → TripPlannerInput → TripPlannerOutput

#### TransportScreen
- **Purpose**: Transportation information
- **Features**:
  - Auto fare calculator
  - Bus routes
  - Share auto routes
  - Cab services
  - Bus route details

#### EmergencyScreenTab
- **Purpose**: Emergency services
- **Features**:
  - Hospitals
  - Police stations
  - Fire services
  - Pharmacies
  - Quick call buttons

#### ProfileScreen
- **Purpose**: User profile management
- **Features**:
  - Profile photo display/edit
  - User information
  - Settings access
  - History access
- **Navigation**: → SettingsScreen, HistoryScreen

### Category Screens

All category screens follow the same pattern:
- **BeachesScreen**
- **ParksScreen**
- **NatureScreen**
- **NightlifeScreen**
- **AdventureScreen**
- **TheatresScreen**
- **PhotoshootScreen**
- **ShoppingScreen**
- **PubsScreen**
- **AccommodationScreen**
- **RestaurantsScreen**
- **ReligiousPlacesScreen** (with subcategories)

**Common Features:**
- Place list with images
- Search and filter
- Staggered animations
- Place details navigation

### Detail Screens

#### PlaceDetailsScreen
- **Purpose**: Detailed place information
- **Features**:
  - High-quality images
  - Description
  - Location
  - Rating
  - Opening hours
  - Contact information
  - Map integration
  - Share functionality
  - Favorite toggle

#### CategoryScreen
- **Purpose**: Generic category listing
- **Features**:
  - Dynamic category loading
  - Place cards
  - Search functionality

### Trip Planning Screens

#### TripPlannerInput
- **Purpose**: Trip input form
- **Features**:
  - Number of days selector
  - Preferences selection
  - Budget input
  - Travel mode selection

#### TripPlannerOutput
- **Purpose**: Generated itinerary display
- **Features**:
  - Day-by-day breakdown
  - Expandable day cards
  - Place recommendations
  - Save trip functionality

### AI Screens

#### AIChatbotScreen
- **Purpose**: AI travel assistant
- **Features**:
  - Chat interface
  - Gemini AI integration
  - Travel recommendations
  - Real-time responses

#### AIDetailScreen
- **Purpose**: Detailed AI recommendations
- **Features**:
  - Best time to visit
  - Nearby attractions
  - Safety tips
  - Personalized suggestions

### Utility Screens

#### ExploreScreen
- **Purpose**: Explore all places
- **Features**:
  - All places list
  - Category filtering
  - Search

#### SettingsScreen
- **Purpose**: App settings
- **Features**:
  - Theme toggle
  - Language selection
  - Account settings

#### HistoryScreen
- **Purpose**: User activity history
- **Features**:
  - Visited places
  - Saved trips
  - Favorites

---

## 🧩 Components

### UI Components

#### CategoryCard
- **Purpose**: Display category in grid
- **Props**: `category`, `onPress`, `index`
- **Features**: Staggered animations, gradient backgrounds

#### AnimatedTabIcon
- **Purpose**: Animated tab bar icons
- **Props**: `Icon`, `focused`, `iconSize`
- **Features**: Scale animation on focus

#### SearchBar
- **Purpose**: Search input
- **Features**: Real-time search, clear button

#### AIRecommendationCard
- **Purpose**: Display AI recommendations
- **Features**: Icon, title, description

#### ExpandableDayCard
- **Purpose**: Trip day breakdown
- **Features**: Expand/collapse, place list

#### LottieAnimation
- **Purpose**: Lottie animation wrapper
- **Features**: Loading, success, error animations

#### ScreenTransition
- **Purpose**: Screen entrance animations
- **Features**: Fade + slide animations

### Icon Components

All icons are SVG-based and follow a consistent design:
- **BaseIcon**: Base SVG wrapper
- **CommonIcons**: Home, Profile, Settings, etc.
- **NavigationIcons**: Arrow, Back, Forward
- **DashboardIcons**: Category icons
- **EmergencyIcons**: SOS, Hospital, Police
- **TransportIcons**: Bus, Auto, Cab
- **TripPlannerIcons**: Calendar, Map, Route

### UI Primitives

#### Button
- **Variants**: Primary, Secondary, Outline
- **Sizes**: Small, Medium, Large
- **Features**: Gradient backgrounds, press animations

#### Card
- **Variants**: Default, Elevated, Outlined
- **Features**: Rounded corners, shadows

#### GradientHeader
- **Purpose**: Screen headers with gradients
- **Features**: Back button, title, actions

#### IconButton
- **Purpose**: Icon-only buttons
- **Features**: Circular, square variants

---

## ✨ Features

### Core Features

1. **Place Discovery**
   - 12+ categories
   - 100+ places
   - Detailed place information
   - Images and descriptions
   - Ratings and reviews

2. **Trip Planning**
   - AI-powered itinerary generation
   - Day-by-day breakdown
   - Customizable preferences
   - Save and share trips

3. **Transportation**
   - Auto fare calculator
   - Bus route information
   - Share auto routes
   - Cab service details

4. **Emergency Services**
   - Hospital directory
   - Police stations
   - Fire services
   - Pharmacies
   - Quick call buttons

5. **AI Assistant**
   - Chat interface
   - Travel recommendations
   - Best time to visit
   - Safety tips
   - Nearby attractions

6. **User Features**
   - Authentication (Email, Google, Guest)
   - Profile management
   - Photo upload
   - Favorites
   - History tracking

7. **Personalization**
   - Light/Dark theme
   - Language switching
   - Custom preferences

### Advanced Features

1. **Animations**
   - Page transitions
   - Staggered card animations
   - Tab icon animations
   - Loading animations (Lottie)

2. **Offline Support**
   - Local data storage
   - AsyncStorage persistence
   - Offline favorites

3. **Real-time Sync**
   - Firebase Firestore
   - Profile synchronization
   - Cross-device data

4. **Search & Filter**
   - Real-time search
   - Category filtering
   - Place search

---

## 🔥 Firebase Integration

### Configuration

```typescript
// Firebase Config (app.json)
{
  "apiKey": "AIzaSyCRVuHFtiY8h4269v1a-T4nHMKLhsC-t_0",
  "authDomain": "trekbuddy-72b01.firebaseapp.com",
  "projectId": "trekbuddy-72b01",
  "storageBucket": "trekbuddy-72b01.appspot.com",
  "messagingSenderId": "512827597054",
  "appId": "1:512827597054:web:a01e3ff2f07534446c85af"
}
```

### Authentication Methods

1. **Email/Password**
   - Sign up
   - Sign in
   - Password reset

2. **Google Sign-In**
   - OAuth flow
   - Profile creation

3. **Anonymous**
   - Guest access
   - Temporary accounts

4. **Phone OTP**
   - SMS verification
   - Phone authentication

### Firestore Collections

#### users
```typescript
{
  uid: string,
  email: string,
  name: string,
  phone?: string,
  profilePhotoUrl?: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### trips
```typescript
{
  id: string,
  userId: string,
  title: string,
  days: number,
  places: Place[],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### favorites
```typescript
{
  id: string,
  userId: string,
  placeId: string,
  place: Place,
  addedAt: timestamp
}
```

### Storage

- **Profile Photos**: `/users/{userId}/profile.jpg`
- **Trip Images**: `/trips/{tripId}/images/`

---

## 🚀 Setup & Installation

### Prerequisites

1. **Node.js** (v16+)
2. **npm** or **yarn**
3. **Expo CLI** (or use npx)
4. **Git**

### Mobile App Setup

```bash
# 1. Navigate to project
cd D:\TrekBuddy

# 2. Install dependencies
npm install

# 3. Start development server
npm start
# or
npx expo start

# 4. Run on device
# - Press 'a' for Android
# - Press 'i' for iOS
# - Press 'w' for web
# - Scan QR code with Expo Go app
```

### Web App Setup

```bash
# 1. Navigate to web directory
cd D:\TrekBuddy\web

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

### Environment Variables

No `.env` file needed - Firebase config is in `app.json` and `web/src/firebase.js`

### Firebase Setup

1. Create Firebase project at https://console.firebase.google.com
2. Enable Authentication methods
3. Create Firestore database
4. Enable Storage
5. Update config in `app.json` and `web/src/firebase.js`

---

## 💻 Development Guide

### Code Style

- **TypeScript** for mobile app
- **JavaScript** for web app
- **ESLint** for code quality
- **Functional components** with hooks

### File Naming

- **Components**: PascalCase (e.g., `CategoryCard.tsx`)
- **Utilities**: camelCase (e.g., `tripPlanner.ts`)
- **Screens**: PascalCase with "Screen" suffix
- **Constants**: UPPER_SNAKE_CASE

### Adding New Features

1. **New Screen**:
   - Create in `src/screens/`
   - Add to `StackNavigator.tsx`
   - Update navigation types

2. **New Component**:
   - Create in `src/components/`
   - Export from index if needed
   - Add to theme if styled

3. **New Category**:
   - Add JSON file in `src/data/`
   - Update `categories.ts`
   - Create category screen

### Testing

```bash
# Run linter
npm run lint

# Type check (mobile)
npx tsc --noEmit

# Type check (web)
cd web && npx tsc --noEmit
```

---

## 📦 Build & Deployment

### Mobile App Build

#### Android APK
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build
eas build --platform android --profile preview
```

#### iOS IPA
```bash
eas build --platform ios --profile preview
```

### Web App Deployment

#### Vercel/Netlify
```bash
cd web
npm run build
# Deploy dist/ folder
```

#### Manual Deployment
```bash
cd web
npm run build
# Upload dist/ to web server
```

---

## 📊 Project Statistics

- **Total Files**: 200+
- **Screens**: 25+
- **Components**: 30+
- **Data Files**: 35+
- **Lines of Code**: 15,000+
- **Dependencies**: 40+

---

## 🔐 Security Notes

- Firebase API keys are in config files (consider environment variables for production)
- Authentication tokens handled by Firebase
- No sensitive data in client code
- HTTPS required for production

---

## 📝 License

MIT License

---

## 👥 Contributors

- **Vishnu Jayakumar** - Primary Developer

---

## 📞 Support

- **GitHub**: https://github.com/Vishnujayakumar-04/TrekBuddy
- **Issues**: GitHub Issues
- **Documentation**: See README.md

---

## 🎯 Future Enhancements

- [ ] Push notifications
- [ ] Social sharing
- [ ] Reviews and ratings
- [ ] Booking integration
- [ ] Offline maps
- [ ] AR features
- [ ] Multi-city support
- [ ] Admin dashboard

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready

---

*This is a comprehensive master documentation. For specific implementation details, refer to individual component files and inline comments.*

