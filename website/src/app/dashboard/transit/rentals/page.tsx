
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

// Mock Data (In production, fetch from Firestore 'transit_services' collection)
const RENTAL_PROVIDERS = [
    {
        id: '1',
        name: 'Vijay Bike Rentals',
        type: 'Bike',
        rating: 4.8,
        price: '₹350/day',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=60',
        contact: '+91 98765 43210',
        location: 'Mission Street'
    },
    {
        id: '2',
        name: 'Pondy Wheels',
        type: 'Scooty',
        rating: 4.5,
        price: '₹400/day',
        image: 'https://images.unsplash.com/photo-1582255655519-7b3b6f0430f8?w=500&auto=format&fit=crop&q=60',
        contact: '+91 98765 12345',
        location: 'Heritage Town'
    },
    {
        id: '3',
        name: 'Royal Brothers',
        type: 'Bike',
        rating: 4.9,
        price: '₹600/day',
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84f3d?w=500&auto=format&fit=crop&q=60',
        contact: '+91 91234 56789',
        location: 'MG Road'
    },
    {
        id: '4',
        name: 'ZoomCar Self Drive',
        type: 'Car',
        rating: 4.6,
        price: '₹2500/day',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop&q=60',
        contact: 'App Only',
        location: 'Lawspet'
    },
    {
        id: '5',
        name: 'Green Ride Cycles',
        type: 'Cycle',
        rating: 4.7,
        price: '₹100/day',
        image: 'https://images.unsplash.com/photo-1485965120184-e224f7a1dbfe?w=500&auto=format&fit=crop&q=60',
        contact: '+91 99887 77665',
        location: 'White Town'
    }
];

export default function RentalsPage() {
    const [filter, setFilter] = useState('All');

    const filteredProviders = filter === 'All'
        ? RENTAL_PROVIDERS
        : RENTAL_PROVIDERS.filter(p => p.type === filter);

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
            <DashboardHeader
                title="Vehicle Rentals"
                subtitle="Self-drive bikes, scooters & cars"
                backHref="/dashboard/transit"
                backLabel="Transit"
            />

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {['All', 'Bike', 'Scooty', 'Car', 'Cycle'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filter === type
                            ? 'bg-slate-900 text-white shadow-lg'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider) => (
                    <Card key={provider.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800 group">
                        <div className="relative h-48 bg-slate-100">
                            <Image
                                src={provider.image}
                                alt={provider.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* <Image src={provider.image} alt={provider.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> */}
                            {/* Using img for external unsplash images if not configured in next.config.ts, but standard practice is Image. 
                                Since current config has hostname '**', Image is fine. But to be safe and quick, I will just suppress lint or use Image. 
                                Let's use Image and assume config works (I saw it). */}
                            {/* <Image 
                                src={provider.image} 
                                alt={provider.name} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            /> */}
                            {/* Wait, using Image might break if domains aren't perfect. I'll stick to img with suppression or just leave it if I can't verify config easily. 
                                Actually, I modified config to allow '**', so Image is safe. */}
                            {/* <Image ... />  Wait, I need to look at lines again. */}
                            {/* The previous edit failed to get the line right? No, I am editing rentals page now. */}
                            {/* Let's use standard img with warning suppression comments for now to be safe against hydration errors if dimensions missing. */}
                            {/* Actually, user wanted to fix errors. Lint error was: Using `<img>`. */}
                            {/* So I MUST use Next/Image. */}
                            {/* I need to import Image first! */}
                            <Badge className="absolute top-3 right-3 bg-white/90 text-slate-900 backdrop-blur-md shadow-sm">
                                ⭐ {provider.rating}
                            </Badge>
                        </div>
                        <CardContent className="p-5 space-y-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{provider.name}</h3>
                                <div className="flex items-center text-slate-500 text-sm mt-1">
                                    <MapPin className="w-3.5 h-3.5 mr-1 text-cyan-500" />
                                    {provider.location}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Price</span>
                                    <span className="font-bold text-cyan-600 flex items-center">
                                        {provider.price}
                                    </span>
                                </div>
                                <Button size="sm" className="rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-md">
                                    <Phone className="w-3.5 h-3.5 mr-2" />
                                    Call Now
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
