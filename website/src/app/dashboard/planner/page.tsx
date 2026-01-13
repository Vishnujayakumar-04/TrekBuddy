'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, MapPin, MoreVertical, Trash, Edit } from 'lucide-react';
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

// Mock Data
const MOCK_TRIPS = [
    { id: '1', name: 'Weekend in Pondy', startDate: '2024-02-10', endDate: '2024-02-12', places: 5, image: '/images/promenade.jpg' },
    { id: '2', name: 'Heritage Walk', startDate: '2024-03-05', endDate: '2024-03-05', places: 3, image: '/images/temple.jpg' },
];

export default function TripPlannerPage() {
    const [trips, setTrips] = useState(MOCK_TRIPS);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newTripName, setNewTripName] = useState('');

    const handleCreateTrip = () => {
        if (!newTripName) return;

        const newTrip = {
            id: Date.now().toString(),
            name: newTripName,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            places: 0,
            image: '/images/placeholder.jpg'
        };

        setTrips([...trips, newTrip]);
        setIsCreateOpen(false);
        setNewTripName('');
        toast.success('Trip created successfully!');
    };

    const handleDeleteTrip = (id: string) => {
        setTrips(trips.filter(t => t.id !== id));
        toast.success('Trip deleted');
    };

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Trip Planner</h1>
                    <p className="text-muted-foreground">Manage your itineraries and travel plans</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Create New Trip
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Trip</DialogTitle>
                            <DialogDescription>
                                Give your trip a name to get started. You can add places later.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="tripName" className="mb-2 block">Trip Name</Label>
                            <Input
                                id="tripName"
                                placeholder="e.g. Summer Vacation"
                                value={newTripName}
                                onChange={(e) => setNewTripName(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateTrip}>Create Trip</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {trips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <Card key={trip.id} className="group hover:shadow-md transition-all">
                            <CardHeader className="p-0 overflow-hidden rounded-t-lg relative h-40">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105"
                                    style={{ backgroundImage: `url(${trip.image})` }}
                                />
                                <div className="absolute inset-0 bg-black/30" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <CardTitle>{trip.name}</CardTitle>
                                </div>
                                <div className="absolute top-2 right-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
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
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{trip.startDate}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{trip.places} Places</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Link href={`/dashboard/planner/${trip.id}`} className="w-full">
                                    <Button variant="secondary" className="w-full">View Itinerary</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                    }
                </div >
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/30">
                    <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No trips planned yet</h3>
                    <p className="text-muted-foreground mb-6">Start planning your adventure in Puducherry today!</p>
                    <Button onClick={() => setIsCreateOpen(true)}>Create Your First Trip</Button>
                </div>
            )}
        </div >
    );
}
