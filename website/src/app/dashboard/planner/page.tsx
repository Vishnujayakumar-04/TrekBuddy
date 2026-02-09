'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Calendar, MapPin, MoreVertical, Trash, Edit, ArrowRight, Loader2, PlayCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { useAuthContext } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, orderBy, serverTimestamp } from 'firebase/firestore';

interface Trip {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    places: number;
    image: string;
    userId: string;
    status: string;
}

export default function TripPlannerPage() {
    const { user } = useAuthContext();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newTripName, setNewTripName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!user || !db) {
            setIsLoading(false);
            return;
        }

        const q = query(
            collection(db, 'trips'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tripData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Trip[];
            setTrips(tripData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching trips:", error);
            setIsLoading(false);
            if (error.code === 'failed-precondition') {
                console.log("Likely missing index for composite query.");
            }
        });

        return () => unsubscribe();
    }, [user]);

    const handleCreateTrip = async () => {
        if (!newTripName.trim()) {
            toast.error('Please enter a name for your trip');
            return;
        }

        if (!user || !user.uid) {
            toast.error('Please log in to create a trip');
            return;
        }

        // Optimistic UI update
        setIsCreating(true);

        try {
            // Explicitly construct payload to match Firestore rules
            // Rule: allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
            const newTripData = {
                name: newTripName.trim(),
                userId: user.uid,
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                places: 0,
                image: `https://images.unsplash.com/photo-1590487920786-89ccb2c86f2b?q=80&w=800&auto=format&fit=crop`,
                status: 'planning',
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'trips'), newTripData);

            setIsCreateOpen(false);
            setNewTripName('');
            toast.success('Trip created successfully!', {
                description: 'Ready to start planning your adventure.',
            });
        } catch (error: unknown) {
            console.error("Error creating trip:", error);
            let errorMessage = 'Failed to create trip. Please try again.';

            // @ts-expect-error - Error code handling for Firebase
            if (error?.code === 'permission-denied') {
                errorMessage = 'You do not have permission to create trips. Please sign in again.';
                // @ts-expect-error - Error code handling for Firebase
            } else if (error?.code === 'unavailable') {
                errorMessage = 'Network error. Please check your connection.';
            }

            toast.error(errorMessage);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteTrip = async (id: string) => {
        if (!confirm('Are you sure you want to delete this trip?')) return;

        try {
            if (db) {
                await deleteDoc(doc(db, 'trips', id));
                toast.success('Trip deleted');
            }
        } catch (error) {
            console.error("Error deleting trip:", error);
            toast.error('Failed to delete trip');
        }
    };

    return (
        <div className="container mx-auto py-16 px-4 space-y-12 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold tracking-wider uppercase mb-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        My Itineraries
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Adventures</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl">
                        Plan, organize, and relive your journeys in Puducherry. All your trips in one place.
                    </p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="rounded-full px-8 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 shadow-xl hover:shadow-2xl transition-all font-medium">
                            <Plus className="w-5 h-5 mr-2" /> Create New Trip
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-none shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Start a New Journey</DialogTitle>
                            <DialogDescription className="text-slate-500">
                                Give your trip a name to get started. You can add more details later.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tripName" className="text-slate-700 font-medium">Trip Name</Label>
                                <Input
                                    id="tripName"
                                    placeholder="e.g. Summer Beach Vacation 2026"
                                    value={newTripName}
                                    onChange={(e) => setNewTripName(e.target.value)}
                                    className="col-span-3 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-cyan-500"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</Button>
                            <Button onClick={handleCreateTrip} className="bg-cyan-600 hover:bg-cyan-700 px-6" disabled={isCreating}>
                                {isCreating ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                                ) : 'Create Trip'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex flex-col justify-center items-center h-64 space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
                    <p className="text-slate-400 animate-pulse">Loading your trips...</p>
                </div>
            ) : trips.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {trips.map((trip, index) => (
                        <motion.div
                            key={trip.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="group h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col">
                                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

                                    {/* Trip Image */}
                                    {trip.image ? (
                                        <img
                                            src={trip.image}
                                            alt={trip.name}
                                            className="absolute inset-0 object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                // Fallback to placeholder pulsing div which is below or siblings
                                            }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-slate-300 dark:bg-slate-700 animate-pulse group-hover:scale-110 transition-transform duration-700" />
                                    )}
                                    {/* Fallback Pulse if Image Fails or Loading - actually if img onError hides it, we need a sibling. 
                                        Let's keep the pulse BEHIND the image (z-0) or just render IMG. 
                                        The user requested: "render the stored trip image ... add a fallback to the existing placeholder when trip.image is missing or invalid"
                                        So: Render IMG. if !trip.image, render placeholder.
                                        If invalid, onError switch to placeholder?
                                        Simplest: 
                                    */}
                                    <img
                                        src={trip.image}
                                        alt={trip.name}
                                        className="absolute inset-0 object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 bg-slate-200 dark:bg-slate-800"
                                    />

                                    <div className="absolute top-3 right-3 z-20">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Edit className="w-4 h-4 mr-2" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer" onClick={() => handleDeleteTrip(trip.id)}>
                                                    <Trash className="w-4 h-4 mr-2" /> Delete Trip
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="absolute bottom-4 left-4 z-20 text-white w-full pr-4">
                                        <h3 className="text-xl font-bold tracking-tight mb-2 truncate text-shadow-sm">{trip.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center text-xs font-medium bg-white/20 backdrop-blur-md py-1 px-2.5 rounded-full border border-white/10">
                                                <Calendar className="w-3 h-3 mr-1.5" />
                                                {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="p-6 flex-1">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center text-slate-600 dark:text-slate-300">
                                            <MapPin className="w-4 h-4 mr-1.5 text-cyan-500" />
                                            <span className="font-medium">{trip.places || 0}</span>
                                            <span className="text-slate-400 ml-1">Places</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">
                                            <span>PLANNED</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-6 pt-0 mt-auto">
                                    <Button className="w-full bg-slate-50 hover:bg-cyan-50 text-slate-900 group-hover:text-cyan-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white border dark:border-slate-700 transition-colors" variant="outline" asChild>
                                        <Link href={`/dashboard/planner/${trip.id}`} className="w-full">
                                            View Itinerary
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-900/30"
                >
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-full mb-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
                        <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-full text-cyan-500">
                            <PlayCircle className="w-10 h-10" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No trips planned yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
                        Your adventure awaits! Create your first itinerary to start adding beaches, cafes, and heritage spots to your list.
                    </p>
                    <Button onClick={() => setIsCreateOpen(true)} size="lg" className="rounded-full px-8 bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/20">
                        Create Your First Trip
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
