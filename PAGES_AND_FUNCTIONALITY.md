# TrekBuddy - Complete Pages & Functionality Guide

**Detailed breakdown of all screens/pages, their components, and how they work**

---

## 📱 Mobile Application Pages

### 1. WelcomeScreen

**Location**: `src/screens/WelcomeScreen.tsx`

**Purpose**: First screen users see when opening the app (if not logged in)

**What's Inside**:
- **Animated Logo**: TrekBuddy logo with fade-in and scale animation (0.8 → 1.05 → 1.0)
- **App Name**: "TrekBuddy" text with slide-up animation
- **Tagline**: "Your smart travel companion" with fade-in
- **Explore Button**: "Explore TrekBuddy" button with gradient background
- **Background**: Teal gradient (`#0E7C86` to `#4ECDC4`)
- **Decorative Elements**: Background logo (semi-transparent), decorative circles

**How It Works**:
1. On mount, animations start sequentially:
   - Logo fades in (1200ms) and scales up
   - Title slides up after 400ms delay
   - Tagline fades in after 700ms
   - Button appears after 1200ms
2. User taps "Explore TrekBuddy" button
3. Button has press animation (slight scale down)
4. Navigates to `LoginScreen` after 100ms delay

**Navigation**: `WelcomeScreen` → `LoginScreen`

---

### 2. LoginScreen

**Location**: `src/screens/LoginScreen.tsx`

**Purpose**: User authentication and registration

**What's Inside**:
- **Menu Button** (☰): Hamburger menu in top-left
- **Login Form**:
  - Email input field
  - Password input field
  - "Login" button
- **Sign Up Form** (toggle):
  - Name input
  - Email input
  - Phone input
  - Password input
  - Profile photo upload button
  - "Sign Up" button
- **Alternative Auth Options**:
  - Google Sign-In button
  - Guest Login button
  - Phone OTP login (with OTP modal)
- **Side Menu** (when menu button pressed):
  - Theme toggle (Light/Dark)
  - Language selection (English/Tamil)
  - History link
  - Logout button

**How It Works**:
1. **Login Flow**:
   - User enters email/password
   - Calls `signInWithEmailAndPassword()` from Firebase
   - On success, `AuthContext` updates
   - `StackNavigator` detects auth change and navigates to `TabNavigator`

2. **Sign Up Flow**:
   - User fills all fields
   - Optionally uploads profile photo (uses `expo-image-picker`)
   - Creates account with `createUserWithEmailAndPassword()`
   - Uploads photo to Firebase Storage
   - Creates user profile in Firestore
   - Shows success alert

3. **Guest Login**:
   - Calls `signInAnonymously()` from Firebase
   - Creates temporary anonymous account
   - Navigates to main app

4. **Phone OTP**:
   - User enters phone number
   - Sends OTP via Firebase Auth
   - Shows OTP input modal
   - Verifies OTP code
   - Authenticates user

5. **Profile Photo Upload**:
   - Opens image picker
   - Allows crop/edit (1:1 aspect ratio)
   - Shows preview
   - Uploads to Firebase Storage on signup

**Navigation**: `LoginScreen` → `TabNavigator` (after successful auth)

---

### 3. HomeScreen

**Location**: `src/screens/HomeScreen.tsx`

**Purpose**: Main landing page with categories and AI features

**What's Inside**:
- **Header**:
  - Gradient background (teal)
  - "TrekBuddy" title
  - "Discover Pondicherry" subtitle
  - AI Insights button (top-right, sparkle icon)
- **AI Travel Assistant Card**:
  - Large gradient card
  - AI icon
  - "AI Travel Assistant" title
  - "Ask me anything about Pondicherry" subtitle
  - Navigates to `AIChatbotScreen`
- **Quick Explore Section**:
  - Grid of 12 category cards (2 columns)
  - Each card shows:
    - Category image
    - Category label
    - Staggered entrance animations
- **View All Categories Button**
- **AI Insights Modal** (when AI button pressed):
  - Best Time recommendations
  - Nearby Attractions suggestions
  - Safety Tips
  - Weather Tips

**How It Works**:
1. **On Load**:
   - Loads AI recommendations asynchronously:
     - Best time to visit
     - Nearby attractions
     - Safety tips
   - Gets weather hints
   - Loads visited categories from storage

