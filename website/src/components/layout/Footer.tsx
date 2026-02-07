import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
                                TrekBuddy
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs text-slate-500 dark:text-slate-400">
                            Your intelligent companion for exploring the French Riviera of the East.
                            Curated experiences, AI-powered planning, and local secrets.
                        </p>
                        <div className="flex space-x-5">
                            <a href="#" className="text-slate-400 hover:text-cyan-500 transition-colors transform hover:scale-110">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-cyan-500 transition-colors transform hover:scale-110">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-cyan-500 transition-colors transform hover:scale-110">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-cyan-500 transition-colors transform hover:scale-110">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 tracking-wide">Explore</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="/dashboard/categories" className="hover:text-cyan-500 transition-colors flex items-center group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />Destinations</Link></li>
                            <li><Link href="/dashboard/planner" className="hover:text-cyan-500 transition-colors flex items-center group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />Trip Planner</Link></li>
                            <li><Link href="/dashboard/bus-routes" className="hover:text-cyan-500 transition-colors flex items-center group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />Local Transport</Link></li>
                            <li><Link href="/dashboard/chat" className="hover:text-cyan-500 transition-colors flex items-center group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />AI Guide</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 tracking-wide">Support</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="/about" className="hover:text-cyan-500 transition-colors">About Us</Link></li>
                            <li><Link href="/blog" className="hover:text-cyan-500 transition-colors">Travel Blog</Link></li>
                            <li><Link href="/privacy" className="hover:text-cyan-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-cyan-500 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/contact" className="hover:text-cyan-500 transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 tracking-wide">Stay Updated</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Get the latest hidden gems and travel tips sent to your inbox.
                        </p>
                        <div className="space-y-3">
                            <Input
                                type="email"
                                placeholder="Email address"
                                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-cyan-500"
                            />
                            <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-cyan-600 dark:hover:bg-slate-200 font-bold transition-all">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
                    <p>&copy; {new Date().getFullYear()} TrekBuddy. All rights reserved.</p>
                    <div className="flex gap-6 font-medium">
                        <Link href="/privacy" className="hover:text-cyan-500 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-cyan-500 transition-colors">Terms</Link>
                        <Link href="/sitemap" className="hover:text-cyan-500 transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
