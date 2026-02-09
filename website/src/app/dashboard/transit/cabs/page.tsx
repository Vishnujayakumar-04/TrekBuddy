'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Phone, MapPin, Clock, IndianRupee, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { getTransitItems } from '@/services/transitService';
import { TransitItem } from '@/utils/seedTransitData';

export default function CabsPage() {
    const [transitData, setTransitData] = useState<TransitItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const data = await getTransitItems('cabs');
                setTransitData(data);
                setError(null);
            } catch (err: unknown) {
                console.error("Failed to load cab services:", err);
                setError((err instanceof Error) ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const cabTypes = transitData.filter(d => d.type === 'service');
    const operators = transitData.filter(d => d.type === 'operator');

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

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                    <span className="ml-2 text-slate-500">Loading cab services...</span>
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-500">{error}</div>
            ) : transitData.length > 0 ? (
                <>
                    {/* Cab Types */}
                    {cabTypes.length > 0 ? (
                        <div className="grid gap-6">
                            {cabTypes.map((cab, index) => (
                                <motion.div
                                    key={cab.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                                <div className="text-5xl">{cab.image || '🚕'}</div> {/* Using image field as emoji/icon placeholder */}
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
                                                    {cab.tips && (
                                                        <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                                                            💡 {cab.tips}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">No cab types available</div>
                    )}

                    {/* Local Operators */}
                    {operators.length > 0 && (
                        <div className="space-y-4 pt-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Local Operators</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                {operators.map((operator) => (
                                    <Card key={operator.id} className="border-slate-200 dark:border-slate-800">
                                        <CardContent className="p-4 space-y-2">
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{operator.name}</h3>
                                            <p className="text-sm text-slate-500">{operator.specialty}</p>
                                            <a href={`tel:${operator.contact}`} className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 text-sm font-medium">
                                                <Phone className="w-4 h-4" /> {operator.contact}
                                            </a>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500">Transit data under preparation</p>
                </div>
            )}
        </div>
    );
}
