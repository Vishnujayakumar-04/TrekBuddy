/**
 * Data Loader Utility
 * Functions to load and manage JSON data for categories and places
 */

// Category to JSON file mapping
const categoryFileMap = {
  beaches: () => import('../data/beaches.json'),
  parks: () => import('../data/parks.json'),
  temples: () => import('../data/temples.json'),
  restaurants: () => import('../data/restaurants.json'),
  nature: () => import('../data/nature.json'),
  photoshoot: () => import('../data/photoshoot.json'),
  pubs: () => import('../data/pubs.json'),
  transport: () => import('../data/transport.json'),
  emergency: () => import('../data/emergency.json'),
  accommodation: () => import('../data/accommodation.json'),
  adventure: () => import('../data/adventure.json'),
  shopping: () => import('../data/shopping.json'),
  theatres: () => import('../data/theatres.json'),
  nightlife: () => import('../data/nightlife.json'),
  // Religion subcategories
  'hindu-temples': () => import('../data/religion/hindu-temples.json'),
  'christian-churches': () => import('../data/religion/christian-churches.json'),
  'muslim-mosques': () => import('../data/religion/muslim-mosques.json'),
  'jain-temples': () => import('../data/religion/jain-temples.json'),
  'buddhist-temples': () => import('../data/religion/buddhist-temples.json'),
};

/**
 * Load data for a specific category
 * @param {string} categoryName - Category ID (e.g., 'beaches', 'parks')
 * @returns {Promise<Array>} Array of places
 */
export async function loadCategoryData(categoryName) {
  try {
    const loader = categoryFileMap[categoryName];
    if (!loader) {
      console.warn(`No data file found for category: ${categoryName}`);
      return [];
    }
    
    const module = await loader();
    const data = module.default || module;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error loading data for ${categoryName}:`, error);
    return [];
  }
}

/**
 * Get all places from all categories
 * @returns {Promise<Array>} Array of all places with category info
 */
export async function getAllPlaces() {
  const allPlaces = [];
  const categories = Object.keys(categoryFileMap);
  
  for (const category of categories) {
    try {
      const places = await loadCategoryData(category);
      const placesWithCategory = places.map(place => ({
        ...place,
        categoryId: category,
      }));
      allPlaces.push(...placesWithCategory);
    } catch (error) {
      console.error(`Error loading places for ${category}:`, error);
    }
  }
  
  return allPlaces;
}

/**
 * Search places by query string
 * @param {string} query - Search query
 * @param {Array} places - Array of places to search (optional, will load all if not provided)
 * @returns {Promise<Array>} Filtered array of places
 */
export async function searchPlaces(query, places = null) {
  if (!query || query.trim() === '') {
    return places || await getAllPlaces();
  }
  
  const searchQuery = query.toLowerCase().trim();
  const placesToSearch = places || await getAllPlaces();
  
  return placesToSearch.filter(place => {
    const name = (place.name || '').toLowerCase();
    const description = (place.description?.nameOrigin || place.description || '').toLowerCase();
    const location = (place.location || '').toLowerCase();
    const type = (place.type || '').toLowerCase();
    
    return (
      name.includes(searchQuery) ||
      description.includes(searchQuery) ||
      location.includes(searchQuery) ||
      type.includes(searchQuery)
    );
  });
}

/**
 * Get a single place by ID
 * @param {string} placeId - Place ID
 * @returns {Promise<Object|null>} Place object or null
 */
export async function getPlaceById(placeId) {
  const allPlaces = await getAllPlaces();
  return allPlaces.find(place => place.id === placeId) || null;
}

/**
 * Get places by category
 * @param {string} categoryName - Category ID
 * @returns {Promise<Array>} Array of places in the category
 */
export async function getPlacesByCategory(categoryName) {
  return await loadCategoryData(categoryName);
}

/**
 * Get featured/random places
 * @param {number} count - Number of places to return
 * @returns {Promise<Array>} Array of featured places
 */
export async function getFeaturedPlaces(count = 6) {
  const allPlaces = await getAllPlaces();
  // Filter places with ratings or images
  const featured = allPlaces.filter(place => place.rating || place.image);
  // Shuffle and return top N
  const shuffled = featured.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

