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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
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
            router.push('/dashboard/planner?welcome=true');
        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'Failed to login';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Box - Image & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
                <Image
                    src="/images/hero-bg.jpg"
                    alt="Pondicherry Coast"
                    fill
                    className="object-cover opacity-60 mixture-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/80 to-blue-900/50" />
                <div className="relative z-10 flex flex-col justify-between p-16 h-full text-white">
                    <div>
                        <Link href="/" className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                            TrekBuddy
                        </Link>
                    </div>
                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold leading-tight">
                            Your journey to the <br />
                            <span className="text-cyan-400">French Riviera</span> <br />
                            starts here.
                        </h1>
                        <p className="text-lg text-slate-300 max-w-md">
                            Plan your trip, discover hidden gems, and explore Puducherry like a local with our AI-powered guide.
                        </p>
                    </div>
                    <div className="text-sm text-slate-400">
                        © 2026 TrekBuddy Tourism. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Box - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
                <Card className="w-full max-w-md border-none shadow-none bg-transparent">
                    <CardHeader className="space-y-2 px-0">
                        <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back</CardTitle>
                        <CardDescription className="text-slate-500 text-base">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 bg-white dark:bg-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="/forgot-password" className="text-sm font-medium text-cyan-600 hover:text-cyan-500">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11 bg-white dark:bg-slate-900"
                                />
                            </div>
                            <Button type="submit" className="w-full h-11 text-base bg-cyan-600 hover:bg-cyan-700 text-white" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="px-0 flex flex-col space-y-4">
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-50 dark:bg-slate-950 px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full h-11" type="button">
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                            Google
                        </Button>
                        <p className="text-center text-sm text-muted-foreground mt-4">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-cyan-600 hover:underline font-medium">
                                Create an account
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
