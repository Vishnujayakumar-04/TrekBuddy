'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Bike, Car, Bus, Train, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { seedTransitData } from '@/services/transitService';

const TRANSIT_CATEGORIES = [
    {
        id: 'rentals',
        name: 'Vehicle Rentals',
        description: 'Self-drive bikes, cars & cycles',
        icon: Bike,
        color: 'text-orange-500',
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        types: ['Bike', 'Scooty', 'Car', 'Cycle']
    },
    {
        id: 'cabs',
        name: 'Cabs & Autos',
        description: 'On-demand local transport',
        icon: Car,
        color: 'text-cyan-500',
        bg: 'bg-cyan-50 dark:bg-cyan-900/20',
        types: ['Auto Rickshaw', 'City Taxi', 'Bike Taxi']
    },
    {
        id: 'bus',
        name: 'Bus Services',
        description: 'PRTC & Inter-state routes',
        icon: Bus,
        color: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        types: ['Local Town Bus', 'Inter-city (Chennai/Bangalore)']
    },
    {
        id: 'train',
        name: 'Train',
        description: 'Railway schedules & status',
        icon: Train,
        color: 'text-purple-600',
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        types: ['Express', 'Passenger']
    }
];

export default function TransitPage() {
    useEffect(() => {
        // Ensure data exists in Firestore for first-time users
        seedTransitData().catch(error => {
            console.error("Failed to seed transit data:", error);
        });
    }, []);

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
            <DashboardHeader
                title="Getting Around Puducherry"
                subtitle="Whether you want to rent a scooter like a local, catch a town bus, or book a cab – find all transport info right here."
                backHref="/"
                backLabel="Home"
                showHome={false}
            />

            <Badge variant="outline" className="px-4 py-1 text-sm border-cyan-500/30 bg-cyan-500/10 text-cyan-600">
                Namma Pondy Transit
            </Badge>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TRANSIT_CATEGORIES.map((category) => (
                    <Link href={`/dashboard/transit/${category.id}`} key={category.id} className="block h-full">
                        <motion.div
                            whileHover={{ y: -5 }}
                            // onHoverStart={() => setHovered(category.id)}
                            // onHoverEnd={() => setHovered(null)}
                            className="h-full"
                        >
                            <Card className="h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 overflow-hidden relative group">
                                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${category.bg.replace('50', '200')}`} />

                                <CardContent className="p-8 flex flex-col h-full relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={cn("p-4 rounded-2xl ring-1 ring-inset ring-black/5 transition-transform duration-300 group-hover:scale-110", category.bg, category.color)}>
                                            <category.icon className="w-8 h-8" />
                                        </div>
                                        <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-cyan-500 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/20 transition-colors">
                                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8 flex-1">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                                            {category.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {category.types.map((type) => (
                                            <span
                                                key={type}
                                                className="px-3 py-1 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                                            >
                                                {type}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
