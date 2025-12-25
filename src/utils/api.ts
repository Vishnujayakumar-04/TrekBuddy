// Static imports for JSON data
// Main categories
import beachesData from '../data/beaches.json';
import templesData from '../data/temples.json';
import restaurantsData from '../data/restaurants.json';
import parksData from '../data/parks.json';
import hotelsData from '../data/hotels.json';
import pubsData from '../data/pubs.json';
import shoppingData from '../data/shopping.json';
import photoshootData from '../data/photoshoot.json';
import theatresData from '../data/theatres.json';
import busRoutesData from '../data/busRoutes.json';
import cabServicesData from '../data/cabServices.json';
import famousPlacesData from '../data/famous-places.json';

// Religious categories
import hinduTemplesData from '../data/religion/hindu-temples.json';
import churchesData from '../data/religion/christian-churches.json';
import mosquesData from '../data/religion/muslim-mosques.json';
import jainTemplesData from '../data/religion/jain-temples.json';
import buddhistTemplesData from '../data/religion/buddhist-temples.json';

// Adventure categories
import adventureData from '../data/adventure.json';
import trekkingData from '../data/trekking.json';
import cyclingData from '../data/cycling.json';
import boatingData from '../data/boating.json';
import kayakingData from '../data/kayaking.json';
import surfingData from '../data/surfing.json';

// Transport categories
import transportData from '../data/transport.json';
import autoFareData from '../data/auto-fare.json';
import rentalsData from '../data/rentals.json';
import shareAutoData from '../data/shareAuto.json';

// Emergency categories
import emergencyData from '../data/emergency.json';
import hospitalsData from '../data/hospitals.json';
import policeData from '../data/police.json';
import fireData from '../data/fire.json';
import pharmaciesData from '../data/pharmacies.json';

// Map category keys to imported data
const localDataMap: { [key: string]: any[] } = {
  // Main categories
  beaches: beachesData,
  temples: templesData,
  restaurants: restaurantsData,
  parks: parksData,
  hotels: hotelsData,
  pubs: pubsData,
  shopping: shoppingData,
  photoshoot: photoshootData,
  theatres: theatresData,
  busroutes: busRoutesData,
  cabservices: cabServicesData,
  'famous-places': famousPlacesData,
  // Religious
  'hindu-temples': hinduTemplesData,
  churches: churchesData,
  mosques: mosquesData,
  'jain-temples': jainTemplesData,
  'buddhist-temples': buddhistTemplesData,
  // Adventure
  adventure: adventureData,
  trekking: trekkingData,
  cycling: cyclingData,
  boating: boatingData,
  kayaking: kayakingData,
  surfing: surfingData,
  // Transport
  transport: transportData,
  'auto-fare': autoFareData,
  rentals: rentalsData,
  shareauto: shareAutoData,
  // Emergency
  emergency: emergencyData,
  hospitals: hospitalsData,
  police: policeData,
  fire: fireData,
  pharmacies: pharmaciesData,
};

// TypeScript Interfaces
export interface Place {
  id: string;
  name: string;
  image: string;
  description: string;
  opening: string;
  entryFee: string;
  rating: number;
  mapUrl: string;
  phone?: string;
  category?: string;
}

/**
 * Maps UI category labels to internal category keys
 */
export const getCategoryKey = (label: string): string => {
  const normalized = label.toLowerCase().trim();
  
  const mapping: { [key: string]: string } = {
    'dining': 'restaurants',
    'beaches': 'beaches',
    'temples': 'temples',
    'parks': 'parks',
    'hotels': 'hotels',
    'hotels & resorts': 'hotels',
    'pubs': 'pubs',
    'pubs & nightlife': 'pubs',
    'shopping': 'shopping',
    'photoshoot': 'photoshoot',
    'photoshoot spots': 'photoshoot',
    'theatres': 'theatres',
    'theaters': 'theatres',
    'bus routes': 'busroutes',
    'cab services': 'cabservices',
    'religious': 'temples',
    'hindu temples': 'hindu-temples',
    'churches': 'churches',
    'mosques': 'mosques',
    'jain temples': 'jain-temples',
    'buddhist temples': 'buddhist-temples',
    'adventure': 'adventure',
    'trekking': 'trekking',
    'cycling': 'cycling',
    'boating': 'boating',
    'kayaking': 'kayaking',
    'surfing': 'surfing',
    'transport': 'transport',
    'auto fare': 'auto-fare',
    'rentals': 'rentals',
    'shareauto': 'shareauto',
    'share auto': 'shareauto',
    'emergency': 'emergency',
    'hospitals': 'hospitals',
    'police': 'police',
    'fire': 'fire',
    'fire station': 'fire',
    'pharmacies': 'pharmacies',
    'pharmacy': 'pharmacies',
    'famous places': 'famous-places',
  };
  
  if (mapping[normalized]) {
    return mapping[normalized];
  }
  
  return normalized.replace(/\s+/g, '');
};

/**
 * Get places by category from local JSON data
 */
export const getCategoryData = async (category: string): Promise<Place[]> => {
  try {
    const categoryKey = getCategoryKey(category);
    const data = localDataMap[categoryKey] || [];
    
    return (data || []).map((item: any) => ({
      id: item.id || Math.random().toString(),
      name: item.name || '',
      image: item.image || item.cover_image || '',
      description: item.description || '',
      opening: item.opening || item.opening_time || '',
      entryFee: item.entryFee || item.entry_fee || 'Free',
      rating: item.rating || 0,
      mapUrl: item.mapUrl || item.maps_url || '',
      phone: item.phone,
      category: categoryKey,
    }));
  } catch (error) {
    console.error('Error loading category data:', error);
    return [];
  }
};

/**
 * Get all places from local JSON data
 */
export const getAllPlaces = async (): Promise<Place[]> => {
  try {
    const categories = ['beaches', 'temples', 'restaurants', 'parks', 'hotels', 'pubs', 'shopping', 'photoshoot', 'theatres'];
    const allPlaces: Place[] = [];

    for (const category of categories) {
      const data = localDataMap[category] || [];
        const places = (data || []).map((item: any) => ({
          id: item.id || Math.random().toString(),
          name: item.name || '',
        image: item.image || item.cover_image || '',
          description: item.description || '',
          opening: item.opening || item.opening_time || '',
          entryFee: item.entryFee || item.entry_fee || 'Free',
          rating: item.rating || 0,
          mapUrl: item.mapUrl || item.maps_url || '',
          phone: item.phone,
          category: category,
        }));
        allPlaces.push(...places);
    }

    return allPlaces;
  } catch (error) {
    console.error('Error loading places:', error);
    return [];
  }
};

/**
 * Search places by query
 */
export const searchPlaces = async (query: string): Promise<Place[]> => {
  const allPlaces = await getAllPlaces();
  const lowerQuery = query.toLowerCase();
  return allPlaces.filter(place => 
    place.name.toLowerCase().includes(lowerQuery) ||
    place.description.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get place by ID
 */
export const getPlaceById = async (id: string): Promise<Place | null> => {
  const allPlaces = await getAllPlaces();
  return allPlaces.find(place => place.id === id) || null;
};