2. **Category Navigation**:
   - Each category has specific navigation:
     - Temples → `ReligiousPlacesScreen`
     - Beaches → `BeachesScreen`
     - Parks → `ParksScreen`
     - Nature → `NatureScreen`
     - Nightlife → `NightlifeScreen`
     - Adventure → `AdventureScreen`
     - Theatres → `TheatresScreen`
     - Photoshoot → `PhotoshootScreen`
     - Shopping → `ShoppingScreen`
     - Pubs → `PubsScreen`
     - Accommodation → `AccommodationScreen`
     - Restaurants → `RestaurantsScreen`

3. **AI Recommendations**:
   - Uses Google Gemini API
   - Analyzes user's visited categories
   - Generates personalized recommendations
   - Displays in modal with icons

4. **Animations**:
   - Category cards have staggered fade-in animations
   - Each card animates with 50ms delay from previous

**Navigation**: 
- `HomeScreen` → `CategoryScreen` (for generic categories)
- `HomeScreen` → `BeachesScreen`, `ParksScreen`, etc. (for specific categories)
- `HomeScreen` → `AIChatbotScreen` (AI assistant)
- `HomeScreen` → `AIDetailScreen` (AI insights)
- `HomeScreen` → `ExploreScreen` (view all)

---

### 4. CategoryScreen

**Location**: `src/screens/CategoryScreen.tsx`

**Purpose**: Generic category listing screen (used for categories without dedicated screens)

**What's Inside**:
- **Header**:
  - Back button
  - Category name (dynamic)
  - Animated entrance (fade + slide down)
- **Place List**:
  - FlatList of place cards
  - Each card shows:
    - Place image (or fallback)
    - Rating badge (top-right)
    - Place name
    - Description (2 lines max)
    - Entry fee icon + text
    - Opening hours icon + text
  - Staggered animations (50ms delay per card)

**How It Works**:
1. **On Load**:
   - Gets category name from route params
   - Loads category data from JSON files via `getCategoryData()`
   - Animates header entrance
   - Tracks visited category in storage (for AI recommendations)

2. **Place Card Animations**:
   - Each card fades in and slides up
   - Delay increases with index (staggered effect)
   - Uses `AnimatedPlaceCard` component

3. **Place Selection**:
   - User taps a place card
   - Navigates to `PlaceDetailsScreen` with place data

4. **Empty State**:
   - Shows "Coming Soon" message if no places
   - Provides button to explore other categories

**Data Source**: JSON files in `src/data/` (e.g., `beaches.json`, `parks.json`)

**Navigation**: `CategoryScreen` → `PlaceDetailsScreen`

---

### 5. PlaceDetailsScreen

**Location**: `src/screens/PlaceDetailsScreen.tsx`

**Purpose**: Detailed view of a single place

**What's Inside**:
- **Hero Section**:
  - Full-width place image (200px height)
  - Back button (top-left, circular)
  - Favorite button (top-right, heart icon)
  - Rating badge (bottom-right, ⭐ rating)
- **Content Section**:
  - Place name (large heading)
  - Address (with location icon)
  - "About" section with description
  - Opening hours card (with clock icon)
  - Entry fee card (with price tag icon)
  - Contact card (with phone icon, if available)
- **Action Buttons**:
  - "Open Maps" button (primary color)
  - "Call" button (green, if phone available)
  - "Share" button (blue)

**How It Works**:
1. **On Load**:
   - Receives place data from route params
   - Checks if place is favorited (from AsyncStorage)
   - Sets favorite button state

2. **Favorite Toggle**:
   - User taps heart icon
   - Saves/removes from favorites in AsyncStorage
   - Updates UI immediately
   - Shows error alert if save fails

3. **Map Integration**:
   - "Open Maps" button uses `Linking.openURL()`
   - Opens place's `mapUrl` in device's map app (Google Maps/Apple Maps)

4. **Phone Call**:
   - "Call" button uses `Linking.openURL('tel:...')`
   - Opens device's phone dialer

5. **Share**:
   - Uses React Native `Share` API
   - Shares place name, description, opening hours, rating
   - Works with any shareable app on device

