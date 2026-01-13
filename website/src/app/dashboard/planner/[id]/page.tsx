'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Calendar, MapPin, GripVertical, Trash2, PlusCircle, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
// import { Badge } from '@/components/ui/badge'; // Duplicate removed
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; 
// Note: DnD libraries often have issues with React 18 strict mode or SSR. 
// For this verifying step, we will build a simple list interface that *looks* like it can be ordered, 
// or implement a basic array move.

// Mock Data
const TRIP_DETAILS = {
    id: '1',
    name: 'Weekend in Pondy',
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    items: [
        { id: 'p1', placeName: 'Promenade Beach', category: 'Beaches', time: '06:00 AM', status: 'visited' },
        { id: 'p2', placeName: 'Manakula Vinayagar Temple', category: 'Temples', time: '09:00 AM', status: 'pending' },
        { id: 'p3', placeName: 'Cafe Xtasi', category: 'Food', time: '01:00 PM', status: 'pending' },
        { id: 'p4', placeName: 'Auroville', category: 'Places', time: '04:00 PM', status: 'pending' },
    ]
};

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function TripDetailPage({ params }: PageProps) {
    const { id } = use(params);

    // In real app, fetch trip by ID
    const initialTrip = { ...TRIP_DETAILS, id: id === '1' ? '1' : id };

    return <TripDetailView trip={initialTrip} />;
}

function TripDetailView({ trip }: { trip: typeof TRIP_DETAILS }) {
    const [items, setItems] = useState(trip.items);

    const handleDelete = (itemId: string) => {
        setItems(items.filter(i => i.id !== itemId));
    };

    return (
        <div className="container py-8 max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <Link href="/dashboard/planner">
                    <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Back to Trips
                    </Button>
                </Link>
                <Button variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" /> Share Itinerary
                </Button>
            </div>

            <div className="space-y-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-3xl mb-2">{trip.name}</CardTitle>
                                <CardDescription className="flex items-center gap-4 text-base">
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {trip.startDate} - {trip.endDate}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Puducherry</span>
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="text-lg px-3 py-1">{items.length} Places</Badge>
                        </div>
                    </CardHeader>
                </Card>

                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Itinerary</h2>
                    <Button size="sm" className="gap-2">
                        <PlusCircle className="w-4 h-4" /> Add Place
                    </Button>
                </div>

                <div className="space-y-3">
                    {items.map((item) => (
                        <Card key={item.id} className="group hover:border-primary/50 transition-colors">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{item.placeName}</h3>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                                        <span>{item.time}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(item.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                    {items.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                            <p>No places added yet.</p>
                            <Button variant="link">Browse Places</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
