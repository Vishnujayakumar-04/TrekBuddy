'use client';

import { ReactNode } from 'react';
import { PageTransition } from '@/components/animations/PageTransition';
import { AIChatWidget } from '@/components/ai/AIChatWidget';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Background Elements (Static for performance) */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl" />
                <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-amber-400/5 blur-3xl" />
            </div>

            {/* Content with Page Transitions */}
            <div className="relative z-10">
                <PageTransition>
                    {children}
                </PageTransition>
                <AIChatWidget />
            </div>
        </div>
    );
}
