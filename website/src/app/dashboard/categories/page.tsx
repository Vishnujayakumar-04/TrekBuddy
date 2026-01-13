'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
    Umbrella, AlertTriangle, TreePine, Moon, MapPin,
    Utensils, Hotel, ShoppingBag, Clapperboard, Bus
} from 'lucide-react';

export default function CategoriesPage() {
    const categories = [
        { id: 'beaches', name: 'Beaches', icon: Umbrella, color: 'text-blue-500', desc: 'Sun, sand, and sea' },
        { id: 'temples', name: 'Temples', icon: '🛕', color: 'text-orange-500', desc: 'Spiritual heritage' },
        { id: 'churches', name: 'Churches', icon: '⛪', color: 'text-blue-600', desc: 'French architecture' },
        { id: 'museums', name: 'Museums', icon: '🏛️', color: 'text-amber-700', desc: 'History & Culture' },
        { id: 'parks', name: 'Parks & Gardens', icon: TreePine, color: 'text-green-500', desc: 'Nature & Relaxation' },
        { id: 'heritage', name: 'Heritage Sites', icon: '🏰', color: 'text-yellow-600', desc: 'Colonial buildings' },
        { id: 'restaurants', name: 'Restaurants', icon: Utensils, color: 'text-red-500', desc: 'Local & French cuisine' },
        { id: 'hotels', name: 'Hotels', icon: Hotel, color: 'text-purple-500', desc: 'Comfortable stays' },
        { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'text-pink-500', desc: 'Souvenirs & more' },
        { id: 'nightlife', name: 'Nightlife', icon: Moon, color: 'text-indigo-500', desc: 'Pubs & Bars' },
        { id: 'adventure', name: 'Adventure', icon: MapPin, color: 'text-orange-600', desc: 'Be active' },
        { id: 'theatres', name: 'Theatres', icon: Clapperboard, color: 'text-red-600', desc: 'Movies & Entertainment' },
        { id: 'transport', name: 'Transport', icon: Bus, color: 'text-blue-400', desc: 'Getting around' },
        { id: 'emergency', name: 'Emergency', icon: AlertTriangle, color: 'text-red-700', desc: 'Important contacts' },
    ];

    return (
        <div className="container py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Categories</h1>
                <p className="text-muted-foreground">Explore Puducherry by category</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <Link key={cat.id} href={`/dashboard/categories/${cat.id}`}>
                        <Card className="h-full hover:shadow-md hover:border-primary transition-all cursor-pointer group">
                            <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                                <div className={`text-4xl group-hover:scale-110 transition-transform ${cat.color} p-4 bg-muted/50 rounded-full`}>
                                    {typeof cat.icon === 'string' ? cat.icon : <cat.icon className="w-8 h-8" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{cat.name}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{cat.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
