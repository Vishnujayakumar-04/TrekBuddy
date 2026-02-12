import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent inline-block">
                            TrekBuddy
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs">
                            Your intelligent companion for exploring the French Riviera of the East.
                            Crafted with ❤️ for Puducherry tourism.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-6">Explore</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/dashboard/categories" className="hover:text-cyan-500 transition-colors">Destinations</Link></li>
                            <li><Link href="/dashboard/planner" className="hover:text-cyan-500 transition-colors">Trip Planner</Link></li>
                            <li><Link href="/dashboard/bus-routes" className="hover:text-cyan-500 transition-colors">Local Transport</Link></li>
                            <li><Link href="/dashboard/chat" className="hover:text-cyan-500 transition-colors">AI Guide</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-6">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/about" className="hover:text-cyan-500 transition-colors">About Us</Link></li>
                            <li><Link href="/blog" className="hover:text-cyan-500 transition-colors">Travel Blog</Link></li>
                            <li><Link href="/privacy" className="hover:text-cyan-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-cyan-500 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-6">Socials</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-cyan-500 transition-colors">Instagram</a>
                            <a href="#" className="hover:text-cyan-500 transition-colors">Twitter</a>
                            <a href="#" className="hover:text-cyan-500 transition-colors">LinkedIn</a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} TrekBuddy. Made with Next.js & Firebase.</p>
                </div>
            </div>
        </footer>
    );
}
