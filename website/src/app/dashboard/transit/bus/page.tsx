'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, MapPin, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { getTransitItems } from '@/services/transitService';
import { TransitItem } from '@/utils/seedTransitData';

export default function BusPage() {
    const [buses, setBuses] = useState<TransitItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function loadData() {
            setLoading(true);
            try {
                const data = await getTransitItems('bus');
                if (mounted) {
                    setBuses(data);
                    setError(null);
                }
            } catch (err: unknown) {
                if (mounted) {
                    setError((err instanceof Error) ? err.message : String(err));
                    console.error("Failed to load bus schedules:", err);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            mounted = false;
        };
    }, []);

    const localBuses = buses.filter(b => b.subCategory === 'local');
    const interBuses = buses.filter(b => b.subCategory === 'interstate');

    const renderBusCard = (bus: TransitItem) => (
        <Card key={bus.id} className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group">
            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-lg border border-cyan-200 dark:border-cyan-800">
                    {bus.id.length > 3 ? bus.id.substring(0, 3) : bus.id}
                </div>

                <div className="flex-1 min-w-0 space-y-1 w-full">
                    <h3 className="font-bold text-base md:text-lg text-slate-900 dark:text-white truncate">
                        {bus.name}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-900 dark:text-slate-200">{bus.from}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-500" />
                        <span className="font-medium text-slate-900 dark:text-slate-200">{bus.to}</span>
                    </div>

                    <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Via: {bus.via?.join(', ') || 'Direct'}
                    </p>
                </div>

                <div className="md:text-right space-y-1 w-full md:w-auto">
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                        <Clock className="w-3 h-3 mr-1.5 text-orange-500" />
                        {bus.frequency}
                    </Badge>
                    {bus.duration && (
                        <p className="text-xs text-slate-400 font-medium text-right hidden md:block">
                            Duration: {bus.duration}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl space-y-8">
            <DashboardHeader
                title="Bus Schedule"
                subtitle="Live status & timetables for Town Buses & Inter-city routes"
                backHref="/dashboard/transit"
                backLabel="Transit Hub"
            />

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                    <span className="ml-2 text-slate-500">Loading bus schedules...</span>
                </div>
            ) : error ? (
                <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                    <p>Error loading data: {error}</p>
                    <p className="text-sm mt-2">Please try refreshing the page.</p>
                </div>
            ) : (
                <Tabs defaultValue="local" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 rounded-full p-1 mb-6">
                        <TabsTrigger value="local" className="rounded-full data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-medium">
                            Town Bus (Local)
                        </TabsTrigger>
                        <TabsTrigger value="interstate" className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-medium">
                            Inter-city (Outstation)
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="local" className="space-y-4">
                        {localBuses.length > 0 ? (
                            localBuses.map(renderBusCard)
                        ) : (
                            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-slate-500">Transit data under preparation</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="interstate" className="space-y-4">
                        {interBuses.length > 0 ? (
                            interBuses.map(renderBusCard)
                        ) : (
                            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-slate-500">Transit data under preparation</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
