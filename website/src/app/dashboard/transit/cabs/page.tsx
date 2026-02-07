'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Phone, MapPin, Clock, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

const CAB_TYPES = [
    {
        id: 'auto',
        name: 'Auto Rickshaw',
        description: 'Classic three-wheeler for short trips',
        icon: '🛺',
        baseRate: '₹30',
        perKm: '₹15/km',
        availability: '24/7',
        bookingMethod: 'Hail on street or call',
        tips: 'Negotiate fare before starting. Meter rarely used.'
    },
    {
        id: 'bike-taxi',
        name: 'Bike Taxi',
        description: 'Quick two-wheeler rides',
        icon: '🏍️',
        baseRate: '₹20',
        perKm: '₹10/km',
        availability: '6 AM - 11 PM',
        bookingMethod: 'Rapido app or local stands',
        tips: 'Helmets provided. Best for solo travelers.'
    },
    {
        id: 'city-taxi',
        name: 'City Taxi / Cab',
        description: 'Comfortable car rides',
        icon: '🚕',
        baseRate: '₹100',
        perKm: '₹18/km',
        availability: '24/7',
        bookingMethod: 'Call local operators or Ola/Uber',
        tips: 'AC cabs available. Book in advance for airport trips.'
    }
];

const LOCAL_OPERATORS = [
    { name: 'Pondy Cabs', phone: '+91 9876543210', specialty: 'Airport transfers' },
    { name: 'French Town Autos', phone: '+91 9876543211', specialty: 'City tours' },
    { name: 'Auroville Taxi Service', phone: '+91 9876543212', specialty: 'Auroville trips' }
];

export default function CabsPage() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl space-y-8">
            <DashboardHeader
                title="Cabs & Autos"
                subtitle="On-demand local transport in Puducherry"
                backHref="/dashboard/transit"
                backLabel="Transit"
            />

            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-900/30">
                    <Car className="w-6 h-6 text-cyan-600" />
                </div>
            </div>

            {/* Cab Types */}
            <div className="grid gap-6">
                {CAB_TYPES.map((cab, index) => (
                    <motion.div
                        key={cab.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    <div className="text-5xl">{cab.icon}</div>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{cab.name}</h3>
                                            <p className="text-slate-500 dark:text-slate-400">{cab.description}</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <IndianRupee className="w-4 h-4 text-green-600" />
                                                <span className="text-slate-600 dark:text-slate-300">Base: {cab.baseRate}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-blue-600" />
                                                <span className="text-slate-600 dark:text-slate-300">{cab.perKm}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-orange-600" />
                                                <span className="text-slate-600 dark:text-slate-300">{cab.availability}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-4 h-4 text-purple-600" />
                                                <span className="text-slate-600 dark:text-slate-300">{cab.bookingMethod}</span>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                                            💡 {cab.tips}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Local Operators */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Local Operators</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {LOCAL_OPERATORS.map((operator) => (
                        <Card key={operator.name} className="border-slate-200 dark:border-slate-800">
                            <CardContent className="p-4 space-y-2">
                                <h3 className="font-semibold text-slate-900 dark:text-white">{operator.name}</h3>
                                <p className="text-sm text-slate-500">{operator.specialty}</p>
                                <a href={`tel:${operator.phone}`} className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 text-sm font-medium">
                                    <Phone className="w-4 h-4" /> {operator.phone}
                                </a>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
