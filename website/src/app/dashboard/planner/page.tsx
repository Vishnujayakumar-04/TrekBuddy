'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, MapPin, MoreVertical, Trash, Edit, ArrowRight, Loader2 } from 'lucide-react';
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

import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuthContext } from '@/context/AuthContext';

interface Trip {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    places: number;
    image: string;
    userId: string;
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
            // Fallback for when index is missing or other errors
            setIsLoading(false);
            if (error.code === 'failed-precondition') {
                // Often happens if index is missing. Retry without orderBy might work or just log it.
                console.log("Likely missing index for composite query.");
            }
        });

        return () => unsubscribe();
    }, [user]);

    const handleCreateTrip = async () => {
        if (!newTripName.trim() || !user || !db) return;

        setIsCreating(true);
        try {
            await addDoc(collection(db, 'trips'), {
                name: newTripName,
                userId: user.uid,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                places: 0,
                image: '/images/hero-bg.jpg', // Default placeholder
                createdAt: serverTimestamp()
            });

            setIsCreateOpen(false);
            setNewTripName('');
            toast.success('Trip created successfully!');
        } catch (error) {
            console.error("Error creating trip:", error);
            toast.error('Failed to create trip');
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
        <div className="container py-12 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Your <span className="text-cyan-500">Adventures</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        Plan, organize, and relive your journeys in Puducherry.
                    </p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                            <Plus className="w-5 h-5 mr-2" /> Create New Trip
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create a New Trip</DialogTitle>
                            <DialogDescription>
                                Start your journey by naming your trip. You can add specific places later.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tripName">Trip Name</Label>
                                <Input
                                    id="tripName"
                                    placeholder="e.g. Summer Beach Vacation"
                                    value={newTripName}
                                    onChange={(e) => setNewTripName(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateTrip} className="bg-cyan-600 hover:bg-cyan-700" disabled={isCreating}>
                                {isCreating ? 'Creating...' : 'Create Trip'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
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
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="group border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                                <CardHeader className="p-0 relative h-48 overflow-hidden">
                                    {/* Image Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

                                    <Image
                                        src={trip.image || '/images/hero-bg.jpg'}
                                        alt={trip.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="secondary" size="icon" className="h-8 w-8 bg-black/40 text-white hover:bg-black/60 backdrop-blur-md border-none">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Edit className="w-4 h-4 mr-2" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTrip(trip.id)}>
                                                    <Trash className="w-4 h-4 mr-2" /> Delete Trip
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="absolute bottom-4 left-4 z-20 text-white">
                                        <CardTitle className="text-xl font-bold tracking-tight mb-1">{trip.name}</CardTitle>
                                        <div className="flex items-center text-xs text-slate-200 font-medium bg-black/30 backdrop-blur-md py-1 px-2 rounded-full w-fit">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {trip.startDate}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-5">
                                    <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1 text-cyan-500" />
                                            {trip.places || 0} Places planned
                                        </span>
                                        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                            2 Days
                                        </span>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-5 pt-0">
                                    <Link href={`/dashboard/planner/${trip.id}`} className="w-full">
                                        <Button className="w-full group-hover:bg-cyan-600 transition-colors" variant="outline">
                                            View Itinerary
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50"
                >
                    <div className="bg-cyan-100 dark:bg-cyan-900/30 p-6 rounded-full mb-6 text-cyan-600 dark:text-cyan-400">
                        <MapPin className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No trips planned yet</h3>
                    <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
                        Your adventure awaits! Create your first itinerary to start adding beaches, cafes, and heritage spots to your list.
                    </p>
                    <Button onClick={() => setIsCreateOpen(true)} size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        Create Your First Trip
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