6. **Image Handling**:
   - Shows place image if available
   - Falls back to colored placeholder if image fails to load

**Data Flow**: Place data passed via navigation params → Displayed → User interactions → Native APIs

**Navigation**: `PlaceDetailsScreen` → Back to previous screen

---

### 6. TripPlannerInput

**Location**: `src/screens/TripPlannerInput.tsx`

**Purpose**: Form to input trip planning preferences

**What's Inside**:
- **Header**: "Plan Your Trip" with back button
- **Travel Dates Section**:
  - Start date input (YYYY-MM-DD format)
  - End date input (YYYY-MM-DD format)
  - Calendar icons
- **Budget Section**:
  - Budget input (numeric, in ₹)
  - Wallet icon
- **Interests Section**:
  - Category selection chips:
    - Temples
    - Beaches
    - Food & Dining
    - Nightlife
  - Multi-select (can select multiple)
  - Selected chips highlighted
- **Travel Mode Section**:
  - Radio button selection:
    - Walking
    - Driving
    - Public Transport
    - Mixed (default)
- **Generate Itinerary Button**: Large button with AI icon

**How It Works**:
1. **Form Input**:
   - User enters dates, budget, selects categories, chooses travel mode
   - Date validation: Must be YYYY-MM-DD format
   - Budget validation: Must be positive number

2. **Validation**:
   - Checks all required fields are filled
   - Validates end date is after start date
   - Validates budget is valid number
   - Validates at least one category selected
   - Shows error alerts for invalid inputs

3. **Form Submission**:
   - Creates `TripInput` object with all data
   - Navigates to `TripPlannerOutput` with input data
   - Passes data via route params

4. **UI Interactions**:
   - Category chips toggle on/off
   - Travel mode cards are radio buttons (single selection)
   - Selected items highlighted with primary color

**Navigation**: `TripPlannerInput` → `TripPlannerOutput` (with trip input data)

---

### 7. TripPlannerOutput

**Location**: `src/screens/TripPlannerOutput.tsx`

**Purpose**: Displays AI-generated trip itinerary

**What's Inside**:
- **Header**: Gradient header with "Your Itinerary" title
- **Loading State**:
  - Activity indicator
  - "Generating your trip itinerary..." text
- **Summary Card**:
  - Trip summary text
  - Total days
  - Budget (₹)
  - Estimated cost (₹)
  - Cost comparison (green if under budget, yellow if over)
- **Day-by-Day Itinerary**:
  - Expandable day cards (using `ExpandableDayCard` component)
  - Each day shows:
    - Day number
    - Activities list
    - Each activity shows:
      - Time
      - Place name
      - Category
      - Duration
      - Cost (if applicable)
      - Travel time (between activities)
      - "Map" button
- **Save Trip Button**: Saves itinerary to storage

**How It Works**:
1. **On Load**:
   - Receives `tripInput` from route params
   - Shows loading state
   - Calls `generateTripItinerary()` from Gemini API
   - Passes: dates, budget, categories, travel mode, all places data
   - AI generates day-by-day plan

2. **Itinerary Generation**:
   - Uses Google Gemini AI
   - Analyzes:
     - Number of days
     - Budget constraints
     - Selected categories
     - Travel mode preferences
     - All available places
   - Generates optimized itinerary
   - Returns structured data:
     - Summary
     - Total days
     - Total budget
     - Estimated cost
     - Array of day itineraries
     - Each day has array of activities

3. **Activity Display**:
   - Each activity shows time, place, category, duration, cost
   - Travel time shown between activities
   - Map button opens place location in maps

4. **Save Functionality**:
   - Saves to AsyncStorage (local)
   - If user authenticated, also saves to Firestore
   - Adds to user's history
   - Shows success animation (Lottie)
   - Button changes to "Trip Saved!" temporarily

5. **Error Handling**:
   - Shows error message if generation fails
   - Provides "Go Back" button to retry

**Data Flow**: 
- Input data → Gemini API → Structured itinerary → Display → Save to storage/Firestore

**Navigation**: `TripPlannerOutput` → Back to `TripPlannerScreen`

---

### 8. TransportScreen

**Location**: `src/screens/TransportScreen.tsx`

