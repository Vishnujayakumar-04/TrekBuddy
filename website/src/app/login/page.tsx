'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!auth) {
                throw new Error('Authentication service not available');
            }
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Logged in successfully!');
            // Delay redirect slightly for toast visibility and smoother transition
            setTimeout(() => {
                router.push('/dashboard/planner');
            }, 800);
        } catch (error: unknown) {
            console.error(error);
            const message = (error as Error).message || 'Failed to login';
            toast.error(message);
            setLoading(false); // Only stop loading on error, otherwise keep loading until redirect
        }
    };

    return (
        <div className="flex min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-cyan-100 selection:text-cyan-900">
            {/* Left Box - Image & Branding (50%) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1582563364956-65a25e197c38?q=80&w=2669&auto=format&fit=crop"
                    alt="Pondicherry Coast"
                    fill
                    className="object-cover opacity-60 mix-blend-overlay scale-105 animate-[zoom_20s_infinite_alternate]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950/40 to-slate-950/80" />

                <div className="relative z-10 flex flex-col justify-between p-12 xl:p-20 h-full text-white">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all border border-white/10 hover:pr-6 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Link>
                    </div>
                    <div className="space-y-8 max-w-lg">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-400/20 rounded-full text-cyan-300 text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                            Welcome Back
                        </div>
                        <h1 className="text-5xl xl:text-6xl font-black leading-tight tracking-tight drop-shadow-xl">
                            Your journey to the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-200 to-blue-300">French Riviera</span> <br />
                            starts here.
                        </h1>
                        <p className="text-lg text-slate-200/90 leading-relaxed font-light border-l-2 border-cyan-500/50 pl-6">
                            &quot;The purpose of life is to live it, to taste experience to the utmost, to reach out eagerly and without fear for newer and richer experience.&quot;
                        </p>
                    </div>
                    <div className="text-xs text-slate-400/80 flex justify-between items-center border-t border-white/10 pt-8 uppercase tracking-widest">
                        <span>© 2026 TrekBuddy</span>
                        <div className="flex gap-6">
                            <span className="hover:text-cyan-300 cursor-pointer transition-colors">Privacy</span>
                            <span className="hover:text-cyan-300 cursor-pointer transition-colors">Terms</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Box - Login Form (50%) */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16 xl:p-24 bg-white dark:bg-slate-950 relative">
                {/* Mobile Background (Absolute) - only visible on small screens */}
                <div className="lg:hidden absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1582563364956-65a25e197c38?q=80&w=2669&auto=format&fit=crop"
                        alt="Background"
                        fill
                        className="object-cover opacity-5"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-white dark:from-slate-950/90 dark:to-slate-950" />
                </div>

                <div className="w-full max-w-sm space-y-10 relative z-10">
                    <div className="text-center space-y-2">
                        <div className="inline-block p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 mb-4 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Enter your credentials to access your account.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-xl transition-all hover:bg-white dark:hover:bg-slate-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">Password</Label>
                                    <Link href="/forgot-password" className="text-xs font-semibold text-cyan-600 hover:text-cyan-500 transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-xl transition-all hover:bg-white dark:hover:bg-slate-800 pr-10"
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
                        </div>

                        <Button type="submit" className="w-full h-12 text-base font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300" disabled={loading}>
                            {loading ? (
                                <><Loader2 className="w-5 h-5 mr-2 animate-spin text-cyan-500" /> Verifying...</>
                            ) : 'Sign in'}
                        </Button>
                    </form>

                    <div className="relative my-8">
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
                        Sign in with Google
                    </Button>

                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-cyan-600 hover:text-cyan-500 font-bold hover:underline underline-offset-4 transition-colors">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
