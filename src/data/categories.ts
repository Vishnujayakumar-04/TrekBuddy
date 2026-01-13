// Complete Categories Data for TrekBuddy
// This file contains all 12 main categories used across the app

export interface Category {
  id: string;
  label: string;
  image: string;
  icon?: string;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  label: string;
  image: string;
  parentId: string;
}

// Main Categories - 11 Categories (Parks moved to Nature subcategory)
export const ALL_CATEGORIES: Category[] = [
  // 1. Temples
  {
    id: 'temples',
    label: 'Temples',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
    subcategories: [
      { id: 'hindu-temples', label: 'Hindu Temples', image: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800', parentId: 'temples' },
      { id: 'churches', label: 'Churches', image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800', parentId: 'temples' },
      { id: 'mosques', label: 'Mosques', image: 'https://images.unsplash.com/photo-1564769625673-cb5e6f6be6b7?w=800', parentId: 'temples' },
      { id: 'jain-temples', label: 'Jain Temples', image: 'https://images.unsplash.com/photo-1591018653367-6353e1b1e4e4?w=800', parentId: 'temples' },
      { id: 'buddhist-temples', label: 'Buddhist Temples', image: 'https://images.unsplash.com/photo-1545562083-c583d014b4f2?w=800', parentId: 'temples' },
    ],
  },
  
  // 2. Beaches
  {
    id: 'beaches',
    label: 'Beaches',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  },
  
  // 3. Restaurants & Dining
  {
    id: 'restaurants',
    label: 'Restaurants & Dining',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    subcategories: [
      { id: 'fine-dining', label: 'Fine Dining', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', parentId: 'restaurants' },
      { id: 'cafes', label: 'Cafes', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', parentId: 'restaurants' },
      { id: 'street-food', label: 'Street Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', parentId: 'restaurants' },
      { id: 'seafood', label: 'Seafood', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800', parentId: 'restaurants' },
      { id: 'vegetarian', label: 'Vegetarian', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', parentId: 'restaurants' },
    ],
  },
  
  // 5. Accommodation
  {
    id: 'accommodation',
    label: 'Accommodation',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    subcategories: [
      { id: 'hotels', label: 'Hotels', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', parentId: 'accommodation' },
      { id: 'resorts', label: 'Resorts', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', parentId: 'accommodation' },
      { id: 'homestays', label: 'Homestays', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', parentId: 'accommodation' },
      { id: 'hostels', label: 'Hostels', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', parentId: 'accommodation' },
      { id: 'guesthouses', label: 'Guest Houses', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', parentId: 'accommodation' },
    ],
  },
  
  // 6. Pubs / Bars
  {
    id: 'pubs',
    label: 'Pubs / Bars',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
    subcategories: [
      { id: 'pubs-bars', label: 'Pubs & Bars', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800', parentId: 'pubs' },
      { id: 'wine-bars', label: 'Wine Bars', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', parentId: 'pubs' },
      { id: 'rooftop-bars', label: 'Rooftop Bars', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800', parentId: 'pubs' },
    ],
  },
  
  // 7. Shopping Places
  {
    id: 'shopping',
    label: 'Shopping Places',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
    subcategories: [
      { id: 'markets', label: 'Markets', image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800', parentId: 'shopping' },
      { id: 'malls', label: 'Malls', image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=800', parentId: 'shopping' },
      { id: 'boutiques', label: 'Boutiques', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', parentId: 'shopping' },
      { id: 'handicrafts', label: 'Handicrafts', image: 'https://images.unsplash.com/photo-1528396518501-b53b655eb9b3?w=800', parentId: 'shopping' },
    ],
  },
  
  // 8. Photoshoot Locations
  {
    id: 'photoshoot',
    label: 'Photoshoot Locations',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
    subcategories: [
      { id: 'french-colony', label: 'French Colony', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800', parentId: 'photoshoot' },
      { id: 'heritage-buildings', label: 'Heritage Buildings', image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800', parentId: 'photoshoot' },
      { id: 'beach-spots', label: 'Beach Spots', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', parentId: 'photoshoot' },
      { id: 'sunrise-sunset', label: 'Sunrise/Sunset Points', image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800', parentId: 'photoshoot' },
    ],
  },
  
  // 9. Theatres & Cinemas
  {
    id: 'theatres',
    label: 'Theatres & Cinemas',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    subcategories: [
      { id: 'movie-theatres', label: 'Movie Theatres', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800', parentId: 'theatres' },
      { id: 'multiplexes', label: 'Multiplexes', image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800', parentId: 'theatres' },
      { id: 'drama-theatres', label: 'Drama Theatres', image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800', parentId: 'theatres' },
    ],
  },
  
  // 10. Adventure & Outdoor Activities
  {
    id: 'adventure',
    label: 'Adventure & Outdoor',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800',
    subcategories: [
      { id: 'surfing', label: 'Surfing', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800', parentId: 'adventure' },
      { id: 'kayaking', label: 'Kayaking', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', parentId: 'adventure' },
      { id: 'boating', label: 'Boating', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800', parentId: 'adventure' },
      { id: 'cycling', label: 'Cycling', image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800', parentId: 'adventure' },
      { id: 'trekking', label: 'Trekking', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', parentId: 'adventure' },
      { id: 'scuba-diving', label: 'Scuba Diving', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', parentId: 'adventure' },
    ],
  },
  
  // 11. Nightlife & Evening Activities
  {
    id: 'nightlife',
    label: 'Nightlife & Evening',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    subcategories: [
      { id: 'night-markets', label: 'Night Markets', image: 'https://images.unsplash.com/photo-1555992336-03a23f24ba50?w=800', parentId: 'nightlife' },
      { id: 'night-walks', label: 'Night Walks', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', parentId: 'nightlife' },
      { id: 'live-music', label: 'Live Music', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', parentId: 'nightlife' },
      { id: 'beach-bonfires', label: 'Beach Bonfires', image: 'https://images.unsplash.com/photo-1475738198235-4b30fc20cff4?w=800', parentId: 'nightlife' },
    ],
  },
  
  // 12. Nature
  {
    id: 'nature',
    label: 'Nature',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    subcategories: [
      { id: 'parks', label: 'Parks', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', parentId: 'nature' },
      { id: 'botanical-gardens', label: 'Botanical Gardens', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800', parentId: 'nature' },
      { id: 'mangroves', label: 'Mangroves', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', parentId: 'nature' },
      { id: 'backwaters', label: 'Backwaters', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', parentId: 'nature' },
      { id: 'bird-sanctuaries', label: 'Bird Sanctuaries', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800', parentId: 'nature' },
      { id: 'lakes', label: 'Lakes & Ponds', image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800', parentId: 'nature' },
    ],
  },
];

// Quick categories for Home screen (all 11 main categories in 2-column grid)
export const QUICK_CATEGORIES: Category[] = [
  ALL_CATEGORIES.find(c => c.id === 'temples')!,
  ALL_CATEGORIES.find(c => c.id === 'beaches')!,
  ALL_CATEGORIES.find(c => c.id === 'restaurants')!,
  ALL_CATEGORIES.find(c => c.id === 'accommodation')!,
  ALL_CATEGORIES.find(c => c.id === 'pubs')!,
  ALL_CATEGORIES.find(c => c.id === 'shopping')!,
  ALL_CATEGORIES.find(c => c.id === 'photoshoot')!,
  ALL_CATEGORIES.find(c => c.id === 'theatres')!,
  ALL_CATEGORIES.find(c => c.id === 'adventure')!,
  ALL_CATEGORIES.find(c => c.id === 'nightlife')!,
  ALL_CATEGORIES.find(c => c.id === 'nature')!,
];

// Featured categories for Explore screen
export const FEATURED_CATEGORIES: Category[] = [
  ALL_CATEGORIES.find(c => c.id === 'temples')!,
  ALL_CATEGORIES.find(c => c.id === 'beaches')!,
  ALL_CATEGORIES.find(c => c.id === 'restaurants')!,
  ALL_CATEGORIES.find(c => c.id === 'adventure')!,
  ALL_CATEGORIES.find(c => c.id === 'nature')!,
  ALL_CATEGORIES.find(c => c.id === 'nightlife')!,
];

// Get category by ID
export const getCategoryById = (id: string): Category | SubCategory | undefined => {
  // Check main categories
  const mainCategory = ALL_CATEGORIES.find(c => c.id === id);
  if (mainCategory) return mainCategory;
  
  // Check subcategories
  for (const category of ALL_CATEGORIES) {
    if (category.subcategories) {
      const subCategory = category.subcategories.find(s => s.id === id);
      if (subCategory) return subCategory;
    }
  }
  
  return undefined;
};

// Get all flat categories (including subcategories)
export const getAllFlatCategories = (): (Category | SubCategory)[] => {
  const flat: (Category | SubCategory)[] = [];
  
  for (const category of ALL_CATEGORIES) {
    flat.push(category);
    if (category.subcategories) {
      flat.push(...category.subcategories);
    }
  }
  
  return flat;
};

// Get parent category for a subcategory
export const getParentCategory = (subcategoryId: string): Category | undefined => {
  for (const category of ALL_CATEGORIES) {
    if (category.subcategories) {
      const found = category.subcategories.find(s => s.id === subcategoryId);
      if (found) return category;
    }
  }
  return undefined;
};
