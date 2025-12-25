# Firestore Database Structure for TrekBuddy

This document describes the complete Firestore database structure with separate collections for different modules and categories.

## Database Structure Overview

### 1. Users Collection (`users/`)
**Path:** `users/{userId}`

Stores user profile information and contains subcollections for user-specific data.

**Document Structure:**
```typescript
{
  name: string;
  email: string;
  phone?: string;
  profilePhotoUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Subcollections:**
- `users/{userId}/trips/{tripId}` - User's saved trip plans
- `users/{userId}/favorites/{placeId}` - User's favorite places
- `users/{userId}/history/{historyId}` - User's visit/activity history
- `users/{userId}/chats/{chatId}` - AI chatbot conversation history

---

### 2. Categories Collection (`categories/`)
**Path:** `categories/{categoryId}`

Stores category metadata and configuration.

**Document Structure:**
```typescript
{
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
  createdAt: Timestamp;
}
```

**Categories:**
- beaches
- parks
- restaurants
- pubs
- shopping
- photoshoot
- theatres
- accommodation
- nature
- nightlife
- adventure
- transport
- emergency

---

### 3. Places Collections (`places/`)
**Path:** `places/{category}/{placeId}`

Stores place data organized by category.

#### Regular Categories:
- `places/beaches/{placeId}`
- `places/parks/{placeId}`
- `places/restaurants/{placeId}`
- `places/pubs/{placeId}`
- `places/shopping/{placeId}`
- `places/photoshoot/{placeId}`
- `places/theatres/{placeId}`
- `places/accommodation/{placeId}`
- `places/nature/{placeId}`
- `places/nightlife/{placeId}`
- `places/adventure/{placeId}`
- `places/transport/{placeId}`
- `places/emergency/{placeId}`

#### Religious Places:
- `places/religious/hindu-temples/{placeId}`
- `places/religious/christian-churches/{placeId}`
- `places/religious/muslim-mosques/{placeId}`
- `places/religious/jain-temples/{placeId}`
- `places/religious/buddhist-temples/{placeId}`

**Document Structure:**
```typescript
{
  id: string;
  name: string;
  description?: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  images?: string[];
  rating?: number;
  priceRange?: string;
  openingHours?: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  category: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 4. Trip Plans Collection (`tripPlans/`) - Optional
**Path:** `tripPlans/{tripId}`

Stores public/shared trip plans (optional feature).

**Document Structure:**
```typescript
{
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelMode: string;
  categories: string[];
  itinerary: TripItinerary;
  createdBy: string; // userId
  isPublic: boolean;
  likes?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## Collection Path Helpers

Use the helper functions from `src/firebase/firestoreStructure.ts`:

### Get Category Collection Path
```typescript
import { getCategoryCollectionPath } from '../firebase/firestoreStructure';

const beachesPath = getCategoryCollectionPath('beaches');
// Returns: "places/beaches"
```

### Get User Subcollection Path
```typescript
import { getUserSubcollectionPath } from '../firebase/firestoreStructure';

const tripsPath = getUserSubcollectionPath(userId, 'trips');
// Returns: "users/{userId}/trips"

const chatsPath = getUserSubcollectionPath(userId, 'chats');
// Returns: "users/{userId}/chats"
```

---

## Security Rules

Recommended Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Categories are read-only for all authenticated users
    match /categories/{categoryId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can write
    }
    
    // Places are read-only for all authenticated users
    match /places/{category}/{placeId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can write
    }
    
    // Public trip plans (if implemented)
    match /tripPlans/{tripId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.createdBy == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.createdBy == request.auth.uid;
    }
  }
}
```

---

## Usage Examples

### Adding a Place to a Category
```typescript
import { db } from '../firebase/firestore';
import { getCategoryCollectionPath } from '../firebase/firestoreStructure';
import { collection, addDoc } from 'firebase/firestore';

const beachesPath = getCategoryCollectionPath('beaches');
const beachesRef = collection(db, beachesPath);

await addDoc(beachesRef, {
  name: 'Paradise Beach',
  location: { latitude: 11.9344, longitude: 79.8300 },
  // ... other fields
});
```

### Getting User Trips
```typescript
import { getUserTrips } from '../utils/firestore';

const trips = await getUserTrips(userId);
```

### Adding to User History
```typescript
import { addToHistory } from '../utils/firestore';

await addToHistory(userId, {
  type: 'place',
  title: 'Paradise Beach',
  date: new Date().toISOString(),
  placeId: 'beach-123',
  category: 'beaches',
});
```

---

## Migration Notes

If you're migrating from the old structure:
1. User data structure remains the same
2. Category-based places can be migrated gradually
3. Existing user trips, favorites, and history will continue to work
4. New places should be added using the category-based structure

