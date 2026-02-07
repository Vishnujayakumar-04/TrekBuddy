'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    MapPin, Star, Clock, Ticket, Globe, Share2, Heart, Plus, Map as MapIcon, ArrowLeft, Camera
} from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Mock data
const PLACE_DATA = {
    id: '1',
    name: 'Promenade Beach',
    category: 'Beaches',
    rating: 4.5,
    reviews: 1240,
    location: 'White Town, Puducherry',
    description: 'Promenade Beach is the popular stretch of beachfront in the city of Puducherry, India, along the Bay of Bengal.',
    longDescription: `
    The Promenade Beach is the pride of Puducherry and stretches for approximately 1.5 km. 
    It is a wonderland for travelers and has some of the most magnificent landmarks like the War Memorial, 
    statue of Joan of Arc and the heritage town hall. 
    
    The beach is clean and well maintaned, perfect for evening walks and watching the sunrise. 
    Vehicle movement is banned on the beach road in the evening, making it safe for pedestrians.
  `,
    images: [
        '/images/promenade.jpg',
        '/images/promenade-2.jpg',
        '/images/promenade-3.jpg',
    ],
    timings: 'Open 24 hours',
    entryFee: 'Free',
    coordinates: { lat: 11.936, lng: 79.834 }
};

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function PlaceDetailPage({ params }: PageProps) {
    const { id } = use(params);

    // In real app: fetch place from Firebase using id
    const place = PLACE_DATA;
    // const [isFavorite, setIsFavorite] = useState(false); // Can't use state in async component directly if server component, but this file is 'use client' at top?
    // Ah, 'use client' at top makes the whole file a client component.
    // But Next.js App Router pages are Server Components by default unless 'use client'.
    // However, I need interactivity (Save button). 
    // Best practice: Make a separate Client Component for the interactive parts or the whole page.
    // Since I put 'use client' at the top, `async` component export is not supported for page in Client Component.
    // I need to remove `async` or make it a Server Component and import a Client Component.

    // Let's refactor: separate Client Component `PlaceDetailView`.
    // For now, I'll keep it simple: strict Client Component pattern.

    return <PlaceDetailView id={id} place={place} />;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PlaceDetailView({ id, place }: { id: string, place: typeof PLACE_DATA }) {
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? 'Removed from favorites' : 'Saved to favorites');
    };

    const addToTrip = () => {
        toast.success('Added to trip planner');
    };

    return (
        <div className="container py-8 max-w-5xl">
            {/* Breadcrumb / Back */}
            {/* Breadcrumb / Back */}
            <div className="mb-6">
                <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all" asChild>
                    <Link href="/dashboard/categories">
                        <ArrowLeft className="w-4 h-4" /> Back to Explore
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Header */}
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight mb-2">{place.name}</h1>
                                <div className="flex items-center text-muted-foreground gap-4">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" /> {place.location}
                                    </span>
                                    <Badge variant="secondary">{place.category}</Badge>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md font-bold text-lg">
                                    <Star className="w-4 h-4 fill-yellow-600 mr-1" />
                                    {place.rating}
                                </div>
                                <span className="text-xs text-muted-foreground mt-1">{place.reviews} reviews</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="aspect-video bg-muted rounded-xl overflow-hidden relative group">
                        <Image
                            src={place.images[0]}
                            alt={place.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="secondary" size="sm" className="absolute bottom-4 right-4 gap-2">
                                    <Camera className="w-4 h-4" /> View Gallery
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl w-full h-[80vh] p-0 overflow-hidden bg-black">
                                {/* Full screen gallery logic would go here */}
                                <div className="w-full h-full flex items-center justify-center text-white">
                                    Gallery Placeholder
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">About</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {place.longDescription}
                        </p>
                    </div>

                    {/* Map */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Location</h2>
                        <div className="h-64 bg-muted rounded-xl flex items-center justify-center border font-mono text-sm text-muted-foreground">
                            Map Component Integration ({place.coordinates.lat}, {place.coordinates.lng})
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="sticky top-24 space-y-6">
                        {/* Action Card */}
                        <div className="border rounded-xl p-6 shadow-sm space-y-4 bg-card">
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant={isFavorite ? "secondary" : "default"}
                                    className={`w-full gap-2 ${isFavorite ? 'text-red-500 bg-red-50 hover:bg-red-100' : ''}`}
                                    onClick={toggleFavorite}
                                >
                                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                                    {isFavorite ? 'Saved' : 'Save'}
                                </Button>
                                <Button variant="outline" className="w-full gap-2">
                                    <Share2 className="w-4 h-4" /> Share
                                </Button>
                            </div>
                            <Button className="w-full gap-2" size="lg" onClick={addToTrip}>
                                <Plus className="w-4 h-4" /> Add to Trip Plan
                            </Button>
                            <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
                                <MapIcon className="w-4 h-4" /> Get Directions
                            </Button>
                        </div>

                        {/* Info Card */}
                        <div className="border rounded-xl p-6 shadow-sm space-y-4 bg-card">
                            <h3 className="font-semibold mb-2">Visitor Info</h3>

                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Timings</p>
                                    <p className="text-sm text-muted-foreground">{place.timings}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <Ticket className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Entry Fee</p>
                                    <p className="text-sm text-muted-foreground">{place.entryFee}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <Globe className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Website</p>
                                    <a href="#" className="text-sm text-primary hover:underline">Official Website</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
