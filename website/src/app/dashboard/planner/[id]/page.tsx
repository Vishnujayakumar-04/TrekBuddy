'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Calendar, MapPin, GripVertical, Trash2, PlusCircle, Share2, Loader2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthContext } from '@/context/AuthContext';
import { toast } from 'sonner';

interface TripItem {
    id: string;
    placeName: string;
    category: string;
    time: string;
    status: 'visited' | 'pending';
}

interface Trip {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    places: number;
    userId: string;
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function TripDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const { user } = useAuthContext();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [items, setItems] = useState<TripItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchTrip() {
            if (!user || !db) return;

            try {
                const docRef = doc(db, 'trips', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.userId !== user.uid) {
                        setError('You do not have permission to view this trip.');
                        setLoading(false);
                        return;
                    }

                    setTrip({ id: docSnap.id, ...data } as Trip);

                    // Initialize empty items
                    setItems([]);

                } else {
                    setError('Trip not found.');
                }
            } catch (err) {
                console.error("Error fetching trip:", err);
                setError('Failed to load trip details.');
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchTrip();
        } else if (!user && !loading) {
            // If authentication finished and no user
            setLoading(false);
        }
    }, [id, user, loading]);

    const handleDelete = async (itemId: string) => {
        // Placeholder for future delete logic
        setItems(items.filter(i => i.id !== itemId));
        toast.info("Item removed (simulated)");
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div className="container py-8 flex flex-col items-center justify-center h-[50vh] text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Error</h2>
                <p className="text-muted-foreground mb-6">{error || 'Trip not found'}</p>
                <Link href="/dashboard/planner">
                    <Button>Back to Planner</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-12 max-w-5xl">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 hover:bg-transparent transition-all text-slate-500 hover:text-cyan-600" asChild>
                    <Link href="/dashboard/planner">
                        <ArrowLeft className="w-4 h-4" /> Back to All Trips
                    </Link>
                </Button>
                <Button variant="outline" className="gap-2 border-slate-200 dark:border-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-600">
                    <Share2 className="w-4 h-4" /> Share Itinerary
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Trip Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-none shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur ring-1 ring-slate-200 dark:ring-slate-800">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                {trip.name}
                            </CardTitle>
                            <CardDescription className="flex flex-col gap-3 mt-4 text-base">
                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Calendar className="w-4 h-4 text-cyan-500" />
                                    <span>{trip.startDate} — {trip.endDate}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <MapPin className="w-4 h-4 text-cyan-500" />
                                    <span>Puducherry, India</span>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-cyan-50 dark:bg-cyan-950/30 rounded-xl border border-cyan-100 dark:border-cyan-900/50">
                                <p className="text-sm text-cyan-700 dark:text-cyan-300 font-medium">Trip Status</p>
                                <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-100 mt-1">{items.length} Places</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Itinerary */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Daily Itinerary</h2>
                        <Button size="sm" className="gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 rounded-full px-4">
                            <PlusCircle className="w-4 h-4" /> Add Place
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {items.length > 0 ? items.map((item) => (
                            <Card key={item.id} className="group border-none shadow-sm hover:shadow-md transition-all bg-white dark:bg-slate-800">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                                        <GripVertical className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{item.placeName}</h3>
                                        <div className="flex items-center gap-3 text-sm text-slate-500">
                                            <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200">{item.category}</Badge>
                                            <span>{item.time}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
                                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                                    <MapPin className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No places added yet</h3>
                                <p className="text-slate-500 max-w-xs mt-2 text-sm">Start building your itinerary by adding places from the Categories page or using the AI guide.</p>
                                <Button variant="link" className="mt-4 text-cyan-600">Browse Categories</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