**Purpose**: Transportation options and information

**What's Inside**:
- **Header**: Gradient header (blue) with "Transport" title
- **Tab Selector**:
  - "🚗 Rentals" tab
  - "🚕 Cabs" tab
- **Rentals Tab**:
  - Bike Rental card
  - Cycle Rental card
  - Car Rental card
  - Each card shows icon, label, description
- **Cabs Tab**:
  - Car Cab card
  - Bike Taxi card
  - Auto card
  - Share Auto card
- **Public Transport Section** (when available):
  - Bus routes list
  - Route details modal:
    - Route number
    - From/To locations
    - Stops list
    - Ticket price
    - Frequency
    - Operating hours

**How It Works**:
1. **Tab Switching**:
   - User taps tab
   - Updates `activeTab` state
   - Renders corresponding content

2. **Rentals/Cabs**:
   - Each card navigates to category screen
   - Shows rental/cab options

3. **Bus Routes**:
   - Loads bus routes from `busRoutes.json`
   - Displays route cards
   - User taps route → Shows modal with details
   - Modal shows:
     - Route information
     - All stops
     - Pricing
     - Schedule

4. **Data Source**: `src/data/busRoutes.json`

**Navigation**: `TransportScreen` → `CategoryScreen` (for rentals/cabs)

---

### 9. AIChatbotScreen

**Location**: `src/screens/AIChatbotScreen.tsx`

**Purpose**: AI-powered chat assistant for travel questions

**What's Inside**:
- **Header**: Gradient header with "AI Assistant" title and back button
- **Chat Messages List**:
  - ScrollView with all messages
  - User messages (right-aligned, blue background)
  - AI messages (left-aligned, gray background)
  - Each message shows:
    - Question/Answer text
    - Timestamp
- **Input Section**:
  - Text input field
  - Send button (disabled when loading)
  - Loading indicator when AI is responding

**How It Works**:
1. **Authentication Check**:
   - Requires user to be logged in
   - Shows alert if not authenticated
   - Navigates back if user logs out

2. **Chat History**:
   - Loads chat history from Firestore on mount
   - Subscribes to real-time updates
   - Displays all previous conversations
   - Messages ordered by timestamp

3. **Sending Messages**:
   - User types question
   - Taps send button
   - Message added to local state immediately
   - Shows loading indicator
   - Calls `getGeminiChatResponse()` with:
     - User's question
     - Chat history (context)
     - All places data (for recommendations)
   - AI generates response
   - Response added to messages
   - Saves to Firestore:
     - Question
     - Answer
     - Timestamp
     - User ID

4. **Real-time Sync**:
   - Uses Firestore `onSnapshot()` listener
   - Updates chat when new messages added
   - Works across devices (if user logs in elsewhere)

5. **AI Context**:
   - AI has access to:
     - All places in Pondicherry
     - User's chat history
     - User's preferences (from visited categories)
   - Provides personalized recommendations

**Data Flow**: 
- User question → Gemini API → AI response → Save to Firestore → Display → Real-time sync

**Navigation**: `AIChatbotScreen` → Back to previous screen

---

### 10. EmergencyScreenTab

**Location**: `src/screens/EmergencyScreenTab.tsx`

**Purpose**: Emergency services directory

**What's Inside**:
- **Header**: Red gradient header with "Emergency" title
- **Service Categories**:
  - Hospitals
  - Police Stations
  - Fire Services
  - Pharmacies
- **Service Cards**:
  - Each service shows:
    - Service name
    - Address
    - Phone number
    - Quick call button
    - Map button

**How It Works**:
1. **Data Loading**:
   - Loads emergency data from JSON files:
     - `hospitals.json`
     - `police.json`
     - `fire.json`
     - `pharmacies.json`

2. **Quick Actions**:
   - Call button: Opens phone dialer with number
   - Map button: Opens location in maps app

3. **Categorization**:
   - Services grouped by type
   - Easy to find specific emergency service

**Navigation**: Emergency services only (no navigation to other screens)

---

### 11. ProfileScreen

**Location**: `src/screens/ProfileScreen.tsx`

**Purpose**: User profile management

