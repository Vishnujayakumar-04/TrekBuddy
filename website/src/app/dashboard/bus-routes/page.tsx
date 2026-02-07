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
                    <Card className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white h-full cursor-pointer hover:shadow-xl hover:shadow-cyan-500/20 transition-all group overflow-hidden relative border-none">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                        <CardContent className="flex flex-col items-center justify-center p-8 h-full space-y-4 relative z-10">
                            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                <MapPin className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="font-bold text-xl tracking-tight">Find Nearby Stops</h3>
                                <p className="text-white/80 text-sm font-medium">Locate bus stops near you</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {filteredRoutes.map((route) => (
                    <Link key={route.id} href={`/dashboard/bus-routes/${route.id}`}>
                        <Card className="hover:border-cyan-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-lg font-bold font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 group-hover:border-cyan-500/30 transition-colors">
                                        {route.id}
                                    </div>
                                    <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${route.type === 'Intercity'
                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                        }`}>
                                        {route.type}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg line-clamp-2 leading-tight text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                        {route.name}
                                    </h3>
                                </div>

                                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                                        <span>{route.stops} Stops</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                                        <span>{route.frequency}</span>
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
