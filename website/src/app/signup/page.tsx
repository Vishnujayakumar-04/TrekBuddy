'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        if (!auth || !db) {
            toast.error('Authentication service not available');
            return;
        }

        setLoading(true);

        try {
            // 1. Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update display name
            await updateProfile(user, { displayName: name });

            // 3. Create user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                displayName: name,
                photoURL: '',
                createdAt: serverTimestamp(),
                preferences: { language: 'en', theme: 'light' },
                savedPlaces: [],
                visitedPlaces: []
            });

            toast.success('Account created successfully!');
            router.push('/dashboard/planner?welcome=true');
        } catch (error: unknown) {
            console.error(error);
            const message = (error as Error).message || 'Failed to create account';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-cyan-100 selection:text-cyan-900">
            {/* Left Box - Image & Branding (50%) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2669&auto=format&fit=crop"
                    alt="Pondicherry Architecture"
                    fill
                    className="object-cover opacity-60 mix-blend-overlay scale-105 animate-[zoom_25s_infinite_alternate]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/40 to-slate-950/80" />

                <div className="relative z-10 flex flex-col justify-between p-12 xl:p-20 h-full text-white">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all border border-white/10 hover:pr-6 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Link>
                    </div>
                    <div className="space-y-8 max-w-lg">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-400/20 rounded-full text-blue-300 text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                            Join Community
                        </div>
                        <h1 className="text-5xl xl:text-6xl font-black leading-tight tracking-tight drop-shadow-xl">
                            Unlock the best of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Puducherry</span> <br />
                            today.
                        </h1>
                        <p className="text-lg text-slate-200/90 leading-relaxed font-light border-l-2 border-cyan-500/50 pl-6">
                            Create your free account to access AI-powered itineraries, save your favorite spots, and sync your travel plans across devices.
                        </p>
                    </div>
                    <div className="text-xs text-slate-400/80 flex justify-between items-center border-t border-white/10 pt-8 uppercase tracking-widest">
                        <span>© 2026 TrekBuddy</span>
                    </div>
                </div>
            </div>

            {/* Right Box - Signup Form (50%) */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16 xl:p-24 bg-white dark:bg-slate-950 relative">
                {/* Mobile Background (Absolute) */}
                <div className="lg:hidden absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2669&auto=format&fit=crop"
                        alt="Background"
                        fill
                        className="object-cover opacity-5"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-white dark:from-slate-950/90 dark:to-slate-950" />
                </div>

                <div className="w-full max-w-sm space-y-8 relative z-10">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create an account</h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            Start planning your dream trip in seconds.
                        </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="e.g. Alex Toutou"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-xl transition-all hover:bg-white dark:hover:bg-slate-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-xl transition-all hover:bg-white dark:hover:bg-slate-800"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Min 6 chars"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-xl pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300 font-medium">Confirm</Label>
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Repeat"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 text-base font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 mt-2" disabled={loading}>
                            {loading ? (
                                <><Loader2 className="w-5 h-5 mr-2 animate-spin text-cyan-500" /> Creating Account...</>
                            ) : 'Sign Up'}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-white dark:bg-slate-950 px-4 text-slate-400 font-medium">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl gap-3 transition-all hover:border-slate-300 dark:hover:border-slate-700" type="button">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign up with Google
                    </Button>

                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-cyan-600 hover:text-cyan-500 font-bold hover:underline underline-offset-4 transition-colors">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
