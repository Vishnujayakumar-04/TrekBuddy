'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Train, Clock, MapPin, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { getTransitItems } from '@/services/transitService';
import { TransitItem } from '@/utils/seedTransitData';

export default function TrainPage() {
    const [transitData, setTransitData] = useState<TransitItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const data = await getTransitItems('train');
                setTransitData(data);
                setError(null);
            } catch (err: unknown) {
                console.error("Failed to load train schedules:", err);
                setError((err instanceof Error) ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const station = transitData.find(d => d.type === 'station');
    const routes = transitData.filter(d => d.type === 'route' && (d.subCategory === 'Express' || d.subCategory === 'Passenger'));

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

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                    <span className="ml-2 text-slate-500">Loading train schedules...</span>
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-500">{error}</div>
            ) : transitData.length > 0 ? (
                <>
                    {/* Station Info */}
                    {station && (
                        <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{station.name}</h2>
                                        <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-1">
                                            <MapPin className="w-4 h-4" /> {station.address}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {station.facilities?.map((f) => (
                                                <Badge key={f} variant="secondary" className="bg-white dark:bg-slate-800">{f}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    {station.code && (
                                        <Badge className="text-lg px-4 py-2 bg-purple-600">Station Code: {station.code}</Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Train Routes */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Popular Routes</h2>
                        <div className="grid gap-4">
                            {routes.map((train, index) => (
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
                                                        <Badge className={train.subCategory === 'Express' ? 'bg-green-600' : 'bg-slate-500'}>{train.subCategory || 'Train'}</Badge>
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
                                                        {train.classes?.map((c) => (
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
                </>
            ) : (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500">Transit data under preparation</p>
                </div>
            )}

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
