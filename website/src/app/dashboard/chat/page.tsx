'use client';

import { Card } from '@/components/ui/card';
import { Bot, MapPin, Coffee, Compass } from 'lucide-react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

export default function AIChatPage() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl space-y-8">
            <DashboardHeader
                title="AI Travel Assistant"
                subtitle="Your personal guide to Puducherry is always available."
                backHref="/"
                backLabel="Home"
            />

            <Card className="p-8 border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Bot className="w-8 h-8 text-white" />
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Your AI Guide is ready!
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        The chat assistant is now available on every page. Look for the floating icon in the bottom-right corner.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 text-left">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <MapPin className="w-5 h-5 text-cyan-500 mb-3" />
                        <h3 className="font-semibold mb-1">Local Tips</h3>
                        <p className="text-xs text-slate-500">Instant answers about beaches, ashrams, and heritage sites.</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <Coffee className="w-5 h-5 text-orange-500 mb-3" />
                        <h3 className="font-semibold mb-1">Food Guide</h3>
                        <p className="text-xs text-slate-500">Discover the best cafes, French bakeries, and street food.</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <Compass className="w-5 h-5 text-indigo-500 mb-3" />
                        <h3 className="font-semibold mb-1">Trip Planning</h3>
                        <p className="text-xs text-slate-500">Get custom itineraries and transport advice instantly.</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