**What's Inside**:
- **Profile Header**:
  - Profile photo (circular)
  - User name
  - User email
  - Edit photo button
- **Menu Options**:
  - Settings button
  - History button
  - Logout button

**How It Works**:
1. **Profile Display**:
   - Loads user data from Firestore
   - Shows profile photo (from Firebase Storage)
   - Displays name and email

2. **Photo Edit**:
   - User taps edit button
   - Opens image picker
   - Uploads new photo to Firebase Storage
   - Updates Firestore profile

3. **Navigation**:
   - Settings → `SettingsScreen`
   - History → `HistoryScreen`
   - Logout → Signs out → Returns to `WelcomeScreen`

**Navigation**: 
- `ProfileScreen` → `SettingsScreen`
- `ProfileScreen` → `HistoryScreen`
- `ProfileScreen` → `WelcomeScreen` (on logout)

---

### 12. Category-Specific Screens

**Location**: `src/screens/[Category]Screen.tsx`

**Categories**:
- `BeachesScreen.tsx`
- `ParksScreen.tsx`
- `NatureScreen.tsx`
- `NightlifeScreen.tsx`
- `AdventureScreen.tsx`
- `TheatresScreen.tsx`
- `PhotoshootScreen.tsx`
- `ShoppingScreen.tsx`
- `PubsScreen.tsx`
- `AccommodationScreen.tsx`
- `RestaurantsScreen.tsx`
- `ReligiousPlacesScreen.tsx` (with subcategories)

**What's Inside** (similar structure):
- **Header**: Category name with back button
- **Place List**: FlatList of places in that category
- **Search Bar**: Filter places by name
- **Place Cards**: Same as `CategoryScreen`

**How It Works**:
1. **Data Loading**:
   - Each screen loads data from specific JSON file
   - Example: `BeachesScreen` loads `beaches.json`

2. **Religious Places Special Case**:
   - `ReligiousPlacesScreen` has subcategories:
     - Hindu Temples
     - Buddhist Temples
     - Christian Churches
     - Muslim Mosques
     - Jain Temples
   - Each subcategory loads from `src/data/religion/[subcategory].json`

3. **Navigation**:
   - User taps place → `PlaceDetailsScreen`

**Navigation**: `[Category]Screen` → `PlaceDetailsScreen`

---

## 🌐 Web Application Pages

### 1. Home Page

**Location**: `web/src/pages/Home.jsx`

**What's Inside**:
- **HeroSection Component**:
  - 3D model viewer (TrekBuddy logo/model)
  - Animated title: "Discover Pondicherry"
  - Tagline
  - Delayed fade-in animations
- **Categories Section**:
  - Grid of category cards (responsive: 1-4 columns)
  - Staggered entrance animations
  - Each card shows category image and label
- **Featured Places Section**:
  - Grid of featured places
  - Loads top 6 places
  - Card components with hover effects

**How It Works**:
1. **On Load**:
   - Loads categories from `QUICK_CATEGORIES`
   - Fetches featured places via `getFeaturedPlaces()`
   - Applies Framer Motion animations

2. **Animations**:
   - Hero section: Title fades in and slides up
   - 3D model: Delayed fade-in (0.5s delay)
   - Categories: Staggered fade-in (0.1s delay each)
   - Featured places: Staggered fade-in

3. **Responsive Design**:
   - 1 column on mobile
   - 2 columns on tablet
   - 3-4 columns on desktop

**Navigation**: `Home` → `CategoryPage` (when category clicked)

---

### 2. CategoryPage

**Location**: `web/src/pages/CategoryPage.jsx`

**What's Inside**:
- **Category Header**: Category name
- **Place Grid**: Responsive grid of place cards
- **Search/Filter**: Filter places by name

**How It Works**:
1. **Route Params**:
   - Gets category name from URL
   - Loads category data via `loadCategoryData()`

2. **Place Cards**:
   - Each card shows:
     - Place image
     - Place name
     - Description
     - Rating
     - Hover effects (scale, shadow, border glow)

3. **Navigation**:
   - Clicking place card → `PlaceDetails` page

**Navigation**: `CategoryPage` → `PlaceDetails`

---

### 3. PlaceDetails

**Location**: `web/src/pages/PlaceDetails.jsx`

