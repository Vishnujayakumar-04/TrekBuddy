'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Train, Clock, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

const TRAIN_ROUTES = [
    {
        id: 'chennai-express',
        name: 'Puducherry Express',
        number: '16115/16116',
        from: 'Puducherry',
        to: 'Chennai Egmore',
        departure: '06:05 AM',
        arrival: '09:45 AM',
        duration: '3h 40m',
        frequency: 'Daily',
        type: 'Express',
        classes: ['2S', 'CC', 'SL']
    },
    {
        id: 'villupuram-passenger',
        name: 'Villupuram Passenger',
        number: '76851/76852',
        from: 'Puducherry',
        to: 'Villupuram Junction',
        departure: '05:45 AM',
        arrival: '06:45 AM',
        duration: '1h',
        frequency: 'Daily',
        type: 'Passenger',
        classes: ['2S']
    },
    {
        id: 'mumbai-express',
        name: 'Mumbai Express',
        number: '16352',
        from: 'Puducherry',
        to: 'Mumbai CST',
        departure: '11:30 AM',
        arrival: 'Next day 05:00 AM',
        duration: '17h 30m',
        frequency: 'Weekly (Wed)',
        type: 'Express',
        classes: ['2A', '3A', 'SL']
    },
    {
        id: 'bangalore-express',
        name: 'Bangalore Express',
        number: '16525/16526',
        from: 'Puducherry',
        to: 'KSR Bangalore',
        departure: '09:00 PM',
        arrival: 'Next day 06:30 AM',
        duration: '9h 30m',
        frequency: 'Daily',
        type: 'Express',
        classes: ['2A', '3A', 'SL', '2S']
    }
];

const STATION_INFO = {
    name: 'Puducherry Railway Station',
    code: 'PDY',
    address: 'Railway Station Road, near Botanical Garden',
    facilities: ['Waiting Room', 'Ticket Counter', 'Parking', 'Tea Stall']
};

export default function TrainPage() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl space-y-8">
            <DashboardHeader
                title="Train Services"
                subtitle="Railway schedules from Puducherry"
                backHref="/dashboard/transit"
                backLabel="Transit"
            />

            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                    <Train className="w-6 h-6 text-purple-600" />
                </div>
            </div>

            {/* Station Info */}
            <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{STATION_INFO.name}</h2>
                            <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-1">
                                <MapPin className="w-4 h-4" /> {STATION_INFO.address}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {STATION_INFO.facilities.map((f) => (
                                    <Badge key={f} variant="secondary" className="bg-white dark:bg-slate-800">{f}</Badge>
                                ))}
                            </div>
                        </div>
                        <Badge className="text-lg px-4 py-2 bg-purple-600">Station Code: {STATION_INFO.code}</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Train Routes */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Popular Routes</h2>
                <div className="grid gap-4">
                    {TRAIN_ROUTES.map((train, index) => (
                        <motion.div
                            key={train.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{train.name}</h3>
                                                <Badge variant="outline" className="text-xs">{train.number}</Badge>
                                                <Badge className={train.type === 'Express' ? 'bg-green-600' : 'bg-slate-500'}>{train.type}</Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                                                <span className="font-medium">{train.from}</span>
                                                <span className="text-slate-400">→</span>
                                                <span className="font-medium">{train.to}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4 text-cyan-600" />
                                                <span>{train.departure} - {train.arrival}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-orange-600" />
                                                <span>{train.frequency}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                {train.classes.map((c) => (
                                                    <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Book Tickets */}
            <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Book Train Tickets</h3>
                        <p className="text-slate-600 dark:text-slate-300">Book online via IRCTC or visit the station counter</p>
                    </div>
                    <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
                        <a href="https://www.irctc.co.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            Visit IRCTC <ExternalLink className="w-4 h-4" />
                        </a>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
