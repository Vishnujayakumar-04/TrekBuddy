import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TransitItem } from '@/utils/seedTransitData';

export async function getTransitItems(category: string): Promise<TransitItem[]> {
    try {
        const transitRef = collection(db, 'transit');
        const q = query(transitRef, where('category', '==', category));

        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as TransitItem));
    } catch (error) {
        console.error(`Error fetching transit category [${category}]:`, error);
        throw error;
    }
}

export { seedTransitData } from '@/utils/seedTransitData';