**What's Inside**:
- **Hero Image**: Large place image
- **Place Information**:
   - Name
   - Description
   - Address
   - Opening hours
   - Entry fee
   - Rating
- **Action Buttons**:
   - Open Maps
   - Share

**How It Works**:
1. **Data Loading**:
   - Gets place ID from URL
   - Loads place data via `getPlaceById()`

2. **Map Integration**:
   - Opens Google Maps with place location

3. **Share**:
   - Uses Web Share API (if available)
   - Falls back to copy link

**Navigation**: `PlaceDetails` → Back to previous page

---

### 4. AIChat

**Location**: `web/src/pages/AIChat.jsx`

**What's Inside**:
- **Chat Container**: Premium styled container with:
   - Rounded corners
   - Shadow
   - Border
   - Dark mode support
- **Chat Messages**: List of user/AI messages
- **Input Field**: Text input with send button

**How It Works**:
1. **Similar to Mobile**:
   - Same Firebase integration
   - Same Gemini API calls
   - Real-time Firestore sync

2. **Premium Styling**:
   - Framer Motion entrance animation
   - Smooth transitions
   - Modern UI design

**Navigation**: `AIChat` → Back to home

---

## 🔄 Navigation Flow

### Mobile App Navigation

```
WelcomeScreen (if !user)
    ↓
LoginScreen (if !user)
    ↓
TabNavigator (if user)
    ├── HomeScreen
    │   ├── → CategoryScreen
    │   ├── → BeachesScreen / ParksScreen / etc.
    │   ├── → PlaceDetailsScreen
    │   ├── → AIChatbotScreen
    │   ├── → AIDetailScreen
    │   └── → ExploreScreen
    │
    ├── TripPlannerScreen
    │   ├── → TripPlannerInput
    │   └── → TripPlannerOutput
    │
    ├── TransportScreen
    │   └── → CategoryScreen (for rentals/cabs)
    │
    ├── EmergencyScreenTab
    │   └── (No navigation, direct actions)
    │
    └── ProfileScreen
        ├── → SettingsScreen
        └── → HistoryScreen
```

### Web App Navigation

```
Home
    ├── → CategoryPage
    │   └── → PlaceDetails
    │
    ├── → AIChat
    │
    ├── → Transport
    │
    ├── → Emergency
    │
    └── → [Category Pages]
        └── → PlaceDetails
```

---

## 📊 Data Flow

### Mobile App Data Flow

1. **Static Data**:
   - JSON files in `src/data/`
   - Loaded via `getCategoryData()`, `getAllPlaces()`
   - Cached in memory

2. **User Data**:
   - AsyncStorage (local): Favorites, trips, history
   - Firestore (cloud): User profile, chat history, saved trips
   - Firebase Storage: Profile photos

3. **AI Data**:
   - Google Gemini API: Recommendations, chat, trip planning
   - Context: User's visited categories, all places data

4. **Real-time Updates**:
   - Firestore listeners for chat history
   - Auth state changes trigger navigation

### Web App Data Flow

1. **Static Data**:
   - Same JSON files in `web/src/data/`
   - Loaded via `dataLoader.js`

2. **User Data**:
   - Firestore: Same as mobile
   - Firebase Storage: Profile photos

3. **AI Data**:
   - Same Gemini API integration

---

## 🎨 Component Interactions

### Common Components Used Across Pages

1. **CategoryCard**:
   - Used in: `HomeScreen`, `ExploreScreen`
   - Props: `category`, `onPress`, `index`
   - Features: Staggered animations, gradient backgrounds

2. **ScreenTransition**:
   - Wraps screen content
   - Provides fade + slide animations
   - Used in: All screens (optional)

3. **GradientHeader**:
   - Used in: `TripPlannerOutput`, `AIChatbotScreen`
   - Features: Gradient background, back button, title

4. **Card** (UI Component):
   - Used in: Multiple screens
   - Features: Rounded corners, shadows, padding

5. **Button** (UI Component):
   - Used in: Forms, actions
   - Variants: Primary, Secondary, Outline

---

## 🔧 Key Functions & Utilities

