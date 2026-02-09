import { collection, doc, writeBatch, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TransitItem {
    id: string;
    category: 'rentals' | 'cabs' | 'bus' | 'train';
    subCategory?: string; // 'bike', 'scooty', 'car', 'cycle', 'auto', 'city-taxi', 'local', 'interstate', 'express', etc.
    type?: string;
    name: string;
    description?: string;
    price?: string;
    availability?: string;
    image?: string;
    rating?: number;
    contact?: string;
    location?: string;
    // Bus/Train specific fields
    from?: string;
    to?: string;
    via?: string[];
    frequency?: string;
    duration?: string;
    stops?: number;
    classes?: string[];
    departure?: string;
    arrival?: string;
    number?: string;
    // Cabs specific
    baseRate?: string;
    perKm?: string;
    bookingMethod?: string;
    tips?: string;
    specialty?: string;
    // Train Station
    code?: string;
    address?: string;
    facilities?: string[];
}

export const SEED_DATA: TransitItem[] = [
    // --- RENTALS ---
    {
        id: 'r1', category: 'rentals', subCategory: 'Bike', name: 'Vijay Bike Rentals',
        rating: 4.8, price: '₹350/day', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=60',
        contact: '+91 99999 99999', location: 'Mission Street'
    },
    {
        id: 'r2', category: 'rentals', subCategory: 'Scooty', name: 'Pondy Wheels',
        rating: 4.5, price: '₹400/day', image: 'https://images.unsplash.com/photo-1582255655519-7b3b6f0430f8?w=500&auto=format&fit=crop&q=60',
        contact: '+91 88888 88888', location: 'Heritage Town'
    },
    {
        id: 'r3', category: 'rentals', subCategory: 'Bike', name: 'Royal Brothers',
        rating: 4.9, price: '₹600/day', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84f3d?w=500&auto=format&fit=crop&q=60',
        contact: '+91 77777 77777', location: 'MG Road'
    },
    {
        id: 'r4', category: 'rentals', subCategory: 'Car', name: 'ZoomCar Self Drive',
        rating: 4.6, price: '₹2500/day', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop&q=60',
        contact: 'App Only', location: 'Lawspet'
    },
    {
        id: 'r5', category: 'rentals', subCategory: 'Cycle', name: 'Green Ride Cycles',
        rating: 4.7, price: '₹100/day', image: 'https://images.unsplash.com/photo-1485965120184-e224f7a1dbfe?w=500&auto=format&fit=crop&q=60',
        contact: '+91 66666 66666', location: 'White Town'
    },

    // --- CABS (Types) ---
    {
        id: 'c1', category: 'cabs', type: 'service', name: 'Auto Rickshaw',
        description: 'Classic three-wheeler for short trips',
        baseRate: '₹30', perKm: '₹15/km', availability: '24/7', bookingMethod: 'Hail on street or call', tips: 'Negotiate fare before starting.',
        image: '🛺' // Using emoji as icon placeholder
    },
    {
        id: 'c2', category: 'cabs', type: 'service', name: 'Bike Taxi',
        description: 'Quick two-wheeler rides',
        baseRate: '₹20', perKm: '₹10/km', availability: '6 AM - 11 PM', bookingMethod: 'Rapido app or local stands', tips: 'Helmets provided.',
        image: '🏍️'
    },
    {
        id: 'c3', category: 'cabs', type: 'service', name: 'City Taxi / Cab',
        description: 'Comfortable car rides',
        baseRate: '₹100', perKm: '₹18/km', availability: '24/7', bookingMethod: 'Call local operators', tips: 'AC cabs available.',
        image: '🚕'
    },
    // --- CABS (Operators) ---
    { id: 'co1', category: 'cabs', type: 'operator', name: 'Pondy Cabs', contact: '+91 9876543210', specialty: 'Airport transfers' },
    { id: 'co2', category: 'cabs', type: 'operator', name: 'French Town Autos', contact: '+91 9876543211', specialty: 'City tours' },
    { id: 'co3', category: 'cabs', type: 'operator', name: 'Auroville Taxi Service', contact: '+91 9876543212', specialty: 'Auroville trips' },

    // --- BUS ---
    {
        id: 'b1', category: 'bus', subCategory: 'local', name: 'New Bus Stand to Gorimedu',
        from: 'New Bus Stand', to: 'Gorimedu', via: ['Jipmer', 'Lawspet'], frequency: '10 mins'
    },
    {
        id: 'b2', category: 'bus', subCategory: 'local', name: 'New Bus Stand to Jipmer',
        from: 'New Bus Stand', to: 'Jipmer', via: ['IG Square'], frequency: '15 mins'
    },
    {
        id: 'b3', category: 'bus', subCategory: 'local', name: 'Old Bus Stand to Ariyankuppam',
        from: 'Old Bus Stand', to: 'Ariyankuppam', via: ['Mission St'], frequency: '12 mins'
    },
    {
        id: 'b4', category: 'bus', subCategory: 'local', name: 'Muthialpet to Railway Station',
        from: 'Muthialpet', to: 'Railway Station', via: ['Gandhi Beach'], frequency: '20 mins'
    },
    {
        id: 'b5', category: 'bus', subCategory: 'interstate', name: 'Puducherry to Chennai (ECR)',
        from: 'New Bus Stand', to: 'Chennai (CMBT)', via: ['ECR', 'Mahabalipuram'], frequency: '15 mins', duration: '3.5 hrs'
    },
    {
        id: 'b6', category: 'bus', subCategory: 'interstate', name: 'Puducherry to Bangalore',
        from: 'New Bus Stand', to: 'Bangalore (Majestic)', via: ['Tiruvannamalai'], frequency: 'Hourly', duration: '7 hrs'
    },
    {
        id: 'b7', category: 'bus', subCategory: 'interstate', name: 'Puducherry to Villupuram',
        from: 'New Bus Stand', to: 'Villupuram', via: ['Ariyur'], frequency: '10 mins', duration: '1 hr'
    },

    // --- TRAIN ---
    {
        id: 't1', category: 'train', type: 'route', name: 'Puducherry Express', number: '16115/16116',
        from: 'Puducherry', to: 'Chennai Egmore', departure: '06:05 AM', arrival: '09:45 AM',
        duration: '3h 40m', frequency: 'Daily', classes: ['2S', 'CC', 'SL'], subCategory: 'Express'
    },
    {
        id: 't2', category: 'train', type: 'route', name: 'Villupuram Passenger', number: '76851/76852',
        from: 'Puducherry', to: 'Villupuram Junction', departure: '05:45 AM', arrival: '06:45 AM',
        duration: '1h', frequency: 'Daily', classes: ['2S'], subCategory: 'Passenger'
    },
    {
        id: 't3', category: 'train', type: 'route', name: 'Mumbai Express', number: '16352',
        from: 'Puducherry', to: 'Mumbai CST', departure: '11:30 AM', arrival: 'Next day 05:00 AM',
        duration: '17h 30m', frequency: 'Weekly (Wed)', classes: ['2A', '3A', 'SL'], subCategory: 'Express'
    },
    {
        id: 't4', category: 'train', type: 'route', name: 'Bangalore Express', number: '16525/16526',
        from: 'Puducherry', to: 'KSR Bangalore', departure: '09:00 PM', arrival: 'Next day 06:30 AM',
        duration: '9h 30m', frequency: 'Daily', classes: ['2A', '3A', 'SL', '2S'], subCategory: 'Express'
    },
    {
        id: 'ts1', category: 'train', type: 'station', name: 'Puducherry Railway Station',
        code: 'PDY', address: 'Railway Station Road, near Botanical Garden', facilities: ['Waiting Room', 'Ticket Counter', 'Parking', 'Tea Stall']
    }
];

export async function seedTransitData(): Promise<void> {
    try {
        const transitRef = collection(db, 'transit');
        // Check if data exists
        const q = query(transitRef, where('category', 'in', ['rentals', 'cabs', 'bus', 'train']));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            console.log('Transit data already exists, skipping seed.');
            return;
        }

        console.log('Seeding transit data...');

        // Chunk logic for batch limits (though SEED_DATA is small, robust code handles >500)
        const CHUNK_SIZE = 450;
        for (let i = 0; i < SEED_DATA.length; i += CHUNK_SIZE) {
            const chunk = SEED_DATA.slice(i, i + CHUNK_SIZE);
            const batch = writeBatch(db);

            chunk.forEach((item) => {
                const docRef = doc(transitRef, item.id);
                batch.set(docRef, item);
            });

            await batch.commit();
            console.log(`Seeded batch ${i / CHUNK_SIZE + 1}`);
        }

        console.log('Transit data seeded successfully!');
    } catch (error) {
        console.error('Error seeding transit data:', error);
        throw error;
    }
}
