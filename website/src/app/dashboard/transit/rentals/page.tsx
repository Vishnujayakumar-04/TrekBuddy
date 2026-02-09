'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { getTransitItems } from '@/services/transitService';
import { TransitItem } from '@/utils/seedTransitData';

export default function RentalsPage() {
    const [providers, setProviders] = useState<TransitItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const data = await getTransitItems('rentals');
                setProviders(data);
                setError(null);
            } catch (err: unknown) {
                console.error("Failed to load rentals:", err);
                setError("Failed to load rentals. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const filteredProviders = filter === 'All'
        ? providers
        : providers.filter(p => p.subCategory === filter);

    const categories = ['All', 'Bike', 'Scooty', 'Car', 'Cycle'];

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
                {categories.map((type) => (
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

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                    <span className="ml-2 text-slate-500">Loading rentals...</span>
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-500">{error}</div>
            ) : filteredProviders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProviders.map((provider) => (
                        <Card key={provider.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800 group">
                            <div className="relative h-48 bg-slate-100">
                                {provider.image ? (
                                    <Image
                                        src={provider.image}
                                        alt={provider.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        unoptimized // Using external images without domain config might break, so unoptimized is safer for unknown domains in this context
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-slate-200 text-slate-400">
                                        No Image
                                    </div>
                                )}
                                {typeof provider.rating === 'number' && (
                                    <Badge className="absolute top-3 right-3 bg-white/90 text-slate-900 backdrop-blur-md shadow-sm">
                                        ⭐ {provider.rating}
                                    </Badge>
                                )}
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
                                    {provider.contact ? (
                                        <Button size="sm" className="rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-md" asChild>
                                            <a href={`tel:${provider.contact}`}>
                                                <Phone className="w-3.5 h-3.5 mr-2" />
                                                Call
                                            </a>
                                        </Button>
                                    ) : (
                                        <Button size="sm" disabled className="rounded-full bg-slate-200 text-slate-400">
                                            <Phone className="w-3.5 h-3.5 mr-2" />
                                            Call
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500">
                        {providers.length === 0
                            ? "Transit data under preparation"
                            : `No rentals found for ${filter}`
                        }
                    </p>
                </div>
            )}
        </div>
    );
}
