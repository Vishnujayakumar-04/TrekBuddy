'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import {
    Umbrella,
    TreePine,
    Moon,
    MapPin,
    Utensils,
    Hotel,
    ShoppingBag,
    Clapperboard,
    Bus,
    ArrowRight,
    Landmark,
    Church,
    Castle,
    ShieldAlert,
    Ticket
} from 'lucide-react';

export default function CategoriesPage() {
    // Professional Categories with Lucide Icons
    const categories = [
        { id: 'beaches', name: 'Beaches', icon: Umbrella, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/10', border: 'border-cyan-200 dark:border-cyan-800', desc: 'Sun, sand, and tranquility' },
        { id: 'temples', name: 'Temples', icon: Landmark, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10', border: 'border-amber-200 dark:border-amber-800', desc: 'Spiritual heritage sites' },
        { id: 'churches', name: 'Churches', icon: Church, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/10', border: 'border-indigo-200 dark:border-indigo-800', desc: 'Colonial religious architecture' },
        { id: 'museums', name: 'Museums', icon: Ticket, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/10', border: 'border-rose-200 dark:border-rose-800', desc: 'History, art, and culture' },
        { id: 'parks', name: 'Nature', icon: TreePine, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10', border: 'border-emerald-200 dark:border-emerald-800', desc: 'Botanical gardens & parks' },
        { id: 'heritage', name: 'Heritage', icon: Castle, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-900/10', border: 'border-slate-200 dark:border-slate-800', desc: 'French & Tamil quarters' },
        { id: 'restaurants', name: 'Dining', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/10', border: 'border-orange-200 dark:border-orange-800', desc: 'Cafes & fine dining' },
        { id: 'hotels', name: 'Stays', icon: Hotel, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/10', border: 'border-violet-200 dark:border-violet-800', desc: 'Resorts & guesthouses' },
        { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/10', border: 'border-pink-200 dark:border-pink-800', desc: 'Boutiques & markets' },
        { id: 'nightlife', name: 'Nightlife', icon: Moon, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10', border: 'border-purple-200 dark:border-purple-800', desc: 'Evening entertainment' },
        { id: 'adventure', name: 'Adventure', icon: MapPin, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/10', border: 'border-teal-200 dark:border-teal-800', desc: 'Activities & excursions' },
        { id: 'theatres', name: 'Cinema', icon: Clapperboard, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/10', border: 'border-red-200 dark:border-red-800', desc: 'Movies & shows' },
        { id: 'transport', name: 'Transport', icon: Bus, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-900/10', border: 'border-sky-200 dark:border-sky-800', desc: 'Bus routes & rentals' },
        { id: 'emergency', name: 'Helpline', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/10', border: 'border-red-200 dark:border-red-800', desc: 'Emergency contacts' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="container mx-auto py-16 px-4">
            <div className="mb-14 text-center md:text-left space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Discover Puducherry
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Explore by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Category</span>
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                    Navigate the city through curated collections of places, experiences, and utilities designed for the modern traveler.
                </p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
                {categories.map((cat) => (
                    <motion.div key={cat.id} variants={item} className="h-full">
                        <Link href={`/dashboard/categories/${cat.id}`} className="h-full block">
                            <Card className={`h-full border ${cat.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group bg-white dark:bg-slate-900 overflow-hidden relative rounded-xl`}>
                                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${cat.bg.replace('50', '200').replace('/10', '/30')}`} />

                                <CardContent className="flex flex-col items-start justify-between p-6 h-full relative z-10 space-y-6">
                                    <div className={`p-3.5 rounded-2xl ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform duration-300 ring-1 ring-inset ring-black/5`}>
                                        <cat.icon className="w-8 h-8" />
                                    </div>

                                    <div className="space-y-2 w-full">
                                        <div className="flex justify-between items-center w-full">
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 transition-colors">
                                                {cat.name}
                                            </h3>
                                            <ArrowRight className={`w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${cat.color}`} />
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {cat.desc}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
