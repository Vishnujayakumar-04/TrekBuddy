'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
import { PlaceCard } from '@/components/PlaceCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

// Mock data (replace with Firebase call later)
const MOCK_PLACES = [
    { id: '1', name: 'Promenade Beach', category: 'beaches', location: 'White Town', rating: 4.5, image: '/images/promenade.jpg' },
    { id: '2', name: 'Paradise Beach', category: 'beaches', location: 'Chunnambar', rating: 4.7, image: '/images/paradise.jpg' },
    { id: '3', name: 'Manakula Vinayagar Temple', category: 'temples', location: 'White Town', rating: 4.8, image: '/images/temple.jpg' },
    { id: '4', name: 'Auroville', category: 'places', location: 'Villupuram', rating: 4.6, image: '/images/auroville.jpg' },
];

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function CategoryDetailPage({ params }: PageProps) {
    const { id } = use(params);

    // In a real app, fetch category details and places from Firebase here based on `id`
    const categoryName = id.charAt(0).toUpperCase() + id.slice(1);
    const places = MOCK_PLACES.filter(p => p.category === id || id === 'places'); // Simple filter logic

    return (
        <div className="container py-8">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/categories">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{categoryName}</h1>
                    <p className="text-muted-foreground">{places.length} places found</p>
                </div>
            </div>

            {places.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {places.map((place) => (
                        <PlaceCard
                            key={place.id}
                            id={place.id}
                            name={place.name}
                            category={place.category}
                            location={place.location}
                            rating={place.rating}
                            image={place.image}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-muted-foreground">
                    <p>No places found in this category yet.</p>
                    <Button variant="link" asChild className="mt-4">
                        <Link href="/dashboard/categories">Browse other categories</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
