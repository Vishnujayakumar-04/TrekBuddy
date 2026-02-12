'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import {
    Umbrella, AlertTriangle, TreePine, Moon, MapPin,
    Utensils, Hotel, ShoppingBag, Clapperboard, Bus,
    ArrowRight
} from 'lucide-react';

export default function CategoriesPage() {
    const categories = [
        { id: 'beaches', name: 'Beaches', icon: Umbrella, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'Sun, sand, and sea' },
        { id: 'temples', name: 'Temples', icon: '🛕', color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Spiritual heritage' },
        { id: 'churches', name: 'Churches', icon: '⛪', color: 'text-blue-600', bg: 'bg-blue-600/10', desc: 'French architecture' },
        { id: 'museums', name: 'Museums', icon: '🏛️', color: 'text-amber-700', bg: 'bg-amber-700/10', desc: 'History & Culture' },
        { id: 'parks', name: 'Parks & Gardens', icon: TreePine, color: 'text-green-500', bg: 'bg-green-500/10', desc: 'Nature & Relaxation' },
        { id: 'heritage', name: 'Heritage Sites', icon: '🏰', color: 'text-yellow-600', bg: 'bg-yellow-600/10', desc: 'Colonial buildings' },
        { id: 'restaurants', name: 'Restaurants', icon: Utensils, color: 'text-red-500', bg: 'bg-red-500/10', desc: 'Local & French cuisine' },
        { id: 'hotels', name: 'Hotels', icon: Hotel, color: 'text-purple-500', bg: 'bg-purple-500/10', desc: 'Comfortable stays' },
        { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'text-pink-500', bg: 'bg-pink-500/10', desc: 'Souvenirs & more' },
        { id: 'nightlife', name: 'Nightlife', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-500/10', desc: 'Pubs & Bars' },
        { id: 'adventure', name: 'Adventure', icon: MapPin, color: 'text-orange-600', bg: 'bg-orange-600/10', desc: 'Be active' },
        { id: 'theatres', name: 'Theatres', icon: Clapperboard, color: 'text-red-600', bg: 'bg-red-600/10', desc: 'Movies & Entertainment' },
        { id: 'transport', name: 'Transport', icon: Bus, color: 'text-blue-400', bg: 'bg-blue-400/10', desc: 'Getting around' },
        { id: 'emergency', name: 'Emergency', icon: AlertTriangle, color: 'text-red-700', bg: 'bg-red-700/10', desc: 'Important contacts' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="container py-12">
            <div className="mb-12 text-center md:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                    Explore <span className="text-cyan-500">Categories</span>
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
                    Discover Puducherry your way. Select a category to find the best spots curated just for you.
                </p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
                {categories.map((cat) => (
                    <motion.div key={cat.id} variants={item}>
                        <Link href={`/dashboard/categories/${cat.id}`}>
                            <Card className="h-full border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden relative">
                                <div className={`absolute top-0 right-0 p-20 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${cat.bg.replace('/10', '/40')}`} />

                                <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4 relative z-10">
                                    <div className={`text-4xl p-5 rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${cat.bg} ${cat.color}`}>
                                        {typeof cat.icon === 'string' ? cat.icon : <cat.icon className="w-10 h-10" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">{cat.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{cat.desc}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-4 right-4">
                                        <ArrowRight className={`w-5 h-5 ${cat.color}`} />
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
