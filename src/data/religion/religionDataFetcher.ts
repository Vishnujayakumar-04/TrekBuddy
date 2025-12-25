// Static imports for local JSON files
import hinduTemplesData from './hindu-temples.json';
import christianChurchesData from './christian-churches.json';
import muslimMosquesData from './muslim-mosques.json';
import jainTemplesData from './jain-temples.json';
import buddhistTemplesData from './buddhist-temples.json';

/**
 * Religion Data Fetcher - Local JSON only
 */

export type ReligionCategory = 
  | 'hindu-temples'
  | 'christian-churches'
  | 'muslim-mosques'
  | 'jain-temples'
  | 'buddhist-temples';

export type ReligionType = 'Hindu' | 'Christian' | 'Muslim' | 'Jain' | 'Buddhist';

export type HinduSubType = 
  | 'Ganesh Temples'
  | 'Murugan Temples'
  | 'Shiva Temples'
  | 'Amman Temples'
  | 'Perumal / Vishnu Temples'
  | 'Ayyanar / Village Guardian Deities'
  | 'Navagraha Temples'
  | 'Saibaba Temples'
  | 'Other Hindu Deities';

export type ChristianSubType = 
  | 'Churches'
  | 'Cathedrals'
  | 'Basilicas'
  | 'Chapels'
  | 'Shrines'
  | 'Convents';

export type MuslimSubType = 
  | 'Mosques'
  | 'Dargahs'
  | 'Islamic Prayer Centres';

export type JainSubType = 
  | 'Jain Temples'
  | 'Jain Derasar';

export type BuddhistSubType = 
  | 'Buddhist Temples'
  | 'Meditation Centres'
  | 'Monasteries';

export type SubType = HinduSubType | ChristianSubType | MuslimSubType | JainSubType | BuddhistSubType;

export interface ReligionPlace {
  id: string;
  name: string; // English (default)
  // Multi-language support
  nameTamil?: string; // தமிழ்
  nameHindi?: string; // हिंदी
  nameTelugu?: string; // తెలుగు
  nameMalayalam?: string; // മലയാളം
  nameKannada?: string; // ಕನ್ನಡ
  nameFrench?: string; // Français
  religion: ReligionType;
  subType: SubType;
  mainDeity: string; // Main Deity / Patron
  location: string; // Location / Area Name
  address: string;
  mapsUrl: string; // Google Maps Link
  openingTimeWeekdays: string;
  closingTimeWeekdays: string;
  openingTimeWeekends: string;
  closingTimeWeekends: string;
  description: string; // Detailed Description / History (English - default)
  // Multi-language descriptions
  descriptionTamil?: string; // தமிழ்
  descriptionHindi?: string; // हिंदी
  descriptionTelugu?: string; // తెలుగు
  descriptionMalayalam?: string; // മലയാളം
  descriptionKannada?: string; // ಕನ್ನಡ
  descriptionFrench?: string; // Français
  images: string[]; // Array of image URLs (minimum 2-3)
  entryFee: string; // Usually "Free"
  dressCode: string; // Dress Code
  phoneNumber: string; // Phone Number (MANDATORY)
  crowdLevel: 'Low' | 'Medium' | 'High';
  famousMonths: string; // Famous Month(s) in English + Tamil
  specialOccasions: string; // Special Occasions / Festivals
  rating: number | null;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Static data map
const localDataMap: Record<ReligionCategory, any[]> = {
  'hindu-temples': hinduTemplesData || [],
  'christian-churches': christianChurchesData || [],
  'muslim-mosques': muslimMosquesData || [],
  'jain-temples': jainTemplesData || [],
  'buddhist-temples': buddhistTemplesData || [],
};

/**
 * Get religion data from local JSON
 */
export async function getReligionData(category: ReligionCategory): Promise<ReligionPlace[]> {
  try {
    const data = localDataMap[category];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn(`Failed to load ${category} data:`, error);
    return [];
  }
}

/**
 * Get all religion categories data (mixed together)
 */
export async function getAllReligionData(): Promise<ReligionPlace[]> {
  const categories: ReligionCategory[] = [
    'hindu-temples',
    'christian-churches',
    'muslim-mosques',
    'jain-temples',
    'buddhist-temples',
  ];

  const allPlaces: ReligionPlace[] = [];

  for (const category of categories) {
    try {
      const data = await getReligionData(category);
      allPlaces.push(...data);
    } catch (error) {
      console.warn(`Failed to load ${category}:`, error);
    }
  }

  // Sort by popularity (rating) - highest first
  return allPlaces.sort((a, b) => {
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;
    return ratingB - ratingA;
  });
}

/**
 * Get sub-types for a religion
 */
export function getSubTypesForReligion(religion: ReligionType): SubType[] {
  switch (religion) {
    case 'Hindu':
      return [
        'Ganesh Temples',
        'Murugan Temples',
        'Shiva Temples',
        'Amman Temples',
        'Perumal / Vishnu Temples',
        'Ayyanar / Village Guardian Deities',
        'Navagraha Temples',
        'Saibaba Temples',
        'Other Hindu Deities',
      ];
    case 'Christian':
      return [
        'Churches',
        'Cathedrals',
        'Basilicas',
        'Chapels',
        'Shrines',
        'Convents',
      ];
    case 'Muslim':
      return [
        'Mosques',
        'Dargahs',
        'Islamic Prayer Centres',
      ];
    case 'Jain':
      return [
        'Jain Temples',
        'Jain Derasar',
      ];
    case 'Buddhist':
      return [
        'Buddhist Temples',
        'Meditation Centres',
        'Monasteries',
      ];
    default:
      return [];
  }
}
