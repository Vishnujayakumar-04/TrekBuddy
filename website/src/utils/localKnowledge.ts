import knowledgeBase from '@/data/puducherry_knowledge.json';

const KEYWORDS_MAP: Record<string, string[]> = {
    'history': ['history', 'independence', 'french', '1947', '1954', 'goubert', 'politics'],
    'geography': ['geography', 'districts', 'karaikal', 'mahe', 'yanam', 'climate', 'weather', 'rain', 'summer', 'winter'],
    'culture': ['culture', 'festival', 'pongal', 'bastille', 'language', 'tamil', 'creole'],
    'food': ['food', 'cuisine', 'dish', 'eat', 'restaurant', 'cafe', 'breakfast', 'dinner', 'lunch', 'croissant', 'biryani'],
    'tourism': ['tourist', 'place', 'visit', 'sightseeing', 'landmark', 'beach', 'ashram', 'auroville', 'temple', 'church', 'mosque', 'museum'],
    'transport': ['transport', 'bus', 'train', 'flight', 'airport', 'taxi', 'auto', 'rent', 'bike']
};

export function getLocalResponse(query: string): string | null {
    const lowerQuery = query.toLowerCase();

    // 1. Check for specific landmarks (Direct lookup)
    const landmarks = knowledgeBase.tourism.landmarks;
    const foundLandmark = landmarks.find(l => lowerQuery.includes(l.name.toLowerCase()));
    if (foundLandmark) {
        return `${foundLandmark.name} (${foundLandmark.type}): ${foundLandmark.desc}`;
    }

    // 2. Check for keywords to route to sections
    for (const [category, keywords] of Object.entries(KEYWORDS_MAP)) {
        if (keywords.some(k => lowerQuery.includes(k))) {
            if (category === 'history') {
                return `Here's a brief history: Puducherry became a Union Territory in 1963 after de facto transfer from France in 1954. The first CM was Edouard Goubert. It has a unique political history involving the 1962 Treaty of Cession.`;
            }
            if (category === 'geography') {
                return `Puducherry has 4 districts: Puducherry, Karaikal, Mahe, and Yanam. The best time to visit is October to March (Winter). Summer can be hot (up to 40°C).`;
            }
            if (category === 'culture') {
                return `Puducherry has a Franco-Tamil culture. Major festivals include Pongal (Jan) and Bastille Day (July 14). Languages spoken are Tamil, English, and French.`;
            }
            if (category === 'food') {
                return `You must try French dishes like Quiche and Croissants, and Tamil dishes like Mutton Biryani. A unique local dish is the 'Puducherry Fish Curry'.`;
            }
            if (category === 'tourism') {
                return `Top places to visit: Promenade Beach, Auroville, Sri Aurobindo Ashram, Paradise Beach, and White Town. Don't miss the Manakula Vinayagar Temple!`;
            }
            if (category === 'transport') {
                return `You can reach by Bus (PRTC), Train (Puducherry Station), or Flight (Bengaluru/Hyderabad connection). Within the city, renting a bike (scooty) is the best option.`;
            }
        }
    }

    return null;
}
