'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';

// Mock Data
const BUS_ROUTES = [
    { id: '1A', name: 'New Bus Stand to Gorimedu', stops: 12, frequency: '10 mins', type: 'Town Bus' },
    { id: '1B', name: 'New Bus Stand to Jipmer', stops: 10, frequency: '15 mins', type: 'Town Bus' },
    { id: '3A', name: 'Old Bus Stand to Ariyankuppam', stops: 14, frequency: '12 mins', type: 'Town Bus' },
    { id: '7B', name: 'Muthialpet to Railway Station', stops: 8, frequency: '20 mins', type: 'Town Bus' },
    { id: 'Che', name: 'Chennai Interface', stops: 0, frequency: '30 mins', type: 'Intercity' },
];

export default function BusRoutesPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRoutes = BUS_ROUTES.filter(route =>
        route.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-8 max-w-4xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bus Routes</h1>
                    <p className="text-muted-foreground">Find local transportation in Puducherry</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search route no. or destination"
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/dashboard/bus-routes/map">
                    <Card className="bg-primary text-primary-foreground h-full cursor-pointer hover:shadow-lg transition-all group">
                        <CardContent className="flex flex-col items-center justify-center p-8 h-full space-y-4">
                            <MapPin className="w-12 h-12 group-hover:scale-110 transition-transform duration-300" />
                            <div className="text-center">
                                <h3 className="font-bold text-xl">Find Nearby Stops</h3>
                                <p className="text-primary-foreground/80 text-sm">Locate bus stops near you</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {filteredRoutes.map((route) => (
                    <Link key={route.id} href={`/dashboard/bus-routes/${route.id}`}>
                        <Card className="hover:border-primary cursor-pointer transition-colors h-full">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="bg-muted px-3 py-1 rounded text-lg font-bold font-mono">
                                        {route.id}
                                    </div>
                                    <div className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                        {route.type}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg line-clamp-2 leading-tight">{route.name}</h3>
                                </div>

                                <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {route.stops} Stops
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {route.frequency}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
