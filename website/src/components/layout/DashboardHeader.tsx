'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

interface DashboardHeaderProps {
    title: string;
    subtitle?: string;
    backHref?: string;
    backLabel?: string;
    showHome?: boolean;
    children?: React.ReactNode;
}

export function DashboardHeader({
    title,
    subtitle,
    backHref,
    backLabel = 'Back',
    showHome = false,
    children
}: DashboardHeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        if (backHref) {
            router.push(backHref);
        } else {
            router.back();
        }
    };

    return (
        <div className="space-y-4 mb-8">
            {/* Navigation Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 pl-0 hover:pl-2 transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        onClick={handleBack}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {backLabel}
                    </Button>

                    {showHome && (
                        <>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                            <Button variant="ghost" size="sm" asChild className="gap-2 text-slate-600 dark:text-slate-400">
                                <Link href="/">
                                    <Home className="w-4 h-4" />
                                    Home
                                </Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Actions slot */}
                {children && (
                    <div className="flex items-center gap-2">
                        {children}
                    </div>
                )}
            </div>

            {/* Title */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
