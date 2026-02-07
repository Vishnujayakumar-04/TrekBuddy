'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { LoadingScreen } from './LoadingScreen';
import { motion, AnimatePresence } from 'framer-motion';

export function AppLoader({ children }: { children: React.ReactNode }) {
    const { loading } = useAuthContext();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        // Minimum display time for splash screen to prevent flashing
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2000); // 2 seconds minimum for the full "premium" feel

        return () => clearTimeout(timer);
    }, []);

    const isLoading = loading || showSplash;

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="splash-screen"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100]"
                    >
                        <LoadingScreen />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {children}
            </div>
        </>
    );
}