### Data Loading
- `getCategoryData(category)`: Loads places for a category
- `getAllPlaces()`: Gets all places from all categories
- `getPlaceById(category, id)`: Gets specific place

### Storage
- `saveFavorite(place)`: Saves place to favorites
- `removeFavorite(placeId)`: Removes from favorites
- `isFavorite(placeId)`: Checks if favorited
- `saveTrip(trip)`: Saves trip itinerary
- `addVisitedCategory(category)`: Tracks visited categories

### AI Functions
- `generateAIRecommendation(type, visitedCategories, allPlaces)`: Gets AI recommendation
- `generateTripItinerary(dates, budget, categories, travelMode, places)`: Generates trip plan
- `getGeminiChatResponse(question, history, places)`: Gets AI chat response

### Firebase
- `createUserProfile(uid, data)`: Creates user profile
- `updateUserProfile(uid, data)`: Updates profile
- `saveTripToFirestore(uid, trip)`: Saves trip to cloud
- `addToHistory(uid, item)`: Adds to user history

---

## 🎯 User Journey Examples

### Example 1: Exploring a Place
1. User opens app → `WelcomeScreen`
2. Taps "Explore TrekBuddy" → `LoginScreen`
3. Logs in → `HomeScreen`
4. Taps "Beaches" category → `BeachesScreen`
5. Sees list of beaches with images
6. Taps a beach → `PlaceDetailsScreen`
7. Views details, taps "Open Maps" → Opens Google Maps
8. Taps heart icon → Saves to favorites

### Example 2: Planning a Trip
1. User on `HomeScreen`
2. Taps "Trip" tab → `TripPlannerScreen`
3. Taps "Plan New Trip" → `TripPlannerInput`
4. Enters:
   - Dates: 2025-02-01 to 2025-02-03
   - Budget: ₹5000
   - Categories: Beaches, Temples
   - Travel Mode: Mixed
5. Taps "Generate Itinerary" → `TripPlannerOutput`
6. Views AI-generated 3-day itinerary
7. Expands each day to see activities
8. Taps "Save Trip" → Saved to storage and Firestore

### Example 3: Using AI Assistant
1. User on `HomeScreen`
2. Taps "AI Travel Assistant" card → `AIChatbotScreen`
3. Types: "What are the best beaches in Pondicherry?"
4. AI responds with recommendations
5. Asks follow-up: "What's the best time to visit?"
6. AI provides personalized answer based on:
   - User's visited categories
   - All places data
   - Chat history
7. Chat history saved to Firestore
8. User can return later and see previous conversations

---

## 📱 Platform Differences

### Mobile App
- **Navigation**: React Navigation (Stack + Tabs)
- **Animations**: React Native Reanimated + Animated API
- **Storage**: AsyncStorage + Firestore
- **Native Features**: Phone calls, Maps, Share, Image Picker

### Web App
- **Navigation**: React Router DOM
- **Animations**: Framer Motion
- **Storage**: Firestore only (no AsyncStorage)
- **Web Features**: Web Share API, Google Maps links

---

## 🔐 Authentication Flow

1. **App Launch**:
   - `App.tsx` checks auth state via `AuthContext`
   - If no user → `WelcomeScreen`
   - If user exists → `TabNavigator`

2. **Login Process**:
   - User enters credentials in `LoginScreen`
   - Firebase Auth authenticates
   - `AuthContext` updates
   - `StackNavigator` detects change
   - Navigates to `TabNavigator`

3. **Session Persistence**:
   - Firebase Auth persists session
   - User stays logged in across app restarts
   - Logout clears session

---

## 🎨 Animation System

### Mobile Animations
- **Screen Transitions**: 350ms slide-right (default), vertical reveal (categories), modal (details)
- **Card Animations**: Staggered fade-in + slide-up (50ms delay)
- **Logo Animation**: Fade + scale (1200ms)
- **Tab Icons**: Scale animation on focus

### Web Animations
- **Page Transitions**: Fade + slide (400ms) via Framer Motion
- **Card Hover**: Scale (1.04x) + shadow + border glow
- **Hero Section**: Delayed fade-in (500ms)
- **Staggered Lists**: Sequential fade-in

---

This document provides a complete understanding of all pages, their components, functionality, and how they work together in the TrekBuddy application.

