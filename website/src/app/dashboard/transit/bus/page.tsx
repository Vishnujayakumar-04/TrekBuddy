
'use client';

// import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

const TOWN_BUSES = [
    { route: '1A', from: 'New Bus Stand', to: 'Gorimedu', via: 'Jipmer, Lawspet', freq: '10 min' },
    { route: '3', from: 'Old Bus Stand', to: 'Ariyankuppam', via: 'Mission St', freq: '15 min' },
    { route: '7B', from: 'Muthialpet', to: 'Railway Station', via: 'Gandhi Beach', freq: '20 min' },
];

const INTERCITY_BUSES = [
    { dest: 'Chennai (ECR)', type: 'PRTC / TNSTC', freq: 'Every 15 mins', duration: '3.5 hrs' },
    { dest: 'Bangalore', type: 'KSRTC / Private', freq: 'Hourly', duration: '7 hrs' },
    { dest: 'Villupuram', type: 'Local Shuttle', freq: 'Every 10 mins', duration: '1 hr' },
];

export default function BusPage() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl space-y-8">
            <DashboardHeader
                title="Bus Schedule"
                subtitle="PRTC Town Buses & Inter-city connectivity"
                backHref="/dashboard/transit"
                backLabel="Transit"
            />

            <Tabs defaultValue="town" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 rounded-full p-1 mb-6">
                    <TabsTrigger value="town" className="rounded-full data-[state=active]:bg-cyan-500 data-[state=active]:text-white transition-all">Town Bus (Local)</TabsTrigger>
                    <TabsTrigger value="intercity" className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">Inter-city (Outstation)</TabsTrigger>
                </TabsList>

                <TabsContent value="town" className="space-y-4">
                    {TOWN_BUSES.map((bus) => (
                        <Card key={bus.route} className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-lg border border-cyan-200 dark:border-cyan-800">
                                    {bus.route}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                        {bus.from} <ArrowRight className="w-3 h-3 text-slate-400" /> {bus.to}
                                    </div>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">Via: {bus.via}</p>
                                </div>
                                <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 whitespace-nowrap">
                                    <Clock className="w-3 h-3 mr-1" /> {bus.freq}
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="intercity" className="space-y-4">
                    {INTERCITY_BUSES.map((bus) => (
                        <Card key={bus.dest} className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                        to {bus.dest}
                                    </h3>
                                    <p className="text-sm text-slate-500">{bus.type}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                                        {bus.freq}
                                    </Badge>
                                    <p className="text-xs text-slate-400 font-medium">{bus.duration}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
