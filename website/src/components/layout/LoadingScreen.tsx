'use client';

import { motion } from 'framer-motion';

export function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950">
            <div className="relative flex flex-col items-center">
                {/* Logo Pulse */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-24 h-24 mb-8"
                >
                    <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
                    <div className="relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/30 text-white text-3xl font-bold">
                        TB
                    </div>
                </motion.div>

                {/* Text */}
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-white tracking-tight"
                >
                    TrekBuddy
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-400 text-sm mt-2"
                >
                    Discovering Puducherry...
                </motion.p>
            </div>
        </div>
    );
}
